<template>
  <a-modal
    :title="title"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    okText="暂存"
    cancelText="关闭">
    
    <a-spin :spinning="confirmLoading">
      <a-form-model :model="form" :rules="rules" ref="tmpPlanform">
        <a-form-model-item label="缴费日期" prop="tday">
          <j-date v-model="form.tday" style="width: 100%"></j-date>
        </a-form-model-item>
        <BiFormItemSelect label="币种" name="curCode" :options="dicts.CUR_CODE" :isForm="true" v-model="form.curCode"/>
        <BiFormItemNumPercent label="保额金额" name="feeAmt" v-model="form.feeAmt" />
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
  import BiCol from '../../../components/BI/BiCol'
  import JDate from '../../../components/jeecg/JDate'
  import dictMixin from '@/mixins/dictMixin'

  export default {
    name: "AssetM3PlanModal",
    mixins:[dictMixin],
    components: { JDate, BiCol },
    data () {
      let r = [{required: true, message: '必输字段',trigger:['change','blur']}];
      return {
        title:"操作",
        optType:'',
        visible: false,
        confirmLoading: false,
        form:{},
        rules:{
          tday:r,curCode:r,feeAmt:r
        }
      }
    },
    created () {
      this.getDict('CUR_CODE');
    },
    computed:{
      disabled(){
        return  this.optType=='view';
      }
    },
  
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.form = {...record};
        this.visible = true;
      },
      close () {
        this.$emit('close');
        this.visible = false;
         // 页面关闭时关闭
        this.confirmLoading = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.$refs.tmpPlanform.validate(valid => {
          console.log('valid:',valid);
          if (valid) {
            that.$emit('ok', that.form);
            this.visible = false;
          }
        });
      },
      handleCancel () {
        this.close()
      }
    }
  }
</script>

<style lang="less" scoped>
</style>