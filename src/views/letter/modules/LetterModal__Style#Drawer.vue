<template>
  <a-drawer
      :title="title"
      :width="800"
      placement="right"
      :closable="false"
      @close="close"
      :visible="visible"
  >

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
      
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="项目系统编号">
          <a-input placeholder="请输入项目系统编号" v-decorator="['prjCode', validatorRules.prjCode ]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="项目模式
            M:市场部模式；T:二部模式">
          <a-input placeholder="请输入项目模式
            M:市场部模式；T:二部模式" v-decorator="['prjMode', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="尽调系统编号">
          <a-input placeholder="请输入尽调系统编号" v-decorator="['ddCode', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="项目编号">
          <a-input placeholder="请输入项目编号" v-decorator="['trustPrjCode', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="项目名称">
          <a-input placeholder="请输入项目名称" v-decorator="['trustPrjName', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="合同编号">
          <a-input placeholder="请输入合同编号" v-decorator="['contractNo', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="合同名称">
          <a-input placeholder="请输入合同名称" v-decorator="['contractName', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="风险申明书编号">
          <a-input placeholder="请输入风险申明书编号" v-decorator="['riskDeclarationNo', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="项目简称">
          <a-input placeholder="请输入项目简称" v-decorator="['trustPrjShortName', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="保管协议编号">
          <a-input placeholder="请输入保管协议编号" v-decorator="['custodyAgreementNo', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="保管协议名称">
          <a-input placeholder="请输入保管协议名称" v-decorator="['custodyAgreementName', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="信托财产初始委托申请书编号">
          <a-input placeholder="请输入信托财产初始委托申请书编号" v-decorator="['trutsInitCommAppNo', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="项目概述(P:资产保护;E:财富传承;I:财富增值)">
          <a-input placeholder="请输入项目概述(P:资产保护;E:财富传承;I:财富增值)" v-decorator="['trutsPurpose', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="信托项目类型(S:单一;M:集合;P:财产权)">
          <a-input placeholder="请输入信托项目类型(S:单一;M:集合;P:财产权)" v-decorator="['trustPrjType', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="合同类型（1:市场部-标准化、2:市场部-定制化、3:信托专户、4:信托二部-标准化、5:信托二部-定制化、6:信托二部-保险金）">
          <a-input placeholder="请输入合同类型（1:市场部-标准化、2:市场部-定制化、3:信托专户、4:信托二部-标准化、5:信托二部-定制化、6:信托二部-保险金）" v-decorator="['contractType', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="合同系列（1:传世系列;2:书香系列;3:天颐系列）">
          <a-input placeholder="请输入合同系列（1:传世系列;2:书香系列;3:天颐系列）" v-decorator="['contractSerie', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="客户推荐机构">
          <a-input placeholder="请输入客户推荐机构" v-decorator="['cusRecommendOrgCode', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="签署日">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'signingDt', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="单位净值是否归1">
          <a-input placeholder="请输入单位净值是否归1" v-decorator="['netAssetValueToOneYn', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="项目成立日">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'trustStdDt', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="项目成立日">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'trustEndDt', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="头尾处理(1:算头不算尾;2:算头算尾)">
          <a-input placeholder="请输入头尾处理(1:算头不算尾;2:算头算尾)" v-decorator="['enddayCalType', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="信托期限类型（1:年限，2:永续，3:其他）">
          <a-input placeholder="请输入信托期限类型（1:年限，2:永续，3:其他）" v-decorator="['trustTermType', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="信托期限年限">
          <a-input-number v-decorator="[ 'trustTermPeriod', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="信托期限-其他">
          <a-input placeholder="请输入信托期限-其他" v-decorator="['trustTermOth', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="信托终止日">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'trustExprDt', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="预计初始委托信托财产规模">
          <a-input-number v-decorator="[ 'initAssetAmount', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="币种">
          <a-input placeholder="请输入币种" v-decorator="['curCode', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="客户经理">
          <a-input placeholder="请输入客户经理" v-decorator="['rmCode', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="信托经理">
          <a-input placeholder="请输入信托经理" v-decorator="['tmCode', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="投资经理">
          <a-input placeholder="请输入投资经理" v-decorator="['imCode', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="交易员">
          <a-input placeholder="请输入交易员" v-decorator="['dlCode', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="信托财产专户类型(D:托管户；T:信托专户)">
          <a-input placeholder="请输入信托财产专户类型(D:托管户；T:信托专户)" v-decorator="['trustAccType', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="账户名称">
          <a-input placeholder="请输入账户名称" v-decorator="['accName', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="账号">
          <a-input placeholder="请输入账号" v-decorator="['accNo', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="开户行">
          <a-input placeholder="请输入开户行" v-decorator="['accOpenBank', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="开户日期">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'accOpenDate', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="信托账户类型（是否采用子账户架构）">
          <a-input placeholder="请输入信托账户类型（是否采用子账户架构）" v-decorator="['subaccYn', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="保管人">
          <a-input placeholder="请输入保管人" v-decorator="['bankCode', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="托管行是否开立子账户">
          <a-input placeholder="请输入托管行是否开立子账户" v-decorator="['bankSubaccYn', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="信托合同寄送地址/联系地址（CUS:委托人地址,OTH:独立填写，内容在联系人信息表）">
          <a-input placeholder="请输入信托合同寄送地址/联系地址（CUS:委托人地址,OTH:独立填写，内容在联系人信息表）" v-decorator="['contactsType', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="contId">
          <a-input-number v-decorator="[ 'contId', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="项目状态(R:存续期;E:清算中;C:已清算;D:已作废)">
          <a-input placeholder="请输入项目状态(R:存续期;E:清算中;C:已清算;D:已作废)" v-decorator="['prjStatus', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="项目成立审核状态(INIT:未提交;ADTING:审核中;AGREE:审核同意;REJECT:审核退回)">
          <a-input placeholder="请输入项目成立审核状态(INIT:未提交;ADTING:审核中;AGREE:审核同意;REJECT:审核退回)" v-decorator="['status', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="preWorkDoneYn">
          <a-input placeholder="请输入preWorkDoneYn" v-decorator="['preWorkDoneYn', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="invalidReason">
          <a-input placeholder="请输入invalidReason" v-decorator="['invalidReason', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="最新审核LOG ID">
          <a-input placeholder="请输入最新审核LOG ID" v-decorator="['lastLogId', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="lockYn">
          <a-input placeholder="请输入lockYn" v-decorator="['lockYn', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="branCode">
          <a-input placeholder="请输入branCode" v-decorator="['branCode', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="activeBnfRank">
          <a-input-number v-decorator="[ 'activeBnfRank', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="保管人-其他">
          <a-input placeholder="请输入保管人-其他" v-decorator="['bankCodeOth', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="activeSupRank">
          <a-input-number v-decorator="[ 'activeSupRank', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="信托财产清算完毕日">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'clearEndDt', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="清算报告日">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'clearRptDt', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="信托财产专户销户日">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'trustAccCloseDt', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="emCode">
          <a-input placeholder="请输入emCode" v-decorator="['emCode', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="dmCode">
          <a-input placeholder="请输入dmCode" v-decorator="['dmCode', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="cmCode">
          <a-input placeholder="请输入cmCode" v-decorator="['cmCode', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="TCMP项目内码">
          <a-input placeholder="请输入TCMP项目内码" v-decorator="['itfPrjCode', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="开户银行-其他">
          <a-input placeholder="请输入开户银行-其他" v-decorator="['accOpenBankOth', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="开户地址">
          <a-input placeholder="请输入开户地址" v-decorator="['accOpenAddress', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="开户支行">
          <a-input placeholder="请输入开户支行" v-decorator="['accOpenSubbank', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="华宝联系人">
          <a-input-number v-decorator="[ 'hContId', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="估值类型,PARAM_TYPE("VOA_TYPE")">
          <a-input placeholder="请输入估值类型,PARAM_TYPE("VOA_TYPE")" v-decorator="['voaType', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="分支机构代码">
          <a-input placeholder="请输入分支机构代码" v-decorator="['accOpenBranch', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="开户行所在地（省）">
          <a-input placeholder="请输入开户行所在地（省）" v-decorator="['addrProvCode', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="开户行所在地（市）">
          <a-input placeholder="请输入开户行所在地（市）" v-decorator="['addrCityCode', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否渠道客户">
          <a-input placeholder="请输入是否渠道客户" v-decorator="['cusChannelYn', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="渠道方">
          <a-input placeholder="请输入渠道方" v-decorator="['cusChannelSide', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="财务顾问机构代码">
          <a-input placeholder="请输入财务顾问机构代码" v-decorator="['cusFinancialOrgCode', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="披露方式">
          <a-input placeholder="请输入披露方式" v-decorator="['disMode', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="中信登编号">
          <a-input placeholder="请输入中信登编号" v-decorator="['cusCiticCode', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否签署购买货币基金，PARAM_TYPE("YN")">
          <a-input placeholder="请输入是否签署购买货币基金，PARAM_TYPE("YN")" v-decorator="['signCurrYn', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否签署购买现金增利，PARAM_TYPE("YN")">
          <a-input placeholder="请输入是否签署购买现金增利，PARAM_TYPE("YN")" v-decorator="['signCashYn', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="开户行编号">
          <a-input placeholder="请输入开户行编号" v-decorator="['accOpenBankCode', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="大额支付号">
          <a-input placeholder="请输入大额支付号" v-decorator="['bigAccNo', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="慈善信托备案回执编号">
          <a-input placeholder="请输入慈善信托备案回执编号" v-decorator="['trustRecordReceiptNo', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="客户来源; 0:财富客户 ; 1:外部客户">
          <a-input placeholder="请输入客户来源; 0:财富客户 ; 1:外部客户" v-decorator="['customerSource', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否估值">
          <a-input placeholder="请输入是否估值" v-decorator="['valuationYn', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="估值频率">
          <a-input placeholder="请输入估值频率" v-decorator="['valuationType', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="销售商名称">
          <a-input placeholder="请输入销售商名称" v-decorator="['venditoreName', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="信托产品总期限类型">
          <a-input placeholder="请输入信托产品总期限类型" v-decorator="['trustDateType', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="委托人及财产来源">
          <a-input placeholder="请输入委托人及财产来源" v-decorator="['clientAssetsSource', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="设立规模">
          <a-input-number v-decorator="[ 'setScaleAmt', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="项目来源">
          <a-input placeholder="请输入项目来源" v-decorator="['proSource', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="风险预案说明">
          <a-input placeholder="请输入风险预案说明" v-decorator="['riskProDesc', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="公司合法合规意见">
          <a-input placeholder="请输入公司合法合规意见" v-decorator="['companyLawOpinion', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="资金来源代码">
          <a-input placeholder="请输入资金来源代码" v-decorator="['moneySourceCode', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="拟发行或成立总规模类型">
          <a-input placeholder="请输入拟发行或成立总规模类型" v-decorator="['readyScopeType', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="分配方式">
          <a-input placeholder="请输入分配方式" v-decorator="['assigType', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="运行方式">
          <a-input placeholder="请输入运行方式" v-decorator="['runType', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="ta开户账号">
          <a-input placeholder="请输入ta开户账号" v-decorator="['taaccountid', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="主产品代码">
          <a-input placeholder="请输入主产品代码" v-decorator="['fundcode', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="productCode">
          <a-input placeholder="请输入productCode" v-decorator="['productCode', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="最后收取超额浮动信托报酬时间">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'lastChargeTime', {}]" />
        </a-form-item>
		
      </a-form>
    </a-spin>
    <a-button type="primary" @click="handleOk">确定</a-button>
    <a-button type="primary" @click="handleCancel">取消</a-button>
  </a-drawer>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "CusLoaInfoModal",
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },

        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
        prjCode:{rules: [{ required: true, message: '请输入项目系统编号!' }]},
        },
        url: {
          add: "/cn/cusLoaInfo/add",
          edit: "/cn/cusLoaInfo/edit",
        },
      }
    },
    created () {
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'prjCode','prjMode','ddCode','trustPrjCode','trustPrjName','contractNo','contractName','riskDeclarationNo','trustPrjShortName','custodyAgreementNo','custodyAgreementName','trutsInitCommAppNo','trutsPurpose','trustPrjType','contractType','contractSerie','cusRecommendOrgCode','netAssetValueToOneYn','enddayCalType','trustTermType','trustTermPeriod','trustTermOth','initAssetAmount','curCode','rmCode','tmCode','imCode','dlCode','trustAccType','accName','accNo','accOpenBank','subaccYn','bankCode','bankSubaccYn','contactsType','contId','prjStatus','status','preWorkDoneYn','invalidReason','lastLogId','lockYn','branCode','activeBnfRank','bankCodeOth','activeSupRank','emCode','dmCode','cmCode','itfPrjCode','accOpenBankOth','accOpenAddress','accOpenSubbank','hContId','voaType','accOpenBranch','addrProvCode','addrCityCode','cusChannelYn','cusChannelSide','cusFinancialOrgCode','disMode','cusCiticCode','signCurrYn','signCashYn','accOpenBankCode','bigAccNo','trustRecordReceiptNo','customerSource','valuationYn','valuationType','venditoreName','trustDateType','clientAssetsSource','setScaleAmt','proSource','riskProDesc','companyLawOpinion','moneySourceCode','readyScopeType','assigType','runType','taaccountid','fundcode','productCode'))
		  //时间格式化
          this.form.setFieldsValue({signingDt:this.model.signingDt?moment(this.model.signingDt):null})
          this.form.setFieldsValue({trustStdDt:this.model.trustStdDt?moment(this.model.trustStdDt):null})
          this.form.setFieldsValue({trustEndDt:this.model.trustEndDt?moment(this.model.trustEndDt):null})
          this.form.setFieldsValue({trustExprDt:this.model.trustExprDt?moment(this.model.trustExprDt):null})
          this.form.setFieldsValue({accOpenDate:this.model.accOpenDate?moment(this.model.accOpenDate):null})
          this.form.setFieldsValue({clearEndDt:this.model.clearEndDt?moment(this.model.clearEndDt):null})
          this.form.setFieldsValue({clearRptDt:this.model.clearRptDt?moment(this.model.clearRptDt):null})
          this.form.setFieldsValue({trustAccCloseDt:this.model.trustAccCloseDt?moment(this.model.trustAccCloseDt):null})
          this.form.setFieldsValue({lastChargeTime:this.model.lastChargeTime?moment(this.model.lastChargeTime):null})
        });

      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            let formData = Object.assign(this.model, values);
            //时间格式化
            formData.signingDt = formData.signingDt?formData.signingDt.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.trustStdDt = formData.trustStdDt?formData.trustStdDt.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.trustEndDt = formData.trustEndDt?formData.trustEndDt.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.trustExprDt = formData.trustExprDt?formData.trustExprDt.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.accOpenDate = formData.accOpenDate?formData.accOpenDate.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.clearEndDt = formData.clearEndDt?formData.clearEndDt.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.clearRptDt = formData.clearRptDt?formData.clearRptDt.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.trustAccCloseDt = formData.trustAccCloseDt?formData.trustAccCloseDt.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.lastChargeTime = formData.lastChargeTime?formData.lastChargeTime.format('YYYY-MM-DD HH:mm:ss'):null;
            
            console.log(formData)
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
            })



          }
        })
      },
      handleCancel () {
        this.close()
      },


    }
  }
</script>

<style lang="less" scoped>
/** Button按钮间距 */
  .ant-btn {
    margin-left: 30px;
    margin-bottom: 30px;
    float: right;
  }
</style>