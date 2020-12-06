/**
  受益人
  受益人仅展示，没操作和新增
  fundSource:[],//受益人
  fundSourceItem:{
    key:new Date().getTime(),
    odrCode: ''
  },
 */
<template>
  <a-card size="small" title="受益人" style="margin-top: 12px" :bordered="false">
    <a-form-model ref="fundSourceForm" :model="form" :rules="rules">
      <a-row>
        <a-col :span="12">
          <BiFormItemSelect :disabled="disabled" :options="cusBnfInfos"  label="受益人" name="partyCode"  mode="multiple"
          v-model="form.partyCode"  showSearch customKey="partyCode" customVal="partyName" @change="changePartyCode"
          @deselect="deselect" @select="select"
          />
        </a-col>
        <a-button v-if='!disabled' type="primary" @click="allSelect">{{cusBnfInfos.length !==0 && (fundSource.length == cusBnfInfos.length) ? '取消全选': '全选受益人'}}</a-button>
      </a-row>
    </a-form-model>
    <a-table :columns="columns" :dataSource="fundSource" rowKey="partyCode" row :pagination='false'>
      <template  v-for="(col, i) in ['tranAmt','tranInv','pfitInv']" :slot="col"  slot-scope="text, record, index">
        <BiInputCapitalAmount
          :disabled="disabled"
          :key='col'
          customStyle="margin: -5px 0;width:100%"
          placeholder="请输入"
          :value="text"
          :precision='2'
          :min='0'
          @change="e => handleChange(e,col,index)"
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
  name: "Bnfinfo",
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
          customRender:function (t,r,index) {
            return parseInt(index)+1;
          }
        },
        {
          title:'受益人',
          width:90,
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
          dataIndex: 'accNo',
          customRender: function(t,r,index){
            return `${r.accName||'--'} |${r.accNo||'--'}|${r.accOpenBank||'--'}`
          }
        },
        {
          title:'交易金额',
          dataIndex: 'tranAmt',
          width:150,
          scopedSlots: { customRender: 'tranAmt' }
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
          width:150,
          scopedSlots: { customRender: 'pfitInv' }
        },
        
      
      ],
      //展示的列
      columns:[],
      // form: {},
      rules:{
        partyCode: [
          { required: true, message: '请选择受益人', trigger: 'blur' },
        ],
      },
      voaType:'' ,//估值类型
    }
  },
  components: {
  
  },
  computed: {
    ...mapState("order", [
      "prjectInfoList","cusAccInfoList","cusBnfInfos"
    ]),
    form:{
      get: function(){
         let partyCodes =  this.fundSource.map(item=>{
            return item.partyCode
          })
          return {
            partyCode: partyCodes.length  ? partyCodes  : []
          }
      },
      set: function(v){
       
      }
    }
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
    },
    'fundSource':{
      handler(val){
        let partyCodes =  this.fundSource.map(item=>{
            return item.partyCode
          })
          this.form = { partyCode: partyCodes.length  ? partyCodes  : [] }
          // return {
          //   partyCode: partyCodes.length  ? partyCodes  : []
          // }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    ...mapActions("order",["getPrjectInfoList","getCusAccInfoList"]),
    allSelect(){
      if(this.fundSource.length == this.cusBnfInfos.length){
        this.allDelete()
      } else {
        this.fundSource.length = 0
        // this.fundSource = [...this.cusBnfInfos]
        this.cusBnfInfos.forEach(item=>{
          if(!item.tranAmt){
            item.tranAmt = item.charityGrantAmount
            item.tranInv = item.charityGrantAmount
          }
          this.fundSource.push(item)
        })
      }
    },
    allDelete(){
      this.cusBnfInfos.forEach((item,i)=>{
        this.fundSource.shift()
      })
    },
    changePartyCode(value){
     if(value.length == 0){
      //  this.fundSource.length = 0
       this.allDelete()
     }
    
    },
    
    select(value){
      const target = this.cusBnfInfos.filter(item => value === item.partyCode)[0];
      if (target) {
        if(!target.tranAmt){
          target.tranAmt = target.charityGrantAmount
          target.tranInv = target.charityGrantAmount
        }
        this.fundSource.push(target)
      }  
    },
    deselect(value){

      // this.fundSource = this.fundSource.filter(item => value != item.partyCode);
      this.fundSource.forEach((item,i)=>{
        if(value == item.partyCode){
          this.fundSource.splice(i,1)
        }
      })
      
    },
    handleChange(value,col,index){
      //针对估值项目，资金来源的交易金额需要做校验 voaType== 1估值 3不估值
        let {bnfAvaSaving,bnfAccAmt,totalAmt} = this.fundSource[index]
        let min = Math.min(+bnfAvaSaving,+bnfAccAmt,+totalAmt)
      // if( col == 'tranAmt' ){
      //   //估值
      //   if(this.voaType == 1){
      //     // U份额制 P大池子
      //     if(this.fundSource[index].bnfMode == 'U'){
      //       if(+value>min){
      //         this.$message.warning('交易金额不能超过受益人可用金额，受益人持有金额，子账户可用现金余额的最小值')
      //         return 
      //       }
            
      //     } else {
      //       if(+value>totalAmt){
      //         this.$message.warning('交易金额不能超过子账户可用现金余额')
      //         return 
      //       }
      //     }
      //   } else{
      //   //不估值
      //     if(+value>totalAmt){
      //       this.$message.warning('交易金额不能超过子账户可用现金余额')
      //       return 
      //     }
      //     this.fundSource[index]['pfitInv'] = (+value) - (+this.fundSource[index]['tranInv']||0)
      //   }
      // }
     
      this.$set(this.fundSource[index],col,value)
     
    },
     validateFundSource () {
      let isSuccess = false
      this.$refs.fundSourceForm.validate( async(valid) => {
        isSuccess = valid
      });
      return isSuccess
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
    this.getDict('IDNTYPES')
    this.initColumns()
    // 监听项目的估值类型变化 voaType：1为估值
    this.$bus.$on('voaType',(voaType)=>{
      this.voaType = voaType
    })
    // 监听项目变化时候受益人列表清空
    this.$bus.$on('cusBnfInfoList',(cusBnfInfoList)=>{
      // this.fundSource.length = 0
      this.allDelete()
    })
  }
}
</script>
<style lang="stylus" scoped>

</style>