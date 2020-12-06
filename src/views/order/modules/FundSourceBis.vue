/**
  银行结息订单
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
    <a-table :columns="columns" :dataSource="fundSource" rowKey="key" row :scroll="{ x: 1200 }">
      <template slot="accNo" slot-scope="text, record, index">
        <BiFormItemSelect :options="cusAccInfoList" customKey="accNo" customVal="accName" label="子账户名称" name="accNo"  customStyle="width:200px"
          :value="text" @change="changeAccCode($event,index)"  showSearch :isForm="false" v-if="record.editable" placeholder="请选择"/>
        <template v-else>{{ getDictNameByCode(cusAccInfoList,text,'accNo','accName') }}</template>
      </template>
      <template slot="bnfMode" slot-scope="text">{{ getDictNameByCode(dicts.BNF_MODE,text) }}</template>
      
      <template slot="imStyle" slot-scope="text">{{ getDictNameByCode(dicts.IM_STYLE,text) }}</template>
      
      <template  slot="transactionAmount" slot-scope="text, record, index">
        <!-- <a-input-number
          v-if="record.editable"
          style="margin: -5px 0;width:100px"
          placeholder="请输入数字"
          :value="text"
          :min='1'
          :precision='2'
          @change="changeTransactionAmount($event,index)"
        /> -->
        <BiInputCapitalAmount
          v-if="record.editable"
          customStyle="margin: -5px 0;width:100px"
          :value="text"
          :min='1'
          @change="changeTransactionAmount($event,index)"
        />
        <template v-else>{{ formatAmt(text) }}</template>
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
  name: "FundSourceBis",
  mixins:[dictMixin],
  data() {
    return {
      //所有key的列
      fundSourceColumns: [
        {
          title:'子账户名称',
          width:200,
          dataIndex: 'accNo',
          scopedSlots: { customRender: 'accNo' }
        },
        {
          title:'收益权模式',
          width:120,
          dataIndex: 'bnfMode',
          scopedSlots: { customRender: 'bnfMode' }
        },
        {
          title:'投资管理方式',
          width:120,
          dataIndex: 'imStyle',
          scopedSlots: { customRender: 'imStyle' }
        },
        {
          title:'交易金额',
          width:120,
          dataIndex: 'transactionAmount',
          scopedSlots: { customRender: 'transactionAmount' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '10%',
          fixed: 'right',
          scopedSlots: { customRender: 'fundSourceOpt' },
        }
      ],
      //展示的列
      columns:[],
      // fundSource:[],
      editingId:'',
      prjCode: '',
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
    // 是否关联项目
    hasPrjCode:{
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
    }
  },
  watch:{
    fundSourceItem: function(){
      this.initColumns()
    }
  },
  methods: {
    ...mapActions("order",["getPrjectInfoList","getCusAccInfoList"]),
    formatAmt(val){
      return formatAmt(val,2)
    },
    addFundSource(){
      if( !this.prjCode && this.hasPrjCode ){
        this.$message.warning('请先选择项目名称')
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
    
    async changeAccCode(value,index){
      console.log("获取子账户信息",value,index);
      const target = this.cusAccInfoList.filter(item => value === item.accNo)[0];
      console.log("target",target);
      if (target) {
        // 子账户
        this.fundSource[index].accNo = value
        // 项目编号
        this.fundSource[index].prjCode = target.prjCode
        // 收益权模式
        this.fundSource[index].bnfMode =  target.bnfMode
        // 投资管理方式
        this.fundSource[index].imStyle = target.imStyle
        // 子账户类型
        // this.fundSource[index].accType = target.accType
        console.log("资金来源",this.fundSource[index]);
      }
    },
    changeTransactionAmount(value,index){
      this.fundSource[index].transactionAmount = value
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
    this.getCusAccInfoList({imStyle:1})
    this.getDict('IM_STYLE,BNF_MODE')

    this.initColumns()
    // 监听prjCode变化
    this.$bus.$on('prjCode',(prjCode)=>{
      this.prjCode = prjCode
      this.editingId = ''
      this.fundSource.forEach((item,i)=>{
        this.fundSource.shift()
      })
    })
  }
}
</script>
<style lang="stylus" scoped>

</style>