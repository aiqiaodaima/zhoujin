/**
  订单基本信息右侧额外显示
 */
<template>
  <a-row  class="status-list">
    <!-- <a-col :xs="12" :sm="12">
      <div class="text">状态</div>
      <div class="heading">--</div>
    </a-col> -->
    <a-col :xs="18" :sm="18">
      <div class="text">订单总金额</div>
      <div class="heading">¥ {{ f(sumAmt,2) }}</div>
    </a-col>
  </a-row>
</template>
<script>
import { formatAmt } from '@utils/util'
export default {
  name: "BasicInformationExtra",
  components: {
  },
  props: {
    sumAmt:{
      default: '--'
    }
  },
  methods: {
    f(amt){
      return formatAmt(amt,2);
    }
  },
  provide () {
  }
}
</script>
<style lang="stylus" scoped>
.mobile {
  .status-list {
    text-align: left;
  }
}
.text {
  color: rgba(0, 0, 0, .45);
}

.heading {
  color: rgba(0, 0, 0, .85);
  font-size: 20px;
}
  
</style>