<template>
  <div>
    <detail-list size="small" :col="2" style="padding-left:10%">
      <detail-list-item v-if="'batchId' in detailData" term="订单编号">{{detailData.batchId || '--'}}</detail-list-item>
      <detail-list-item v-if="'trustPrjName' in detailData" term="项目名称">{{detailData.trustPrjName || '--'}}</detail-list-item>
      <detail-list-item v-if="'createBy' in detailData" term="订单创建人">{{detailData.createBy || '--'}}</detail-list-item>
      <detail-list-item v-if="'createDt' in detailData" term="创建时间">{{detailData.createDt || '--'}}</detail-list-item>
      <detail-list-item v-if="'period' in detailData" term="委托期次">{{ detailData.period || '初始委托'}}</detail-list-item>
      <detail-list-item v-if="'curCode' in detailData" term="币种">{{ getDictNameByCode(dicts.CUR_CODE,detailData.curCode) }}</detail-list-item>
    </detail-list>
  </div>

</template>
<script>
import moment from 'moment';
import dictMixin from '@mixins/dictMixin'
import DetailList from '../../../components/BI/BiDetailList'

const DetailListItem = DetailList.Item

export default {
  name: "PrjOdrBasicInfo",
  components: {
    DetailList,DetailListItem
  },
  props: {
    detailData:{
      default(){
        return {
          batchId: '',
          trustPrjName: '',
          createBy: '',
          createDt: '',
          period: '',
          curCode: '156'
        }
      }
    }
  },
  mixins: [dictMixin],
  methods: {
    moment,
  },
  created() {
    this.getDict('CUR_CODE')
  },
}
</script>
<style lang="stylus" scoped>

</style>