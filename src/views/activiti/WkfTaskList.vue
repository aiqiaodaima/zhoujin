<template>
  <div class="page-header-index-wide">
    <a-card :loading="loading" :bordered="false" :body-style="{padding: '1'}">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" @keyup.enter.native="searchQuerySub">
          <a-row :gutter="24">
            <a-col :md="8" :sm="8">
              <a-form-item label="建立日期">
                <!-- <j-date-range v-model="queryParam.dataDate"></j-date-range> -->
                <j-date
                  v-model="queryParam.startDt"
                  :showTime="false"
                  date-format="YYYY-MM-DD"
                  style="width:45%"
                ></j-date>
                <span style="width: 10px;">~</span>
                <j-date
                  v-model="queryParam.endDt"
                  :showTime="false"
                  date-format="YYYY-MM-DD"
                  style="width:45%"
                ></j-date>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="审核单类型">
                <a-select v-model="queryParam.processCode" placeholder="请选择审核单类型">
                  <a-select-option value>请选择审核单类型</a-select-option>
                  <a-select-option
                    v-for="(item, key) in actTypeOptions"
                    :key="key"
                    :value="item.value"
                  >{{ item.text || item.label }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="审核单名称">
                <a-input placeholder="请输入审核单名称" v-model="queryParam.instanceTitle"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                <a-button type="primary" @click="searchQuerySub" icon="search">查询</a-button>
                <a-button
                  type="primary"
                  @click="searchReset"
                  icon="reload"
                  style="margin-left: 8px"
                >重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record">
          <a v-if="record.taskStatus === 'todo'" v-has="'task:todo'" @click="handleTodo(record)">办理</a>
          <a v-if="record.taskStatus === 'claim'" v-has="'task:claim'" @click="handleClaim(record)">签收</a>
          <a v-if="record.isCancle === 'Y'" v-has="'task:cancle'" @click="handleCancle(record)">撤销</a>
        </span>
      </a-table>
      <wkf-audit-modal ref="wkfAuditModal" @ok="modalFormOk" @updateList="loadData"></wkf-audit-modal>
    </a-card>
  </div>
</template>
<script>
import { FtsListMixin } from '@/mixins/FtsListMixin'
import WkfAuditModal from './modules/WkfAuditModal'
import moment from 'moment'
import JDate from '@/components/jeecg/JDate'
import { loadProcessTypeList } from '@/api/api'
import { httpActionWF } from '@/api/manage'
import JDateRange from '../../components/jeecg/JDateRange'
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'WkfTaskList',
  mixins: [FtsListMixin],
  components: {
    JDate,
    JDateRange,
    FtsListMixin,
    WkfAuditModal,
  },
  data() {
    return {
      loading: true,
      center: null,
      // 表头
      columns: [
        {
          title: '审核单类型',
          align: 'center',
          dataIndex: 'processName',
        },
        {
          title: '审核单名称',
          align: 'center',
          dataIndex: 'instanceTitle',
        },
        {
          title: '审核状态',
          align: 'center',
          customRender: function () {
            return '审核中'
          },
        },
        {
          title: '申请人',
          align: 'center',
          dataIndex: 'applyerName',
        },
        {
          title: '建立日期',
          align: 'center',
          dataIndex: 'createTime',
          customRender: function (t, r) {
            return moment(t).format('YYYY-MM-DD HH:mm:ss')
          },
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list: 'wkf/taskList',
        claim: 'wkf/claim',
        auditInitData: '/wkf/auditInitData',
      },
      actTypeOptions: [],
    }
  },
  created() {
    this.initData()
  },
  mounted() {},
  watch: {},
  methods: {
    ...mapActions('order', ['addOrdersOptLogs']),
    initData() {
      loadProcessTypeList().then((res) => {
        console.log(res)
        if (res.success) {
          let w = []
          for (let v of res.result) {
            w.push({ text: v.processName, label: v.processName, value: v.processKey })
          }
          this.actTypeOptions = w
        }
      })
    },
    handleTodo(record) {
      this.$refs.wkfAuditModal.audit(record)
    },
    handleClaim(record) {
      let that = this
      this.$confirm({
        title: '确认',
        content: '确定签收此审核流程吗？',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          that.loading = true
          let formData = new FormData()
          formData.append('taskId', record.taskId)
          httpActionWF(that.url.claim, formData)
            .then((res) => {
              if (res.success) {
                that.searchQuery()
                that.$confirm({
                  title: '签收成功！是否现在开始审核？',
                  okText: '确认',
                  cancelText: '取消',
                  onOk() {
                    that.$refs.wkfAuditModal.audit(record)
                  },
                  onCancel() {
                    that.$destroyAll()
                  },
                })
              } else {
                that.$error({
                  title: res.message,
                  content: '',
                })
              }
            })
            .finally(() => {
              that.loading = false
            })
        },
      })
    },
    getBusinessKey(taskId) {
      let formData = new FormData()
      formData.append('taskId', taskId)
      httpActionWF(this.url.auditInitData, formData).then((res) => {
        if (res.success) {
          
        }
      })
    },
    handleCancle(record) {
      let that = this
      this.$confirm({
        title: '提示',
        content: '确定要撤销审批吗?',
        onOk: function () {
          let formData = new FormData()
          formData.append('task_id', record.taskId)
          formData.append('audiResult', 'CANCLE')
          formData.append('comment', '撤销')
          httpActionWF('/wkf/disPather', formData).then((res) => {
            if (res.success) {
              // 埋点
              if(record.batchId){
                //初始委托和追加委托
                if(record.processCode=='trust_asset_initcomm'||record.processCode=='trust_asset_addcomm'){
                  let arr=record.batchId.split(',')
                  let batchId=arr[arr.length-1]
                  that.addOrdersOptLogs({
                    batchId:batchId,
                    optType: '强制撤回',
                    oprations: '强制撤回',
                    status: '待提交'
                  })
                }
                else{
                  that.addOrdersOptLogs({
                    batchId:record.batchId,
                    optType: '撤销',
                    oprations: '撤销',
                    status: '待提交',
                    memo: '撤销'
                  })
                }
              }
              that.$message.success(res.result)
              that.getBusinessKey(record.taskId)
              that.searchQuery()
            } else {
              that.$message.error(res.result)
            }
          })
        },
      })
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
}
</script>

<style lang="scss" scoped>
</style>