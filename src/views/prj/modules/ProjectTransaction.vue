<template>
  <div>
  <a-card size="small" title="查询条件" :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form-model layout="inline">
          <a-row :gutter="24">
            <a-col :span="8">
              <BiFormItemInput label="资产名称" v-model="queryParam.proName"  placeholder="请输入资产名称"/>
            </a-col>
            <a-col :span="8">
              <span>交易类型：</span>
              <a-select
                mode="multiple"
                placeholder="请选择"
                style="width: 270px"
                :options="dicts.TRANSACTION_TYPE"
                v-model="queryParam.trustTypeList"
                name="dayList"
              >
              </a-select>
            </a-col>
            <a-col :span="8">
              <span style="margin-left: 2px">交易状态：</span>
              <a-select
                mode="multiple"
                placeholder="请选择"
                style="width: 270px"
                :options="dicts.orderStatus"
                v-model="queryParam.trustStatuList"
                name="dayList"
              >
              </a-select>
            </a-col>

          </a-row>
            <template v-if="advanced">
              <a-row :gutter="24" style="margin-top: 25px">
                <a-col :span="10">
                  <BiRangeDatePicker  label="成交日" :dateEnd="queryParam.trustDtEnd" :dateStart="queryParam.trustDtStart" @change="changeTrustDate"  />
                </a-col>
                <a-col :span="12">
                  <BiRangeDatePicker  label="划款日/到账日" :dateEnd="queryParam.receiptDtEnd" :dateStart="queryParam.receiptDtStart" @change="changeReceiptDate"  />
                </a-col>
              </a-row>
            </template>
            <BiCol>
              <BiTableSearchBtns @searchReset='searchReset' @searchQuery='searchQuery' v-model='advanced'/>
            </BiCol>

      </a-form-model>
    </div>
  </a-card>
  <div style="background:rgb(240,242,245);">
      <a-form-model>
            <a-card size="small" title="交易明细" :bordered="false">
              <a-table
                :scroll="{ x: 4000,y: 400 }"
                ref="table"
                bordered
                size="small"
                rowKey="id"
                :columns="columns"
                :dataSource="dataSource1"
                :pagination="ipagination1"
                :loading="loading"
                @change="handleTableChange1"
              >
              </a-table>
            </a-card>
      </a-form-model>
  </div>
  </div>
</template>

<script>
  import dictMixin from '@mixins/dictMixin'
  import biTableMixin from '@mixins/biTableMixin'
  import { filterObj } from '@/utils/util';
  import {getAction, postAction, deleteActionByPostMethod} from '@/api/manage'
  import { initDictOptionsBatch,filterDictText } from '../../../components/dict/JDictSelectUtil'
  export default {
    name: 'ProjectTransaction',
    components: {
    },
    mixins:[biTableMixin,dictMixin],
    computed:{
    },
    watch:{
    },
    data () {
      let that =this
      return {
        dictOptionsData:[],
        // 高级搜索 展开/关闭
        advanced: false,
        queryParam:{
          prjCode:this.$route.query.prjCode,
        },
        dataSource1:[],
        ipagination1:{
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        /* table加载状态 */
        loading:false,
        /* table选中keys*/
        selectedRowKeys: [],
        /* table选中records*/
        selectionRows: [],
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
          /*{
            title: '交易大类',
            align: 'center',
            dataIndex: 'accName',
          },*/
          {
            title: '交易类型',
            align: 'center',
            dataIndex: 'trantype_code',
            customRender: function (t) {
              if (t==null || t==''){
                return '--'
              } else {
                return that.fdText('TRANSACTION_TYPE',t)
              }
            }
          },
          {
            title: '交易细类',
            align: 'center',
            dataIndex: 'tran_subtype_code',
            customRender: function (t,r) {
                if (t==null || t==''){
                  return '--'
                } else if (r.trantype_code=='LOA03') {
                  return that.fdText('FEE_NAMES_MSG',t)
                }else {
                  return that.fdText('TRX_SUB_TYPES',t)
                }
            }
          },
          {
            title: '子账户名称',
            align: 'center',
            width:200,
            dataIndex: 'ACC_NAME',
            customRender: function (t) {
              if (t==null || t==''){
                return '--'
              } else {
                return t
              }
            }
          },
          {
            title: '产品名称',
            align: 'center',
            dataIndex: 'PRO_NAME',
            customRender: function (t) {
              if (t==null || t==''){
                return '--'
              } else {
                return t
              }
            }
          },
          {
            title: '产品代码',
            align: 'center',
            dataIndex: 'BANK_PRO_CODE',
            customRender: function (t) {
              if (t==null || t==''){
                return '--'
              } else {
                return t
              }
            }
          },
          {
            title: '交易编号',
            align: 'center',
            width:250,
            dataIndex: 'odr_code',
            customRender: function (t) {
              if (t==null || t==''){
                return '--'
              } else {
                return t
              }
            }
          },
          {
            title: '收益率类型',
            align: 'center',
            dataIndex: 'INCOME_TYPE',
            customRender: function (t) {
              if (t==null || t==''){
                return '--'
              } else {
                return that.fdText('INCOME_TYPE',t)
              }

            }
          },
          {
            title: '预期收益率(%)',
            align: 'center',
            dataIndex: 'EXP_RETURN_RATE',
            customRender: function (t,r) {
              if (t==null || t==''){
                return '--'
              } else {
                return r.EXP_RETURN_RATE.toFixed(2)
              }
            }
          },
          {
            title: '币别',
            align: 'center',
            dataIndex: 'tran_cur_code',
            customRender: function (t) {
              if (t==null || t==''){
                return '--'
              } else {
                return that.fdText('CUR_CODE',t)
              }

            }
          },
          /*{
            title: '交易金额',
            align: 'center',
            dataIndex: 'tran_amt',
          },
          {
            title: '交易份额',
            align: 'center',
            dataIndex: 'tran_unit',
          },
          {
            title: '申请交易日期',
            align: 'center',
            dataIndex: 'tran_dt',
          },*/
          {
            title: '付款日/到账日',
            align: 'center',
            dataIndex: 'pay_dt',
            customRender: function (t,r) {
              if (t==null || t==''){
                return '--'
              } else {
                return r.pay_dt.substring(0,10);
              }
            }
          },
          {
            title: '产品购买合同号',
            align: 'center',
            dataIndex: 'ref_contract_no',
            customRender: function (t) {
              if (t==null || t==''){
                return '--'
              } else {
                return t
              }
            }
          },
          {
            title: '成交金额',
            align: 'center',
            dataIndex: 'tran_amt',
            customRender: function (t,r) {
              if (t==null || t==''){
                return '--'
              } else {
                return r.tran_amt.toFixed(2)
              }
            }
          },
          {
            title: '成交份额',
            align: 'center',
            dataIndex: 'tran_unit',
            customRender: function (t,r) {
              if (t==null || t==''){
                return '--'
              } else {
                return r.tran_unit.toFixed(2)
              }
            }
          },
          {
            title: '成交单位净值',
            align: 'center',
            dataIndex: 'tran_price',
            customRender: function (t,r) {
              if (t==null || t==''){
                return '--'
              } else {
                return r.tran_price.toFixed(4)
              }
            }
          },
          {
            title: '净值日期',
            align: 'center',
            dataIndex: 'price_dt',
            customRender: function (t,r) {
              if (t==null || t==''){
                return '--'
              } else {
                return r.price_dt.substring(0,10);
              }
            }
          },
          {
            title: '成交日',
            align: 'center',
            dataIndex: 'deal_dt',
            customRender: function (t,r) {
              if (t==null || t==''){
                return '--'
              } else {
                return r.deal_dt.substring(0,10);
              }
            }
          },
          {
            title: '起息日',
            align: 'center',
            dataIndex: 'dividend_start_dt',
            customRender: function (t,r) {
              if (t==null || t==''){
                return '--'
              } else {
                return r.dividend_start_dt.substring(0,10);
              }
            }
          },
          {
            title: '到期日',
            align: 'center',
            dataIndex: 'dividend_end_dt',
            customRender: function (t,r) {
              if (t==null || t==''){
                return '--'
              } else {
                return r.dividend_end_dt.substring(0,10);
              }
            }
          },

          {
            title: '算头算尾规则',
            align: 'center',
            dataIndex: 'HEAD_AND_TAIL_PROCESSING',
            customRender: function (t) {
              if (t==null || t==''){
                return '--'
              } else {
                return that.fdText('ENDDAY_CAL_TYPE',t)
              }

            }
          },
         {
            title: '退款金额',
            align: 'center',
            dataIndex: 'REFUND_AMT',
             customRender: function (t,r) {
              if (t==null || t==''){
                return '--'
              } else {
                return r.REFUND_AMT.toFixed(2)
              }
            }
          },
          {
            title: '退款日期',
            align: 'center',
            dataIndex: 'REFUND_DT',
            customRender: function (t,r) {
              if (t==null || t==''){
                return '--'
              } else {
                return r.REFUND_DT.substring(0,10);
              }
            }
          },
          {
            title: '分配核算日',
            align: 'center',
            dataIndex: 'voaDt',
            customRender: function (t,r) {
              if (t==null || t==''){
                return '--'
              } else {
                return r.voaDt.substring(0,10);
              }
            }
          },
          {
            title: '转让协议编号',
            align: 'center',
            dataIndex: 'TRX_CONTRACT_NO',
            customRender: function (t) {
              if (t==null || t==''){
                return '--'
              } else {
                return t
              }
            }
          },
          {
            title: '对方名称',
            align: 'center',
            dataIndex: 'OBJ_NAME',
            customRender: function (t) {
              if (t==null || t==''){
                return '--'
              } else {
                return t
              }
            }
          },
          {
            title: '转让日前的收益同步转让',
            align: 'center',
            width:250,
            dataIndex: 'PREPROFIT_YN',
            customRender: function (t) {
              if (t==null || t==''){
                return '--'
              } else {
                return that.fdText('y_n',t)
              }
            }
          },
          {
            title: '实际转让价款',
            align: 'center',
            dataIndex: 'PAY_AMT',
            customRender: function (t,r) {
              if (t==null || t==''){
                return '--'
              } else {
                return r.PAY_AMT.toFixed(2)
              }
            }
          },
          /*       {
                  title: '收支金额',
                  align: 'center',
                  dataIndex: 'voaYn',
                },
                {
                  title: '增减信托份额',
                  align: 'center',
                  dataIndex: 'voaYn',
                },
                {
                  title: '信托本金增减',
                  align: 'center',
                  dataIndex: 'voaYn',
                },*/
          {
            title: '交易状态',
            align: 'center',
            dataIndex: 'status',
            customRender: function (t) {
              if (t==null || t==''){
                return '--'
              } else {
                return that.fdText('orderStatus',t)
              }

            }
          },
          {
            title: '投资决策人',
            align: 'center',
            dataIndex: 'deci_maker',
            customRender: function (t) {
              if (t==null || t==''){
                return '--'
              } else {
                return t
              }
            }
          },
          {
            title: '创建人',
            align: 'center',
            dataIndex: 'create_by',
            customRender: function (t) {
              if (t==null || t==''){
                return '--'
              } else {
                return t
              }
            }
          },
          {
            title: '创建时间',
            align: 'center',
            width:200,
            dataIndex: 'create_dt',
            customRender: function (t) {
              if (t==null || t==''){
                return '--'
              } else {
                return t
              }
            }
          },
        ],
        url:{
          list:'/prj/findTransactionList',
        },
      }
    },
    created () {
      this.initDictConfig()
      this.loadTransList();
    },
    mounted () {
    },
    methods:{
      handleTableChange1(pagination, filters, sorter) {
        //分页、排序、筛选变化时触发
        //TODO 筛选
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field;
          this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
        }
        this.ipagination1 = pagination;
        this.loadTransList();
      },
      searchQuery() {
        this.loadTransList(1);
      },

      // 重置
      searchReset() {
        this.queryParam = {
          prjCode:this.$route.query.prjCode
        }
        this.loadTransList(1);
      },
      loadTransList(arg) {
        if(!this.url.list){
          this.$message.error("请设置url.list属性!")
          return
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination1.current = 1;
        }
        var params = this.getQueryParams();//查询条件
        this.loading = true;
        getAction(this.url.list, params).then((res) => {
          if (res.success && res.result) {
            this.dataSource1 = res.result.records;
            this.ipagination1.total = res.result.total;
          }
          if(res.code===510){
            this.$message.warning(res.message)
          }
        })
        this.loading = false;
      },
      getQueryParams() {
        //获取查询条件
        let sqp = {}
        if(this.superQueryParams){
          sqp['superQueryParams']=encodeURI(this.superQueryParams)
        }
        var param = Object.assign(sqp, this.queryParam, this.isorter ,this.filters);
        //数组转为字符串
        if (this.queryParam.trustTypeList !=null && this.queryParam.trustTypeList!=''){
          param.trustTypeList=this.queryParam.trustTypeList.join(',')
        }
        if (this.queryParam.trustStatuList !=null && this.queryParam.trustStatuList!=''){
          param.trustStatuList=this.queryParam.trustStatuList.join(',')
        }
        param.pageNo = this.ipagination1.current;
        param.pageSize = this.ipagination1.pageSize;
        return filterObj(param);
      },
      fdText(o,v){
        return filterDictText(this.dictOptionsData[o],v);
      },
      initDictConfig() {
        this.getDict('TRANSACTION_TYPE,orderStatus')
        let that = this;
        initDictOptionsBatch("TRANSACTION_TYPE,FEE_NAMES_MSG,orderStatus,TRX_SUB_TYPES,INCOME_TYPE,CUR_CODE,ENDDAY_CAL_TYPE,y_n").then((res) => {
          if (res.success) {
            that.dictOptionsData = res.result;
          }
        });
      },

      changeTrustDate (val) {
        this.$set(this.queryParam,'trustDtStart',val[0]|| '')
        this.$set(this.queryParam,'trustDtEnd',val[1]|| '')
      },
    changeReceiptDate (val) {
      this.$set(this.queryParam,'receiptDtStart',val[0]|| '')
      this.$set(this.queryParam,'receiptDtEnd',val[1]|| '')
    },
    }
  }
</script>

<style scoped>
  .ant-col {
    padding-left:0 !important;
  }
</style>