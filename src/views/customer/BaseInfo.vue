<template>
  <div class="page-header-index-wide">
    <a-row style="padding-top: 10px;">
      <a-card>
        <div class="salesCard">
          <a-tabs class="in-ant-tabs-bar" :default-active-key="clientType=='all'?'1':clientType" size="small" :tab-bar-style="{marginBottom: '24px', paddingLeft: '0',paddingTop: '6px'}">
            <a-tab-pane loading="true" tab="自然人" key="1" v-if="clientType=='1'||clientType=='all'">
              <a-row>
                <natural-person :partyCode="partyCode" :optType="optType"></natural-person>
              </a-row>
            </a-tab-pane>
            <a-tab-pane tab="机构" key="2" v-if="clientType=='2'||clientType=='all'">
              <a-row>
                <mechanism :partyCode="partyCode" :optType="optType"></mechanism>
              </a-row>
            </a-tab-pane>
            <a-tab-pane tab="金融产品" key="3" v-if="clientType=='3'||clientType=='all'">
              <a-row>
                <financePro :partyCode="partyCode" :optType="optType"></financePro>
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
  import NaturalPerson from "./NaturalPerson"
  import Mechanism from "./Mechanism"
  import FinancePro from "./FinancePro"
  export default {
    name: "CustomerInfo",
    components: {
      ATooltip,
      ACol,
      NaturalPerson,
      FinancePro,
      Mechanism
    },
    props: {
      clientType: {
        default: '1'
      },
      partyCode:{
        default: ''
      },
      optType:{
        default: 'add'
      },
    },
    data() {
      return {
        center: null
      }
    },
    created() {
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped>
/deep/ .ant-row>.ant-card-bordered>.ant-card-body{
  padding: 0 !important;
}
/deep/.ant-tabs-bar{
  margin: 0 !important;
}
/deep/ .in-ant-tabs-bar{
  background: #f2f2f2;
}
/deep/ .ant-tabs-nav .ant-tabs-tab{
  margin: 0;
}
/deep/ .ant-tabs-nav .ant-tabs-tab-active{
  background: #fff;
}
</style>