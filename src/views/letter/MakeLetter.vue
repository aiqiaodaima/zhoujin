<template>
  <div>
    <a-card :bordered="false">
      <!-- 查询区域 -->
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <!-- 搜索区域 -->
        <a-form layout="inline" @keyup.enter.native="queryTable">
          <a-row :gutter="24">
            <a-col :md="24" :sm="24">
              <a-form-item label="项目名称">
                <a-input v-model="queryParam.trustPrjName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item label="合同系列">
                <j-multi-select-tag v-model="queryParam.contractSerie" dict-code="CONTRACT_SERIE"></j-multi-select-tag>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item label="是否估值">
                <j-multi-select-tag v-model="queryParam.voaType" dict-code="VOA_TYPE"></j-multi-select-tag>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item label="报告类型">
                <j-multi-select-tag v-model="queryParam.disType" dict-code="DIS_RPT_TYPE"></j-multi-select-tag>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <!-- 操作按钮区域 -->
      <div class="table-operator" style="margin-top: 5px">
        <a-button type="primary" icon="search" @click="queryTable">查询</a-button>
        <a-button v-has="'prj:setup'" @click="makeLetter" type="primary" icon="plus">报告制作</a-button>
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
        :scroll="{ x: 2600, y: 400 }"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <div slot="filterDropdown">
          <a-card>
            <a-checkbox-group @change="onColSettingsChange" v-model="settingColumns" :defaultValue="settingColumns">
              <a-row>
                <template v-for="(item, index) in defColumns">
                  <template v-if="item.key !== 'rowIndex' && item.dataIndex !== 'action'">
                    <a-col :span="12">
                      <a-checkbox :value="item.dataIndex">{{ item.title }}</a-checkbox>
                    </a-col>
                  </template>
                </template>
              </a-row>
            </a-checkbox-group>
          </a-card>
        </div>
        <a-icon slot="filterIcon" type="setting" :style="{ fontSize: '16px', color: '#108ee9' }"></a-icon>
      </a-table>
      <!-- table区域-end -->
    </a-card>
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
      <a-card
        style="width: 100%"
        :tab-list="tabList"
        :active-tab-key="key"
        @tabChange="(key) => onTabChange(key, 'key')"
      >
        <span slot="customRender" slot-scope="item">
          <a-icon type="home" />
          {{ item.key }}
        </span>
        <a-form-model
          :model="form"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :rules="rules"
          ref="form"
          v-if="key === 'tab1'"
        >
          <a-form-model-item label="报告类型" prop="disType">
            <j-d-select-tag dict-code="DIS_RPT_TYPE" v-model="form.disType"></j-d-select-tag>
          </a-form-model-item>
          <BiRangeDatePicker
            label="报告区间"
            :dateEnd="form.dividendEndDt"
            :dateStart="form.dividendStartDt"
            @change="changeDate($event, 'dividendStartDt', 'dividendEndDt')"
            name="dividendStartDt"
          />
          <a-form-model-item label="报告模板" prop="letterTemplate">
            <j-d-select-tag dict-code="LETTER_TEMPLATE" v-model="form.letterTemplate"></j-d-select-tag>
          </a-form-model-item>
        </a-form-model>

        <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" v-if="key === 'tab2'">
          <a-form-model-item label="报告类型">
            <j-d-select-tag dict-code="DIS_RPT_TYPE_TAB2" v-model="form.disType"></j-d-select-tag>
          </a-form-model-item>
          <BiRangeDatePicker
            label="报告区间"
            :dateEnd="form.dividendEndDt"
            :dateStart="form.dividendStartDt"
            @change="changeDate($event, 'dividendStartDt', 'dividendEndDt')"
            name="dividendStartDt"
          />
          <a-form-model-item style="margin-left: 17%">
            <a-upload
              name="file"
              :multiple="true"
              :action="uploadUrl"
              :data="uploadData"
              :headers="headers"
              :before-upload="beforeUpload"
              @change="handleChange"
            >
              <a-button> <a-icon type="upload" />信托事务管理报告上传 </a-button>
            </a-upload>
          </a-form-model-item>
        </a-form-model>
      </a-card>
    </a-modal>
  </div>
</template>

<script>
import JSuperQuery from '@/components/jeecg/JSuperQuery.vue'
import JInput from '@/components/jeecg/JInput.vue'
import JDate from '@/components/jeecg/JDate'
import { filterDictText } from '@/components/dict/JDictSelectUtil'
import { FtsListMixin } from '@/mixins/FtsListMixin'
import Vue from 'vue'
import JMultiSelectTag from '../../components/dict/JMultiSelectTag'
import moment from 'moment'
import { initDictOptionsBatch } from '../../components/dict/JDictSelectUtil'
import * as customizeConfigs from '../../customizeConfig'
import { getAction, postAction } from '../../api/manage'
import JDSelectTag from '@comp/dict/JDSelectTag'

export default {
  name: 'MakeLetter',
  mixins: [FtsListMixin],
  components: {
    JSuperQuery,
    JMultiSelectTag,
    JDate,
    JInput,
    JDSelectTag,
  },
  data() {
    let customizeEnv = customizeConfigs.customizeEnv
    return {
      uploadUrl: `${window._CONFIG['domianURL']}/letter/upload`,
      customizeEnv: customizeEnv,
      description: '信息披露查询页面',
      importExcelUrl: `${window._CONFIG['domianURL']}/test/jeecgDemo/importExcel`,
      title: '报告制作',
      width: 800,
      visible: false,
      uploadData: {},
      confirmLoading: false,
      headers: {
        authorization: 'authorization-text',
      },
      rules: {
        disType: { rules: [{ required: true, message: '请选择报告类型!' }] },
        letterTemplate: { rules: [{ required: true, message: '请选择报告模板!' }] },
      },
      tabList: [
        {
          key: 'tab1',
          tab: '报告制作',
        },
        {
          key: 'tab2',
          tab: '报告上传',
        },
      ],
      key: 'tab1',
      files: [],
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        // 项目名称
        trustPrjName: '',
        // 项目编号
        trustPrjCode: '',
        // 合同系列
        contractSerie: '',
        // 是否估值
        voaType: '',
        // 报告类型
        disType: '',
        // 报告区间(起)
        dividendStartDt: '',
        // 报告区间(止)
        dividendEndDt: '',
        // 报告模板
        letterTemplate: '',
      },
      //表头
      columns: [],
      //列设置
      settingColumns: [],
      selectedRowKeys: [],
      arr: [],
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
          title: '项目名称',
          align: 'center',
          fixed: 'left',
          width: 240,
          dataIndex: 'TRUST_PRJ_NAME',
        },
        {
          title: '项目编号',
          fixed: 'left',
          width: 160,
          align: 'center',
          dataIndex: 'TRUST_PRJ_CODE',
        },
        {
          title: '估值类型',
          align: 'center',
          width: 80,
          dataIndex: 'VOA_TYPE',
          customRender: (text) => {
            //字典值替换通用方法
            return filterDictText(this.dictOptionsData['VOA_TYPE'], text)
          },
        },
        {
          title: '项目类型',
          align: 'center',
          width: 100,
          dataIndex: 'CONTRACT_TYPE',
          customRender: (text) => {
            //字典值替换通用方法
            return filterDictText(this.dictOptionsData['CONTRACT_TYPE'], text)
          },
        },
        {
          title: '合同系列',
          align: 'center',
          dataIndex: 'CONTRACT_SERIE',
          customRender: (text) => {
            //字典值替换通用方法
            return filterDictText(this.dictOptionsData['CONTRACT_SERIE'], text)
          },
        },
        {
          title: '客户来源',
          align: 'center',
          width: 130,
          dataIndex: 'CUSTOMER_SOURCE',
          customRender: (text) => {
            //字典值替换通用方法
            if (this.customizeEnv == 'zrt') {
              let arr = []
              console.log(text)
              arr = text.split(',')
              let textValue = ''
              if (arr.length > 0) {
                for (let i = 0; i < arr.length; i++) {
                  if (i === arr.length - 1) {
                    textValue += filterDictText(this.dictOptionsData['CUSTOMER_SOURCE'], arr[i])
                  } else {
                    textValue += filterDictText(this.dictOptionsData['CUSTOMER_SOURCE'], arr[i]) + '/'
                  }
                }
                console.log(textValue)
                return textValue
              } else {
                return filterDictText(this.dictOptionsData['CUSTOMER_SOURCE'], text)
              }
            } else {
              return filterDictText(this.dictOptionsData['CUSTOMER_SOURCE'], text)
            }
          },
        },
        {
          title: '客户推荐机构',
          align: 'center',
          dataIndex: 'DEPART_NAME',
        },
        {
          title: '委托人名称',
          align: 'center',
          width: 120,
          dataIndex: 'C_PARTY_NAME',
        },
        {
          title: '证件类型',
          align: 'center',
          width: 80,
          dataIndex: 'C_IDN_NAME',
        },
        {
          title: '证件号码',
          align: 'center',
          width: 200,
          dataIndex: 'C_IDN',
        },
        {
          title: '信托成立日',
          align: 'center',
          dataIndex: 'TRUST_STD_DT',
          customRender(text) {
            return text ? moment(text).format('YYYY-MM-DD') : '--'
          },
        },
        {
          title: '信托到期日',
          align: 'center',
          dataIndex: 'TRUST_END_DT',
          customRender(text) {
            return text ? moment(text).format('YYYY-MM-DD') : '--'
          },
        },
        {
          title: '信托终止日',
          align: 'center',
          dataIndex: 'TRUST_EXPR_DT',
          customRender(text) {
            return text ? moment(text).format('YYYY-MM-DD') : '--'
          },
        },
        {
          title: '信托经理',
          align: 'center',
          dataIndex: 'TM_NAME',
        },
        {
          title: '项目状态',
          align: 'center',
          width: 100,
          dataIndex: 'PRJ_STATUS',
          customRender: (text) => {
            //字典值替换通用方法
            return filterDictText(this.dictOptionsData['PRJ_STATUS'], text)
          },
        },
      ],
      url: {
        list: '/prj/list?prjStatus=' + ['R', 'E'] + '&viewType=' + 'makeLetter',
        delete: '/test/jeecgDemo/delete',
        deleteBatch: '/test/jeecgDemo/deleteBatch',
        exportXlsUrl: '/test/jeecgDemo/exportXls',
      },
      dictOptionsData: [],
    }
  },
  methods: {
    // 处理报告制作逻辑
    handleOk() {
      if (this.key == 'tab1') {
        const that = this
        // 触发表单验证
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.confirmLoading = true
            console.log('submit!', this.form)
            let prjCode = this.arr.join(',')
            let param = {
              prjCode: prjCode,
              pageStatus: 'save',
              disType: this.form.disType,
              startDt: this.form.dividendStartDt,
              endDt: this.form.dividendEndDt,
              letterTemplate: this.form.letterTemplate,
            }
            if (this.form.disType == '3') {
              this.$message.warning('清算报告暂不支持制作报告模板,请进行上传')
              this.confirmLoading = false
              return false
            }
            postAction('/letter/makeLetter', param)
              .then((res) => {
                console.log(res)
                if (res.code == '200') {
                  this.$message.success('报告生成成功')
                  that.$emit('ok')
                } else {
                  this.$message.success('报告生成失败')
                }
                this.arr = []
                this.visible = false
                this.confirmLoading = false
                this.searchQuery()
              })
              .finally(() => {
                that.confirmLoading = false
                that.close()
              })
          }
        })
      }
      if (this.key == 'tab2') {
        console.log('submit!', this.form)
        let prjCode = this.arr.join(',')
        console.log('prjCode={}', prjCode)
        const formData = new FormData()
        if (this.prjCode === undefined) {
          // 校验是否已选择文件
          this.$message.warning('请先选择文件后上传')
          this.confirmLoading = false
          return false
        }
        formData.append('prjCode', prjCode)
        formData.append('disType', this.data.disType)
        formData.append('endDt', this.data.endDt)
        formData.append('startDt', this.data.startDt)
        this.files.forEach((file) => {
          formData.append('files', file)
        })
        let files = formData.get('files')
        console.log('fomdate', formData)
        postAction('/letter/upload', formData).then((res) => {
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
      }
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    searchReset() {
      this.queryParam = {}
      this.selectedRows = []
      this.selectedRowKeys = []
      this.searchQuery()
    },
    queryTable(){
      this.searchQuery()
      this.selectedRows = []
      this.selectedRowKeys = []
    },
    changeFiles(files) {
      this.files = [...files]
    },
    beforeUpload(file) {
      let dis = this.form.disType
      let dividendEndDt = this.form.dividendEndDt
      let dividendStartDt = this.form.dividendStartDt
      this.data = {
        prjCode: this.arr.join(','),
        disType: dis,
        endDt: dividendEndDt,
        startDt: dividendStartDt,
      }
      this.files = [...this.files, file]
      console.log('data', this.data)
    },
    makeLetter() {
      console.log('this', this.selectedRowKeys)
      this.form.disType = ''
      this.form.dividendEndDt = ''
      this.form.dividendStartDt = ''
      this.form.letterTemplate = ''
      if (this.selectedRowKeys === undefined || this.selectedRowKeys.length < 1) {
        this.$message.warning('请勾选需要生成信批报告的项目')
        return false
      }
      this.visible = true
      for (let i = 0; i < this.selectedRows.length; i++) {
        this.arr.push(this.selectedRows[i].PRJ_CODE)
      }
    },
    onTabChange(key, type) {
      console.log(key, type)
      this[type] = key
    },
    onSelectChange(keys, rows) {
      this.selectedRowKeys = keys
      this.selectedRows = rows
    },
    handleChange() {},
    // 日期区间
    changeDate(val, startDt, endDt) {
      if ('termDays' in this.form) {
        this.form.termDays = this.getDays(val[0], val[1])
      }
      this.$set(this.form, startDt, val[0] || '')
      this.$set(this.form, endDt, val[1] || '')
    },

    initDictConfig() {
      //初始化字典 - 是否估值
      let that = this
      initDictOptionsBatch('VOA_TYPE,CONTRACT_TYPE,CONTRACT_SERIE,CUSTOMER_SOURCE,PRJ_STATUS,LETTER_TEMPLATE').then(
        (res) => {
          if (res.success) {
            that.dictOptionsData = res.result
          }
        }
      )
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
    handleAdd() {
      this.$router.push({ name: 'prj-setup', query: { optType: 'ADD' } })
    },
    handleEdit(record) {
      this.$router.push({
        name: 'prj-setup',
        query: { optType: 'EDIT', prjCode: record.PRJ_CODE },
        meta: { keepAlive: true },
      })
    },
    handleDelete(id) {},
  },
  created() {
    this.initColumns()
  },
}
</script>
<style lang="stylus" scoped></style>