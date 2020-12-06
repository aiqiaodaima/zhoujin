<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model layout="inline">
        <a-row :gutter="16">
          <BiCol>
            <BiFormItemInput label="名称" v-model="queryParam.seach" name="seach" @pressEnter="enterKeySearch" placeholder="请输入名称"/>
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
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table class="table-min-height"
               ref="table"
               size="middle"
               rowKey="id"
               row
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
      :destroyOnClose='true'
    >
      <ProEastProjectsJydsjgModal ref='ProEastProjectsJydsjgModal' :orgType='orgType' :id='id' @update='updateList'
                                  :type='type'></ProEastProjectsJydsjgModal>


    </BiModal>
  </a-card>
</template>

<script>

  import biTableMixin from '@/mixins/biTableMixin'
  import dictMixin from '@mixins/dictMixin'
  import ProEastProjectsJydsjgModal from './modules/ProEastProjectsJydsjgModal'
  import {deleteActionByPostMethod,downFile} from '@/api/manage'//批量删除处理


  export default {
    name: "ProEastProjectsJydsjgList",
    mixins: [biTableMixin, dictMixin],
    components: {
      ProEastProjectsJydsjgModal
    },
    data() {
      return {
        description: 'EAST交易对手（机构）管理页面',
        advanced: false,


        // 表头
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title:'名称',
            align:"center",
            dataIndex: 'jydsqc'
          },
          {
            title:'统一社会信用代码',
            align:"center",
            dataIndex: 'tyshxydm'
          },
          {
            title:'交易对手类型',
            align:"center",
            dataIndex: 'jydslx',
            customRender: (text,r)=>{
              return  this.getDictNameByCode(this.dicts.CUS_CATEGORY_ORGAN,text)
            }
          },
          {
            title:'联系人',
            align:"center",
            dataIndex: 'contName',
            customRender: (text)=>{
              return  text||'--'
            }
          },
          {
            title:'手机号码',
            align:"center",
            dataIndex: 'ctelNo',
            customRender: (text)=>{
              return  text||'--'
            }
          },
          {
            title:'固定电话',
            align:"center",
            dataIndex: 'ftelNo',
            customRender: (text)=>{
              return  text||'--'
            }
          },
          {
            title:'联系地址',
            align:"center",
            dataIndex: 'address',
            customRender: (text)=>{
              return  text||'--'
            }
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/proEastProjectsJydsjg/list",
          delete: "/proEastProjectsJydsjg/delete",
          deleteBatch: "/proEastProjectsJydsjg/deleteBatch",
          exportXlsUrl: "/proEastProjectsJydsjg/exportXls",
          importExcelUrl: "proEastProjectsJydsjg/importExcel",
        },

        //tableScroll:{x :44*147+50},

        modal: {
          info:'交易对手（机构）',
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

      //导出
      ExportXls(fileName){
        if(!fileName || typeof fileName != "string"){
          fileName = "导出文件"
        }
        let param = {...this.queryParam};
        if(this.selectedRowKeys && this.selectedRowKeys.length>0){
          param['selections'] = this.selectedRowKeys.join(",")
        }
        console.log("导出参数",param)
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
      searchReset() {
        this.queryParam = {
          seach: this.seach
        }
        this.loadData(1);
      },
      handleOk(){
        this.$refs.ProEastProjectsJydsjgModal.onSubmit()
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
        if( type == 'copy' ) {
          if( this.selectedRowKeys.length !== 1 ){
            this.$message.warning('请选择一条模版操作')
            return
          }
          id = this.selectedRowKeys[0]
        }
        this.type = type
        this.id = id
        this.modal.title =types[type]
        this.modal.visible = true
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
          console.log(this.selectionRows)
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
      this.getDict('CUS_CATEGORY_ORGAN,ORG_TYPE,y_n,EAST_DJLX')
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>