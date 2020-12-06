<template>
  <div class="page-header-index-wide">
    <a-row style="padding-top: 10px;">
      <div class="table-page-search-wrapper" style="padding:10px;background:#f2f2f2">
      <a-card  size="small" title="查询条件">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="24">
            <a-col :span="24">
              <a-form-item label="尽调日期" >
                <j-date-range  v-model="flowDate" @calendarChange="calendarChange" :currentDate="currentDate"></j-date-range>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="24">
              <a-form-item label="信息来源">
                <j-multi-select-tag v-model="queryParam.cusSources" dict-code="INFO_SOURCE"></j-multi-select-tag>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="尽调状态">
                <j-multi-select-tag v-model="queryParam.cusStatuses" dict-code="DD_STATUS"></j-multi-select-tag>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <div class="table-operator"  style="margin-top: 5px">
          <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
          <a-button @click="addInfo(ddCode,partyCode,clientType)" icon="plus" type="primary" v-if="optType!='view'">新增</a-button>
          <a-upload name="file" :showUploadList="false" :multiple="false" 
            :headers="tokenHeader" :action="importExcelUrl" :data="{'partyCode':partyCode}" @change="handleImportExcel"
            accept=".xls,.xlsx"
            >
            <a-button type="primary" icon="import" v-if="optType!='view'">导入KYC</a-button>
          </a-upload>
          <a-button  @click="reset">重置</a-button>
          <!-- <a-button @click="exportFile()" icon="import" type="primary">导入</a-button> -->
        </div>
        <a-table class="table-min-height"
        ref="table"
        bordered
        size="middle"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :scroll="{ x: 1800, y: 400 }"
        :loading="loading"
        @change="handleTableChange">
        <template slot="action" slot-scope="text, record">
          <div class="editable-row-operations">
            <span>
              <a  @click="infoDisAdd('view',record.ID,partyCode,record.DD_CODE)">查看</a>
              <a-divider v-if="optType!='view'" type="vertical" />
              <a v-if="optType!='view'" @click="infoDisAdd('edite',record.ID,partyCode,record.DD_CODE)">编辑</a>
              <a-divider v-if="optType!='view'" type="vertical" />
              <a v-if="optType!='view' && record.DD_STATUS=='2'&& record.exist==null" @click="prjAdd(partyCode,record.DD_CODE)">项目设立</a>
            </span>
          </div>
        </template> 
      </a-table>
      </a-card>
      </div>
    </a-row>
  </div>
</template>

<script>
  import biTableMixin from '@mixins/biTableMixin'
  import { getDict } from '@/api/BiApi'
  import {deleteAction,getAction} from '@/api/manage'
  import dictMixin from '@mixins/dictMixin'
  import JMultiSelectTag from '@/components/dict/JMultiSelectTag'
  import JDateRange from '@/components/jeecg/JDateRange'
  import { formatAmt } from '@utils/util'
  import moment from 'moment'

  export default {
    name: "ToTuneInfo",
    components: {
      JMultiSelectTag,
      JDateRange
    },
    mixins:[biTableMixin,dictMixin],
    props: {
      partyCode:{
        default:''
      },
      clientType:{
        default:''
      },
      optType: {
        default: 'add'
      },
      prjCode:{
        default: ''
      },
      id: {
        default: ''
      }
    },
    data () {
      return {
        moment,
        currentDate:moment(),
        ddCode:'',
        flowDate:[],
        // 高级搜索 展开/关闭
        advanced: false,
        // 表头
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',
            width: 70,
            align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '业务类型',
            dataIndex: 'BUSINESS_TYPE',
            align: "center",
            width: 150,
            customRender: (text)=> this.getDictNameByCode(this.dicts.PRJ_TYPE,text)
          },
          {
            title: '标准化/定制化',
            width: 130,
            align: "center",
            dataIndex: 'LOA_TYPE',
            customRender: (text)=> this.getDictNameByCode(this.dicts.PACT_TYPE,text)
          },
          {
            title: '合同系列',
            width: 160,
            dataIndex: 'CONTRACT_SERIES',
            align: "center",
            customRender: (text)=>{
              if(!text)
              return '--'
              var str=''
              text.split(',').forEach((item,idx)=>{
                idx==0?str+=this.getDictNameByCode(this.dicts.CONTRACT_SERIE,item):str+='、'+this.getDictNameByCode(this.dicts.CONTRACT_SERIE,item)
                
              })
              return str
            } 
          },
          {
            title: '信托期限',
            width: 130,
            dataIndex: 'TRUST_TERM_TYPE',
            align: "center",
            customRender: (text)=> this.getDictNameByCode(this.dicts.TRUST_TERM_TYPE,text)
          },
          {
            title: '初始信托财产类型',
            width: 130,
            dataIndex: 'ASSET_TYPE',
            align: "center",
            customRender: (text)=> this.getDictNameByCode(this.dicts.DD_PROPERTY_TYPE,text)
          },
          {
            title: '财产总规模',
            width: 130,
            dataIndex: 'ASSETS_TOTAL_SCALE',
            align: "center",
            customRender: function (text) {
              return formatAmt(Number(text||0),2);
            }
          },
          {
            title: '现金规模',
            width: 130,
            dataIndex: 'CASH_SCALE',
            align: "center",
             customRender: function (text) {
              return formatAmt(Number(text||0),2);
            }
          },
          {
            title: '财产权规模',
            width: 130,
            dataIndex: 'ASSETS_SCALE',
            align: "center",
             customRender: function (text) {
              return formatAmt(Number(text||0),2);
            }
          },
          {
            title: '项目名称',
            width: 180,
            dataIndex: 'TRUST_PRJ_NAME',
            align: "center",
          },
          {
            title: '尽调日期',
            width: 130,
            align: "center",
            dataIndex: 'CREATE_DT',
          },
          {
            title: '数据来源',
            width: 130,
            dataIndex: 'DD_SOURCE',
            align: "center",
             customRender: (text)=> this.getDictNameByCode(this.dicts.INFO_SOURCE,text)
          },
          {
            title: '尽调状态',
            width: 130,
            dataIndex: 'DD_STATUS',
            fixed: 'right',
            align: "center",
            customRender: (text)=> this.getDictNameByCode(this.dicts.DD_STATUS,text)
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: 120,
            fixed: 'right',
            align: "center",
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/prj/cusDDInfo/query/list",
          getDDCode:"/prj/cusDDInfo/query/getDDCode",
          importExcelUrl:'/prj/cusDDInfo/kycImport'
        },
        type: 'add',
      }
    },
    created() {
      this.initDictConfig()
      this.queryParam.partyCode=this.partyCode
      getAction(this.url.getDDCode).then((res) => {
        if (res.success) {
          this.ddCode=res.result
        } else {
          this.$message.error(res.message)
        }
      }),
      window.addEventListener('message', this.searchQuery, false)
    },
    watch:{
      'flowDate'(val){
        if(val[0]==''){
          this.currentDate=moment()
          this.queryParam.flowDateStart=this.queryParam.flowDateEnd=''
          this.flowDate=[]
        }else{
          this.queryParam.flowDateStart=val[0]
          this.queryParam.flowDateEnd=val[1]
        }

      },
    },
    methods: {
      calendarChange(val) {
        this.currentDate = val
      },
      reset(){
        this.queryParam={
          partyCode:this.partyCode
        }
        this.flowDate=[]
        this.searchQuery()
      },
      initDictConfig () {
        let promises = [
          this.getDict('TRUST_TERM_TYPE,PRJ_TYPE,PACT_TYPE,CONTRACT_SERIE,DD_PROPERTY_TYPE,INFO_SOURCE,DD_STATUS')
        ]
        Promise.all(promises).then((res)=>{
          // this.loadData()
        })
      },
      addInfo(ddCode,partyCode,clientType){
        this.$router.push({name:"customer-upholdToTune",query: {optType:'ADD',ddCode:ddCode,partyCode:partyCode,clientType:clientType}, meta:{keepAlive: true}});
      },
      infoDisAdd(optType,id,partyCode,ddCode){
        this.$router.push({name:"customer-upholdToTune",query: {optType:optType,id:id,partyCode:partyCode,ddCode:ddCode}, meta:{keepAlive: true}});
      },
      prjAdd(partyCode,ddCode){
        this.$router.push({name: 'prj-setup',query: {optType: 'ADD',partyCode:partyCode,ddCode:ddCode}});
      },
      exportFile(){},
      handleTodo(record) {
        this.$refs.wkfAuditModal.audit(record);
      },
      handleClaim(record){
        console.dir(record);
      },
      handleCancle(record){
        console.dir(record);
      }
    }
  }
</script>

<style lang="scss" scoped>
/deep/ .in-ant-tabs-bar{
  background: #f2f2f2;
}
</style>