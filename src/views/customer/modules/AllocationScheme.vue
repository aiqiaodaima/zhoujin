<template>
      <a-layout :style="{margin:'0px'}">
          <a-layout-content :style="{margin:'8px'}">
            <a-card size="small" title="分配方案">
              <div class="table-operator">
                <a-button type="primary" icon="plus" @click="infoDisAdd('add')" v-if="optType!='view'">新增</a-button>
                <!-- <a-button v-if="selectedRowKeys.length>0" type="primary" icon="delete" @click="batchDel('ids')">批量删除</a-button>  -->
              </div>
              <div>
                <a-table class="table-min-height"
                  bordered
                  ref="table"
                  size="middle"
                  rowKey="id"
                  :columns="columns"
                  :dataSource="dataSource"
                  :pagination="ipagination"
                  :loading="loading"
                  @change="handleTableChange">
                  <template slot="action" slot-scope="text, record">
                    <div class="editable-row-operations">
                      <span>
                        <a  @click="infoDisAdd('view',record.ID)">查看</a>
                        <a-divider v-if="optType!='view'" type="vertical" />
                        <a v-if="optType!='view'" @click="infoDisAdd('edite',record.ID)">编辑</a>
                        <a-divider v-if="optType!='view'" type="vertical" />
                        <a-popconfirm v-if="optType!='view'"
                          title="确认删除吗?"
                          @confirm="()=>handleDelete({id:record.ID})"
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
                <AllocationSchemeMoadl ref='allocationSchemeMoadl' :ddCode="ddCode" :optType='type' :id='id' @update='updateList'></AllocationSchemeMoadl>
              </BiModal>
            </a-card>
          </a-layout-content>
      </a-layout>
</template>

<script>
import biTableMixin from '@mixins/biTableMixin'
import { getDict } from '@/api/BiApi'
import {deleteAction} from '@/api/manage'
import dictMixin from '@mixins/dictMixin'
import AllocationSchemeMoadl from './AllocationSchemeMoadl'
export default {
  name: 'AllocationScheme',
  components: {
    AllocationSchemeMoadl
  },
  mixins:[biTableMixin,dictMixin],
  props: {
    optType:{
      default: 'add'
    },
    prjCode:{
      default: ''
    },
    ddCode:{
      default: ''
    },
  },
  data () {
      return {
        // 高级搜索 展开/关闭
        advanced: false,
        // 表头
        columns: [
          {
            title: '分配类型',
            dataIndex: 'DIS_TYPE',
            width: 150,
            customRender: (text)=> this.getDictNameByCode(this.dicts.KYC_DIST_NAME,text)
          },
          {
            title: '分配细类',
            dataIndex: 'DIS_SUB_TYPE',
            width: 150,
            customRender: (text)=> this.getDictNameByCode(this.dicts.KYC_DIST_NAME,text)
          },
          {
            title: '受益人',
            width: 160,
            dataIndex: 'CONSIGNERS',
          },
          {
            title: '分配规则',
            width: 130,
            dataIndex: 'DIS_RULE',
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
          list: "/prj/cusDDInfo/assignment/list",
          delete: "/prj/cusDDInfo/assignment/del",
        },
        modal: {
          title: '费用规则模版新增',
          visible: false,
          fullscreen: false,
          switchFullscreen: false,
        },
        type: 'add',
        id: '',
      }
    },
  watch: {},
  created() {
    this.initDictConfig()
    this.queryParam.ddCode=this.ddCode
  },
  mounted() {
    //mounted here
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
          this.getDict('KYC_DIST_NAME,CONTRACT_SERIE,FEE_NAMES,FEE_NAMES_MSG,FEE_CAL_MODE,COM_MODE,FEE_PAY_OBJECT,FREQUENCY2,NATUREDAY_YN,TFIX_TYPE,INT_DAY_BASE,FREQUENCY,NATUREDAY_YN,TFIX_TYPE,FEE_BASE')
        ]
        Promise.all(promises).then((res)=>{
          // this.loadData()
        })
      },
      infoDisAdd(type,id){
        if( type == 'copy' ) {
          if( this.selectedRowKeys.length !== 1 ){
            this.$message.warning('请选择一条模版操作')
            return
          }
          id = this.selectedRowKeys[0]
        }
        this.type = type
        this.id = id
        this.modal.title = '分配方案维护'
        this.modal.visible = true
      },
      handleOk(){
        if(this.type=="view"){
          this.modal.visible = false
          return
        }
        this.$refs.allocationSchemeMoadl.handleSubmit()
      },
      updateList() {
        this.modal.visible = false
        this.loadData()
      },
    },
}
</script>

<style lang="stylus" scoped>
@import '~@assets/less/common.less';
</style>