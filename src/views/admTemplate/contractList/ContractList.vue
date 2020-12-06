/**
合同模板管理
 */
<template>
    <a-card :bordered="false">
      <div class="table-operator">
        <a-button type="primary" icon="plus"  @click="handleAdd()" >新增合同模版</a-button>
        <!-- <a-button v-if="selectedRowKeys.length>0" type="primary" icon="delete" @click="batchDel('ids')">批量删除</a-button> -->
      </div>
      <div>
        <a-table class="table-min-height"
          ref="table"
          size="middle"
          rowKey="fileId"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          @change="handleTableChange"               
        >
        <template slot="action" slot-scope="text, record" >
          <div class="editable-row-operations">
            <span>
              <a @click="handleEdit(record)">编辑</a>              
              <a-divider type="vertical" />
              <a-popconfirm
                title="确认删除吗?"
                @confirm="()=>handleDelete({fileId:record.fileId})"
              >
                <a href="#">删除</a>
              </a-popconfirm>
            </span>
          </div>
        </template>
        </a-table>
      </div> 
    </a-card>
</template>


<script>
  import biTableMixin from '@mixins/biTableMixin'
  import {deleteAction} from '@/api/manage'
  import dictMixin from '@mixins/dictMixin'
  
  export default {
    name: "ContractList",
    components: {
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
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '模板名称',
            dataIndex: 'contractName',
            width: 150,
        
          },
          {
            title: '合同系列',
            dataIndex: 'contractSerie',
            width: 150,
            customRender: (text)=> this.getDictNameByCode(this.dicts.YC_CONTRACT_SERIE,text)
          },
          {
            title: '业务类型',
            width: 160,
            dataIndex: 'contractType',
            customRender: (text)=> this.getDictNameByCode(this.dicts.PRJ_TYPE,text)
          },
          {
            title: '合作渠道',
            width: 160,
            dataIndex: 'contractChannel',
            customRender: (text)=> this.getDictNameByCode(this.dicts.CONTRACT_CHANNEL,text)
          },
          {
            title: '模板状态',
            width: 160,
            dataIndex: 'templateStatus',
            customRender: (text)=> this.getDictNameByCode(this.dicts.TEMPLATE_STATUS,text)
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
          list: "/sys/CusContractFile/list",
          delete: "/sys/CusContractFile/del",//根据id删除         
        },
      }
    },
    created() {
      this.optType = this.$route.query.optType;
      this.prjCode = this.$route.query.prjCode;
    },
    mounted() {
      // this.initPage();
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
        //批量删除
      //   batchDel: function (key) {
      //     if(!this.url.deleteBatch){
      //       this.$message.error("请设置url.deleteBatch属性!")
      //       return
      //     }
      //     if (this.selectedRowKeys.length <= 0) {
      //       this.$message.warning('请选择一条记录！');
      //       return;
      //     } else {
      //       var ids = "";
      //       let param = {}
      //       for (var a = 0; a < this.selectedRowKeys.length; a++) {
      //         ids += this.selectedRowKeys[a] + ",";
      //       }
      //       key = key || 'ids'
      //       param[key] = ids
      //       var that = this;
      //       this.$confirm({
      //         title: "确认删除",
      //         content: "是否删除选中数据?",
      //         onOk: function () {
      //           that.loading = true;
      //           deleteAction(that.url.deleteBatch, param).then((res) => {
      //             if (res.success) {
      //               that.$message.success(res.message);
      //               that.loadData();
      //               that.onClearSelected();
      //             } else {
      //               that.$message.warning(res.message);
      //             }
      //           }).finally(() => {
      //             that.loading = false;
      //           });
      //         }
      //       });
      //     }
      // },
      //编辑操作
      handleEdit(record){          
          var baseUrl = 'http://182.92.165.252:8080/fts-module-front/EditCusContractFile.html'
          //原页面打开         
          // location.href=baseUrl+"?fid="+record.fileId;
          //打开新页面
          window.open(baseUrl+"?fileId="+record.fileId);      
      },
      //新增
      handleAdd(){
        var baseUrl = 'http://182.92.165.252:8080/fts-module-front/addCusContractFile.html'
        window.open(baseUrl);
        
      },
      initDictConfig () {
        let promises = [
          this.getDict('YC_CONTRACT_SERIE,PRJ_TYPE,CONTRACT_CHANNEL,TEMPLATE_STATUS')
        ]
        Promise.all(promises).then((res)=>{
          
        })
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