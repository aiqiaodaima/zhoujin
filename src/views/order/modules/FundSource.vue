/**
  资金来源认购
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
    odrCode: '',
    trustPrjCode,// 项目编号
  },
 */
<template>
  <a-card size="small" title="资金来源" style="margin-top: 12px" :bordered="false">
    <a-table :columns="columns" :dataSource="fundSource" rowKey="key" row :scroll="{ x: 1200 }">
      <!-- <template slot="prjCode" slot-scope="text, record, index">
        <BiFormItemSelect :options="prjectInfoList" customKey="prjCode" customVal="trustPrjName" label="项目名称" name="prjCode"  
          :value="text" @change="changePrjName($event,index)"  showSearch :isForm="false" v-if="record.editable"  placeholder="请选择"/>
        <template v-else>{{ getDictNameByCode(prjectInfoList,text,'prjCode','trustPrjName') }}</template>
      </template> -->
      <template slot="accNo" slot-scope="text, record, index">
        <BiFormItemSelect customStyle="width:200px" :options="cusAccInfoList" customKey="accNo" customVal="accName" label="子账户名称" name="accNo" 
          :value="text" @change="changeAccCode($event,index)"  showSearch :isForm="false" 
          v-if="record.editable && record.capitalSrc !=='5'" placeholder="请选择"/>
        <template v-else>{{ record.capitalSrc !=='5' ? getDictNameByCode(cusAccInfoList,text,'accNo','accName'):'--' }}</template>
      </template>
      <template slot="capitalSrc" slot-scope="text, record, index">
        <BiFormItemSelect :options="dicts.FEE_SRC"  name="capitalSrc"  customStyle="width:100px"
          :value="text" @change="handleChange($event,'capitalSrc',index)"  showSearch :isForm="false" v-if="record.editable" placeholder="请选择"/>
        <template v-else>{{ getDictNameByCode(dicts.FEE_SRC,text) }}</template>
      </template>
      <template slot="payBankCode" slot-scope="text, record, index">
        <BiFormItemSelect :options="dicts.BANK_CODE"  name="payBankCode"  customStyle="width:250px"
                          :value="text" @change="handleChange($event,'payBankCode',index)"  showSearch :isForm="false" v-if="record.editable" placeholder="请选择"/>
        <template v-else>{{ getDictNameByCode(dicts.BANK_CODE,text) }}</template>
      </template>
      <template  slot="planTranAmt" slot-scope="text, record, index">
        <!-- <a-input-number
          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
          :parser="value => value.replace(/\$\s?|(,*)/g, '')"
          v-if="record.editable"
          style="margin: -5px 0;width:100px"
          placeholder="请输入数字"
          :value="text"
          :precision='2'
          @change="changePlanTranAmt($event,index)"
        /> -->
        <BiInputCapitalAmount
          v-if="record.editable"
          customStyle="margin: -5px 0;width:100px"
          :value="text"
          @change="changePlanTranAmt($event,index)"
        />
        <template v-else>{{ fmoney(text) }}</template>
      </template>
      <template v-if="!disabled" slot="fundSourceOpt" slot-scope="text, record, index">
        <div class="editable-row-operations">
            <span v-if="record.editable">
              <a @click="() => fundSourceSave(index)">添加</a>
              <a-divider type="vertical" />
              <a @click="() => fundSourceCancel(index)">删除</a>
            </span>
          <span v-else>
            <a :disabled="editingId !== ''" @click="() => fundSourceEdit(index)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm title="确定删除吗?" @confirm="() => fundSourceDel(index)">
              <a :disabled="editingId !== ''">删除</a>
            </a-popconfirm>
          </span>
        </div>
      </template>
       <template  slot="vatAmt" slot-scope="text, record, index">
        <!-- <a-input-number
          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
          :parser="value => value.replace(/\$\s?|(,*)/g, '')"
          v-if="record.editable"
          style="margin: -5px 0;width:100px"
          placeholder="请输入数字"
          :value="text"
          :precision='2'
          @change="changePlanTranAmt($event,index)"
        /> -->
        <BiInputNumUnit
          v-if="record.editable"
          customStyle="margin: -5px 0;width:100px"
          :value="text"
          :isAfter="true"
          :disabledAfter ="true"
          :afterOptions ="['%']"
          @change="changePlanTranAmt($event,index)"
        />
        <template v-else>{{ fmoney(text) }}</template>
      </template>
    </a-table>
    <a-button v-if='!disabled' style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus" :disabled="editingId !== ''" @click="addFundSource">新增资金来源</a-button>
  </a-card>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import dictMixin from '@mixins/dictMixin'
import { queryCapitalAviAmt,findPayAccount } from '@/api/BiApi'
import vueBus from '@/utils/vueBus';
import { formatAmt } from '@utils/util'

export default {
  name: "FundSource",
  mixins:[dictMixin],
  data() {
    return {
      //所有key的列
      fundSourceColumns: [
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
        // {
        //   title:'项目名称',
        //   width:120,
        //   dataIndex: 'prjCode',
        //   scopedSlots: { customRender: 'prjCode' }
        // },
        {
          title:'子账户名称',
          width:200,
          dataIndex: 'accNo',
          scopedSlots: { customRender: 'accNo' }
        },{
          title:'项目编号',
          width:200,
          dataIndex: 'trustPrjCode',
          customRender: function(t,r,index){
            return  r.capitalSrc == '5' ? '--':t
          }
        },
        {
          title:'系统可用余额(更新日期)',
          width:200,
          dataIndex: 'totalAmt',
          customRender: function(t,r,index){
            return  r.capitalSrc == '5' ? '--':`${formatAmt(r.totalAmt,2)} (${r.updateDate})`
          }
        },
       {
          title:'专户现金余额(更新日期)',
          width:200,
          dataIndex: 'savingBal',
          customRender: function(t,r,index){
            return r.capitalSrc == '5' ? '--':`${formatAmt(r.savingBal,2)} (${r.flowDateStr})`
          }
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
          width:120,
          customRender: function(t,r,index){
            return  r.capitalSrc == '5' ? '--':t
          }
        },
        {
          title:'付款账户-账号',
          dataIndex: 'payAccNo',
          width:120,
          customRender: function(t,r,index){
            return  r.capitalSrc == '5' ? '--':t
          }
        },
        {
          title:'付款账户-开户行',
          dataIndex: 'payAccOpenBank',
          width:120,
          customRender: function(t,r,index){
            return  r.capitalSrc == '5' ? '--':t
          }
        },
        {
          title:'银行名称',
          dataIndex: 'payBankCode',
          width:300,
          scopedSlots: { customRender: 'payBankCode' }
        },
        {
          title:'交易金额',
          dataIndex: 'planTranAmt',
          width:120,
          scopedSlots: { customRender: 'planTranAmt' }
        },
         {
          title:'增值税',
          dataIndex: 'vatAmt',
          width:120,
          scopedSlots: { customRender: 'vatAmt' }
        },
         {
          title:'增值税税基',
          dataIndex: 'vatBase',
          width:120,
          scopedSlots: { customRender: 'vatBase' }
        },
         {
          title:'税金及附加-城建税',
          dataIndex: 'eduTax',
          width:120,
          scopedSlots: { customRender: 'eduTax' }
        },
        {
          title:'税金及附加-教育费附加',
          dataIndex: 'urbanTax',
          width:120,
          scopedSlots: { customRender: 'urbanTax' }
        },
        {
          title:'税金及附加-地方教育费附加',
          dataIndex: 'localEduTax',
          width:120,
          scopedSlots: { customRender: 'localEduTax' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 110,
          fixed: 'right',
          scopedSlots: { customRender: 'fundSourceOpt' },
        }
      ],
      //展示的列
      columns:[],
      // fundSource:[],
      editingId:'',
      proCode: '',
    }
  },
  components: {
  
  },
  // inject:['counterParty'],
  computed: {
    ...mapState("order", [
      "prjectInfoList","cusAccInfoList",
    ]),
  },
  props: {
    disabled:{
      default: false
    },
    // 是否关联产品
    hasProCode:{
      default: true
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
    },
    // 是否初始化获取所有子账户列表
    getCusAccFlag:{
      default: true
    },
  },
  watch:{
    fundSourceItem: function(){
      this.initColumns()
    }
  },
  methods: {
    ...mapActions("order",["getPrjectInfoList","getCusAccInfoList"]),
    fmoney(amt,decimals=2){
      return formatAmt(amt,decimals);
    },
    addFundSource(){
      if( !this.proCode && this.hasProCode ){
        this.$message.warning('请先选择资产名称')
        return
      }
      this.fundSource.push({ ...this.fundSourceItem,key: new Date().getTime()})
      this.editingId = this.fundSource.length;
    },
    fundSourceEdit(index) {
      let target = this.fundSource[index]
      target.editable = !target.editable
      this.editingId = index;
    },
    fundSourceSave(index) {
      let target = this.fundSource[index]
      target.editable = false
      target.isNew = false
      this.editingId = '';
    },
    fundSourceCancel(index) {
      let target = this.fundSource[index]
      target.editable = false
      this.editingId = '';
      this.fundSourceDel(index)
    },
    fundSourceDel(index){
      this.fundSource.splice(index,1)
      this.editingId = '';
    },
    changePrjName(value,index){
      const target = this.prjectInfoList.filter(item => value === item.prjCode)[0];
      if (target) {
        this.fundSource[index].prjCode = value
        this.getCusAccInfoList({prjCode:value,imStyle:1})
      }
    },
    async changeAccCode(value,index){
      const target = this.cusAccInfoList.filter(item => value === item.accNo)[0];
      if (target) {
        this.fundSource[index].accNo = value
        this.fundSource[index].accName = target.accName
        this.fundSource[index].prjCode = target.prjCode
        this.fundSource[index].trustPrjCode = target.trustPrjCode

        const { result } = await queryCapitalAviAmt({prjCode:target.prjCode,accNo:value,proCode:this.proCode})
        this.fundSource[index].totalAmt = result.queryCapitalAviAmtDto && result.queryCapitalAviAmtDto.totalAmt || 0
        this.fundSource[index].updateDate = result.queryCapitalAviAmtDto && result.queryCapitalAviAmtDto.updateDate || '--'
        this.fundSource[index].savingBal = result.bankCardBalanceDto && result.bankCardBalanceDto.savingBal || 0
        this.fundSource[index].flowDateStr = result.bankCardBalanceDto && result.bankCardBalanceDto.flowDateStr || '--'

        if(this.fundSource[index].hasOwnProperty('payAccNo')){
          // 获取付款信息
          const { result } = await findPayAccount({prjCode:target.prjCode})
          this.fundSource[index].payAccName= result.loaInfo.accName
          this.fundSource[index].payAccNo= result.loaInfo.accNo
          this.fundSource[index].payAccOpenBank= result.loaInfo.accOpenBank
        }

      }
    },
    changePlanTranAmt(value,index){
      this.fundSource[index].planTranAmt = value
    },
    async handleChange(value,col,index){
      // 费用支付时候选择外部支付就没有付款账户信息
      // if( col=='capitalSrc' ){
      //   if(value == '5'){
      //     this.fundSource[index]['payAccNo'] = '--'
      //     this.fundSource[index]['payAccName'] = '--'
      //     this.fundSource[index]['payAccOpenBank'] = '--'
      //   } 
      // }
      this.fundSource[index][col] = value
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
   
    this.getPrjectInfoList()
    // 是否初始化所有的子账户
    if( this.getCusAccFlag ){
      this.getCusAccInfoList({imStyle:1})
    }
    this.getDict('FEE_SRC,BANK_CODE')

    this.initColumns()
    // 监听procode变化
    this.$bus.$on('proCode',(proCode)=>{
      this.proCode = proCode
      this.editingId = ''
    })
  }
}
</script>
<style lang="stylus" scoped>

</style>