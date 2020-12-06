/**
  请确认扣减份额
 */
<template>
  <!-- <a-card style="margin-top: 12px" :bordered="false"> -->
    <div>
      <a-form-model ref="deductionUnitForm" :model="deductionUnitFormItem" :rules="rules" v-if='Object.keys(deductionUnitFormItem).length>0'>
        <a-row>
          <BiCol v-if="'dealDt' in deductionUnitFormItem">
            <BiFormItemDatePicker :disabled="disabled"  label="成交日" name="dealDt" dateFormat='YYYY-MM-DD' v-model="deductionUnitFormItem.dealDt" @change="(e) => changeFormItem(e,'dealDt')"/>
          </BiCol>
          <BiCol v-if="'priceDt' in deductionUnitFormItem">
            <BiFormItemDatePicker :disabled="disabled"  label="净值日期" name="priceDt" dateFormat='YYYY-MM-DD' v-model="deductionUnitFormItem.priceDt" @change="(e) => changeFormItem(e,'priceDt')"/>
          </BiCol>
          <BiCol v-if="'tranPrice' in deductionUnitFormItem">
            <BiFormItemNumPercent :disabled="disabled" label="成交单位净值" name="tranPrice" :precision='4'  v-model="deductionUnitFormItem.tranPrice" @change="(e) => changeFormItem(e,'tranPrice')"/>
          </BiCol>
         
        </a-row>
      </a-form-model>
      <a-table :columns="columns" :dataSource="deductionUnit" rowKey="odrCode" row :scroll="{ x: 1300 }">
      
        <template v-for="(col, i) in ['tranDt', 'dealDt','priceDt']" :slot="col"  slot-scope="text, record, index">
          <a-date-picker
            :key="col"
            :disabled="disabled || record.status == '75'"
            style="margin: -5px 0;width:130px"
            :value="text ? moment(text) : null"
            @change="(mom,dateStr) => handleChange(dateStr,col,index)"
          />
        </template>
        <template  v-for="(cl, i) in ['tranUnit', 'tranPrice']" :slot="cl"  slot-scope="text, record, index">
          <a-input-number
            :disabled="disabled || record.status == '75'"
            :key='cl'
            style="margin: -5px 0;width:100%"
            placeholder="请输入"
            :value="text"
            :min="0"
            :precision='cl=="tranPrice"? 4 : 2'
            @change="e => handleChange(e,cl,index)"
          />
        </template>
        <template slot="deductionUnitOpt" slot-scope="text, record, index" v-if="!disabled">
          <div class="editable-row-operations" v-if="record.status != '75'">
            <span>
              <a @click="handleDeductionUnit(index)">扣减份额</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确定取消交易吗?" @confirm="handleDeductionUnit(index,true)">
                <a>取消交易</a>
              </a-popconfirm>
            </span>
          </div>
        </template>
      </a-table>
    </div>
  <!-- </a-card> -->
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import dictMixin from '@mixins/dictMixin'
import moment from 'moment'
import { formatAmt } from '@utils/util'
export default {
  name: "DeductionUnit",
  mixins:[dictMixin],
  data() {
    return {
      columns:[],
      deductionUnitColumns: [
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
          title:'产品购买合同号',
          width:120,
          dataIndex: 'refContractNo',
          scopedSlots: { customRender: 'refContractNo' }
        },
        {
          title:'成交日',
          width:130,
          dataIndex: 'dealDt',
          scopedSlots: { customRender: 'dealDt' }
        },
        {
          title:'净值日期',
          width:130,
          dataIndex: 'priceDt',
          scopedSlots: { customRender: 'priceDt' }
        },

        {
          title:'子账户名称',
          width:120,
          dataIndex: 'accName',
          scopedSlots: { customRender: 'accName' }
        },
        {
          title:'受益权模式',
          width:100,
          dataIndex: 'bnfModeName',
          scopedSlots: { customRender: 'bnfModeName' }
        },
        {
          title:'子账户信托份额',
          width:100,
          dataIndex: 'accTotalUnit',
          customRender: function(t,r,index){
            return `${formatAmt(r.accTotalUnit)}`
          }
        },
        {
          title:'受益人',
          width:150,
          dataIndex: 'partyName',
          scopedSlots: { customRender: 'partyName' }
        },
        {
          title:'证件号码',
          width:200,
          dataIndex: 'idn',
          customRender: (t,r,index) => {
            return `${this.getDictNameByCode(this.dicts.IDNTYPES,r.idnType)}| ${r.idn}`
          }
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
          title:'本金金额',
          dataIndex: 'tranInv',
          width:150,
          customRender: function(t,r,index){
            return `${formatAmt(r.tranInv)}`
          }
        },
        {
          title:'收益金额',
          dataIndex: 'pfitInv',
          width:150,
          customRender: function(t,r,index){
            return `${formatAmt(r.pfitInv)}`
          }
        },

        {
          title:'受益人持有份额',
          width:100,
          dataIndex: 'bnfTotalUnit',
          customRender: function(t,r,index){
            return `${r.bnfMode == 'P' ? '--' :formatAmt(r.bnfTotalUnit)}`
          }
        },
        {
          title:'交易金额',
          width:120,
          dataIndex: 'tranAmt',
          customRender: function(t,r,index){
            return `${formatAmt(r.tranAmt)}`
          }
        },
        {
          title:'项目编号',
          width:120,
          dataIndex: 'prjCode',
          scopedSlots: { customRender: 'prjCode' }
        },
        {
          title:'交易金额(份额)',
          dataIndex: 'planTranUnit',
          width:120,
          customRender: function(t,r,index){
            return `${formatAmt(r.planTranUnit)}`
          }
        },
        {
          title:'成交单位价格',
          dataIndex: 'tranPrice',
          width:120,
          scopedSlots: { customRender: 'tranPrice' },
        },
        {
          title:'扣减份额',
          width:120,
          dataIndex: 'tranUnit',
          customRender: function(t,r,index){
            return `${formatAmt(r.tranUnit)}`
          }
        },
        {
          title:'实际成交日',
          dataIndex: 'tranDt',
          width:120,
          scopedSlots: { customRender: 'tranDt' }
        },
        // {
        //   title: '操作',
        //   dataIndex: 'deductionUnitOpt',
        //   width: '10%',
        //   fixed: 'right',
        //   scopedSlots: { customRender: 'deductionUnitOpt' },
        // }
      ],
      // deductionUnit:[],
      // form: {},
      rules:{
        dealDt: [
          { required: true, message: '请选择成交日', trigger: 'change' },
        ],
        priceDt: [
          { required: true, message: '请选择净值日期', trigger: 'change' },
        ],
        tranPrice: [
          { required: true, message: '请输入成交单位净值', trigger: 'blur' },
        ],
      },
    }
  },
  components: {
  
  },
  computed: {
    ...mapState("order", [
      "status"
    ]),
  },
  props: {
    deductionUnit:{
      default(){
        return []
      }
    },
    // 扣减份额的table元素
    deductionUnitItem: {
      default(){
        return {
          refContractNo:'',
          accName:'',
          prjCode:'',
          tranUnit:'',
          tranPrice:'',
          tranDt:'',
        }
      }
    },
    // 扣减份额的form元素,默认没有form
    deductionUnitFormItem: {
      default(){
        return {
         
        }
      }
    },
    disabled: {
      default: false
    }
  },
  watch: {
    // 'deductionUnit':{
    //   handler(val){
    //     for (let key in this.deductionUnitFormItem){
    //       this.deductionUnitFormItem[key] = this.deductionUnit[0][key]
    //     }
    //   },
    //   immediate: true,
    //   deep: true
    // }
  },
  methods: {
    ...mapActions("order",[]),
    moment,
    handleDeductionUnit(index,isFail) {
      const deductionUnit = [this.deductionUnit[index]]
      this.$emit('handleDeductionUnit', deductionUnit,isFail)
    },
    validatedeDuctionUnit(){
      let isSuccess = false
      this.$refs.deductionUnitForm.validate( async(valid) => {
        isSuccess = valid
      });
      return isSuccess
    },
    changeFormItem(val,key){
      // this.deductionUnit.forEach(item=>{
      //   item[key] = val
      // })
      this.deductionUnitFormItem[key] = val
      if(key == 'tranPrice' ){
        this.deductionUnit.forEach(item=>{
          item.tranUnit = ((+item.tranAmt)/(+val)).toFixed(2)
        })
      }
    },
    handleChange(val,col,index){
      this.$set(this.deductionUnit[index],col,val)
       // 输入成交单位价格计算成交份额
      if(col == 'tranPrice'){
        let tranAmt = 0
        if(this.deductionUnitItem.hasOwnProperty('planTranUnit')){
           tranAmt =  this.deductionUnit[index]['planTranUnit']
        } else {
           tranAmt =  this.deductionUnit[index]['tranAmt']
        }
        this.deductionUnit[index]['tranUnit'] = ((+tranAmt)/(+val)).toFixed(2)
      }
    },
    initColumns(){
      const cols = this.deductionUnitColumns.filter(item => {
        if(item.key =='rowIndex'|| item.dataIndex=='deductionUnitOpt'){
          return true;
        }
        if (this.deductionUnitItem.hasOwnProperty(item.dataIndex)) {
          return true;
        }
        return false;
      })
      this.columns =  cols;
     
    },
  },
  created(){
    this.getDict('IDNTYPES')
    this.initColumns()
  },
  mounted(){
    //  this.deductionUnit.forEach((item,i)=>{
    //   this.handleChange(item.tranPrice || 1,'tranPrice',i)  
    // })
  }
}
</script>
<style lang="stylus" scoped>

</style>