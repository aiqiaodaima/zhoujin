<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="ID">
              <a-input placeholder="请输入ID" v-model="queryParam.id"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="模型名称">
              <a-input placeholder="请输入模型名称" v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="创建时间">
                <a-input placeholder="请输入接收人" v-model="queryParam.esReceiver"></a-input>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleCreate" type="primary" icon="plus">新增</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete"/>
            删除
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
        selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">

        <!-- 字符串超长截取省略号显示-->
        <span slot="esContent" slot-scope="text">
          <j-ellipsis :value="text" :length="10" />
        </span>

        <span slot="action" slot-scope="text, record">
          <a href="javascript:void(0);" @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical"/>
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record)">
            <a>删除</a>
          </a-popconfirm>
          <!--
          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">更多<a-icon type="down"/></a>
            <a-menu slot="overlay">
               <a-menu-item>
                <a @click="handleEdit(record)"></a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          -->
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->
    <a-modal
      v-model="visible"
      width="100%"
      :bodyStyle="myStyle"
      :centered="true"
      :destroyOnClose="true"
      :footer="null">
      <iframe-page-content ref="meIframe" :src="url.modify"></iframe-page-content>
    </a-modal>
  </a-card>
</template>

<script>
  import {httpAction} from '@/api/manage'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import JEllipsis from "@/components/jeecg/JEllipsis";
  import IframePageContent from '../../components/layouts/IframePageView'

  export default {
    name: "ActModelList",
    mixins: [JeecgListMixin],
    components: {
      IframePageContent,
      JEllipsis
    },
    data() {
      return {
        description: '工作流模型设计页面',
        visible:false,
        myStyle:{height:'500px',width:'100%',top: '0px', padding: '0px'},
        // 表头
        columns: [
          {
            title: 'ID',
            align: "center",
            dataIndex: 'id'
          },
          {
            title: '模型名称',
            align: "center",
            dataIndex: 'name'
          },
          {
            title: 'key',
            align: "center",
            dataIndex: 'key'
          },
          {
            title: '版本',
            align: "center",
            dataIndex: 'version'
          },{
            title: '创建时间',
            align: "center",
            dataIndex: 'createTime'
          },{
            title: '最后更新时间',
            align: "center",
            dataIndex: 'lastUpdateTime'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }
        ],
        url: {
          list: "/activitiService/listModels",
          create: "/activitiService/createModel",
          save: "/activitiService/saveModel",
          del:"/activitiService/delModel",
          modify: "about:blank"
        },
      }
    },
    computed: {
    },
    methods: {
      handleCreate(){
        let params = {};
        let that = this;
        httpAction(this.url.create, params, 'get').then((res) => {
          if (res.success) {
            that.searchQuery();
            this.handleEdit({id:res.message});
          } else {
            that.$message.warning(res.message)
          }
        });
      },
      closeModa(){
        this.visible = false;
      },
      handleEdit(record){
        this.myStyle.height=document.documentElement.clientHeight+'px';
        this.url.modify=window._CONFIG['domianURL']+'/activiti-explorer/modeler.html?modelId='+record.id;
        this.visible = true;
        let that = this;
        window.addEventListener('message', function(e) {
          let data = {modelId:record.id,d:e.data};
          console.dir(data);
          httpAction(that.url.save, data, 'post').then((res) => {
            console.dir(res);
            if(res.success){
              that.visible = false;
              that.searchQuery();
            }else{
              that.$refs.meIframe.getContentWindow().postMessage(res, '*');
            }
          });
        }, false);
      },
      handleDelete(record){
        httpAction(this.url.del, {modelId:record.id}, 'post').then((res) => {
          console.dir(res);
          if(res.success){
            this.$message.success('删除成功！');
            this.searchQuery();
          }else{
            this.$message.error('删除失败！');
          }
        });
      }
    }
  }
</script>
<style lang="less" scoped>
  /** Button按钮间距 */
  .ant-btn {
    margin-left: 3px
  }
  .ant-card-body .table-operator {
    margin-bottom: 18px;
  }

  .ant-table-tbody .ant-table-row td {
    padding-top: 15px;
    padding-bottom: 15px;
  }

  .anty-row-operator button {
    margin: 0 5px
  }

  .ant-btn-danger {
    background-color: #ffffff
  }

  .ant-modal-cust-warp {
    height: 100%
  }

  .ant-modal-cust-warp .ant-modal-body {
    height: calc(100% - 110px) !important;
    overflow-y: auto
  }

  .ant-modal-cust-warp .ant-modal-content {
    height: 90% !important;
    overflow-y: hidden
  }
</style>