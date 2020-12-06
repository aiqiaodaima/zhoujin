/**
  请核对流水确认划款,可删除，不能单条划款和单条取消交易
  handleUpdate:更新订单详情信息
 */
<template>
  <div>
    <a-table :columns="columns" :dataSource="flowTransfer" rowKey="odrCode" row >
      <template  v-for="(col, i) in ['payAmt', 'transferFee']" :slot="col"  slot-scope="text, record, index">
        <a-input-number
          :disabled="disabled"
          :key='col'
          style="margin: -5px 0"
          placeholder="请输入"
          :value="text"
          :min = '1'
          @change="e => handleChange(e,col,index)"
        />
      </template>
      <template  slot="payDt"  slot-scope="text, record, index">
        <a-date-picker
          :disabled="disabled"
          style="margin: -5px 0;width:130px"
          placeholder="请选择资金交收日期"
          :value="text ? moment(text) : null"
          @change="e => handleChange(e,'payDt',index)"
        />
      </template>
      <template slot="flowTransferOpt" slot-scope="text, record, index" v-if="!disabled">
        <div class="editable-row-operations">
          <span>
            <a @click="match(record)" v-if='needMap=="Y"'>钩稽</a>
            <!-- <a-divider type="vertical" v-if='needMap=="Y"'/>
            <a-popconfirm title="确定删除吗?" @confirm="del(record,index)">
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
import { fundFlowSwitchStatus,findSumMapAmt } from '@/api/BiApi'
import { formatAmt } from '@utils/util'

export default {
  name: "FlowTransfer",
  mixins:[dictMixin],
  data() {
    return {
      flowTransferColumns: [
        // {
        //   title: '序号',
        //   dataIndex: '',
        //   key:'rowIndex',
        //   width:70,
        //   align:"center",
        //   customRender:function (t,r,index) {
        //     return parseInt(index)+1;
        //   }
        // },

        {
          title:'保险合同',
          width:120,
          dataIndex: 'insuranceContract',
        },
        {
          title:'投保人',
          width:100,
          dataIndex: 'policyHolder',
        },
        {
          title:'子账户名称',
          width:120,
          dataIndex: 'accName',
          scopedSlots: { customRender: 'accName' }
        },
        {
          title:'保费应缴日期',
          width:120,
          dataIndex: 'premiumDueDate',
        },
        {
          title:'保费应缴金额',
          width:120,
          dataIndex: 'amountOfPremiumPayable',
          customRender:function (t,r,index) {
            return formatAmt(t,2)
          }
        },
        {
          title:'系统可用余额(更新日期)',
          width:200,
          dataIndex: 'zzhye',
          customRender: function(t,r,index){
            return `${formatAmt(r.zzhye,2)} (${r.zzhyegxsj})`
          }
        },
        {
          title:'专户现金余额(更新日期)',
          width:200,
          dataIndex: 'yhkye',
          customRender: function(t,r,index){
            return `${formatAmt(r.yhkye,2)} (${r.yhkyegxsj})`
          }
        },
        {
          title:'资金交收金额',
          width:100,
          dataIndex: 'payAmt',
          // scopedSlots: { customRender: 'payAmt' }
          customRender:function (t,r,index) {
            if(t){
              return formatAmt(t,2)
            } else {
              return formatAmt(r.planTranAmt,2)
            }
          }
        },
        {
          title:'资金交收日期',
          dataIndex: 'payDt',
          width:90,
          scopedSlots: { customRender: 'payDt' }
        },
        // {
        //   title:'手续费金额',
        //   dataIndex: 'transferFee',
        //   width:90,
        //   scopedSlots: { customRender: 'transferFee' }
        // },
        {
          title:'已钩稽金额',
          dataIndex: 'mappedAmt',
          width:100,
          customRender:function (t,r,index) {
            return formatAmt(t,2)
          }
        },
        // {
        //   title:'交易金额',
        //   dataIndex: 'payAmt',
        //   width:120,
        //   scopedSlots: { customRender: 'payAmt' }
        // },
        {
          title: '操作',
          dataIndex: 'flowTransferOpt',
          width: '10%',
          scopedSlots: { customRender: 'flowTransferOpt' },
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
      needMap: 'Y',
      // flowTransfer:[],
      columns:[],
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
    flowTransfer:{
      default(){
        return []
      }
    },
    flowTransferItem: {
      default(){
        return {
          accName:'',
          zzhye:'',
          yhkye:'',
          payAmt:'',
          payDt:'',
          mappedAmt:''
        }
      }
    },
    disabled: {
      default: false
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
    async del(record,index){
      let ordersBuy = {
        odrCode: record.odrCode
      }
      const { result } = await findSumMapAmt(ordersBuy)
      if(result.mapAmt > 0){
        this.$message.warning('您已勾稽流水，请撤销已勾稽流水后再进行删除！')
        return
      }
      this.flowTransfer.splice(index,1)
    },
    handleChange(val,col,index){
      // this.flowTransfer[index][col] = val
      this.$set(this.flowTransfer[index],col,val)
    },
    async handleOk(){
      this.modal.visible = false
      this.$emit('handleUpdate')
    },
    async fundFlowSwitchStatus(){
      const res = await fundFlowSwitchStatus()
      if( res.success ){
        this.needMap = res.result.paramValue
      }
    },
    initColumns(){
      const cols = this.flowTransferColumns.filter(item => {
        if(item.key =='rowIndex'|| item.dataIndex=='flowTransferOpt'){
          return true;
        }
        if (this.flowTransferItem.hasOwnProperty(item.dataIndex)) {
          return true;
        }
        return false;
      })
      this.columns =  cols;
    },
  },
  created(){
    this.initColumns()
    this.fundFlowSwitchStatus()
  }
}
</script>
<style lang="stylus" scoped>

</style>