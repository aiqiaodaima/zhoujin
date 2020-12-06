<template>
      <a-card :bordered="false">
        <div class="salesCard">
          <a-tabs defaultActiveKey="product"  size="large" @change="changeCard">
            <a-tab-pane key="product" tab="资产概要信息" forceRender>
              <asset-detail ref="AssetDetail"></asset-detail>
            </a-tab-pane>
            <a-tab-pane key="bonus" tab="分红明细" forceRender>
              <bonus-rule-detail ref="BonusRuleDetail"></bonus-rule-detail>
            </a-tab-pane>
            <a-tab-pane key="open" tab="开放期明细" forceRender>
              <open-rule-detail ref="OpenRuleDetail"></open-rule-detail>
            </a-tab-pane>
            <a-tab-pane key="netValue" tab="资产价格明细" forceRender>
              <net-value-list ref="NetValueList"></net-value-list>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-card>
</template>
<script>
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import AssetDetail from '@views/asset/AssetDetail'
  import BonusRuleDetail from '@views/asset/BonusRuleDetail'
  import OpenRuleDetail from '@views/asset/OpenRuleDetail'
  import NetValueList from '@views/asset/NetValueList'

  export default {
    name: 'AssetView',
    mixins: [JeecgListMixin],
    components: {
      NetValueList,
      OpenRuleDetail,
      AssetDetail,
      BonusRuleDetail

    },
    data() {
      return {
        proCode:this.$route.query.proCode,
      }
    },
    methods: {
      changeCard(key) {
        /*if (key=='bonus')
        this.$refs.BonusRuleDetail.open(this.$route.query.proCode);*/
      },
    },
    created() {
    },
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>