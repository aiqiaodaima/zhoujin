<template>
  <div style="background:rgb(240,242,245);">
      <a-form-model>
            <a-card size="small" title="项目基本信息" :bordered="false">
              <detail-list v-if="this.detail.cli">
                <detail-list-item term="项目名称">{{detail.cli.trustPrjName}}</detail-list-item>
                <detail-list-item term="项目编号">{{detail.cli.trustPrjCode}}</detail-list-item>
                <detail-list-item term="中信登编号">{{detail.cli.cusCiticCode}}</detail-list-item>
                <detail-list-item term="委托人">{{clientName}}</detail-list-item>
                <detail-list-item term="委托财产规模">{{detail.cli.setScaleAmt}}</detail-list-item>
                <a-row></a-row>
                <detail-list-item term="成立日">{{detail.cli.trustStdDt}}</detail-list-item>
                <detail-list-item term="信托期限">{{gdqx}}</detail-list-item>
                <detail-list-item term="到期日">{{detail.cli.trustEndDt}}</detail-list-item>
                <detail-list-item term="户名">{{detail.cli.accName}}</detail-list-item>
                <detail-list-item term="账号">{{detail.cli.accNo}}</detail-list-item>
                <detail-list-item term="开户行">{{detail.cli.accOpenBank}}</detail-list-item>
              </detail-list>
            </a-card>
            <br/>
            <a-card size="small" title="子帐户设置" :bordered="false">
              <a-table
                ref="table"
                bordered
                size="small"
                rowKey="accNo"
                :columns="columns"
                :dataSource="dataSource"
                :pagination="ipagination"
                :loading="loading"
                @change="handleTableChange"
              >
      <span slot="action" slot-scope="text, record">
        <a @click="handleView(record)">查看</a>
      </span>
              </a-table>
            </a-card>
            <br/>
        <project-entrusted ref="ProjectEntrusted"></project-entrusted>
      </a-form-model>
  </div>
</template>

<script>
  import { FtsListMixin } from '@/mixins/FtsListMixin'
  import DetailList from '@bi/BiDetailList'
  import biTableMixin from '@mixins/biTableMixin'
  import { getDict } from '@/api/BiApi'
  import dictMixin from '@mixins/dictMixin'
  import { postAction,getAction } from '../../../api/manage'
  const DetailListItem = DetailList.Item
  import ProjectEntrusted from './ProjectEntrusted'
  import { formatAmt } from '../../../utils/util'
  export default {
    name: 'ProjectDetail',
    components: {
      DetailList,
      DetailListItem,
      ProjectEntrusted,
    },
    mixins:[biTableMixin,dictMixin,FtsListMixin],
    computed:{
    },
    watch:{
    },
    data () {
      return {
        queryParam: {
          prjCode:this.$route.query.prjCode,
        },
        clientName:'',
        gdqx:'',
        detail: {},
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: 'center',
            customRender: function (t, r, index) {
              return parseInt(index) + 1
            },
          },
          {
            title: '子账户名称',
            align: 'center',
            dataIndex: 'accName',
          },
          {
            title: '受益权模式',
            align: 'center',
            dataIndex: 'bnfMode',
            customRender: (text) => this.getDictNameByCode(this.dicts.BNF_MODE,text)
          },
          {
            title: '投资管理方式',
            align: 'center',
            dataIndex: 'imStyle',
            customRender: (text) => this.getDictNameByCode(this.dicts.IM_STYLE,text)
          },
          {
            title: '投资指令人',
            align: 'center',
            dataIndex: 'imSubStyle',
            customRender: (text) => this.getDictNameByCode(this.dicts.IM_SUB_STYLE,text)
          },
          /*{
            title: '是否收费',
            align: 'center',
            dataIndex: 'feeYn',
            customRender: (text) => this.getDictNameByCode(this.dicts.y_n,text)
          },*/
         {
            title: '可用现金余额',
            align: 'center',
            dataIndex: 'savingBal',
           customRender: function (text) {
             return formatAmt(Number(text||0),2);
           }
          },
          {
            title: '信托份额',
            align: 'center',
            dataIndex: 'unit',
            customRender: function (text) {
              return formatAmt(Number(text||0),4);
            }
          },
          {
            title: '单位净值',
            align: 'center',
            dataIndex: 'price',
            customRender: function (text,r) {
              if (r.price!=null && r.price!=''){
                return formatAmt(Number(text||0),4);
              } else {
                return ''
              }

            }
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            width: 140,
            fixed: 'right',
            scopedSlots: {
              customRender: 'action',
            },
          },
        ],

        url:{
          list: '/subacc/findSubaccByPrjCode',
        },
      }
    },
    created () {
      console.log('111'+this.$route.query.prjCode)
      this.initDictConfig()
      this.queryPrjInfo();
    },
    mounted () {
      console.log('333'+this.$route.query.prjCode)
    },
    methods:{
      handleView(record) {
        this.$router.push({name:'projectSubAccount', query: { optType: 'VIEW', prjCode: this.$route.query.prjCode, accNo: record.accNo }});
      },

      initDictConfig(){
        this.getDict('BNF_MODE,IM_STYLE,IM_SUB_STYLE,y_n')
      },

      async queryPrjInfo(){
        postAction('/prj/findByPrjCode', {cli:{prjCode: this.$route.query.prjCode}}).then(res=>{
          if(res.success){
            this.detail = res.result;
            //拼接信托期限
            if (this.detail.cli.trustTermType=='1'){
              //固定期限
                this.gdqx=this.detail.cli.trustTermPeriod+'年';
            }
            if (this.detail.cli.trustTermType=='2'){
              this.gdqx='永久存续';
            }
            if (this.detail.cli.trustTermType=='O'){
              //其他
              this.gdqx=this.detail.cli.trustTermOth;
            }
          }
        });

        getAction('/prj/rel/list', {prjCode: this.$route.query.prjCode,relType:'CLIENT'}).then(res=>{
          if(res.success){
            let str ='';
            res.result.records.forEach(item=>{
              str +=item.PARTY_NAME+'，'
            })
            this.clientName=str.substring(0,str.length-1)
          }
        });
      },
    }
  }
</script>

<style scoped>
  .ant-col {
    padding-left:0 !important;
  }
</style>