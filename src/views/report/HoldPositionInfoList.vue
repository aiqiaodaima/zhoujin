<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model layout="inline">
        <a-row :gutter="16">
          <BiCol>
            <BiFormItemInput label="项目名称" v-model="queryParam.trustPrjName" @pressEnter="enterKeySearch"
                             placeholder="请输入项目名称"/>
          </BiCol>
          <BiCol>
            <BiFormItemInput label="资产名称" v-model="queryParam.proName" @pressEnter="enterKeySearch"
                             placeholder="请输入资产名称"/>
          </BiCol>
          <BiCol>
            <BiFormItemSelect :options="admOrgnaiztions" label="发行机构" v-model="queryParam.issuerCodes"/>
          </BiCol>
          <BiCol>
            <BiTableSearchBtns @searchReset='searchReset' @searchQuery='searchQuery' :isAdvanced='false'/>
          </BiCol>
        </a-row>
      </a-form-model>
    </div>
    <a-button type="primary" icon="download" @click="handleExportXls('持仓明细')">导出</a-button>
    <a-table class="table-min-height"
             ref="table"
             size="middle"
             :scroll="{ x: 1500 }"
             rowKey="pro"
             bordered
             :columns="columns"
             :dataSource="dataSource"
             :pagination="ipagination"
             :loading="loading"
             :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
             @change="handleTableChange">
    </a-table>
    <!-- table区域-end -->
  </a-card>
</template>

<script>
  import JSuperQuery from '@/components/jeecg/JSuperQuery.vue'
  import JInput from '@/components/jeecg/JInput.vue'
  import JDate from '@/components/jeecg/JDate'
  import { FtsListMixin } from '@/mixins/FtsListMixin'
  import JMultiSelectTag from '../../components/dict/JMultiSelectTag'
  import moment from 'moment'
  import dictMixin from '@mixins/dictMixin'
  import biTableMixin from '@mixins/biTableMixin'

  export default {
    name: 'HoldPositioInfoList',
    mixins: [FtsListMixin, biTableMixin, dictMixin],
    // components: {
    //   JSuperQuery,
    //   JMultiSelectTag,
    //   JDate,
    //   JInput
    // },
    data() {
      return {
        description: '项目查询页面',
        // importExcelUrl: `${window._CONFIG['domianURL']}/test/jeecgDemo/importExcel`,
        //表头
        columns: [
          {
            title: '项目名称',
            dataIndex: 'trustPrjName',
            width: '210px'
          },
          {
            title: '资产名称',
            width: '150px',
            dataIndex: 'proName'
          },
          {
            title: '资产代码',
            dataIndex: 'trustPrjCode',
            width: '150px'
          },
          {
            title: '产品购买合同号',
            dataIndex: 'contractNo',
            width: '200px'
          },
          {
            title: '持有份额',
            dataIndex: 'unit',
            width: '100px'
          },
          {
            title: '持有金额(市值)',
            dataIndex: 'amt',
            width: '100px'
          },
          {
            title: '单位净值',
            dataIndex: 'price',
            width: '100px'
          },
          {
            title: '净值日期',
            dataIndex: 'priceDt',
            width: '100px',
            customRender(text) {
              return text ? moment(text).format('YYYY-MM-DD') : '--'
            }
          },
          {
            title: '起息日',
            dataIndex: 'valueDt',
            width: '70px',
            customRender(text) {
              return text ? moment(text).format('YYYY-MM-DD') : '--'
            }
          },
          {
            title: '到期日',
            dataIndex: 'expireDt',
            width: '70px',
            customRender(text) {
              return text ? moment(text).format('YYYY-MM-DD') : '--'
            }
          },
          {
            title: '头尾处理规则',
            dataIndex: 'endDayCalType',
            width: '70px',
            customRender: (text) => this.getDictNameByCode(this.dicts.ENDDAY_CAL_TYPE, text)
          },
          {
            title: '赎回方式',
            dataIndex: 'redeemType',
            width: '70px',
            customRender: (text) => this.getDictNameByCode(this.dicts.REDEEM_TYPE, text)
          },
          {
            title: '投资封闭期',
            dataIndex: 'closePeriod',
            width: '70px'
          },
          {
            title: '收益率类型',
            dataIndex: 'profitName',
            width: '70px',
            customRender: (text) => this.getDictNameByCode(this.dicts.INCOME_TYPE, text)
          },
          {
            title: '预期收益率',
            dataIndex: 'expReturnRate',
            width: '70px'
          },
          {
            title: '付息方式',
            dataIndex: 'intType',
            width: '70px',
            customRender: (text) => this.getDictNameByCode(this.dicts.PRO_INT_TYPE, text)
          },
          {
            title: '累计付息金额',
            dataIndex: 'rIntAmt',
            width: '70px'
          }
        ],
        url: {
          list: '/prj/holdPositionInfo/list',
          exportXlsUrl: "/prj/holdPositionInfo/list/export",
        },
        dictOptionsData: []
      }
    },
    methods: {
      initDictConfig () {
        let promises = [
          this.getAdmOrgnaiztionInfo({ ORG_SUBTYPE:'PIS',REMOVE_YN:'N' }),
        ]
        Promise.all(promises).then(()=>{
          // this.loadData()
        })
      }
    },
    created() {
      this.getDict('ENDDAY_CAL_TYPE,INCOME_TYPE,INCOME_RATE_TYPE,REDEEM_TYPE,PRO_INT_TYPE')
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';

  .ant-card-body .table-operator {
    margin-bottom: 18px;
  }

  .ant-table-tbody .ant-table-row td {
    padding-top: 15px;
    padding-bottom: 15px;
  }

  .anty-row-operator button {
    margin: 0 5px
  }

  .ant-btn-danger {
    background-color: #ffffff
  }

  .ant-modal-cust-warp {
    height: 100%
  }

  .ant-modal-cust-warp .ant-modal-body {
    height: calc(100% - 110px) !important;
    overflow-y: auto
  }

  .ant-modal-cust-warp .ant-modal-content {
    height: 90% !important;
    overflow-y: hidden
  }

  /** Button按钮间距 */
  .ant-btn {
    margin-left: 3px
  }
</style>