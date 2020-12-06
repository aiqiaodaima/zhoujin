<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    
    <a-spin :spinning="confirmLoading">
      <a-form-model :model="form" :rules="rules" ref="form">
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="项目系统编号"
          prop="prjCode">
          <a-input placeholder="请输入项目系统编号" v-model="prjCode" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="项目模式
            M:市场部模式；T:二部模式"
          prop="prjMode">
          <a-input placeholder="请输入项目模式
            M:市场部模式；T:二部模式" v-model="prjMode" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="尽调系统编号"
          prop="ddCode">
          <a-input placeholder="请输入尽调系统编号" v-model="ddCode" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="项目编号"
          prop="trustPrjCode">
          <a-input placeholder="请输入项目编号" v-model="trustPrjCode" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="项目名称"
          prop="trustPrjName">
          <a-input placeholder="请输入项目名称" v-model="trustPrjName" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="合同编号"
          prop="contractNo">
          <a-input placeholder="请输入合同编号" v-model="contractNo" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="合同名称"
          prop="contractName">
          <a-input placeholder="请输入合同名称" v-model="contractName" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="风险申明书编号"
          prop="riskDeclarationNo">
          <a-input placeholder="请输入风险申明书编号" v-model="riskDeclarationNo" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="项目简称"
          prop="trustPrjShortName">
          <a-input placeholder="请输入项目简称" v-model="trustPrjShortName" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="保管协议编号"
          prop="custodyAgreementNo">
          <a-input placeholder="请输入保管协议编号" v-model="custodyAgreementNo" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="保管协议名称"
          prop="custodyAgreementName">
          <a-input placeholder="请输入保管协议名称" v-model="custodyAgreementName" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="信托财产初始委托申请书编号"
          prop="trutsInitCommAppNo">
          <a-input placeholder="请输入信托财产初始委托申请书编号" v-model="trutsInitCommAppNo" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="项目概述(P:资产保护;E:财富传承;I:财富增值)"
          prop="trutsPurpose">
          <a-input placeholder="请输入项目概述(P:资产保护;E:财富传承;I:财富增值)" v-model="trutsPurpose" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="信托项目类型(S:单一;M:集合;P:财产权)"
          prop="trustPrjType">
          <a-input placeholder="请输入信托项目类型(S:单一;M:集合;P:财产权)" v-model="trustPrjType" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="合同类型（1:市场部-标准化、2:市场部-定制化、3:信托专户、4:信托二部-标准化、5:信托二部-定制化、6:信托二部-保险金）"
          prop="contractType">
          <a-input placeholder="请输入合同类型（1:市场部-标准化、2:市场部-定制化、3:信托专户、4:信托二部-标准化、5:信托二部-定制化、6:信托二部-保险金）" v-model="contractType" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="合同系列（1:传世系列;2:书香系列;3:天颐系列）"
          prop="contractSerie">
          <a-input placeholder="请输入合同系列（1:传世系列;2:书香系列;3:天颐系列）" v-model="contractSerie" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="客户推荐机构"
          prop="cusRecommendOrgCode">
          <a-input placeholder="请输入客户推荐机构" v-model="cusRecommendOrgCode" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="签署日"
          prop="signingDt">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-model="signingDt" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="单位净值是否归1"
          prop="netAssetValueToOneYn">
          <a-input placeholder="请输入单位净值是否归1" v-model="netAssetValueToOneYn" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="项目成立日"
          prop="trustStdDt">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-model="trustStdDt" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="项目成立日"
          prop="trustEndDt">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-model="trustEndDt" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="头尾处理(1:算头不算尾;2:算头算尾)"
          prop="enddayCalType">
          <a-input placeholder="请输入头尾处理(1:算头不算尾;2:算头算尾)" v-model="enddayCalType" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="信托期限类型（1:年限，2:永续，3:其他）"
          prop="trustTermType">
          <a-input placeholder="请输入信托期限类型（1:年限，2:永续，3:其他）" v-model="trustTermType" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="信托期限年限"
          prop="trustTermPeriod">
          <a-input-number v-model="trustTermPeriod" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="信托期限-其他"
          prop="trustTermOth">
          <a-input placeholder="请输入信托期限-其他" v-model="trustTermOth" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="信托终止日"
          prop="trustExprDt">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-model="trustExprDt" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="预计初始委托信托财产规模"
          prop="initAssetAmount">
          <a-input-number v-model="initAssetAmount" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="币种"
          prop="curCode">
          <a-input placeholder="请输入币种" v-model="curCode" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="客户经理"
          prop="rmCode">
          <a-input placeholder="请输入客户经理" v-model="rmCode" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="信托经理"
          prop="tmCode">
          <a-input placeholder="请输入信托经理" v-model="tmCode" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="投资经理"
          prop="imCode">
          <a-input placeholder="请输入投资经理" v-model="imCode" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="交易员"
          prop="dlCode">
          <a-input placeholder="请输入交易员" v-model="dlCode" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="信托财产专户类型(D:托管户；T:信托专户)"
          prop="trustAccType">
          <a-input placeholder="请输入信托财产专户类型(D:托管户；T:信托专户)" v-model="trustAccType" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="账户名称"
          prop="accName">
          <a-input placeholder="请输入账户名称" v-model="accName" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="账号"
          prop="accNo">
          <a-input placeholder="请输入账号" v-model="accNo" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="开户行"
          prop="accOpenBank">
          <a-input placeholder="请输入开户行" v-model="accOpenBank" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="开户日期"
          prop="accOpenDate">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-model="accOpenDate" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="信托账户类型（是否采用子账户架构）"
          prop="subaccYn">
          <a-input placeholder="请输入信托账户类型（是否采用子账户架构）" v-model="subaccYn" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="保管人"
          prop="bankCode">
          <a-input placeholder="请输入保管人" v-model="bankCode" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="托管行是否开立子账户"
          prop="bankSubaccYn">
          <a-input placeholder="请输入托管行是否开立子账户" v-model="bankSubaccYn" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="信托合同寄送地址/联系地址（CUS:委托人地址,OTH:独立填写，内容在联系人信息表）"
          prop="contactsType">
          <a-input placeholder="请输入信托合同寄送地址/联系地址（CUS:委托人地址,OTH:独立填写，内容在联系人信息表）" v-model="contactsType" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="contId"
          prop="contId">
          <a-input-number v-model="contId" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="项目状态(R:存续期;E:清算中;C:已清算;D:已作废)"
          prop="prjStatus">
          <a-input placeholder="请输入项目状态(R:存续期;E:清算中;C:已清算;D:已作废)" v-model="prjStatus" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="项目成立审核状态(INIT:未提交;ADTING:审核中;AGREE:审核同意;REJECT:审核退回)"
          prop="status">
          <a-input placeholder="请输入项目成立审核状态(INIT:未提交;ADTING:审核中;AGREE:审核同意;REJECT:审核退回)" v-model="status" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="preWorkDoneYn"
          prop="preWorkDoneYn">
          <a-input placeholder="请输入preWorkDoneYn" v-model="preWorkDoneYn" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="invalidReason"
          prop="invalidReason">
          <a-input placeholder="请输入invalidReason" v-model="invalidReason" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="最新审核LOG ID"
          prop="lastLogId">
          <a-input placeholder="请输入最新审核LOG ID" v-model="lastLogId" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="lockYn"
          prop="lockYn">
          <a-input placeholder="请输入lockYn" v-model="lockYn" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="branCode"
          prop="branCode">
          <a-input placeholder="请输入branCode" v-model="branCode" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="activeBnfRank"
          prop="activeBnfRank">
          <a-input-number v-model="activeBnfRank" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="保管人-其他"
          prop="bankCodeOth">
          <a-input placeholder="请输入保管人-其他" v-model="bankCodeOth" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="activeSupRank"
          prop="activeSupRank">
          <a-input-number v-model="activeSupRank" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="信托财产清算完毕日"
          prop="clearEndDt">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-model="clearEndDt" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="清算报告日"
          prop="clearRptDt">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-model="clearRptDt" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="信托财产专户销户日"
          prop="trustAccCloseDt">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-model="trustAccCloseDt" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="emCode"
          prop="emCode">
          <a-input placeholder="请输入emCode" v-model="emCode" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="dmCode"
          prop="dmCode">
          <a-input placeholder="请输入dmCode" v-model="dmCode" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="cmCode"
          prop="cmCode">
          <a-input placeholder="请输入cmCode" v-model="cmCode" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="TCMP项目内码"
          prop="itfPrjCode">
          <a-input placeholder="请输入TCMP项目内码" v-model="itfPrjCode" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="开户银行-其他"
          prop="accOpenBankOth">
          <a-input placeholder="请输入开户银行-其他" v-model="accOpenBankOth" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="开户地址"
          prop="accOpenAddress">
          <a-input placeholder="请输入开户地址" v-model="accOpenAddress" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="开户支行"
          prop="accOpenSubbank">
          <a-input placeholder="请输入开户支行" v-model="accOpenSubbank" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="华宝联系人"
          prop="hContId">
          <a-input-number v-model="hContId" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="估值类型,PARAM_TYPE("VOA_TYPE")"
          prop="voaType">
          <a-input placeholder="请输入估值类型,PARAM_TYPE("VOA_TYPE")" v-model="voaType" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="分支机构代码"
          prop="accOpenBranch">
          <a-input placeholder="请输入分支机构代码" v-model="accOpenBranch" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="开户行所在地（省）"
          prop="addrProvCode">
          <a-input placeholder="请输入开户行所在地（省）" v-model="addrProvCode" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="开户行所在地（市）"
          prop="addrCityCode">
          <a-input placeholder="请输入开户行所在地（市）" v-model="addrCityCode" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否渠道客户"
          prop="cusChannelYn">
          <a-input placeholder="请输入是否渠道客户" v-model="cusChannelYn" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="渠道方"
          prop="cusChannelSide">
          <a-input placeholder="请输入渠道方" v-model="cusChannelSide" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="财务顾问机构代码"
          prop="cusFinancialOrgCode">
          <a-input placeholder="请输入财务顾问机构代码" v-model="cusFinancialOrgCode" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="披露方式"
          prop="disMode">
          <a-input placeholder="请输入披露方式" v-model="disMode" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="中信登编号"
          prop="cusCiticCode">
          <a-input placeholder="请输入中信登编号" v-model="cusCiticCode" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否签署购买货币基金，PARAM_TYPE("YN")"
          prop="signCurrYn">
          <a-input placeholder="请输入是否签署购买货币基金，PARAM_TYPE("YN")" v-model="signCurrYn" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否签署购买现金增利，PARAM_TYPE("YN")"
          prop="signCashYn">
          <a-input placeholder="请输入是否签署购买现金增利，PARAM_TYPE("YN")" v-model="signCashYn" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="开户行编号"
          prop="accOpenBankCode">
          <a-input placeholder="请输入开户行编号" v-model="accOpenBankCode" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="大额支付号"
          prop="bigAccNo">
          <a-input placeholder="请输入大额支付号" v-model="bigAccNo" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="慈善信托备案回执编号"
          prop="trustRecordReceiptNo">
          <a-input placeholder="请输入慈善信托备案回执编号" v-model="trustRecordReceiptNo" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="客户来源; 0:财富客户 ; 1:外部客户"
          prop="customerSource">
          <a-input placeholder="请输入客户来源; 0:财富客户 ; 1:外部客户" v-model="customerSource" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否估值"
          prop="valuationYn">
          <a-input placeholder="请输入是否估值" v-model="valuationYn" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="估值频率"
          prop="valuationType">
          <a-input placeholder="请输入估值频率" v-model="valuationType" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="销售商名称"
          prop="venditoreName">
          <a-input placeholder="请输入销售商名称" v-model="venditoreName" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="信托产品总期限类型"
          prop="trustDateType">
          <a-input placeholder="请输入信托产品总期限类型" v-model="trustDateType" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="委托人及财产来源"
          prop="clientAssetsSource">
          <a-input placeholder="请输入委托人及财产来源" v-model="clientAssetsSource" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="设立规模"
          prop="setScaleAmt">
          <a-input-number v-model="setScaleAmt" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="项目来源"
          prop="proSource">
          <a-input placeholder="请输入项目来源" v-model="proSource" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="风险预案说明"
          prop="riskProDesc">
          <a-input placeholder="请输入风险预案说明" v-model="riskProDesc" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="公司合法合规意见"
          prop="companyLawOpinion">
          <a-input placeholder="请输入公司合法合规意见" v-model="companyLawOpinion" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="资金来源代码"
          prop="moneySourceCode">
          <a-input placeholder="请输入资金来源代码" v-model="moneySourceCode" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="拟发行或成立总规模类型"
          prop="readyScopeType">
          <a-input placeholder="请输入拟发行或成立总规模类型" v-model="readyScopeType" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="分配方式"
          prop="assigType">
          <a-input placeholder="请输入分配方式" v-model="assigType" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="运行方式"
          prop="runType">
          <a-input placeholder="请输入运行方式" v-model="runType" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="ta开户账号"
          prop="taaccountid">
          <a-input placeholder="请输入ta开户账号" v-model="taaccountid" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="主产品代码"
          prop="fundcode">
          <a-input placeholder="请输入主产品代码" v-model="fundcode" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="productCode"
          prop="productCode">
          <a-input placeholder="请输入productCode" v-model="productCode" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="最后收取超额浮动信托报酬时间"
          prop="lastChargeTime">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-model="lastChargeTime" />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import dictMixin from '@/mixins/dictMixin'

  export default {
    name: "CusLoaInfoModal",
    mixins:[dictMixin],
    data () {
      return {
        title:"操作",
        optType:'',
        visible: false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },

        confirmLoading: false,
        form: {},
        rules:{

        prjCode:{rules: [{ required: true, message: '请输入项目系统编号!' }]},


        ddCode:{rules: [{ required: true, message: '请输入尽调系统编号!' }]},


        trustPrjCode:{rules: [{ required: true, message: '请输入项目编号!' }]},


        trustPrjName:{rules: [{ required: true, message: '请输入项目名称!' }]},


        contractNo:{rules: [{ required: true, message: '请输入合同编号!' }]},


        contractName:{rules: [{ required: true, message: '请输入合同名称!' }]},


        riskDeclarationNo:{rules: [{ required: true, message: '请输入风险申明书编号!' }]},


        trustPrjShortName:{rules: [{ required: true, message: '请输入项目简称!' }]},


        custodyAgreementNo:{rules: [{ required: true, message: '请输入保管协议编号!' }]},


        custodyAgreementName:{rules: [{ required: true, message: '请输入保管协议名称!' }]},


        trutsInitCommAppNo:{rules: [{ required: true, message: '请输入信托财产初始委托申请书编号!' }]},


        trutsPurpose:{rules: [{ required: true, message: '请输入项目概述(P:资产保护;E:财富传承;I:财富增值)!' }]},


        trustPrjType:{rules: [{ required: true, message: '请输入信托项目类型(S:单一;M:集合;P:财产权)!' }]},


        contractType:{rules: [{ required: true, message: '请输入合同类型（1:市场部-标准化、2:市场部-定制化、3:信托专户、4:信托二部-标准化、5:信托二部-定制化、6:信托二部-保险金）!' }]},


        contractSerie:{rules: [{ required: true, message: '请输入合同系列（1:传世系列;2:书香系列;3:天颐系列）!' }]},


        cusRecommendOrgCode:{rules: [{ required: true, message: '请输入客户推荐机构!' }]},


        signingDt:{rules: [{ required: true, message: '请输入签署日!' }]},


        netAssetValueToOneYn:{rules: [{ required: true, message: '请输入单位净值是否归1!' }]},


        trustStdDt:{rules: [{ required: true, message: '请输入项目成立日!' }]},


        trustEndDt:{rules: [{ required: true, message: '请输入项目成立日!' }]},


        enddayCalType:{rules: [{ required: true, message: '请输入头尾处理(1:算头不算尾;2:算头算尾)!' }]},


        trustTermType:{rules: [{ required: true, message: '请输入信托期限类型（1:年限，2:永续，3:其他）!' }]},


        trustTermPeriod:{rules: [{ required: true, message: '请输入信托期限年限!' }]},


        trustTermOth:{rules: [{ required: true, message: '请输入信托期限-其他!' }]},


        trustExprDt:{rules: [{ required: true, message: '请输入信托终止日!' }]},


        initAssetAmount:{rules: [{ required: true, message: '请输入预计初始委托信托财产规模!' }]},


        curCode:{rules: [{ required: true, message: '请输入币种!' }]},


        rmCode:{rules: [{ required: true, message: '请输入客户经理!' }]},


        tmCode:{rules: [{ required: true, message: '请输入信托经理!' }]},


        imCode:{rules: [{ required: true, message: '请输入投资经理!' }]},


        dlCode:{rules: [{ required: true, message: '请输入交易员!' }]},


        trustAccType:{rules: [{ required: true, message: '请输入信托财产专户类型(D:托管户；T:信托专户)!' }]},


        accName:{rules: [{ required: true, message: '请输入账户名称!' }]},


        accNo:{rules: [{ required: true, message: '请输入账号!' }]},


        accOpenBank:{rules: [{ required: true, message: '请输入开户行!' }]},


        accOpenDate:{rules: [{ required: true, message: '请输入开户日期!' }]},


        subaccYn:{rules: [{ required: true, message: '请输入信托账户类型（是否采用子账户架构）!' }]},


        bankCode:{rules: [{ required: true, message: '请输入保管人!' }]},


        bankSubaccYn:{rules: [{ required: true, message: '请输入托管行是否开立子账户!' }]},


        contactsType:{rules: [{ required: true, message: '请输入信托合同寄送地址/联系地址（CUS:委托人地址,OTH:独立填写，内容在联系人信息表）!' }]},


        contId:{rules: [{ required: true, message: '请输入contId!' }]},


        prjStatus:{rules: [{ required: true, message: '请输入项目状态(R:存续期;E:清算中;C:已清算;D:已作废)!' }]},


        status:{rules: [{ required: true, message: '请输入项目成立审核状态(INIT:未提交;ADTING:审核中;AGREE:审核同意;REJECT:审核退回)!' }]},


        preWorkDoneYn:{rules: [{ required: true, message: '请输入preWorkDoneYn!' }]},


        invalidReason:{rules: [{ required: true, message: '请输入invalidReason!' }]},


        lastLogId:{rules: [{ required: true, message: '请输入最新审核LOG ID!' }]},


        lockYn:{rules: [{ required: true, message: '请输入lockYn!' }]},


        branCode:{rules: [{ required: true, message: '请输入branCode!' }]},


        activeBnfRank:{rules: [{ required: true, message: '请输入activeBnfRank!' }]},


        bankCodeOth:{rules: [{ required: true, message: '请输入保管人-其他!' }]},


        activeSupRank:{rules: [{ required: true, message: '请输入activeSupRank!' }]},


        clearEndDt:{rules: [{ required: true, message: '请输入信托财产清算完毕日!' }]},


        clearRptDt:{rules: [{ required: true, message: '请输入清算报告日!' }]},


        trustAccCloseDt:{rules: [{ required: true, message: '请输入信托财产专户销户日!' }]},


        emCode:{rules: [{ required: true, message: '请输入emCode!' }]},


        dmCode:{rules: [{ required: true, message: '请输入dmCode!' }]},


        cmCode:{rules: [{ required: true, message: '请输入cmCode!' }]},


        itfPrjCode:{rules: [{ required: true, message: '请输入TCMP项目内码!' }]},


        accOpenBankOth:{rules: [{ required: true, message: '请输入开户银行-其他!' }]},


        accOpenAddress:{rules: [{ required: true, message: '请输入开户地址!' }]},


        accOpenSubbank:{rules: [{ required: true, message: '请输入开户支行!' }]},


        hContId:{rules: [{ required: true, message: '请输入华宝联系人!' }]},


        voaType:{rules: [{ required: true, message: '请输入估值类型,PARAM_TYPE("VOA_TYPE")!' }]},


        accOpenBranch:{rules: [{ required: true, message: '请输入分支机构代码!' }]},


        addrProvCode:{rules: [{ required: true, message: '请输入开户行所在地（省）!' }]},


        addrCityCode:{rules: [{ required: true, message: '请输入开户行所在地（市）!' }]},


        cusChannelYn:{rules: [{ required: true, message: '请输入是否渠道客户!' }]},


        cusChannelSide:{rules: [{ required: true, message: '请输入渠道方!' }]},


        cusFinancialOrgCode:{rules: [{ required: true, message: '请输入财务顾问机构代码!' }]},


        disMode:{rules: [{ required: true, message: '请输入披露方式!' }]},


        cusCiticCode:{rules: [{ required: true, message: '请输入中信登编号!' }]},


        signCurrYn:{rules: [{ required: true, message: '请输入是否签署购买货币基金，PARAM_TYPE("YN")!' }]},


        signCashYn:{rules: [{ required: true, message: '请输入是否签署购买现金增利，PARAM_TYPE("YN")!' }]},


        accOpenBankCode:{rules: [{ required: true, message: '请输入开户行编号!' }]},


        bigAccNo:{rules: [{ required: true, message: '请输入大额支付号!' }]},


        trustRecordReceiptNo:{rules: [{ required: true, message: '请输入慈善信托备案回执编号!' }]},


        customerSource:{rules: [{ required: true, message: '请输入客户来源; 0:财富客户 ; 1:外部客户!' }]},


        valuationYn:{rules: [{ required: true, message: '请输入是否估值!' }]},


        valuationType:{rules: [{ required: true, message: '请输入估值频率!' }]},


        venditoreName:{rules: [{ required: true, message: '请输入销售商名称!' }]},


        trustDateType:{rules: [{ required: true, message: '请输入信托产品总期限类型!' }]},


        clientAssetsSource:{rules: [{ required: true, message: '请输入委托人及财产来源!' }]},


        setScaleAmt:{rules: [{ required: true, message: '请输入设立规模!' }]},


        proSource:{rules: [{ required: true, message: '请输入项目来源!' }]},


        riskProDesc:{rules: [{ required: true, message: '请输入风险预案说明!' }]},


        companyLawOpinion:{rules: [{ required: true, message: '请输入公司合法合规意见!' }]},


        moneySourceCode:{rules: [{ required: true, message: '请输入资金来源代码!' }]},


        readyScopeType:{rules: [{ required: true, message: '请输入拟发行或成立总规模类型!' }]},


        assigType:{rules: [{ required: true, message: '请输入分配方式!' }]},


        runType:{rules: [{ required: true, message: '请输入运行方式!' }]},


        taaccountid:{rules: [{ required: true, message: '请输入ta开户账号!' }]},


        fundcode:{rules: [{ required: true, message: '请输入主产品代码!' }]},


        productCode:{rules: [{ required: true, message: '请输入productCode!' }]},


        lastChargeTime:{rules: [{ required: true, message: '请输入最后收取超额浮动信托报酬时间!' }]},

        },
        url: {
          add: "/cn/cusLoaInfo/add",
          edit: "/cn/cusLoaInfo/edit",
        },
      }
    },
    created () {
        //this.getDict('    ');
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.form = record;
        this.visible = true;
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true;
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            });
          }
        });
      },
      handleCancel () {
        this.close()
      }
    }
  }
</script>

<style lang="less" scoped>

</style>