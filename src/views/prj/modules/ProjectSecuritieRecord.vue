<template>
  <div>
  <a-card size="small" title="查询条件" :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form-model layout="inline">
        <a-row :gutter="16">
          <BiCol>
            <BiFormItemInput label="项目名称" v-model="queryParam.prjName"  placeholder="请输入项目名称"/>
          </BiCol>
          <BiCol>
            <BiFormItemSelect :options="dicts.PRJ_SEC_COMPANY" label="证券公司"  v-model="queryParam.seCompany" />
          </BiCol>
          <BiCol>
            <BiFormItemInput label="资金账号" v-model="queryParam.account"  placeholder="请输入资金账号"/>
          </BiCol>
          <BiCol>
            <BiTableSearchBtns @searchReset='searchReset' @searchQuery='searchQuery' :isAdvanced='false'/>
          </BiCol>
        </a-row>
      </a-form-model>
    </div>
  </a-card>
  <div style="background:rgb(240,242,245);">
      <a-form-model>
            <a-card :bordered="false">
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
                @change="handleTableChange"
              >
              </a-table>
            </a-card>
      </a-form-model>
  </div>
  </div>
</template>

<script>
  import dictMixin from '@mixins/dictMixin'
  import biTableMixin from '@mixins/biTableMixin'
  import { getAction,httpAction } from '../../../api/manage'
  export default {
    name: 'ProjectSecuritieRecord',
    components: {
    },
    mixins:[biTableMixin,dictMixin],
    computed:{
    },
    watch:{
    },
    data () {
      return {
        queryParam:{
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
            title: '发生日期',
            align: 'center',
            dataIndex: 'accName',
          },
          {
            title: '买卖类别',
            align: 'center',
            dataIndex: 'bnfMode',
            customRender: function (text) {
              return filterDictText(that.dictOptionsData['BNF_MODE'], text)
            },
          },
          {
            title: '证券代码',
            align: 'center',
            dataIndex: 'imStyle',
            customRender: function (text) {
              return filterDictText(that.dictOptionsData['IM_STYLE'], text)
            },
          },
          {
            title: '证券名称',
            align: 'center',
            dataIndex: 'imSubStyle',
            customRender: function (text) {
              return filterDictText(that.dictOptionsData['IM_SUB_STYLE'], text)
            },
          },
          {
            title: '成交数量',
            align: 'center',
            dataIndex: 'feeYn',
            customRender: function (text) {
              return filterDictText(that.dictOptionsData['y_n'], text)
            },
          },
          {
            title: '成交价格',
            align: 'center',
            dataIndex: 'voaYn',
          },
          {
            title: '总发生金额',
            align: 'center',
            dataIndex: 'voaYn',
          },
          {
            title: '手续费',
            align: 'center',
            dataIndex: 'voaYn',
          },
          {
            title: '印花税',
            align: 'center',
            dataIndex: 'voaYn',
          },
          {
            title: '过户费',
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
      this.getDict('PRJ_SEC_COMPANY');
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