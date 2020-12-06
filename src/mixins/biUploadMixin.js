/** 
 *上传，获取，删除文件
 
*/
import { httpActionWF, postAction } from '@api/manage'
import { handleRemove } from '../utils/fileRemove'

  export default {
    data() {
      return {
        loading: false,
        optType:"",
        files:[],
        url: {
          upload: "/sys/common/biUpload",
          getFiles: "/sys/common/getFiles"
        }
      }
    },
    created() {
    },
    methods: {
      // 文件改变时候触发
      changeFiles(files){
        this.files = [...files];
      },
      beforeUpload(file) {
        this.files = [...this.files, file];
        return false;
      },
      // 删除文件
      handleRemove(file) {
        if(this.optType !== 'view'){
          const index = this.files.indexOf(file);
          const newFileList = this.files.slice();
          newFileList.splice(index, 1);
          this.files = newFileList;
          handleRemove(this,file);
        }else{
          return false;
        }
      },
      //上传文件
      uploadFiles(module,dataId){
        this.loading = true;
        const formData = new FormData();
        formData.append("module",module);
        formData.append("dataId",dataId);
        this.files.forEach(file => {
          formData.append('files', file);
        });
        httpActionWF(this.url.upload, formData).then((res)=>{
          if(res.success){
            // this.$message.success('保存成功！');
          }else{
            this.$message.error(res.message);
          }
        }).catch(function(error){
          this.$message.error('文件上传失败，请稍后重新上传，注意文件大小不可超过10M');
        }).finally(() => {
          this.loading = false;
        });
      },
      // 获取文件
      async getFiles(module,dataId){
        this.loading = true;
        const formData = new FormData();
        formData.append("module",module);
        formData.append("dataId", dataId);
        const res = await postAction(this.url.getFiles, formData)
        if(res.success){
          res.result.forEach((file)=>{
            file.uid = file.id;
            file.name = file.fileName;
            file.status = 'done';
            file.response = '{"status": "success"}';
            file.url = window._CONFIG['domianURL']+"/sys/common/downloadStatic/" + file.filePath;
          });
          this.files = res.result;
        }else{
          this.$message.error(res.message);
        }
        this.loading = false;
        },
    }
  }