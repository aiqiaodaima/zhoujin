<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="16">
          <BiCol>
            <BiFormItemInput label="项目名称" v-model="queryParam.trustPrjName" @pressEnter="enterKeySearch" placeholder="请输入项目名称"/>
          </BiCol>
          <BiCol>
            <BiFormItemInput label="资产名称" v-model="queryParam.proName" @pressEnter="enterKeySearch" placeholder="请输入资产名称"/>
          </BiCol>
          <template v-if="advanced">
            <BiCol>
              <BiFormItemSelect mode='multiple' :options="dicts.TRX_TRANTYPES" label="交易类型" v-model="queryParam.trantypeCode" />
            </BiCol>
            <BiCol>
                <BiFormItemSelect mode='multiple' :options="dicts.TRX_TRANTYPES" label="订单状态" v-model="queryParam.status" />
            </BiCol>
            <BiCol>
                <BiFormItemSelect mode='multiple' :options="dicts.TRX_TRANTYPES" label="订单子状态" v-model="queryParam.status" />
            </BiCol>
            <BiCol>
              <BiFormItemInput label="持有资产合同号码" v-model="queryParam.refContractNo" @pressEnter="enterKeySearch" placeholder="请输入持有资产合同号码"/>
            </BiCol>
            <BiCol>
              <BiFormItemInput label="资金交收金额" v-model="queryParam.tranPrice" @pressEnter="enterKeySearch" placeholder="请输入资金交收金额"/>
            </BiCol>
            <BiCol>
              <BiFormItemDatePicker  label="资金交收日期" v-model="queryParam.tranDt" />
            </BiCol>
            <BiCol>
              <BiFormItemInput label="资金交收金额-退款" v-model="queryParam.tranPrice" @pressEnter="enterKeySearch" placeholder="请输入资金交收金额"/>
            </BiCol>
            <BiCol>
              <BiFormItemDatePicker  label="资金交收日期-退款" v-model="queryParam.tranDt" />
            </BiCol>
            <BiCol>
              <BiFormItemDatePicker  label="核算日（分红付息仅记录）" v-model="queryParam.tranDt" />
            </BiCol>
            <BiCol>
              <BiFormItemInput label="（净）交易金额" v-model="queryParam.tranPrice" @pressEnter="enterKeySearch" placeholder="请输入资金交收金额"/>
            </BiCol>
            <BiCol>
              <BiFormItemInput label="交易金额（含手续费）" v-model="queryParam.tranPrice" @pressEnter="enterKeySearch" placeholder="请输入资金交收金额"/>
            </BiCol>
            <BiCol>
              <BiFormItemInput label="交易份额" v-model="queryParam.tranPrice" @pressEnter="enterKeySearch" placeholder="请输入资金交收金额"/>
            </BiCol>
            <BiCol>
              <BiFormItemInput label="手续费金额" v-model="queryParam.tranPrice" @pressEnter="enterKeySearch" placeholder="请输入资金交收金额"/>
            </BiCol>
            <BiCol>
              <BiFormItemDatePicker  label="申请交易日" v-model="queryParam.tranDt" />
            </BiCol>
            <BiCol>
              <BiFormItemInput label="实际成交金额" v-model="queryParam.tranPrice" @pressEnter="enterKeySearch" placeholder="请输入资金交收金额"/>
            </BiCol>
            <BiCol>
              <BiFormItemInput label="成交份额" v-model="queryParam.tranPrice" @pressEnter="enterKeySearch" placeholder="请输入资金交收金额"/>
            </BiCol>
            <BiCol>
              <BiFormItemDatePicker  label="实际成交日（净值型）" v-model="queryParam.tranDt" />
            </BiCol>
            <BiCol>
              <BiFormItemInput label="成交单位净值" v-model="queryParam.tranPrice" @pressEnter="enterKeySearch" placeholder="请输入资金交收金额"/>
            </BiCol>
            <BiCol>
              <BiFormItemDatePicker  label="净值日期/估值日" v-model="queryParam.tranDt" />
            </BiCol>
            <BiCol>
              <BiFormItemDatePicker  label="投资起息日（非净值型）" v-model="queryParam.tranDt" />
            </BiCol>
            <BiCol>
              <BiFormItemDatePicker  label="投资到期日" v-model="queryParam.tranDt" />
            </BiCol>
            <BiCol>
              <BiFormItemDatePicker  label="创建时间" v-model="queryParam.tranDt" />
            </BiCol>
            <BiCol>
              <BiFormItemDatePicker  label="修改时间" v-model="queryParam.tranDt" />
            </BiCol>
          </template>
          <BiCol>
            <BiTableSearchBtns @searchReset='searchReset' @searchQuery='searchQuery' v-model='advanced'/>
          </BiCol>
      
        </a-row>
      </a-form-model>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <!-- <a-button @click="handleAdd" type="primary" icon="plus">复制新增</a-button> -->
      <a-button type="primary" icon="download" @click="handleExportXls('订单总表')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
                @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
    </div>

    <!-- table区域- -->
    <div>
      <a-table class="table-min-height"
        ref="table"
        size="small"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :rowSelection="{fixed:true,selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :scroll="{ x: 1300 }"
        @change="handleTableChange">
      </a-table>
    </div>

    <trxOrders-modal ref="modalForm" @ok="modalFormOk"></trxOrders-modal>
  </a-card>
</template>

<script>

  import biTableMixin from '@/mixins/biTableMixin'
  import TrxOrdersModal from './modules/TrxOrdersModal'
  import dictMixin from '@mixins/dictMixin'

  export default {
    name: 'TrxOrdersList',
    mixins: [biTableMixin,dictMixin],
    components: {
      TrxOrdersModal
    },
    data() {
      return {
        // 高级搜索 展开/关闭
        advanced: false,
        description: '订单总表管理页面',
        // 表头
        columns: [
          {
            title: '序号',
            dataIndex: '',
            width: 70,
            key: 'rowIndex',
            align: 'center',
            customRender: function(t, r, index) {
              return parseInt(index) + 1
            },
            fixed: 'left'
          },
          {
            title: '交易大类',
            align: 'center',
            width: 100,
            dataIndex: 'odrCode'
          },
          {
            title: '交易类型',
            align: 'center',
            width: 100,
            dataIndex: 'prjCode'
          },
          {
            title: '交易细类',
            align: 'center',
            width: 100,
            dataIndex: 'accNo'
          },
          {
            title: '子账户名称',
            align: 'center',
            width: 100,
            dataIndex: 'accType'
          },
          {
            title: '产品名称',
            align: 'center',
            width: 100,
            dataIndex: 'odrtypeCode'
          },
          {
            title: '产品代码',
            align: 'center',
            width: 100,
            dataIndex: 'trantypeCode'
          },
          {
            title: '订单编号',
            align: 'center',
            width: 100,
            dataIndex: 'tranSubtypeCode'
          },
          {
            title: '收益率类型',
            align: 'center',
            width: 100,
            dataIndex: 'groupOdrType'
          },
          {
            title: '预期收益率',
            align: 'center',
            width: 100,
            dataIndex: 'groupOdrCode'
          },
          {
            title: '币别',
            align: 'center',
            width: 100,
            dataIndex: 'refOdrCode'
          },
          {
            title: '交易金额',
            align: 'center',
            width: 100,
            dataIndex: 'refContractNo'
          },
          {
            title: '交易份额',
            align: 'center',
            width: 100,
            dataIndex: 'proCode'
          },
          {
            title: '申请交易日期',
            align: 'center',
            width: 120,
            dataIndex: 'tranCurCode'
          },
          {
            title: '付款日/到账日',
            align: 'center',
            width: 120,
            dataIndex: 'tranDt'
          },
          {
            title: '产品购买合同号',
            align: 'center',
            width: 130,
            dataIndex: 'tranAmt'
          },
          {
            title: '成交金额',
            align: 'center',
            width: 100,
            dataIndex: 'payDt'
          },
          {
            title: '成交份额',
            align: 'center',
            width: 100,
            dataIndex: 'payAmt'
          },
          {
            title: '成交单位净值',
            align: 'center',
            width: 120,
            dataIndex: 'tranUnit'
          },
          {
            title: '净值日期',
            align: 'center',
            width: 100,
            dataIndex: 'tranPrice'
          },
          {
            title: '成交日',
            align: 'center',
            width: 100,
            dataIndex: 'imStyle'
          },
          {
            title: '起息日',
            align: 'center',
            width: 100,
            dataIndex: 'deciMaker'
          },
          {
            title: '到期日',
            align: 'center',
            width: 100,
            dataIndex: 'deciMakerOth'
          },
          {
            title: '算头算尾规则',
            align: 'center',
            width: 120,
            dataIndex: 'status'
          },
          {
            title: '退款金额',
            align: 'center',
            width: 100,
            dataIndex: 'statusDt'
          },
          {
            title: '退款日期',
            align: 'center',
            width: 100,
            dataIndex: 'createDataDt'
          },
          {
            title: '分配核算日',
            align: 'center',
            width: 100,
            dataIndex: 'partBargainYn'
          },
          {
            title: '转让协议编号',
            align: 'center',
            width: 120,
            dataIndex: 'cancelComment'
          },
          {
            title: '对方名称',
            align: 'center',
            width: 100,
            dataIndex: 'memo'
          },
          {
            title: '转让日前的收益同步转让',
            align: 'center',
            width: 190,
            dataIndex: 'invlmtComment'
          },
          {
            title: '实际转让价款',
            align: 'center',
            width: 120,
            dataIndex: 'mobilityComment'
          },
          {
            title: '收支金额',
            align: 'center',
            width: 100,
            dataIndex: 'createDt'
          },
          {
            title: '增减信托份额',
            align: 'center',
            width: 120,
            dataIndex: 'createBy'
          },
          {
            title: '信托本金增减',
            align: 'center',
            width: 120,
            dataIndex: 'modifyDt'
          },
          {
            title: '交易状态',
            align: 'center',
            width: 100,
            dataIndex: 'modifyBy'
          },
          {
            title: '投资决策人',
            align: 'center',
            width: 120,
            dataIndex: 'memoMustYn'
          },
          {
            title: '创建人',
            align: 'center',
            width: 100,
            dataIndex: 'deciMakerType'
          },
          {
            title: '创建时间',
            align: 'center',
            width: 100,
            dataIndex: 'planId'
          }
        ],
        url: {
          list: '/orders/list',
          delete: '/orders/delete',
          deleteBatch: '/orders/deleteBatch',
          exportXlsUrl: '/orders/exportXls',
          importExcelUrl: '/orders/importExcel'
        },
        dictOptions: {}
      }
    },
    computed: {
      importExcelUrl: function() {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
      }
    },
    methods: {
      toggleAdvanced () {
        this.advanced = !this.advanced
      },
      initDictConfig () {
        let promises = [this.getProAssetcats(),
          this.getAdmOrgnaiztionInfo({ ORG_SUBTYPE:'PIS',REMOVE_YN:'N' }),
          this.getDict('CAP_IN_EXP,CAP_STATUS,CUR_CODE,TRX_TRANTYPES')
        ]
        Promise.all(promises).then(()=>{
          this.loadData()
        })
      },
    },
    created () {
      this.initDictConfig()
    }
  }
</script>
<style lang="stylus" scoped>
  @import '~@assets/less/common.less'
</style>