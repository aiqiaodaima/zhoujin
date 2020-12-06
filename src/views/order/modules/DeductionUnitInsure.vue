/**
  资金来源保险扣减份额
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
       <BiCol>
          <BiFormItemDatePicker :disabled="disabled" label="成交日" name="dealDt" dateFormat='YYYY-MM-DD' v-model="form.dealDt"/>
        </BiCol>
      </a-row>
    </a-form-model>
    <a-table :columns="columns" :dataSource="fundSource" rowKey="insuranceContractId" row :scroll="{ x: 1200 }" :pagination='false'>
     
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
        <template slot="tranPrice"  slot-scope="text, recordchild, j">
          <BiInputCapitalAmount
            :value="text"
            v-if='!disabled && record.valuationType=="估值"'
            @change="e => handleChangeChild(e,'tranPrice',index,j)"
            :precision='4'
          />
          <template v-else>{{ text || '--' }}</template>
        </template>
        <template slot="tranUnit"  slot-scope="text, recordchild, j">
          <BiInputCapitalAmount
            :value="text"
            v-if='!disabled'
            @change="e => handleChangeChild(e,'tranUnit',index,j)"
          />
          <template v-else>{{ text }}</template>
        </template>
        <template v-for="(col1, i) in ['priceDt',]" :slot="col1"  slot-scope="text, recordchild, j">
          <a-date-picker
            :key="col1"
            v-if="!disabled && record.valuationType=='估值'"
            style="margin: -5px 0;width:100%"
            :value="text ? moment(text) : null"
            @change="(mom,str) => handleChangeChild(str,col1,index,j)"
          />
        <template v-else>{{ text || '--' }}</template>
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
  name: "DeductionUnitInsure",
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
          customRender: (t,r) => {
            return this.getDictNameByCode(r.subSccount,t,'accNo','accName')
          }
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
          scopedSlots: { customRender: 'amountOfPremiumPayable' }
        },
         
        // {
        //   title: '操作',
        //   dataIndex: 'action',
        //   width: 120,
        //   scopedSlots: { customRender: 'fundSourceOpt' },
        // }
      ],
      innerColumns:[
         {
          title:'受益人',
          width:100,
          dataIndex: 'beneficiaryName',
          scopedSlots: { customRender: 'beneficiaryName' }
        },
        {
          title:'子账户信托份额',
          width:150,
          dataIndex: 'accTotalUnit',
          customRender: function(t,r,index){
            return `${formatAmt(r.accTotalUnit)}`
          }
        },
         {
          title:'受益人持有份额',
          width:150,
          dataIndex: 'shareHeldByBeneficiary',
          customRender:function(t,r,i){
            return formatAmt(t,2)
          }
        },
        
        // {
        //   title:'受益人持有金额',
        //   dataIndex: 'amountHeldByBeneficiary',
        //   width:120,
        //   customRender:function(t,r,i){
        //     return formatAmt(t,2)
        //   }
        // },
        // {
        //   title:'受益人已冻结金额',
        //   dataIndex: 'amountBlockedByBeneficiary',
        //   width:120,
        //   customRender:function(t,r,i){
        //     return formatAmt(t,2)
        //   }
        // },
        // {
        //   title:'受益人可用金额',
        //   dataIndex: 'amountAvailable',
        //   width:120,
        //   customRender:function(t,r,i){
        //     return formatAmt(t,2)
        //   }
        // },
        {
          title:'交易金额',
          dataIndex: 'transactionAmount',
          width:120,
          // scopedSlots: { customRender: 'transactionAmount' }
          customRender:function(t,r,i){
            return formatAmt(t,2)
          }
        },
        {
          title:'本金金额',
          dataIndex: 'principalAmount',
          width:120,
          // scopedSlots: { customRender: 'principalAmount' }
          customRender:function(t,r,i){
            return formatAmt(t,2)
          }
        },
        {
          title:'收益金额',
          dataIndex: 'incomeAmount',
          width:120,
          // scopedSlots: { customRender: 'incomeAmount' }
          customRender:function(t,r,i){
            return formatAmt(t,2)
          }
        },
        {
          title:'净值日期',
          dataIndex: 'priceDt',
          width:130,
          scopedSlots: { customRender: 'priceDt' }
        },
        {
          title:'成交单位净值',
          dataIndex: 'tranPrice',
          width:120,
          scopedSlots: { customRender: 'tranPrice' }
        },
        {
          title:'成交份额',
          dataIndex: 'tranUnit',
          width:120,
          scopedSlots: { customRender: 'tranUnit' }
        },
       
      ],
      //展示的列
      columns:[],
      // fundSource:[],
      orgCode: '',
      form: {},
      rules:{
        dealDt: [
          { required: true, message: '请选择成交日', trigger: 'change' },
        ],
      },
      subSccount: [],//子账户列表
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
    
  },
  methods: {
    moment,
    ...mapActions("order",["getPolicyInformation"]),
   
    changePlanTranAmt(value,index){
      this.fundSource[index].planTranAmt = value
    },
    async handleChange(value,col,index){
      this.$set(this.fundSource[index],col,value)
    },
    async handleChangeChild(value,col,index,j){
      this.$set(this.fundSource[index].beneficiaryInformationList[j],col,value)
      // 输入成交单位价格计算成交份额
      if(col == 'tranPrice'){
        let  tranAmt =  this.fundSource[index].beneficiaryInformationList[j]['transactionAmount']
        this.fundSource[index].beneficiaryInformationList[j]['tranUnit'] = ((+tranAmt)/(+value)).toFixed(2)
      }
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
    // 监听procode变化
    this.$bus.$on('orgCode',(orgCode)=>{
      this.orgCode = orgCode
    })
  
  }
}
</script>
<style lang="stylus" scoped>

</style>