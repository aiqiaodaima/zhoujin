/** 
证券资金账户列表
*/

<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form-model layout="inline">
        <a-row :gutter="16">
          <BiCol>
            <BiFormItemInput label="项目名称" v-model="queryParam.trustPrjName" @pressEnter="enterKeySearch" placeholder="请输入项目名称"/>
          </BiCol>
          <BiCol>
            <BiFormItemSelect :options="dicts.PRJ_SEC_COMPANY" label="证券公司" v-model="queryParam.secCompany" />
          </BiCol>
          <BiCol>
            <BiFormItemInput label="资金账号" v-model="queryParam.secCapNo" @pressEnter="enterKeySearch" placeholder="请输入银行账号"/>
          </BiCol>
          <!-- <BiCol>
            <BiTableSearchBtns @searchReset='searchResetSelf' @searchQuery='searchQuery' v-model='advanced'/>
          </BiCol> -->
        </a-row>
      </a-form-model>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
      <a-button type="primary" icon="reset" @click="searchReset">重置</a-button>
      <a-button type="primary" icon="plus" @click="() => $router.replace({path: '/securitiesAccount/securitiesAccountNew'})">新增证券资金账户</a-button>
    </div>
    <div>
      <a-table
        ref="table"
        size="middle"
        :scroll="{ y: 400 }"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        bordered
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">
        <template slot="action" slot-scope="text,record,index">
          <div class="editable-row-operations center" >
            <span>
              <a  @click="() => $router.push({path: '/securitiesAccount/securitiesAccountNew',query:{id:record.id,type:'view'}})">查看</a>
              <a-divider type="vertical" />
              <a  @click="() => $router.push({path: '/securitiesAccount/securitiesAccountNew',query:{id:record.id}})">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm
                title="确认删除吗?"
                @confirm="()=>handleDelete({id:record.id})"
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
  import { matchTrxCapitalFlows,findSumMapAmt } from '@/api/BiApi'
  import dictMixin from '@mixins/dictMixin'
  import { formatAmt } from '@utils/util'
  export default {
    name: "SecuritiesAccountList",
    components: {
    },
    mixins:[biTableMixin,dictMixin],
    props:{
    },
    data () {
      return {
        // 表头
        columns: [
          {
            title: '项目名称',
            dataIndex: 'trustPrjName',
            // width: 150
          },
          {
            title: '证券公司',
            dataIndex: 'secCompany',
            // width: 120,
            customRender: (text) => this.getDictNameByCode(this.dicts.PRJ_SEC_COMPANY,text)
          },
          {
            title: '资金账号',
            width: 180,
            dataIndex: 'secCapNo',
          },
          {
            title: '操作',
            dataIndex: 'action',
            width:150,
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/prj/securitiesAccount/list",
          delete: "/prj/securitiesAccount/delete",
          deleteBatch: "/prj/securitiesAccount/deleteBatch",
        },
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
        console.log('选中的ids',this.selectedRowKeys, params)
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
          this.getDict('PRJ_SEC_COMPANY,CAP_STATUS,CUR_CODE')
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
        this.loadData(1)
      }
    },
    created () {
      this.initDictConfig()
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@assets/less/common.less'
  .center{
    text-align: center
  }
</style>