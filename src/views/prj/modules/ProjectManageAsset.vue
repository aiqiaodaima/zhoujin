<template>
  <div style="background:rgb(240,242,245);">
      <a-form-model>
            <a-card size="small" title="管理类资产" :bordered="false">
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
                 <span slot="action" slot-scope="text, record">
        <a @click="handleView(record)">查看</a>
      </span>
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
    name: 'ProjectManageAsset',
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
            title: '子账户',
            align: 'center',
            dataIndex: 'accName',
          },
          {
            title: '资产类型',
            align: 'center',
            dataIndex: 'bnfMode',
            customRender: function (text) {
              return filterDictText(that.dictOptionsData['BNF_MODE'], text)
            },
          },
          {
            title: '资产名称',
            align: 'center',
            dataIndex: 'imStyle',
            customRender: function (text) {
              return filterDictText(that.dictOptionsData['IM_STYLE'], text)
            },
          },
          {
            title: '资产代码',
            align: 'center',
            dataIndex: 'imSubStyle',
            customRender: function (text) {
              return filterDictText(that.dictOptionsData['IM_SUB_STYLE'], text)
            },
          },
          {
            title: '剩余价值',
            align: 'center',
            dataIndex: 'feeYn',
            customRender: function (text) {
              return filterDictText(that.dictOptionsData['y_n'], text)
            },
          },
          {
            title: '剩余份额/比例',
            align: 'center',
            dataIndex: 'voaYn',
          },
          {
            title: '取得日期',
            align: 'center',
            dataIndex: 'voaYn',
          },
          {
            title: '委托份额',
            align: 'center',
            dataIndex: 'voaYn',
          },
          {
            title: '委托价值',
            align: 'center',
            dataIndex: 'voaYn',
          },
          {
            title: '累计变现金额',
            align: 'center',
            dataIndex: 'voaYn',
          },
          {
            title: '累计分红金额',
            align: 'center',
            dataIndex: 'voaYn',
          },
          {
            title: '所有权证类型',
            align: 'center',
            dataIndex: 'voaYn',
          },
          {
            title: '权属证号',
            align: 'center',
            dataIndex: 'voaYn',
          },
          {
            title: '是否计信托份额',
            align: 'center',
            dataIndex: 'voaYn',
          },
          {
            title: '是否收费',
            align: 'center',
            dataIndex: 'voaYn',
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