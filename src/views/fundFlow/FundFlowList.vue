/** 
onlySearch: 仅查询
addBtn: 加入按钮
deleteBtn: 物理删除按钮
showMatched: 只展示要钩稽的
*/

<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" v-if="!showMatched">
      <a-form-model layout="inline">
        <a-row :gutter="16">
          <BiCol>
            <BiFormItemInput label="项目名称" v-model="queryParam.trustPrjName" @pressEnter="enterKeySearch" placeholder="请输入项目名称"/>
          </BiCol>
          <BiCol>
            <BiFormItemInput label="银行账号" v-model="queryParam.accNo" @pressEnter="enterKeySearch" placeholder="请输入银行账号"/>
          </BiCol>
          <template v-if="advanced">
            <BiCol>
              <BiFormItemInput label="对方账号" v-model="queryParam.tranAccNo" @pressEnter="enterKeySearch" placeholder="请输入对方账号"/>
            </BiCol>
            <BiCol>
              <BiFormItemInput label="对方户名" v-model="queryParam.inExpName" @pressEnter="enterKeySearch" placeholder="请输入对方户名"/>
            </BiCol>
            <BiCol>
              <BiRangeDatePicker  label="流水日期" :dateEnd="queryParam.flowDateEnd" :dateStart="queryParam.flowDateStart" @change="changeFlowDate"  />
            </BiCol>
            <BiCol>
              <BiFormItemSelect :options="dicts.CAP_IN_EXP" label="收支方向" v-model="queryParam.incomeExpenses" />
            </BiCol>
            <BiCol>
              <BiFormItemSelect :options="dicts.CAP_STATUS" label="流水状态" v-model="queryParam.status" />
            </BiCol>
            <BiCol>
              <BiInputRange label="金额范围" :minVal="queryParam.flowAmtMin" :maxVal="queryParam.flowAmtMax" @changeMin='changeMin' @changeMax='changeMax'/>
            </BiCol>
            <BiCol>
              <BiFormItemInput label="保管人" v-model="queryParam.bankCode" @pressEnter="enterKeySearch" placeholder="请输入保管人"/>
            </BiCol>
            <BiCol>
              <BiFormItemInput label="摘要" v-model="queryParam.memo" @pressEnter="enterKeySearch" placeholder="请输入摘要"/>
            </BiCol>

          </template>
          <BiCol>
            <BiTableSearchBtns @searchReset='searchResetSelf' @searchQuery='searchQuery' v-model='advanced'/>
          </BiCol>
        </a-row>
      </a-form-model>
    </div>

    <div class="table-operator" v-if="!onlySearch">
      <a-button type="primary" icon="plus" @click="() => $router.replace({path: '/fundFlowNew'})">新增流水</a-button>
      <a-button type="primary" icon="delete" @click="batchDel()">删除流水</a-button>
      <!-- <a-button type="primary" icon="import" @click="handleImportExcel">导入</a-button> -->
      <a-button type="primary" icon="download" @click="handleExportXls(`资金流水${new Date().toLocaleDateString().split('/')}`)">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" 
        :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel"
        accept=".xls,.xlsx"
        >
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-button type="primary">
        <a :href="`${path}资金流水.xls`" download="资金流水.xls">下载范本</a>
      </a-button>
      <a-button type="primary"  @click="matchFundFlows('B')">银行结息</a-button>
      <a-button type="primary"  @click="matchFundFlows('F')">转账手续费</a-button>
      <a-button type="primary"  @click="matchFundFlows('T')">手续费退回</a-button>
    </div>
    <div>
      <a-table
        ref="table"
        size="middle"
        :scroll="{ x: 1500,y: 400 }"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="showMatched ? false :ipagination"
        :loading="loading"
        bordered
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">
        <template slot="action" slot-scope="text,record,index">
          <div class="editable-row-operations center" >
            <span v-if="!onlySearch">
              <!-- <a @click="checkFundFlows()">钩稽</a>
              <a-divider type="vertical" /> -->
              <a  @click="() => $router.push({name: 'fundFlowNew',query:{id:record.id,trustPrjName:record.trustPrjName}})">编辑</a>
              <a-divider type="vertical" v-if="record.status === 'NEW'"/>
              <a-popconfirm v-if="record.status === 'NEW'"
                title="确认删除吗?"
                @confirm="()=>handleDelete({id:record.id})"
              >
                <a href="#">删除</a>
              </a-popconfirm>
            </span>
            <span v-if="addBtn">
              <a @click="addMatched(record)">加入</a>
            </span>
            <span v-if="deleteBtn">
              <a-popconfirm
                title="确认删除吗?"
                @confirm="()=>deleteMatched(record)"
              >
                <a href="#">删除</a>
              </a-popconfirm>
            </span>
          </div>
        </template> 
        <template  v-for="(col, i) in ['mapAmt']" :slot="col"  slot-scope="text, record, index">
          <a-input-number
            :disabled="showMatched"
            :key='col'
            :min="0"
            style="margin: -5px 0"
            placeholder="请输入"
            :value="text"
            :precision='2'
            :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value.replace(/\$\s?|(,*)/g, '')"
            @change="e => handleChange(e,col,index)"
          />
      </template>
      </a-table>
    </div>
  </a-card>
</template>

<script>
  import biTableMixin from '@mixins/biTableMixin'
  import { matchTrxCapitalFlows,findSumMapAmt } from '@/api/BiApi'
  import dictMixin from '@mixins/dictMixin'
  import { formatAmt } from '@utils/util'
  export default {
    name: "FundFlowList",
    components: {
    },
    mixins:[biTableMixin,dictMixin],
    props:{
      onlySearch: false, //仅查询
      addBtn: false, // 加入按钮
      deleteBtn: false,//物理删除按钮
      showMatched: false,//只展示要钩稽的
      tranSum:'',
      odrCode:'',
      matched: { //  加入钩稽的流水
        default: function() {
          return []
        }
      },
      fixedSearch: { // 固定要搜索的
        default: function() {
          return {}
        }
      }
    },
    data () {
      return {
        path: process.env.BASE_URL,
        // 高级搜索 展开/关闭
        advanced: false,
        // 表头
        columns: [
          {
            title: '项目名称',
            dataIndex: 'trustPrjName',
            width: 150
          },
          {
            title: '银行账号',
            width: 250,
            dataIndex: 'accNo',
          },
          {
            title: '保管人',
            dataIndex: 'bankCode',
            width: 150,
             customRender: (text) => this.getDictNameByCode(this.dicts.BANK_CODE,text)
          },
          {
            title: '交易流水号',
            dataIndex: 'flowNo',
            width: 200,
          },
          {
            title: '交易日期',
            dataIndex: 'flowDateStr',
            width: 200,
          },
          {
            title: '对方账号',
            dataIndex: 'tranAccNo',
            width: 150,
          },
          {
            title: '对方账户户名',
            dataIndex: 'tranAccName',
            width: 150,
          },
          {
            title: '对方账户开户行',
            dataIndex: 'tranOpenBran',
            width: 150,
          },
          {
            title: '收支方向',
            dataIndex: 'incomeExpenses',
            width: 120,
            customRender: (text) => this.getDictNameByCode(this.dicts.CAP_IN_EXP,text)
          },
          {
            title: '收支发生额',
            dataIndex: 'flowAmt',
            width: 120,
            customRender: function(t,r,index){
              return formatAmt(t,2)
            }
          },
          {
            title: '银行账户余额',
            dataIndex: 'savingBal',
            width: 120,
            customRender: function(t,r,index){
              return formatAmt(t,2)
            }
          },
          {
            title: '币种',
            dataIndex: 'curCode',
            width: 120,
            customRender: (text) => this.getDictNameByCode(this.dicts.CUR_CODE,text)
          },
          {
            title: '摘要',
            dataIndex: 'memo',
            width: 120,
          },
          {
            title: '已钩稽金额',
            dataIndex: 'mappedAmt',
            width: 120,
            customRender: function(t,r,index){
              return formatAmt(t,2)
            }
          },
          {
            title: '未钩稽金额',
            dataIndex: 'availBal',
            width: 120,
            customRender: function(t,r,index){
              return formatAmt(t,2)
            }
          },
          {
            title: '流水状态',
            dataIndex: 'status',
            width: 120,
            customRender: (text) => this.getDictNameByCode(this.dicts.CAP_STATUS,text)
          },
          {
            title: '操作者',
            dataIndex: this.showMatched?'createBy':'userName',
            width: 120,
          },
          // {
          //   title: '剩余未钩稽金额',
          //   dataIndex: 'availBal',
          //   width: 150,
          // },
          {
            title: '操作',
            dataIndex: 'action',
            width:150,
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/baseline/trxCapitalFlows/list",
          delete: "/baseline/trxCapitalFlows/delete",
          deleteBatch: "/baseline/trxCapitalFlows/deleteBatch",
          exportXlsUrl: "baseline/trxCapitalFlows/exportXls",
          importExcelUrl: "baseline/trxCapitalFlows/importExcel",
        },
        // matchedTemps:[],// 加入的流水临时
        disableMixinCreated: true,
      }
    },
    methods: {
      changeMin (val) {
        this.$set(this.queryParam,'flowAmtMin',val)
      },
      changeMax (val) {
        this.$set(this.queryParam,'flowAmtMax',val)
      },
      changeFlowDate (val) {
        this.$set(this.queryParam,'flowDateStart',val[0]|| '')
        this.$set(this.queryParam,'flowDateEnd',val[1]|| '')
      },
      toggleAdvanced () {
        this.advanced = !this.advanced
      },
      checkFundFlows () {
        this.$message.warn('此功能待开发')
      },
      async matchFundFlows (type) {
        if( !this.selectedRowKeys.length ){
          this.$message.warn('请至少选择一条记录')
          return
        }
        // let params = [{id:7552,CAP_MATCH_TYPE:'B'},{id:7514,CAP_MATCH_TYPE:'B'}]
        let params = this.selectedRowKeys.map(item=>{return {id:item, capMatchType:type } })
        const res = await matchTrxCapitalFlows(params)
        if( res.success ) {
          this.$message.success('操作成功')
          this.selectedRowKeys = []
          this.loadData()
        }
      },
      deleteMatched(record){
        
        // this.matched.splice(index,1)
        this.$emit('deleteMatched',record)
      },
      async addMatched(record){
        const target =  this.matched.filter(item=>{
          return item.id == record.id
        })[0]
        if( !record.mapAmt ){
          this.$message.warning('请输入要钩稽的金额!')
          return
        }
        // if(target){
        //   this.$message.warning('此条流水已存在!')
        //   return
        // }
        if( +record.availBal < +record.mapAmt ){
          this.$message.warning('钩稽金额不能大于收支发生金额!')
          return
        }
        /*if(+record.mapAmt > +this.tranSum ){
          this.$message.warning('钩稽金额不能大于订单总金额!')
          return
        }*/
        let ordersBuy = {
          odrCode: this.odrCode
        }
        const { result } = await findSumMapAmt(ordersBuy)
        if(result.mapAmt + record.mapAmt > this.tranSum){
          this.$message.warning('钩稽金额不能大于订单总金额！')
          return
        }
        // this.matched.push(record)
        this.$emit('addMatched',[record])
      },
      handleChange(val,col,index){
        this.dataSource[index][col] = val
      },
      searchResetSelf(){
        this.queryParam = {...this.fixedSearch}
        this.loadData(1)
      },
      // searchQuerySelf(){

      // },
      initDictConfig () {
        let promises = [this.getProAssetcats(),
          this.getAdmOrgnaiztionInfo({ ORG_SUBTYPE:'PIS',REMOVE_YN:'N' }),
          this.getDict('CAP_IN_EXP,CAP_STATUS,CUR_CODE,BANK_CODE')
        ]
        Promise.all(promises).then(()=>{
          if( !this.showMatched ){
            this.loadData()
          } else {
            this.dataSource = this.matched
          }
        })
      }
    },
    watch: {
      matched: function(newVal,oldal){
        if(this.showMatched){
          this.dataSource = newVal
        }
      },
      fixedSearch: function(newVal,oldal){
        this.queryParam = {...newVal}
        this.dataSource = null
        this.loadData(1)
      }
    },
    created () {
      this.initDictConfig()
      if(this.showMatched||this.onlySearch ){
        this.columns.splice(this.columns.length-1,0,{
          title: '钩稽金额',
          dataIndex: 'mapAmt',
          width:120,
          fixed: 'right',
          scopedSlots: { customRender: 'mapAmt' },
        })
      }
      // 展示已钩稽的
      if(this.showMatched){

      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@assets/less/common.less'
  .center{
    text-align: center
  }
</style>