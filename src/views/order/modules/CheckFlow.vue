/**
  申请审核
 */
<template>
  <a-card size="small" title="审核单的流程图" style="margin-top: 12px" :bordered="false">
    <!-- <a-table :columns="checkFlowColumns" :dataSource="checkFlow" rowKey="id" row >
    </a-table>
    <p>流程图图片</p> -->
    <WkfAuditHis ref="his"/>
  </a-card>
</template>
<script>
import WkfAuditHis from "@views/activiti/modules/WkfAuditHis";
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  name: "CheckFlow",
  data() {
    return {
      checkFlowColumns: [
        {
          title: '操作部门',
          dataIndex: '',
          key:'rowIndex',
          width:70,
          align:"center",
        },{
          title:'申请人/审核人',
          width:120,
          dataIndex: 'col1',
        },{
          title:'创建时间',
          width:120,
          dataIndex: 'col2',
          scopedSlots: { customRender: 'col2' }
        },{
          title:'审核时间',
          dataIndex: 'col3',
          scopedSlots: { customRender: 'col3' }
        },{
          title:'是否同意',
          dataIndex: 'col4',
          scopedSlots: { customRender: 'col4' }
        },{
          title:'审核意见',
          dataIndex: 'col5',
          scopedSlots: { customRender: 'col5' }
        },
      ],//审核流程表格
      checkFlow:[], //审核流程表格
    }
  },
  components: {
    WkfAuditHis
  },
  props: {
  },
  computed: {
    ...mapState("order", [
      "taskId"
    ]),
  },
  methods: {
    getAuditHis(taskId){
      this.$refs.his.initPage(null, {taskId});
    }
  },
  mounted() {
  },
 
}
</script>
<style lang="stylus" scoped>

</style>