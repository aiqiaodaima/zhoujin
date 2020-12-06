<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <!-- 搜索区域 -->
      <a-form-model layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="项目名称">
              <a-input placeholder="请输入项目名称" v-model="queryParam.trustPrjName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="委托人" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <a-input placeholder="请输入委托人名称" v-model="queryParam.clientName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <BiRangeDatePicker  label="信托成立日" :dateEnd="queryParam.trustStartDtEnd" :dateStart="queryParam.trustStartDtBegin" @change="changeFlowDate"  />
            <!-- <a-form-item label="信托成立日" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <j-date
                v-model="queryParam.trustStartDtBegin"
                :showTime="false"
                date-format="YYYY-MM-DD"
                style="width:45%"
              ></j-date>
              <span style="width: 10px;">~</span>
              <j-date
                v-model="queryParam.trustStartDtEnd"
                :showTime="false"
                date-format="YYYY-MM-DD"
                style="width:45%"
              ></j-date>
            </a-form-item> -->
          </a-col>
        </a-row>
        <template v-if="toggleSearchStatus">
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-item label="项目编号">
                <a-input placeholder="请输入项目编号" v-model="queryParam.trustPrjCode"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="合同编号">
                <a-input placeholder="请输入合同编号" v-model="queryParam.contractNo"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="合同系列">
                <j-multi-select-tag v-model="queryParam.contractSerie" dict-code="CONTRACT_SERIE"></j-multi-select-tag>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="业务类型">
                <j-multi-select-tag v-model="queryParam.contractType" dict-code="CONTRACT_TYPE"></j-multi-select-tag>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="项目状态">
                <j-multi-select-tag v-model="queryParam.prjStatus" dict-code="PRJ_STATUS"></j-multi-select-tag>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="客户来源">
                <j-multi-select-tag
                  v-model="queryParam.customerSource"
                  dict-code="CUSTOMER_SOURCE"
                ></j-multi-select-tag>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="是否估值">
                <j-multi-select-tag v-model="queryParam.voaType" dict-code="VOA_TYPE"></j-multi-select-tag>
              </a-form-item>
            </a-col>
          </a-row>
        </template>
      </a-form-model>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator" style="margin-top: 5px">
      <a-button v-has="'prj:setup'" @click="handleAdd" type="primary" icon="plus">项目设立</a-button>
      <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
      <a-button type="primary" @click="searchReset" icon="reload">重置</a-button>
      <a @click="handleToggleSearch" style="margin-left: 8px">
        {{ toggleSearchStatus ? '收起' : '更多条件' }}
        <a-icon :type="toggleSearchStatus ? 'up' : 'down'"></a-icon>
      </a>
    </div>

    <a-table
      ref="table"
      size="small"
      bordered
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      :scroll="{ x: 4500 ,y:400}"
      @change="handleTableChange"
    >
      <div slot="filterDropdown">
        <a-card>
          <a-checkbox-group
            @change="onColSettingsChange"
            v-model="settingColumns"
            :defaultValue="settingColumns"
          >
            <a-row>
              <template v-for="(item,index) in defColumns">
                <template v-if="item.key!=='rowIndex'&& item.dataIndex!=='action'">
                  <a-col :span="12">
                    <a-checkbox :value="item.dataIndex">{{ item.title }}</a-checkbox>
                  </a-col>
                </template>
              </template>
            </a-row>
          </a-checkbox-group>
        </a-card>
      </div>
      <a-icon slot="filterIcon" type="setting" :style="{ fontSize:'16px',color:  '#108ee9' }"></a-icon>

      <span slot="action" slot-scope="text, record">
        <a
          @click="() => $router.push({name: 'projectView',query:{title:'项目视图',prjCode:record.PRJ_CODE,prjName:record.TRUST_PRJ_NAME}})"
        >查看</a>
        <!-- <a-divider v-has="'prj:edit'" type="vertical" /> -->
        <!-- <a v-has="'prj:edit'" @click="handleEdit(record)">编辑</a> -->
        <a-divider v-has="'prj:edit'" type="vertical"></a-divider>
        <a v-if="customizeEnv === 'sdic'" v-has="'prj:edit'" @click="handleEdit(record)">编辑</a>
        <a-divider v-if="customizeEnv === 'sdic'" v-has="'prj:edit'" type="vertical"></a-divider>
        <a-popconfirm v-if="customizeEnv === 'sdic'" title="确定删除吗?" @confirm="() => handleDelete(record.PRJ_CODE)">
          <a>删除</a>
        </a-popconfirm>
        <a-dropdown v-if="customizeEnv!='sdic'">
          <a v-has="'prj:del'" class="ant-dropdown-link">
            更多
            <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a v-has="'prj:edit'" @click="handleEdit(record)">编辑</a>
            </a-menu-item>
            <a-menu-item>
              <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.PRJ_CODE)">
                <a>删除</a>
              </a-popconfirm>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </a-table>
    <!-- table区域-end -->
  </a-card>
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
import { postAction } from '@/api/manage'
export default {
  name: 'ProjectList',
  mixins: [FtsListMixin],
  components: {
    JSuperQuery,
    JMultiSelectTag,
    JDate,
    JInput,
  },
  data() {
    let customizeEnv = customizeConfigs.customizeEnv
    return {
      customizeEnv: customizeEnv,
      description: '项目查询页面',
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
          title: '合同编号',
          fixed: 'left',
          width: 160,
          align: 'center',
          dataIndex: 'CONTRACT_NO',
        },
        {
          title: '是否估值',
          align: 'center',
          width: 80,
          dataIndex: 'VOA_TYPE',
          customRender: (text) => {
            //字典值替换通用方法
            return filterDictText(this.dictOptionsData['VOA_TYPE'], text)
          },
        },
        {
          title: '合同类型',
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
          title: '渠道',
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
          width: 200,
          dataIndex: 'C_IDN_NAME',
        },
        {
          title: '证件号码',
          align: 'center',
          width: 200,
          dataIndex: 'C_IDN',
        },
        {
          title: '可用现金余额',
          align: 'center',
          dataIndex: 'KYXJYE',
          sorter: (a, b) => a.KYXJYE - b.KYXJYE,
        },
        {
          title: '现金余额',
          align: 'center',
          dataIndex: 'XJYE',
          sorter: (a, b) => a.XJYE - b.XJYE,
        },
        {
          title: '资产总值',
          align: 'center',
          dataIndex: 'ZCZZ',
          sorter: (a, b) => a.ZCZZ - b.ZCZZ,
        },
        {
          title: '资产净值',
          align: 'center',
          dataIndex: 'ZCJZ',
          sorter: (a, b) => a.ZCJZ - b.ZCJZ,
        },
        {
          title: '本金金额',
          align: 'center',
          dataIndex: 'BJJE',
          sorter: (a, b) => a.BJJE - b.BJJE,
        },
        {
          title: '收益金额',
          align: 'center',
          dataIndex: 'SYJE',
          sorter: (a, b) => a.SYJE - b.SYJE,
        },
        {
          title: '未付费用',
          align: 'center',
          dataIndex: 'WFFY',
          sorter: (a, b) => a.WFFY - b.WFFY,
        },
        {
          title: '单位净值',
          align: 'center',
          dataIndex: 'DWJZ',
          sorter: (a, b) => a.DWJZ - b.DWJZ,
        },
        {
          title: '信托份额',
          align: 'center',
          dataIndex: 'XTFE',
          sorter: (a, b) => a.XTFE - b.XTFE,
        },
        {
          title: '初始委托金额',
          align: 'center',
          dataIndex: 'INIT_ASSET_AMOUNT',
          sorter: (a, b) => a.INIT_ASSET_AMOUNT - b.INIT_ASSET_AMOUNT,
        },
        {
          title: '追加委托金额',
          align: 'center',
          dataIndex: 'ZJWTJE',
          sorter: (a, b) => a.ZJWTJE - b.ZJWTJE,
        },
        {
          title: '已分配金额',
          align: 'center',
          dataIndex: 'YFPJE',
          sorter: (a, b) => a.YFPJE - b.YFPJE,
        },
        {
          title: '已分配本金',
          align: 'center',
          dataIndex: 'YFPBJ',
          sorter: (a, b) => a.YFPBJ - b.YFPBJ,
        },
        {
          title: '已分配收益',
          align: 'center',
          dataIndex: 'YFPSY',
          sorter: (a, b) => a.YFPSY - b.YFPSY,
        },
        {
          title: '信托成立日',
          align: 'center',
          dataIndex: 'TRUST_STD_DT',
          customRender(text) {
            return text ? moment(text).format('YYYY-MM-DD') : '--'
          },
          sorter: (a, b) =>  Date.parse(a.TRUST_STD_DT) - Date.parse(b.TRUST_STD_DT)
        },
        {
          title: '信托到期日',
          align: 'center',
          dataIndex: 'TRUST_END_DT',
          customRender(text) {
            return text ? moment(text).format('YYYY-MM-DD') : '--'
          },
          sorter: (a, b) =>  Date.parse(a.TRUST_END_DT) - Date.parse(b.TRUST_END_DT)
        },
        {
          title: '信托终止日',
          align: 'center',
          dataIndex: 'TRUST_EXPR_DT',
          customRender(text) {
            return text ? moment(text).format('YYYY-MM-DD') : '--'
          },
          sorter: (a, b) =>  Date.parse(a.TRUST_EXPR_DT) - Date.parse(b.TRUST_EXPR_DT)
        },
        {
          title: '信托经理',
          align: 'center',
          width: 200,
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
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          width: 160,
          fixed: 'right',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'action',
          },
        },
      ],
      url: {
        list: '/prj/list',
        delete: '/prj/del',
        deleteBatch: '/test/jeecgDemo/deleteBatch',
        exportXlsUrl: '/test/jeecgDemo/exportXls',
      },
      dictOptionsData: [],
    }
  },
  methods: {
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
    changeFlowDate (val) {
      this.$set(this.queryParam,'trustStartDtBegin',val[0]|| '')
      this.$set(this.queryParam,'trustStartDtEnd',val[1]|| '')
    },
    handleDelete(prjCode) {
      postAction(this.url.delete, {prjCode: prjCode}).then((res) => {
        if (res.success) {
          this.$message.success(res.message);
          this.loadData();
        } else {
          this.$message.warning(res.message);
        }
      });
    },
  },
  created() {
    this.initColumns()
  },
}
</script>
<style lang="stylus" scoped></style>