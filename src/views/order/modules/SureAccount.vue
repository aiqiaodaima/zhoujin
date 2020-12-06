/**
  请核对流水确认到账
 */
<template>
  <div>
    <a-table :columns="columns" :dataSource="sureAccount" rowKey="odrCode" row >
      <template  v-for="(col, i) in ['payAmt', 'transferFee']" :slot="col"  slot-scope="text, record, index">
        <a-input-number
          :disabled="disabled || record.status != status"
          :key='col'
          style="margin: -5px 0"
          placeholder="请输入"
          :value="text"
          :min='1'
          @change="e => handleChange(e,col,index)"
        />
      </template>
      <template  slot="payDt"  slot-scope="text, record, index">
        <a-date-picker
          :disabled="disabled || record.status != status"
          style="margin: -5px 0;width:130px"
          :value="text ? moment(text) : null"
          @change="(mom,str) => handleChange(str,'payDt',index)"
        />
      </template>
      <template slot="sureAccountOpt" slot-scope="text, record, index" v-if="!disabled">
        <div class="editable-row-operations" v-if="record.status == status">
          <span>
            <a @click="match(record)" v-if='needMap=="Y"'>钩稽</a>
            <a-divider type="vertical" v-if='needMap=="Y"'/>
            <a-popconfirm title="确定删除吗?" @confirm="del(record,index)">
              <a>删除</a>
            </a-popconfirm>
            <!-- <a @click="handleSureAccount(index)">确认到账</a>
            <a-divider type="vertical" /> -->
            <!-- <a @click="handleSureAccount(index)">交易失败</a> -->
            <!-- <a-popconfirm title="确定交易失败吗?" @confirm="handleSureAccount(index,true)">
              <a>交易失败</a>
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
  name: "SureAccount",
  mixins:[dictMixin],
  data() {
    return {
      sureAccountColumns: [
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
          title:'产品购买合同号',
          width:120,
          dataIndex: 'refContractNo',
          scopedSlots: { customRender: 'refContractNo' }
        },
        {
          title:'子账户名称',
          width:120,
          dataIndex: 'accName',
          scopedSlots: { customRender: 'accName' }
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
            return `${formatAmt(r.yhkye,4)} (${r.yhkyegxsj})`
          }
        },
        {
          title:'资金交收金额',
          width:90,
          dataIndex: 'payAmt',
          customRender:function (t,r,index) {
            
            return formatAmt((+r.tranPrice)*(+r.tranUnit),2)
            
          }
        },
        {
          title:'资金交收金额',
          width:90,
          dataIndex: 'incomeAmt',
          customRender:function (t,r,index) {
            return formatAmt(t,2)
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
        {
          title: '操作',
          dataIndex: 'sureAccountOpt',
          width: '10%',
          scopedSlots: { customRender: 'sureAccountOpt' },
        }
      ],
      columns:[],
      // sureAccount:[],
      modal: {
        visible: false,
        title: '流水钩稽',
        fullscreen: false,
        switchFullscreen: false,
        confirmLoading: false,
      },
      odrCode: '',
      needMap: 'Y',
    }
  },
  components: {
    MatchFlow
  },
  computed: {
    ...mapState("order", [
      "status"
    ]),
  },
  props: {
    sureAccount:{
      default(){
        return []
      }
    },
    sureAccountItem: {
      default(){
        return {
          refContractNo:'',
          accName:'',
          zzhye:'',
          yhkye:'',
          payAmt:'',
          payDt:'',
          transferFee:'',
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
    handleSureAccount(index,isFail) {
      const sureAccount = [this.sureAccount[index]]
      this.$emit('handleSureAccount', sureAccount,isFail)
    },
    handleChange(val,col,index){
      this.sureAccount[index][col] = val
    },
    initColumns(){
      const cols = this.sureAccountColumns.filter(item => {
        if(item.key =='rowIndex'|| item.dataIndex=='sureAccountOpt'){
          return true;
        }
        if (this.sureAccountItem.hasOwnProperty(item.dataIndex)) {
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