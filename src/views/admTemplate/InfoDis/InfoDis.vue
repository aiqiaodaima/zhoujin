/**
信息披露模版
 */
<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form-model layout="inline">
        <a-row :gutter="16">
          <BiCol>
            <BiFormItemInput label="信息披露模版名称" v-model="queryParam.templateType" @pressEnter="enterKeySearch" placeholder="请输入信息披露模版名称"/>
          </BiCol>
          <BiCol>
            <BiFormItemSelect :options="dicts.CONTRACT_SERIE" label="合同系列"  v-model="queryParam.templateCode" />
          </BiCol>
          <BiCol>
            <BiTableSearchBtns @searchReset='searchReset' @searchQuery='searchQuery' v-model='advanced' :isAdvanced='false'/>
          </BiCol>
        </a-row>
      </a-form-model>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="infoDisAdd('add')">新增信息披露模版</a-button>
      <a-button type="primary" icon="plus" @click="infoDisAdd('copy')">复制新增</a-button>
      <a-button v-if="selectedRowKeys.length>0" type="primary" icon="delete" @click="batchDel('batchIds')">批量删除</a-button>
    </div>
    <div>
      <a-table class="table-min-height"
        ref="table"
        size="middle"
        rowKey="batchId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">
        <template slot="action" slot-scope="text, record">
          <div class="editable-row-operations">
            <span>
              <a  @click="infoDisAdd('view',record.batchId)">查看</a>
              <a-divider type="vertical" />
              <a  @click="infoDisAdd('edite',record.batchId)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm
                title="确认删除吗?"
                @confirm="()=>handleDelete({batchId:record.batchId})"
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
      <InfoDisModal ref='infoDisModal' :optType='type' :batchId='batchId' @update='updateList'></InfoDisModal>
    </BiModal>
  </a-card>
</template>

<script>
  import biTableMixin from '@mixins/biTableMixin'
  import { getDict } from '@/api/BiApi'
  import dictMixin from '@mixins/dictMixin'
  import InfoDisModal from './InfoDisModal'

  export default {
    name: "InfoDis",
    components: {
      InfoDisModal,
    },
    mixins:[biTableMixin,dictMixin],
    data () {
      return {
        // 高级搜索 展开/关闭
        advanced: false,
        // 表头
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',
            width: 70,
            // align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '信息披露模版名称',
            dataIndex: 'templateType',
            width: 150
          },
          {
            title: '合同系列',
            width: 150,
            dataIndex: 'templateCode',
            customRender: (text)=> this.getDictNameByCode(this.dicts.CONTRACT_SERIE,text)
               
      
          },
          // {
          //   title: '信息披露规则类型',
          //   dataIndex: 'issuerCode',
          //   width: 150,
          //   customRender: (text) => this.getDictNameByCode(this.admOrgnaiztions,text)
          // },
          // {
          //   title: '参数信息',
          //   dataIndex: 'assetcatCode',
          //   width: '100px',
          //   customRender: (text) => this.getDictNameByCode(this.proAssetcats,text)
          // },
          {
            title: '操作',
            dataIndex: 'action',
            width: 150,
            // fixed: 'right',
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/baseline/admDisInfoMould/initialShow",
          delete: "/baseline/admDisInfoMould/delete",
          deleteBatch: "/baseline/admDisInfoMould/deleteBatch",
        },
        modal: {
          title: '信息披露模版新增',
          visible: false,
          fullscreen: false,
          switchFullscreen: false,
        },
        type: 'add',
        batchId: '',
      }
    },
    methods: {
      initDictConfig () {
        let promises = [
          this.getDict('CONTRACT_SERIE')
        ]
        Promise.all(promises).then(()=>{
          // this.loadData()
        })
      },
      infoDisAdd(type,batchId){
        const types = {
          add:  '信息披露模版新增',
          copy:  '信息披露模版复制新增',
          edite:  '信息披露模版编辑',
          view:  '信息披露模版查看',
        }
        if( type == 'copy' ) {
          if( this.selectedRowKeys.length !== 1 ){
            this.$message.warning('请选择一条模版操作')
            return
          }
          batchId = this.selectedRowKeys[0]
        }
        this.type = type
        this.batchId = batchId
        this.modal.title = types[type]
        this.modal.visible = true
      },
      handleOk(){
        this.$refs.infoDisModal.handleSubmit()
      },
      updateList() {
        this.modal.visible = false
        this.loadData()
      },
    },
    watch: {
    },
    mounted () {
    },
    created () {
      // this.loadData()
      this.initDictConfig()
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@assets/less/common.less'

</style>