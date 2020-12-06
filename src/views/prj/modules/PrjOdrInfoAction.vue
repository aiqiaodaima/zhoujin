/**
  订单基本信息按钮
  submit:提交
  comfirmTransfer：确认划款
  cancleOrder:取消订单
  tradeSuccess:交易成功
  tradeFail:交易失败
 */
<template>
  <div>
    <a-button class="btn-margin" v-if="status==='0'" type="primary" @click="buttonClick('withdraw')">强制撤回</a-button>
<!--    <a-button class="btn-margin" v-if="status==80" @click="tempSave">保存草稿</a-button>-->
    <a-button class="btn-margin" v-if="status==='10'" type="primary" @click="buttonClick('comfirmTransfer')">确认划款</a-button>
    <a-button class="btn-margin" v-if="status==='10'" type="primary" @click="buttonClick('cancleOrder')">取消订单</a-button>
    <a-button class="btn-margin" v-if="status==='20'" type="primary" @click="buttonClick('tradeSuccess')">确认份额</a-button>
    <a-button class="btn-margin" v-if="status==='20'" type="primary" @click="buttonClick('tradeFail')">取消交易</a-button>
    <a-button  type="primary" v-if="status==='80' || status === '5'" @click="buttonClick('submit')">提交复核</a-button>
  </div>
</template>
<script>
  import { mapState } from "vuex";

  export default {
    name: "PrjOdrInfoAction",
    components: {

    },
    computed: {
      ...mapState("project", [
        "current","statusName","status"
      ]),
    },
    props: {

    },
    methods: {
      buttonClick(event){
        this.$emit(event);
      }
    },
    provide () {
    }
  }
</script>
<style lang="stylus" scoped>
  .btn-margin{
    margin-right: 10px;
  }
</style>
