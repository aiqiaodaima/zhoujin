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
            <BiFormItemSelect :options="dicts.DIS_TYPE" label="报告类型" v-model="queryParam.reportType" />
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
                <span slot="action" slot-scope="text, record">
        <a @click="handleView(record)">查看</a>
      </span>
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
    name: 'ProjectInfoReport',
    components: {
    },
    mixins:[biTableMixin,dictMixin],
    computed:{
    },
    watch:{
    },
    data () {
      return {
        queryParam:{},
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
            title: '项目名称',
            align: 'center',
            dataIndex: 'accName',
          },
          {
            title: '报告类型',
            align: 'center',
            dataIndex: 'bnfMode',
            customRender: function (text) {
              return filterDictText(that.dictOptionsData['BNF_MODE'], text)
            },
          },
          {
            title: '报告区间',
            align: 'center',
            dataIndex: 'imStyle',
            customRender: function (text) {
              return filterDictText(that.dictOptionsData['IM_STYLE'], text)
            },
          },
          {
            title: '披露对象',
            align: 'center',
            dataIndex: 'imSubStyle',
            customRender: function (text) {
              return filterDictText(that.dictOptionsData['IM_SUB_STYLE'], text)
            },
          },
          {
            title: '披露方式',
            align: 'center',
            dataIndex: 'feeYn',
            customRender: function (text) {
              return filterDictText(that.dictOptionsData['y_n'], text)
            },
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
      this.getDict('DIS_RPT_TYPE');
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