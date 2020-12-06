<template>
  <div style="background:rgb(240,242,245);">
      <a-form-model>
            <a-card size="small" title="项目关系人" :bordered="false">
              <a-table
                ref="table"
                bordered
                size="small"
                rowKey="PARTY_CODE"
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
              <rel-party-modal ref="modalForm" @ok="modalFormOk" destroyOnClose></rel-party-modal>
            </a-card>
            <!--<a-card size="small" title="家族图谱" :bordered="false">

            </a-card>-->
      </a-form-model>
  </div>
</template>

<script>
  import dictMixin from '@mixins/dictMixin'
  import biTableMixin from '@mixins/biTableMixin'
  import { filterDictText, initDictOptions } from '@/components/dict/JDictSelectUtil'
  import { initDictOptionsBatch } from '../../../components/dict/JDictSelectUtil'
  import RelPartyModal from '../modules/RelPartyModal'
  export default {
    name: 'ProjectPerson',
    components: {
      RelPartyModal
    },
    mixins:[biTableMixin,dictMixin],
    computed:{
    },
    watch:{
    },
    props:{
      projectCode:'',
      mapId:''
    },
    data () {
      let that =this
      let prjCode=''
      let queryUrl=''
      if(this.projectCode||this.mapId){
        prjCode=this.projectCode
        queryUrl='/prj/rel/findComplexInfo'
        if(!this.$route.query.prjCode){
          this.$route.query.prjCode=prjCode
        }
      }else{
        prjCode=this.$route.query.prjCode
        queryUrl='/prj/rel/findPersonByPrjCode'
      }
      return {
        dictOptionsData:[],
        queryParam: {
          prjCode: prjCode,
          id: this.mapId
        },
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
            title: '关系人类型',
            align: 'center',
            dataIndex: 'REL_TYPE_CODE',
            customRender: function (t) {
                  return that.fdText('REL_TYPE',t)
                }
          },
          {
            title: '姓名/名称',
            width: '100',
            dataIndex: 'PARTY_NAME',
          },
          {
            title: '类型',
            align: 'center',
            dataIndex: 'NATURAL_YN',
            customRender: function (t) {
              return that.fdText('NATURAL_YN',t)
            }
          },
          {
            title: '证件类型',
            dataIndex: 'IDN_TYPE',
            width: '100',
            customRender: function (t, r) {
              if (r.NATURAL_YN === 'Y') {
                return that.fdText('IDNTYPES',t)
              }else {
                return that.fdText('ORGIDNTYPES',t)
              }

            }
          },
          {
            title: '证件号码',
            dataIndex: 'IDN',
            width: '150',
          },
          {
            title: '手机号码',
            dataIndex: 'CPHONE',
            width: '100',
            customRender: function (t) {
              if (t==null || t==''){
                return '--'
              } else {
                return t
              }
            }
          },
          {
            title: '座机',
            dataIndex: 'FPHONE',
            width: '100',
            customRender: function (t) {
              if (t==null || t==''){
                return '--'
              } else {
                return t
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
          list:queryUrl,
        },
      }
    },
    created () {      
      this.initDictConfig()
    },
    mounted () {
    },
    methods:{
      handleView(record){
        this.$refs.modalForm.view(record.REL_TYPE_CODE, record);
        this.$refs.modalForm.title = "查看"+this.fdText('REL_TYPE',record.REL_TYPE_CODE);
      },
      fdText(o,v){
        return filterDictText(this.dictOptionsData[o],v);
      },
      initDictConfig() {
        let that = this;
        initDictOptionsBatch("REL_TYPE,NATURAL_YN,IDNTYPES,ORGIDNTYPES").then((res) => {
          if (res.success) {
            that.dictOptionsData = res.result;
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