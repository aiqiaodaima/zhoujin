<template>
  <a-spin :spinning="loading">
    <a-layout>
      <a-layout-content>
        <a-card size="small" title="客户资料上传">
          <a-form-model :model="form">
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-item>
                  <a-upload :fileList="form.files" :multiple="true" :remove="handleRemove" :beforeUpload="beforeUpload">
                    <a-button v-if="optType !== 'view'"> <a-icon type="upload"></a-icon> 选择 </a-button>
                  </a-upload>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form-model>
        </a-card>
      </a-layout-content>
      <a-layout-footer style="background-color: #FFFFFF;text-align: center;">
        <a-button :disabled="optType === 'view'" @click="handleSubmit" type="primary">提交</a-button>
      </a-layout-footer>
    </a-layout>

  </a-spin>
</template>

<script>
  import { httpActionWF, postAction } from '../../api/manage'
  import { handleRemove } from '../../utils/fileRemove'

  export default {
    name: 'CustomerInfoUpload',
    data() {
      return {
        loading: false,
        optType:"",
        form:{
          files:[]
        },
        url: {
          upload: "/sys/common/biUpload",
          getFiles: "/sys/common/getFiles",
          deleteFile:"/sys/common/deleteFile"
        }
      }
    },
    created() {
      let that = this;
      that.loading = true;
      const formData = new FormData();
      formData.append("module","CUS_INFO");
      formData.append("dataId", this.$route.query.prjCode);
      postAction(this.url.getFiles, formData).then((res)=>{
        console.log("get",res);
        if(res.success){
          res.result.forEach((file)=>{
            file.uid = file.id;
            file.name = file.fileName;
            file.status = 'done';
            file.response = '{"status": "success"}';
            file.url = window._CONFIG['domianURL']+"/sys/common/downloadStatic/" + file.filePath;
          });
          that.form.files = res.result;
        }else{
          that.$message.error(res.message);
        }
      }).catch(function(error){
        that.$message.error('文件上传失败，请稍后重新上传，注意文件大小不可超过10M');
      }).finally(() => {
        that.loading = false;
      });
    },
    methods: {
      beforeUpload(file) {
        this.form.files = [...this.form.files, file];
        return false;
      },
      handleRemove(file) {
        if(this.optType !== 'view'){
          const index = this.form.files.indexOf(file);
          const newFileList = this.form.files.slice();
          newFileList.splice(index, 1);
          this.form.files = newFileList;
          const formData = new FormData();
          formData.append("fileId",file.id);
          handleRemove(this, file);
        }else{
          return false;
        }
      },
      handleSubmit(){
        this.loading = true;
        let that = this;
        const formData = new FormData();
        formData.append("module","CUS_INFO");
        formData.append("dataId", this.$route.query.prjCode);
        that.form.files.forEach(file => {
          formData.append('files', file);
        });
        httpActionWF(that.url.upload, formData).then((res)=>{
          if(res.success){
            that.$message.success('保存成功！');
          }else{
            that.$message.error(res.message);
          }
        }).catch(function(error){
          that.$message.error('文件上传失败，请稍后重新上传，注意文件大小不可超过10M');
        }).finally(() => {
          that.loading = false;
        });
      },
    }
  }
</script>

<style scoped>
  @import '~@assets/less/common.less'
</style>