/**
  订单基本信息按钮
  tempSave:暂存
  submit:提交
  comfirmTransfer：确认划款
  cancleOrder:取消订单
  tradeSuccess:交易成功
  tradeFail:交易失败
  comfirmUnit：扣减份额
  sureAccount: 确认到账
  mandatoryWithdrawal:强制撤回
 */
<template>
  <div class="btns-order">
    <a-popconfirm title="确定取消所有订单吗?" @confirm="mandatoryWithdrawal">
      <a-button class="btn-margin" v-if="status==0" type="primary">强制撤回</a-button>
    </a-popconfirm>
    <a-button class="btn-margin" v-if="status==80" @click="tempSave">保存草稿</a-button>
    <a-button class="btn-margin" v-if="status==10" type="primary" @click="comfirmTransfer">确认划款</a-button>
    <a-popconfirm title="确定取消所有订单吗?" @confirm="cancleOrder">
      <a-button class="btn-margin" v-if="status==10||status==70 || status==30 || status==35 " type="danger">取消订单</a-button>
    </a-popconfirm>
    <a-button class="btn-margin" v-if="status==20||status==85" type="primary" @click="tradeSuccess">交易成功</a-button>
    <a-popconfirm title="确定所有订单交易失败吗?" @confirm="tradeFail">
      <a-button class="btn-margin" v-if="status==20 || status==75 || status==85" type="danger">交易失败</a-button>
    </a-popconfirm>
    <a-button class="btn-margin" v-if="status==70" type="primary" @click="comfirmUnit">扣减份额</a-button>
    <a-button class="btn-margin" v-if="status==30" type="primary" @click="comfirmTranUnit">确认扣减信托份额</a-button>
    <a-button class="btn-margin" v-if="status==35" type="primary" @click="comfirmAssetUnit">确认扣减资产份额</a-button>
    <a-button class="btn-margin" v-if="status==75" type="primary" @click="sureAccount">确认到账</a-button>
    <a-button  type="primary" v-if="status==80|| status==5" @click="submit">提交</a-button>
  </div>
</template>
<script>
  import { mapState } from "vuex";
  import { httpActionWF } from '@/api/manage'
export default {
  name: "BasicInformationAction",
  components: {

  },
  computed: {
    ...mapState("order", [
      "current","statusName","status","taskId"
    ]),
  },
  props: {

  },
  methods: {
    submit(){
      this.$emit('submit')
    },
    comfirmTransfer(){
      this.$emit('comfirmTransfer')
    },
    cancleOrder(){
      this.$emit('cancleOrder')
    },
    tradeSuccess(){
      this.$emit('tradeSuccess')
    },
    tradeFail(){
      this.$emit('tradeFail')
    },
    tempSave(){
      this.$emit('tempSave')
    },
    comfirmUnit(){
      this.$emit('comfirmUnit')
    },
    comfirmTranUnit(){
      this.$emit('comfirmTranUnit')
    },
    comfirmAssetUnit(){
      this.$emit('comfirmAssetUnit')
    },
    sureAccount(){
      this.$emit('sureAccount')
    },
    sureStake(){
      this.$emit('sureStake')
    },
    mandatoryWithdrawal(){
      let formData = new FormData();
      formData.append("task_id", this.taskId);
      formData.append("audiResult", "RECALL");
      formData.append("comment", "强制撤回");
      httpActionWF("/wkf/disPather", formData).then((res)=>{
        if(res.success){
          this.$message.success(res.result);
          this.$emit('mandatoryWithdrawal')
        }else{
          this.$message.error(res.result);
        }
      });

    },
  },
  provide () {
  }
}
</script>
<style lang="stylus" scoped>
  .btn-margin{
    margin-right: 10px;
  }
  .ant-btn-danger {
    background-color: #ff4d4f
    color: #fff;
  }
  .btns-order {
    z-index: 2;
    position: fixed;
    right: 20px;
    top: 120px;
  }
</style>