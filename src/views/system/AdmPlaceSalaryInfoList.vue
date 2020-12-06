<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="地区名">
              <a-input placeholder="请输入地区名" v-model="queryParam.placeName"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="平均薪资">
                <a-input placeholder="请输入平均薪资" v-model="queryParam.placeSalary"></a-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="时间">
                <a-input placeholder="请输入当前薪资对应的时间" v-model="queryParam.placeSalaryTime"></a-input>
              </a-form-item>
            </a-col>
          </template>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete" />删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a
        >项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <admPlaceSalaryInfo-modal ref="modalForm" @ok="modalFormOk"></admPlaceSalaryInfo-modal>
  </a-card>
</template>

<script>
import AdmPlaceSalaryInfoModal from './modules/AdmPlaceSalaryInfoModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterDictText } from '@/components/dict/JDictSelectUtil'
import { initDictOptionsBatch } from '../../components/dict/JDictSelectUtil'

export default {
  name: 'AdmPlaceSalaryInfoList',
  mixins: [JeecgListMixin],
  components: {
    AdmPlaceSalaryInfoModal,
  },
  data() {
    return {
      description: '地区平均薪资管理页面',
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          },
        },
        {
          title: '地区名',
          align: 'center',
          dataIndex: 'placeName',
          customRender: (text) => {
            //字典值替换通用方法
            return filterDictText(this.dictOptionsData['DIS_PRO'], text)
          },
        },
        {
          title: '地区编号',
          align: 'center',
          dataIndex: 'placeCode',
        },
        {
          title: '平均薪资',
          align: 'center',
          dataIndex: 'placeSalary',
        },
        {
          title: '当前薪资对应的年份',
          align: 'center',
          dataIndex: 'placeSalaryTime',
        },
        {
          title: '创建人',
          align: 'center',
          dataIndex: 'createBy',
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime',
        },
        {
          title: '更新人',
          align: 'center',
          dataIndex: 'updateBy',
        },
        {
          title: '更新时间',
          align: 'center',
          dataIndex: 'updateTime',
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list: '/admPlaceSalaryInfo/list',
        delete: '/admPlaceSalaryInfo/delete',
        edit: 'admPlaceSalaryInfo/edit',
        deleteBatch: '/admPlaceSalaryInfo/deleteBatch',
        exportXlsUrl: 'admPlaceSalaryInfo/exportXls',
        importExcelUrl: 'admPlaceSalaryInfo/importExcel',
      },
      dictOptionsData: [],
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },
  methods: {
    initDictConfig() {
      //初始化字典 - 是否估值
      let that = this
      initDictOptionsBatch('DIS_PRO').then((res) => {
        if (res.success) {
          that.dictOptionsData = res.result
        }
      })
    },
  },
  created () {
    this.initDictConfig();
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>