<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="流程名称">
          <a-input placeholder="请输入流程名称" v-decorator="['processName', validatorRules.processName]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="排序">
          <a-input-number placeholder="请输入排序" v-decorator="[ 'sort', validatorRules.sort]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="自定义流程代码">
          <a-input placeholder="请输入自定义流程代码" v-decorator="['processCode', validatorRules.processCode]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否可撤回">
          <j-dict-select-tag
            v-decorator="['isCancle', {}]"
            :triggerChange="true"
            placeholder="请选择是否可撤回"
            dict-code="y_n"></j-dict-select-tag>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="自定义流程变量">
          <a-textarea placeholder="请输入自定义流程变量" v-decorator="['processVariables', {}]" :rows="4"/>
          <a-alert message="{'global_audi_method':'审核方法','global_audi_beanId':'审核类','global_form_action':'form表单对应类','global_auto_claim_yn':'是否自动签收',taskVariables:[{'task_id':'设计时user_task id','audi_method':'本节点审核方法','audi_bean_id':'本节点审核类','form_action':'form表单对应url','auto_claim_yn':'是否自动签收','print_yn':'Y','upload_yn':'N'}]}" banner />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="描述">
          <a-textarea placeholder="请输入描述" v-decorator="['processDesc', {}]" :rows="4"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="流程附件">
          <div class="clearfix">
            <a-upload :fileList="fileList" :remove="handleRemove" :beforeUpload="beforeUpload" v-decorator="['processFile', {}]">
              <a-button> <a-icon type="upload" /> 选择流程文件 </a-button>
            </a-upload>
          </div>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpActionWF } from '@/api/manage'
  import pick from 'lodash.pick'
  export default {
    name: "WorkFlowDeployModal",
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        confirmLoading: false,
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        form: this.$form.createForm(this),
        validatorRules:{
          processCode:{rules: [{ required: true, message: '请输入自定义流程代码!' }]},
          processName:{rules: [{ required: true, message: '请输入流程名称!' }]},
          sort:{rules: [{ required: true, message: '请输入排序!' }]},
        },
        url: {
          edit: "/wkf/modify",
        },
        fileList: [],
        oldSort: null
      }
    },
    created () {
    },
    methods: {
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'processName','sort','processCode','isCancle','processDesc','processVariables'));//时间格式化
        });
        this.oldSort = this.model.sort;
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleRemove(file) {
        const index = this.fileList.indexOf(file);
        const newFileList = this.fileList.slice();
        newFileList.splice(index, 1);
        this.fileList = newFileList;
      },
      beforeUpload(file) {
        this.fileList = [...this.fileList, file];
        return false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            const { fileList } = this;
            const formData = new FormData();
            let httpUrl = this.url.edit;
            let method = 'post';
            // let formData = Object.assign(this.model, values);//时间格式化
            console.dir(values);
            formData.append('isCancle', values.isCancle);
            formData.append('processCode', values.processCode);
            formData.append('processDesc', values.processDesc);
            formData.append('processName', values.processName);
            formData.append('processVariables', values.processVariables);
            formData.append('sort', values.sort);
            if(this.oldSort){
              formData.append('oldSort', this.oldSort);
            }
            fileList.forEach(file => {
              formData.set('processFile', file);
            });
            httpActionWF(httpUrl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })
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