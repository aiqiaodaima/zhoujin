/**
  资金来源仅展示，没操作和新增
  fundSource:[],//资金来源
  fundSourceItem:{
    prjCode:'',
    accNo: '',
    totalAmt: '--',
    updateDate: '--',
    savingBal:'--',
    flowDateStr: '--',
    tranAmt:'',
    key:new Date().getTime(),
    odrCode: ''
  },
 */
<template>
  <a-card size="small" title="资金来源" style="margin-top: 12px" :bordered="false">
    <a-table :columns="columns" :dataSource="fundSource" rowKey="accNo" row :scroll="{ x: 1300 }">
      <template  v-for="(col, i) in ['tranAmt', 'tranInv','tranUnit']" :slot="col"  slot-scope="text, record, index">
        <a-input-number
          :disabled="disabled"
          :key='col'
          style="margin: -5px 0;width:100%"
          placeholder="请输入"
          :value="text"
          :precision='2'
          :min='0'
          @change="e => handleChange(e,col,index)"
          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
          :parser="value => value.replace(/\$\s?|(,*)/g, '')"
        />
      </template>
    </a-table>
   
  </a-card>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import dictMixin from '@mixins/dictMixin'
import { queryCapitalAviAmt } from '@/api/BiApi'
import vueBus from '@/utils/vueBus';
import { formatAmt } from '@utils/util'

export default {
  name: "FundSourceShow",
  mixins:[dictMixin],
  data() {
    return {
      //所有key的列
      fundSourceColumns: [
        {
          title:'子账户名称',
          width:120,
          dataIndex: 'accName',
          scopedSlots: { customRender: 'accName' }
        },
        {
          title:'受益权模式',
          width:90,
          dataIndex: 'bnfModeName',
          scopedSlots: { customRender: 'bnfModeName' }
        },
        {
          title:'受益人',
          width:90,
          dataIndex: 'bnfName',
          scopedSlots: { customRender: 'bnfName' }
        },
        {
          title:'系统可用余额(更新日期)',
          width:200,
          dataIndex: 'totalAmt',
          customRender: function(t,r,index){
            return `${formatAmt(r.totalAmt)} (${r.updateDate})`
          }
       
        },
        // {
        //   title:'专户现金余额(更新日期)',
        //   width:200,
        //   dataIndex: 'savingBal',
        //   customRender: function(t,r,index){
        //     return `${r.savingBal} (${r.flowDateStr})`
        //   }
        // },
        {
          title:'子账户剩余收益金额',
          dataIndex: 'profitAmt',
          width:150,
          customRender: function(t,r,index){
            return `${formatAmt(r.profitAmt)}`
          }
        },
        {
          title:'受益人持有金额（含在途）',
          dataIndex: 'bnfAccAmt',
          width:150,
          customRender: function(t,r,index){
            return (r.bnfMode == 'P' ? '--' : `${formatAmt(r.bnfAccAmt)}`)
          }
        },
        {
          title:'子账户信托份额',
          dataIndex: 'accTotalUnit',
          width:150,
          customRender: function(t,r,index){
            return `${formatAmt(r.accTotalUnit)}`
          }
        },
        {
          title:'受益人持有份额',
          dataIndex: 'bnfTotalUnit',
          width:150,
          customRender: function(t,r,index){
            return (r.bnfMode == 'P' ? '--' : `${formatAmt(r.bnfTotalUnit)}`)
          }
        },
        {
          title:'受益人可用金额',
          dataIndex: 'bnfAvaSaving',
          width:150,
          customRender: function(t,r,index){
            return  (r.bnfMode == 'P' ? '--' : `${formatAmt(r.bnfAvaSaving)}`)
          }
        },
        {
          title:'子账户信托单位净值（日期）',
          width:200,
          dataIndex: 'tranPrice',
          customRender: function(t,r,index){
            return `${r.tranPrice} (${r.priceDt})`
          }
        },
        {
          title:'交易金额',
          dataIndex: 'tranAmt',
          width:150,
          scopedSlots: { customRender: 'tranAmt' }
        },
        {
          title:'交易份额',
          dataIndex: 'tranUnit',
          width:150,
          scopedSlots: { customRender: 'tranUnit' }
        },
        {
          title:'本金金额',
          dataIndex: 'tranInv',
          width:150,
          scopedSlots: { customRender: 'tranInv' }
        },
        {
          title:'收益金额',
          dataIndex: 'pfitInv',
          width:120,
          customRender: function(t,r,index){
            return `${formatAmt(r.pfitInv)}`
          }
          // scopedSlots: { customRender: 'pfitInv' }
        },
      ],
      //展示的列
      columns:[],
      proCode: '',
      voaType:'' ,//估值类型
    }
  },
  components: {
  
  },
  computed: {
    ...mapState("order", [
      "prjectInfoList","cusAccInfoList",
    ]),
  },
  props: {
    disabled:{
      default: false
    },
    // 资金来源数据
    fundSource: {
      default() {
        return []
      }
    },
    //一个资金来源
    fundSourceItem: {
      default() {
        return {

        }
      }
    }
  },
  watch: {
    fundSourceItem:{
      handler(val){
        this.initColumns()
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    ...mapActions("order",["getPrjectInfoList","getCusAccInfoList"]),
  
  
    handleChange(value,col,index){
      //针对估值项目，资金来源的交易金额需要做校验 voaType== 1估值 3不估值
        let {bnfAvaSaving,bnfAccAmt,totalAmt} = this.fundSource[index]
        let min = Math.min(+bnfAvaSaving,+bnfAccAmt,+totalAmt)
      if( col == 'tranAmt' ){
        //估值
        if(this.voaType == 1){
          // U份额制 P大池子
          if(this.fundSource[index].bnfMode == 'U'){
            if(+value>min){
              this.$message.warning('交易金额不能超过受益人可用金额，受益人持有金额，子账户可用现金余额的最小值')
              return 
            }
            
          } else {
            if(+value>totalAmt){
              this.$message.warning('交易金额不能超过子账户可用现金余额')
              return 
            }
          }
        } else{
        //不估值
          if(+value>totalAmt){
            this.$message.warning('交易金额不能超过子账户可用现金余额')
            return 
          }
          this.fundSource[index]['pfitInv'] = (+value) - (+this.fundSource[index]['tranInv']||0)
        }
      }
      // 本金金额
      if( col == 'tranInv' ){
          // U份额制 P大池子
        if(this.fundSource[index].bnfMode == 'U'){
          if(+value>bnfAccAmt){
            this.$message.warning('本金金额不能超过受益人持有金额')
            return 
          }
          
        } else {
          if(+value>totalAmt){
            this.$message.warning('本金金额不能超过子账户可用现金余额')
            return 
          }
        }
       
        if(this.fundSource[index]['tranAmt']){
          this.fundSource[index]['pfitInv'] = (+this.fundSource[index]['tranAmt']) - (+value) 
        }
      }
      this.$set(this.fundSource[index],col,value)
     
    },
    initColumns(){
      const cols = this.fundSourceColumns.filter(item => {
        if(item.key =='rowIndex'){
          return true;
        }
        if (this.fundSourceItem.hasOwnProperty(item.dataIndex)) {
          return true;
        }
        return false;
      })
      this.columns =  cols;
    },
  },
  created(){
    this.initColumns()
    // 监听项目的估值类型变化 voaType：1为估值
    this.$bus.$on('voaType',(voaType)=>{
      this.voaType = voaType
      // 估值
      // if(voaType==1){
      //   this.columns = [...this.fundSourceColumns.slice(0,7)]
      // } else {
      //   this.columns = [...this.fundSourceColumns]
      // }
    })
  }
}
</script>
<style lang="stylus" scoped>

</style>