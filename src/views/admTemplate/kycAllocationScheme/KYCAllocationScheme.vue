/**
Kyc分配方案模版管理
 */
<template>
  <a-card :bordered="false">

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="infoDisAdd('add')">新增Kyc分配方案模版</a-button>
      <!-- <a-button type="primary" icon="plus" @click="infoDisAdd('copy')">复制新增</a-button> -->
      <a-button v-if="selectedRowKeys.length>0" type="primary" icon="delete" @click="batchDel('ids')">批量删除</a-button>
    </div>
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
      :destroyOnClose='true'
    >
      <KYCAllocationSchemeModal ref='kycAllocationSchemeModal' :optType='type' :id='id' @update='updateList'></KYCAllocationSchemeModal>
    </BiModal>
  </a-card>
</template>

<script>
  import biTableMixin from '@mixins/biTableMixin'
  import {deleteAction} from '@/api/manage'
  import dictMixin from '@mixins/dictMixin'
  import KYCAllocationSchemeModal from './KYCAllocationSchemeModal'

  export default {
    name: "KYCAllocationScheme",
    components: {
      KYCAllocationSchemeModal,
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
            title: '模板名称',
            dataIndex: 'name',
            width: 150,
          },
          {
            title: '分配类型',
            dataIndex: 'disType',
            width: 150,
            customRender: (text)=> this.getDictNameByCode(this.dicts.KYC_DIST_NAME,text)
          },
          {
            title: '分配细类',
            dataIndex: 'disSubType',
            width: 150,
            customRender: (text)=> this.getDictNameByCode(this.dicts.KYC_DIST_NAME,text)
          },
          {
            title: '合同系列',
            width: 160,
            dataIndex: 'contractSerie',
            customRender: (text)=> this.getDictNameByCode(this.dicts.CONTRACT_SERIE,text)
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: 200,
            // fixed: 'right',
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/baseline/admkyv/list",
          delete: "/baseline/admkyv/delete",
          deleteBatch: "/baseline/admkyv/deleteBatch",
        },
        modal: {
          title: 'Kyc分配方案模版新增',
          visible: false,
          fullscreen: false,
          switchFullscreen: false,
        },
        type: 'add',
        id: '',
      }
    },
    methods: {
        handleDelete: function (param) {
          if(!this.url.delete){
            this.$message.error("请设置url.delete属性!")
            return
          }
          var that = this;
          deleteAction(that.url.delete,param).then((res) => {
            if (res.success) {
              that.$message.success(res.message);
              that.loadData();
            } else {
              that.$message.warning(res.message);
            }
          });
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
      initDictConfig () {
        let promises = [
          this.getDict('CONTRACT_SERIE,KYC_DIST_NAME,FIX_DISTRIBUTION')
        ]
        Promise.all(promises).then((res)=>{
        })
      },
      infoDisAdd(type,id){
        const types = {
          add:  'Kyc分配方案模版新增',
          copy:  'Kyc分配方案模版复制新增',
          edite:  'Kyc分配方案模版编辑',
          view:  'Kyc分配方案模版查看',
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
        this.modal.title = types[type]
        this.modal.visible = true
      },
      handleOk(){
        if(this.type=="view"){
          this.modal.visible = false
          return
        }
        this.$refs.kycAllocationSchemeModal.handleSubmit()
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