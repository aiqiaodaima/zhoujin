/**
  资金来源保险
  fundSource:[],//资金来源
  fundSourceItem:{
    editable: true, //是否编辑状态
    isNew: true,//是否新增
    prjCode:'',
    accNo: '',
    totalAmt: '--',
    updateDate: '--',
    savingBal:'--',
    flowDateStr: '--',
    planTranAmt:'',
    key:new Date().getTime(),
    odrCode: ''
  },
 */
<template>
  <a-card size="small" title="资金来源" style="margin-top: 12px" :bordered="false">
    <a-form-model ref="counterPartyForm" :model="form" :rules="rules">
      <a-row>
        <a-col :span="12">
          <BiFormItemSelect :disabled="disabled" :options="policys"  label="保险合同" name="insuranceContractId"  
          v-model="form.insuranceContractId"  showSearch customKey="id" customVal="insContractName" @change="changePartyCode"
          @deselect="deselect" @select="select" mode="multiple"/>
        </a-col>
      </a-row>
    </a-form-model>
    <a-table :columns="columns" :dataSource="fundSource" rowKey="insuranceContractId" row :scroll="{ x: 1200 }" :pagination='false'>
      <template slot="accNo" slot-scope="text, record, index">
        <BiFormItemSelect v-if='!disabled' :options="record.subSccount" customKey="accNo" customVal="accName" label="子账户名称" name="accNo"  customStyle="width:100%"
          :value="text" @change="changeAccCode($event,index)"  showSearch :isForm="false"  placeholder="请选择"/>
        <template v-else>{{ getDictNameByCode(record.subSccount,text,'accNo','accName') }}</template>
      </template>
      
      <template v-for="(col1, i) in ['tranDt', 'premiumDueDate',]" :slot="col1"  slot-scope="text, record, j">
        <a-date-picker
          :key="col1"
          v-if="record.editable"
          :disabled="disabled"
          style="margin: -5px 0;width:130px"
          :value="text ? moment(text) : null"
          @change="(mom,str) => handleChangeChild(str,col1,index,j)"
        />
        <template v-else>{{ text }}</template>
      </template>
      <template v-if="!disabled" slot="fundSourceOpt" slot-scope="text, record, index">
        <div class="editable-row-operations">
          <span >
            <a-popconfirm title="确定删除吗?" @confirm="() => fundSourceDel(index)">
              <a>删除</a>
            </a-popconfirm>
          </span>
        </div>
      </template>
      <a-table
        slot="expandedRowRender"
        slot-scope="record,index"
        :columns="innerColumns"
        :data-source="record.beneficiaryInformationList"
        rowKey="beneficiaryName"
        :pagination='false'
      >
        <template  v-for="(co, i) in ['transactionAmount']" :slot="co"  slot-scope="text, recordchild, j">
          <BiInputCapitalAmount
            :disabled="disabled"
            :key='co'
            :value="text"
            @change="e => handleChangeChild(e,co,index,j)"
          />
        </template>
        <template  v-for="(col, i) in ['principalAmount','incomeAmount']" :slot="col"  slot-scope="text, recordchild, j">
          <BiInputCapitalAmount
            :disabled="disabled"
            :key='col'
            :value="text"
            v-if='record.valuationType=="不估值"'
            @change="e => handleChangeChild(e,col,index,j)"
          />
          <template v-else>--</template>
        </template>
        <template  v-for="(col1, i) in ['shareHeldByBeneficiary','amountHeldByBeneficiary','amountBlockedByBeneficiary']" :slot="col1"  slot-scope="text, recordchild, j">
          <template v-if='record.modeOfBeneficialRight == "份额制"'>{{formatAmt(text,2)}} </template>
          <template v-else>--</template>
        </template>
        <template  v-for="(col2, i) in ['amountAvailable']" :slot="col2"  slot-scope="text, recordchild, j">
          <template v-if='record.modeOfBeneficialRight == "份额制" && record.valuationType == "估值"'>{{formatAmt(text,2)}} </template>
          <template v-else>--</template>
        </template>
      </a-table>
     
    </a-table>
   
  </a-card>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import dictMixin from '@mixins/dictMixin'
import { getPolicyInformation,insuranceContract,getSourceOfFunds } from '@/api/BiApi'
import vueBus from '@/utils/vueBus';
import moment from 'moment'
import { formatAmt } from '@utils/util'

export default {
  name: "FundSourceInsure",
  mixins:[dictMixin],
  data() {
    return {
      //所有key的列
      fundSourceColumns: [
        {
          title: '序号',
          dataIndex: '',
          key:'rowIndex',
          width:70,
          align:"center",
          customRender: (t,r,index)=> {
            return parseInt(index)+1;
          }
        },
        {
          title:'保险合同',
          width:120,
          dataIndex: 'insuranceContract',
          // scopedSlots: { customRender: 'insContractName' }
        },
        {
          title:'投保人',
          width:120,
          dataIndex: 'policyHolder',
          scopedSlots: { customRender: 'policyHolder' }
        },
         {
          title:'子账户',
          width:180,
          dataIndex: 'accNo',
          scopedSlots: { customRender: 'accNo' }
        },
         {
          title:'估值类型',
          width:120,
          dataIndex: 'valuationType',
          // customRender: (t) => {
          //  return this.getDictNameByCode(this.dicts.VOA_TYPE,t)
          // }
        },
         {
          title:'受益权模式',
          width:120,
          dataIndex: 'modeOfBeneficialRight',
          // customRender: (t) => {
          //  return this.getDictNameByCode(this.dicts.BNF_MODE,t)
          // }
        },
        {
          title:'保费应缴日',
          width:150,
          dataIndex: 'premiumDueDate',
          scopedSlots: { customRender: 'premiumDueDate' }
        },
        {
          title:'保费应缴金额',
          width:150,
          dataIndex: 'amountOfPremiumPayable',
          customRender:function(t,r,i){
            return formatAmt(t,2)
          }
        },
         {
          title:'系统可用余额(更新日期)',
          width:200,
          dataIndex: 'totalAmt',
          customRender: function(t,r,index){
            return `${formatAmt(r.queryCapitalAviAmtDto.totalAmt,2)} (${r.queryCapitalAviAmtDto.updateDate||'--'})`
          }
        },
       {
          title:'专户现金余额(更新日期)',
          width:200,
          dataIndex: 'savingBal',
          customRender: function(t,r,index){
            return `${r.bankCardBalanceDto && formatAmt(r.bankCardBalanceDto.savingBal,2) || 0.00} (${r.bankCardBalanceDto && r.bankCardBalanceDto.flowDateStr||'--'})`
          }
        },
        {
          title:'本金金额',
          dataIndex: 'principalAmount',
          width:120,
          customRender:function(t,r,i){
            return r.valuationType == "估值"? '--': formatAmt(t,2)
          }
        },
        {
          title:'收益金额',
          dataIndex: 'incomeAmount',
          width:120,
          customRender:function(t,r,i){
            return r.valuationType == "估值"? '--': formatAmt(t,2)
          }
        },
        
        {
          title:'付款账户',
          dataIndex: 'paymentAccount',
          width:200,
          scopedSlots: { customRender: 'paymentAccount' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 120,
          // fixed: 'right',
          scopedSlots: { customRender: 'fundSourceOpt' },
        }
      ],
      innerColumns:[
         {
          title:'受益人',
          width:100,
          dataIndex: 'beneficiaryName',
          scopedSlots: { customRender: 'beneficiaryName' }
        },
         {
          title:'受益人持有份额',
          width:150,
          dataIndex: 'shareHeldByBeneficiary',
          scopedSlots: { customRender: 'shareHeldByBeneficiary' }
        },
        
        {
          title:'受益人持有金额',
          dataIndex: 'amountHeldByBeneficiary',
          width:120,
          scopedSlots: { customRender: 'amountHeldByBeneficiary' }
        },
        {
          title:'受益人已冻结金额',
          dataIndex: 'amountBlockedByBeneficiary',
          width:120,
          scopedSlots: { customRender: 'amountBlockedByBeneficiary' }
         
        },
        {
          title:'受益人可用金额',
          dataIndex: 'amountAvailable',
          width:120,
          scopedSlots: { customRender: 'amountAvailable' }
        },
        {
          title:'交易金额',
          dataIndex: 'transactionAmount',
          width:120,
          scopedSlots: { customRender: 'transactionAmount' }
        },
        {
          title:'本金金额',
          dataIndex: 'principalAmount',
          width:120,
          scopedSlots: { customRender: 'principalAmount' }
        },
        {
          title:'收益金额',
          dataIndex: 'incomeAmount',
          width:120,
          scopedSlots: { customRender: 'incomeAmount' }
        },
       
      ],
      innerItem: {
        amountAvailable: 0,//受益人可用金额
        amountBlockedByBeneficiary: 0,//受益人已冻结金额
        amountHeldByBeneficiary: 0,//受益人持有金额
        beneficiaryName: '--',//受益人
        incomeAmount: null,//收益金额
        odrCode: null,
        partyCode: '',
        priceDt: null,
        principalAmount: null, //本金金额
        shareHeldByBeneficiary: 0,//受益人持有份额
        tranPrice: null,
        tranUnit: null,
        transactionAmount: null,//交易金额
        modeOfBeneficialRight:  "大池子制"
      },
      //展示的列
      columns:[],
      // fundSource:[],
      orgCode: '',
      form: {},
      rules:{
        insuranceContractId: [
          { required: true, message: '请选择保险合同', trigger: 'change' },
        ],
      },
      // subSccount: [],//子账户列表
    }
  },
  components: {
  
  },
  computed: {
    ...mapState("order", ["cusAccInfoList","policys","cusBnfInfos"
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
        return {}
      }
    }
  },
  watch:{
    fundSourceItem: function(){
      this.initColumns()
    },
    'fundSource':{
      handler(val){
        let insuranceContractIds =  this.fundSource.map(item=>{
            return item.insuranceContractId
          })
          this.form = { insuranceContractId: insuranceContractIds.length  ? insuranceContractIds  : [] }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    moment,
    formatAmt,
    ...mapActions("order",["getPolicyInformation"]),
    changePartyCode(value){
     if(value.length == 0){
       this.fundSource.length = 0
     }
    
    },
    async select(value){

      const target = this.policys.filter(item => value === item.id)[0];
      if (target) {
        let prjCodes = target.prjCode
        this.getSourceOfFunds({insContractId:this.form.insuranceContractId.join(',')})
      }  
    },
    deselect(value){
      this.fundSource.forEach((item,i)=>{
        if(value == item.insuranceContractId){
          this.fundSource.splice(i,1)
        }
      })   
    },
    async getSourceOfFunds( param ){
      const { result } = await getSourceOfFunds(param)
        this.fundSource.length = 0
        let sourceOfFunds = result.sourceOfFunds
        sourceOfFunds.length && sourceOfFunds.forEach((item,i)=>{
          let fundSourceItem = {...item,
            accNo: item.accNo || item.subSccount[0].accNo,
          }
          if( item.beneficiaryInformationList.length == 0 ){
            fundSourceItem.beneficiaryInformationList = [{ ...this.innerItem }]
          }
          
          this.fundSource.push(fundSourceItem)
        })
    },
    fundSourceDel(index){
      this.fundSource.splice(index,1)
    },
   
    async changeAccCode(value,index){
      const target = this.fundSource[index].subSccount.filter(item => value === item.accNo)[0];
      

      if (target) {
        
        const { result } = await getSourceOfFunds({accNo:value,insContractId:this.form.insuranceContractId.join(',')})
  
        // 大池子时候默认push一行受益人
        if(result.sourceOfFunds[index].beneficiaryInformationList.length == 0){
          result.sourceOfFunds[index].beneficiaryInformationList = [{
           ...this.innerItem
          }]
        }
        this.fundSource[index] = result.sourceOfFunds[index]

        this.$set(this.fundSource[index],'accNo',value)
        this.$set(this.fundSource[index],'beneficiaryInformationList',result.sourceOfFunds[index].beneficiaryInformationList)

      }
    },
    
    changePlanTranAmt(value,index){
      this.fundSource[index].planTranAmt = value
    },
    async handleChange(value,col,index){
      this.$set(this.fundSource[index],col,value)
    },
    async handleChangeChild(value,col,index,j){
      this.$set(this.fundSource[index].beneficiaryInformationList[j],col,value)
    },
    initColumns(){
      const cols = this.fundSourceColumns.filter(item => {
        if(item.key =='rowIndex'|| item.dataIndex=='action'){
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
    this.getDict('VOA_TYPE,BNF_MODE')
    this.initColumns()
    // 监听orgCode变化
    this.$bus.$on('orgCode',(orgCode)=>{
      this.orgCode = orgCode
      this.fundSource.length = 0
      this.form = {}
    })
  
  }
}
</script>
<style lang="stylus" scoped>

</style>