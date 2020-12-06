/**
原状分配确认扣减信托份额
},
*/
<template>
  <div>
    <a-form-model :model="form" ref="form" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }">
      <a-row :gutter="24">
        <a-col :span="6">
          <a-form-model-item label="成交日">
            <j-date placeholder="请选择成交日" :disabled="form.status !== '30'" v-model="form.tranDt" name="tranDt" style="width: 100%;"></j-date>
          </a-form-model-item>
        </a-col>
        <a-col :span="6">
          <a-form-model-item label="净值日" v-if="form.voaType === '1'">
            <j-date placeholder="请选择净值日" :disabled="form.status !== '30'" v-model="form.priceDt" name="priceDt" style="width: 100%;"></j-date>
          </a-form-model-item>
        </a-col>
        <a-col :span="6">
          <BiFormItemNumPercent label="单位净值" :disabled="form.status !== '30'" v-if="form.voaType === '1'" v-model="form.tranPrice" name='tranPrice' :min="0" :precision="4"/>
        </a-col>
      </a-row>
    </a-form-model>
    <a-table :columns="columns" :dataSource="deducTruUnitOriginal" rowKey="key" row :scroll="{ x: 1200 }">
      <template  v-for="(col, i) in [ 'planTranUnit' ]" :slot="col"  slot-scope="text, record, index">
        <a-input-number
          :disabled="disabled"
          :key='col'
          style="margin: -5px 0"
          placeholder="请输入"
          :value="text"
          @change="e => changeAmt(e,col,index)"
        />
      </template>
    </a-table>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import JDate from '../../../components/jeecg/JDate'
  import BiFormItemNumPercent from '../../../components/BI/BiFormItemNumPercent'
  export default {
    name: 'DeducTruUnitOriginal',
    components: {
      JDate,
      BiFormItemNumPercent
    },
    data(){
      return{
        deducTruUnitOriginalColumns: [
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
            title:'子账户资产净值',
            width:120,
            dataIndex: 'mktAmt',
            scopedSlots: { customRender: 'mktAmt' }
          },
          {
            title:'子账户剩余收益金额',
            width:120,
            dataIndex: 'avaPfitInv',
            scopedSlots: { customRender: 'avaPfitInv' }
          },
          {
            title:'子账户信托份额',
            width:90,
            dataIndex: 'unit',
            scopedSlots: { customRender: 'unit' }
          },
          {
            title:'受益人持有金额',
            width:90,
            dataIndex: 'bnfHoldAmt',
            scopedSlots: { customRender: 'bnfHoldAmt' }
          },
          {
            title:'受益人可用金额',
            width:90,
            dataIndex: 'bnfAvaAmt',
            scopedSlots: { customRender: 'bnfAvaAmt' }
          },
          {
            title:'受益人持有份额',
            width:90,
            dataIndex: 'bnfHoldUnit',
            scopedSlots: { customRender: 'bnfHoldUnit' }
          },
          {
            title:'交易金额',
            width:90,
            dataIndex: 'planTranAmt',
            scopedSlots: { customRender: 'planTranAmt' }
          },
          {
            title:'本金金额',
            width:90,
            dataIndex: 'invAmt',
            scopedSlots: { customRender: 'invAmt' }
          },
          {
            title:'收益金额',
            width:90,
            dataIndex: 'pfitInv',
            scopedSlots: { customRender: 'pfitInv' }
          },
          {
            title:'成交份额',
            width:90,
            dataIndex: 'planTranUnit',
            scopedSlots: { customRender: 'planTranUnit' }
          }
        ],
        //展示的列
        columns:[],
        editingId:'',
      }
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
      deducTruUnitOriginal: {
        default() {
          return []
        }
      },
      //一个资金来源
      deducTruUnitOriginalItem: {
        default() {
          return {}
        }
      },
      form: {
        default(){
          return {}
        }
      },
    },
    watch:{
      deducTruUnitOriginalItem: function(){
        this.initColumns()
      }
    },
    methods: {
      ...mapActions("order",["getPrjectInfoList","getCusAccInfoList"]),
      changeAmt(val,col,index,text){
        this.deducTruUnitOriginal[index][col] = val
      },

      initColumns(){
        const cols = this.deducTruUnitOriginalColumns.filter(item => {
          if(item.key =='rowIndex'|| item.dataIndex=='action'){
            return true;
          }
          if (this.deducTruUnitOriginalItem.hasOwnProperty(item.dataIndex)) {
            return true;
          }
          return false;
        })
        this.columns =  cols;

      },
    },
    created(){
      this.initColumns()

    }

  }




</script>

<style scoped>

</style>