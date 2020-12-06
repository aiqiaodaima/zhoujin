/**
资金来源原状分配
},
*/
<template>
  <a-card size="small" title="资金来源" style="margin-top: 12px" :bordered="false">
    <a-table :columns="columns" :dataSource="fundSourceOriginal" rowKey="key" row :scroll="{ x: 1200 }">
      <template  v-for="(col, i) in ['planTranAmt','invAmt','pfitInv']" :slot="col"  slot-scope="text, record, index">
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
  </a-card>
</template>

<script>
  import { mapActions, mapState } from 'vuex'

  export default {
    name: 'FundSourceOriginal',
    data(){
      return{
        FundSourceOriginalColumns: [
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
      fundSourceOriginal: {
        default() {
          return []
        }
      },
      //一个资金来源
      fundSourceOriginalItem: {
        default() {
          return {}
        }
      }
    },
    watch:{
      fundSourceOriginalItem: function(){
        this.initColumns()
      }
    },
    methods: {
      ...mapActions("order",["getPrjectInfoList","getCusAccInfoList"]),
      changeAmt(val,col,index,text){
        this.fundSourceOriginal[index][col] = val
      },

      initColumns(){
        const cols = this.FundSourceOriginalColumns.filter(item => {
          if(item.key =='rowIndex'|| item.dataIndex=='action'){
            return true;
          }
          if (this.fundSourceOriginalItem.hasOwnProperty(item.dataIndex)) {
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