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
   <!--   <a-button type="primary" icon="download" @click="ExportXls('竞争对手个人')">导出</a-button>-->
      <!-- <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
         <a-button type="primary" icon="import">导入</a-button>
       </a-upload>-->
      <a-dropdown v-if="selectedRowKeys.length > 1">
        <a-button type="primary" icon="delete" @click="batchDel('ids')">批量删除</a-button>
      </a-dropdown>

<!--      <a-dropdown v-if="selectedRowKeys.length > 0">-->
<!--        <a-menu slot="overlay">-->
<!--          <a-menu-item key="1" @click="selectDel">-->
<!--            <a-icon type="delete"/>-->
<!--            删除-->
<!--          </a-menu-item>-->
<!--        </a-menu>-->
<!--        <a-button style="margin-left: 8px"> 批量操作-->
<!--          <a-icon type="down"/>-->
<!--        </a-button>-->
<!--      </a-dropdown>-->
    </div>

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
               :rowSelection="{selectedRowKeys: selectedRowKeys,onChange: onSelectChange}"
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
      <ProEastProjectsJydsgrModal ref='proEastProjectsJydsgrModal' :orgType='orgType' :id='id' @update='updateList'
                                  :type='type'></ProEastProjectsJydsgrModal>
    </BiModal>

  </a-card>
</template>
 
<script>
    import biTableMixin from '@/mixins/biTableMixin'
    import dictMixin from '@mixins/dictMixin'
    import {deleteActionByPostMethod,downFile} from '@/api/manage'//批量删除处理
    import biUploadMixin from '@mixins/biUploadMixin'
    import ProEastProjectsJydsgrModal from './modules/ProEastProjectsJydsgrModal'

    export default {
        name: "ProEastProjectsJydsgrList",
        mixins: [biTableMixin, dictMixin,biUploadMixin],
        components: {
            ProEastProjectsJydsgrModal
        },
        data() {
            return {
              // 高级搜索 展开/关闭
              advanced: false,
              // 表头
              columns: [
                {
                  title: '序号',
                  dataIndex: 'id',
                  key: 'rowIndex',
                  width: 70,
                  // align: "center",
                  customRender: function (t, r, index) {
                    return parseInt(index) + 1;
                  }
                },
                {
                  title: '名称',
                  dataIndex: 'jydsqc',
                  width: 150
                },
                {
                  title: '证件类型 ｜ 证件号码',
                  dataIndex: 'zjlx',
                  width: 150,
                  align: "center",
                  customRender: (text,r)=>{
                    // return  this.getDictNameByCode(this.dicts.CRM_IDE_TYPE,text)+' ｜ '+r.IDN
                    return  this.getDictNameByCode(this.dicts.IDNTYPES,text)+' ｜ '+r.zjhm
                  }
                },
            /*    {
                  title: '所属地区',
                  align: "center",
                  width: 100,
                  dataIndex: 'sudq',
                },
                {
                  title: '居住地区',
                  align: "center",
                  width: 100,
                  dataIndex: 'jzdq'
                },*/
                {
                  title: '手机号码',
                  align: "center",
                  width: 100,
                  dataIndex: 'lxdh',
                  customRender: (text)=>{
                    return  text||'--'
                  }
                },
                {
                  title: '固定电话',
                  align: "center",
                  width: 100,
                  dataIndex: 'gddh',
                  customRender: (text)=>{
                    return  text||'--'
                  }
                },
                {
                  title: '操作',
                  dataIndex: 'action',
                  width: 150,
                  align: "center",
                  // fixed: 'right',
                  scopedSlots: { customRender: 'action' },
                }
                ],
                url: {
                    list: "/proEastProjectsJydszh/list",
                    delete: "/proEastProjectsJydszh/delete",
                    deleteBatch: "/proEastProjectsJydszh/deleteBatch",
                    exportXlsUrl: "/proEastProjectsJydszh/exportXls",
                    importExcelUrl: "proEastProjectsJydszh/importExcel",
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
         /* handleSelectionChange(){
          },*/
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

          searchReset() {
            this.queryParam = {
              seach: this.seach
            }
            this.loadData(1);
          },

            handleOk(){
                this.$refs.proEastProjectsJydsgrModal.onSubmit()
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
                //     if( this.selectedRowKeys.length !== 1 ){
                //         this.$message.warning('请选择一条模版操作')
                //         return
                //     }
                //     id = this.selectedRowKeys[0]
                // }
                this.type = type
                this.id = id
                this.modal.title = types[type]
                this.modal.visible = true
            },





        },

      mounted () {
        this.loadData()
      },
      created () {
        this.getDict('ORG_TYPE,IDNTYPES,ORGIDNTYPES,COOPERATE_TYPE,AREA_CODE,y_n')
      }

    }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>