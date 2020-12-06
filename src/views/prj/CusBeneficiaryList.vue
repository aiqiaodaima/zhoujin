<template>
  <div>
    <a-card size="small" :title="title" :bordered="true"></a-card>
    <div class="table-operator" style="border-top: 5px">
      <a-button :disabled="Object.keys(this.dictOptionsData).length<1" @click="handleAdd" type="primary" icon="plus">新增</a-button>
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
      :scroll="{ x: 1200 }">

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
  </div>
</template>

<script>
  import { ajaxGetDictItems } from '@/api/api'
  import { filterDictText } from '@/components/dict/JDictSelectUtil'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import RelPartyModal from './modules/RelPartyModal'
  import { initDictOptions, initDictOptionsBatch } from '../../components/dict/JDictSelectUtil'
  import { postAction } from '../../api/manage'

  export default {
    name: 'CusBeneficiaryList',
    mixins:[JeecgListMixin],
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
        dictOptionsData:[],
        columns:[
          {
            title: '受益顺位',
            align: "center",
            fixed: 'left',
            width: 90,
            relTypes:["BENEFICIARY"],
            dataIndex: 'BNF_RANK'
          },{
            title: '姓名/名称',
            align: "center",
            dataIndex: 'PARTY_NAME'
          },{
            title: '证件类型',
            align: "center",
            dataIndex: 'IDN_TYPE',
            customRender: (text,record) => {
              //字典值替换通用方法
              let rtnStr = filterDictText(that.dictOptionsData["IDNTYPES"], text);
              if(text === "OTH"){
                rtnStr += "："+record.IDN_TYPE_OTH;
              }
              return rtnStr;
            }
          },{
            title: '证件号码',
            align: "center",
            dataIndex: 'IDN'
          },{
            title: '婚姻状况',
            align: "center",
            relTypes:["BENEFICIARY"],
            dataIndex: 'MARITAL_CODE'
          },
          {
            title: '手机号码',
            align: "center",
            relTypes:["!TRUSTEE"],
            dataIndex: 'FPHONE'
          },
          {
            title: '固定电话',
            align: "center",
            relTypes:["!TRUSTEE"],
            dataIndex: 'CPHONE'
          },
          {
            title: '受益人状态',
            align: "center",
            relTypes:["BENEFICIARY"],
            dataIndex: 'BNF_STATUS'
          },
          {
            title: '受益人类型',
            align: "center",
            relTypes:["BENEFICIARY"],
            dataIndex: 'BNF_TYPE'
          },
          {
            title: '与委托人关系',
            align: "center",
            relTypes:["BENEFICIARY"],
            dataIndex: 'CUS_RELATIVE_TYPE'
          },{
            title: '审核状态',
            align: "center",
            dataIndex: 'STATUS',
            customRender: (text) => {
              return filterDictText(that.dictOptionsData["AUDIT_STATUS"], text);
            }
          },{
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
          del:'/prj/rel/del'
        }
      }
    },
    created() {
    },
    mounted() {

    },
    methods: {
      initPage(){
        let that = this;
        this.prjCode = this.$route.query.prjCode;
        if(Object.keys(that.dictOptionsData).length<1){
          initDictOptionsBatch("REL_TYPE,IDNTYPES,AUDIT_STATUS,ORG_TYPE,y_n,NATURAL_YN").then((res) => {
            if (res.success) {
              that.dictOptionsData = res.result;
              that.title = filterDictText(that.dictOptionsData["REL_TYPE"], that.comParam.relType);
            }
          });
        }else{
          that.title = filterDictText(that.dictOptionsData["REL_TYPE"], that.comParam.relType);
        }
        that.loadData();
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