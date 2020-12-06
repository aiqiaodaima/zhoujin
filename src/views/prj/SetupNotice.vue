<template>
  <a-layout style="height:100%">
    <a-layout-content>
      <a-spin :spinning="loading">
        <a-card  :title="'项目成立通知书'+(contractStatus==='AUDITING'?' - 审核中':'')" size="small" style="height: 100%">
          <a-card title="项目信息" size="small" style="margin-bottom: 12px;">
            <a-form formLayout="horizontal">
              <a-row :gutter="24">
                <BiCol><a-form-item label="项目名称">{{ prjInfo.TRUST_PRJ_NAME }}</a-form-item></BiCol>
                <BiCol><a-form-item label="项目编号">{{ prjInfo.TRUST_PRJ_CODE }}</a-form-item></BiCol>
                <BiCol><a-form-item label="信托成立日">{{ prjInfo.TRUST_STD_DT }}</a-form-item></BiCol>
              </a-row>
              <a-row :gutter="24">
                <BiCol>
                  <a-form-item label="委托人姓名/名称">
                    <template v-if="prjInfo.C_PARTY_NAME">
                      <div v-for="(item, index) in prjInfo.C_PARTY_NAME.split(',')" :key="index" >
                        {{ item }}
                      </div>
                    </template>
                  </a-form-item>
                </BiCol>
                <BiCol>
                  <a-form-item label="证件类型">
                    <template v-if="prjInfo.C_IDN_NAME">
                      <div v-for="(item, index) in prjInfo.C_IDN_NAME.split(',')" :key="index" >
                        {{ item }}
                      </div>
                    </template>
                  </a-form-item>
                </BiCol>
                <BiCol>
                  <a-form-item label="证件号码">
                    <template v-if="prjInfo.C_IDN">
                      <div v-for="(item, index) in prjInfo.C_IDN.split(',')" :key="index" >
                        {{ item }}
                      </div>
                    </template>
                  </a-form-item>
                </BiCol>
              </a-row>
              <a-row :gutter="24">
                <BiCol><a-form-item label="初始委托信托财产金额">{{ fmt(prjInfo.INIT_ASSET_AMOUNT) }}</a-form-item></BiCol>
              </a-row>
            </a-form>
          </a-card>

          <!-- 委托财产明细 -->
          <project-entrusted ref="ProjectEntrusted" :businessKey="businessKey" style="margin-bottom: 12px;"></project-entrusted>
          
          <!-- 附件 -->
          <a-card size="small" title="附件" style="margin-bottom: 12px;">
            <a-form-model :model="form">
              <a-row :gutter="24">
                <a-col :span="24">
                  <a-form-item>
                    <a-upload :fileList="form.files" :multiple="true" :remove="handleRemove" :beforeUpload="beforeUpload">
                      <a-button v-if="optType !== 'view'"> <a-icon type="upload"></a-icon> 选择 </a-button>
                      <a-button v-if="optType !== 'view'" @click.stop="handleSubmit" type="primary" style="margin-left: 12px;">开始上传</a-button>
                    </a-upload>                    
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form-model>
          </a-card>

          <!-- <a-card title="项目联系人" size="small" style="margin-bottom: 12px;">
            <a-form formLayout="horizontal">
              <a-row :gutter="24">
                <BiCol><a-form-item label="信托经理姓名">{{ prjInfo.TRUST_PRJ_NAME }}</a-form-item></BiCol>
                <BiCol><a-form-item label="联系电话">{{ prjInfo.TRUST_PRJ_CODE }}</a-form-item></BiCol>
                <BiCol><a-form-item label="电子邮件">{{ prjInfo.TRUST_STD_DT }}</a-form-item></BiCol>
              </a-row>
              <a-row :gutter="24">
                <BiCol><a-form-item label="投资经理姓名">{{ prjInfo.C_PARTY_NAME }}</a-form-item></BiCol>
                <BiCol><a-form-item label="联系电话">{{ prjInfo.C_IDN_NAME }}</a-form-item></BiCol>
                <BiCol><a-form-item label="电子邮件">{{ prjInfo.C_IDN }}</a-form-item></BiCol>
              </a-row>
            </a-form>
          </a-card> -->

          <div v-if="prjInfo.PRJ_STATUS === 'U'&&(contractStatus === '--' || contractStatus === 'CANCLE' || contractStatus === 'REJECT')&&optType==='EDIT'">
            <a-card title="项目数据完备情况" size="small" style="margin-bottom: 12px;">
              <a-list item-layout="horizontal" :data-source="dataSource" style="height: 100%;margin-bottom: 12px;">
                <a-list-item slot="renderItem" slot-scope="item, index">
                  <a-list-item-meta>
                    <span slot="title">
                      <a-icon v-if="item.iconType === 'check-circle'" type="check-circle" theme="twoTone" twoToneColor="#52c41a"></a-icon>
                      <a-icon v-if="item.iconType === 'warning'" type="warning" theme="twoTone" twoToneColor="#ff0000"></a-icon>
                      {{ item.title }}
                    </span>
                  </a-list-item-meta>
                  {{ item.msg }}
                </a-list-item>
              </a-list>
              <div slot="actions">
                <a-button type="primary" @click="submitAudit">合同审核</a-button>
              </div>
            </a-card>
          </div>
        </a-card>
        <wkf-next-user-modal ref="wkfUserForm" @complete="wkfUserComplete"></wkf-next-user-modal>
      </a-spin>
    </a-layout-content>
  </a-layout>
</template>

<script>
  import { httpActionWF, getAction, postAction } from '../../api/manage'
  import { formatAmt } from '../../utils/util'
  import WkfNextUserModal from '../activiti/modules/WkfNextUserModal'
  import ProjectEntrusted from './modules/ProjectEntrusted'
  import { handleRemove } from '../../utils/fileRemove'

  export default {
    name: 'SetupNotice',
    components: { WkfNextUserModal,ProjectEntrusted },
    watch:{
      comParam(){
        console.log('comParam changed');
        this.initPage();
      }
    },
    props:{
      comParam:{},
      businessKey:''
    },
    data() {
      return {
        loading: false,
        prjCode:'',
        optType:'',
        prjInfo:{
          "TRUST_PRJ_NAME": "",
          "TRUST_PRJ_CODE": "",
          "TRUST_STD_DT": "",
          "C_PARTY_NAME": "",
          "C_IDN_NAME": "",
          "C_IDN": "",
          "INIT_ASSET_AMOUNT": "",
          "PRJ_STATUS": "",
        },
        contractStatus:'--',
        form:{
          files:[]
        },
        url: {
          upload: "/sys/common/biUpload",
          getFiles: "/sys/common/getFiles",
          deleteFile:"/sys/common/deleteFile"
        },
        dataSource:[{
          title:'项目基本信息',
          status:'success',
          iconType:'',
          iconColor:''
        }]
      }
    },
    created() {
      //created here
    },
    mounted() {
      this.initPage();
    },
    methods: {
      fmt(amt){
        return formatAmt(amt,2);
      },
      async initPage(){
        let that = this;
        this.prjCode = this.$route.query.prjCode||this.businessKey.split(':')[1];
        this.optType = this.$route.query.optType||'VIEW';
        if(this.prjCode){
          this.loading = true;
          this.contractStatus = '--';
          const res = await postAction('/prj/getPrjExtInfo',{prjCode: this.prjCode,extItemCode:'contractStatus'});
          if(res.success && res.message){
            this.contractStatus = res.message;
          }
          getAction('/prj/list',{prjCode: this.prjCode}).then(res=>{
            if(res.success){
              if(res.result.records.length<1){
                return false
              }
              that.prjInfo = res.result.records[0];
              console.log('that.prjInfo = ',that.prjInfo);
              if(that.prjInfo.PRJ_STATUS === 'U'&& that.contractStatus !== 'AUDITING' && that.contractStatus !== 'ACCEPT'){
                postAction('/prj/getSetupCheckInfo',{prjCode: this.prjCode}).then(res=>{
                  that.dataSource = res.result;
                }).finally(()=>{
                  that.loading = false;
                });
              }else{
                that.loading = false;
              }
            }
          });

          let that = this;
          that.loading = true;
          const formData = new FormData();
          formData.append("module","PRJ_EST_NOTICE");
          formData.append("dataId", this.prjCode);
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
        }
      },
      submitAudit(){
        let pass = true;
        this.dataSource.forEach(item=>{
          if(item.iconType === 'warning'){
            pass = false;
          }
        });
        if(!pass){
          this.$notification[ 'error' ]({message: "项目数据不完整，请根据完备情况提示处理！",description:"",duration: 4 });
        }else{
          let that = this;
          this.$confirm({
            content: "确认提交审核?",
            onOk: async function () {
              that.loading = true;
              const res = await postAction('/prj/contractAudit', { prjCode:that.prjCode });
              console.log('resss=',res);
              if (res.success) {
                that.$refs.wkfUserForm.edit(res.message);
              } else {
                this.$notification[ 'error' ]({message: res.message,description:"",duration: 4 });
              }
              that.loading = false;
            }
          });
        }
      },
      wkfUserComplete () {
        let that = this;
        this.$nextTick(() => {
          that.initPage();
        });
      },
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
        formData.append("module","PRJ_EST_NOTICE");
        formData.append("dataId", this.prjCode);
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

<style>
  @import '~@assets/less/common.less'
  .icons-list >>> .anticon {
    margin-right: 6px;
    font-size: 24px;
  }
  .ant-card-body {
    height: 90%!important;
    background-color: #FFFFFF;
  }
</style>