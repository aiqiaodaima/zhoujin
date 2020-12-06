<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">刷新</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
        style="word-break: break-all;">

        <span slot="action" slot-scope="text, record">
          <a @click="handleView(record)">查看流程图</a>
          <a v-if="record.status === '2'" @click="handleDisable(record)"><a-divider type="vertical" />停用流程</a>
          <a v-if="record.status === '1'" @click="handleEnable(record)"><a-divider type="vertical" />发布流程</a>
          <a v-if="record.status === '1'" @click="handleEdit(record)"><a-divider type="vertical" />编辑流程</a>
          <a-popconfirm v-if="record.status === '1'" title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a-divider type="vertical"></a-divider>
            <a>删除流程</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->
    <br/>
    <!-- 部署流程定义区域 begin -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="流程名称">
              <a-input placeholder="请输入流程名称" v-model="processName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="7">
            <a-form-item label="流程文件">
              <!--              <a-upload action="window._CONFIG['domianURL'] + '/sys/common/upload'"></a-upload>-->
              <div class="clearfix">
                <a-upload :fileList="fileList" :remove="handleRemove" :beforeUpload="beforeUpload">
                  <a-button> <a-icon type="upload" /> 选择流程文件 </a-button>
                </a-upload>
              </div>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="7">
            <a-form-item>
              <div class="clearfix">
                <a-button
                  type="primary"
                  @click="handleUpload"
                  :disabled="fileList.length === 0 || processName === ''"
                  :loading="uploading"
                >
                  {{ uploading ? '上传中...' : '上传' }}
                </a-button>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 部署流程定义区域 end -->

    <!-- 表单区域 -->
    <work-flow-deploy-modal ref="modalForm" @ok="modalFormOk"></work-flow-deploy-modal>
    <a-modal
      title="查看流程图"
      width="40%"
      v-model="imgVisible"
      :footer="null">
      <img :src="wkfImg" alt="" style="width: 100%;height: auto;"/>
    </a-modal>
  </a-card>
</template>

<script>
  import WorkFlowDeployModal from "./modules/WorkFlowDeployModalNew";
  import { FtsListMixin } from '@/mixins/FtsListMixin'
  import { httpAction, showImageStream } from '@/api/manage'

  export default {
    name: "WorkFlowDeployList",
    mixins:[FtsListMixin],
    components: {
      WorkFlowDeployModal
    },
    data () {
      return {
        description: '流程定义信息列表',
        // 表头
        columns: [
          {
            title: '排序号',
            align:"center",
            dataIndex: 'sort',
            width: '4%'
          },
          {
            title: '自定义流程代码',
            align:"center",
            dataIndex: 'processCode',
            width: '10%'
          },
          {
            title: '流程名称',
            align:"center",
            dataIndex: 'processName',
            width: '10%'
          },
          {
            title: '流程定义的KEY',
            align:"center",
            dataIndex: 'processKey',
            width: '10%'
          },
          {
            title: '流程定义的变量',
            align:"center",
            dataIndex: 'processVariables',
            width: '30%'
          },
          {
            title: '流程状态',
            align:"center",
            dataIndex: 'statusName',
            width: '5%'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
            width: '20%'
          }
        ],
        url: {
          list: "/wkf/list",
          queryWKFinfo: "/wkf/queryWKFinfo",
          delete: "/activiti/actProcessRela/delete"
        },
        fileList: [],
        processName: '',
        uploading: false,
        imgVisible: false,
        wkfImg: ""
      }
    },
    methods: {
      handleOpration(s, record){
        const formData = new FormData();
        formData.append("processCode", record.processCode);
        formData.append("status", s);
        httpAction('wkf/update',formData,'post').then((res) => {
          if (res.success) {
            this.$message.success(res.message);
            this.searchQuery();
          } else {
            this.$message.error(res.message);
          }
        });
      },
      handleView(record){
        console.dir(record);
        let that = this;
        const formData = new FormData();
        formData.append("processKey", record.processKey);
        showImageStream(this.url.queryWKFinfo, formData, "post").then((res)=>{
          console.dir(res);
          that.wkfImg = res;
        }).catch(err => {
          console.dir(err);
          that.$message.error({
            content: '图片加载失败',
          });
        });
        this.imgVisible = true;
      },
      handleDisable(record){
        this.handleOpration('1', record);
      },
      handleEnable(record){
        this.handleOpration('2', record);
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
      handleUpload() {
        const { fileList } = this;
        const formData = new FormData();
        formData.append('processName', this.processName);
        fileList.forEach(file => {
          formData.append('file', file);
        });
        this.uploading = true;
        httpAction('/wkf/deploy', formData, 'post').then((res) => {
          if (res.success) {
            this.fileList = [];
            this.$message.success('上传成功！');
            this.processName = '';
            this.searchQuery();
          } else {
            this.$message.error('上传失败！');
          }
        }).finally(() => {
          this.uploading = false;
        });
      }
    },
    created(){
      this.searchQuery();
    },
    hideImgModal(){
      this.imgVisible = false;
    }
  }
</script>
<style scoped>
    @import '~@assets/less/common.less';
</style>