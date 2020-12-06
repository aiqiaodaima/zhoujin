/**
费用收款信息
 */
<template>
  <a-card :bordered="false" title="费用收款信息">

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="infoDisAdd('add')">新增</a-button>
      <!-- <a-button type="primary" icon="plus" @click="infoDisAdd('copy')">复制新增</a-button> -->
      <a-button v-if="selectedRowKeys.length>0" type="primary" icon="delete" @click="batchDel('ids')">批量删除</a-button>
    </div>
    <div>
      <a-table
        ref="table"
        size="middle"
        rowKey="id"
        bordered
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
      <FeeAccountModal ref='feeAccountModal' :prjCode='prjCode' :optType='type' :id='id' @update='updateList'></FeeAccountModal>
    </BiModal>
    <WkfNextUserModal ref="wkfUserForm"/>
  </a-card>
</template>

<script>
  import biTableMixin from '@mixins/biTableMixin'
  import {deleteAction} from '@/api/manage'
  import dictMixin from '@mixins/dictMixin'
  import FeeAccountModal from './modules/FeeAccountModal'
  import WkfNextUserModal from '@views/activiti/modules/WkfNextUserModal';

  export default {
    name: "FeeAccount",
    components: {
      FeeAccountModal,
      WkfNextUserModal
    },
    mixins:[biTableMixin,dictMixin],
    data () {
      return {
        // 高级搜索 展开/关闭
        advanced: false,
        prjCode:'',
        // 表头
        columns:[
          {
            title: '费用类型',
            align:"center",
            dataIndex: 'feeCatCode',
            customRender: (text)=> this.getDictNameByCode(this.dicts.FEE_NAMES,text)
          },
          {
            title: '费用名称',
            align:"center",
            dataIndex: 'feeTypeCode',
            customRender: (text)=> this.getDictNameByCode(this.dicts.FEE_NAMES,text)
          },
          {
            title: '收款账号',
            align:"center",
            dataIndex: 'accNo'
          },
          {
            title: '收款账户',
            align:"center",
            dataIndex: 'accName'
          },
          {
            title: '收款账户开户行',
            align:"center",
            dataIndex: 'accOpenBank'
          },{
            title: '审核状态',
            align:"center",
            dataIndex: 'status',
            customRender: (text)=> this.getDictNameByCode(this.dicts.AUDIT_STATUS,text)
          },{
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/prj/cusFeeReguBank/list?prjCode="+this.$route.query.prjCode,
          delete: "/prj/cusFeeReguBank/delete",
          deleteBatch: "/prj/cusFeeReguBank/deleteBatch",
        },
        modal: {
          title: '费用收款信息新增',
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
          this.getDict('FEE_NAMES,AUDIT_STATUS,FEE_NAMES_MSG,TEMPLATE_COST_NAME')
        ]
        Promise.all(promises).then((res)=>{
        })
      },
      infoDisAdd(type,id){
        const types = {
          add:  '费用收款信息新增',
          copy:  '费用收款信息复制新增',
          edite:  '费用收款信息编辑',
          view:  '费用收款信息查看',
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
        this.$refs.feeAccountModal.handleSubmit()
      },
      updateList(processId) {
        this.modal.visible = false
        this.loadData()
        if(processId){
          this.$refs.wkfUserForm.edit(processId);
          this.$refs.wkfUserForm.disableSubmit = false;
        }
      },
    },
    watch: {
    },
    mounted () {
      this.prjCode=this.$route.query.prjCode
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