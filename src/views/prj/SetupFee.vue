/**
项目设立费
 */
<template>
  <a-card :bordered="false" title="项目设立费">

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="infoDisAdd('add')" v-if="showAdd">新增</a-button>
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
              <a @click="infoDisAdd('view',record.id)">查看</a>
              <a-divider v-if="record.status=='1'&&(record.odrStatus=='15'||record.odrStatus=='55')" type="vertical" />
              <a  v-if="record.status=='1'&&(record.odrStatus=='15'||record.odrStatus=='55')"  @click="infoDisAdd('edite',record.id)">编辑</a>
              <a-divider v-if="record.status=='1'&&(record.odrStatus=='15'||record.odrStatus=='55')" type="vertical" />
              <a-popconfirm   v-if="record.status=='1'&&(record.odrStatus=='15'||record.odrStatus=='55')" 
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
      <SetupFeeModal ref='setupFeeModal' :prjCode='prjCode' :optType='type' :id='id' @update='updateList'></SetupFeeModal>
    </BiModal>
  </a-card>
</template>

<script>
  import biTableMixin from '@mixins/biTableMixin'
  import {deleteAction,getAction} from '@/api/manage'
  import dictMixin from '@mixins/dictMixin'
  import SetupFeeModal from './modules/SetupFeeModal'

  export default {
    name: "SetupFee",
    components: {
      SetupFeeModal,
    },
    mixins:[biTableMixin,dictMixin],
    data () {
      return {
        // 高级搜索 展开/关闭
        advanced: false,
        showAdd:false,//是否展示新增按钮
        prjCode:'',
        // 表头
        columns: [
          {
            title: '费用名称',
            align:"center",
            dataIndex: 'feeType',
            customRender: (text)=> this.getDictNameByCode(this.dicts.SETUP_FEE_NAMES,text)
          },
          {
            title: '币种',
            align:"center",
            dataIndex: 'curCode',
            customRender: (text)=> this.getDictNameByCode(this.dicts.CUR_CODE,text)
          },
          {
            title: '金额',
            align:"center",
            dataIndex: 'fee'
          },
          {
            title: '资金来源',
            align:"center",
            dataIndex: 'capitalSrc',
            customRender: (text)=> this.getDictNameByCode(this.dicts.FEE_CAP_SRC,text)
          },
          {
            title: '支付方',
            align:"center",
            dataIndex: 'payerType',
            customRender: (text)=> this.getDictNameByCode(this.dicts.FEE_PAYER_TYPE,text)
          },
          {
            title: '订单状态',
            align:"center",
            dataIndex: 'odrStatus',
            customRender: (text)=> this.getDictNameByCode(this.dicts.orderStatus,text)
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/prj/cusTrustSetupfee/list?prjCode="+this.$route.query.prjCode,
          delete: "/prj/cusTrustSetupfee/delete",
          deleteBatch: "/prj/cusTrustSetupfee/deleteBatch",
          getStatusByPrjCode:"/prj/cusTrustSetupfee/getStatusByPrjCode"
        },
        modal: {
          title: '项目设立费新增',
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
          this.getDict('FEE_NAMES_MSG,CUR_CODE,FEE_CAP_SRC,FEE_PAYER_TYPE,orderStatus,SETUP_FEE_NAMES')
        ]
        Promise.all(promises).then((res)=>{
        })
      },
      infoDisAdd(type,id){
        const types = {
          add:  '项目设立费新增',
          copy:  '项目设立费复制新增',
          edite:  '项目设立费编辑',
          view:  '项目设立费查看',
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
        this.$refs.setupFeeModal.handleSubmit()
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
      this.prjCode=this.$route.query.prjCode
      this.loading = true;
      getAction(this.url.getStatusByPrjCode, {prjCode:this.prjCode}).then((res) => {
        if (res.success) {
          this.showAdd=res.result.prjStatus=='U'
        } else {
          this.$message.warning(res.message);
        }
      }).finally(() => {
        this.loading = false;
      });
      this.initDictConfig()
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@assets/less/common.less'

</style>