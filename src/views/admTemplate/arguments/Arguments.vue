/**
投资顾问，资产发行机构，保险人，财产管理机构orgType
投资顾问基本信息  IM
保险人基本信息  IN
财产管理机构基本信息  AS
资产发行机构基本信息  PS
 */
<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form-model layout="inline">
        <a-row :gutter="16">
          <BiCol>
            <BiFormItemInput label="名称" v-model="queryParam.orgName" @pressEnter="enterKeySearch" placeholder="请输入名称"/>
          </BiCol>
          <BiCol>
            <BiTableSearchBtns @searchReset='searchReset' @searchQuery='searchQuery' v-model='advanced' :isAdvanced='false'/>
          </BiCol>
        </a-row>
      </a-form-model>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="infoDisAdd('add')">新增</a-button>
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
      <ArgumentsModal ref='argumentsModal' :orgType='orgType' :id='id' @update='updateList' :type='type'></ArgumentsModal>
    </BiModal>
  </a-card>
</template>

<script>
  import biTableMixin from '@mixins/biTableMixin'
  import { getDict } from '@/api/BiApi'
  import dictMixin from '@mixins/dictMixin'
  import ArgumentsModal from './ArgumentsModal'

  export default {
    name: "Arguments",
    components: {
      ArgumentsModal,
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
            dataIndex: 'orgName',
            width: 150
          },
          {
            title: '统一社会信用代码',
            dataIndex: 'creditCode',
            width: 150
          },
          {
            title: '联系人',
            dataIndex: 'contName',
            width: 100
          },
         {
            title: '手机号码',
            align: "center",
            width: 100,
            dataIndex: 'ctelNo'
          },
          {
            title: '固定电话',
            align: "center",
            width: 100,
            dataIndex: 'ftelNo'
          },
          {
            title: '联系地址',
            align: "center",
            width: 100,
            dataIndex: 'address'
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: 150,
            // fixed: 'right',
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/baseline/coopOrgan/queryAdmOrganInfo",
          delete: "/baseline/coopOrgan/deleteId",
          deleteBatch: "/baseline/coopOrgan/deleteBatch",
        },
        modal: {
          title: '新增',
          visible: false,
          fullscreen: true,
          switchFullscreen: false,
        },
        type: 'add',
        id: '',
        orgType:'',
        disableMixinCreated: true
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
      infoDisAdd(type,id){
        const types = {
          add:  '新增',
          copy:  '复制新增',
          edite:  '编辑',
          view:  '查看',
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
      searchReset() {
        this.queryParam = {
          orgType: this.orgType
        }
        this.loadData(1);
      },
      handleOk(){
        this.$refs.argumentsModal.onSubmit()
      },
      updateList() {
        this.modal.visible = false
        this.loadData()
      },
    },
    watch: {
    },
    mounted () {
      this.loadData()
    },
    created () {
      // this.loadData()
      // 投资顾问基本信息  IM
      // 保险人基本信息  IN
      // 财产管理机构基本信息  AS
      // 资产发行机构基本信息  PS
      const orgTypes = {
        'admTemplate-investAdviser': 'IM',
        'admTemplate-insurer': 'IN',
        'admTemplate-propertyOrg': 'AS',
        'admTemplate-issuer': 'PS',
      }
      const {name} = this.$route
      this.queryParam.orgType = orgTypes[name]
      this.orgType = orgTypes[name]
      // this.initDictConfig()
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@assets/less/common.less'

</style>