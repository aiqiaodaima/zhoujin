<template>
  <a-card size="small" title="子账户" :bordered="false">
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button @click="handleReload" icon="sync">刷新</a-button>
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
    >
      <span slot="action" slot-scope="text, record">
        <a @click="handleView(record.accNo)">查看</a>
        <span v-if="record.status !== 'ADTING'">
          <a-divider type="vertical"></a-divider>
          <a @click="handleEditData(record.accNo)">编辑</a>
          <a-divider type="vertical"></a-divider>
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record)">
            <a>删除</a>
          </a-popconfirm>
        </span>
      </span>
    </a-table>
    <WkfNextUserModal ref="wkfUserForm" @complete="wkfUserComplete" />
  </a-card>
</template>

<script>
import { filterDictText } from '@/components/dict/JDictSelectUtil'
import { FtsListMixin } from '@/mixins/FtsListMixin'
import { initDictOptionsBatch } from '../../components/dict/JDictSelectUtil'
import { postAction } from '../../api/manage'
import SubAccountModal from './SubAccount'
import WkfNextUserModal from '@views/activiti/modules/WkfNextUserModal'

export default {
  name: 'SubAccountList',
  mixins: [FtsListMixin],
  components: {
    SubAccountModal,
    WkfNextUserModal
  },
  inject:['psToPage'],
  data() {
    let that = this
    return {
      prjCode: '',
      queryParam: {
        prjCode: this.$route.query.prjCode,
        defaultAccYn: 'N',
      },
      dictOptionsData: [],
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
          customRender: function (text) {
            return filterDictText(that.dictOptionsData['BNF_MODE'], text)
          },
        },
        {
          title: '投资管理方式',
          align: 'center',
          dataIndex: 'imStyle',
          customRender: function (text) {
            return filterDictText(that.dictOptionsData['IM_STYLE'], text)
          },
        },
        {
          title: '投资指令人',
          align: 'center',
          dataIndex: 'imSubStyle',
          customRender: function (text) {
            return filterDictText(that.dictOptionsData['IM_SUB_STYLE'], text)
          },
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          customRender: function (text) {
            return filterDictText(that.dictOptionsData['AUDIT_STATUS'], text||'NA')
          }
        },
        // {
        //   title: '是否收费',
        //   align: 'center',
        //   dataIndex: 'feeYn',
        //   customRender: function (text) {
        //     return filterDictText(that.dictOptionsData['y_n'], text)
        //   },
        // },
        // {
        //   title: '是否估值',
        //   align: 'center',
        //   dataIndex: 'voaYn',
        //   customRender: function (text) {
        //     return filterDictText(that.dictOptionsData['y_n'], text)
        //   },
        // },
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
      url: {
        list: '/subacc/list',
        del: '/subacc/del',
      },
    }
  },
  created() {
    this.prjCode = this.$route.query.prjCode
  },
  mounted() {},
  methods: {
    handleReload(){
      this.loadData();
    },
    wkfUserComplete(){},
    initDictConfig() {
      let that = this
      that.loading = true
      initDictOptionsBatch('y_n,BNF_MODE,IM_STYLE,IM_SUB_STYLE,AUDIT_STATUS').then((res) => {
        if (res.success) {
          that.dictOptionsData = res.result
        }
      })
    },
    handleView:function(accNo) {
      this.psToPage('prj/SubAccount', { optType: 'VIEW', prjCode: this.prjCode, accNo: accNo });
      /*this.$router.push({
        path: '/prj/setup/subacc/info',
        query: { optType: 'VIEW', prjCode: this.prjCode, accNo: record.accNo },
      })*/
      this.$store.dispatch('project_cpc', 0)
    },
    handleEditData: function (accNo) {
      this.psToPage('prj/SubAccount', { optType: 'EDIT', prjCode: this.prjCode, accNo: accNo });
    },
    handleAdd: function () {
      this.psToPage('prj/SubAccount', { optType: 'ADD', prjCode: this.prjCode });
    },
    handleDelete(record) {
      console.log(record)
      const param = {
        prjCode: record.prjCode,
        accNo: record.accNo,
      }
      console.log('参数', param)
      let that = this
      // let p={cppm:{partyCode:record.PARTY_CODE,relTypeCode:that.comParam.relType}};
      that.loading = true
      postAction('/subacc/remove', param)
        .then((res) => {
          console.log(res);
          if (res.success) {
            //发起审核 审核单选择审核人
            if (res.result.processId) {
              this.$refs.wkfUserForm.edit(res.result.processId)
              this.$refs.wkfUserForm.disableSubmit = false
            }
            // that.$message.success('删除成功')
            that.loadData()
          } else {
            // that.$message.error(res.message)
          }
        })
        .finally(() => {
          that.loading = false
        })
    },
    modalFormOk() {},
  },
}
</script>

<style scoped>
@import '~@assets/less/common.less';
</style>