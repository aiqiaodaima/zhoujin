/**
项目期间费用
 */
<template>
  <a-card :bordered="false" title="项目期间费用">

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="infoDisAdd('add')">新增</a-button>
      <!-- <a-button type="primary" icon="plus" @click="infoDisAdd('copy')">复制新增</a-button> -->
      <a-button v-if="selectedRowKeys.length>0" type="primary" icon="delete" @click="batchDel('ids')">批量删除</a-button>
    </div>
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :scroll="{ x: 1000 }"
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
      :width="1200"
      :title="modal.title"
      :fullscreen.sync="modal.fullscreen"
      :switchFullscreen="modal.switchFullscreen"
      @handleOk='handleOk'
      :destroyOnClose='true'
    >
      <ProjectPeriodFeeModel ref='projectPeriodFeeModel' :prjCode='prjCode' :optType='type' :id='id' @update='updateList'></ProjectPeriodFeeModel>
    </BiModal>
    <WkfNextUserModal ref="wkfUserForm"/>
  </a-card>
</template>

<script>
  import biTableMixin from '@mixins/biTableMixin'
  import {deleteAction} from '@/api/manage'
  import dictMixin from '@mixins/dictMixin'
  import ProjectPeriodFeeModel from './modules/ProjectPeriodFeeModel'
  import WkfNextUserModal from '@views/activiti/modules/WkfNextUserModal';

  export default {
    name: "ProjectPeriodFee",
    components: {
      ProjectPeriodFeeModel,
      WkfNextUserModal
    },
    mixins:[biTableMixin,dictMixin],
    data () {
      return {
        // 高级搜索 展开/关闭
        advanced: false,
        prjCode:'',
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
            title: '费用类型',
            width: 160,
            dataIndex: 'feeCatCode',
            align: "center",
            customRender: (text)=> this.getDictNameByCode(this.dicts.FEE_NAMES,text)
          },
          {
            title: '费用名称',
            width: 160,
            dataIndex: 'feeTypeCode',
            align: "center",
            customRender: (text)=> this.getDictNameByCode(this.dicts.FEE_NAMES,text)
          },
          {
            title: '计费模式',
            width: 160,
            dataIndex: 'calMode',
            align: "center",
            customRender: (text)=> this.getDictNameByCode(this.dicts.FEE_CAL_MODE,text)
          },
          {
            title: '计提标准',
            width: 160,
            align: "center",
            dataIndex: 'feeBase',
            customRender: (text)=> this.getDictNameByCode(this.dicts.FEE_BASE,text)
          },
          {
            title: '费用/费率',
            width: 160,
            align: "center",
            dataIndex: 'fee',
            customRender:(text,r)=>{
              if(r.calMode=='CI-F'||r.calMode=='CI-R'||r.calMode=='CI-AR'){
                return '--'
              }else if(r.calMode=='R'||r.calMode=='AR'){
                return text==null||text==''?'--':(text+'%')
              }else{
                return text
              }
            }
          },
          {
            title: '核算频率',
            width: 160,
            align: "center",
            dataIndex: 'calFrequency',
            customRender: (text)=> this.getDictNameByCode(this.dicts.FREQUENCY2,text)
          },
          {
            title: '支付频率',
            width: 160,
            dataIndex: 'frequency',
            align: "center",
            customRender: (text)=> this.getDictNameByCode(this.dicts.FREQUENCY,text)
          },
          {
            title: '起始日',
            width: 160,
            align: "center",
            dataIndex: 'regulStartDt'
          },
          {
            title: '结束日',
            width: 160,
            align: "center",
            dataIndex: 'regulEndDt'
          },
          {
            title: '审核状态',
            align: "center",
            width: 160,
            dataIndex: 'status',
            customRender: (text)=> this.getDictNameByCode(this.dicts.AUDIT_STATUS,text)
          },
          {
            title: '使用状态',
            align: "center",
            width: 160,
            dataIndex: 'useStatus',
            customRender: (text)=> this.getDictNameByCode(this.dicts.USE_STATUS,text)
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            fixed: 'right',
            width: 160,
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/prj/cusFee/regulations/list?prjCode="+this.$route.query.prjCode,
          delete: "/prj/cusFee/regulations/delete",
          deleteBatch: "/prj/cusFee/regulations/deleteBatch",
        },
        modal: {
          title: '项目期间费用新增',
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
          this.getDict('CONTRACT_SERIE,FEE_NAMES,FEE_NAMES_MSG,FEE_CAL_MODE,COM_MODE,FEE_PAY_OBJECT,FREQUENCY2,NATUREDAY_YN,TFIX_TYPE,INT_DAY_BASE,FREQUENCY,TFIX_TYPE,FEE_BASE,AUDIT_STATUS,USE_STATUS')
        ]
        Promise.all(promises).then((res)=>{
        })
      },
      infoDisAdd(type,id){
        const types = {
          add:  '项目期间费用新增',
          copy:  '项目期间费用复制新增',
          edite:  '项目期间费用编辑',
          view:  '项目期间费用查看',
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
        this.$refs.projectPeriodFeeModel.handleSubmit()
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