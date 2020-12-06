<template>
  <div>
    <a-table
      ref="table"
      size="middle"
      bordered
      rowKey="id"
      :columns="columns"
      :dataSource="dataSource"
      :loading="loading">
    </a-table>
    <img :src="wkfImg" alt="" style="width: 600px;height: auto;"/>
  </div>
</template>

<script>
  import { showImageStream } from '@/api/manage';
  import { httpActionWF } from '@/api/manage';
  import moment from 'moment'

  export default {
    name: "WkfAuditHis",
    components: {
    },
    data () {
      return {
        loading: false,
        url: {
          auditInitData: "/wkf/auditInitData"
        },

        taskId: "",
        audiResultOptions: [{ label: '同意', value: 'ACCEPT' },{ label: '驳回', value: 'REJECT' }],
        columns: [
          {
            title: '操作部门',
            align:"center",
            dataIndex: 'name'
          },
          {
            title: '申请人/审核人',
            align:"center",
            dataIndex: 'assigneeName'
          },
          {
            title: '创建时间',
            align:"center",
            dataIndex: 'startDt',
            customRender: function (t) {
              return moment(t).format('YYYY-MM-DD HH:mm:ss');
            }
          },
          {
            title: '审核时间',
            align:"center",
            dataIndex: 'endDt',
            customRender: (text, r) => {
              let v = text;
              if(r.taskDefKey.toUpperCase().startsWith("START")){
                v = "--"
              }else if(v){
                try{
                  v = moment(v).format('YYYY-MM-DD HH:mm:ss');
                }catch (e) {
                  v = text;
                }
              }
              return v||"--";
            }
          },
          {
            title: '是否同意',
            align:"center",
            dataIndex: 'audiResultStr',
            customRender: (text, r) => {
              let v = text;
              if(r.taskDefKey.toUpperCase().startsWith("START")){
                v = "提交审核"
              }else if(r.audiResultStr){
                v = r.audiResultStr.split(":")[1];
              }
              return v||"--";
            }
          },
          {
            title: '审核意见',
            align:"center",
            dataIndex: 'comments',
            customRender: (text) => {
              return text||"--";
            }
          }
        ],
        /* 数据源 */
        dataSource:[],
        wkfImg: ""
      }
    },
    methods: {
      initPage (res, record) {
        let that = this;
        let formData = new FormData();
        formData.append('taskId', record.taskId);
        if(res === null){
          that.loading = true;
          httpActionWF(this.url.auditInitData, formData).then((res)=>{
            if(res.success){
              this.dataSource = res.result.hisTaskes;
            }else{
              that.$message.warning(res.message);
            }
          }).finally(() => {
            that.loading = false;
          });
        }else{
          this.dataSource = res.result.hisTaskes;
        }
        this.taskId = record.taskId;
        showImageStream(formData).then(res=>{
          that.wkfImg = res;
          // let blob = new Blob([res], {type: "image/jpeg"});
          // that.wkfImg = URL.createObjectURL(blob);
        }).catch(err => {
          that.$message.error('图片加载失败');
        });
      }
    },
    mounted(){
      this.$emit("pageInited");
    }
  }
</script>

<style lang="less" scoped>
</style>