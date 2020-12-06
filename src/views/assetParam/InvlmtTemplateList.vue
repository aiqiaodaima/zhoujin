<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form-model layout="inline">
        <a-row :gutter="16">
          <BiCol>
            <BiFormItemInput label="模版名称" placeholder="请输入模版名称" v-model="queryParam.assetComName" @pressEnter="enterKeySearch"/>
          </BiCol>
          <BiCol>
            <BiFormItemSelect :options="dicts.RISK_CODE" label="合同系列" name="comRiskCode" v-model="queryParam.comRiskCode"/>
          </BiCol>
          <template v-if="advanced">
            <BiCol>
              <BiFormItemSelect :options="dicts.RISK_CODE" label="投资类型" name="comRiskCode" v-model="queryParam.comRiskCode"/>
            </BiCol>
            <BiCol>
              <BiFormItemInput label="策略名称" placeholder="请输入策略名称" v-model="queryParam.assetComName" @pressEnter="enterKeySearch"/>
            </BiCol>
          </template>
          <BiCol>
            <BiTableSearchBtns @searchReset='searchReset' @searchQuery='searchQuery' v-model='advanced'/>
          </BiCol>
        </a-row>
      </a-form-model>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="()=>$router.push({name:'invlmtTemplateNew'})">复制新增</a-button>
      <a-button type="primary" icon="plus" @click="()=>$router.push({name:'invlmtTemplateNew'})">新增</a-button>
    </div>
    <a-table
      ref="table"
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
            <a  @click="() => $router.push({name: 'assetDetail',query:{proCode:record.proCode}})">投资限制</a>
            <a-divider type="vertical" />
            <a  @click="() => $router.push({name: 'assetNew',query:{proCode:record.proCode}})">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm
              title="确认删除吗?"
              @confirm="()=>handleDelete({proCode:record.proCode})"
            >
              <a href="#">删除</a>
            </a-popconfirm>
            <!-- <a class="delete" @click="() => handleDelete({proCode:record.proCode})">删除</a> -->
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
    name: "InvlmtTemplateList",
    components: {
    },
    mixins: [biTableMixin,dictMixin],
    data () {
      return {
        advanced: false,
        // 表头
        columns: [
          {
            title: '策略名称',
            width: 150,
            dataIndex: 'assetComName',
          },
          {
            title: '资产类别',
            dataIndex: 'assetcatCode',
            width: 100,
            customRender: (text) => this.getDictNameByCode(this.proAssetcats,text)
          },
          {
            title: '配置比重',
            dataIndex: 'sumVal',
            width: 100,
          },
          {
            title: '警示下限',
            dataIndex: 'sumVal',
            width: 100,
          },
          {
            title: '警示上线',
            dataIndex: 'sumVal',
            width: 100,
          },
          {
            title: '维护日期',
            dataIndex: 'modifyName',
            width: 150,
          },
          {
            title: '维护人员',
            dataIndex: 'modifyName',
            width: 100,
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: 150,
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/cusInvlmtTemplate/list",
          delete: "/cusInvlmtTemplate/delete",
          deleteBatch: "/cusInvlmtTemplate/deleteBatch",
        },
      }
    },
    methods: {
      initDictConfig () {
        let promises = [
          this.getDict('RISK_CODE')
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