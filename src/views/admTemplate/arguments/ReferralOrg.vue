/*
客户推荐机构
*/
<template>
  <a-card :bordered="false">

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleNew('add')" type="primary" icon="plus">新增</a-button>
      <a-button style="margin-left: 8px" icon="delete" v-if="selectedRowKeys.length > 0" @click="batchDel('orgCode')"> 批量删除 </a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        rowKey="orgCode"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :expandedRowKeys="expandedRowKeys"
        @change="handleTableChange"
        @expand="handleExpand"
        v-bind="tableProps">

        <span slot="action" slot-scope="text, record">
          <a @click="handleNew('add',record)">添加下级</a>
          <a-divider type="vertical" />
          <a @click="handleNew('view',record)">查看</a>
          <a-divider type="vertical" />
          <a @click="handleNew('edite',record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete({orgCode:record.orgCode})">
            <a>删除</a>
          </a-popconfirm>
        </span>

      </a-table>
    </div>
    <BiModal
      :visible.sync="modal.visible"
      :width="800"
      :title="modal.title"
      :fullscreen.sync="modal.fullscreen"
      :switchFullscreen="modal.switchFullscreen"
      @handleOk='modalFormOk'
      :destroyOnClose='true'
    >
      <ReferralOrgModal  ref="modalForm" @ok="modalFormOk" 
        :type='type'
        :parentOrg='parentOrg'
        @update='update'
       ></ReferralOrgModal>
    </BiModal>
  </a-card>
</template>

<script>

  import { getAction } from '@/api/manage'
  import { biListMixin } from '@/mixins/biListMixin'
  import ReferralOrgModal from './ReferralOrgModal'
  
  export default {
    name: "ReferralOrg",
    mixins:[biListMixin],
    components: {
      ReferralOrgModal
    },
    data () {
      return {
        description: '客户机构管理页面',
        // 表头
        columns: [
          {
            title:'客户推荐机构名称',
            align:"left",
            dataIndex: 'orgName'
          },
         
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/baseline/cusRecommendOrg/rootList",
          childList: "/baseline/cusRecommendOrg/childList",
          delete: "/baseline/cusRecommendOrg/deleteId",
          deleteBatch: "/baseline/cusRecommendOrg/deleteBatch",
        },
        expandedRowKeys:[],
        hasChildrenField:"nodeYn",
        pidField:"orgCode",
        dictOptions:{
        },
        modal: {
          title: '新增',
          visible: false,
          fullscreen: true,
          switchFullscreen: false,
        },
        type: 'add',
        id: '',
        parentOrg:{}
      }
    },
    computed: {
      importExcelUrl(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
      tableProps() {
        let _this = this
        return {
          // 列表项是否可选择
          rowSelection: {
            selectedRowKeys: _this.selectedRowKeys,
            onChange: (selectedRowKeys) => _this.selectedRowKeys = selectedRowKeys
          }
        }
      },
    },
    methods: {
      loadData(arg){
        if(arg==1){
          this.ipagination.current=1
        }
        this.loading = true
        this.expandedRowKeys = []
        let params = this.getQueryParams()
        return new Promise((resolve) => {
          getAction(this.url.list,params).then(res=>{
            if(res.success){
              let result = res.result
              if(Number(result.total)>0){
                this.ipagination.total = Number(result.total)
                this.dataSource = this.getDataByResult(res.result.records)
                resolve()
              }else{
                this.ipagination.total=0
                this.dataSource=[]
              }
            }else{
              this.$message.warning(res.message)
            }
            this.loading = false
          })
        })
      },
      getDataByResult(result){
        return result.map(item=>{
          //判断是否标记了带有子节点
          if(item[this.hasChildrenField] == 1){
            let loadChild = { orgCode: item.orgCode+'_loadChild', name: 'loading...', isLoading: true }
            item.children = [loadChild]
          }
          return item
        })
      },
      handleExpand(expanded, record){
        // 判断是否是展开状态
        if (expanded) {
          this.expandedRowKeys.push(record.orgCode)
          if (record.children.length>0 && record.children[0].isLoading === true) {
            let params = this.getQueryParams();//查询条件
            params[this.pidField] = record.orgCode
            getAction(this.url.childList,params).then((res)=>{
              if(res.success){
                if(res.result && res.result.records.length>0){
                  record.children = this.getDataByResult(res.result.records)
                  this.dataSource = [...this.dataSource]
                }else{
                  record.children=''
                  record[this.hasChildrenField]='0'
                }
              }else{
                this.$message.warning(res.message)
              }
            })
          }
        }else{
          let keyIndex = this.expandedRowKeys.indexOf(record.orgCode)
          if(keyIndex>=0){
            this.expandedRowKeys.splice(keyIndex, 1);
          }
        }
      },
      initDictConfig(){
      },
      modalFormOk(formData,arr){
        // if(!formData.id){
        //   this.addOk(formData,arr)
        // }else{
        //   this.editOk(formData,this.dataSource)
        //   this.dataSource=[...this.dataSource]
        // }
        this.$refs.modalForm.onSubmit()
      },
      editOk(formData,arr){
        if(arr && arr.length>0){
          for(let i=0;i<arr.length;i++){
            if(arr[i].id==formData.id){
              arr[i]=formData
              break
            }else{
              this.editOk(formData,arr[i].children)
            }
          }
        }
      },
      async addOk(formData,arr){
        if(!formData[this.pidField]){
          this.loadData()
        }else{
          this.expandedRowKeys=[]
          for(let i of arr){
            await this.expandTreeNode(i)
          }
        }
      },
      expandTreeNode(nodeId){
        return new Promise((resolve,reject)=>{
          this.getFormDataById(nodeId,this.dataSource)
          let row = this.parentFormData
          this.expandedRowKeys.push(nodeId)
          let params = this.getQueryParams();//查询条件
          params[this.pidField] = nodeId
          getAction(this.url.childList,params).then((res)=>{
            if(res.success){
              if(res.result && res.result.length>0){
                row.children = this.getDataByResult(res.result)
                this.dataSource = [...this.dataSource]
                resolve()
              }else{
                reject()
              }
            }else{
              reject()
            }
          })
        })
      },
      getFormDataById(id,arr){
        if(arr && arr.length>0){
          for(let i=0;i<arr.length;i++){
            if(arr[i].id==id){
              this.parentFormData = arr[i]
            }else{
              this.getFormDataById(id,arr[i].children)
            }
          }
        }
      },
      handleNew(type,item){
        const types = {
          add:  '新增',
          edite:  '编辑',
          view:  '查看',
        }
        this.type = type
        this.parentOrg = {
          parentOrgName: item&&item.orgName || '',
          parentOrgCode: item&&item.orgCode || '',
          strset: item&&item.strset || '',
          depths: item&&item.depths || 0,
        }
        if( type !== 'add' ){
          this.parentOrg.orgCode = item.orgCode
          this.parentOrg.parentOrgName = item.parentOrgName
          this.parentOrg.parentOrgCode = item.parentOrgCode
        }
        this.modal.title = types[type]
        this.modal.visible = true
      },
      update() {
        this.modal.visible = false
        this.loadData()
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>