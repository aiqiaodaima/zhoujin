import { getProducts,getPrjList,getPrjAccInfoList,addOrdersOptLogs,ordersOptLogsList,getRelPartyList,
  getAdmOrgnaiztionInfo,queryWkfInfoByBatchId,getPrjOrderInfo } from '@/api/BiApi'

const tradeTypeStatus = [
  {id:'80',name:'待提交',step:0},
  {id:'0',name:'审核中',step:1},
  {id:'5',name:'审核退回',step:0},
  {id:'75',name:'未到账',step:2},
  {id:'15',name:'已取消',step:4},
  {id:'20',name:'未确认份额',step:3},
  {id:'25',name:'失败已退款',step:4},
  {id:'50',name:'交易成功',step:4},
  {id:'55',name:'交易失败',step:4},
  {id:'60',name:'部分成功',step:4}
]

const project = {
  namespaced: true,
  state: {
    accPageCurr: 0,
    current: 0, //当前节点
    status: '80', //当前状态
    statusName: '待提交', //当前状态名
    batchId: '', // 批量订单号
    taskId:'',
    procInstId:'',
    prjCode:'',
    periodNo: 0,
    proNameList: [],// 资产名称列表
    cusAccInfoList: [], // 子账户信息
    prjectInfoList: [], // 项目名称
    operationLogs: [], //操作日志
    relPartyList: [], //关系人列表
    trusteeList: [], //受托人列表
    orgList: [],//机构信息
    prjAssets:[],
    prjOrderInfo: {},
    prjChangeble: true
  },
  actions: {
    async project_cpc({commit},data){
      commit("CHANGE_ACC_CURR_PAGE", data);
    },
    // 获取资产名称列表
    async getProNameList({ commit }, data) {
      const { result } = await getProducts({pageSize:9999})
      commit("SET_proNameList", result.records);
    },
    // 获取子账户信息
    async getCusAccInfoList({ commit }, data) {
      const { result } = await getPrjAccInfoList(data)
      commit("SET_cusAccInfoList", result);
    },
    // 获取项目信息
    async getPrjectInfoList({ commit }, data) {
      const { result } = await getPrjList(data);
      commit("SET_prjectInfoList", result.records);
    },
    // 获取关系人信息
    async getRelPartyList({ commit }, data) {
      const { result } = await getRelPartyList(data);
      commit("SET_relPartyList", result.records);
    },
    async getTrusteeList({ commit }, data) {
      const { result } = await getRelPartyList(data);
      commit("SET_trusteeList", result.records);
    },
    // 获取财产管理机构
    async getOrgList({ commit }, data) {
      const { result } = await getAdmOrgnaiztionInfo(data);
      console.log("orglist=", result);
      commit("SET_orgList", result.records);
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
      commit("SET_operationLogs", []);
      if(state.batchId){
        const { result } = await ordersOptLogsList({batchId:state.batchId});
        commit("SET_operationLogs", result);
      }
    },

    async queryWkfInfoByBatchId({ commit, state }, data) {
      commit("SET_procInstId", '');
      commit("SET_taskId", '');
      if(state.batchId){
        const { result } = await queryWkfInfoByBatchId({batchId:state.batchId});
        commit("SET_procInstId", result.procInstId);
        commit("SET_taskId", result.taskId);
      }
    },

    async getPrjOrderInfo({ commit, state }, data) {
      if(state.batchId){
        const { result } = await getPrjOrderInfo({batchId:state.batchId});
        commit("SET_prjOrderInfo", result);
      }
    }
  },
  mutations: {
    CHANGE_ACC_CURR_PAGE(state, data){
      state.accPageCurr=data;
    },
    RESET_STATE(state){
      state.current = 0;
      state.status = "80";
      state.statusName = '待提交';
      state.batchId = '';
      state.prjCode = '';
      state.periodNo = 0;
      state.prjAssets = [];
      state.prjOrderInfo = {};
      state.prjChangeble = true;
    },
    SET_current(state, payload) {
      state.current = payload;
    },
    SET_batchId(state, payload) {
      state.batchId = payload;
    },
    SET_prjCode(state, payload) {
      state.prjCode = payload;
    },
    SET_prjChangeble(state, payload) {
      state.prjChangeble = payload;
    },
    SET_periodNo(state, payload) {
      state.periodNo = payload;
    },
    SET_taskId(state, payload) {
      state.taskId = payload;
    },
    SET_procInstId(state, payload) {
      state.procInstId = payload;
    },
    SET_prjOrderInfo(state, payload) {
      state.prjOrderInfo = payload;
    },
    SET_prjAssets(state, payload) {
      state.prjAssets = payload;
    },
    SET_status(state, payload) {
      // 传数组，根据子状态判断主状态
      if( Array.isArray( payload ) ){
        let tempStep = 5
        for( let { status } of payload ){
          for ( let { id,name,step } of tradeTypeStatus ){
            if( id === status ){
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
          if( id === payload ){
            // state.current = step
            state.statusName = name
          }
        }
      }
    },
    SET_proNameList(state, payload) {
      state.proNameList = payload;
    },
    SET_cusAccInfoList(state, payload) {
      state.cusAccInfoList = payload;
    },
    SET_prjectInfoList(state, payload) {
      state.prjectInfoList = payload;
    },
    SET_relPartyList(state, payload) {
      state.relPartyList = payload;
    },
    SET_trusteeList(state, payload) {
      state.trusteeList = payload;
    },
    SET_operationLogs(state, payload) {
      state.operationLogs = payload;
    },
    SET_orgList(state, payload) {
      state.orgList = payload;
    }
  }
}
export default project