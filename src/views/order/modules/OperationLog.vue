/**
  操作日志
 */
<template>
  <a-card  style="margin-top: 12px" :bordered="false" title="操作日志">
    <a-table
      ref="table"
      size="small"
      rowKey="id"
      :columns="operationColumns"
      :dataSource="operationLogs"
      :pagination="true"
    >
    </a-table>
  </a-card>
</template>
<script>
import { mapState, } from "vuex";

export default {
  name: "OperationLog",
  data() {
    return {
      operationColumns: [
        {
          title: '操作类型',
          dataIndex: 'optType',
          key: 'optType'
        },
        {
          title: '操作内容',
          dataIndex: 'oprations',
          key: 'oprations'
        },
        {
          title: '操作人',
          dataIndex: 'oprator',
          key: 'oprator'
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
          key: 'createDt'
        },
        {
          title: '操作日志备注',
          dataIndex: 'memo',
          key: 'memo'
        }
      ],
    }
  },
  computed: {
    ...mapState("order", [
      "operationLogs"
    ]),
  },
  components: {
  
  },
  props: {

  },
  methods: {
   
  },
  created(){
  }
 
}
</script>
<style lang="stylus" scoped>

</style>