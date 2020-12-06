import { getAction,postAction} from '@/api/manage'
//获取字典
const getDict = (params)=>getAction("sys/dict/getDictItemsByType",params);
//获取全部字典
const getAllDict = (params)=>getAction("/admWmsParam/findAll",params);
//获取产品投资类别
const getProInvCats = (params)=>getAction("/proInvCats/list",params);
//获取投资细类
const getProInvTypes = (params)=>getAction("/proInvTypes/list",params);
//获取资产类别参数表
const getProAssetcats = (params)=>getAction("/proAssetcats/list",params);
//获取产品类别
const getProPfcats = (params)=>getAction("/proPfcats/list",params);
// 地址省市区查询
const getCusAreaList = (params)=>getAction("/cusArea/list",params);
const getCusArea = (params)=>getAction("/cusArea/queryById",params);
const getCusAreaByAreaCode = (params)=>getAction("/cusArea/queryByAreaCode",params);
//获取机构信息
const getAdmOrgnaiztionInfo = (params)=>getAction("/admOrgnaiztionInfo/list",params);

//资产管理
const getProducts = (params)=>getAction("/products/list",params);
const getProductDetail = (params)=>getAction("/products/view",params);
const addProduct = (params)=>postAction("/products/add",params);
const editProduct = (params)=>postAction("/products/edit",params);
const deleteProduct = (params)=>postAction("/products/delete",params);
const deleteBatchProduct = (params)=>postAction("/products/deleteBatch",params)
const checkBankProCode =(params)=>getAction("/products/check/bankProCode",params);
const proChange=(params)=>getAction("/products/commitCheck",params);
const getOrderNum=(params)=>getAction("/products/orderNum",params);
const makeBankProCode=(params)=>getAction("/products/makeBankProCode",params);
const checkContent=(params)=>getAction("/products/checkContent",params);
const addStock=(params)=>postAction("/proStock/add",params);
const editStock=(params)=>postAction("/proStock/edit",params);
const getStockDetail = (params)=>getAction("/proStock/view",params);
const makeProCode=(params)=>getAction("/proStock/makeProCode",params);
const getEquityData=(params)=>getAction("/proStock/getEquityData",params);

// 开放期管理
const addOpenRule = (params)=>postAction("/proOpenParam/add",params);
const editOpenRule = (params)=>postAction("/proOpenParam/edit",params);
const getOpenRuleDetail = (params)=>getAction("/proOpenParam/getById",params);
const addkfqPlan = (params)=>postAction("/proOpen/add",params);
const editkfqPlan = (params)=>postAction("/proOpen/edit",params)




// 分红管理
const addBonusRule = (params)=>postAction("/proIntParam/add",params);
const editBonusRule = (params)=>postAction("/proIntParam/edit",params);
const getBonusRuleDetail = (params)=>getAction("/proIntParam/getById",params);
const getIdByProCode=(params)=>getAction("/proIntParam/getIdByProCode",params);
const addBonusPlan = (params)=>postAction("/proInt/add",params);
const editBonusPlan = (params)=>postAction("/proInt/edit",params);



// 净值管理
const addPrice = (params)=>postAction("/proPrices/add",params);
const editPrice= (params)=>postAction("/proPrices/edit",params);
// 资金流水
const addTrxCapitalFlows = (params)=>postAction("/baseline/trxCapitalFlows/add",params);
const editTrxCapitalFlows= (params)=>postAction("/baseline/trxCapitalFlows/edit",params);
const matchTrxCapitalFlows= (params)=>postAction("/baseline/trxCapitalFlows/match",params);
const getTrxCapitalFlow = (params)=>getAction("/baseline/trxCapitalFlows/queryById",params);
// 公用勾稽流水查询
const chooseFundSearch = (params)=>getAction("/baseline/trxCapitalFlows/chooseFundSearch",params);
//获取勾稽的总金额
const findSumMapAmt = (params)=>getAction("/baseline/trxCapitalFlows/findSumMapAmt",params);
//手动勾稽
const handMatch = (params)=>postAction("/baseline/trxCapitalFlows/handMatch",params);
//勾稽状态处理
const updateFlowsStatus = (params)=>postAction("/baseline/trxCapitalFlows/updateFlowsStatus",params);
//撤销流水勾稽
const deleteFlowById = (params)=>postAction("/baseline/trxCapitalFlows/deleteFlowById",params);

//订单基本信息查询
const orderBaseInfo = (params)=>getAction("/baseline/trxCapitalFlows/orderBaseInfo",params);


// 项目管理
const getPrjList = (params)=>getAction("/prj/list",params);
const getPrjectInfoList = (params)=>getAction("/orders/common/prjectInfoList",params);

// 资管策略模版参数管理
const getAssetParam = (params)=>getAction("/proAssetCombinations/findByAssetcomCode",params);
const getAssetParamList = (params)=>getAction("/proAssetCombinations/list",params);
const addAssetParam = (params)=>postAction("/proAssetCombinations/add",params);
// 投资限制模板
const getInvlmtTemplate = (params)=>getAction("/cusInvlmtTemplate/detail",params);
const addInvlmtTemplate = (params)=>postAction("/cusInvlmtTemplate/add",params);
// 资金交收账户
const getProSettleAccounts = (params)=>getAction("/proSettleAccounts/list",params);
// 获取子账户信息
const getCusAccInfoList = (params)=>getAction("/orders/common/cusAccInfoList",params);
// 获取子账户信息据项目编号（prjcode）
// const cusAccInfoListByPrjCode = (params)=>getAction("/orders/common/cusAccInfoListByPrjCode",params);
const cusAccInfoListByPrjCode = (params)=>getAction("/orders/charitableaid/cusAccInfoListByPrjCode",params);
// 获取子账户信息据项目编号（prjcode和bnfMode）
const cusAccInfoListBybnfCode = (params)=>getAction("/orders/common/cusAccInfoListBybnfCode",params);
// 获取账户资金暂存档区间内可用余额
const queryCapitalAviAmt = (params)=>getAction("/orders/common/queryCapitalAviAmt",params);
// 获取资产合同
const getCusInvestBal = (params)=>getAction("/orders/tranSell/getCusInvestBal",params);
// 根据费用类型查询费用明细
const findFeeNamesMsg = (params)=>getAction("/orders/fee/findFeeNamesMsg",params);
// 获取付款账户信息
const findPayAccount = (params)=>getAction("/orders/fee/findPayAccount",params);




// 订单确认或取消(认购)
const confirmOrCancel = (params)=>postAction("/orders/common/confirmOrCancel",params);

// 新增操作日志埋点
const addOrdersOptLogs = (params)=>postAction("/orders/trxOrdersOptlogs/add",params);
// 操作日志列表
const ordersOptLogsList = (params)=>getAction("/orders/trxOrdersOptlogs/list",params);

// 保存认购
const addSubscribe = (params)=>postAction("/orders/subscribe/add",params);
// 认购强制撤回
const mandatoryWithdrawal = (params)=>postAction("/orders/common/mandatoryWithdrawal",params);
// 获取认购订单详情
const getSubscribeInfo = (params)=>getAction("/orders/subscribe/queryOrdersInfoByBatchId",params);
// 保存赎回
const addTranSell = (params)=>postAction("/orders/tranSell/add",params);
// 获取认购订单详情
const gettranSellInfo = (params)=>getAction("/orders/tranSell/getOrderSellVo",params);

// 保存本息分配
const addBaldividend = (params)=>postAction("/orders/baldividend/add",params);
// 确认到账
const baldividendConfirmOrCancel = (params)=>postAction("/orders/baldividend/confirmOrCancel",params);
// 获取本息分配
const getBaldividendInfo = (params)=>getAction("/orders/baldividend/view",params);
//获取关系人数据
const getRelPartyList = (params)=>getAction("/prj/rel/list",params);
const getPrjAccInfoList = (params)=>getAction("/subacc/listByPrj",params);
// 保存红利再投
const addDeposit = (params)=>postAction("/orders/deposit/add",params);
// 获取红利再投
const getDepositInfo = (params)=>getAction("/orders/deposit/findDepositListByBatchId",params);

// 保存费用支付
const addFee = (params)=>postAction("/orders/fee/doAdd",params);
// 费用支付确认划款/取消订单
const confirmOrCancelFee = (params)=>postAction("/orders/fee/confirmOrCancel",params);
// 获取费用支付
const getFeeInfo = (params)=>getAction("/orders/fee/feedBack",params);
// 费用支付-获取收款账户信息
const findRcvAccount = (params)=>getAction("/orders/fee/findRcvAccount",params);


// 保存信托利益分配
const addBenefitsscribe = (params)=>postAction("/orders/benefitsscribe/add",params);
// 信托利益分配确认划款/取消
const transferOrCancel = (params)=>postAction("/orders/benefitsscribe/transferOrCancel",params);
//  信托利益分配-选择项目名称后执行方法
const choosePrject = (params)=>getAction("/orders/benefitsscribe/choosePrject",params);
//  信托利益分配-更新受益人可用资金
const findBnfAvaSaving = (params)=>getAction("/orders/benefitsscribe/findBnfAvaSaving",params);
//  信托利益分配-分配类型查分配明细
const chooseDistType = (params)=>getAction("/orders/benefitsscribe/chooseDistType",params);
//  信托利益分配-回显
const benefitsBack = (params)=>getAction("/orders/benefitsscribe/benefitsBack",params);
//  信托利益分配-确认份额/取消
const benefitsConfirmOrCancel= (params)=>postAction("/orders/benefitsscribe/confirmOrCancel",params);


// 保存慈善资助
const addCharitableaid = (params)=>postAction("/orders/charitableaid/add",params);
// 慈善资助确认划款/取消
const editCharitableaid = (params)=>postAction("/orders/charitableaid/edit",params);
//  慈善资助-选择项目名称后执行方法
const findCusBnfInfo = (params)=>getAction("/orders/charitableaid/findCusBnfInfo",params);
//  慈善资助-获取可以慈善的项目
const charitableaidPrjectInfoList = (params)=>getAction("/orders/charitableaid/prjectInfoList",params);

//  慈善资助-回显
const orderCharitableAidView = (params)=>getAction("/orders/charitableaid/orderCharitableAidView",params);
// //  慈善资助-确认份额/取消
// const benefitsConfirmOrCancel= (params)=>postAction("/orders/charitableaid/confirmOrCancel",params);

// 代缴保费
//  查询保险人信息
const insurerInfo = (params)=>getAction("/orders/payPermium/insurerInfo",params);
//  查询保险人子账户信息
const subAccountInformation = (params)=>getAction("/orders/payPermium/subAccountInformation",params);
//  根据保险合同信息获取资金来源信息
const getSourceOfFunds = (params)=>getAction("/orders/payPermium/getSourceOfFunds",params);
//  查询保险人合同信息
const insuranceContract = (params)=>getAction("/orders/payPermium/insuranceContract",params);
const getPolicyInformation = (params)=>getAction("/orders/payPermium/getPolicyInformation",params);
//  代缴保费-回显
const queryOrderInfo = (params)=>getAction("/orders/payPermium/queryOrderInfo",params);
//  代缴保费-保存
const saveOrders = (params)=>postAction("/orders/payPermium/saveOrders",params);
//  代缴保费-确认份额
const confirmedTransfer = (params)=>postAction("/orders/payPermium/confirmedTransfer",params);
//  代缴保费-确认划款
const affirmDrawing = (params)=>postAction("/orders/payPermium/affirmDrawing",params);

// 受益人间份额转让
//  根据子账户获取受益人与持有份额
const findDataByPrjCode = (params)=>getAction("/orders/asttransfer/findDataByPrjCode",params);
//  受益人间份额转让回显
const asttransferView = (params)=>getAction("/orders/asttransfer/view",params);
// 保存
const asttransferAdd = (params)=>postAction("/orders/asttransfer/add",params);
// 子账户间资产转让
//  根据子账户获取受益人与持有份额
const findBnfByPrjCode = (params)=>getAction("/orders/asttransferzy/findBnfByPrjCode",params);
//  根据项目子账户获取受益权
const findProByPrjCode = (params)=>getAction("/orders/asttransferzy/findProByPrjCode",params);
//  子账户间资产转让回显
const asttransferzyView = (params)=>getAction("/orders/asttransferzy/view",params);
// 保存
const asttransferzyAdd = (params)=>postAction("/orders/asttransferzy/add",params);
// 资金调帐
//  查询系统可用余额和银行卡可用余额
const queryAviAmt = (params)=>getAction("/orders/Adjust/queryAviAmt",params);
//  资金调帐-确认划款/取消订单
const adjustConfirmOrCancle = (params)=>getAction("/orders/Adjust/confirmOrCancle",params);
// 回显
const adjustView = (params)=>getAction("/orders/Adjust/doView",params);
// 保存
const adjustAdd = (params)=>postAction("/orders/Adjust/doSave",params);

//  银转证证转银-确认划款/取消订单
const adjustFundConfirmOrCancle = (params)=>postAction("/orders/AdjustFund/confirmOrCancle",params);
// 回显
const adjustFundView = (params)=>getAction("/orders/AdjustFund/doView",params);
// 保存
const adjustFundAdd = (params)=>postAction("/orders/AdjustFund/doSave",params);

// 受托人
//  受托人回显
const showAssignee = (params)=>getAction("/baseline/assigneeMould/showAssignee",params);
// 保存
const saveAssignee = (params)=>postAction("/baseline/assigneeMould/save",params);
// 机构信息
//  机构信息回显
const showAdmOrganInfo = (params)=>getAction("/baseline/coopOrgan/showAdmOrganInfo",params);
// 保存
const saveOrg = (params)=>postAction("/baseline/coopOrgan/save",params);
// 客户推荐机构信息
//  客户推荐机构信息回显
const showCusRecommendOrganInfo = (params)=>getAction("/baseline/cusRecommendOrg/showCusRecommendOrganInfo",params);
// 保存
const cusRecommendOrgSave = (params)=>postAction("/baseline/cusRecommendOrg/save",params);
//获取项目系统余额、银行卡余额
const findAviAmt = (params)=>getAction("/orders/Adjust/findAviAmt",params);
//保存资金调帐
const doSaveAdjust = (params)=>postAction("/orders/Adjust/doSave",params);
//获取资金调帐信息
const getAdjustInfo = (params)=>getAction("/orders/Adjust/doView",params);
//确认或取消资金调帐
const confirmOrCancelAdjust = (params)=>postAction("/orders/Adjust/confirmOrCancle",params);
//查询订单中的资产
const queryPro = (params)=>postAction("/orders/common/queryPro",params);

//订单追踪删除
const deleteOrder = (params)=>postAction("/orders/common/delete",params);
//校验产品购买合同号是否已存在
const checkRepeatContractNo = (params)=>getAction("/orders/subscribe/checkRepeatContractNo",params);
//查询勾稽资料流水开关状态
const fundFlowSwitchStatus = (params)=>getAction("/orders/common/fundFlowSwitchStatus",params);

//根据batchId查taskId和procInstId
const queryWkfInfoByBatchId = (params)=>getAction("/wkf/queryWkfInfoByBatchId", params);

const getPrjOrderInfo = (params)=>getAction("/prj/asset/queryOrdersInfoByBatchId", params);
const getPrjAssets = (params)=>getAction("/prj/asset/list", params);
//原状分配
//获取子账户信息
const findCusAccInfo = (params)=>getAction("/orders/Original/findCusAccInfo",params);
//查询资产合同
const findCusInvestBal = (params)=>getAction("/orders/Original/findCusInvestBal",params);
//保存原状分配
const doSaveOriginal = (params)=>postAction("/orders/Original/saveOriginal",params);
//根据batchId获取原状分配信息
const getOriginalInfo = (params)=>getAction("/orders/Original/doView",params);
//确认扣减信托份额
const affirmDeducTrustUnit = (params)=>postAction("/orders/Original/affirmDeducTrustUnit",params);
//确认扣减资产份额
const comfirmAssetUnit = (params)=>postAction("/orders/Original/affirmDeducAssetUnit",params);
//取消订单
const cancelOrdersOriginal = (params)=>postAction("/orders/Original/cancelOrders",params);

// TA强增强减
//  初始页面时查询资金来源
const queryInde = (params)=>getAction("/orders/Inde/queryInde",params);
//  TA强增强减回显
const indeView = (params)=>getAction("/orders/Inde/doView",params);
// TA强增强减保存
const doSaveInde = (params)=>postAction("/orders/Inde/doSaveInde",params);

// 证券资金账户-保存
const saveOrUpdate = (params)=>postAction("/prj/securitiesAccount/saveOrUpdate",params);
// 证券资金账户-通过Id获取详情
const findById = (params)=>getAction("/prj/securitiesAccount/findById",params);
// 查看项目的证券账户
const findAccount = (params)=>getAction("/orders/AdjustFund/findAccount",params);

// 添加交易对手信息
const proEastProjectsJydszhAdd = (params)=>postAction("/proEastProjectsJydszh/add",params);
// 修改交易对手信息
const proEastProjectsJydszhEdit = (params)=>postAction("/proEastProjectsJydszh/edit",params);
// 回显交易对手信息
const proEastProjectsJydszhqueryById = (params)=>getAction("/proEastProjectsJydszh/queryById",params);

// 添加交易对手产品信息
const proEastProjectsJydsjrcpAdd = (params)=>postAction("/proEastProjectsJydsjrcp/add",params);
// 修改交易对手产品信息
const proEastProjectsJydsjrcpEdit = (params)=>postAction("/proEastProjectsJydsjrcp/edit",params);
// 回显交易对手产品信息
const proEastProjectsJydsjrcpqueryById = (params)=>getAction("/proEastProjectsJydsjrcp/queryById",params);

// 添加交易对手机构信息
const proEastProjectsJydsjgAdd = (params)=>postAction("/proEastProjectsJydsjg/add",params);
// 修改交易对手机构信息
const proEastProjectsJydsjgEdit = (params)=>postAction("/proEastProjectsJydsjg/edit",params);
// 回显交易对手机构信息
const proEastProjectsJydsjgqueryById = (params)=>getAction("/proEastProjectsJydsjg/queryById",params);

//根据交易对手类型获取交易对手
const getCounterpartList=(params)=>getAction("/privateInvestment/queryByType",params);
//获取子账户信息
const getAccInfoList=(params)=>getAction("/privateInvestment/getAccInfoList",params);
//股权投资交易单提交
const  investmentAdd=(params)=>postAction("/privateInvestment/investmentAdd",params);
//股权交易单回显
const  investmentView=(params)=>getAction("/privateInvestment/investmentView",params);
//获取股权/合伙公司
const  getStockInfoList=(params)=>getAction("/privateInvestment/getStockInfoList",params);
//股权投资取消订单
const investmentConfirmOrCancel=(params)=>postAction("/privateInvestment/investmentConfirmOrCancel",params);

// 回显交易对手机构股东信息
const proEastProjectsJydsjggdqueryById = (params)=>getAction("/proEastProjectsJydsjggdxx/queryById",params);
// 添加交易对手机构股东信息
const proEastProjectsJydsjggdAdd = (params)=>postAction("/proEastProjectsJydsjggdxx/add",params);
// 添加交易对手机构股东信息
const proEastProjectsJydsjggdEdit = (params)=>postAction("/proEastProjectsJydsjggdxx/edit",params);


export {
  getDict,getAllDict,getProducts,getProductDetail,addProduct,editProduct,deleteProduct,deleteBatchProduct,
  addOpenRule,editOpenRule,addBonusRule,editBonusRule,getCusArea,getCusAreaList,getProAssetcats,getProInvTypes,
  getProInvCats,getProPfcats,getAdmOrgnaiztionInfo,editPrice,addPrice,addTrxCapitalFlows,editTrxCapitalFlows,getPrjList,
  getTrxCapitalFlow,matchTrxCapitalFlows,getAssetParam,addAssetParam,getInvlmtTemplate,addInvlmtTemplate,getAssetParamList,
  getProSettleAccounts,getPrjectInfoList,getCusAccInfoList,addSubscribe,queryCapitalAviAmt,getSubscribeInfo,confirmOrCancel,
  addOrdersOptLogs,ordersOptLogsList,addBaldividend,getCusInvestBal,addTranSell,gettranSellInfo,addDeposit,findFeeNamesMsg,
  getDepositInfo,getBaldividendInfo,addFee,getFeeInfo,findPayAccount,addBenefitsscribe,choosePrject,findBnfAvaSaving,
  baldividendConfirmOrCancel,chooseDistType,confirmOrCancelFee,getRelPartyList,getPrjAccInfoList,benefitsBack,transferOrCancel,
  orderBaseInfo,handMatch,benefitsConfirmOrCancel,chooseFundSearch,updateFlowsStatus,deleteFlowById,insurerInfo,queryOrderInfo,
  saveOrders,subAccountInformation,insuranceContract,findDataByPrjCode,asttransferView,asttransferAdd,cusAccInfoListByPrjCode,
  showAssignee,saveAssignee,showAdmOrganInfo,saveOrg,asttransferzyAdd,asttransferzyView,findProByPrjCode,charitableaidPrjectInfoList,
  findBnfByPrjCode,adjustAdd,adjustView,adjustConfirmOrCancle,queryAviAmt,showCusRecommendOrganInfo,cusRecommendOrgSave,
  getBonusRuleDetail,addBonusPlan,editBonusPlan,getOpenRuleDetail,addkfqPlan,editkfqPlan,mandatoryWithdrawal,findAviAmt,
  doSaveAdjust,getAdjustInfo,confirmOrCancelAdjust,getPrjOrderInfo,queryWkfInfoByBatchId,getPrjAssets,checkBankProCode,
  deleteOrder,proChange,checkRepeatContractNo,fundFlowSwitchStatus,queryPro,getOrderNum,findSumMapAmt,getCusAreaByAreaCode,getIdByProCode,
  makeBankProCode,checkContent,findRcvAccount,cusAccInfoListBybnfCode,findCusAccInfo,findCusInvestBal,doSaveOriginal,
  doSaveInde,indeView,queryInde,adjustFundAdd,adjustFundView,adjustFundConfirmOrCancle,addStock,editStock,saveOrUpdate,
  findById,affirmDeducTrustUnit,comfirmAssetUnit,getOriginalInfo,findAccount,getStockDetail,makeProCode,cancelOrdersOriginal,getEquityData,
  addCharitableaid,findCusBnfInfo,orderCharitableAidView,editCharitableaid,getPolicyInformation,getSourceOfFunds,
  proEastProjectsJydszhAdd,proEastProjectsJydszhEdit,proEastProjectsJydszhqueryById,proEastProjectsJydsjrcpqueryById,
  proEastProjectsJydsjrcpEdit,proEastProjectsJydsjrcpAdd,proEastProjectsJydsjgAdd,proEastProjectsJydsjgEdit,proEastProjectsJydsjgqueryById,
  getCounterpartList,getAccInfoList,investmentAdd,getStockInfoList,confirmedTransfer,affirmDrawing,investmentView,investmentConfirmOrCancel,
  proEastProjectsJydsjggdqueryById,proEastProjectsJydsjggdAdd,proEastProjectsJydsjggdEdit



}