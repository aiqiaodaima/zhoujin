<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <!-- 搜索区域 -->
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="7">
            <a-form-item label="项目名称" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <a-input placeholder="请输入项目名称" v-model="queryParam.trustPrjName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="6">
            <a-form-item label="委托人" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <a-input placeholder="请输入委托人名称" v-model="queryParam.clientName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="7" :sm="10">
            <a-form-item label="信托成立日" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <j-date v-model="queryParam.trustStartDtBegin" :showTime="false" date-format="YYYY-MM-DD" style="width:45%"></j-date>
              <span style="width: 10px;">~</span>
              <j-date v-model="queryParam.trustStartDtEnd" :showTime="false" date-format="YYYY-MM-DD" style="width:45%"></j-date>
            </a-form-item>
          </a-col>
          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-col :md="6" :sm="24">
              <a-button style="margin-left: 8px" @click="searchReset">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '更多' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"></a-icon>
              </a>
            </a-col>
          </span>
        </a-row>
        <template v-if="toggleSearchStatus">
          <a-row :gutter="24">
            <a-col :md="24" :sm="24">
              <a-form-item label="业务类型" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                <j-multi-select-tag v-model="queryParam.prjType" dict-code="PRJ_TYPE"></j-multi-select-tag>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item label="合同系列" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                <j-multi-select-tag v-model="queryParam.contractType" dict-code="CONTRACT_TYPE"></j-multi-select-tag>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24" style="display: none;">
              <a-form-item label="项目状态" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                <j-multi-select-tag v-model="queryParam.prjStatus" dict-code="PRJ_STATUS"></j-multi-select-tag>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="客户来源" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                <j-multi-select-tag v-model="queryParam.customerSource" dict-code="CUSTOMER_SOURCE"></j-multi-select-tag>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="是否估值" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                <j-multi-select-tag v-model="queryParam.voaType" dict-code="VALA_TYPE"></j-multi-select-tag>
              </a-form-item>
            </a-col>
          </a-row>
        </template>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator"  style="margin-top: 5px">
      <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
    </div>

    <a-table
      ref="table"
      size="small"
      bordered
      rowKey="PRJ_CODE"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      @expand="handleRowExpand"
      @change="handleTableChange">

      <a-table slot="expandedRowRender" slot-scope="record" :columns="innerColumns" :data-source="innerData[record.PRJ_CODE]" :pagination="false" size="small">
        <span slot="innerAction" slot-scope="t, rec">
          <span v-if="rec.STATUS==='NEW'">
            <a @click="handleInnerOpt(rec)">处理</a>
<!--            <a-divider type="vertical"></a-divider>-->
<!--            <a @click="handleInnerDel(rec)">删除</a>-->
          </span>
          <span v-else>
            <a @click="handleInnerOpt(rec)">查看</a>
          </span>
        </span>
      </a-table>
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">新增期次</a>
      </span>
    </a-table>
    <!-- table区域-end -->
  </a-card>
</template>

<script>
  import JSuperQuery from '@/components/jeecg/JSuperQuery.vue'
  import JInput from '@/components/jeecg/JInput.vue'
  import JDate from '@/components/jeecg/JDate'
  import { FtsListMixin } from '@/mixins/FtsListMixin'
  import Vue from 'vue'
  import JMultiSelectTag from '../../components/dict/JMultiSelectTag'
  import moment from 'moment'
  import dictMixin from '../../mixins/dictMixin'
  import { getAction, postAction } from '../../api/manage'
  import { setKeyProp } from '../../utils/util'
  import { mapState, mapActions, mapMutations } from "vuex";

  export default {
    name: "PrjPeriodList",
    mixins:[FtsListMixin, dictMixin],
    components: {
      JSuperQuery,
      JMultiSelectTag,
      JDate,
      JInput
    },
    computed: {
      ...mapState("project", [
        "prjCode","periodNo"
      ])
    },
    data() {
      let that = this;
      return {
        description: '项目查询页面',
        importExcelUrl:`${window._CONFIG['domianURL']}/test/jeecgDemo/importExcel`,
        //表头
        columns:[],
        //列设置
        settingColumns:[],
        //列定义
        defColumns: [
          {
            title: '项目名称',
            align: "center",
            dataIndex: 'TRUST_PRJ_NAME'
          },
          {
            title: '项目编号',
            align: "center",
            dataIndex: 'TRUST_PRJ_CODE'
          },
          {
            title: '委托人名称',
            align: "center",
            dataIndex: 'C_PARTY_NAME'
          },
          {
            title: '信托成立日',
            align: "center",
            dataIndex: 'TRUST_STD_DT',
            customRender(text) {
              return text?moment(text).format('YYYY-MM-DD'):"--"
            }
          },
          {
            title: '信托到期日',
            align: "center",
            dataIndex: 'TRUST_END_DT',
            customRender(text) {
              return text?moment(text).format('YYYY-MM-DD'):"--"
            }
          },
          {
            title: '信托终止日',
            align: "center",
            dataIndex: 'TRUST_EXPR_DT',
            customRender(text) {
              return text?moment(text).format('YYYY-MM-DD'):"--"
            }
          },
          {
            title: '信托经理',
            align: "center",
            dataIndex: 'TM_NAME'
          },
          {
            title: '项目状态',
            align: "center",
            dataIndex: 'PRJ_STATUS',
            customRender(text){
              return that.d('PRJ_STATUS',text);
            }
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {
              customRender: 'action'
            }
          }
        ],
        innerColumns: [
          {
            title: '追加期次',
            align: "center",
            dataIndex: 'PERIOD_NO'
          },{
            title: '状态',
            align: "center",
            dataIndex: 'STATUS',
            customRender(text) {
              return that.d('PERIOD_STATUS',text);
            }
          },{
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {
              customRender: 'innerAction'
            }
          }
        ],
        innerData:{},
        maxPeriodNo:{},
        url: {
          list: "/prj/list",
          listPeriod: "prj/listPeriod"
        },
        dictOptionsData:[],
        autoLoadData: false
      }
    },
    methods: {
      ...mapMutations("project",["RESET_STATE","SET_prjCode","SET_periodNo"]),
      ...mapActions("project",["getPrjOrderInfo"]),
      d(d,t){
        return this.getDictNameByCode(this.dicts[d],t);
      },
      beforeLoadData() {
        this.queryParam.prjStatus = 'R';
      },
      //列设置更改事件
      onColSettingsChange (checkedValues) {
        const key = this.$route.name + ':colsettings'
        Vue.ls.set(key, checkedValues, 7 * 24 * 60 * 60 * 1000)
        this.settingColumns = checkedValues;
        this.columns =  this.defColumns.filter(item => {
          if (item.key === 'rowIndex' || item.dataIndex === 'action') {
            return true
          }
          return this.settingColumns.includes(item.dataIndex);
        });
      },
      initColumns(){
        //权限过滤（列权限控制时打开，修改第二个参数为授权码前缀）
        //this.defColumns = colAuthFilter(this.defColumns,'testdemo:');
        let key = this.$route.name+":colsettings";
        let colSettings= Vue.ls.get(key);
        if(colSettings===null||colSettings===undefined){
          let allSettingColumns = [];
          this.defColumns.forEach(function (item,i,array ) {
            allSettingColumns.push(item.dataIndex);
          })
          this.settingColumns = allSettingColumns;
          this.columns = this.defColumns;
        }else{
          this.settingColumns = colSettings;
          this.columns =  this.defColumns.filter(item => {
            if (item.key === 'rowIndex' || item.dataIndex === 'action') {
              return true;
            }
            return !!colSettings.includes(item.dataIndex);
          });
        }
      },
      handleEdit(record){
        let that = this;
        that.loading = true;
        console.log('record=',record);
        postAction('prj/addPeriod', {prjCode:record.PRJ_CODE}).then(res=>{
          if(res.success){
            this.$router.push({name:"order-prj-addiComm",query: {param:window.btoa('prjCode='+record.PRJ_CODE+"&periodNo="+res.result)}, meta:{keepAlive: true}});
          }
        }).finally(()=>{
          that.loading = false;
        });
      },
      handleInnerOpt(rec){
        this.$router.push({name:"order-prj-addiComm",query: {param:window.btoa('prjCode='+rec.PRJ_CODE+"&periodNo="+rec.PERIOD_NO)}, meta:{keepAlive: true}});
      },
      handleInnerDel(rec){

      },
      handleInnerView(rec){

      },
      async initPage(){
        await this.getDict('PERIOD_STATUS,PRJ_STATUS');
        this.loadData();
        if(this.$route.query.batchId){
          this.$router.push({name:"order-prj-addiComm",query: {batchId:this.$route.query.batchId}, meta:{keepAlive: true}});
        }
      },
      handleRowExpand(expanded, record){
        if(expanded){
          let that = this;
          that.loading = true;
          getAction(that.url.listPeriod,{prjCode:record.PRJ_CODE}).then(res=>{
            let k = Object.keys(this.innerData);
            let newData = {};
            if(res.success) {
              let result = res.result.records;
              setKeyProp(result);
              if(result&&result.length>0){
                result = result.filter(item => Number(item.PERIOD_NO)>0);
              }
              newData[record.PRJ_CODE] = result;
            }
            if(k&&k.length>0){
              k.forEach(prjCode=>{
                if(prjCode !== record.PRJ_CODE){
                  newData[prjCode] = this.innerData[prjCode];
                }
              });
            }
            this.innerData = newData;
          }).finally(()=>{
            that.loading = false;
          });
        }
      }
    },
    created() {
      this.queryParam.prjStatus = 'R';
      this.initColumns();
      this.initPage();
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
/*  
  .ant-table-tbody .ant-table-row td {
    padding-top: 15px;
    padding-bottom: 15px;
  }

  .anty-row-operator button {
    margin: 0 5px
  }

  .ant-btn-danger {
    background-color: #ffffff
  }

  .ant-modal-cust-warp {
    height: 100%
  }

  .ant-modal-cust-warp .ant-modal-body {
    height: calc(100% - 110px) !important;
    overflow-y: auto
  }

  .ant-modal-cust-warp .ant-modal-content {
    height: 90% !important;
    overflow-y: hidden
  }
  /** Button按钮间距 */
  /* .ant-btn {
    margin-left: 3px
  } */ 
</style>