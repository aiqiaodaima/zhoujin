 <template>
 <div>
    <a-card :bordered="false" title="订单基本信息">
      <detail-list size="small" :col="3" style="padding-left:10%">
        <detail-list-item :term="`${getDictNameByCode(this.dicts.TRANSACTION_TYPE,detailData.trantypeCode)}申请`">未划款</detail-list-item>
        <detail-list-item term="订单编号">{{detailData.odrCode || '--'}}</detail-list-item>
        <detail-list-item term="子账户名称">{{detailData.accName || '--'}}</detail-list-item>
        <detail-list-item term="订单创建人">{{detailData.createBy || '--'}}</detail-list-item>
        <detail-list-item term="订单创建时间">{{detailData.createDt || '--'}}</detail-list-item>
        <detail-list-item term="申请交易日期" >{{detailData.payDt || '--'}}</detail-list-item>
        <detail-list-item term="订单总金额">{{formatAmt(detailData.tranAmt) || 0.00}}</detail-list-item>
        <detail-list-item term="已钩稽金额">{{formatAmt(detailData.mappedAmt) || 0.00}}</detail-list-item>
        <detail-list-item term="未钩稽金额">{{formatAmt(detailData.availBal) || 0.00}}</detail-list-item>
      </detail-list>
    </a-card>
    <a-card :bordered="false" title="流水查询">
      <FundFlowList ref="flowSearch" :onlySearch="true" :addBtn="true" :tranSum = "detailData.tranAmt" :odrCode="detailData.odrCode"
      @addMatched="addMatched" :fixedSearch="fixedSearch"/>
    </a-card>
    <a-card :bordered="false" title="已钩稽流水">
      <FundFlowList :onlySearch="true"  :deleteBtn="true" 
      :showMatched="true" :matched='matched' @deleteMatched="deleteMatched"/>
    </a-card>
 </div>
</template>

<script>
  import { mapState, mapActions, mapMutations, } from "vuex";
  import { orderBaseInfo,chooseFundSearch,updateFlowsStatus,deleteFlowById } from '@/api/BiApi'
  import FundFlowList from './FundFlowList'
  import DetailList from '@bi/BiDetailList'
  import dictMixin from '@mixins/dictMixin'
  import { formatAmt } from '@utils/util'
  const DetailListItem = DetailList.Item

  export default {
    name: "MatchFlow",
    components: {
      DetailList,DetailListItem,FundFlowList
    },
    mixins:[dictMixin],
    data () {
      return {
        detailData:'',
        matched: [],
        fixedSearch: {},//固定隐形搜索
      }
    },
    props: {
      odrCode: '',
    },
    methods: {
       ...mapActions("order",["handMatch"]),
      formatAmt(amt){
        return formatAmt(amt,2)
      },
      // 订单基本信息查询
      async orderBaseInfo(){
        const {result,success} = await orderBaseInfo({ odrCode:this.odrCode })
        if( success ){
          if(result.trxOrders.tranAmt === null){
            result.trxOrders.tranAmt = formatAmt((+result.trxOrders.tranPrice)*(+result.trxOrders.tranUnit),2)
          }
          this.detailData = result.trxOrders
          //收入
          const ttcIn = ['LOA1401','INV04','INV05','INV06','INV09','INV15','INV16','LOA01','LOA0101','LOA02','LOA0201','INV16','LOA21']
          //支出
          const ttcOut = ['LOA1402','LOA13','INV01','INV02','LOA04','LOA03','LOA20','INV13','INV14','LOA1601','LOA1602']
          let incomeExpenses = ''
          if(ttcIn.indexOf(this.detailData.trantypeCode) >= 0){
            incomeExpenses = '0'
          }else if(ttcOut.indexOf(this.detailData.trantypeCode) >= 0){
            incomeExpenses = '1'
          }
          this.fixedSearch = {
            prjCode:result.trxOrders.prjCode,
            incomeExpenses: incomeExpenses
          }
        }
      },
      // 获取订单已钩稽的流水
      async chooseFundSearch(){
        const {result,success} = await chooseFundSearch({ odrCode:this.odrCode })
        if( success ){
          this.matched = result.listHisFlowsList
        }
      },
      async deleteMatched(record){
        const { success } = await deleteFlowById( { flowId:record.id,mapId:record.mapId } )
        if( success ){
          // 更新已钩稽流水记录
          this.chooseFundSearch()
         // 更新流水记录
         this.$refs.flowSearch.loadData()
        }
      },
      async addMatched(matched){
        //收入
        const ttcIn = ['LOA1401','INV04','INV05','INV06','INV09','INV15','INV16','LOA01','LOA02','LOA21']
        //支出
        const ttcOut = ['LOA1402','INV01','INV02','LOA03','LOA04','LOA20','INV13','INV14']
        if(ttcIn.indexOf(this.detailData.trantypeCode) >= 0){
          for(let { incomeExpenses } of matched ){
            if(incomeExpenses === '1'){
              this.$message.warning('收入金额订单不能选择支出流水!')
              return
            }
          }
        }else if(ttcOut.indexOf(this.detailData.trantypeCode) >= 0){
          for(let { incomeExpenses } of matched ) {
            if (incomeExpenses === '0') {
              this.$message.warning('支出金额订单不能选择收入流水!')
              return
            }
          }
        }/*else{
          this.$message.warning('此订单类型不存在!')
          return
        }*/
        const { success } = await this.handMatch( {matched,odrCode:this.odrCode} )
        if( success ){
          // 更新已钩稽流水记录
          this.chooseFundSearch()
         // 更新流水记录
         this.$refs.flowSearch.loadData()
        }
      },
    },
    watch: {
    },
    created () {
      this.getDict('TRANSACTION_TYPE')
      this.orderBaseInfo()
      this.chooseFundSearch()
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@assets/less/common.less'

</style>