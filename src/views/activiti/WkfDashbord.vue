<template>
  <div class="page-header-index-wide">
    <a-row style="padding-top: 10px;">
      <a-card title="审核流程" :body-style="{padding: '1'}">
        <div class="salesCard">
          <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
            <a-tab-pane loading="true" tab="未完成审核单" key="1">
              <a-row>
                <wkf-task-list></wkf-task-list>
              </a-row>
            </a-tab-pane>
            <a-tab-pane tab="历史审核单" key="2">
              <a-row>
                <wkf-task-his-list></wkf-task-his-list>
              </a-row>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-card>
    </a-row>
  </div>
</template>

<script>
  import ACol from "ant-design-vue/es/grid/Col"
  import ATooltip from "ant-design-vue/es/tooltip/Tooltip"
  import WkfTaskList from "./WkfTaskList";
  import WkfTaskHisList from "./WkfTaskHisList";

  export default {
    name: "WkfDashbord",
    components: {
      ATooltip,
      ACol,
      WkfTaskList,
      WkfTaskHisList
    },
    data() {
      return {
        center: null
      }
    },
    created() {

    },
    methods: {
      handleTodo(record) {
        this.$refs.wkfAuditModal.audit(record);
      },
      handleClaim(record){
        console.dir(record);
      },
      handleCancle(record){
        console.dir(record);
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>