<template>
  <a-card size="small" title="分配方案" :bordered="false">
    <div class="table-operator">
      <a-button @click="handleView('add',{ID:''})" type="primary" icon="plus">新增</a-button>
    </div>
    <a-table
      ref="table"
      bordered
      size="small"
      rowKey="id"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      @change="handleTableChange"
      :scroll="{ x: 1500, y: 300 }">
        <span slot="action" slot-scope="text, record">
          <a @click="handleView('view_v',record)">查看</a>
          <a-divider type="vertical"></a-divider>
          <a @click="handleView('edite',record)">编辑</a>
          <a-divider type="vertical"></a-divider>
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record)">
            <a>删除</a>
          </a-popconfirm>
        </span>
    </a-table>
    <distplan-modal ref="modalForm" @ok="modalFormOk" @close="close" :optType='type' :id='id'></distplan-modal>
  </a-card>
</template>

<script>
  import { FtsListMixin } from '../../mixins/FtsListMixin'
  import { initDictOptionsBatch } from '../../components/dict/JDictSelectUtil'
  import { postAction } from '../../api/manage'
  import { filterDictText } from '@/components/dict/JDictSelectUtil'
  import DistplanModal from './modules/DistplanModal'

  export default {
    name: '',
    mixins: [FtsListMixin],
    components: {
      DistplanModal
      //components here
    },
    data() {
      let that = this
      return {
        queryParam: {
          prjCode: this.$route.query.prjCode
        },
        dictOptionsData: [],
        columns: [
          {
            title: 'id',
            align: 'center',
            dataIndex: 'id',
            width: 0
          },
          {
            title: '分配名称',
            align: 'center',
            dataIndex: 'DIST_CAT_CODE',
            fixed: 'left',
            width: 100,
            customRender: function(text) {
              return filterDictText(that.dictOptionsData['TRX_SUB_TYPES'], text)
            }
          },
          {
            title: '分配细类',
            align: 'center',
            dataIndex: 'DIST_TYPE_CODE',
            fixed: 'left',
            width: 100,
            customRender: function(text) {
              return filterDictText(that.dictOptionsData['DIST_TYPE'], text)
            }
          },
          {
            title: '受益人',
            align: 'center',
            width: 100,
            dataIndex: 'PARTY_NAME',
            fixed: 'left'
          }, {
            title: '起始日',
            align: 'center',
            dataIndex: 'REGUL_START_DT',
            customRender: function(text) {
              if (text !== '' && text !== null) {
                return text.substring(0, 10)
              }
            }
          }, {
            title: '结束日',
            align: 'center',
            dataIndex: 'REGUL_END_DT',
            customRender: function(text) {
              if (text !== '' && text !== null) {
                return text.substring(0, 10)
              }
            }
          }, {
            title: '金额/比例分配',
            align: 'center',
            dataIndex: 'AMT_TYPE',
            customRender: function(text) {
              return filterDictText(that.dictOptionsData['AMT_TYPE'], text)
            }
          }, {
            title: '分配金额/比例',
            align: 'center',
            dataIndex: 'DIST_AMT',
            customRender: function(text,record) {
              if (record.AMT_TYPE==='A'){
                return record.DIST_AMT
              }else{
                return record.amt_distribution_ratio
              }
            }
          }, {
            title: '分配财产来源',
            align: 'center',
            dataIndex: 'AMT_RANGE_TYPE',
            customRender: function(text) {
              return filterDictText(that.dictOptionsData['AMT_SOURCE_TYPE'], text)
            }
          }, {
            title: '分配日',
            align: 'center',
            dataIndex: 'DAY_TYPE',
            customRender: function(text) {
              return filterDictText(that.dictOptionsData['RPT_YEAR'], text)
            }
          }, {
            title: '每次分配金额限制',
            align: 'center',
            dataIndex: 'EVERY_DIS_LMT_TYPE',
            customRender: function(text) {
              return filterDictText(that.dictOptionsData['EVERY_DIS_LMT_TYPE'], text)
            }
          }, {
            title: '累计分配金额限制',
            align: 'center',
            dataIndex: 'ALL_DIS_LMT_TYPE',
            customRender: function(text) {
              return filterDictText(that.dictOptionsData['ALL_DIS_LMT_TYPE'], text)
            }
          }, {
            title: '分配次数限制',
            align: 'center',
            dataIndex: 'DIS_TIMES_LMT_TYPE',
            customRender: function(text) {
              return filterDictText(that.dictOptionsData['DIS_TIMES_LMT_TYPE'], text)
            }
          },
          {
            title: '审核状态',
            align: 'center',
            dataIndex: 'STATUS',
            customRender: function(text) {
              return filterDictText(that.dictOptionsData['REPORT_STATUS'], text)
            }
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            width: 110,
            fixed: 'right',
            scopedSlots: {
              customRender: 'action'
            }
          }],
        url: {
          list: '/prj/displan/list',
          del: '/prj/displan/delete'
        },
        type: 'add',
        id: '',
      }
    },
    created() {
      //created here
    },
    mounted() {
      //mounted here
    },
    methods: {
      initDictConfig() {
        let that = this
        that.loading = true
        initDictOptionsBatch('DIST_TYPE,TRX_SUB_TYPES,RPT_YEAR,DIST_NAME,AMT_RANGE_TYPE,AMT_TYPE,FEE_BASE2,TFIX_TYPE,REPORT_STATUS,DIS_TIMES_LMT_TYPE,ALL_DIS_LMT_TYPE,EVERY_DIS_LMT_TYPE,AMT_SOURCE_TYPE').then((res) => {
          if (res.success) {
            that.dictOptionsData = res.result
          }
          that.loading = false
        })
      },
      handleView(type,record) {
        const types = {
          add:  '分配方案-新增',
          edite:  '分配方案-编辑',
          view_v:  '分配方案-查看',
        }
        this.type = type
        this.id = record.ID
        this.$refs.modalForm.title = types[type];
        this.$refs.modalForm.visible = true
      },
      modalFormOk() {
        // 新增/修改 成功时，重载列表
        this.loading= true;
        this.loadData();
        this.loading= false;
      },
      close(){
        this.loadData();
      },
      handleDelete(record) {
        let that = this
        // let p = { cppm: { partyCode: record.PARTY_CODE, relTypeCode: that.comParam.relType } }
        let p = { id: record.ID, prjCode: this.queryParam.prjCode }

        that.loading = true
        postAction(that.url.del, p).then((res) => {
          if (res.success) {
            that.$message.success('删除成功')
            that.loadData()
          } else {
            that.$message.error(res.message)
          }
        }).finally(() => {
          that.loading = false
        })
      }
    }
  }
</script>

<style scoped>
  @import '~@assets/less/common.less'
</style>