import { queryPro,getProSettleAccounts,getPrjectInfoList,getCusAccInfoList,addSubscribe,
  getSubscribeInfo,addOrdersOptLogs,ordersOptLogsList,getCusInvestBal,findFeeNamesMsg,
  choosePrject,findBnfAvaSaving,chooseDistType,handMatch,insurerInfo,cusAccInfoListByPrjCode,
  subAccountInformation,getPolicyInformation,findDataByPrjCode,findBnfByPrjCode,findProByPrjCode,
  findAviAmt,findCusAccInfo,cusAccInfoListBybnfCode,queryInde,findAccount,findCusBnfInfo,
} from '@/api/BiApi'
// 交易类型
const tradeTypeStatus = [
  {id:'80',name:'待提交',step:0},
  {id:'0',name:'审核中',step:1},
  {id:'5',name:'审核退回',step:2},
  {id:'05',name:'审核退回',step:2},
  {id:'10',name:'未划款',step:2},
  {id:'15',name:'已取消',step:4},
  {id:'20',name:'未确认份额',step:3},
  {id:'25',name:'失败已退款',step:4},
  {id:'30',name:'未扣减信托份额',step:3},
  {id:'35',name:'未扣减资产份额',step:4},
  {id:'50',name:'交易成功',step:4},
  {id:'55',name:'交易失败',step:4},
  {id:'60',name:'部分成功',step:4},
  {id:'70',name:'未扣减份额',step:2},
  {id:'75',name:'未到账',step:3},
  {id:'85',name:'未确认股权比例',step:3},
  {id:'101',name:'TCMP审批中',step:3},
]
const order = {
  namespaced: true,
  state: {
    taskId: '',// 审核流任务id
    current:0, //当前节点
    status: '80', //当前状态
    statusName: '待提交', //当前状态名
    batchId: '', // 批量订单号
    // tradeTypeStatus:tradeTypeStatus, //交易类型集合
    proNameList: [],// 资产名称列表
    proSettleAccounts: [], // 资金交收账户
    cusAccInfoList: [], // 子账户信息
    prjectInfoList: [], // 项目名称
    operationLogs: [], //操作日志
    cusInvestBal: [],//资产合同
    feeNamesMsg: [],//费用细类
    cusBnfInfos: [],//受益人
    cusLoaInfo: {},//付款账户信息
    cusDirInfos: [],//项目关联的项目执行人
    financedList: [], //受益人子账户信息
    distTypes: [], // 分配明细
    insurerInfo: [], // 保险人信息
    policys: [],//项目下的保险合同
    partys: [],//项目下的转让方和受让方
    bnfs: [],// 子账户下受益人与持有份额
    bnfPros: [],//子账户受益权资产
    bankCardBalanceDto:{},//银行卡可用余额
    isHold: 'Y', //是否持仓
    isFromWkf: false, //是否从审核单进入订单
    indeSource: [],// TA份额调整资金来源,项目下子账户
    securitiesAccounts: [], // 项目下的证券资金账户
  },
  mutations: {
    RESET_STATE(state){
      state.current = 0
      state.status = "80"
      state.statusName = '待提交'
      state.batchId = ''
      state.operationLogs = [] //清空操作日志
      state.taskId = ''
      state.isHold = 'Y'
    },
    SET_current(state, payload) {
      state.current = payload
    },
    SET_batchId(state, payload) {
      state.batchId = payload
    },
    SET_taskId(state, payload) {
      state.taskId = payload
    },
    SET_status(state, payload) {
      // 传数组，根据子状态判断主状态
      if( Array.isArray( payload ) ){
        let tempStep = 5
        for( let { status } of payload ){
          for ( let { id,name,step } of tradeTypeStatus ){
            if( id == status ){
              if( step < tempStep){
                tempStep = step
                state.status = status
                // state.current = step
                state.statusName = name
              }
            }
          }
        }
      } else{
        state.status = payload
        for ( let { id,name,step } of tradeTypeStatus ){
          if( id == payload ){
            // state.current = step
            state.statusName = name
          }
        }
      }

    },
    SET_proNameList(state, payload) {
      state.proNameList = payload
    },
    SET_proSettleAccounts(state, payload) {
      //state.proSettleAccounts = payload.map(item=>{ return { name: `${item.accName}(${item.accNo})`,value: item.accNo } })
      //state.proSettleAccounts = payload.map(item=>{ return { name: `${item.accName}|${item.accNo}`,value: item.accName+'|'+item.accNo+','+item.bankCode } })
      state.proSettleAccounts = payload.map(item=>{ return { name: `${item.accNo}`,value: item.accNo+','+item.bankCode } })

    },
    SET_cusAccInfoList(state, payload) {
      state.cusAccInfoList = payload
      state.isFromWkf = false
    },
    SET_prjectInfoList(state, payload) {
      state.prjectInfoList = payload
    },
    SET_IndeSource(state, payload) {
      state.indeSource = payload
    },
    SET_operationLogs(state, payload) {
      state.operationLogs = payload
    },
    SET_cusInvestBal(state, payload) {
      state.cusInvestBal = payload
    },
    SET_feeNamesMsg(state, payload) {
      state.feeNamesMsg = payload
    },
    SET_cusBnfInfos(state, payload) {
      state.cusBnfInfos = payload
    },
    SET_cusLoaInfo(state, payload) {
      state.cusLoaInfo = payload
    },
    SET_cusDirInfos(state, payload) {
      state.cusDirInfos = payload
    },
    SET_financedList(state, payload) {
      state.financedList = payload
    },
    SET_distTypes(state, payload) {
      state.distTypes = payload
    },
    SET_insurerInfo(state, payload) {
      state.insurerInfo = payload
    },
    SET_policys(state, payload) {
      state.policys = payload
    },
    SET_partys(state, payload) {
      state.partys = payload
    },
    SET_bnfs(state, payload) {
      state.bnfs = payload
    },
    SET_bnfPros(state, payload) {
      state.bnfPros = payload
    },
    SET_bankCardBalanceDto(state, payload) {
      state.bankCardBalanceDto = payload
    },
    SET_isHold(state, payload) {
      state.isHold = payload
    },
    SET_isFromWkf(state, payload) {
      state.isFromWkf = payload
    },
    SET_securitiesAccounts(state, payload) {

      //state.securitiesAccounts = payload
      state.securitiesAccounts = payload.map(item=>{ return { name: `${item.secCapNo}`,value: item.id+','+item.secCapNo } })
    },
  },
  actions: {
    // 获取订单中资产名称列表
    async getProNameList({ commit,state }, data) {

      const { result } = await queryPro({isHold:state.isHold})
      commit("SET_proNameList", result);
    },
    // 获取资产下的资金交收账户
    async getProSettleAccounts({ commit }, data) {
      const { result } = await getProSettleAccounts(data)
      commit("SET_proSettleAccounts", result.records);
    },
    // 获取子账户信息
    async getCusAccInfoList({ commit }, data) {
      const { result } = await getCusAccInfoList(data)
      commit("SET_cusAccInfoList", result);
    },
    async findCusAccInfo({ commit }, data) {
      const { result } = await findCusAccInfo(data)
      commit("SET_cusAccInfoList", result);
    },
    // 获取子账户信息据项目编号（prjcode）
    async cusAccInfoListByPrjCode({ commit }, data) {
      const { result } = await cusAccInfoListByPrjCode(data)
      commit("SET_cusAccInfoList", result);
    },
    // 获取子账户信息据项目编号（prjcode,bnfCode）
    async cusAccInfoListBybnfCode({ commit }, data) {
      const { result } = await cusAccInfoListBybnfCode(data)
      commit("SET_cusAccInfoList", result);
    },
    // 获取子账户信息据保险人（orgcode）
    async cusAccInfoListByOrgCode({ commit }, data) {
      const { result } = await subAccountInformation(data)
      commit("SET_cusAccInfoList", result);
    },
    // 获取项目信息
    async getPrjectInfoList({ commit,state }, data={}) {
      // 审核单调项目列表不需要数据权限
      if(state.isFromWkf){
        data['dataPermissionFlag'] = true
      }
      const { result } = await getPrjectInfoList(data)
      commit("SET_prjectInfoList", result);
    },
    // 获取资产合同
    async getCusInvestBal({ commit }, data) {
      const { result } = await getCusInvestBal(data)
      commit("SET_cusInvestBal", result);
    },
    // 根据费用类型查询费用明细
    async findFeeNamesMsg({ commit }, data) {
      const { result } = await findFeeNamesMsg(data)
      commit("SET_feeNamesMsg", result.sysDictItems);
    },
    // 选择项目名称查询受益人和付款账户
    async choosePrject({ commit }, data) {
      const { result } = await choosePrject(data)
      commit("SET_cusBnfInfos", result.cusBnfInfos);
      commit("SET_cusLoaInfo", result.cusLoaInfo);
    },
    // 慈善资助选择项目名称查询受益人和付款账户,项目执行人
    async findCusBnfInfo({ commit }, data) {
      const { result } = await findCusBnfInfo(data)
      commit("SET_cusBnfInfos", result.cusBnfInfos);
      commit("SET_cusLoaInfo", result.cusLoaInfo);
      commit("SET_cusDirInfos", result.cusDirInfos);
      return result
    },
    // 选择受益人查子账户和收付款信息
    async findBnfAvaSaving({ commit }, data) {
      const { result } = await findBnfAvaSaving(data)
      commit("SET_financedList", result.financedList);
    },
    // 根据分配类型查分配明细
    async chooseDistType({ commit }, data) {
      const { result } = await chooseDistType(data)
      commit("SET_distTypes", result.admWmsParam);
    },
    // 获取保险人信息
    async getInsurerInfo({ commit }, data) {
      const { result } = await insurerInfo(data)
      commit("SET_insurerInfo", result);
    },
    // 获取保险信息列表
    async getPolicyInformation({ commit }, data) {
      const { result } = await getPolicyInformation(data)
      commit("SET_policys", result);
    },
    // 获取项目下的转让方和受让方
    async findPartysByPrjCode({ commit }, data) {
      const { result } = await findDataByPrjCode(data)
      commit("SET_partys", result);
    },
    // 根据子账户获取受益人与持有份额
    async findBnfByPrjCode({ commit }, data) {
      const { result } = await findBnfByPrjCode(data)
      commit("SET_bnfs", result);
    },
    // 根据项目子账户获取受益权
    async findProByPrjCode({ commit }, data) {
      const { result } = await findProByPrjCode(data)
      commit("SET_bnfPros", result);
    },
    // 根据项目子账户获取受益权
    async queryInde({ commit }, data) {
      const { result } = await queryInde(data)
      commit("SET_IndeSource", result.cusFinancedResultDtoList);
    },
    // 查看项目的证券账户
    async findAccount({ commit }, data) {
      const { result } = await findAccount(data)
     // state.proSettleAccounts = payload.map(item=>{ return { name: `${item.accName}|${item.accNo}`,value: item.accName+'|'+item.accNo+','+item.bankCode } })

      console.log("-----"+JSON.stringify(result))
      commit("SET_securitiesAccounts", result);
    },
   

    // 新增操作日志埋点
    async addOrdersOptLogs({ commit, state,dispatch }, data) {
      const res = await addOrdersOptLogs(data)
      if( res.success ){
        dispatch("ordersOptLogsList")
        // const { result } = await ordersOptLogsList({batchId:state.batchId})
        // commit("SET_operationLogs", result.records);
      }
    },
    // 操作日志列表
    async ordersOptLogsList({ commit, state }, data) {
      const { result } = await ordersOptLogsList({batchId:state.batchId})
      commit("SET_operationLogs", result.records);
    },
    // 手动钩稽
    async handMatch({ commit, state },{matched,odrCode} ) {
      if( !matched.length ){
        this.$message.warning('请加入需要钩稽的流水!')
        return
      }
      let params = []
      matched.map(item=>{
        params.push({
          odrCode: odrCode,
          flowId: item.id,
          amtType: "T",
          mapAmt: item.mapAmt|| 0,
          prjCode: item.prjCode,
          incomeExpenses: item.incomeExpenses
        })
      })
     return await handMatch(params)
    },
    //获取项目银行卡余额
    async findAviAmt({ commit }, data){
      const { result } = await findAviAmt(data)
      commit("SET_bankCardBalanceDto", result);
    },
  },
  
}
export default order