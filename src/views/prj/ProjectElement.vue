<template>
  <div style="background: rgb(240, 242, 245)">
    <a-spin :spinning="loading">
      <a-form-model :model="form" :rules="rules" ref="prjEleForm" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }">
        <a-layout>
          <a-layout-content>
            <a-card size="small" title="基本信息" :bordered="false">
              <a-row :gutter="24">
                <div v-if="customizeEnv == 'zrt'">
                  <a-col :span="8">
                    <a-form-model-item label="合同类型" prop="cli.contractType">
                      <j-d-select-tag
                        id="contractType"
                        v-model="form.cli.contractType"
                        dict-code="CONTRACT_TYPE"
                        @change="contractTypeChange()"
                      ></j-d-select-tag>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-model-item label="合同系列" prop="cli.contractType">
                      <j-d-select-tag
                        id="contractSerie"
                        :need-empty-option="true"
                        v-model="form.cli.contractSerie"
                        dict-code="CONTRACT_SERIE"
                      ></j-d-select-tag>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-model-item label="合同编号">
                      <a-input id="contractNo" placeholder="请输入合同编号" v-model="form.cli.contractNo"></a-input>
                    </a-form-model-item>
                  </a-col>
                </div>

                <a-col :span="8">
                  <a-form-model-item label="项目编号" prop="cli.trustPrjCode">
                    <a-input
                      id="trustPrjCode"
                      placeholder="请输入项目编号"
                      v-model="form.cli.trustPrjCode"
                      @blur.native.capture="changeTrustPrjCode"
                    ></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="项目名称" prop="cli.trustPrjName">
                    <a-input id="trustPrjName" placeholder="请输入项目名称" v-model="form.cli.trustPrjName"></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="项目简称" prop="cli.trustPrjShortName">
                    <a-input
                      id="trustPrjShortName"
                      placeholder="请输入项目简称"
                      v-model="form.cli.trustPrjShortName"
                    ></a-input>
                  </a-form-model-item>
                </a-col>

                <a-col :span="8" v-if="customizeEnv != 'zrt'">
                  <a-form-model-item label="合同类型" prop="cli.contractType">
                    <j-d-select-tag
                      id="contractType"
                      v-model="form.cli.contractType"
                      dict-code="CONTRACT_TYPE"
                      @change="contractTypeChange()"
                    ></j-d-select-tag>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8" v-if="customizeEnv != 'zrt'">
                  <a-form-model-item label="合同系列" prop="cli.contractType">
                    <j-d-select-tag
                      id="contractSerie"
                      :need-empty-option="true"
                      v-model="form.cli.contractSerie"
                      dict-code="CONTRACT_SERIE"
                    ></j-d-select-tag>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="中信登编号">
                    <a-input id="cusCiticCode" placeholder="请输入中信登编号" v-model="form.cli.cusCiticCode"></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8" v-if="customizeEnv != 'zrt'"
                  ><!--prop="cli.contractNo"-->
                  <a-form-model-item label="合同编号">
                    <a-input id="contractNo" placeholder="请输入合同编号" v-model="form.cli.contractNo"></a-input>
                  </a-form-model-item>
                </a-col>
                <template v-if="customizeEnv === 'sdic'">
                  <a-col :span="8"
                    ><!--prop="cli.contractName"-->
                    <a-form-model-item label="合同名称">
                      <a-input id="contractName" placeholder="请输入合同名称" v-model="form.cli.contractName"></a-input>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="8"
                    ><!--prop="cli.custodyAgreementNo"-->
                    <a-form-model-item label="保管合同编号">
                      <a-input
                        id="custodyAgreementNo"
                        placeholder="请输入保管合同编号"
                        v-model="form.cli.custodyAgreementNo"
                      ></a-input>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="8"
                    ><!--prop="cli.custodyAgreementName"-->
                    <a-form-model-item label="保管合同名称">
                      <a-input
                        id="custodyAgreementName"
                        placeholder="请输入保管合同名称"
                        v-model="form.cli.custodyAgreementName"
                      ></a-input>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="8"
                    ><!--prop="cli.financialConsultantNo"-->
                    <a-form-model-item label="财务顾问合同编号">
                      <a-input
                        id="financialConsultantNo"
                        placeholder="请输入财务顾问合同编号"
                        v-model="form.cli.financialConsultantNo"
                      ></a-input>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="8"
                    ><!--prop="cli.financialConsultantName"-->
                    <a-form-model-item label="财务顾问合同名称">
                      <a-input
                        id="financialConsultantName"
                        placeholder="请输入财务顾问合同名称"
                        v-model="form.cli.financialConsultantName"
                      ></a-input>
                    </a-form-model-item>
                  </a-col>
                </template>
                <a-col :span="8">
                  <a-form-model-item label="产品代码">
                    <a-input id="productCode" placeholder="请输入产品代码" v-model="form.cli.productCode"></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="慈善备案回执编号" :labelCol="{ span: 12 }" :wrapperCol="{ span: 12 }">
                    <a-input
                      id="trustRecordReceiptNo"
                      placeholder="请输入慈善备案回执编号"
                      v-model="form.cli.trustRecordReceiptNo"
                    ></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <!--      <a-form-model-item   label="初始信托规模(元)"
                                       :labelCol="{span: 12}"
                                       :wrapperCol="{span: 12}"
                                       prop="cli.setScaleAmt"
                  >
                    <a-input-number
                      id="setScaleAmt"
                      :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                      style="width:100%;"
                      :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                      placeholder="请输入初始信托规模"
                      :min="2"
                      v-model="form.cli.setScaleAmt"
                    ></a-input-number>
                  </a-form-model-item>-->

                  <a-form-model-item
                    label="初始信托规模(元)"
                    :labelCol="{ span: 12 }"
                    :wrapperCol="{ span: 12 }"
                    prop="cli.setScaleAmt"
                  >
                    <a-tooltip :trigger="['focus', 'hover']" placement="topLeft" overlay-class-name="numeric-input">
                      <span v-if="showtip !== ''" slot="title" class="numeric-input-title">
                        {{ showtip }}
                      </span>
                      <template v-else slot="title"> 请输入数字 </template>
                      <a-input-number
                        id="setScaleAmt"
                        :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                        style="width: 100%"
                        :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                        placeholder="请输入初始信托规模"
                        :min="2"
                        :precision="2"
                        v-model="form.cli.setScaleAmt"
                      ></a-input-number>
                    </a-tooltip>
                  </a-form-model-item>
                </a-col>

             
                  <a-col :span="8" v-if="customizeEnv === 'zrt'">
                    <a-form-model-item
                      label="追加免尽调额度(元)"
                      :labelCol="{ span: 12 }"
                      :wrapperCol="{ span: 12 }"
                    >
                      <a-tooltip :trigger="['focus', 'hover']" placement="topLeft" overlay-class-name="numeric-input">
                        <span v-if="showtipEfdd !== ''" slot="title" class="numeric-input-title">
                          {{ showtipEfdd }}
                        </span>
                        <template v-else slot="title"> 请输入数字 </template>
                        <a-input-number
                          id="exemptionFromDueDiligence"
                          :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                          style="width: 100%"
                          :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                          placeholder="请输入追加免尽调额度"
                          :min="2"
                          :precision="2"
                          v-model="form.cli.exemptionFromDueDiligence"
                        ></a-input-number>
                      </a-tooltip>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="8" v-if="customizeEnv === 'zrt'">
                    <a-form-model-item
                      label="追加配偶同意函内额度(元)"
                      :labelCol="{ span: 12 }"
                      :wrapperCol="{ span: 12 }"
                    >
                      <a-tooltip :trigger="['focus', 'hover']" placement="topLeft" overlay-class-name="numeric-input">
                        <span v-if="showtipScl !== ''" slot="title" class="numeric-input-title">
                          {{ showtipScl }}
                        </span>
                        <template v-else slot="title"> 请输入数字 </template>
                        <a-input-number
                          id="spouseConsentLimit"
                          :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                          style="width: 100%"
                          :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                          placeholder="请输入追加配偶同意函内额度"
                          :min="2"
                          :precision="2"
                          v-model="form.cli.spouseConsentLimit"
                        ></a-input-number>
                      </a-tooltip>
                    </a-form-model-item>
                  </a-col>
               

                <a-col :span="24">
                  <a-form-model-item label="信托目的" :labelCol="{ span: 3 }" :wrapperCol="{ span: 21 }">
                    <a-textarea
                      id="trutsPurpose"
                      class="no-resize"
                      placeholder="请输入信托目的"
                      v-model="form.cli.trutsPurpose"
                      allowClear
                      :rows="4"
                    ></a-textarea>
                  </a-form-model-item>
                </a-col>
                <a-col :span="7">
                  <a-form-model-item label="签署日" prop="cli.signingDt">
                    <j-date
                      id="signingDt"
                      placeholder="请选择签署日"
                      v-model="form.cli.signingDt"
                      style="width: 100%"
                    ></j-date>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="成立日" prop="cli.trustStdDt">
                    <j-date
                      id="trustStdDt"
                      placeholder="请选择成立日"
                      v-model="form.cli.trustStdDt"
                      style="width: 100%"
                    ></j-date>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    label="信托期限"
                    prop="cli.trustTermType"
                    :labelCol="{ span: 10 }"
                    :wrapperCol="{ span: 11 }"
                  >
                    <j-d-select-tag
                      id="trustTermType"
                      v-model="form.cli.trustTermType"
                      dict-code="TRUST_TERM_TYPE"
                      placeholder="请选择信托期限类型"
                    ></j-d-select-tag>
                  </a-form-model-item>
                </a-col>
                <a-col :span="3" v-if="form.cli.trustTermType === '1'">
                  <a-form-model-item prop="cli.trustTermPeriod" :labelCol="{ span: 10 }">
                    <a-input-number
                      id="trustTermPeriod"
                      style="width: 60px; margin-left: -30px"
                      :min="0"
                      v-model="form.cli.trustTermPeriod"
                      :max="999"
                    ></a-input-number
                    >年
                  </a-form-model-item>
                </a-col>
                <a-col :span="3" v-if="form.cli.trustTermType === 'O'">
                  <a-form-model-item prop="cli.trustTermOth">
                    <a-input id="trustTermOth" placeholder="请输入信托期限" v-model="form.cli.trustTermOth"></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="7">
                  <a-form-model-item label="信托到期日" prop="cli.trustEndDt">
                    <j-date
                      id="trustEndDt"
                      placeholder="请选择信托到期日"
                      v-model="form.cli.trustEndDt"
                      style="width: 100%"
                    ></j-date>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="信托终止日" prop="cli.trustExprDt">
                    <j-date
                      id="trustExprDt"
                      placeholder="请选择信托终止日"
                      v-model="form.cli.trustExprDt"
                      style="width: 100%"
                    ></j-date>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="头尾处理规则" prop="cli.enddayCalType">
                    <j-d-select-tag
                      id="enddayCalType"
                      v-model="form.cli.enddayCalType"
                      dict-code="ENDDAY_CAL_TYPE"
                      placeholder="请选择头尾处理规则"
                    ></j-d-select-tag>
                  </a-form-model-item>
                </a-col>
                <a-col :span="7">
                  <a-form-model-item label="估值类型" prop="cli.voaType">
                    <j-d-select-tag
                      id="voaType"
                      v-model="form.cli.voaType"
                      dict-code="VOA_TYPE"
                      placeholder="请选择估值类型"
                    ></j-d-select-tag>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8" v-if="form.cli.voaType !== '3'">
                  <a-form-model-item label="估值频率" prop="cli.valuationType">
                    <j-d-select-tag
                      id="valuationType"
                      v-model="form.cli.valuationType"
                      dict-code="VALUATION_TYPE"
                      placeholder="请选择估值频率"
                    ></j-d-select-tag>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="信托经理" prop="cli.tmCodes">
                    <!--realname     username-->
                    <a-select mode="multiple" v-model="form.cli.tmCodes">
                      <a-select-option v-for="eachTm in allTmData" :key="eachTm.id">{{
                        eachTm.realname + '(' + eachTm.username + ')'
                      }}</a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
              </a-row>

              <a-row :gutter="24">
                <a-col :span="7">
                  <a-form-model-item label="客户来源" prop="cli.customerSource">
                    <j-d-select-tag
                      id="customerSource"
                      v-model="form.cli.customerSource"
                      dict-code="CUSTOMER_SOURCE"
                      placeholder="请选择客户来源"
                      v-if="customizeEnv != 'zrt'"
                    ></j-d-select-tag>
                    <a-cascader
                      v-model:value="valueCustomerSource"
                      :options="khlyTreeData"
                      placeholder="请选择客户来源"
                      @change="onChangeTreeDatakhly"
                      v-if="customizeEnv == 'zrt'"
                    />
                    <!-- <a-tree-select
                      :treeData="khlyTreeData"
                      v-model="form.cli.customerSource"
                      treeNodeFilterProp="title"
                      placeholder="请选择客户来源"
                      showSearch
                      style="width: 100%"
                      :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
                      allowClear
                      treeDefaultExpandAll
                      v-if="customizeEnv=='zrt'"
                    ></a-tree-select> -->
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="合作渠道" :prop="customizeEnv === 'zrt' ? '' : 'cli.cusChannelSide'">
                    <a-cascader
                      v-model:value="valueCusChannelSide"
                      v-if="customizeEnv == 'zrt'"
                      :options="treeData"
                      placeholder="合作渠道"
                      @change="onChangeTreeData"
                    />
                    <a-tree-select
                      v-if="customizeEnv != 'zrt'"
                      :treeData="treeData"
                      v-model="form.cli.cusChannelSide"
                      treeNodeFilterProp="title"
                      showSearch
                      style="width: 100%"
                      :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
                      allowClear
                      treeDefaultExpandAll
                    ></a-tree-select>
                  </a-form-model-item>
                  <!-- <a-form-model-item label="合作渠道" >
                  </a-form-model-item> -->
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="项目管理类型">
                    <j-d-select-tag
                      :need-empty-option="true"
                      v-model="form.cli.manageType"
                      dict-code="CUS_MANAGE_TYPE"
                    ></j-d-select-tag>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-card>
            <br />
            <a-card size="small" title="合同信息摘要" :bordered="false">
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-model-item label="信托是否可撤销" :labelCol="{ span: 16 }" :wrapperCol="{ span: 8 }">
                    <j-d-select-tag
                      id="revokeYn"
                      :need-empty-option="true"
                      v-model="form.clci.revokeYn"
                      dict-code="YN"
                    ></j-d-select-tag>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="是否可修改受益人" :labelCol="{ span: 16 }" :wrapperCol="{ span: 8 }">
                    <j-d-select-tag
                      id="bnfEditYn"
                      :need-empty-option="true"
                      v-model="form.clci.bnfEditYn"
                      dict-code="YN"
                    ></j-d-select-tag>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="是否允许客户自助查询" :labelCol="{ span: 16 }" :wrapperCol="{ span: 8 }">
                    <j-d-select-tag
                      id="allowQueryYn"
                      :need-empty-option="true"
                      v-model="form.clci.allowQueryYn"
                      dict-code="YN"
                    ></j-d-select-tag>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="受益类型" :labelCol="{ span: 16 }" :wrapperCol="{ span: 8 }">
                    <j-d-select-tag
                      id="bnfSelfYn"
                      :need-empty-option="true"
                      v-model="form.clci.bnfSelfYn"
                      :dict-code="customizeEnv === 'zrt' ? 'INCOME_TP' : 'BENEFIT_TYPE'"
                    ></j-d-select-tag>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item
                    label="受益权是否为夫妻共同财产"
                    :labelCol="{ span: 16 }"
                    :wrapperCol="{ span: 8 }"
                  >
                    <j-d-select-tag
                      id="jointPropertyYn"
                      :need-empty-option="true"
                      v-model="form.clci.jointPropertyYn"
                      dict-code="YN"
                    ></j-d-select-tag>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="是否可用受益权清偿债务" :labelCol="{ span: 16 }" :wrapperCol="{ span: 8 }">
                    <j-d-select-tag
                      id="payDebtsYn"
                      :need-empty-option="true"
                      v-model="form.clci.payDebtsYn"
                      dict-code="YN"
                    ></j-d-select-tag>
                  </a-form-model-item>
                </a-col>

                <!-- 非中融环境：无信托指令人且委托人丧失民事行为能力 -->
                <template v-if="customizeEnv != 'zrt'">
                  <a-col :span="12">
                    <a-form-model-item
                      label="无信托指令人且委托人丧失民事行为能力"
                      :labelCol="{ span: 10 }"
                      :wrapperCol="{ span: 14 }"
                    >
                      <j-d-select-tag
                        id="noCusDir"
                        :need-empty-option="true"
                        dict-code="NO_CUS_DIR"
                        v-model="form.clci.noCusDir"
                      ></j-d-select-tag>
                    </a-form-model-item>
                  </a-col>
                  <a-col v-if="form.clci.noCusDir === '5'" :span="12">
                    <a-form-model-item
                      label="无信托指令人且委托人丧失民事行为能力-其他"
                      :labelCol="{ span: 10 }"
                      :wrapperCol="{ span: 14 }"
                      prop="clci.noCusDirOther"
                    >
                      <a-input id="noCusDirOther" placeholder="其他机制" v-model="form.clci.noCusDirOther"></a-input>
                    </a-form-model-item>
                  </a-col>
                </template>

                <!-- 粤财定制身故内容 -->
                <template v-if="customizeEnv === 'utrust'">
                  <!-- 慈善信托隐藏 -->
                  <template
                    v-if="form.cli.contractType == '1' || form.cli.contractType == '2' || form.cli.contractType == '4'"
                  >
                    <template v-if="forUpdate">
                      <a-col :span="12">
                        <a-form-model-item
                          label="部分受益人存续期内身故"
                          :labelCol="{ span: 10 }"
                          :wrapperCol="{ span: 14 }"
                          prop="cli.sumBnfDie"
                        >
                          <j-multi-select-tag
                            id="sumBnfDie"
                            v-model="form.clci.sumBnfDie"
                            :dict-code="
                              form.cli.contractType != '4' ? 'UTRUST_CASH_DURATION' : 'UTRUST_EQUITY_DURATION'
                            "
                          ></j-multi-select-tag>
                        </a-form-model-item>
                      </a-col>
                      <a-col v-if="form.clci.sumBnfDie && form.clci.sumBnfDie.indexOf('OTH') > -1" :span="12">
                        <a-form-model-item
                          label="部分受益人存续期内身故其他"
                          :labelCol="{ span: 10 }"
                          :wrapperCol="{ span: 14 }"
                          prop="clci.sumBnfDieOth"
                        >
                          <a-input id="sumBnfDieOth" placeholder="其他机制" v-model="form.clci.sumBnfDieOth"></a-input>
                        </a-form-model-item>
                      </a-col>

                      <a-col :span="12">
                        <a-form-model-item
                          label="部分受益人项目终止身故"
                          :labelCol="{ span: 10 }"
                          :wrapperCol="{ span: 14 }"
                          prop="cli.sumBnfDieAftStop"
                        >
                          <j-multi-select-tag
                            id="sumBnfDieAftStop"
                            v-model="form.clci.sumBnfDieAftStop"
                            :dict-code="
                              form.cli.contractType != '4' ? 'UTRUST_CASH_TERMINATION' : 'UTRUST_EQUITY_TERMINATION'
                            "
                          ></j-multi-select-tag>
                        </a-form-model-item>
                      </a-col>

                      <a-col
                        v-if="form.clci.sumBnfDieAftStop && form.clci.sumBnfDieAftStop.indexOf('OTH') > -1"
                        :span="12"
                      >
                        <a-form-model-item
                          label="部分受益人项目终止身故-其他"
                          :labelCol="{ span: 10 }"
                          :wrapperCol="{ span: 14 }"
                          prop="clci.sumBnfDieAftStopOth"
                        >
                          <a-input
                            id="sumBnfDieAftStopOth"
                            placeholder="其他机制"
                            v-model="form.clci.sumBnfDieAftStopOth"
                          ></a-input>
                        </a-form-model-item>
                      </a-col>

                      <a-col :span="12">
                        <a-form-model-item
                          label="全部受益人存续期内身故"
                          :labelCol="{ span: 10 }"
                          :wrapperCol="{ span: 14 }"
                        >
                          <j-multi-select-tag
                            id="allBnfDie"
                            v-model="form.clci.allBnfDie"
                            :dict-code="
                              form.cli.contractType != '4' ? 'UTRUST_CASH_DURATION' : 'UTRUST_EQUITY_DURATION'
                            "
                          ></j-multi-select-tag>
                        </a-form-model-item>
                      </a-col>
                      <a-col v-if="form.clci.allBnfDie && form.clci.allBnfDie.indexOf('OTH') > -1" :span="12">
                        <a-form-model-item
                          label="全部受益人存续期内身故其他"
                          :labelCol="{ span: 10 }"
                          :wrapperCol="{ span: 14 }"
                          prop="clci.allBnfDieOth"
                        >
                          <a-input id="sumBnfDieOth" placeholder="其他机制" v-model="form.clci.allBnfDieOth"></a-input>
                        </a-form-model-item>
                      </a-col>

                      <a-col :span="12">
                        <a-form-model-item
                          label="全部受益人项目终止身故"
                          :labelCol="{ span: 10 }"
                          :wrapperCol="{ span: 14 }"
                          prop="cli.allBnfDieAftStop"
                        >
                          <j-multi-select-tag
                            id="sumBnfDieAftStop"
                            v-model="form.clci.allBnfDieAftStop"
                            :dict-code="
                              form.cli.contractType != '4' ? 'UTRUST_CASH_TERMINATION' : 'UTRUST_EQUITY_TERMINATION'
                            "
                          ></j-multi-select-tag>
                        </a-form-model-item>
                      </a-col>
                      <a-col
                        v-if="form.clci.allBnfDieAftStop && form.clci.allBnfDieAftStop.indexOf('OTH') > -1"
                        :span="12"
                      >
                        <a-form-model-item
                          label="全部受益人项目终止身故-其他"
                          :labelCol="{ span: 10 }"
                          :wrapperCol="{ span: 14 }"
                          prop="clci.allBnfDieAftStopOth"
                        >
                          <a-input
                            id="allBnfDieAftStopOth"
                            placeholder="其他机制"
                            v-model="form.clci.allBnfDieAftStopOth"
                          ></a-input>
                        </a-form-model-item>
                      </a-col>
                    </template>
                  </template>
                </template>
                <template v-else>
                  <!-- 部分受益人身故 中融个性化定制 -->
                  <a-col :span="12">
                    <!-- 部分受益人身故 -->
                    <a-form-model-item v-if="customizeEnv != 'zrt'"
                      :label="sumBnfDieLabelName"
                      :labelCol="{ span: 10 }"
                      :wrapperCol="{ span: 14 }"
                      prop="cli.sumBnfDie"
                    >
                      <j-multi-select-tag
                        id="sumBnfDie"
                        v-model="form.clci.sumBnfDie"
                        dict-code="BNF_DIE"
                      ></j-multi-select-tag>
                    </a-form-model-item>
                  </a-col>
                  <a-col v-if="form.clci.sumBnfDie && form.clci.sumBnfDie.indexOf('4') > -1" :span="12">
                    <a-form-model-item
                      :label="sumBnfDieLabelName + '-其他'"
                      :labelCol="{ span: 10 }"
                      :wrapperCol="{ span: 14 }"
                      prop="clci.sumBnfDieOth"
                    >
                      <a-input id="sumBnfDieOth" placeholder="其他机制" v-model="form.clci.sumBnfDieOth"></a-input>
                    </a-form-model-item>
                  </a-col>

                  <!-- 非中融环境：全部受益人身故 -->
                  <template v-if="customizeEnv != 'zrt'">
                    <a-col :span="12">
                      <a-form-model-item
                        :label="allBnfDieLabelName"
                        :labelCol="{ span: 10 }"
                        :wrapperCol="{ span: 14 }"
                      >
                        <j-multi-select-tag
                          id="allBnfDie"
                          v-model="form.clci.allBnfDie"
                          dict-code="ALL_BNF_DIE"
                        ></j-multi-select-tag>
                      </a-form-model-item>
                    </a-col>
                    <a-col v-if="form.clci.allBnfDie && form.clci.allBnfDie.indexOf('3') > -1" :span="12">
                      <a-form-model-item
                        :label="allBnfDieLabelName + '-其他'"
                        :labelCol="{ span: 10 }"
                        :wrapperCol="{ span: 14 }"
                        prop="clci.allBnfDieOth"
                      >
                        <a-input id="sumBnfDieOth" placeholder="其他机制" v-model="form.clci.allBnfDieOth"></a-input>
                      </a-form-model-item>
                    </a-col>
                  </template>
                </template>

                <a-col :span="12">
                  <a-form-model-item label="封闭期" :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                    <a-col :span="6">
                      <a-input-number
                        style="width: 100%"
                        id="closedPeriod"
                        :min="0"
                        v-model="form.clci.closedPeriod"
                        :max="999"
                      ></a-input-number>
                    </a-col>
                    <a-col :span="10">
                      <j-d-select-tag
                        id="closedUnit"
                        :need-empty-option="false"
                        v-model="form.clci.closedUnit"
                        dict-code="CLOSED_UNIT"
                      ></j-d-select-tag>
                    </a-col>
                  </a-form-model-item>
                </a-col>
                <a-col :span="12" v-if="customizeEnv === 'sdic'">
                  <a-form-model-item label="是否指定被授权人" :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                    <j-d-select-tag
                      :need-empty-option="true"
                      v-model="form.clci.licenseeYn"
                      dict-code="YN"
                    ></j-d-select-tag>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-card>
            <br />
            <a-card size="small" :title="customizeEnv === 'sdic' ? '托管户' : '信托专户/托管户'" :bordered="false">
              <a-col :span="8">
                <a-form-model-item label="账户类型" prop="cli.trustAccType">
                  <j-d-select-tag
                    id="trustAccType"
                    v-model="form.cli.trustAccType"
                    dict-code="TRUST_ACC_TYPE"
                    @change="trustAccTypeChange()"
                  ></j-d-select-tag>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="户名" prop="cli.accName">
                  <a-input id="accName" placeholder="请输入户名" v-model="form.cli.accName"></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="账号" prop="cli.accNo">
                  <a-input id="accNo" placeholder="请输入账号" v-model="form.cli.accNo"></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="银行名称" prop="cli.bankCode">
                  <j-d-select-tag id="bankCode" v-model="form.cli.bankCode" dict-code="BANK_CODE"></j-d-select-tag>
                </a-form-model-item>
              </a-col>
              <a-col :span="14">
                <a-form-model-item label="开户行所在地" :labelCol="{ span: 7 }" :wrapperCol="{ span: 100 }">
                  <bi-area
                    class="bankAdress"
                    :models="[form.cli.addrProvCode, form.cli.addrCityCode]"
                    @change="handAreaChange"
                    :show-lv="2"
                  ></bi-area>
                </a-form-model-item>
              </a-col>
              <a-col :span="4">
                <a-form-model-item prop="cli.accOpenBank" :wrapperCol="{ span: 24 }">
                  <a-input id="accOpenBank" placeholder="请输入开户行网点" v-model="form.cli.accOpenBank"></a-input>
                </a-form-model-item>
              </a-col>
            </a-card>
          </a-layout-content>
          <a-layout-footer
            :style="{
              position: 'fixed',
              zIndex: 1,
              right: '12px',
              textAlign: 'center',
              left: isAdd === 'EDIT' ? '417px' : '213px',
              bottom: 0,
              background: '#fff',
            }"
          >
            <a-button @click="tmpSave" v-if="form.cli.status !== 'ADTING'">暂存</a-button>
            <a-button type="primary" @click="doSave" style="margin-left: 70px" v-if="form.cli.status !== 'ADTING'">
              提交
              <span v-if="form.cli.prjStatus === 'R'">审核</span>
            </a-button>
          </a-layout-footer>
        </a-layout>
      </a-form-model>

      <!--                    Object.assign(validatorRules.required,{initialValue:'aaaa'})-->
    </a-spin>
  </div>
</template> 

<script>
import JDSelectTag from '../../components/dict/JDSelectTag'
import JMultiSelectTag from '../../components/dict/JMultiSelectTag'
import BiArea from '../../components/BI/BiArea'
import BiBanks from '../../components/BI/BiBanks'
import { httpAction } from '@/api/manage'
import JDate from '../../components/jeecg/JDate'
import { queryDepartTreeList, cusRecommendOrgTreeList } from '@/api/api'
import { getAction } from '../../api/manage'
import * as customizeConfigs from '../../customizeConfig'
import { capitalAmount } from '@utils/util'
import { filterDictText } from '@/components/dict/JDictSelectUtil'
import { initDictOptionsBatch } from '../../components/dict/JDictSelectUtil'

export default {
  name: 'ProjectElement',
  components: {
    JDate,
    BiBanks,
    BiArea,
    JDSelectTag,
    JMultiSelectTag,
  },
  inject: ['closeCurrent'],
  computed: {
    initParam() {
      return this.$route.query.prjCode + ',' + this.$route.query.optType
    },
    isAdd() {
      return this.$route.query.optType
    },
  },
  watch: {
    initParam() {
      this.initPage()
    },
    // 中融个性化
    'form.cli.contractType'(val) {
      if (this.customizeEnv === 'zrt') {
        this.form.cli.trustPrjName =
          '中融-' +
          filterDictText(this.dictOptionsData['CONTRACT_SERIE'], this.form.cli.contractSerie) +
          this.form.cli.contractNo +
          '号' +
          filterDictText(this.dictOptionsData['CONTRACT_TYPE'], this.form.cli.contractType)
        this.form.cli.trustPrjShortName =
          filterDictText(this.dictOptionsData['CONTRACT_SERIE'], this.form.cli.contractSerie) +
          this.form.cli.contractNo +
          '号'
      }
    },
    'form.cli.contractSerie'(val) {
      if (this.customizeEnv === 'zrt') {
        this.form.cli.trustPrjName =
          '中融-' +
          filterDictText(this.dictOptionsData['CONTRACT_SERIE'], this.form.cli.contractSerie) +
          this.form.cli.contractNo +
          '号' +
          filterDictText(this.dictOptionsData['CONTRACT_TYPE'], this.form.cli.contractType)
        this.form.cli.trustPrjShortName =
          filterDictText(this.dictOptionsData['CONTRACT_SERIE'], this.form.cli.contractSerie) +
          this.form.cli.contractNo +
          '号'
      }
    },
    'form.cli.contractNo'(val) {
      if (this.customizeEnv === 'zrt') {
        this.form.cli.trustPrjName =
          '中融-' +
          filterDictText(this.dictOptionsData['CONTRACT_SERIE'], this.form.cli.contractSerie) +
          this.form.cli.contractNo +
          '号' +
          filterDictText(this.dictOptionsData['CONTRACT_TYPE'], this.form.cli.contractType)
        this.form.cli.trustPrjShortName =
          filterDictText(this.dictOptionsData['CONTRACT_SERIE'], this.form.cli.contractSerie) +
          this.form.cli.contractNo +
          '号'
      }
    },

    'form.cli.customerSource'(val) {
      this.rules['cli.cusChannelSide'][0].required = val != 2
    },
    'form.cli.trustTermType'(val) {
      if (val == 1) {
        if (!this.form.cli.trustTermPeriod || !this.form.cli.trustStdDt) return
        this.form.cli.trustEndDt = this.form.cli.trustExprDt =
          parseInt(this.form.cli.trustStdDt.slice(0, 4)) +
          parseInt(this.form.cli.trustTermPeriod || '') +
          this.form.cli.trustStdDt.slice(4)
      } else if (val == 2) {
        this.form.cli.trustEndDt = this.form.cli.trustExprDt = '2199-12-31'
      }
    },
    'form.cli.trustTermPeriod'(val) {
      if (!val || !this.form.cli.trustStdDt) return
      this.form.cli.trustEndDt = this.form.cli.trustExprDt =
        parseInt(this.form.cli.trustStdDt.slice(0, 4)) +
        parseInt(this.form.cli.trustTermPeriod || '') +
        this.form.cli.trustStdDt.slice(4)
    },
    'form.cli.voaType'(val) {
      if (val == 3) {
        this.rules['cli.valuationType'][0].required = false
      } else {
        this.rules['cli.valuationType'][0].required = true
      }
    },
    'form.cli.signingDt'(val) {
      if (!val || !this.form.cli.trustStdDt) return
      if ((val.replace(/-/gi, '') || 0) > (this.form.cli.trustStdDt.replace(/-/gi, '') || 0)) {
        this.$message.error('成立日不得早于签署日')
        this.form.cli.signingDt = ''
      }
    },
    'form.cli.trustStdDt'(val) {
      if (!val || !this.form.cli.signingDt) return
      if ((val.replace(/-/gi, '') || 0) < (this.form.cli.signingDt.replace(/-/gi, '') || 0)) {
        this.$message.error('成立日不得早于签署日')
        this.form.cli.trustStdDt = ''
        return
      }

      //新增修改 成立日+固定期限順序后 反选成立日后其他日期不更新的问题
      if (this.form.cli.trustTermType == '1') {
        if (this.form.cli.trustTermPeriod != '' || this.form.cli.trustTermPeriod != null) {
          if (!this.form.cli.trustTermPeriod || !this.form.cli.trustStdDt) return
          this.form.cli.trustEndDt = this.form.cli.trustExprDt =
            parseInt(this.form.cli.trustStdDt.slice(0, 4)) +
            parseInt(this.form.cli.trustTermPeriod || '') +
            this.form.cli.trustStdDt.slice(4)
        }
      }
    },
    'form.cli.trustTermOth'(val) {
      //过滤特殊字符
      this.form.cli.trustTermOth = val.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\w]/g, '').trim()
    },
    'form.cli.setScaleAmt'(val) {
      this.showtip = capitalAmount(val)
      console.log('ceshi-------' + this.showtip)
    },
    'form.cli.exemptionFromDueDiligence'(val) {
      this.showtipEfdd = capitalAmount(val)
      console.log('ceshi-------' + this.showtip)
    },
    'form.cli.spouseConsentLimit'(val) {
      this.showtipScl = capitalAmount(val)
      console.log('ceshi-------' + this.showtip)
    },
  },
  data() {
    let customizeEnv = customizeConfigs.customizeEnv
    let ruleReq = [{ required: true, message: '必输字段', trigger: ['change', 'blur'] }]
    let valuationTypeRule = [{ required: true, message: '必输字段', trigger: ['change', 'blur'] }]
    let cusChannelSideRule = [{ required: true, message: '必输字段', trigger: ['change', 'blur'] }]
    let cli = {
      trustPrjCode: '',
      productCode: '',
      trustPrjName: '',
      trustPrjShortName: '',
      contractType: '',
      contractSerie: '',
      cusCiticCode: '',
      contractNo: '',
      contractName: '',
      custodyAgreementNo: '',
      custodyAgreementName: '',
      financialConsultantNo: '',
      financialConsultantName: '',
      trustRecordReceiptNo: '',
      setScaleAmt: '',
      trutsPurpose: '',
      signingDt: '',
      trustStdDt: '',
      trustTermType: '',
      trustTermPeriod: '',
      trustTermOth: '',
      trustEndDt: '',
      trustExprDt: '',
      enddayCalType: '',
      voaType: '',
      valuationType: '',
      customerSource: '',
      trustAccType: '',
      accName: '',
      accNo: '',
      addrProvCode: '',
      addrCityCode: '',
      cusChannelSide: '',
      tmCodes: [],
      manageType: '',
      // 追加免尽调额度
      exemptionFromDueDiligence:'',
      // 追加配偶同意函内额度
      spouseConsentLimit:''
    }
    let clci = {
      revokeYn: '',
      bnfEditYn: '',
      allowQueryYn: '0',
      bnfSelfYn: '',
      jointPropertyYn: '',
      payDebtsYn: '',
      noCusDir: '',
      noCusDirOther: '',
      sumBnfDie: '',
      sumBnfDieOth: '',
      sumBnfDieAftStop: '',
      sumBnfDieAftStopOth: '',
      allBnfDie: '',
      allBnfDieOth: '',
      allBnfDieAftStop: '',
      allBnfDieAftStopOth: '',
      closedPeriod: '',
      closedUnit: '',
      licenseeYn: '',
    }
    let r = {}
    let xx = Object.keys(cli)
    for (let i = 0; i < xx.length; i++) {
      if (xx[i] === 'valuationType') {
        r['cli.' + xx[i]] = valuationTypeRule
      } else if (xx[i] === 'cusChannelSide') {
        r['cli.' + xx[i]] = cusChannelSideRule
      } else {
        r['cli.' + xx[i]] = ruleReq
      }
    }
    xx = Object.keys(clci)
    for (let i = 0; i < xx.length; i++) {
      r['clci.' + xx[i]] = ruleReq
    }
    // 部分受益人身故 - 定制化名称sumBnfDie
    // 中融的叫做 “传承规则方式”
    let sumBnfDieLabelName = '部分受益人身故'
    let allBnfDieLabelName = '所有受益人身故'
    switch (customizeEnv) {
      case 'zrt':
        sumBnfDieLabelName = '传承规则方式'
        break
    }
    return {
      // form: this.$form.createForm(this),
      customizeEnv: customizeEnv,
      sumBnfDieLabelName: sumBnfDieLabelName,
      allBnfDieLabelName: allBnfDieLabelName,
      valueCusChannelSide: [],
      valueCustomerSource: [],
      forUpdate: true,
      options: [],
      cusLoaDdRelevance: {
        partyCode: '',
        ddCode: '',
      },
      form: {
        cli: cli,
        clci: clci,
        trustTermType: '',
        addrProp: '',
        cusLoaDdRelevance: {},
      },
      rules: r,
      url: {
        action: '/prj/savePrjEle',
        findByPrjCode: '/prj/findByPrjCode',
      },
      prjCode: '',
      optType: '',
      treeData: [],
      khlyTreeData: [],
      allTmData: [],
      tmCodes: [],
      loading: false,
      showtip: '',
      showtipEfdd:'',
      showtipScl:''
    }
  },
  created() {
    this.initDictConfig()
    if (this.$route.query.partyCode) {
      this.cusLoaDdRelevance.partyCode = this.$route.query.partyCode
    }
    if (this.$route.query.ddCode) {
      this.cusLoaDdRelevance.ddCode = this.$route.query.ddCode
    }
  },
  mounted() {
    this.initPage()
  },
  methods: {
    initDictConfig() {
      //初始化字典 - 是否估值
      let that = this
      initDictOptionsBatch('VOA_TYPE,CONTRACT_TYPE,CONTRACT_SERIE,CUSTOMER_SOURCE,PRJ_STATUS').then((res) => {
        if (res.success) {
          that.dictOptionsData = res.result
        }
      })
    },
    capitalAmount,
    async changeTrustPrjCode() {
      let that = this
      //文本框失去焦点时判断股权信息是否已存在，存在则带出相关信息
      getAction('/prj/checkTrustPrjCode', { trustPrjCode: that.form.cli.trustPrjCode }).then((res) => {
        if (res.success) {
          if (res.message !== 'NONE') {
            that.closeCurrent()
            //项目信息已存在  直接带出
            if (!this.$route.query.partyCode) {
              that.$router.replace({
                name: 'prj-setup',
                query: { optType: 'EDIT', prjCode: res.message },
              })
            } else {
              that.$router.replace({
                name: 'prj-setup',
                query: {
                  optType: 'EDIT',
                  prjCode: res.message,
                  partyCode: that.cusLoaDdRelevance.partyCode,
                  ddCode: that.cusLoaDdRelevance.ddCode,
                },
              })
            }
          }
        }
      })
    },
    async initPage() {
      let that = this

      if (this.customizeEnv == 'zrt') {
        await queryDepartTreeList().then((res) => {
          console.log('res1', res)
          let setTreeData = (o) => {
            o.key = o.orgCode
            o.value = o.orgCode
            if (o.children) {
              for (let so of o.children) {
                setTreeData(so)
              }
            }
          }
          let setData = (o) => {
            // o.key = o.orgCode
            o.value = o.orgCode
            o.label = o.departName
            if (o.children) {
              for (let so of o.children) {
                setData(so)
              }
            }
          }

          that.treeData = []
          that.khlyTreeData = []
          if (res.success) {
            console.log('res.result', res.result)
            for (let i = 0; i < res.result.length; i++) {
              let temp = res.result[i]
              console.log('temp', temp)
              if (temp.orgCategory === '4') {
                setData(temp)
                that.treeData.push(temp)
              }
              if (temp.orgCategory === '5') {
                setData(temp)
                that.khlyTreeData.push(temp)
              }
            }
            console.log('客户来源', that.khlyTreeData)
          }
        })
      } else if (this.customizeEnv != 'zrt') {
        //bi基础环境合作渠道信息源处理
        await cusRecommendOrgTreeList().then((res) => {
          let setData = (o) => {
            o.value = o.orgCode
            o.label = o.orgName
            if (o.children) {
              for (let so of o.children) {
                setData(so)
              }
            }
          }

          that.treeData = []
          if (res.success) {
            console.log('res.result', res.result)
            for (let i = 0; i < res.result.length; i++) {
              let temp = res.result[i]
              console.log('temp', temp)
              setData(temp)
              that.treeData.push(temp)
            }
            console.log('客户渠道', that.treeData)
          }
        })
      }

      that.prjCode = that.$route.query.prjCode
      if (that.prjCode) {
        let param = { cli: { prjCode: that.prjCode } }
        that.loading = true
        await httpAction(that.url.findByPrjCode, param, 'post').then((res) => {
          console.log('项目信息', res)
          if (this.customizeEnv === 'zrt') {
            this.valueCusChannelSide = (res.result.cli.cusChannelSide || '').split(',')
            this.valueCustomerSource = (res.result.cli.customerSource || '').split(',')
          }
          console.log("res.result.cli.cusChannelSide={}",res.result.cli.cusChannelSide);
          console.log("客户来源={}",this.valueCusChannelSide);
          console.log('this.value', this.valueCusChannelSide)
          if (res.success) {
            console.log('prjInfo=', res.result)
            if (!res.result.clci) {
              res.result.clci = {}
            }
            that.form = res.result
          } else {
            that.$error({
              title: res.message,
            })
          }
        })
      }

      //获取所有信托经理
      await getAction('/sys/role/list', { pageSize: 999999 }).then((res) => {
        if (res.success && res.result.records && res.result.records.length > 0) {
          let role = res.result.records.filter((role) => role.roleName === '信托经理')
          if (role && role.length > 0) {
            getAction('/sys/user/userRoleList', { roleId: role[0].id, pageSize: 99999999 }).then((res) => {
              that.allTmData = res.result.records
              if (that.form.cli.tmCode) {
                // that.tmCodes = that.form.cli.tmCode.split(',')
                that.form.cli.tmCodes = that.form.cli.tmCode.split(',')
                that.form = JSON.parse(JSON.stringify(that.form))
              }
            })
          }
        }
      })
      // let params = {roleId:''};
      // await getAction('/sys/user/userRoleList')
      that.loading = false
    },
    tmpSave() {
      this.form.cli.status = 'temp'
      this.sendData()
    },
    doSave() {
      let that = this
      this.$refs.prjEleForm.validate((valid) => {
        if (valid) {
          that.form.saveType = 'submit'
          that.sendData()
        } else {
          return false
        }
      })
    },
    onChangeTreeDatakhly(value) {
      this.form.cli.customerSource = ''
      for (let i = 0; i < value.length; i++) {
        if (i === value.length - 1) {
          this.form.cli.customerSource += value[i]
        } else {
          this.form.cli.customerSource += value[i] + ','
        }
      }
      console.log("客户来源点击={}",this.form.cli.customerSource);
    },
    onChangeTreeData(value) {
      this.form.cli.cusChannelSide = ''
      console.log('onChangeTreeData', value)
      for (let i = 0; i < value.length; i++) {
        if (i === value.length - 1) {
          this.form.cli.cusChannelSide += value[i]
        } else {
          this.form.cli.cusChannelSide += value[i] + ','
        }
      }
      console.log(' this.form.cli.cusChannelSide', this.form.cli.cusChannelSide)
    },
    sendData() {
      console.log('提交', this.value)
      let that = this
      that.loading = true
      that.form.cli.prjCode = that.prjCode
      // if (that.tmCodes.length > 0) {
      //   that.form.cli.tmCode = that.tmCodes.toString()
      // }
      if (that.form.cli.tmCodes.length > 0) {
        that.form.cli.tmCode = that.form.cli.tmCodes.toString()
      }
      that.form.cusLoaDdRelevance = that.cusLoaDdRelevance
      console.log(that.form)
      httpAction(that.url.action, that.form, 'post')
        .then((res) => {
          if (res.success) {
            that.$message.success('保存成功！')
            if (this.$route.query.optType == 'ADD') {
              that.$emit('updateState', res.message)
            }
          } else {
            that.$error({
              title: res.message,
            })
          }
        })
        .finally(() => {
          that.loading = false
        })
    },
    handAreaChange(areaStr) {
      if (areaStr) {
        let a = areaStr.split(',')
        console.dir(a)
        this.form.cli.addrProvCode = a[0]
        this.form.cli.addrCityCode = a[1]
      }
    },
    // 切换信托专户/托管户
    trustAccTypeChange() {
      console.log('专户类型', this.form.cli.trustAccType)
      if (this.form.cli.trustAccType === 'D' && this.customizeEnv === 'zrt') {
        this.form.cli.accName = '中融国际信托有限公司'
      } else {
        this.form.cli.accName = ''
      }
    },
    contractTypeChange() {
      if (this.customizeEnv === 'utrust') {
        this.forUpdate = false
        this.form.clci.sumBnfDie = ''
        this.form.clci.sumBnfDieOth = ''
        this.form.clci.sumBnfDieAftStop = ''
        this.form.clci.sumBnfDieAftStopOth = ''
        this.form.clci.allBnfDie = ''
        this.form.clci.allBnfDieOth = ''
        this.form.clci.allBnfDieAftStop = ''
        this.form.clci.allBnfDieAftStopOth = ''
        // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
        this.$nextTick(() => {
          this.forUpdate = true
        })
      }
    },
  },
}
</script>

<style scoped>
.ant-col {
  padding-left: 0 !important;
}

.ant-form-item label {
  position: relative;
  white-space: pre-wrap;
}

.bankAdress {
  width: 900px;
}

.num-input-width .ant-input-number {
  width: 100%;
}

.numeric-input .ant-tooltip-inner {
  min-width: 32px;
  min-height: 37px;
}

.numeric-input .numeric-input-title {
  font-size: 14px;
}
</style>