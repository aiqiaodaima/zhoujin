/**
  选择资产合同
  selectContract:[]
  selectContractItem:{
    editable: true,
    isNew: true,
    refContractNo: '',
    refContractNo:'',
    prjCode: '',
    accNo: '',
    accName: '',
    unit: '',
    transferFee:'',
    planTranUnit:'',
    proCode: this.proCode,
  },
 */
<template>
  <a-card size="small" title="选择资产合同" style="margin-top: 12px" :bordered="false">
    <a-table :columns="columns" :dataSource="selectContract" rowKey="key" row :scroll="{ x: 1300 }">
      <template slot="refContractNo" slot-scope="text, record, index">
        <BiFormItemSelect :options="cusInvestBal" customKey="refContractNo" customVal="refContractNo" label="产品购买合同号" name="refContractNo"   :disabled="disabled"
          :value="text" @change="changeRefNo($event,index)"  showSearch :isForm="false" v-if="record.editable" :placeholder="selectContractColumns[1].title"/>
        <template v-else>{{ record.refContractNo }}</template>
      </template>
      <template slot="trxContractNo" slot-scope="text, record, index">
        <BiFormItemSelect :options="cusInvestBal" customKey="refContractNo" customVal="refContractNo" label="产品购买合同号" name="refContractNo"   :disabled="disabled"
          :value="text" @change="changeRefNo($event,index)"  showSearch :isForm="false" v-if="record.editable" :placeholder="selectContractColumns[1].title"/>
        <template v-else>{{ record.trxContractNo }}</template>
      </template>
      <template  v-for="(col, i) in ['planTranUnit','planTranAmt','incomeAmt','incomeUnit','tranUnit', 'transferFee']" :slot="col"  
        slot-scope="text, record, index"
      >
        <div :key="col" v-if="selectContractItem.hasOwnProperty(col)">
          <a-input-number
            :disabled="disabled"
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            :min='1'
            :precision='2'
            @change="e => changePlanTranAmt(e,col,index)"
          />
          <template v-else>{{ fmoney(text,2) }}</template>
        </div>
      </template>
      <template  slot="files" slot-scope="text, record, index">
        <BiUpload v-model="files"></BiUpload>
      </template>

      <template slot="selectContractOpt" slot-scope="text, record, index" v-if="!disabled">
        <div class="editable-row-operations">
            <span v-if="record.editable">
              <a @click="() => selectContractSave(index)">添加</a>
              <a-divider type="vertical" />
              <a @click="() => selectContractCancel(index)">取消</a>
            </span>
          <span v-else>
            <a :disabled="editingId !== ''" @click="() => selectContractEdit(index)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm title="确定删除吗?" @confirm="() => selectContractDel(index)">
              <a :disabled="editingId !== ''">删除</a>
            </a-popconfirm>
          </span>
        </div>
      </template>
    </a-table>
    <a-button v-if="!disabled" style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus" :disabled="editingId !== ''" @click="addSelectContract">新增资产合同</a-button>
  </a-card>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import dictMixin from '@mixins/dictMixin'
import { queryCapitalAviAmt } from '@/api/BiApi'
import vueBus from '@/utils/vueBus';
import { formatAmt } from '@utils/util'
import biUploadMixin from '@mixins/biUploadMixin'
export default {
  name: "SelectContract",
  mixins:[dictMixin,biUploadMixin],
  data() {
    return {
      selectContractColumns: [
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
        //赎回refContractNo
        {
          title:'产品购买合同号',
          width:200,
          dataIndex: 'refContractNo',
          scopedSlots: { customRender: 'refContractNo' }
        },
        // 认购和赎回的产品购买合同号不一样，认购,追加申购trxContractNo
        {
          title:'产品购买合同号',
          width:200,
          dataIndex: 'trxContractNo',
          scopedSlots: { customRender: 'trxContractNo' }
        },
        {
          title:'子账户名称',
          width:150,
          dataIndex: 'accName',
          scopedSlots: { customRender: 'accName' }
        },{
          title:'项目编号',
          width:150,
          dataIndex: 'trustPrjCode',
          scopedSlots: { customRender: 'trustPrjCode' }
        },
        {
          title:'系统可用余额(更新日期)',
          width:200,
          dataIndex: 'totalAmt',
          customRender: function(t,r,index){
            return `${formatAmt(r.totalAmt,2)} (${r.updateDate})`
          }
        },
        {
          title:'专户现金余额(更新日期)',
          width:200,
          dataIndex: 'savingBal',
          customRender: function(t,r,index){
            return `${formatAmt(r.savingBal,2)} (${r.flowDateStr})`
          }
        },
        {
          title:'可用余额(份额)',
          width:110,
          dataIndex: 'unit',
          customRender: function(t,r,index){
            return formatAmt(t,2)
          }
        },
        {
          title:'投资本金',
          width:90,
          dataIndex: 'repayAmt',
          customRender: function(t,r,index){
            return formatAmt(t,2)
          }
        },
        {
          title:'交易金额',
          dataIndex: 'planTranUnit',
          width:120,
          scopedSlots: { customRender: 'planTranUnit' }
        },
        {
          title:'交易金额',
          dataIndex: 'planTranAmt',
          width:120,
          scopedSlots: { customRender: 'planTranAmt' }
        },
        {
          title:'交易金额',
          dataIndex: 'incomeAmt',
          width:90,
          scopedSlots: { customRender: 'incomeAmt' }
        },
        {
          title:'交易份额',
          dataIndex: 'incomeUnit',
          width:90,
          scopedSlots: { customRender: 'incomeUnit' }
        },
        // {
        //   title:'手续费金额',
        //   width:90,
        //   dataIndex: 'transferFee',
        //   scopedSlots: { customRender: 'transferFee' }
        // },
        {
          title:'返回份额',
          dataIndex: 'tranUnit',
          width:120,
          customRender: function(t,r,index){
            return formatAmt(t,2)
          }
          // scopedSlots: { customRender: 'tranUnit' }
        },
        {
          title: '选择文件',
          dataIndex: 'files',
          width: 120,
          scopedSlots: { customRender: 'files' },
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 90,
          scopedSlots: { customRender: 'selectContractOpt' },
        }
      ],
      // selectContract:[],
      editingId:'',
      proCode: '',
      // fileList: [],
      //展示的列
      columns:[],
      // 成交单位价格
      voaPrice: 1
    }
  },
  components: {
  
  },
  computed: {
    ...mapState("order", [
      "prjectInfoList","cusAccInfoList","cusInvestBal"
    ]),
  },
  props: {
    type: {

    },
    selectContract: {
      default(){
        return []
      }
    },
    selectContractItem: {
      default(){
        return {}
      }
    },
    disabled: {
      default: false
    }
  },
  methods: {
    ...mapActions("order",["getPrjectInfoList","getCusAccInfoList","getCusInvestBal"]),
    fmoney(amt){
      return formatAmt(amt,2);
    },
    addSelectContract(){
      if( !this.proCode ){
        this.$message.warning('请先选择资产名称')
        return
      }
      this.selectContract.push({...this.selectContractItem,key:new Date().getTime(),proCode:this.proCode})
      this.editingId = this.selectContract.length;
    },
    selectContractEdit(index) {
      let target = this.selectContract[index]
      target.editable = !target.editable
      this.editingId = index;
    },
    selectContractSave(index) {
      let target = this.selectContract[index]
      target.editable = false
      target.isNew = false
      this.editingId = '';
    },
    selectContractCancel(index) {
      let target = this.selectContract[index]
      target.editable = false
      this.editingId = '';
      // this.selectContractDel(index)
    },
    selectContractDel(index){
      this.selectContract.splice(index,1)
      this.editingId = '';
    },
    changePrjName(value,index){
      const target = this.prjectInfoList.filter(item => value === item.prjCode)[0];
      if (target) {
        this.selectContract[index].prjCode = value
        this.selectContract[index].prjCode = target.prjCode
        this.getCusAccInfoList({prjCode:value,imStyle:1})
      }
    },
    async changeAccCode(value,index){
      const target = this.cusAccInfoList.filter(item => value === item.accNo)[0];
      if (target) {
        this.selectContract[index].accNo = value
        const { result } = await queryCapitalAviAmt({prjCode:value,accNo:value,proCode:this.proCode})
        this.selectContract[index].aviAmt = result.aviAmt || '--'
        this.selectContract[index].bankCardBalanceDto = result.bankCardBalanceDto || '--'
      }
    },
    changePlanTranAmt(value,col,index){
      this.selectContract[index][col] = value
      // 返本及收益时候：成交单位价格*返回份额=交易金额
      if(this.selectContractItem.hasOwnProperty('tranUnit') && this.selectContractItem.hasOwnProperty('incomeAmt')){
        if(this.voaPrice && value){
          // this.selectContract[index]['tranUnit'] = this.fmoney((+value)/(+this.voaPrice))
          this.selectContract[index]['tranUnit'] = ((+value)/(+this.voaPrice)).toFixed(2)
        }
      }
    },
    
    changeRefNo(value,index){
      const target = this.cusInvestBal.filter(item => value === item.refContractNo)[0];
      if (target) {
        this.selectContract[index].refContractNo = value
        this.selectContract[index].refNo = target.refNo
        this.selectContract[index].trxContractNo = value
        this.selectContract[index].prjCode = target.prjCode
        this.selectContract[index].trustPrjCode = target.trustPrjCode
        this.selectContract[index].accName = target.accName
        this.selectContract[index].accNo = target.accNo
        this.selectContract[index].unit = target.unit
        this.selectContract[index].repayAmt = target.avaBal
        // this.getCusAccInfoList({prjCode:value,imStyle:1})
        this.selectContract[index].totalAmt = target.zzhye
        this.selectContract[index].updateDate = target.zzhyegxsj
        this.selectContract[index].savingBal = target.yhkye
        this.selectContract[index].flowDateStr = target.yhkyegxsj

      }
    },
    initColumns(){
      const cols = this.selectContractColumns.filter(item => {
        if(item.key =='rowIndex'|| item.dataIndex=='action'){
          return true;
        }
        if (this.selectContractItem.hasOwnProperty(item.dataIndex)) {
          return true;
        }
        return false;
      })
      this.columns =  cols;
    },
  },
  created(){
    this.getPrjectInfoList()
    this.initColumns()
    // 监听procode变化
    this.$bus.$on('proCode',(proCode)=>{
      if(this.proCode && this.proCode !== proCode){
        this.$emit('update:selectContract',[])
      }
      this.proCode = proCode
      this.editingId = ''
      // this.getCusInvestBal({proCode})
    })
    // 监听成交单位价格变化
    this.$bus.$on('changeVoaPrice',(voaPrice)=>{
      this.voaPrice = voaPrice
      // 返本及收益时候：成交单位价格*返回份额=交易金额
      if(this.selectContractItem.hasOwnProperty('tranUnit') && this.selectContractItem.hasOwnProperty('incomeAmt')){
        this.selectContract.length && this.selectContract.forEach(item=>{
          if(item.incomeAmt && this.voaPrice){
            item.tranUnit = this.fmoney((+item.incomeAmt)/(+this.voaPrice))
            // this.selectContract[index]['tranUnit'] = this.fmoney((+value)/(+this.voaPrice))
          }
        })
      }
    })
  }
}
</script>
<style lang="stylus" scoped>

</style>