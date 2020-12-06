/**
投资顾问，资产发行机构，保险人，财产管理机构orgType
投资顾问基本信息  IM
保险人基本信息  IN
财产管理机构基本信息  AS
资产发行机构基本信息  PS
*/
<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" >
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
      <ArgumentsModal ref='ProEastProjectsJydsjgModal' :orgType='orgType' :id='id' @update='updateList' :type='type'></ArgumentsModal>
    </BiModal>
  </a-card>
</template>

<script>
  import biTableMixin from '@mixins/biTableMixin'
  import { getDict } from '@/api/BiApi'
  import dictMixin from '@mixins/dictMixin'
  import ArgumentsModal from './ArgumentsModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import ProEastProjectsJydsjgModal from './ProEastProjectsJydsjgModal'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  export default {
    name: "ProEastProjectsJydsjgList",
    components: {
      ProEastProjectsJydsjgModal,
    },
    mixins:[biTableMixin,dictMixin,JeecgListMixin],
    data () {
      return {
        // 高级搜索 展开/关闭
        advanced: false,
        // 表头
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title:'信托机构名称',
            align:"center",
            dataIndex: 'xtjgmc'
          },
          {
            title:'信托机构金融许可证代码',
            align:"center",
            dataIndex: 'xtjgjrxkzdm'
          },
          {
            title:'统一社会信用代码',
            align:"center",
            dataIndex: 'tyshxydm'
          },
          {
            title:'交易对手类型',
            align:"center",
            dataIndex: 'jydslx_dictText'
          },
          {
            title:'交易对手全称',
            align:"center",
            dataIndex: 'jydsqc'
          },
          {
            title:'交易对手编号',
            align:"center",
            dataIndex: 'jydsbh'
          },
          {
            title:'交易对手统一社会信用代码',
            align:"center",
            dataIndex: 'jydsshxydm'
          },
          {
            title:'所属国别',
            align:"center",
            dataIndex: 'ssgb'
          },
          {
            title:'所属地区',
            align:"center",
            dataIndex: 'ssdq'
          },
          {
            title:'行业分类',
            align:"center",
            dataIndex: 'hyfl'
          },
          {
            title:'行业明细',
            align:"center",
            dataIndex: 'hymx'
          },
          {
            title:'通讯地址',
            align:"center",
            dataIndex: 'txdz'
          },
          {
            title:'机构性质',
            align:"center",
            dataIndex: 'jgxz_dictText'
          },
          {
            title:'企业注册类别',
            align:"center",
            dataIndex: 'qyzclb_dictText'
          },
          {
            title:'企业规模',
            align:"center",
            dataIndex: 'qygm_dictText'
          },
          {
            title:'注册资本',
            align:"center",
            dataIndex: 'zczb'
          },
          {
            title:'法定代表人',
            align:"center",
            dataIndex: 'fddbr'
          },
          {
            title:'法定代表人证件类型',
            align:"center",
            dataIndex: 'fddbrzjlx_dictText'
          },
          {
            title:'法定代表人证件号码',
            align:"center",
            dataIndex: 'fddbrzjhm'
          },
          {
            title:'工商注册日期',
            align:"center",
            dataIndex: 'gszcrq'
          },
          {
            title:'工商登记到期日期',
            align:"center",
            dataIndex: 'gsdjdqrq'
          },
          {
            title:'总资产',
            align:"center",
            dataIndex: 'zcc'
          },
          {
            title:'总负债',
            align:"center",
            dataIndex: 'zfz'
          },
          {
            title:'上市标识',
            align:"center",
            dataIndex: 'ssbz_dictText'
          },
          {
            title:'上市地',
            align:"center",
            dataIndex: 'ssd_dictText'
          },
          {
            title:'是否归属集团标识',
            align:"center",
            dataIndex: 'sfgsjtbs_dictText'
          },
          {
            title:'集团名称',
            align:"center",
            dataIndex: 'jtjgmc'
          },
          {
            title:'三农标志',
            align:"center",
            dataIndex: 'snbz_dictText'
          },
          {
            title:'经济成份',
            align:"center",
            dataIndex: 'jjcf_dictText'
          },
          {
            title:'政府融资平台标识',
            align:"center",
            dataIndex: 'zfrzpbs_dictText'
          },
          {
            title:'实际控制人标识',
            align:"center",
            dataIndex: 'sjkzrbs_dictText'
          },
          {
            title:'实际控制人类型',
            align:"center",
            dataIndex: 'sjkzrlx_dictText'
          },
          {
            title:'实际控制人名称',
            align:"center",
            dataIndex: 'sjkzrmc'
          },
          {
            title:'实际控制人证件类型',
            align:"center",
            dataIndex: 'sjkzrzjlx_dictText'
          },
          {
            title:'实际控制人证件号码',
            align:"center",
            dataIndex: 'sjkzrzjhm'
          },
          {
            title:'关联方标识',
            align:"center",
            dataIndex: 'glfbs_dictText'
          },
          {
            title:'关联方编号',
            align:"center",
            dataIndex: 'glfbh'
          },
          {
            title:'数据日期',
            align:"center",
            dataIndex: 'sjrq'
          },
          {
            title:'采集日期',
            align:"center",
            dataIndex: 'cjrq'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/one2rich/proEastProjectsJydsjg/list",
          delete: "/one2rich/proEastProjectsJydsjg/delete",
          deleteBatch: "/one2rich/proEastProjectsJydsjg/deleteBatch",
          exportXlsUrl: "/one2rich/proEastProjectsJydsjg/exportXls",
          importExcelUrl: "one2rich/proEastProjectsJydsjg/importExcel",
        },

        modal: {
          title: '新增',
          visible: false,
          fullscreen: true,
          switchFullscreen: false,
        },
        type: 'add',
        id: '',
        orgType:''

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