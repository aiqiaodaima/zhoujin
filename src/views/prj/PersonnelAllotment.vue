<template>
  <a-card :bordered="false" title="项目查询">
    <!-- 查询区域 -->
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <!-- 搜索区域 -->
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="项目名称" >
              <a-input placeholder="请输入项目名称" v-model="queryParam.trustPrjName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="委托人" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <a-input placeholder="请输入委托人名称" v-model="queryParam.clientName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="信托成立日" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <j-date v-model="queryParam.trustStartDtBegin" :showTime="false" date-format="YYYY-MM-DD" style="width:45%"></j-date>
              <span style="width: 10px;">~</span>
              <j-date v-model="queryParam.trustStartDtEnd" :showTime="false" date-format="YYYY-MM-DD" style="width:45%"></j-date>
            </a-form-item>
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
              <a-form-item label="合同系列" >
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
                <j-multi-select-tag v-model="queryParam.customerSource" dict-code="CUSTOMER_SOURCE"></j-multi-select-tag>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="是否估值">
                <j-multi-select-tag v-model="queryParam.voaType" dict-code="VOA_TYPE"></j-multi-select-tag>
              </a-form-item>
            </a-col>
            <a-col :span="8" v-if="rolecodeOptions.length>0">
              <BiFormItemSelect  :options="rolecodeOptions" label="角色名称"  v-model="queryParam.roleCode"/>
            </a-col>
            <a-col :span="8" v-if="userIds.length>0">
              <BiFormItemSelect  :options="userIds" label="用户姓名"  v-model="userName"/>
            </a-col>
          </a-row>
        </template>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button v-has="'personAllot:dataper'" v-if="selectedRowKeys.length>0" @click="handleChange" type="primary">配置数据权限</a-button>
      <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
      <a-button type="primary" @click="searchReset" icon="reload">重置</a-button>
      <a @click="handleToggleSearch" style="margin-left: 8px">
        {{ toggleSearchStatus ? '收起' : '更多条件' }}
        <a-icon :type="toggleSearchStatus ? 'up' : 'down'"></a-icon>
      </a>
    </div>

    <a-table
      ref="table"
      bordered
      size="small"
      rowKey="PRJ_CODE"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :scroll="{ x: 2400, y: 400 }"
      @change="handleTableChange">
    </a-table>
    <!-- table区域-end -->
    <BiModal
      :visible.sync="modal.visible"
      :width="800"
      :title="modal.title"
      :fullscreen.sync="modal.fullscreen"
      :switchFullscreen="modal.switchFullscreen"
      @handleOk='handleOk'
      :destroyOnClose='true'
    >
      <PersonnelAllotmentModal :selectedRowKeys="selectedRowKeys" ref='personnelAllotmentModal' @update='updateList'></PersonnelAllotmentModal>
    </BiModal>
  </a-card>
</template>

<script>
  import JSuperQuery from '@/components/jeecg/JSuperQuery.vue';
  import JInput from '@/components/jeecg/JInput.vue';
  import JDate from '@/components/jeecg/JDate'
  import { postAction} from '@api/manage'
  import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'
  import { FtsListMixin } from '@/mixins/FtsListMixin'
  import Vue from 'vue'
  import JMultiSelectTag from '../../components/dict/JMultiSelectTag'
  import moment from 'moment'
  import { initDictOptionsBatch } from '../../components/dict/JDictSelectUtil'
  import PersonnelAllotmentModal from './modules/PersonnelAllotmentModal'
  export default {
    name: "PersonnelAllotment",
    mixins:[FtsListMixin],
    components: {
      PersonnelAllotmentModal,
      JSuperQuery,
      JMultiSelectTag,
      JDate,
      JInput
    },
    data() {
      return {
        userIds:[],
        rolecodeOptions:[],
        description: '项目查询页面',
        //表头
        columns:[],
        //列设置
        settingColumns:[],
        //列定义
        modal: {
          title: '人员调配',
          visible: false,
          fullscreen: false,
          switchFullscreen: false,
        },
        defColumns: [
          {
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: "center",
            fixed: 'left',
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '项目名称',
            align: "center",
            width: 200,
            fixed: 'left',
            dataIndex: 'TRUST_PRJ_NAME'
          },
          {
            title: '项目编号',
            fixed: 'left',
            width: 200,
            align: "center",
            dataIndex: 'TRUST_PRJ_CODE'
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
            align: "center",
            dataIndex: 'VOA_TYPE',
            width: 80,
            customRender: (text) => {
              //字典值替换通用方法
              return filterDictText(this.dictOptionsData["VOA_TYPE"], text);
            }
          },
          {
            title: '项目类型',
            align: "center",
            dataIndex: 'CONTRACT_TYPE',
            width: 80,
            customRender: (text) => {
              //字典值替换通用方法
              return filterDictText(this.dictOptionsData["CONTRACT_TYPE"], text);
            }
          },
          {
            title: '合同系列',
            align: "center",
            dataIndex: 'CONTRACT_SERIE',
            width: 100,
            customRender: (text) => {
              //字典值替换通用方法
              return filterDictText(this.dictOptionsData["CONTRACT_SERIE"], text);
            }
          },
          {
            title: '客户来源',
            align: "center",
            dataIndex: 'CUSTOMER_SOURCE',
             width: 120,
            customRender: (text) => {
              //字典值替换通用方法
              return filterDictText(this.dictOptionsData["CUSTOMER_SOURCE"], text);
            }
          },
          {
            title: '渠道',
            align: "center",
            dataIndex: 'DEPART_NAME'
          },
          {
            title: '委托人名称',
            align: "center",
            dataIndex: 'C_PARTY_NAME'
          },
          {
            title: '证件类型',
            align: "center",
            dataIndex: 'C_IDN_NAME'
          },
          {
            title: '证件号码',
            align: "center",
            dataIndex: 'C_IDN'
          },
          {
            title: '项目状态',
            align: "center",
            dataIndex: 'PRJ_STATUS',
            customRender: (text) => {
              //字典值替换通用方法
              return filterDictText(this.dictOptionsData["PRJ_STATUS"], text);
            }
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
            title: '客户经理',
            align: "center",
            dataIndex: 'RM_NAME'
          },
          {
            title: '投资经理',
            align: "center",
            dataIndex: 'IM_NAME'
          },
          {
            title: '运营经理',
            align: "center",
            dataIndex: 'YR_NAME'
          },
          {
            title: '信托出纳',
            align: "center",
            dataIndex: 'CN_NAME'
          },
          {
            title: '信托会计',
            align: "center",
            dataIndex: 'HJ_NAME'
          },
          {
            title: '信托经理',
            align: "center",
            dataIndex: 'TM_NAME'
          },
          
        ],
        url: {
           list: "/prj/list/fp",
           getOptions:'/prj/staffing/getRole',
           getdicts:'/prj/staffing/getRoleUser'
        },
        dictOptionsData:[],
        userDatas:[],
        userName:''
      }
    },
    watch:{
      userName:function(newVal,oldVal){
        this.queryParam.userId=this.userDatas[newVal].id
        console.log(this.queryParam)
      },
      'queryParam.roleCode':function(newVal,oldVal){
        this.loading = true
        postAction(this.url.getdicts,{roleCode:newVal})
          .then(res => {
            if (res.success) {
              this.userDatas=res.result
              this.userIds=res.result.map((item,idx)=>{
                return {value:idx,name:item.realname}
              })
            } else {
              this.$message.error(res.message)
            }
          }).finally(() => {
            this.loading=false;
          })
      }
    },
    methods: {
      getDictConfigs() {
        this.loading = true
        postAction(this.url.getOptions)
          .then(res => {
            if (res.success) {
              this.rolecodeOptions = res.result.map((item,idx)=>{
                return {value:item.roleCode,name:item.roleName}
              })
            } else {
              this.$message.error(res.message)
            }
          }).finally(() => {
            this.loading=false;
          })
      },
      updateList() {
        this.modal.visible = false
        this.loadData()
      },
      handleChange(){
         if (this.selectedRowKeys.length <= 0) {
            this.$message.warning('请选择一条记录！');
            return;
          } else {
            this.modal.visible = true
          }
        
      },
      handleOk(){
        this.$refs.personnelAllotmentModal.handleSubmit()
      },
      initDictConfig() {
        //初始化字典 - 是否估值
        let that = this;
        initDictOptionsBatch("VOA_TYPE,CONTRACT_TYPE,CONTRACT_SERIE,CUSTOMER_SOURCE,PRJ_STATUS,CONTRACT_SERIE,CUSTOMER_SOURCE").then((res) => {
          if (res.success) {
            that.dictOptionsData = res.result;
          }
        });
      },
     
      initColumns(){
        //权限过滤（列权限控制时打开，修改第二个参数为授权码前缀）
        //this.defColumns = colAuthFilter(this.defColumns,'testdemo:');

        var key = this.$route.name+":colsettings";
        let colSettings= Vue.ls.get(key);
        if(colSettings==null||colSettings==undefined){
          let allSettingColumns = [];
          this.defColumns.forEach(function (item,i,array ) {
            allSettingColumns.push(item.dataIndex);
          })
          this.settingColumns = allSettingColumns;
          this.columns = this.defColumns;
        }else{
          this.settingColumns = colSettings;
          const cols = this.defColumns.filter(item => {
            if(item.key =='rowIndex'|| item.dataIndex=='action'){
              return true;
            }
            if (colSettings.includes(item.dataIndex)) {
              return true;
            }
            return false;
          })
          this.columns =  cols;
        }
      },
      handleAdd(){

      }
    },
    created() {
      this.initColumns();
      this.getDictConfigs();
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';

</style>