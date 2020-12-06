<template>
      <a-layout :style="{margin:'0px'}">
          <a-layout-content :style="{margin:'8px'}">
            <a-card size="small" title="其他关系人">
              <div class="table-operator">
                <a-button type="primary" icon="plus" @click="infoDisAdd('add')" v-if="optType!='view'">新增</a-button>
                <!-- <a-button v-if="selectedRowKeys.length>0" type="primary" icon="delete" @click="batchDel('ids')">批量删除</a-button>  -->
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
                  @change="handleTableChange">
                  <template slot="action" slot-scope="text, record">
                    <div class="editable-row-operations">
                      <span>
                        <a  @click="infoDisAdd('view',record.ID,record.NATURAL_OR_ORG_TYPE)">查看</a>
                        <a-divider v-if="optType!='view'" type="vertical" />
                        <a v-if="optType!='view'" @click="infoDisAdd('edite',record.ID,record.NATURAL_OR_ORG_TYPE)">编辑</a>
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
                :width="880"
                :title="modal.title"
                :fullscreen.sync="modal.fullscreen"
                :switchFullscreen="modal.switchFullscreen"
                @handleOk='handleOk'
                :destroyOnClose='true'
              >
                <OtherRelationMoadl ref='otherRelationMoadl' :clientType="clientType" :ddCode="ddCode" :optType='type' :id='id' @update='updateList'></OtherRelationMoadl>
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
import OtherRelationMoadl from './OtherRelationMoadl'
export default {
  name: 'OtherRelation',
  components: {
    OtherRelationMoadl
  },
  mixins:[biTableMixin,dictMixin],
  props: {
    optType:{
      default:'add'
    },
    prjCode:{
      default: ''
    },
    ddCode:{
      default: ''
    }
  },
  data () {
      return {
        // 高级搜索 展开/关闭
        advanced: false,
        // 表头
        columns: [
          {
            title: '关系人类型',
            width: 130,
            dataIndex: 'PARTY_TYPE',
            customRender: (text)=> this.getDictNameByCode(this.dicts.CUS_REL_TYPR,text)
          },
          {
            title: '顺位',
            width: 130,
            dataIndex: 'PARTY_RANG',
          },
          {
            title: '姓名/名称',
            dataIndex: 'PARTY_NAME',
            width: 150,
            // align: "center",
          },
          {
            title: '证件类型',
            dataIndex: 'IDN_TYPE',
            width: 150,
            //customRender: (text)=> this.getDictNameByCode(this.dicts.CRM_IDE_TYPE,text)
          },
          {
            title: '证件号码',
            width: 160,
            dataIndex: 'IDN',
          },
          {
            title: '手机号',
            width: 130,
            dataIndex: 'CPHONE',
          },
          {
            title: '座机',
            width: 130,
            dataIndex: 'FPHONE',
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
          list: "/prj/cusDDInfo/otherParty/list",
          delete: "/prj/cusDDInfo/otherParty/del",
        },
        modal: {
          title: '费用规则模版新增',
          visible: false,
          fullscreen: false,
          switchFullscreen: false,
        },
        clientType:'all',
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
          this.getDict('CUS_REL_TYPR,REL_TYPE,CRM_IDE_TYPE,CONTRACT_SERIE,FEE_NAMES,FEE_NAMES_MSG,FEE_CAL_MODE,COM_MODE,FEE_PAY_OBJECT,FREQUENCY2,NATUREDAY_YN,TFIX_TYPE,INT_DAY_BASE,FREQUENCY,NATUREDAY_YN,TFIX_TYPE,FEE_BASE')
        ]
        Promise.all(promises).then((res)=>{
          // this.loadData()
        })
      },
      infoDisAdd(type,id,clientType){
        this.clientType=clientType
        this.type = type
        this.id = id
        this.modal.title = '其他关系人'
        this.modal.visible = true
      },
      handleOk(){
        if(this.type=="view"){
          this.modal.visible = false
          return
        }
        this.$refs.otherRelationMoadl.handleSubmit()
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