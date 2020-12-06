<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <!-- 搜索区域 -->
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="24" :sm="24">
            <a-form-item label="项目名称">
              <a-input placeholder="请输入项目名称" v-model="queryParam.trustPrjName"></a-input>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :md="24" :sm="24">
            <a-form-item label="合同系列">
              <j-multi-select-tag v-model="queryParam.contractType" dict-code="CONTRACT_SERIE"></j-multi-select-tag>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="报告类型">
              <j-multi-select-tag v-model="queryParam.contractSerie" dict-code="DIS_RPT_TYPE"></j-multi-select-tag>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="报告状态">
              <j-multi-select-tag v-model="queryParam.status" dict-code="LETTER_STATUS"></j-multi-select-tag>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="报告区间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <j-date
                v-model="queryParam.reportingStartDtBegin"
                :showTime="false"
                date-format="YYYY-MM-DD"
                style="width: 45%"
              ></j-date>
              <span style="width: 10px">~</span>
              <j-date
                v-model="queryParam.reportingStartDtEnd"
                :showTime="false"
                date-format="YYYY-MM-DD"
                style="width: 45%"
              ></j-date>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="制作时间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <j-date
                v-model="queryParam.trustStartDtBegin"
                :showTime="false"
                date-format="YYYY-MM-DD"
                style="width: 45%"
              ></j-date>
              <span style="width: 10px">~</span>
              <j-date
                v-model="queryParam.trustStartDtEnd"
                :showTime="false"
                date-format="YYYY-MM-DD"
                style="width: 45%"
              ></j-date>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator" style="margin-top: 5px">
      <a-button type="primary" icon="search" @click="searchQuerySub">查询</a-button>
      <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
    </div>

    <a-table
      ref="table"
      size="small"
      bordered
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      :scroll="{ x: 2800, y: 400 }"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      @change="handleTableChange"
    >
      <a-icon slot="filterIcon" type="setting" :style="{ fontSize: '16px', color: '#108ee9' }"></a-icon>

      <span slot="action" slot-scope="text, record">
        <a href="#" @click="uploadFile(record.id, record.filePath, record.fileName)">上传</a>
        <a-divider type="vertical" />
        <a href="#" @click="downLoad(record.filePath, record.fileName)">下载</a>
      </span>
    </a-table>
    <!-- table区域-end -->
    <a-modal
      :title="title"
      :width="width"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      :destroyOnClose="true"
      cancelText="关闭"
    >
      <a-form-model>
        <a-form-model-item style="margin-left: 40%">
          <a-upload name="file" :multiple="true" :action="uploadUrl" :data="uploadData" :headers="headers" :before-upload="beforeUpload">
            <a-button> <a-icon type="upload" />信托事务管理报告上传 </a-button>
          </a-upload>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-card>
</template>

<script>
import JSuperQuery from '@/components/jeecg/JSuperQuery.vue'
import JInput from '@/components/jeecg/JInput.vue'
import JDate from '@/components/jeecg/JDate'
import { filterDictText } from '@/components/dict/JDictSelectUtil'
import { FtsListMixin } from '@/mixins/FtsListMixin'
import Vue from 'vue'
import JMultiSelectTag from '@/components/dict/JMultiSelectTag'
import moment from 'moment'
import { initDictOptionsBatch } from '@/components/dict/JDictSelectUtil'
import { getAction, deleteAction, putAction, postAction } from '@/api/manage'

export default {
  name: 'LetterList',
  mixins: [FtsListMixin],
  components: {
    JSuperQuery,
    JMultiSelectTag,
    JDate,
    JInput,
  },
  data() {
    return {
      flag: false,
      id: '',
      uploadUrl: `${window._CONFIG['domianURL']}/letter/uploadScanningCopy`,
      headers: {
        authorization: 'authorization-text',
      },
      uploadData: {},
      confirmLoading: false,
      title: '扫描件上传',
      width: 800,
      visible: false,
      files: [],
      description: '信批查询页面',
      selectedRowKeys: [],
      importExcelUrl: `${window._CONFIG['domianURL']}/test/jeecgDemo/importExcel`,
      //表头
      columns: [],
      //列设置
      settingColumns: [],
      //列定义
      defColumns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          fixed: 'left',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          },
        },
        {
          title: '报告类型',
          align: 'center',
          fixed: 'left',
          width: 240,
          dataIndex: 'disType',
        },
        {
          title: '项目名称',
          fixed: 'left',
          width: 240,
          align: 'center',
          dataIndex: 'trustPrjName',
        },
        {
          title: '报告区间',
          width: 240,
          align: 'center',
          dataIndex: 'letterDate',
        },
        {
          title: '信托事务管理报告',
          width: 240,
          align: 'center',
          dataIndex: 'fileName',
        },
        {
          title: '用印附件',
          width: 240,
          align: 'center',
          dataIndex: 'fileNameEnclosure',
        },
        {
          title: '委托人姓名',
          align: 'center',
          width: 120,
          dataIndex: 'partyName',
        },
        {
          title: '合作渠道',
          align: 'center',
          width: 140,
          dataIndex: 'cusChannelSide',
        },
        {
          title: '披露对象',
          align: 'center',
          width: 140,
          dataIndex: 'disTarget',
        },
        {
          title: '披露渠道',
          align: 'center',
          width: 140,
          dataIndex: 'disChannel',
        },
        {
          title: '披露方式',
          align: 'center',
          width: 240,
          dataIndex: 'disMode',
        },
        {
          title: '信托经理',
          align: 'center',
          width: 130,
          dataIndex: 'tmName',
        },
        {
          title: '制作人员',
          align: 'center',
          dataIndex: 'createBy',
        },
        {
          title: '制作时间',
          align: 'center',
          width: 160,
          dataIndex: 'createDt',
        },
        {
          title: '状态',
          align: 'center',
          width: 160,
          dataIndex: 'status',
          customRender: function (text) {
            if (text === 'INIT') {
              return '未上传'
            } else {
              return '已上传'
            }
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
        list: '/letter/prject/list',
        delete: '/test/jeecgDemo/delete',
        deleteBatch: '/test/jeecgDemo/deleteBatch',
        exportXlsUrl: '/test/jeecgDemo/exportXls',
      },
      dictOptionsData: [],
    }
  },
  methods: {
    // 校验时间
    searchQuerySub() {
      if (this.queryParam.trustStartDtBegin > this.queryParam.trustStartDtEnd) {
        this.$message.error('开始时间不能大于结束时间!')
        return false
      }
      if (this.queryParam.reportingStartDtBegin > this.queryParam.reportingStartDtEnd) {
        this.$message.error('开始时间不能大于结束时间!')
        return false
      }
      this.searchQuery()
    },
    // 上传
    uploadFile(id, filePath, fileName) {
      this.visible = true
      this.id = id;
      console.log('id={},filePath={},fileName={}', id, filePath, fileName)
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    beforeUpload(file) {
      this.files = [...this.files, file]
    },
    handleOk() {
      this.confirmLoading = true
      const formData = new FormData()
      formData.append('id', this.id)
      if (this.files === undefined) {
        this.$message.warning('请先选中需要上传的扫描件')
        this.confirmLoading = false
        return false
      }
      this.files.forEach((file) => {
        formData.append('files', file)
      })
      console.log('fomdate', formData)
      postAction('/letter/uploadScanningCopy', formData).then((res) => {
        console.log(res)
        if (res.code == '200') {
          this.$message.success('报告上传成功')
        } else {
          this.$message.success('报告上传失败')
        }
        this.visible = false
        this.confirmLoading = false
        this.searchQuery()
        this.selectedRows = []
      })
    },
    handleDelete(id) {
      console.log('id', id)
      let param = {
        id: id,
      }
      postAction('/letter/delete', param).then((res) => {
        if (res.code == '200') {
          this.$message.success('删除成功')
          this.searchQuery()
        }
      })
      console.log('删除', id)
    },
    searchMake() {
      this.$message.warning('功能待开发')
    },
    searchUpload() {
      this.$message.warning('功能待开发')
    },
    searchReset() {
      this.queryParam = {}
      this.searchQuery()
    },
    upload() {
      this.$message.warning('功能待开发')
    },
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    downLoad(fileUploadPath, fileName) {
      getAction('/letter/downLoadFile', { filePath: fileUploadPath }).then((res) => {
        let blob = new Blob([res], {
          //type类型后端返回来的数据中会有，根据自己实际进行修改
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.documentcharset=utf-8',
        })
        let filename = fileName || '.word'
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(blob, filename)
        } else {
          var blobURL = window.URL.createObjectURL(blob)
          // 创建隐藏<a>标签进行下载
          var tempLink = document.createElement('a')
          tempLink.style.display = 'none'
          tempLink.href = blobURL
          tempLink.setAttribute('download', filename)
          if (typeof tempLink.download === 'undefined') {
            tempLink.setAttribute('target', '_blank')
          }
          document.body.appendChild(tempLink)
          tempLink.click()
          document.body.removeChild(tempLink)
          window.URL.revokeObjectURL(blobURL)
        }
      })
    },
    initDictConfig() {
      //初始化字典 - 是否估值
      let that = this
      initDictOptionsBatch('VOA_TYPE,CONTRACT_TYPE,CONTRACT_SERIE,CUSTOMER_SOURCE,PRJ_STATUS').then((res) => {
        if (res.success) {
          that.dictOptionsData = res.result
        }
      })
    },
    //列设置更改事件
    onColSettingsChange(checkedValues) {
      let key = this.$route.name + ':colsettings'
      Vue.ls.set(key, checkedValues, 7 * 24 * 60 * 60 * 1000)
      this.settingColumns = checkedValues
      const cols = this.defColumns.filter((item) => {
        if (item.key == 'rowIndex' || item.dataIndex == 'action') {
          return true
        }
        if (this.settingColumns.includes(item.dataIndex)) {
          return true
        }
        return false
      })
      this.columns = cols
    },
    initColumns() {
      //权限过滤（列权限控制时打开，修改第二个参数为授权码前缀）
      //this.defColumns = colAuthFilter(this.defColumns,'testdemo:');

      let key = this.$route.name + ':colsettings'
      let colSettings = Vue.ls.get(key)
      if (colSettings === null || colSettings === undefined) {
        let allSettingColumns = []
        this.defColumns.forEach(function (item, i, array) {
          allSettingColumns.push(item.dataIndex)
        })
        this.settingColumns = allSettingColumns
        this.columns = this.defColumns
      } else {
        this.settingColumns = colSettings
        this.columns = this.defColumns.filter((item) => {
          if (item.key === 'rowIndex' || item.dataIndex === 'action') {
            return true
          }
          return !!colSettings.includes(item.dataIndex)
        })
      }
    },
  },
  created() {
    this.initColumns()
  },
}
</script>
<style lang="stylus" scoped></style>