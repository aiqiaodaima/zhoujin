<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form-model layout="inline">
        <a-row :gutter="16">
          <a-col span="12">
            <BiFormItemInput label="银行名称" v-model="queryParam.bankName" @pressEnter="enterKeySearch" placeholder="请输入银行名称"/>
          </a-col>
          <a-col span="12">
            <BiTableSearchBtns @searchReset='searchReset' @searchQuery='searchQuery' :isAdvanced='false'/>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div>
      <a-table class="table-min-height"
        ref="table"
        size="middle"
        :scroll="{ y: 300 }"
        rowKey="bankId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,columnTitle: '#',type: 'radio'}"
        @change="handleTableChange">
      </a-table>
    </div>
  </a-card>
</template>

<script>
  import biTableMixin from '@mixins/biTableMixin'
  import { matchTrxCapitalFlows } from '@/api/BiApi'

  export default {
    name: "CusBankList",
    components: {
    },
    mixins:[biTableMixin],
    inject:['getTranOpenBran'],
    data () {
      return {
    
        // 表头
        columns: [
          {
            title: '银行名称',
            dataIndex: 'bankName',
            width: 150
          },
          {
            title: '支行大额支付号',
            width: 150,
            dataIndex: 'bankId',
          }, 
        ],
        url: {
          list: "/common/cusBankNew/list",
        },
      }
    },
    methods: {
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectionRows = selectionRows;
        this.getTranOpenBran(selectionRows)
      },
    },
    watch: {
    },
    created () {
    
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@assets/less/common.less'

</style>