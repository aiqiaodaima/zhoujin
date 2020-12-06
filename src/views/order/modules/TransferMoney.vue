/**
  费用支付
  确认划款和取消订单
  请核对流水确认划款,可删除，不能单条划款和单条取消交易
  handleUpdate:更新订单详情信息
 */
<template>
  <!-- <a-card style="margin-top: 12px" :bordered="false"> -->
    <div>
      <a-table :columns="columns" :dataSource="transferMoney" rowKey="odrCode" row >
        <template  v-for="(col, i) in ['tranAmt', 'transferFee']" :slot="col"  slot-scope="text, record, index">
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
        <template v-for="(cl, i) in ['tranDt', 'dealDt']" :slot="cl"  slot-scope="text, record, index">
          <a-date-picker
            :key="cl"
            :disabled="disabled || record.status != status"
            style="margin: -5px 0;width:130px"
            :value="text ? moment(text) : null"
            @change="(mom,str) => handleChange(str,cl,index)"
          />
        </template>
        <template slot="capitalSrc" slot-scope="text, record, index">
          <BiFormItemSelect :options="dicts.FEE_SRC"  name="capitalSrc"  customStyle="width:100px"
            :value="text" @change="handleChange($event,'capitalSrc',index)"  showSearch :isForm="false" v-if="record.editable" placeholder="请选择"/>
          <template v-else>{{ getDictNameByCode(dicts.FEE_SRC,text) }}</template>
        </template>
        <template slot="transferMoneyOpt" slot-scope="text, record, index" v-if="!disabled">
          <div class="editable-row-operations" v-if="record.status == status">
            <span v-if='record.capitalSrc !== "5"'>
              <a @click="match(record)" v-if='needMap=="Y"'>钩稽</a>
              <!-- <a-divider type="vertical" v-if='needMap=="Y"'/>
              <a-popconfirm title="确定删除吗?" @confirm="del(record,index)">
                <a>删除</a>
              </a-popconfirm> -->
              <!-- <a @click="handleTransferMoney(index)">确认划款</a>
              <a-divider type="vertical" /> -->
              <!-- <a @click="handleTransferMoney(index)">交易失败</a> -->
              <!-- <a-popconfirm title="确定取消订单吗?" @confirm="handleTransferMoney(index,true)">
                <a>取消订单</a>
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
  <!-- </a-card> -->
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import dictMixin from '@mixins/dictMixin'
import moment from 'moment'
import { formatAmt } from '@utils/util'
import MatchFlow from '@views/fundFlow/MatchFlow'
import { fundFlowSwitchStatus,findSumMapAmt } from '@/api/BiApi'

export default {
  name: "TransferMoney",
  mixins:[dictMixin],
  data() {
    return {
      transferMoneyColumns: [
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
            return `${formatAmt(r.yhkye,2)} (${r.yhkyegxsj})`
          }
        },
        {
          title:'受益人',
          width:150,
          dataIndex: 'partyName',
          scopedSlots: { customRender: 'partyName' }
        },
        {
          title:'收款账户',
          width:200,
          dataIndex: 'accOpenBank',
          customRender: function(t,r,index){
            return `${r.accName||'--'} |${r.accNo||'--'}|${r.accOpenBank||'--'}`
          }
        },
        
        {
          title:'成交日',
          width:90,
          dataIndex: 'dealDt',
          scopedSlots: { customRender: 'dealDt' }
        },
        {
          title:'交易金额',
          width:90,
          dataIndex: 'tranAmt',
          // scopedSlots: { customRender: 'tranAmt' }
          customRender:function(t,r,i){
            return t?formatAmt(t,2):formatAmt(r.planTranAmt,2)
          }
        },
        {
          title:'交易日期',
          dataIndex: 'tranDt',
          width:90,
          scopedSlots: { customRender: 'tranDt' }
        },
        {
          title:'资金来源',
          dataIndex: 'capitalSrc',
          width:120,
          scopedSlots: { customRender: 'capitalSrc' }
        },
       {
          title:'付款账户-户名',
          dataIndex: 'payAccName',
          width:120
        },
        {
          title:'付款账户-账号',
          dataIndex: 'payAccNo',
          width:120
        },
        {
          title:'付款账户-开户行',
          dataIndex: 'payAccOpenBank',
          width:120
        },
        {
          title:'手续费金额',
          dataIndex: 'transferFee',
          width:90,
          scopedSlots: { customRender: 'transferFee' }
        },
        {
          title:'已钩稽金额',
          dataIndex: 'mappedAmt',
          width:90,
          customRender:function(t,r,i){
            return formatAmt(t,2)
          }
          // scopedSlots: { customRender: 'mappedAmt' }
        },
        {
          title: '操作',
          dataIndex: 'transferMoneyOpt',
          width: 90,
          scopedSlots: { customRender: 'transferMoneyOpt' },
        }
      ],
      columns:[],
      // transferMoney:[],
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
    transferMoney:{
      default(){
        return []
      }
    },
    transferMoneyItem: {
      default(){
        return {
          refContractNo:'',
          accName:'',
          totalAmt:'',
          savingBal:'',
          tranAmt:'',
          tranDt:'',
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
    handleTransferMoney(index,isFail) {
      const transferMoney = [this.transferMoney[index]]
      this.$emit('handleTransferMoney', transferMoney,isFail)
    },
    handleChange(val,col,index){
      this.transferMoney[index][col] = val
    },
    initColumns(){
      const cols = this.transferMoneyColumns.filter(item => {
        if(item.key =='rowIndex'|| item.dataIndex=='transferMoneyOpt'){
          return true;
        }
        if (this.transferMoneyItem.hasOwnProperty(item.dataIndex)) {
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
    this.getDict('FEE_SRC')
  }
}
</script>
<style lang="stylus" scoped>

</style>