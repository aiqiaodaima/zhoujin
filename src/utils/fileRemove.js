import { postAction } from '../api/manage'

export  function handleRemove(Data,file) {
    const formData = new FormData();
    formData.append("fileId",file.id);
    postAction("/sys/common/deleteFile",formData).then(res=>{
      if(res.success){
        Data.$message.success('删除文件成功！');
      }else{
        Data.$message.error(res.message);
      }
    }).catch(function(error){
      Data.$message.error('删除文件失败');
    }).finally(() => {
      Data.loading = false;
    });
  }