<template>
  <div style="background:rgb(240,242,245);">
      <a-form-model>
        <a-card size="small" title="委托财产">
          <a-table
            ref="table"
            bordered
            size="small"
            rowKey="ID"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :loading="loading"
            @change="handleTableChange"
            style="margin-bottom: 10px;"
          >
            <span slot="action" slot-scope="text, record">
              <a @click="handleView(record)">查看</a>
            </span>
          </a-table>
        </a-card>
      </a-form-model>
  </div>
</template>

<script>
  import biTableMixin from '@mixins/biTableMixin'
  import dictMixin from '@/mixins/dictMixin'
  import { formatAmt } from '../../../utils/util'
  export default {
    name: 'ProjectEntrusted',
    components: {
    },
    mixins:[biTableMixin,dictMixin],
    computed:{
    },
    watch:{
    },
    props:{
      businessKey:''
    },
    data () {
      let prjCode=''
      if(this.businessKey&&this.businessKey.split(':')[1]){
        prjCode=this.businessKey.split(':')[1]
      }else{
        prjCode=this.$route.query.prjCode
      }
      return {
        queryParam: {
          prjCode: prjCode,
          hideCancel: true,
          isInit: true
        },
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: 'center',
            customRender: function (t, r, index) {
              return parseInt(index) + 1
            },
          },
          {
            title: '委托类型',
            align: 'center',
            dataIndex: 'PERIOD_NO',
            customRender: (text) => {
              return text=='0'?'初始委托':'追加委托';
            }
          },
          {
            title: '资产类型',
            align:"center",
            dataIndex: 'PROPERTY_TYPE',
            customRender: (text) => {
              return this.getDictNameByCode(this.dicts.PROPERTY_TYPE,text);
            }
          },
          {
            title: '资产名称',
            align:"center",
            dataIndex: 'A',
            customRender: (text, record) => {
              let astName = '';
              if(record.PROPERTY_TYPE === 'S'){
                astName = this.getDictNameByCode(this.dicts.PROPERTY_TYPE,record.PROPERTY_TYPE);
              }else if(record.PROPERTY_TYPE === 'P'){
                astName = record.PRO_NAME;
              }else{
                astName = this.getDictNameByCode(this.dicts.TRUST_ASSET_TYPE,record.ASSET_TYPE);
              }
              record.astName = astName;
              return astName;
            }
          },
          {
            title: '金额',
            align:"center",
            dataIndex: 'TRUST_PROPERTY_AMT',
            customRender: (text, record) => {
              if(record.PROPERTY_TYPE === 'P'){
                return formatAmt(Number(record.INV_AMT_FC||0),2);
              }else{
                return formatAmt(Number(record.TRUST_PROPERTY_AMT||0),2);
              }
            }
          },
          {
            title: '交付日期',
            align:"center",
            dataIndex: 'TRAN_DT',
            customRender: (text, record) => {
              if(record.TRAN_DT!=null && record.TRAN_DT!=''){
                return record.TRAN_DT.substring(0,10);
              }else{
                return record.TRAN_DT;
              }
            }
          },
          {
            title: '子账户',
            align:"center",
            dataIndex: 'ACC_NAME'
          },
          {
            title: '委托人',
            align:"center",
            dataIndex: 'PARTY_NAME'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            width: 140,
            fixed: 'right',
            scopedSlots: {
              customRender: 'action',
            },
          },
        ],
        url:{
          list:'/prj/asset/list',
        },
      }
    },
    created () {
       this.getDict('PROPERTY_TYPE,TRUST_ASSET_TYPE,BNF_MODE');
    },
    mounted () {
    },
    methods:{
      handleView(record){
        this.oprate(record.BATCH_ID,record.TRANTYPE_CODE,record.TRAN_SUBTYPE_CODE)
      },
      oprate ( batchId,trantypeCode,tranSubtypeCode ) {
        const trantypeCodes = {
          "LOA0101": '/order/prj/init',//初始委托
          "LOA0102": '/order/prj/init',//初始委托
          "LOA0103": '/order/prj/init',//初始委托
          "LOA0201": '/order/prj/addiComm',//追加委托
          "LOA0202": '/order/prj/addiComm',//追加委托
          "LOA0203": '/order/prj/addiComm',//追加委托
        }
        this.$router.push({path: trantypeCodes[trantypeCode],query:{ batchId }})
      },
    }
  }
</script>

<style scoped>
  .ant-col {
    padding-left:0 !important;
  }
</style>