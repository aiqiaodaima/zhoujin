<template>
  <a-card :bordered="false">
    <!-- 查询 暂时空着 -->
    <!-- 操作按钮区 -->
  <!--  -->
    <div class="table-operator" >
      <a-button type="primary" icon="plus" @click="infoDisAdd('add')">新增</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-button type="primary" icon="delete" @click="batchDel('ids')">批量删除</a-button>
      </a-dropdown>
    </div>
    <!-- table区域start -->

      <div>
        <a-table class="table-min-height"
                 ref="table"
                 size="middle"
                 rowKey="cpactid"
                :scroll="{ x: 2400,y: 500 }"
                :columns="columns"
                :dataSource="dataSource"
                :pagination="ipagination"
                :loading="loading"
                :rowSelection="{selectedRowKeys: selectedRowKeys,onChange: onSelectChange}"
                @change="handleTableChange"
        >
        <!-- 查看编辑删除 -->

        <template slot="action" slot-scope="text, record">
          <div class="editable-row-operations">
            <span>
              <a  @click="infoDisAdd('view',record.cpactid)">查看</a>
              <a-divider type="vertical" />
              <a  @click="infoDisAdd('edite',record.cpactid)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm
                title="确认删除吗?"
                @confirm="()=>handleDelete({cpactid:record.cpactid})"
              >
                <a href="#">删除</a>
              </a-popconfirm>
            </span>
          </div>
        </template>

        </a-table>

      </div>
    <!-- table区域end -->


    <BiModal
      :visible.sync="modal.visible"
      :title="modal.title"
      :fullscreen.sync="modal.fullscreen"
      :switchFullscreen="modal.switchFullscreen"
      :width="800"
      @handleOk='handleOk'
      :destroyOnClose='true'
    >
      <InvestmentContractManageModel ref='InvestmentContractManageModel' :orgType='orgType' :id='id' :type='type'
                            @update='updateList'></InvestmentContractManageModel>
    </BiModal>


  </a-card>

</template>
<script>
  import biTableMixin from '@/mixins/biTableMixin'
  import dictMixin from '@mixins/dictMixin'
  import InvestmentContractManageModel from './modules/InvestmentContractManageModel'
  import {deleteAction} from '@/api/manage'
  import { getAction,postAction,deleteActionByPostMethod } from '../../api/manage'

  export default {
    name:'InvestmentContractManage',
    mixins:[biTableMixin,dictMixin],
    components:{
      InvestmentContractManageModel
    },
    data() {
      return {
        // 表头
        columns:[
          {
            title:'序号',
            dataIndex:'id',
            // dataIndex:'cpactid',
            key: 'rowIndex',
            width: 100,
            fixed: 'left',
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '合同编号',
            dataIndex: 'cPactno',
            width: 150,
            fixed: 'left',
            // customRender: (text) => {
            //   //字典值替换通用方法
            //   return filterDictText(this.dictOptionsData['VOA_TYPE'], text)
            // }
          },
          {
            title: '合同规范全称',
            dataIndex: 'cpactname',
            width: 150
          },
          {
            title: '项目编号',
            dataIndex: 'cprojcode',
            width: 150
          },
          {
            title: '投资项目编号',
            dataIndex: 'cinvestcode',
            width: 150
          },
          {
            title: '关联产品代码',
            dataIndex: 'cfundcode',
            width: 150
          },
          {
            title: '合同性质',
            dataIndex: 'cpactprop',
            width: 150,
            customRender: (text)=> this.getDictNameByCode(this.dicts.contract_nature,text)
            // contract_nature
          },
          {
            title: '合同签订日期',
            dataIndex: 'dsdate',
            width: 150
          },
          {
            title: '合同开始日期',
            dataIndex: 'dbdate',
            width: 150
          },
          {
            title: '合同到期日期',
            dataIndex: 'dedate',
            width: 150
          },
          {
            title: '合同签订金额',
            dataIndex: 'famount',
            width: 150
          },
          {
            title: '利率类别',
            dataIndex: 'cratetype',
            width: 150,
            // rate_category
            customRender: (text)=> this.getDictNameByCode(this.dicts.rate_category,text)
          },
          {
            title: '投向行业',
            dataIndex: 'lindustry',
            width: 150
          },
          {
            title: '资金运用方式',
            dataIndex: 'ccapuseway',
            width: 150
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: 150,
            align: "center",
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list:'/project/vAmPact/list',
          delete:'/project/vAmPact/delete',//id
          deleteBatch:'/project/vAmPact/deleteBatch',//批量删除
          edite:'/project/vAmPact/edit'//编辑
        },
        modal: {
          title: '新增',
          visible: false,
          fullscreen: true,
          switchFullscreen: false,
        },
        type: 'add',
        id: ' ',
        orgType: '',

        // 
        // disableMixinCreated: true,
        disableMixinCreated: false,
      }
    },
    computed: {

    },
    methods: {
      handleOk(){
        this.$refs.InvestmentContractManageModel.onSubmit()
      },
      updateList() {
        this.modal.visible = false
        this.loadData()
      },
      infoDisAdd(type,id){
        const types = {
            add:  '新增',
            // copy:  '复制新增',
            edite:  '编辑',
            view:  '查看',
        }
        this.type = type
        this.id = id
        this.modal.title = types[type]
        this.modal.visible = true
      },
    },
    mounted () {

    },
    created () {
      this.getDict('contract_nature')
      console.error(this.dicts)
    }

  }
</script>

<style scoped>
   @import '~@assets/less/common.less';
</style>