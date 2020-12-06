<template>
  <div class="page-header-index-wide">
      <a-card>
        <div class="salesCard">
          <a-tabs default-active-key="1" size="small" :tab-bar-style="{marginBottom: '24px', paddingLeft: '0px',marginTop: '0px'}">
            <a-tab-pane loading="true" tab="委托人信息" key="1">
              <a-row>
                <client-modal :id="id" :optType="optType" :ddCode="ddCode" :clientType="clientType" :partyCode="partyCode"></client-modal>
              </a-row>
            </a-tab-pane>
            <a-tab-pane tab="受益人信息" key="2">
              <a-row>
                <beneficiary :id="id" :optType="optType" :ddCode="ddCode" :partyCode="partyCode"></beneficiary>
              </a-row>
            </a-tab-pane>
            <a-tab-pane tab="其他关系人" key="3">
              <a-row>
                <other-relation :id="id" :optType="optType" :ddCode="ddCode" :partyCode="partyCode"></other-relation>
              </a-row>
            </a-tab-pane>
            <a-tab-pane tab="分配方案" key="4">
              <a-row>
                <allocation-scheme :id="id" :optType="optType" :ddCode="ddCode" :partyCode="partyCode"></allocation-scheme>
              </a-row>
            </a-tab-pane>
            <a-tab-pane tab="信托财产信息" key="5">
              <a-row>
                <trust-estate :id="id" :optType="optType" :ddCode="ddCode" :partyCode="partyCode"></trust-estate>
              </a-row>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-card>
  </div>
</template>

<script>
  import ACol from "ant-design-vue/es/grid/Col"
  import ATooltip from "ant-design-vue/es/tooltip/Tooltip"
  import ClientModal from "./modules/ClientModal"
  import TrustEstate from "./modules/TrustEstate"
  import Beneficiary from "./modules/Beneficiary"
  import AllocationScheme from "./modules/AllocationScheme"
  import OtherRelation from "./modules/OtherRelation"
  export default {
    name: "UpholdToTune",
    components: {
      TrustEstate,
      ATooltip,
      ACol,
      Beneficiary,
      AllocationScheme,
      OtherRelation,
      ClientModal
    },
    data() {
      return {
        ddCode:'',
        center: null,
        optType:'add'
      }
    },
    created() {
      this.ddCode=this.$route.query.ddCode
      this.partyCode=this.$route.query.partyCode
      this.id=this.$route.query.id
      this.optType=this.$route.query.optType
      this.clientType=this.$route.query.clientType
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