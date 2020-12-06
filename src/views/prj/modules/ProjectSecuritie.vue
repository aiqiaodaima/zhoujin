<template>
  <div style="background:rgb(240,242,245);">
      <a-form-model>
            <a-card size="small" title="证券持仓" :bordered="false">
              <a-table
                :scroll="{ x: 2500,y: 400 }"
                ref="table"
                bordered
                size="small"
                rowKey="id"
                :columns="columns"
                :dataSource="dataSource"
                :pagination="ipagination"
                :loading="loading"
              >
              </a-table>
            </a-card>
      </a-form-model>
  </div>
</template>

<script>
  import dictMixin from '@mixins/dictMixin'
  import biTableMixin from '@mixins/biTableMixin'
  import { getAction,httpAction } from '../../../api/manage'
  export default {
    name: 'ProjectSecuritie',
    components: {
    },
    mixins:[biTableMixin,dictMixin],
    computed:{
    },
    watch:{
    },
    data () {
      return {
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
            title: '资金账户股票市值',
            align: 'center',
            dataIndex: 'accName',
          },
          {
            title: '资金账户总资产',
            align: 'center',
            dataIndex: 'bnfMode',
            customRender: function (text) {
              return filterDictText(that.dictOptionsData['BNF_MODE'], text)
            },
          },
          {
            title: '资金账户资金余额',
            align: 'center',
            dataIndex: 'imStyle',
            customRender: function (text) {
              return filterDictText(that.dictOptionsData['IM_STYLE'], text)
            },
          },
          {
            title: '资金账户资金可用',
            align: 'center',
            dataIndex: 'imSubStyle',
            customRender: function (text) {
              return filterDictText(that.dictOptionsData['IM_SUB_STYLE'], text)
            },
          },
          {
            title: '交易市场',
            align: 'center',
            dataIndex: 'feeYn',
            customRender: function (text) {
              return filterDictText(that.dictOptionsData['y_n'], text)
            },
          },
          {
            title: '证券代码',
            align: 'center',
            dataIndex: 'voaYn',
          },
          {
            title: '证券名称',
            align: 'center',
            dataIndex: 'voaYn',
          },
          {
            title: '当前余额',
            align: 'center',
            dataIndex: 'voaYn',
          },
          {
            title: '市值',
            align: 'center',
            dataIndex: 'voaYn',
          },
          {
            title: '成本价',
            align: 'center',
            dataIndex: 'voaYn',
          },
          {
            title: '证券市值',
            align: 'center',
            dataIndex: 'voaYn',
          },
          {
            title: '项目名称',
            align: 'center',
            dataIndex: 'voaYn',
          },
          {
            title: '证券公司',
            align: 'center',
            dataIndex: 'voaYn',
          },
          {
            title: '证券资金账号',
            align: 'center',
            dataIndex: 'voaYn',
          },
        ],
        url:{
          action:'/prj/savePrjEle',
          findByPrjCode:'/prj/findByPrjCode'
        },
      }
    },
    created () {
    },
    mounted () {
    },
    methods:{
    }
  }
</script>

<style scoped>
  .ant-col {
    padding-left:0 !important;
  }
</style>