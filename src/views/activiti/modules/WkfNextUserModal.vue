<template> 
  <a-modal
    :title="title"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :okButtonProps="okBtnProps"
    cancelText="关闭">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" v-if="formVisiable">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="">
          <a-select v-model="selected" :getPopupContainer="node => node.parentNode">
            <a-select-option v-for="auditor in auditors" :key="auditor.username">{{ auditor.realname }}({{ auditor.username }})</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <a-alert :message="warnMsg" banner />
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpActionWF } from '@/api/manage'
  export default {
    name: "WkfNextUserModal",
    data () {
      return {
        title:"请选择审批人",
        visible: false,
        formVisiable: true,
        auditors: [],
        model: {},
        warnMsg: "请指定审核人，若不指定，则审核人列表中所有人都可审核。",
        labelCol: {
          xs: { span: 20 },
          sm: { span: 5 },
        },
        confirmLoading: false,
        wrapperCol: {
          xs: { span: 20 },
          sm: { span: 14 },
        },
        form: this.$form.createForm(this),
        url: {
          findAuditors: "/wkf/findAuditors",
          claim: '/wkf/claim'
        },
        wkfReturnFlage: '',
        opts: {},
        selected: '',
        taskId: '',
        okBtnProps: {}
      }
    },
    created () {
    },
    methods: {
      edit (proInstId, opts, title) {
        const that = this;
        this.visible = true;
        this.title = title||"请选择审批人";
        opts = opts||{};
        this.opts = opts;
        let formData = new FormData();
        formData.append("proInstId", proInstId);
        httpActionWF(this.url.findAuditors, formData).then((res)=>{
          if(res.result.returnCode === "000"){
            that.auditors = res.result.auditors;
            that.taskId = res.result.taskId;
            if(opts.assignee != null && opts.assignee != ''){
              let onlyOne = [];
              for(let i=0; i<res.result.auditors.length; i++){
                if(res.result.auditors[i].username === opts.assignee){
                  onlyOne.push(res.result.auditors[i]);
                  that.auditors = onlyOne;
                  break;
                }
              }
            }
            if(that.auditors.length>0){
              that.selected = that.auditors[0].username;
            }
            that.$nextTick(() => {
              if(that.auditors.length === 1){
                that.handleOk();
              }
            });
          } else if (res.result.returnCode === "001"){
            that.close();
          } else {
            that.formVisiable = false;
            that.warnMsg = res.result.returnMsg;
            that.okBtnProps={props: {disabled: true}};
          }
        });
      },
      close () {
        this.$emit('close');
        this.$emit('complete');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        const formData = new FormData();
        formData.append("taskId", that.taskId);
        formData.append("username", that.selected);
        that.confirmLoading = true;
        httpActionWF(that.url.claim, formData).then((res)=>{
          if(res.success){
            that.wkfReturnFlage = 'ok';
            that.$success({
              title: '工号'+ that.selected + ' 已签收！',
              content: '',
            });
          }else{
            if(res.bizCode === "d"){
              that.wkfReturnFlage = 'fail';
            }else{
              that.wkfReturnFlage = 'error';
            }
            that.$error({
              title: res.message,
              content: ''
            });
          }
        }).finally(() => {
          that.confirmLoading = false;
          if(that.opts.callback !== 'undefined' && that.opts.callback != null && that.opts.callback !== ''){
            that.wkfReturnFlage = that.wkfReturnFlage||'cancel';
            if(typeof that.opts.callback === 'function') {
              that.opts.callback(that.wkfReturnFlage);
            }else if(typeof that.opts.callback == 'string'){
              if(window[typeof that.opts.callback]!== 'undefined' && window[typeof that.opts.callback] != null && typeof window[typeof that.opts.callback] === 'function'){
                window[typeof that.opts.callback](that.wkfReturnFlage);
              }
            }
          }
          that.close();
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