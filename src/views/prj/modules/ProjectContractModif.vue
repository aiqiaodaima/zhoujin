<template>
  <div>
  <a-card size="small" title="查询条件" :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form-model layout="inline">
        <a-row :gutter="16">
            <BiCol>
              <BiFormItemInput label="维护人" v-model="queryParam.maintainer"  placeholder="请输入维护人"/>
            </BiCol>
            <BiCol>
              <BiFormItemDatePicker label="维护日期" dateFormat='YYYY-MM-DD' v-model="queryParam.maintenDate"/>
            </BiCol>
            <BiCol>
              <BiFormItemSelect :options="dicts.PRJ_OPERATION_TYPE" label="操作类型"  v-model="queryParam.operationType" />
            </BiCol>
          <BiCol>
            <BiFormItemInput label="维护要素" v-model="queryParam.maintenEle"  placeholder="请输入维护要素"/>
          </BiCol>
            <BiCol>
              <BiFormItemInput label="维护功能名称" v-model="queryParam.maintenFunName"  placeholder="请输入维护功能名称"/>
            </BiCol>
          <BiCol>
            <BiFormItemInput label="维护对象" v-model="queryParam.maintenObject"  placeholder="请输入维护对象"/>
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
        修改
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
  import BiCol from '../../../components/BI/BiCol'
  export default {
    name: 'ProjectContractModif',
    components: {
      BiCol
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
            title: '维护人',
            align: 'center',
            dataIndex: 'accName',
          },
          {
            title: '维护时间',
            align: 'center',
            dataIndex: 'bnfMode',
            customRender: function (text) {
              return filterDictText(that.dictOptionsData['BNF_MODE'], text)
            },
          },
          {
            title: '维护功能名称',
            align: 'center',
            dataIndex: 'imStyle',
            customRender: function (text) {
              return filterDictText(that.dictOptionsData['IM_STYLE'], text)
            },
          },
          {
            title: '维护对象',
            align: 'center',
            dataIndex: 'imSubStyle',
            customRender: function (text) {
              return filterDictText(that.dictOptionsData['IM_SUB_STYLE'], text)
            },
          },
          {
            title: '维护要素',
            align: 'center',
            dataIndex: 'feeYn',
            customRender: function (text) {
              return filterDictText(that.dictOptionsData['y_n'], text)
            },
          },
          {
            title: '维护前值',
            align: 'center',
            dataIndex: 'feeYn',
            customRender: function (text) {
              return filterDictText(that.dictOptionsData['y_n'], text)
            },
          },
          {
            title: '维护后值',
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
      this.getDict('PRJ_OPERATION_TYPE');
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