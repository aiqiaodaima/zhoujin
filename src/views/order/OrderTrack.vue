<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form-model layout="inline">
        <a-row :gutter="16">
          <BiCol>
            <BiFormItemInput label="订单编号" v-model="queryParam.batchId" @pressEnter="enterKeySearch" placeholder="请输入订单编号"/>
          </BiCol>
          <BiCol>
            <BiFormItemInput label="资产名称" v-model="queryParam.proName" @pressEnter="enterKeySearch" placeholder="请输入资产名称"/>
          </BiCol>
          <template v-if="advanced">
            <BiCol>
              <BiFormItemInput label="订单总金额" v-model="queryParam.payAmt" @pressEnter="enterKeySearch" placeholder="请输入订单总金额"/>
            </BiCol>
            <BiCol>
              <BiFormItemSelect :options="dicts.TRANSACTION_TYPE" label="交易类型" v-model="queryParam.trantypeCode" showSearch/>
            </BiCol>
            <BiCol>
              <BiFormItemSelect :options="dicts.DECI_MAKER_TYPE" label="投资决策人" v-model="queryParam.deciMakerType" />
            </BiCol>
            <BiCol>
              <BiFormItemSelect :options="dicts.orderStatus" label="跟踪状态" v-model="queryParam.status" />
            </BiCol>
          </template>
          <BiCol>
            <BiTableSearchBtns @searchReset='searchResetSelf' @searchQuery='searchQuerySelf' v-model='advanced'/>
          </BiCol>
        </a-row>
      </a-form-model>
    </div>
    <div class="table-operator">
      <a-button type="primary" icon="download" @click="handleExportXls(`订单导出${new Date().toLocaleDateString().split('/')}`)">导出</a-button>
      <!-- <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
          <a-button type="primary" icon="import">导入</a-button>
      </a-upload> -->
      <a-popconfirm
          title="确认删除吗?"
          @confirm="()=>del()"
        >
          <a-button v-if='selectedRowKeys.length' type="primary" icon="delete">删除</a-button>
      </a-popconfirm>
    </div>
    <div class="card-change">
      <a-tabs type="card" size="large" @change="changeCard" v-model="currentTab">
        <a-tab-pane key="all" :tab="`全部 ${countAll}`">
        </a-tab-pane>
        <a-tab-pane key="toBeSubmitted" :tab="`待提交${toBeSubmitted}`">
        </a-tab-pane>
        <a-tab-pane key="inReview" :tab="`审核中${inReview}`">
        </a-tab-pane>
        <a-tab-pane key="unfinish" :tab="`未完成${unfinishCount}`">
        </a-tab-pane>
        <a-tab-pane key="finish" :tab="`已完成${finishCount}`">
        </a-tab-pane>
      </a-tabs>
      <a-table class="table-min-height"
        bordered
        ref="table"
        size="small"
        :scroll="{ x: 1650,y:400 }"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChangeSelf">
        <template slot="action" slot-scope="text, record">
          <div class="editable-row-operations" v-has="'order:oprate'">
            <span>
              <a  @click="oprate(record.batchId,record.trantypeCode,record.tranSubtypeCode)">操作</a>
              <a-divider type="vertical" />
              <a-popconfirm
                title="确认删除吗?"
                @confirm="()=>del(record)"
              >
                <a href="#">删除</a>
              </a-popconfirm>
            </span>
          </div>
        </template>
      </a-table>
    </div>
  </a-card>
</template>

<script>
  import biTableMixin from '@mixins/biTableMixin'
  import { matchTrxCapitalFlows,deleteOrder } from '@/api/BiApi'
  import dictMixin from '@mixins/dictMixin'
  import { deleteAction, getAction,downFile } from '@/api/manage'
  import { formatAmt } from '@utils/util'
  export default {
    name: "OrderTrack",
    components: {
    },
    mixins:[biTableMixin,dictMixin],
    data () {
      return {
        // 高级搜索 展开/关闭
        advanced: false,
        // 表头
        columns: [
          {
            title: '订单编号',
            dataIndex: 'batchId',
            width: 180
          },
          {
            title: '交易类型',
            width: 130,
            dataIndex: 'trantypeCode',
            customRender: (text) => this.getDictNameByCode(this.dicts.TRANSACTION_TYPE,text)
          },
          {
            title: '投资决策人',
            dataIndex: 'deciMakerType',
            width: 100,
            customRender: (text) => this.getDictNameByCode(this.dicts.DECI_MAKER_TYPE,text)
          },
          {
            title: '交易对手',
            dataIndex: 'proName',
            width: 200,
          },
          {
            title: '订单总金额',
            dataIndex: 'payAmt',
            width: 150,
            customRender: (text) =>{ return text ? formatAmt(text,2) : ''}
          },
          {
            title: '订单总份额',
            dataIndex: 'tranUnit',
            width: 150,
            customRender: (text,r) => {
              if ((r.trantypeCode=='INV13'||r.trantypeCode=='INV14') && r.isJointStock=='Y'){
                  return text ? formatAmt(text,2)+'%' : ''
              } else {
                return text ? formatAmt(text,2) : ''
              }
            }
          },
          {
            title: '订单状态',
            dataIndex: 'status',
            width: 100,
            customRender: (text) => this.getDictNameByCode(this.dicts.orderStatus,text)
          },
          {
            title: '申请交易日期',
            dataIndex: 'payDt',
            width: 150,
          },
          {
            title: '创建人',
            dataIndex: 'createBy',
            width: 100,
          },
          {
            title: '创建时间',
            dataIndex: 'createDt',
            width: 200,
          },
          {
            title: '操作',
            dataIndex: 'action',
            width:100,
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/orders/common/orderTracking",
          delete: "/orders/common/delete",
          deleteBatch: "/orders/common/delete",
          exportXlsUrl: "orders/common/exportXls",
          importExcelUrl: "baseline/trxCapitalFlows/importExcel",
        },
        disableMixinCreated: true,
        currentTab:'all',
        countAll: 0,
        toBeSubmitted: 0,
        inReview: 0,
        unfinishCount: 0,
        finishCount: 0,
      }
    },
    methods: {
      async del(order){
        let ids = []
        // 单条删除
        if(order){
          if(order.status=='80' || order.status=='15' || order.status=='55'|| order.status=='5'){
            ids = [order.id]
          } else {
            this.$message.warning('只有交易取消、交易失败、待提交、审核退回的可以删除')
            return
          }
        } else {
          const isDel = this.selectionRows.filter(item=>{return (item.status=='80' || item.status=='15' || item.status=='55' || item.status=='5') })
          if(isDel.length !== this.selectedRowKeys.length){
            this.$message.warning('只有交易取消、交易失败、待提交、审核退回的可以删除')
            return
          } else {
            ids = [...this.selectedRowKeys]
          }
        }
        const { success } = await deleteOrder({ids:ids})
        if(success){
          this.$message.success('删除成功');
          this.loadDataSelf();
          this.onClearSelected();
        }
      },
      changeCard (key) {
        this.queryParam.currentTab = key
        this.loadDataSelf(1);
      },
      toggleAdvanced () {
        this.advanced = !this.advanced
      },
      oprate ( batchId,trantypeCode,tranSubtypeCode ) {
        const trantypeCodes = {
          "INV01": '/order/createOrder', // 认购
          "INV02": '/order/createSubscribe', // 追加申购
          "INV06": '/order/createRedeem',// 赎回
          "INV09": '/order/incomeDistribution', // 收益分配
          "INV15": '/order/payback',//返本
          "INV16": '/order/createInterestDistribution',//返本+收益分配
          "INV10": '/order/createBonusReInvest',// 红利再投
          "LOA03": '/order/payment',//费用支付
          "LOA04": '/order/distributeManage',//分配处理
          "LOA13": '/order/payPermium',//代缴保费
          "LOA06": '/order/asttransfer',//受益人间份额转让
          "LOA07": '/order/asttransferzy',//子账户间资产转让
          "LOA09": '/order/tAunitAdjust',//TA份额调增
          "LOA10": '/order/tAunitAdjustSub',//TA份额调减
          "LOA1401": '/order/CapitalAdjustment',//资金调帐-收入
          "LOA1402": '/order/CapitalAdjustmentOut',//资金调帐-支出
          "LOA17": '/order/OriginalDistribution',//原状分配
          "LOA20": '/order/adjustFund',//银转证
          "LOA21": '/order/adjustFundOut',//证转银
          "LOA1601": '/order/charitableaidBenf',//慈善信托-受益人直接收款
          "LOA1602": '/order/charitableaidPrjExecutor',//慈善信托-项目执行人收款
          "INV12": '/order/createBankInterestSettlement',//银行结息
          "LOA0101": '/order/prj/init',//初始委托
          "LOA0102": '/order/prj/init',//初始委托
          "LOA0103": '/order/prj/init',//初始委托
          "LOA0201": '/order/prj/addiComm',//追加委托
          "LOA0202": '/order/prj/addiComm',//追加委托
          "LOA0203": '/order/prj/addiComm',//追加委托
          "INV13":'/order/privateStockInvestment',//股权交易
          "INV14":'/order/privateFundInvestment',//合伙公司

        }
        this.$router.replace({path: trantypeCodes[trantypeCode],query:{ batchId }})
      },
      async loadDataSelf(arg) {
        if(!this.url.list){
          this.$message.error("请设置url.list属性!")
          return
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        // var params = this.getQueryParams();//查询条件
        var params = this.queryParam
        params.pageNo = this.ipagination.current;
        params.pageSize = this.ipagination.pageSize;
        this.loading = true;
        const res = await getAction(this.url.list, params)
        if (res.success) {
          const {page,countAll,toBeSubmitted,inReview,unfinishCount,finishCount } = res.result
          this.dataSource = page.records;
          this.ipagination.total = page.total;
          this.countAll = countAll
          this.toBeSubmitted = toBeSubmitted
          this.inReview = inReview
          this.unfinishCount = unfinishCount
          this.finishCount = finishCount
        }
        if(res.code===510){
          this.$message.warning(res.message)
        }
        this.loading = false;
      },
      handleTableChangeSelf(pagination, filters, sorter) {
        //分页、排序、筛选变化时触发
        //TODO 筛选
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field;
          this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
        }
        this.ipagination = pagination;
        this.loadDataSelf();
      },
      // 重置
      searchResetSelf() {
        this.queryParam = {}
        this.loadDataSelf(1);
      },
      // 搜索
      searchQuerySelf() {
        this.loadDataSelf(1);
      },
      // enter键搜索
      enterKeySearch(e) {
        if (e.keyCode == 13) {
          this.searchQuerySelf()
        }
      },
      initDictConfig () {
        let promises = [this.getProAssetcats(),
          this.getDict('orderStatus,DECI_MAKER_TYPE,TRANSACTION_TYPE,CAP_STATUS')
        ]
        Promise.all(promises).then(()=>{
          this.loadDataSelf()
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

<style lang="stylus" scoped>
  .card-change >>> .ant-tabs-bar {
      border-bottom: 0px solid #e8e8e8 !important ;
  }

</style>