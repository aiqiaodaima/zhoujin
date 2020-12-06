<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form-model layout="inline">
        <a-row :gutter="16">
          <a-col span="12">
            <BiFormItemInput label="银行名称" v-model="queryParam.itemText" @pressEnter="enterKeySearch" placeholder="请输入银行名称"/>
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
        rowKey="bankCode"
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
    name: "BankInfoWithBankCode",
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
            dataIndex: 'itemText',
            width: 150
          },
          {
            title: '银行编号',
            width: 150,
            dataIndex: 'itemValue',
          }, 
        ],
        url: {
          list: "/sys/dictItem/dictId/dictItemInfo?dictId="+'1247454280189587458',
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