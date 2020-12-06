<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form-model layout="inline">
        <a-row :gutter="16">
          <BiCol>
            <BiFormItemInput label="策略名称" placeholder="请输入策略名称" v-model="queryParam.assetComName" @pressEnter="enterKeySearch"/>
          </BiCol>
          <BiCol>
            <BiRangeDatePicker label="维护日期" :dateEnd="queryParam.searchEndDt" :dateStart="queryParam.searchStartDt" @change="changeDate"  />
          </BiCol>
          <BiCol>
            <BiFormItemInput label="维护人员" placeholder="请输入维护人员" v-model="queryParam.modifyName" @pressEnter="enterKeySearch"/>
          </BiCol>
          <BiCol>
            <BiTableSearchBtns @searchReset='searchReset' @searchQuery='searchQuery' :isAdvanced='false'/>
          </BiCol>
        </a-row>
      </a-form-model>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="copyNew">复制新增</a-button>
      <a-button type="primary" icon="plus" @click="()=>$router.push({name:'assetTacticNew',query:{title:'新增资产管理策略'}})">新增</a-button>
    </div>
    <a-table
        class="table-min-height"
        ref="table"
        bordered
        size="middle"
        :scroll="{ x: 1500 }"
        rowKey="assetcomCode"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">
        <template slot="action" slot-scope="text, record">
          <div class="editable-row-operations">
            <span>
              <a  @click="investLimit">投资限制</a>
              <a-divider type="vertical" />
              <a  @click="() => $router.push({name: 'assetTacticNew',query:{assetcomCode:record.assetcomCode,title:'编辑资产管理策略'}})">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm
                title="确认删除吗?"
                @confirm="()=>handleDelete({assetcomCode:record.assetcomCode})"
              >
                <a href="#">删除</a>
              </a-popconfirm>
            </span>
          </div>
        </template> 
      </a-table>
  </a-card>
</template>

<script>
  import biTableMixin from '@mixins/biTableMixin'
  import dictMixin from '@mixins/dictMixin'

  export default {
    name: "assetTacticList",
    components: {
    },
    mixins: [biTableMixin,dictMixin],
    data () {
      return {
        // 表头
        columns: [
          {
            title: '策略名称',
            width: 150,
            dataIndex: 'assetcomName',
          },
          
          {
            title: '现金及货币市场类',
            width: 200,
            children: [
            {
              title: '配置比重%',
              dataIndex: 'moneyPerct',
              key: 'moneyPerct',
              width: 100,
            },
            {
              title: '警示下限%',
              dataIndex: 'moneyPerctMin',
              key: 'moneyPerctMin',
              width: 100,
            },
            {
              title: '警示上限%',
              dataIndex: 'moneyPerctMax',
              key: 'moneyPerctMax',
              width: 100,
            },
            ]
          },
          {
            title: '债权及固定收益类',
            width: 200,
            children: [
            {
              title: '配置比重%',
              dataIndex: 'bondPerct',
              key: 'bondPerct',
              width: 100,
            },
            {
              title: '警示下限%',
              dataIndex: 'bondPerctMin',
              key: 'bondPerctMin',
              width: 100,
            },
            {
              title: '警示上限%',
              dataIndex: 'bondPerctMax',
              key: 'bondPerctMax',
              width: 100,
            },
            ]
          },
          {
            title: '权益类',
            width: 200,
            children: [
            {
              title: '配置比重%',
              dataIndex: 'stockPerct',
              key: 'stockPerct',
              width: 100,
            },
            {
              title: '警示下限%',
              dataIndex: 'stockPerctMin',
              key: 'stockPerctMin',
              width: 100,
            },
            {
              title: '警示上限%',
              dataIndex: 'stockPerctMax',
              key: 'stockPerctMax',
              width: 100,
            },
            ]
          },
          {
            title: '另类',
            width: 200,
            children: [
            {
              title: '配置比重%',
              dataIndex: 'otherPerct',
              key: 'otherPerct',
              width: 100,
            },
            {
              title: '警示下限%',
              dataIndex: 'otherPerctMin',
              key: 'otherPerctMin',
              width: 100,
            },
            {
              title: '警示上限%',
              dataIndex: 'otherPerctMax',
              key: 'otherPerctMax',
              width: 100,
            },
            ]
          },
          {
            title: '维护日期',
            dataIndex: 'modifyDt',
            width: 150,
          },
          {
            title: '维护人员',
            dataIndex: 'modifyBy',
            width: 100,
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: 180,
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/proAssetCombinations/list",
          delete: "/proAssetCombinations/delete",
          deleteBatch: "/proAssetCombinations/deleteBatch",
        },
      }
    },
    methods: {
      investLimit() {
        this.$message.warning('此功能待开发')
      },
      copyNew () {
        if(this.selectionRows.length !==  1){
          this.$message.warning('请选择一个复制策略')
          return
        }
      this.$router.push({name:'assetTacticNew',query:{copyNew:true,assetcomCode:this.selectionRows[0].assetcomCode,title:'复制新增资产管理策略'}})
      },
      changeDate (val) {
        this.$set(this.queryParam,'searchStartDt',val[0]|| '')
        this.$set(this.queryParam,'searchEndDt',val[1]|| '')
      },
      initDictConfig () {
        let promises = [
          this.getDict('CAP_IN_EXP,CAP_STATUS,CUR_CODE')
        ]
        Promise.all(promises).then(()=>{
          this.loadData()
        })
      }
    },
    watch: {

    },
    created () {
      this.initDictConfig()
    }
  }
</script>

<style scoped>
  
</style>