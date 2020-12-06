<template>
  <a-card :bordered="false">

    <div class="table-page-search-wrapper">
      <a-form-model layout="inline">
        <a-row :gutter="16">
          <BiCol>
            <BiFormItemInput label="资产名称" placeholder="请输入资产名称" v-model="queryParam.proName" @pressEnter="enterKeySearch"/>
          </BiCol>
          <BiCol>
            <BiTableSearchBtns @searchReset='searchReset' @searchQuery='searchQuery' :isAdvanced='false'/>
          </BiCol>
        </a-row>
      </a-form-model>
    </div>
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="() => $router.push({name: 'bonusRuleNew',query:{title:'新增分红规则'}})">新增分红规则</a-button>
      <a-button type="primary" icon="delete" @click="batchDelBonusRule('ids')">删除分红规则</a-button>
    </div>
    <div>

      <a-table class="table-min-height"
               ref="table"
               size="middle"
               :scroll="{ x: 1800,y:400 }"
               :columns="columns"
               rowKey="id"
               :dataSource="dataSource1"
               :pagination="ipagination1"
               :loading="loading"
               :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
               @change="handleTableChange1">
        <template slot="operation" slot-scope="text, record">
          <div class="editable-row-operations">
            <span>
              <a  @click="() => $router.push({name: 'bonusRuleDetail',query:{id:record.id,title:'分红规则详情'}})">查看</a>
              <a-divider type="vertical" />
              <a  @click="() => $router.push({name: 'bonusRuleNew',query:{id:record.id,title:'编辑分红规则'}})">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm
                title="确认删除吗?"
                @confirm="()=>handleDelete1({ id:(+record.id)})"
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
  import { filterObj } from '@/utils/util';
  import biTableMixin from '@mixins/biTableMixin'
  import { getDict } from '@/api/BiApi'
  import dictMixin from '@mixins/dictMixin'
  import {getAction, postAction, deleteActionByPostMethod} from '@/api/manage'

  export default {
    name: "BonusRuleList",
    components: {
    },
    mixins: [dictMixin,biTableMixin],
    data () {
      return {
        queryParam:{},
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
            width: 90,
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '资产名称',
            dataIndex: 'proName',
            width: '100',
          },
          {
            title: '付息频率',
            dataIndex: 'frequency',
            width: '20',
            customRender: (text) => this.getDictNameByCode(this.dicts.PRO_INT_FREQUENCY,text)
          },
          {
            title: '分红方式',
            dataIndex: 'dividendType',
            width: '20',
            customRender: (text) => this.getDictNameByCode(this.dicts.DIVIDEND_TYPE,text)
          },
          {
            title: '计息基数',
            dataIndex: 'annDays',
            width: '20',
            customRender: (text) => this.getDictNameByCode(this.dicts.ANN_DAYS,text)
          },
          {
            title: '头尾处理',
            dataIndex: 'enddayCalType',
            width: '20',
            customRender: (text) => this.getDictNameByCode(this.dicts.ENDDAY_CAL_TYPE,text)
          },
          {
            title: '开始日',
            dataIndex: 'intStartRule',
            width: '20',
            customRender: (text) => this.getDictNameByCode(this.dicts.INT_START_RULE,text)

          },
          {
            title: '结束日',
            dataIndex: 'intEndRule',
            width: '20',
            customRender: (text) => this.getDictNameByCode(this.dicts.INT_END_RULE,text)

          },
          {
            title: '参考日历',
            dataIndex: 'calendarType',
            width: '30',
            customRender: (text) => this.getDictNameByCode(this.dicts.CALENDAR_TYPE,text)
          },
          {
            title: '遇节假日调整方式',
            dataIndex: 'holidayAdjustType',
            width: '20',
            customRender: (text) => this.getDictNameByCode(this.dicts.HOLIDAY_ADJUST_TYPE,text)

          },
          {
            title: '分红日',
            dataIndex: 'naturedayYn',
            width: '20',
            customRender: (text) => this.getDictNameByCode(this.dicts.NATUREDAY_YN,text)


          },
          {
            title: '尾数处理',
            dataIndex: 'tailMode',
            width: '20',
            customRender: (text) => this.getDictNameByCode(this.dicts.TAIL_MODE,text)

          },
          {
            title: '尾数保留位数',
            dataIndex: 'tailDigitType',
            width: '20',
            customRender: (text) => this.getDictNameByCode(this.dicts.TAIL_DIGIT_TYPE,text)
          },
          {
            title: '操作',
            width: '30',
            fixed: 'right',
            scopedSlots: { customRender: 'operation' }
          }
        ],
        url: {
          list: '/proIntParam/list',
          delete: '/proIntParam/delete',
          deleteBatch: '/proIntParam/deleteBatch',
        },

      }
    },
    methods: {
      searchQuery() {
        this.loadBonData(1);
      },

      // 重置
      searchReset() {
        this.queryParam = {}
        this.loadBonData(1);
      },
      loadBonData(arg) {
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
        param.removeYn='N';
        param.pageNo = this.ipagination1.current;
        param.pageSize = this.ipagination1.pageSize;
        return filterObj(param);
      },

      handleTableChange1(pagination, filters, sorter) {
        //分页、排序、筛选变化时触发
        //TODO 筛选
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field;
          this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
        }
        this.ipagination1 = pagination;
        this.loadBonData();
      },
      async handleDelete1(param) {
        const res = await deleteActionByPostMethod(this.url.delete, param)
        if (res.success) {
          this.$message.success('删除成功');
          this.loadBonData();
        } else {
          this.$message.warning(res.message);
        }
      },
      initDict() {
        this.getDict('ENDDAY_CAL_TYPE,NATUREDAY_YN,PRO_INT_FREQUENCY,ANN_DAYS,INT_START_RULE,INT_END_RULE,HOLIDAY_ADJUST_TYPE,TAIL_MODE,TAIL_DIGIT_TYPE,CALENDAR_TYPE,DIVIDEND_TYPE')
      },
      batchDelBonusRule: function (key) {
        if(!this.url.deleteBatch){
          this.$message.error("请设置url.deleteBatch属性!")
          return
        }
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请至少选择一条记录！');
          return;
        }
        var ids = "";
        let param = {}
        for (var a = 0; a < this.selectedRowKeys.length; a++) {
          ids += this.selectedRowKeys[a] + ",";
        }
        key = key || 'ids'
        param[key] = ids
        var that = this;
        this.$confirm({
          title: "确认删除",
          content: "是否删除选中数据?",
          onOk: function () {
            that.loading = true;
            deleteActionByPostMethod(that.url.deleteBatch, param).then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.loadBonData();
                that.onClearSelected();
              } else {
              }
            }).finally(() => {
              that.loading = false;
            });
          }
        });
      },

    },
    created () {
      this.loadBonData()
      // 初始化字典
      this.initDict()
    }

  }
</script>

<style lang="stylus" scoped>
  @import '~@assets/less/common.less'
  #openmodal{
    .btn{
      margin-left: 8px;
    }
    .ant-form-horizontal{
      .ant-form-item {
        margin-bottom: 5px !important;
      }
    }
  }

</style>