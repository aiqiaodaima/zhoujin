<template>
  <div class="page-header-index-wide">
      <a-card>
        <div class="salesCard">
          <a-tabs default-active-key="1" size="small" :tab-bar-style="{marginBottom: '0px', paddingLeft: '0px',marginTop: '0px'}" v-if="editType!='add'">
            <a-tab-pane loading="true" tab="基本信息" key="1">
              <a-row>
                <base-info :partyCode="partyCode" :clientType="clientType" :optType="optType"></base-info>
              </a-row>
            </a-tab-pane>
            <a-tab-pane tab="尽调信息" key="2">
              <a-row>
                <to-tune-info :partyCode="partyCode" :clientType="clientType" :optType="optType"></to-tune-info>
              </a-row>
            </a-tab-pane>
            <a-tab-pane tab="关联项目" key="3">
              <a-row>
                <associated-projects :partyCode="partyCode" :optType="optType"></associated-projects>
              </a-row>
            </a-tab-pane>
          </a-tabs>
          <base-info  v-else :partyCode="partyCode" :clientType="clientType" :optType="optType"></base-info>
        </div>
      </a-card>
  </div>
</template>

<script>
  import ACol from "ant-design-vue/es/grid/Col"
  import ATooltip from "ant-design-vue/es/tooltip/Tooltip"
  import BaseInfo from "./BaseInfo";
  import ToTuneInfo from "./ToTuneInfo";
  import AssociatedProjects from "./AssociatedProjects";
  export default {
    name: "CustomerInfo",
    
    components: {
      ATooltip,
      ACol,
      BaseInfo,
      AssociatedProjects,
      ToTuneInfo
    },
    data() {
      return {
        editType:'add',
        center: null,
        partyCode:'',
        clientType:'',
        optType:'add'
      }
    },
    created() {
      this.partyCode=this.$route.query.partyCode
      this.clientType=this.$route.query.clientType
      this.editType=this.$route.query.editType
      this.optType=this.$route.query.optType
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped>
 /deep/ .ant-card-bordered .ant-card-body{
  padding: 3px 24px 0 !important;
}
</style>