<template>
  <a-card :bordered="false"> 
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model layout="inline">
        <a-row :gutter="16">
          <BiCol>
            <BiFormItemInput label="名称" v-model="queryParam.seach" @pressEnter="enterKeySearch" placeholder="请输入名称"/>
          </BiCol>
          <BiCol>
            <BiTableSearchBtns @searchReset='searchReset' @searchQuery='searchQuery' v-model='advanced' :isAdvanced='false'/>
          </BiCol>
        </a-row>
      </a-form-model>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="infoDisAdd('add')">新增</a-button>
     <!-- <a-button type="primary" icon="download" @click="ExportXls('竞争对手产品')">导出</a-button>-->
      <!-- <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
         <a-button type="primary" icon="import">导入</a-button>
       </a-upload>-->

      <a-dropdown v-if="selectedRowKeys.length > 1">
        <a-button type="primary" icon="delete" @click="batchDel('ids')">批量删除</a-button>
      </a-dropdown>
     <!-- <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="selbatchDel">
            <a-icon type="delete"/>
            <删除></删除>
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>-->

    </div>
    <!-- table区域-begin -->
    <!-- table区域-begin -->
    <div>
      <a-table class="table-min-height"
               ref="table"
               size="middle"
               rowKey="id"
               :columns="columns"
               :dataSource="dataSource"
               :pagination="ipagination"
               :loading="loading"
               :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
               @change="handleTableChange">


        <template slot="action" slot-scope="text, record">
          <div class="editable-row-operations">
            <span>
              <a  @click="infoDisAdd('view',record.id)">查看</a>
              <a-divider type="vertical" />
              <a  @click="infoDisAdd('edite',record.id)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm
                title="确认删除吗?"
                @confirm="()=>handleDelete({id:record.id})"
              >
                <a href="#">删除</a>
              </a-popconfirm>
            </span>
          </div>
        </template>
      </a-table>
    </div>

    <BiModal
      :visible.sync="modal.visible"
      :width="800"
      :title="modal.title"
      :fullscreen.sync="modal.fullscreen"
      :switchFullscreen="modal.switchFullscreen"
      @handleOk='handleOk'
      :destroyOnClose='true'>
      <ProEastProjectsJydsjrcpModal ref='ProEastProjectsJydsjrcpModal' :orgType='orgType' :id='id' @update='updateList'
                                  :type='type'></ProEastProjectsJydsjrcpModal>
    </BiModal>

  </a-card>
</template>

<script>
 // import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import biTableMixin from '@/mixins/biTableMixin'
  import {deleteActionByPostMethod,downFile} from '@/api/manage'//批量删除处理
  import dictMixin from '@mixins/dictMixin'
  import ProEastProjectsJydsjrcpModal from './modules/ProEastProjectsJydsjrcpModal'


  export default {
    name: "ProEastProjectsJydsjrcpList",
    mixins: [biTableMixin, dictMixin],
    components: {
      ProEastProjectsJydsjrcpModal
    },
    data() {
      return {
        description: '交易对手产品管理',
        // 表头
        advanced: false,
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
            title: '名称',
            align: "center",
            dataIndex: 'jydsbh'
          },
          {
            title: '资管产品产品代码',
            align: "center",
            dataIndex: 'zgcpcpdm'
          },
          {
            title: '交易对手类型',
            align: "center",
            dataIndex: 'jydsqc',
            customRender: (text,r)=>{
              return  this.getDictNameByCode(this.dicts.EAST_DJLX,text)
            }
          },
          {
            title: '证件类型 ｜ 证件号码',
            dataIndex: 'zjlx',
            align: "center",
            customRender: (text,r)=>{
              return  this.getDictNameByCode(this.dicts.IDNTYPES,text)+' ｜ '+r.zjhm
            }
          },
          {
            title: '管理人',
            align: "center",
            dataIndex: 'glrmc'
          },
          {
            title: '是否本公司发行产品',
            align: "center",
            dataIndex: 'sfbgsfxcp',
            customRender: (text,r)=>{
              return  this.getDictNameByCode(this.dicts.y_n,text)
            }
          },
          {
            title: '是否关联方发行产品',
            align: "center",
            dataIndex: 'sfglffxcp',
            customRender: (text,r)=>{
              return  this.getDictNameByCode(this.dicts.y_n,text)
            }
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'}
          }
        ],
        url: {
          list: "/proEastProjectsJydsjrcp/list",
          delete: "/proEastProjectsJydsjrcp/delete",
          deleteBatch: "/proEastProjectsJydsjrcp/deleteBatch",
          exportXlsUrl: "/proEastProjectsJydsjrcp/exportXls",
          importExcelUrl: "proEastProjectsJydsjrcp/importExcel",
        },
        modal: {
          title: '新增',
          visible: false,
          fullscreen: true,
          switchFullscreen: false,
        },
        type: 'add',
        id: '',
        orgType: '',
        disableMixinCreated: true,

        dictOptions: {},
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      initDictConfig() {
      },


      searchReset() {
        this.queryParam = {
          seach: this.seach
        }
        this.loadData(1);
      },
      handleOk(){

        this.$refs.ProEastProjectsJydsjrcpModal.onSubmit()
      },
      updateList() {
        this.modal.visible = false
        this.loadData()
      },
      infoDisAdd(type,id){
        const types = {
          add:  '新增',
          copy:  '复制新增',
          edite:  '编辑',
          view:  '查看',
        }
        // if( type == 'copy' ) {
        //   if( this.selectedRowKeys.length !== 1 ){
        //     this.$message.warning('请选择一条模版操作')
        //     return
        //   }
        //   id = this.selectedRowKeys[0]
        // }
        this.type = type
        this.id = id
        this.modal.title = types[type]
        this.modal.visible = true
      },
      //导出
      ExportXls(fileName){
        if(!fileName || typeof fileName != "string"){
          fileName = "导出文件"
        }
        let param = {...this.queryParam};
        if(this.selectedRowKeys && this.selectedRowKeys.length>0){
          param['selections'] = this.selectedRowKeys.join(",")
        }
        downFile(this.url.exportXlsUrl,param).then((data)=>{
          if (!data) {
            this.$message.warning("文件下载失败")
            return
          }
          if (typeof window.navigator.msSaveBlob !== 'undefined') {
            window.navigator.msSaveBlob(new Blob([data],{type: 'application/vnd.ms-excel'}), fileName+'.xls')
          }else{
            let url = window.URL.createObjectURL(new Blob([data],{type: 'application/vnd.ms-excel'}))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', fileName+'.xls')
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link); //下载完成移除元素
            window.URL.revokeObjectURL(url); //释放掉blob对象
          }
        })
      },

      // 批量删除
      selbatchDel() {
        if (this.selectionRows.length <= 0) {
          this.$message.warning('请选择一条记录！');
          return;
        } else {
          let ids = "";

          for (var a = 0; a < this.selectionRows.length; a++) {
            if(a==this.selectionRows.length-1){
              ids += this.selectionRows[a].id;
            }
            else{
              ids += this.selectionRows[a].id + ",";
            }
          }
          var that = this;
          this.queryParam = {
            ids: ids
          }

          this.$confirm({
            title: "确认删除",
            content: "是否删除选中数据?",
            onOk: async function () {
              that.loading = true;
              const res = await deleteActionByPostMethod(that.url.deleteBatch, that.queryParam)
              if (res.success) {
                that.$message.success(res.message);
                that.loadData();
                that.onClearSelected();
              } else {
                that.$message.warning(res.message);
              }
              that.loading = false;
            }
          });
        }
      }
    },
    mounted () {
      this.loadData()
    },
    created () {
      this.getDict('IDNTYPES,y_n,EAST_DJLX')
    }

  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>