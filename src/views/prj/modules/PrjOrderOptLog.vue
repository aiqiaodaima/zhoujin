<template>
  <a-card style="margin-top: 12px" :bordered="false" title="操作日志">
    <a-table
      ref="table"
      size="small"
      rowKey="id"
      :columns="operationColumns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="isLoading"
      @change="handleTableChange"
    >
    </a-table>
  </a-card>
</template>
<script>
import { mapState } from 'vuex'
import { ordersOptLogsList } from '@/api/BiApi'

export default {
  name: 'PrjOrderOptLog',
  data() {
    return {
      /* 数据源 */
      dataSource: [],
      /* 分页参数 */
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
      },
      isLoading: false,
      operationColumns: [
        {
          title: '操作类型',
          dataIndex: 'optType',
          key: 'optType',
        },
        {
          title: '操作内容',
          dataIndex: 'oprations',
          key: 'oprations',
        },
        {
          title: '操作人',
          dataIndex: 'oprator',
          key: 'oprator',
        },
        {
          title: '流程状态',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: '操作时间',
          dataIndex: 'createDt',
          key: 'createDt',
        },
        {
          title: '备注',
          dataIndex: 'memo',
          key: 'memo',
        },
      ],
    }
  },
  watch: {
    operationLogs() {
      if (this.operationLogs.records) {
        this.isLoading = false
        this.dataSource = this.operationLogs.records
        this.ipagination.current = 1
        this.ipagination.total = this.operationLogs.total
      }
    },
  },
  computed: {
    ...mapState('project', ['operationLogs', 'batchId']),
  },
  components: {},
  props: {},
  methods: {
    async loadData(arg) {
      this.loading = true
      let param = {}
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      param.batchId = this.batchId
      const { result } = await ordersOptLogsList(param)
      if (result.records) {
        this.dataSource = result.records
        this.ipagination.total = result.total
      }
      this.loading = false
    },
    handleTableChange(pagination, filters, sorter) {
      //分页、排序、筛选变化时触发
      //TODO 筛选
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field
        this.isorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
      }
      this.ipagination = pagination
      this.loadData()
    },
  },
  created() {},
}
</script>
<style lang="stylus" scoped></style>