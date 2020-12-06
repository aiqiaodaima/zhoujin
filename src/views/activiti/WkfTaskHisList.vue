<template> 
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuerySub">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="处理日期">
              <!-- <a-range-picker v-model="queryParam.dateArea"></a-range-picker> -->
              <j-date v-model="queryParam.startDt" :showTime="false" date-format="YYYY-MM-DD" style="width:45%"></j-date>
              <span style="width: 10px;">~</span>
              <j-date v-model="queryParam.endDt" :showTime="false" date-format="YYYY-MM-DD" style="width:45%"></j-date>
            </a-form-item>
          </a-col>
          <a-col  :md="6" :sm="8">
            <a-form-item label="审核单类型">
              <a-select v-model="queryParam.processCode" placeholder="请选择审核单类型">
                <a-select-option value="">--</a-select-option>
                <a-select-option v-for="(item, key) in actTypeOptions" :key="key" :value="item.value">
                  {{ item.text || item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="审核单名称">
              <a-input placeholder="请输入审核单名称" v-model="queryParam.instanceTitle"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="审核状态">
              <a-select v-model="queryParam.status" placeholder="请选择审核状态">
                <a-select-option value="">--</a-select-option>
                <a-select-option value="UNSUBMIT">审核中</a-select-option>
                <a-select-option value="ACCEPT">通过</a-select-option>
                <a-select-option value="REJECT">驳回</a-select-option>
                <a-select-option value="CANCLE">撤销</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuerySub" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="taskId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
          <a @click="handleQueryHis(record)">历史记录查询</a>
        </span>
      </a-table>
      <wkf-audit-modal ref="wkfAuditModal" @ok="modalFormOk" :only-his-page="true" title="审核历史记录"></wkf-audit-modal>
    </div>
  </a-card>
</template>

<script>
  import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import {loadProcessTypeList} from '@/api/api'
  import JDate from '@/components/jeecg/JDate'
  import moment from 'moment'
  import WkfAuditModal from "./modules/WkfAuditModal";

  export default {
    name: "WkfTaskHisList",
    mixins:[JeecgListMixin],
    components: {
      JDate,
      WkfAuditModal
    },
    data() {
      return {
        description: '用户管理页面',
        //字典数组缓存
        actStatusOptions: [],
        //表头
        columns:[],
        //列设置
        settingColumns:[],
        //列定义
        defColumns: [
          {
            title: '审核单类型',
            align:"center",
            dataIndex: 'processName'
          },
          {
            title: '审核单名称',
            align:"center",
            dataIndex: 'instanceTitle'
          },
          {
            title: '审核状态',
            align: "center",
            dataIndex: 'aduiStatusCode',
            customRender: (text) => {
              if(text === "ACCEPT" || text === "REJECT" || text === "CANCLE"){
                return filterDictText(this.actStatusOptions, text);
              }else{
                return "审核中";
              }
            }
          },
          {
            title: '申请人',
            align:"center",
            dataIndex: 'applyerName'
          },
          {
            title: '处理日期',
            align:"center",
            dataIndex: 'dealDt',
            customRender: function (t) {
              return moment(t).format('YYYY-MM-DD HH:mm:ss');
            }
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }
        ],
        url: {
          list: 'wkf/taskHisList'
        },
        actTypeOptions: []
      }
    },
    methods: {
      initDictConfig() {
        let that = this;
        initDictOptions('bpm_status').then((res) => {
          if (res.success) {
            that.actStatusOptions = res.result;
          }
        });
        loadProcessTypeList().then((res) => {
          if (res.success) {
            let w = [];
            for(let v of res.result){
              w.push({text:v.processName, label:v.processName, value:v.processKey});
            }
            this.actTypeOptions = w;
          }
        });
      },
      initColumns(){
        this.columns = this.defColumns;
      },
      handleQueryHis(record){
        this.$refs.wkfAuditModal.audit(record);
      },
      searchQuerySub() {
      // 校验时间
      if (this.queryParam.startDt > this.queryParam.endDt) {
       this.$message.error("开始时间不能大于结束时间!");
       return false;
      }
      this.searchQuery()
    },
    },
    created() {
      this.initColumns();
    },
    
  }
</script>
<style scoped>
  .ant-table-tbody .ant-table-row td {
    padding-top: 15px;
    padding-bottom: 15px;
  }
  .anty-row-operator button {
    margin: 0 5px
  }
</style>