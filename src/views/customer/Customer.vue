<template>
  <a-card :bordered="false" title="查询条件">
    <!-- 查询区域 -->
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <!-- 搜索区域 -->
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="客户姓名" >
              <a-input placeholder="请输入客户姓名" v-model="queryParam.partyName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="证件号码" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <a-input placeholder="请输入证件号码" v-model="queryParam.idn"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="手机号码" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}" >
              <a-input placeholder="请输入手机号码" v-model="queryParam.cphone"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <template>
          <a-row :gutter="24">
            <a-col :span="24">
              <a-form-item label="信息来源">
                <j-multi-select-tag v-model="queryParam.cusSources" dict-code="INFO_SOURCE"></j-multi-select-tag>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="客户状态">
                <j-multi-select-tag v-model="queryParam.cusStatuses" dict-code="CUS_STATUS"></j-multi-select-tag>
              </a-form-item>
            </a-col>
          </a-row>
        </template>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator"  style="margin-top: 5px">
      <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
      <a-button v-if="selectedRowKeys.length>0" @click="batchDel('partyCodes')" icon="delete" type="primary">删除</a-button>
      <a-button @click="addCus()" icon="plus" type="primary">新增</a-button>
      <a-button  @click="searchReset">重置</a-button>
    </div>

    <a-table
      ref="table"
      size="middle"
      bordered
      rowKey="PARTY_CODE"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      @change="handleTableChange">
      <template slot="action" slot-scope="text, record">
          <div class="editable-row-operations">
            <span>
              <a  @click="infoDisAdd('view',record.PARTY_CODE,record.CLIENT_TYPE)">查看</a>
              <a-divider type="vertical" />
              <a  @click="infoDisAdd('edite',record.PARTY_CODE,record.CLIENT_TYPE)">编辑</a>
            </span>
          </div>
        </template>
    </a-table>
    <!-- table区域-end -->
  </a-card>
</template>

<script>
  import JSuperQuery from '@/components/jeecg/JSuperQuery.vue';
  import JInput from '@/components/jeecg/JInput.vue';
  import {deleteAction,postAction} from '@/api/manage'
  import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'
  import { FtsListMixin } from '@/mixins/FtsListMixin'
  import dictMixin from '@mixins/dictMixin'
  import Vue from 'vue'
  import JMultiSelectTag from '@/components/dict/JMultiSelectTag'
  import { initDictOptionsBatch } from '@/components/dict/JDictSelectUtil'
  export default {
    name: "Customer",
    mixins:[FtsListMixin,dictMixin],
    components: {
      JSuperQuery,
      JMultiSelectTag,
      JInput
    },
    data() {
      return {
        description: '项目查询页面',
        //表头
        //列设置
        settingColumns:[],
        //列定义
        modal: {
          title: '人员调配',
          visible: false,
          fullscreen: false,
          switchFullscreen: false,
        },
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '客户姓名',
            align: "center",
            dataIndex: 'PARTY_NAME'
          },
          {
            title: '证件类型 ｜ 证件号码',
            align: "center",
            dataIndex: 'IDN_TYPE',
            customRender: (text,r)=>{
             // return  this.getDictNameByCode(this.dicts.CRM_IDE_TYPE,text)+' ｜ '+r.IDN
             return  text+' ｜ '+r.IDN
            }
          },
          {
            title: '手机号',
            align: "center",
            dataIndex: 'CPHONE',
            customRender: (text)=>{
              return  text||'--'
            }
          },
          {
            title: '客户状态',
            align: "center",
            dataIndex: 'CUS_STATUS',
            customRender: (text)=> this.getDictNameByCode(this.dicts.CUS_STATUS,text)
           
          },
          {
            title: '信息来源',
            align: "center",
            dataIndex: 'CUS_SOURCE',
            customRender: (text)=> this.getDictNameByCode(this.dicts.INFO_SOURCE,text)
            
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
           list: "/prj/cusInfo/query/list",
           deleteBatch:"/prj/cusInfo/batchDelete"
        },
        dictOptionsData:[]
      }
    },
    methods: {
      infoDisAdd(optType,partyCode,clientType){
        if(optType=='edite'){
          this.$router.push({name:"customer-customerInfoEdit",query: {title:'客户编辑',optType:optType,partyCode:partyCode,clientType:clientType,editType:'view'}, meta:{keepAlive: true}});
        }else{
          this.$router.push({name:"customer-customerInfoView",query: {title:'客户视图',optType:optType,partyCode:partyCode,clientType:clientType,editType:'view'}, meta:{keepAlive: true}});
        }
        
      },
      addCus(){
        this.$router.push({name:"customer-customerInfo",query: {title:'客户新增',optType:'ADD',clientType:'all',editType:'add'}, meta:{keepAlive: true}});
      },
      updateList() {
        this.modal.visible = false
        this.loadData()
      },
      batchDel: function (key) {
          if(!this.url.deleteBatch){
            this.$message.error("请设置url.deleteBatch属性!")
            return
          }
          if (this.selectedRowKeys.length <= 0) {
            this.$message.warning('请选择一条记录！');
            return;
          } else {
            var ids = "";
            let param = {}
            for (var a = 0; a < this.selectedRowKeys.length; a++) {
              ids += this.selectedRowKeys[a] + ",";
            }
            key = key || 'ids'
            param[key] = ids
            var that = this;
            this.$confirm({
              title: "确认删除",
              content: "是否删除选中数据?",
              onOk: function () {
                that.loading = true;
                deleteAction(that.url.deleteBatch, param).then((res) => {
                  if (res.success) {
                    that.$message.success(res.message);
                    that.loadData();
                    that.onClearSelected();
                  } else {
                    that.$message.warning(res.message);
                  }
                }).finally(() => {
                  that.loading = false;
                });
              }
            });
          }
      },
      initDictConfig() {
        let promises = [
          this.getDict('INFO_SOURCE,CRM_IDE_TYPE,CUS_STATUS,CUS_SOURCE')
        ]
        Promise.all(promises).then((res)=>{
          // this.loadData()
        })
        //初始化字典 - 是否估值
        // let that = this;
        // initDictOptionsBatch("INFO_SOURCE,CRM_IDE_TYPE,CUS_STATUS,CUS_SOURCE").then((res) => {
        //   if (res.success) {
        //     that.dictOptionsData = res.result;
        //   }
        // });
      },
    },
    created() {
      this.initDictConfig()
      //this.initColumns();
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
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
  /** Button按钮间距 */
  .ant-btn {
    margin-left: 3px
  }
</style>