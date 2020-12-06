<template>
  <div style="background:rgb(240,242,245);">
      <a-form-model>
        <div class="table-page-search-wrapper">
          <a-form-model layout="inline">
            <a-row :gutter="16">
              <a-col :span="8" style="float: right">
                <BiFormItemSelect label="子账户" :options="dicts.SUB_ACC_TYPE" v-model="queryParam.accType"  @change="changeType"/>
              </a-col>
            </a-row>
          </a-form-model>
        </div>
            <a-card size="small" title="现金及投资类资产" :bordered="false">
              <a-table
                :scroll="{ x: 2500,y: 400 }"
                ref="table"
                bordered
                size="small"
                :columns="columns"
                :dataSource="dataSource"
                :loading="loading"
                @change="handleTableChange"
              >
              </a-table>
            </a-card>
        <!--<project-manage-asset ref="ProjectManageAsset" :proCodeV="proCode"></project-manage-asset>-->
<!--        <project-securitie ref="ProjectSecuritie" :proCodeV="proCode"></project-securitie>-->
      </a-form-model>
  </div>
</template>

<script>
  import dictMixin from '@mixins/dictMixin'
  import biTableMixin from '@mixins/biTableMixin'
  import { getAction } from '../../../api/manage'
  import ProjectManageAsset from './ProjectManageAsset'
  import ProjectSecuritie from './ProjectSecuritie'
  import { filterDictText } from '../../../components/dict/JDictSelectUtil'
  import { formatAmt, setKeyProp } from '../../../utils/util'
  export default {
    name: 'ProjectPosition',
    components: {
      ProjectManageAsset,
      ProjectSecuritie
    },
    mixins:[dictMixin,biTableMixin],
    computed:{
    },
    watch:{
    },
    data () {
      let that = this;
      return {
        queryParam:{
          accType:'ALL',
          prjCode:this.$route.query.prjCode
        },
        loading: false,
        dataSource: [],
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
            title: '子账户',
            align: 'center',
            dataIndex: 'ACC_NAME',
          },
          {
            title: '资产类别',
            align: 'center',
            dataIndex: 'ASSETCAT_NAME'
          },
          {
            title: '产品类别',
            align: 'center',
            dataIndex: 'PFCAT_NAME'
          },
          {
            title: '产品购买合同号',
            align: 'center',
            width:200,
            dataIndex: 'CONTRACT_NO'
          },
          {
            title: '资产名称',
            align: 'center',
            width:200,
            dataIndex: 'PRO_NAME'
          },
          {
            title: '资产代码',
            align: 'center',
            dataIndex: 'BANK_PRO_CODE',
          },
          {
            title: '持有份额',
            align: 'center',
            dataIndex: 'UNIT',
            customRender: function (text) {
              return formatAmt(Number(text||0),2);
            }
          },

          {
            title: '持有金额',
            align: 'center',
            dataIndex: 'AVA_BAL',
            customRender: function (text) {
              return formatAmt(Number(text||0),2);
            }
          },
          {
            title: '单位净值',
            align: 'center',
            dataIndex: 'APRICE',
          },
          {
            title: '净值日期',
            align: 'center',
            width:200,
            dataIndex: 'PRICE_DT',
            customRender: function(text) {
              if (text !== '' && text !== null) {
                return text.substring(0, 10)
              }
            }
          },
          {
            title: '起息日',
            align: 'center',
            dataIndex: 'invDat',
          },
          {
            title: '到期日',
            align: 'center',
            dataIndex: 'endDat',
          },
          {
            title: '头尾处理规则',
            align: 'center',
            dataIndex: 'HEAD_AND_TAIL_PROCESSING',
            customRender: function (text) {
              return filterDictText(that.dicts['ENDDAY_CAL_TYPE'], text);
            }
          },
          {
            title: '赎回方式',
            align: 'center',
            dataIndex: 'REDEEM_TYPE',
            customRender: function (text) {
              return filterDictText(that.dicts['REDEMPTIONMODE'], text);
            }
          },
          {
            title: '投资封闭期',
            align: 'center',
            dataIndex: 'TERM_OF_INVESTMENT',
            customRender: function (text, record) {
              return text+filterDictText(that.dicts['TERM_UNIT'], record.DEADLINE_DATE_FLAG);
            }
          },
          {
            title: '收益率类型',
            align: 'center',
            dataIndex: 'INCOME_TYPE',
            customRender: function (text) {
              return filterDictText(that.dicts['INCOME_TYPE'], text);
            }
          },
          {
            title: '预期收益率',
            align: 'center',
            dataIndex: 'EXP_RETURN_RATE',
            customRender: function (text) {
              return formatAmt(Number(text||0),4)+'%';
            }
          },
          {
            title: '付息方式',
            align: 'center',
            dataIndex: 'INT_TYPE',
            customRender: function (text) {
              return filterDictText(that.dicts['PRO_INT_TYPE'], text);
            }
          },
          {
            title: '累计付息金额',
            align: 'center',
            dataIndex: 'R_REPAY_AMT',
            customRender: function (text) {
              return formatAmt(Number(text||0),2);
            }
          },
          {
            title: '来源',
            align: 'center',
            dataIndex: 'trantype_code',
            customRender: function (text) {
              let rtn = '';
              switch (text) {
                case 'INV01':rtn='资产投资';break;
                case 'LOA0102':rtn='初始委托';break;
                case 'LOA0202':rtn='追加委托';break;
                default:break;
              }
              return rtn;
            }
          }
        ],
        url:{
          list:'/prj/queryBalDetail',
          findByPrjCode:'/prj/findByPrjCode'
        }
      }
    },
    created () {
      this.getDict('ENDDAY_CAL_TYPE,REDEMPTIONMODE,TERM_UNIT,INCOME_TYPE,PRO_INT_TYPE,SUB_ACC_TYPE');
      this.loadDataPosition()
      console.log('rrrreeeesssssss=====',this.$route.query.prjCode);
    },
    mounted () {
    },
    methods:{
      loadDataPosition(){
        let that = this;
        that.loading = true;
        getAction(that.url.list,{prjCode:that.$route.query.prjCode,accType:that.queryParam.accType}).then(res=>{
          if(res.success){
            setKeyProp(res.result);
            that.dataSource = res.result;
          }

        }).finally(()=>{
          that.loading = false;
        });
      },
      changeType(value){
        if (value=='P'){
          this.queryParam.accType='P'
          this.loadDataPosition();
        }
        if (value=='U'){
          this.queryParam.accType='U'
          this.loadDataPosition();
        }
        if (value=='ALL' || value==''){
          this.queryParam.accType='ALL'
          this.loadDataPosition();
        }

      },
    }
  }
</script>

<style scoped>
  .ant-col {
    padding-left:0 !important;
  }
</style>