<template>
  <a-card size="small" :title="title" :bordered="false">
    <div class="table-operator">
      <a-button :disabled="Object.keys(this.dictOptionsData).length<1" @click="handleAdd" type="primary" icon="plus">新增</a-button>
    </div>
    <a-table
      ref="table"
      bordered
      size="middle"
      rowKey="PARTY_CODE"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      width="1000px"
      :scroll="{ x: comParam.relType === 'BENEFICIARY'?1800:1300 }">

        <span slot="action" slot-scope="text, record">
          <a @click="handleView(record)">查看</a>
          <a-divider type="vertical"></a-divider>
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical"></a-divider>
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record)">
            <a>删除</a>
          </a-popconfirm>
        </span>

    </a-table>
    <rel-party-modal ref="modalForm" @ok="modalFormOk" destroyOnClose></rel-party-modal>
  </a-card>
</template>

<script>
  import { filterDictText } from '@comp/dict/JDictSelectUtil'
  import { FtsListMixin } from '@/mixins/FtsListMixin'
  import RelPartyModal from './RelPartyModal'
  import { initDictOptionsBatch } from '@comp/dict/JDictSelectUtil'
  import { postAction } from '@/api/manage'

  export default {
    name: 'RelPartyList',
    mixins:[FtsListMixin],
    components: {
      RelPartyModal
    },
    props:{
      comParam:{
        type:Object,
        default:()=>{}
      }
    },
    watch: {
      // comParam: {
      //   immediate: true,
      //   deep: true,
      //   handler(v) {
      //     this.url.list='/prj/rel/list?prjCode='+this.$route.query.prjCode+'&relType='+v.relType;
      //     this.initPage();
      //   }
      // }
    },
    data() {
      let that = this;
      return {
        prjCode:"",
        title:" ",
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
              return filterDictText(that.dictOptionsData["BNF_RANK"], text+"");
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
              return filterDictText(that.dictOptionsData["ORG_TYPE"], text);
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
            title: '受益人状态',
            align: "center",
            relTypes:["BENEFICIARY"],
            dataIndex: 'BNF_STATUS'
          },
          {
            title: '监察人状态',
            align: "center",
            relTypes:["SUPERVISER"],
            dataIndex: 'SUP_STATUS'
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
          list:'/prj/rel/list',
          del:'/prj/rel/del'
        }
      }
    },
    created() {
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
        let that = this;
        this.prjCode = this.$route.query.prjCode;
        if(Object.keys(that.dictOptionsData).length<1){
          initDictOptionsBatch("REL_TYPE,IDNTYPES,ORGIDNTYPES,AUDIT_STATUS,ORG_TYPE,y_n,NATURAL_YN,BNF_RANK,MARITAL_CODE,BNF_TYPE,PTY_RELATIVE_TYPE").then((res) => {
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
        let p={cppm:{partyCode:record.PARTY_CODE,relTypeCode:that.comParam.relType}};
        that.loading = true;
        postAction(that.url.del, p).then((res)=>{
          if(res.success){
            that.$message.success("删除成功");
            that.loadData();
          }else{
            that.$message.error(res.message);
          }
        }).finally(()=>{
          that.loading = false;
        });
      }
    }
  }
</script>

<style scoped>
  @import '~@assets/less/common.less'
</style>