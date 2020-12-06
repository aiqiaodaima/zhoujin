/**
  交易基本信息
 */ 
<template>
  <detail-list size="small" :col="2" style="padding-left:10%">
    <detail-list-item v-if="'batchId' in detailData" term="交易编号">{{detailData.batchId || '--'}}</detail-list-item>
    <detail-list-item v-if="'orderNumbers' in detailData" term="交易编号">{{detailData.orderNumbers || '--'}}</detail-list-item>
    <detail-list-item v-if="'createBy' in detailData" term="交易创建人">{{detailData.createBy || '--'}}</detail-list-item>
    <!-- <detail-list-item v-if="'createDt' in detailData" term="创建时间">{{detailData.createDt || '--'}}</detail-list-item> -->
    <!-- <detail-list-item v-if="'deciMakerType' in detailData" term="投资决策人">{{getDictNameByCode(dicts.DECI_MAKER_TYPE,detailData.deciMakerType)|| '--'}}</detail-list-item> -->
    <!-- <detail-list-item v-if="'curCode' in detailData" term="币种">人民币</detail-list-item> -->
    <!-- <detail-list-item v-if="'planPayDt' in detailData" term="申请交易日期">{{detailData.planPayDt || '--'}}</detail-list-item> -->
  </detail-list>
</template>
<script>
import moment from 'moment';
import DetailList from '@bi/BiDetailList'
import dictMixin from '@mixins/dictMixin'

const DetailListItem = DetailList.Item

export default {
  name: "BasicInformation",
  components: {
    DetailList,DetailListItem,
  },
  props: {
    detailData:{
      default(){
        return {
          batchId: '',
          createBy: '',
          createDt: '',
          deciMakerType: '',
          curCode: '',
          planPayDt: '',
          orderNumbers:''
        }
      }
    }
  },
  mixins: [dictMixin],
  methods: {
    moment,
  },
  created() {
    this.getDict('DECI_MAKER_TYPE')
  },
}
</script>
<style lang="stylus" scoped>

</style>