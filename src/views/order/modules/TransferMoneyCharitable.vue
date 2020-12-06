/**
  批量操作划款
  确认划款和交易失败
  请核对流水确认划款,可删除，不能单条划款和单条取消交易
  handleUpdate:更新订单详情信息
 */
<template>
  <!-- <a-card style="margin-top: 12px" :bordered="false"> -->
    <div>
      <a-card size="small" style="margin-top: 12px" :bordered="false" title="确认划款">
        <a-row>
          <a-button v-if="!disabled" type="primary" @click="handleTransferMoney(false)" style="margin-left:40px">确认划款</a-button>
        </a-row>
        <a-table :columns="columns" :dataSource="transferMoneyTrue" rowKey="odrCode" row 
        :pagination="false"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
          <template slot="transferMoneyOpt" slot-scope="text, record, index" v-if="!disabled">
            <div class="editable-row-operations" v-if="record.status == status">
              <span>
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
      </a-card>
      <a-card size="small" style="margin-top: 12px" :bordered="false" title="未划款或划款失败"> 
        <a-row>
          <a-button v-if="!disabled" type="danger" @click="handleTransferMoney(true)" style="margin-left:40px">交易失败</a-button>
        </a-row>
        <a-table :columns="columns" :dataSource="transferMoneyFalse" rowKey="odrCode" row 
        :pagination="false"
        :rowSelection="{selectedRowKeys: selectedRowKeys1, onChange: onSelectChangeFail}">
          <template slot="transferMoneyOpt" slot-scope="text, record, index" v-if="!disabled">
            <div class="editable-row-operations" v-if="record.status == status">
            </div>
          </template>
        </a-table>
      </a-card>
    </div>
  <!-- </a-card> -->
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import dictMixin from '@mixins/dictMixin'
import biTableMixin from '@mixins/biTableMixin'
import moment from 'moment'
import { formatAmt } from '@utils/util'
import MatchFlow from '@views/fundFlow/MatchFlow'
import { fundFlowSwitchStatus,findSumMapAmt } from '@/api/BiApi'

export default {
  name: "TransferMoneyCharitable",
  mixins:[dictMixin,biTableMixin],
  data() {
    return {
      transferMoneyColumns: [
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
          title:'受益人姓名/名称',
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
          title:'交易金额',
          width:90,
          dataIndex: 'tranAmt',
          customRender:function(t,r,i){
            return formatAmt(t,2)
          }
        },
        {
          title:'付款日',
          width:90,
          dataIndex: 'actualTranDt',
        },
        {
          title:'收支金额',
          dataIndex: 'actualTranAmt',
          width:90,
          customRender:function(t,r,i){
            return formatAmt(t,2)
          }
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
          width: '10%',
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
      disableMixinCreated: true,
      selectedRowKeys1:[],
      selectionRows1:[],
      transferMoneyTrue: [],
      transferMoneyFalse: [],
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
  watch:{
    'transferMoney':{
      handler(val){
        let transferMoneyTrue = []
        let transferMoneyFalse = []
        this.transferMoney.map(item=>{
          if(item.tranAmt == item.actualTranAmt){
            transferMoneyTrue.push(item)
          } else {
            transferMoneyFalse.push(item)
          }
        })
        this.transferMoneyTrue = [...transferMoneyTrue]
        this.transferMoneyFalse = [...transferMoneyFalse]
        
      },
      immediate: true,
      deep: true
    }
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
    onSelectChangeFail(selectedRowKeys,selectionRows){
      this.selectedRowKeys1 = selectedRowKeys
      this.selectionRows1 = selectionRows
    },
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
    handleTransferMoney(isFail) {
      
      const transferMoney = isFail ? this.selectionRows1 : this.selectionRows
      if( transferMoney.length == 0 ){
        this.$message.warning('你先选择需要操作的记录')
        return 
      }
      // const transferMoney = [this.transferMoney[index]]
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
  }
}
</script>
<style lang="stylus" scoped>
  .ant-btn-danger {
    background-color: #ff4d4f !important 
  }
</style>