<template>
  <a-card size="small" :title="title" :bordered="false">
    <!-- 搜索面板 -->
    <div class="table-page-search-wrapper">
      <WkfNextUserModal ref="wkfUserForm" @complete="wkfUserComplete" />
      <a-form v-if="comParam.relType === 'BENEFICIARY'" layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="12">
          <a-col :span="6">
            <a-form-item label="姓名/名称" :labelCol="{span: 10}" :wrapperCol="{span: 14}">
              <a-input placeholder="请输入姓名/名称" v-model="queryParam.beneName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="受益人类型" :labelCol="{span: 10}" :wrapperCol="{span: 14}">
              <j-d-select-tag dict-code="NATURAL_YN" v-model="queryParam.beneType" :need-empty-option="true"></j-d-select-tag>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证件类型" :labelCol="{span: 10}" :wrapperCol="{span: 14}">
              <j-d-select-tag :dict-code="idTypeDict" v-model="queryParam.idType" :need-empty-option="true"></j-d-select-tag>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证件号码" :labelCol="{span: 10}" :wrapperCol="{span: 14}">
              <a-input placeholder="请输入证件号码" v-model="queryParam.idNo"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <div class="table-operator">
        <template v-if="comParam.relType === 'BENEFICIARY'">
          <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
          <a-button type="primary" @click="searchReset" icon="reload">重置</a-button>
        </template>
        <a-button :disabled="Object.keys(this.dictOptionsData).length<1||loading" @click="handleAdd" type="primary" icon="plus">新增</a-button>
        <template v-if="comParam.relType === 'BENEFICIARY'">
          <a-upload name="file" :showUploadList="false" :multiple="false" 
            :headers="tokenHeader" 
            :action="importExcelUrl" 
            :data="{'prjCode':prjCode}" 
            @change="handleImportExcel"
            accept=".xls,.xlsx"
          >
            <a-button type="primary" icon="import" :disabled="loading">导入受益人</a-button>
          </a-upload>
        </template>
      </div>

      <a-table
        ref="table"
        bordered
        size="small"
        rowKey="PARTY_CODE"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        width="1000px"
        :scroll="{ x: comParam.relType === 'BENEFICIARY'?1800:1300 }"
        @change="handleTableChange">
          <span slot="action" slot-scope="text, record">
            <a @click="handleView(record)">查看</a>
            <span v-if="record.PARTY_CODE!=='TRUSTEE' && record.STATUS !== 'ADTING'">
              <a-divider type="vertical"></a-divider>
              <a @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical"></a-divider>
              <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record)">
                <a>删除</a>
              </a-popconfirm>
            </span>
          </span>
      </a-table>

      <rel-party-modal ref="modalForm" @ok="modalFormOk" destroyOnClose></rel-party-modal>
    </div>
  </a-card>
</template>

<script>
  import biTableMixin from '@mixins/biTableMixin'
  import { filterDictText } from '@/components/dict/JDictSelectUtil'
  import { FtsListMixin } from '@/mixins/FtsListMixin'
  import RelPartyModal from './modules/RelPartyModal'
  import JDSelectTag from '@comp/dict/JDSelectTag'
  import WkfNextUserModal from '@views/activiti/modules/WkfNextUserModal'
  import { initDictOptionsBatch } from '../../components/dict/JDictSelectUtil'
  import { postAction,getAction } from '../../api/manage'

  export default {
    name: 'RelPartyList',
    mixins:[biTableMixin,FtsListMixin],
    components: {
      RelPartyModal,JDSelectTag,WkfNextUserModal
    },
    props:{
      comParam:{
        type:Object,
        default:()=>{}
      }
    },
    computed:{
      idTypeDict:function(){
        this.queryParam.idType=''
        switch(this.queryParam.beneType){
          case 'Y':
            return 'IDNTYPES'
            break
          case 'N':
            return 'ORGIDNTYPES'
            break
          default:
            return ''
            break
        }
      }
    },
    watch: {
      comParam: {
        immediate: true,
        deep: true,
        handler(v) {
          this.url.list='/prj/rel/list?prjCode='+this.$route.query.prjCode+'&relType='+v.relType;
          this.initPage();
        }
      }
    },
    data() {
      let that = this;
      return {
        prjCode:"",
        title:" ",
        // 查询条件
        queryParam: {
          beneName: "",
          beneType: "",
          idType: "",
          idNo: "",
        },
        dictOptionsData:[],
        columns:[],
        defColumns: [
          // {
          //   title: '序号',
          //   dataIndex: '',
          //   key: 'rowIndex',
          //   width: 60,
          //   align: "center",
          //   fixed: 'left',
          //   customRender: function (t, r, index) {
          //     return parseInt(index) + 1;
          //   }
          // },
          {
            title: '类型',
            align: "center",
            dataIndex: 'NATURAL_YN',
            relTypes:["CLIENT","EXECUTOR","COOWNER"],
            customRender: function (text) {
              return filterDictText(that.dictOptionsData["NATURAL_YN"], text);
            }
          },
          {
            title: '受益顺位',
            align: "center",
            fixed: 'left',
            width: 90,
            dataIndex: 'BNF_RANK',
            relTypes:["BENEFICIARY"],
            customRender: function (text) {
              text=text?text+"":""
              return filterDictText(that.dictOptionsData["BNF_RANK"], text);
            }
          },
          {
            title: '监察顺位',
            align: "center",
            fixed: 'left',
            width: 90,
            dataIndex: 'SUP_RANK',
            relTypes:["SUPERVISER"],
            customRender: function (text) {
              return filterDictText(that.dictOptionsData["BNF_RANK"], text+"");
            }
          },
          {
            title: '姓名/名称',
            align: "center",
            dataIndex: 'PARTY_NAME'
          },
          {
            title: '证件类型',
            align: "center",
            width: '180px',
            dataIndex: 'IDN_TYPE',
            customRender: (text,record) => {
              //字典值替换通用方法
              let rtnStr = filterDictText(that.dictOptionsData[record.NATURAL_YN === 'Y'?"IDNTYPES":"ORGIDNTYPES"], text);
              if(text === "OTH"){
                rtnStr += "："+record.IDN_TYPE_OTH;
              }
              return rtnStr;
            }
          },
          {
            title: '证件号码',
            align: "center",
            dataIndex: 'IDN'
          },
          {
            title: '机构类型',
            align: "center",
            dataIndex: 'ORG_TYPE',
            relTypes:["TRUSTEE"],
            customRender: function (text) {
              return filterDictText(that.dictOptionsData["CUS_CATEGORY_ORGAN"], text);
            }
          },
          {
            title: '法定代表人',
            align: "center",
            dataIndex: 'PRINCIPAL_NAME',
            relTypes:["TRUSTEE"]
          },
          {
            title: '注册地址',
            align: "center",
            dataIndex: 'ADDRESS',
            relTypes:["TRUSTEE"]
          },
          {
            title: '婚姻状况',
            align: "center",
            relTypes:["BENEFICIARY","SUPERVISER"],
            dataIndex: 'MARITAL_CODE',
            customRender: function (text) {
              return filterDictText(that.dictOptionsData["MARITAL_CODE"], text);
            }
          },
          {
            title: '手机号码',
            align: "center",
            relTypes:["!TRUSTEE"],
            dataIndex: 'CPHONE'
          },
          {
            title: '固定电话',
            align: "center",
            relTypes:["!TRUSTEE"],
            dataIndex: 'FPHONE'
          },
          {
            title: '关系人类型',
            align: "center",
            relTypes:["OTH"],
           // dataIndex: 'REL_TYPE_CODE', 修复其他关系人中的标记值于字典中的标记冲突，其他关系人 关系类型存放在其他关系人表中
            dataIndex: 'REL_TYPE',
            customRender: function (text) {
              return filterDictText(that.dictOptionsData["OTH_REL_TYPE"], text);
            }
          },
          {
            title: '受益人状态',
            align: "center",
            relTypes:["BENEFICIARY"],
            dataIndex: 'BNF_STATUS',
            customRender: function (text) {
              return filterDictText(that.dictOptionsData["BNF_STATUS"], text);
            }
          },
          {
            title: '监察人状态',
            align: "center",
            relTypes:["SUPERVISER"],
            dataIndex: 'SUP_STATUS',
            customRender: function (text) {
              return filterDictText(that.dictOptionsData["SUP_STATUS"], text);
            }
          },
          {
            title: '受益人类型',
            align: "center",
            relTypes:["BENEFICIARY"],
            dataIndex: 'BNF_TYPE',
            customRender: function (text) {
              return filterDictText(that.dictOptionsData["BNF_TYPE"], text);
            }
          },
          {
            title: '与委托人关系',
            align: "center",
            relTypes:["BENEFICIARY","SUPERVISER"],
            dataIndex: 'CUS_RELATIVE_TYPE',
            customRender: function (text) {
              return filterDictText(that.dictOptionsData["PTY_RELATIVE_TYPE"], text);
            }
          },
          {
            title: '核心委托人',
            align: "center",
            dataIndex: 'HOST_CUS_PARTY',
            relTypes:["CLIENT"],
            customRender: function (text) {
              return filterDictText(that.dictOptionsData["y_n"], text);
            }
          },
          {
            title: '审核状态',
            align: "center",
            dataIndex: 'STATUS',
            customRender: (text) => {
              return filterDictText(that.dictOptionsData["AUDIT_STATUS"], text);
            }
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            width: 140,
            fixed: 'right',
            scopedSlots: {
              customRender: 'action'
            }
          }
        ],
        url:{
          list:'',
          del:'/prj/rel/del',
          delmark:'/prj/findPrjStatusByPrjCode',
          importExcelUrl:'/prj/rel/importCharityBene',
          findByPrjCode: '/prj/findByPrjCode',
        }
      }
    },
    created() {
      this.loading = true;
    },
    mounted() {

    },
    methods: {
      checkIfShowColumn(item){
        if(!item.relTypes){
          return true;
        }else{
          let result = false;
          let that = this;
          item.relTypes.forEach(function(t){
            if(t.indexOf("!") >= 0){//非此类型都显示
              result = t.indexOf(that.comParam.relType) <= 0;
            }else{
              if(t === that.comParam.relType){
                result = true;
              }
            }
          });
          return result;
        }
      },
      initColumn(){
        let that = this;
        let c = [];
        that.defColumns.forEach(function (item) {
          if(that.checkIfShowColumn(item)){
            c.push(item);
          }
        });
        that.columns = c;
        that.loadData();
      },
      initPage(){
        this.loading = true;
        let that = this;
        this.prjCode = this.$route.query.prjCode;
        if(Object.keys(that.dictOptionsData).length<1){
          initDictOptionsBatch("REL_TYPE,BNF_STATUS,IDNTYPES,ORGIDNTYPES,AUDIT_STATUS,ORG_TYPE,CUS_CATEGORY_ORGAN,y_n,NATURAL_YN,BNF_RANK,MARITAL_CODE,SUP_STATUS,BNF_TYPE,PTY_RELATIVE_TYPE,OTH_REL_TYPE").then((res) => {
            if (res.success) {
              that.dictOptionsData = res.result;
              console.dir(that.dictOptionsData);
              that.title = filterDictText(that.dictOptionsData["REL_TYPE"], that.comParam.relType);
              that.initColumn();
            }
          });
        }else{
          that.title = filterDictText(that.dictOptionsData["REL_TYPE"], that.comParam.relType);
          that.initColumn();
        }
      },
      handleView(record){
        this.$refs.modalForm.view(this.comParam.relType, record);
        this.$refs.modalForm.title = "查看"+filterDictText(this.dictOptionsData["REL_TYPE"], this.comParam.relType);
      },
      handleEdit: function (record) {
        this.$refs.modalForm.edit(this.comParam.relType, record);
        this.$refs.modalForm.title = "修改"+filterDictText(this.dictOptionsData["REL_TYPE"], this.comParam.relType);
      },
      handleAdd: function () {
        this.$refs.modalForm.add(this.comParam.relType);
        this.$refs.modalForm.title = "新增"+filterDictText(this.dictOptionsData["REL_TYPE"], this.comParam.relType);
      },
      handleDelete(record){
        let that = this;
        let p={cppm:{partyCode:record.PARTY_CODE,relTypeCode:that.comParam.relType,prjCode:this.$route.query.prjCode}};
        let m={prjCode:this.$route.query.prjCode};
        that.loading = true;
        postAction(that.url.del, p).then((res)=>{//执行删除操作
          if(res.success){
          //  that.$message.success(res.message);
            //判读是否需要审批流
            let needWkf=res.result&&res.result.processId;
            if(needWkf){
              that.$nextTick(() => {
                that.$refs.wkfUserForm.edit(res.result.processId);
                that.$refs.wkfUserForm.disableSubmit = false;
              })
            }
            that.loadData();
          }else{
          //  that.$message.error(res.message);//后端异常统一处理 这里提示不要了
          }
        }).finally(()=>{
          that.loading = false;
        });
     /*   // console.log("ceyyy----"+JSON.stringify(this.$route.query.prjCode))
        getAction(that.url.delmark, m).then((res)=>{//删除之前看一下项目状态
          if(res.success){
            //console.log("ce----"+JSON.stringify(res.result))
            if(res.result.status=="U"){
              postAction(that.url.del, p).then((res)=>{//执行删除操作
                if(res.success){
                  that.$message.success(res.message);
                  that.loadData();
                }else{
                  that.$message.error(res.message);
                }
              }).finally(()=>{
                that.loading = false;
              });
            }
            else{
              that.$message.warning("该信息被项目使用，删除失败");
              that.loading = false;
            }
          }else{
            that.$message.error(res.message);
          }
        })*/

      },
      beforeImport(info){
        this.loading=true
      },
      afterImport(info){
        if (info.file.response&&info.file.response.success){
          this.$message.success(info.file.response.result.message || `${info.file.name} 文件上传成功`)
          if(info.file.response.result.processId){
            this.$refs.wkfUserForm.edit(info.file.response.result.processId);
            this.$refs.wkfUserForm.disableSubmit = false;
          }
        }
        this.loading=false
      },
      wkfUserComplete() {

      }
    }
  }
</script>

<style scoped>
  @import '~@assets/less/common.less'
</style>