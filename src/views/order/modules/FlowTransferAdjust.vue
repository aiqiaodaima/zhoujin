<template>
  <div>
    <a-table :columns="columns" :dataSource="flowTransferAdjust" rowKey="odrCode" row >
      <template slot="tranAmt"  slot-scope="text, record, index">
        <BiInputCapitalAmount
          :disabled="disabled"
          customStyle="margin: -5px 0;width:100%"
          placeholder="请输入"
          :value="text"
          @change="e => handleChange(e,'tranAmt',index)"
        />
      </template>
      <template v-for="(columns, j) in ['tranDt']" :slot="columns"  slot-scope="text, record, index">
        <a-date-picker
          :key="j"
          :disabled="disabled"
          style="margin: -5px 0;width:130px"
          :value="text ? moment(text) : null"
          @change="(mom,string) => handleChange(string,columns,index,text)"
        />
      </template>
      <template slot="flowTransferAdjustOpt" slot-scope="text, record, index" v-if="!disabled">
        <div class="editable-row-operations">
          <span>
            <a v-if="record.mapCapitalYN==='Y'" @click="match(record)">钩稽</a>
            <!-- <a-divider v-if="record.mapCapitalYN==='Y'" type="vertical" />
            <a-popconfirm title="确定删除吗?" @confirm="del(index)">
              <a>删除</a>
            </a-popconfirm> -->
          </span>
        </div>
      </template>
    </a-table>
    <BiModal
      :visible.sync="modal.visible"
      width="90%"
      :title="modal.title"
      :fullscreen.sync="modal.fullscreen"
      :switchFullscreen="modal.switchFullscreen"
      @handleOk='handleOk'
      @handleCancel='handleOk'
      :confirmLoading='modal.confirmLoading'
    >
      <MatchFlow v-if="modal.visible" :odrCode="odrCode"  ref="matchFlow"/>
    </BiModal>
  </div>
</template>

<script>
  import { mapState, mapActions, mapMutations } from "vuex";
  import dictMixin from '@mixins/dictMixin'
  import moment from 'moment'
  import MatchFlow from '@views/fundFlow/MatchFlow'

  export default {
    name: "flowTransferAdjust",
    mixins:[dictMixin],
    data() {
      return {
        flowTransferAdjustColumns: [
          {
            title: '序号',
            dataIndex: '',
            key:'rowIndex',
            width:70,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title:'子账户名称',
            width:120,
            dataIndex: 'accName',
            scopedSlots: { customRender: 'accName' }
          },
          {
            title:'付款日期',
            dataIndex: 'tranDt',
            width:90,
            scopedSlots: { customRender: 'tranDt' }
          },
          {
            title:'交易金额',
            dataIndex: 'tranAmt',
            width:120,
            scopedSlots: { customRender: 'tranAmt' }
          },
          {
            title:'已钩稽金额',
            dataIndex: 'mappedAmt',
            width:90,
            scopedSlots: { customRender: 'mappedAmt' }
          },
          {
            title: '操作',
            dataIndex: 'action',
            //dataIndex: 'flowTransferAdjustOpt',
            width: '10%',
            scopedSlots: { customRender: 'flowTransferAdjustOpt' },
          }
        ],
        modal: {
          visible: false,
          title: '流水钩稽',
          fullscreen: false,
          switchFullscreen: false,
          confirmLoading: false,
        },
        odrCode: '',
        // flowTransferAdjust:[],
        columns:[]
      }
    },
    components: {
      MatchFlow
    },
    computed: {
      ...mapState("order", [

      ]),
    },
    props: {
      flowTransferAdjust:{
        default(){
          return []
        }
      },
      disabled: {
        default: false
      },
      flowTransferAdjustItem: {
        default() {
          return {}
        }
      }
    },
    watch:{
      flowTransferAdjustItem: function(){
        this.initColumns()
      }
    },
    methods: {
      ...mapActions("order",["handMatch"]),
      moment,
      match(record) {
        console.log(record)
        this.modal.visible = true
        this.odrCode = record.odrCode
      },
      del(index){
        this.flowTransferAdjust.splice(index,1)
      },
      handleChange(val,col,index,text){
        this.flowTransferAdjust[index][col] = val
      },
      async handleOk(){
        this.modal.visible = false
        this.$emit('handleUpdate')
      },
      initColumns(){
        const cols = this.flowTransferAdjustColumns.filter(item => {
          if(item.key =='rowIndex'|| item.dataIndex=='action'){
            return true;
          }
          if (this.flowTransferAdjustItem.hasOwnProperty(item.dataIndex)) {
            return true;
          }
          return false;
        })
        this.columns =  cols;
      }
    },
    created(){
      this.initColumns()
    }
  }
</script>

<style lang="stylus" scoped>

</style>