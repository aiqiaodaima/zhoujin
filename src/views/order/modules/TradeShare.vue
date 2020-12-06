/**
  确认交易份额
 */
<template>
  <!-- <a-card style="margin-top: 12px" :bordered="false"> -->
    <a-table 
    :columns="tradeShareColumns" 
    :dataSource="tradeShare" 
    rowKey="id" row  
    :scroll="{ x: 1500 }"
    >
      <template  v-for="(col, i) in ['payAmt','fee','tranAmtFc','tranPrice']" :slot="col"  slot-scope="text, record, index">
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
      <template  v-for="(col1, i) in ['trxContractNo']" :slot="col1"  slot-scope="text, record, index">
        <a-input
          :disabled="disabled || record.status != status || tranTypeCode=='INV02'"
          :key='col1'
          style="margin: -5px 0"
          placeholder="请输入"
          :value="text"
          @change="e => handleChange(e.target.value,col1,index)"
          @blur="handleBlur"
        />
      </template>
      <template v-for="(columns, j) in ['payDt','tranDt','expireDt']" :slot="columns"  slot-scope="text, record, index">
        <a-date-picker
          :key="j"
          :disabled="disabled || record.status != status"
          style="margin: -5px 0;width:130px"
          :value="text ? moment(text) : null"
          @change="(mom,string) => handleChange(string,columns,index)"
        />
      </template>
      <template slot="tradeShareOpt" slot-scope="text, record, index" v-if="!disabled">
        <div class="editable-row-operations" v-if="record.status == status">
          <span>
            <a @click="tradeSuccessOrFail(index)"> 交易成功</a>
            <a-divider type="vertical" />
            <!-- <a @click="tradeSuccessOrFail(index,true)"> 交易失败</a> -->
            <a-popconfirm title="确定交易失败吗?" @confirm="tradeSuccessOrFail(index,true)">
              <a>交易失败</a>
            </a-popconfirm>
          </span>
        </div>
      </template>
    </a-table>
  <!-- </a-card> -->
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import dictMixin from '@mixins/dictMixin'
import moment from 'moment'
import { checkRepeatContractNo } from '@/api/BiApi'
import { formatAmt } from '@utils/util'
export default {
  name: "TradeShare",
  mixins:[dictMixin],
  data() {
    return {
      tradeShareColumns: [
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
          title:'子账户名称',
          width:150,
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
          title:'资金交收金额',
          width:120,
          dataIndex: 'payAmt',
          // scopedSlots: { customRender: 'payAmt' }
          customRender:function(t,r,i){
            return formatAmt(t,2)
          }
        },
        {
          title:'资金交收日期',
          dataIndex: 'payDt',
          width:150,
          scopedSlots: { customRender: 'payDt' }
        },
        // {
        //   title:'手续费金额',
        //   dataIndex: 'fee',
        //   width:100,
        //   scopedSlots: { customRender: 'fee' }
        // },
        {
          title:'产品购买合同号',
          dataIndex: 'trxContractNo',
          width:120,
          scopedSlots: { customRender: 'trxContractNo' }
        },
        {
          title:'实际成交金额',
          dataIndex: 'tranAmtFc',
          width:120,
          // scopedSlots: { customRender: 'tranAmtFc' }
          customRender:function (t,r,index) {
            if(t){
              return formatAmt(t,2)
            } else {
              return formatAmt(r.payAmt,2)
            }
          }
        },
        {
          title:'成交份额',
          dataIndex: 'tranUnit',
          width:120,
          customRender:function(t,r,i){
            return formatAmt(((+r.payAmt)/(+r.tranPrice)),2)
          }
        },
        {
          title:'成交单位价格',
          dataIndex: 'tranPrice',
          width:120,
          scopedSlots: { customRender: 'tranPrice' }
        },
        {
          title:'投资起息日',
          dataIndex: 'tranDt',
          width:150,
          scopedSlots: { customRender: 'tranDt' }
        },
        {
          title:'投资到期日',
          dataIndex: 'expireDt',
          width:150,
          scopedSlots: { customRender: 'expireDt' }
        },
        // {
        //   title: '操作',
        //   dataIndex: 'tradeShareOpt',
        //   width: 150,
        //   fixed: 'right',
        //   scopedSlots: { customRender: 'tradeShareOpt' },
        // }
      ],
      selectionRows: [],
      isRepeatContractNo: false
      // tradeShare:[],
    }
  },
  components: {
  
  },
  computed: {
    ...mapState("order", [
      "prjectInfoList","cusAccInfoList","status"
    ]),
  },
  props: {
    tradeShare:{
      default(){
        return []
      }
    },
    disabled: {
      default: false
    },
    tranTypeCode: {
      default: 'INV01'
    }
  },
  methods: {
    ...mapActions("order",["getPrjectInfoList","getCusAccInfoList"]),
    moment,
    tradeSuccessOrFail(index,isFail) {
      const tradeShare = [this.tradeShare[index]]
      this.$emit('tradeSuccessOrFail', tradeShare,isFail)
    },
    handleChange(val,col,index) {
      this.tradeShare[index][col] = val
      // 输入成交单位价格计算成交份额
      if(col == 'tranPrice'){
        const payAmt =  this.tradeShare[index]['payAmt']
        this.tradeShare[index]['tranUnit'] = ((+payAmt)/(+val)).toFixed(2)
      }
    },
    async handleBlur(e){
      if(e.target.value){
        const res = await checkRepeatContractNo({ trxContractNo: e.target.value })
        if(res.success){
          let count = 0
          this.tradeShare.forEach(item=>{
            if(item.trxContractNo == e.target.value){
             count++
            }
            if(count>1){
              this.$message.warning('产品购买合同号重复')
              return
            }
          })
        }
      }
    }
  },
  created(){
    this.getPrjectInfoList()
  }
}
</script>
<style lang="stylus" scoped>
  @import '~@assets/less/common.less'

</style>