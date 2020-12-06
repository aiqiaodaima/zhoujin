<template>
  <a-modal
    :title="title"
    width="100%"
    style="top: 0px; padding-bottom: 0"
    :destroyOnClose="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
  >
    <template slot="footer">
      <a-row :gutter="24" style="margin: 0; padding: 0">
        <a-col :span="23" style="text-align: center">
          <a-button v-if="optType !== 'view'" type="primary" @click="handleOk">提交</a-button>
          <a-button @click="handleCancel">关闭</a-button>
        </a-col>
      </a-row>
    </template>

    <WkfNextUserModal ref="wkfUserForm" @complete="wkfUserComplete" />
    <a-spin :spinning="confirmLoading" :style="formStyle">
      <a-form-model
        :model="form"
        :rules="rules"
        ref="form"
        :label-col="{ span: 9 }"
        :wrapper-col="{ span: 15 }"
        style="margin-right: 10px"
      >
        <a-tabs
          :activeKey="form.cri.naturalYn"
          size="small"
          @change="tabChange"
          v-if="relType !== 'TRUSTEE' && relType !== 'COOWNER'"
        >
          <a-tab-pane
            tab="自然人"
            key="Y"
            v-if="optType === 'add' || (optType !== 'add' && form.cri.naturalYn === 'Y')"
          ></a-tab-pane>
          <a-tab-pane
            tab="机构"
            key="N"
            v-if="optType === 'add' || (optType !== 'add' && form.cri.naturalYn === 'N')"
          ></a-tab-pane>
        </a-tabs>

        <a-card size="small" title="基本信息">
          <!--          <span slot="extra">-->
          <!--            选择尽调关系人：<a-select defaultValue="lucy" style="width: 120px" @change="handleDDPartyChange"></a-select>-->
          <!--          </span>-->
          <a-row v-if="relType === 'BENEFICIARY'" :gutter="24">
            <a-col :span="8" v-if="form.cri.naturalYn === 'Y'">
              <a-form-model-item label="与委托人关系" prop="cppm.cusRelativeType">
                <j-d-select-tag
                  v-if="optType !== 'view'"
                  dict-code="PTY_RELATIVE_TYPE"
                  v-model="form.cppm.cusRelativeType"
                  placeholder="请选择与委托人关系"
                  @change="valueOther"
                ></j-d-select-tag>
                <span v-else>{{ fdText('PTY_RELATIVE_TYPE', form.cppm.cusRelativeType) }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="受益人类型" prop="cbi.bnfType">
                <j-d-select-tag
                  v-if="optType !== 'view'"
                  dict-code="BNF_TYPE"
                  v-model="form.cbi.bnfType"
                  @change="bnfChange"
                  placeholder="请选择受益人类型"
                ></j-d-select-tag>
                <span v-else>{{ fdText('BNF_TYPE', form.cbi.bnfType) }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="受益顺位" prop="cbi.bnfRank">
                <j-d-select-tag
                  v-if="optType !== 'view'"
                  dict-code="BNF_RANK"
                  v-model="form.cbi.bnfRank"
                  placeholder="请选择受益顺位"
                ></j-d-select-tag>
                <span v-else>
                  <span v-if="form.cbi.bnfRank !== '' && form.cbi.bnfRank !== null">{{
                    fdText('BNF_RANK', form.cbi.bnfRank.toString())
                  }}</span>
                </span>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row v-if="relType === 'BENEFICIARY'" :gutter="24">
            <span v-if="customizeEnv == 'zrt'">
              <a-col
                :span="2"
                v-if="(form.cri.naturalYn === 'Y' && other === 'Y') || form.cppm.cusRelativeType === 'OTH'"
              >
                <a-form-model-item prop="cppm.cusRelativeName">
                  <span v-if="form.cppm.cusRelativeType === 'OTH'">
                    <a-input v-if="optType !== 'view'" v-model="form.cppm.cusRelativeName" />
                  </span>
                  <span v-if="optType == 'view' && form.cppm.cusRelativeType === 'OTH'">{{
                    form.cppm.cusRelativeName
                  }}</span>
                </a-form-model-item>
              </a-col>
            </span>
            <a-col :span="8">
              <a-form-model-item label="受益人状态" prop="cbi.bnfStatus">
                <j-d-select-tag
                  v-if="optType !== 'view'"
                  dict-code="BNF_STATUS"
                  v-model="form.cbi.bnfStatus"
                  placeholder="请选择受益人状态"
                ></j-d-select-tag>
                <span v-else>{{ fdText('BNF_STATUS', form.cbi.bnfStatus) }}</span>
              </a-form-model-item>
            </a-col>
            <span v-if="isPrjSetup && customizeEnv === 'sdic'">
              <a-col :span="8">
                <a-form-model-item label="受益资格变更原因" :prop="customizeEnv === 'sdic' ? '' : 'cbi.bnfReason'">
                  <j-d-select-tag
                    mode="tags"
                    v-if="optType !== 'view'"
                    dict-code="STATUS_RSN_CODE"
                    v-model="form.cbi.bnfReason"
                    placeholder="请选择受益资格变更原因"
                  ></j-d-select-tag>
                  <span v-else>{{ fdText('STATUS_RSN_CODE', form.cbi.bnfReason) }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="受益资格变更日期" :prop="customizeEnv === 'sdic' ? '' : 'cbi.bnfModifyDt'">
                  <j-date
                    v-if="optType !== 'view'"
                    :showLongTerm="false"
                    placeholder="请选择受益资格变更日期"
                    v-model="form.cbi.bnfModifyDt"
                    style="width: 100%"
                  ></j-date>
                  <span v-else>{{ form.cbi.bnfModifyDt }}</span>
                </a-form-model-item>
              </a-col>
            </span>

            <span v-if="customizeEnv === 'bi' || customizeEnv === 'testenv'">
              <a-col :span="8">
                <a-form-model-item label="受益资格变更原因" :prop="isPrjSetup === false ? '' : 'cbi.bnfReason'">
                  <j-d-select-tag
                    mode="tags"
                    v-if="optType !== 'view'"
                    dict-code="STATUS_RSN_CODE"
                    v-model="form.cbi.bnfReason"
                    placeholder="请选择受益资格变更原因"
                  ></j-d-select-tag>
                  <span v-else>{{ fdText('STATUS_RSN_CODE', form.cbi.bnfReason) }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="受益资格变更日期" :prop="isPrjSetup === false ? '' : 'cbi.bnfModifyDt'">
                  <j-date
                    v-if="optType !== 'view'"
                    :showLongTerm="false"
                    placeholder="请选择受益资格变更日期"
                    v-model="form.cbi.bnfModifyDt"
                    style="width: 100%"
                  ></j-date>
                  <span v-else>{{ form.cbi.bnfModifyDt }}</span>
                </a-form-model-item>
              </a-col>
            </span>
          </a-row>

          <a-row :gutter="24" v-if="relType === 'BENEFICIARY'">
            <a-col :span="8">
              <a-form-model-item label="下级受益人">
                <a-input v-if="optType !== 'view'" v-model="subPerson" disabled="disabled"></a-input>
                <span v-else>{{ subPerson }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="2" v-if="optType !== 'view'">
              <a-button style="margin-top: 4px" type="primary" @click="chooseP()">选择</a-button>
            </a-col>
          </a-row>
          <a-row v-if="relType === 'INV_REP'" :gutter="24">
            <a-col :span="8">
              <!--prop="cii.invRank"-->
              <a-form-model-item label="投资代表顺位">
                <j-d-select-tag
                  v-if="optType !== 'view'"
                  dict-code="BNF_RANK"
                  v-model="form.cii.invRank"
                  placeholder="请选择投资代表顺位"
                ></j-d-select-tag>
                <span v-else>
                  <span v-if="form.cii.invRank !== '' && form.cii.invRank !== null">{{
                    fdText('BNF_RANK', form.cii.invRank.toString())
                  }}</span>
                </span>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row v-if="relType === 'SUPERVISER'" :gutter="24">
            <a-col :span="8">
              <a-form-model-item label="监察顺位" prop="csi.supRank">
                <j-d-select-tag
                  v-if="optType !== 'view'"
                  dict-code="BNF_RANK"
                  v-model="form.csi.supRank"
                  placeholder="请选择监察顺位"
                ></j-d-select-tag>
                <span v-else>
                  <span v-if="form.csi.supRank !== '' && form.csi.supRank !== null">{{
                    fdText('BNF_RANK', form.csi.supRank.toString())
                  }}</span>
                </span>
              </a-form-model-item>
            </a-col>

            <a-col :span="8">
              <a-form-model-item label="与委托人关系" :prop="xshs" v-if="form.cri.naturalYn === 'Y'">
                <j-d-select-tag
                  v-if="optType !== 'view'"
                  dict-code="PTY_RELATIVE_TYPE"
                  v-model="form.cppm.cusRelativeType"
                  placeholder="请选择与委托人关系"
                ></j-d-select-tag>
                <span v-else>{{ fdText('PTY_RELATIVE_TYPE', form.cppm.cusRelativeType) }}</span>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row v-if="relType === 'SUPERVISER'" :gutter="24">
            <a-col :span="8">
              <a-form-model-item
                label="任职开始"
                :prop="form.csi.officeStdType === 'O' ? 'csi.officeStdType' && 'csi.officeStdDt' : 'csi.officeStdType'"
              >
                <a-col :span="form.csi.officeStdType === 'O' ? 12 : 24">
                  <j-d-select-tag
                    v-if="optType !== 'view'"
                    dict-code="CUSSUP_OFFICE_STD_TYPE"
                    v-model="form.csi.officeStdType"
                  ></j-d-select-tag>
                  <span v-else>{{ fdText('CUSSUP_OFFICE_STD_TYPE', form.csi.officeStdType) }}</span>
                </a-col>
                <a-col v-if="form.csi.officeStdType === 'O'" :span="12">
                  <!--  -->
                  <j-date v-if="optType !== 'view'" v-model="form.csi.officeStdDt"></j-date>
                  <span v-if="optType === 'view'">{{ form.csi.officeStdDt }}</span>
                </a-col>
              </a-form-model-item>
            </a-col>
            <a-col :span="8" v-if="customizeEnv=='zrt' && form.csi.officeStdType == '3'">
              <a-form-model-item label="周岁"  prop="form.csi.oneYearOld">
                <a-input v-if="optType !== 'view'" placeholder="请输入周岁" v-model="form.csi.oneYearOld"></a-input>
                <span v-else>{{ form.csi.oneYearOld }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item
                label="任职结束"
                :prop="form.csi.officeEndType === 'O' ? 'csi.officeEndType' && 'csi.officeEndDt' : 'csi.officeEndType'"
              >
                <a-col :span="form.csi.officeEndType === 'O' ? 12 : 24">
                  <j-d-select-tag
                    v-if="optType !== 'view'"
                    dict-code="CUSSUP_OFFICE_END_TYPE"
                    v-model="form.csi.officeEndType"
                  ></j-d-select-tag>
                  <span v-else>{{ fdText('CUSSUP_OFFICE_END_TYPE', form.csi.officeEndType) }}</span>
                </a-col>
                <a-col v-if="form.csi.officeEndType === 'O'" :span="12">
                  <!-- 改动-------- -->
                  <j-date v-if="optType !== 'view'" v-model="form.csi.officeEndDt"></j-date>
                  <span v-else>{{ form.csi.officeEndDt }}</span>
                </a-col>
              </a-form-model-item>
            </a-col>

            <a-col :span="8">
              <a-form-model-item label="监察人权利" prop="form.csi.rightsOfSupervisors">
                <a-tree-select
                  v-model="form.csi.rightsOfSupervisors"
                  style="width: 100%"
                  :tree-data="treeData"
                  placeholder="请选择监察人权利"
                  :disabled="optType == 'view'"
                >
                </a-tree-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col v-if="relType === 'OTH'" :span="8">
              <a-form-model-item label="关系人类型" prop="oth.relType">
                <j-d-select-tag
                  v-if="optType !== 'view'"
                  v-model="form.oth.relType"
                  dict-code="OTH_REL_TYPE"
                ></j-d-select-tag>
                <span v-else>{{ fdText('OTH_REL_TYPE', form.oth.relType) }}</span>
              </a-form-model-item>
            </a-col>

            <a-col v-if="relType === 'OTH'" :span="8">
              <a-form-model-item label="顺位">
                <j-d-select-tag
                  v-if="optType !== 'view'"
                  dict-code="BNF_RANK"
                  v-model="form.oth.relRank"
                  placeholder="请选择顺位"
                ></j-d-select-tag>
                <span v-else>
                  <span v-if="form.oth.relRank !== '' && form.oth.relRank !== null">{{
                    fdText('BNF_RANK', form.oth.relRank.toString())
                  }}</span>
                </span>
              </a-form-model-item>
            </a-col>

            <a-col v-if="relType === 'OTH' && form.cri.naturalYn === 'Y'" :span="8">
              <a-form-model-item label="与委托人关系" :prop="xshs">
                <j-d-select-tag
                  v-if="optType !== 'view'"
                  dict-code="PTY_RELATIVE_TYPE"
                  v-model="form.cppm.cusRelativeType"
                  placeholder="请选择与委托人关系"
                ></j-d-select-tag>
                <span v-else>{{ fdText('PTY_RELATIVE_TYPE', form.cppm.cusRelativeType) }}</span>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col v-if="relType === 'COOWNER' || (relType === 'EXECUTOR' && form.cri.naturalYn === 'Y')" :span="8">
              <a-form-model-item label="与委托人关系" :prop="xshs">
                <j-d-select-tag
                  v-if="optType !== 'view'"
                  dict-code="PTY_RELATIVE_TYPE"
                  v-model="form.cppm.cusRelativeType"
                  placeholder="请选择与委托人关系"
                ></j-d-select-tag>
                <span v-else>{{ fdText('PTY_RELATIVE_TYPE', form.cppm.cusRelativeType) }}</span>
              </a-form-model-item>
            </a-col>
          </a-row>

          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-model-item :label="form.cri.naturalYn === 'Y' ? '姓名' : '名称'" prop="cri.partyName">
                <a-input
                  v-if="optType !== 'view'"
                  :placeholder="'请输入' + (form.cri.naturalYn === 'Y' ? '姓名' : '名称')"
                  v-model="form.cri.partyName"
                  :disabled="relType === 'TRUSTEE' && optType !== 'add'"
                ></a-input>
                <span v-else>{{ form.cri.partyName }}</span>
              </a-form-model-item>
            </a-col>
            <!--          <a-col :span="8" v-else>&lt;!&ndash;受托人特殊处理，修改不能修改三证&ndash;&gt;
              <a-form-model-item :label="form.cri.naturalYn === 'Y'?'姓名':'名称'" prop="cri.partyName">
                <a-input
                  v-if="optType === 'add'"
                  :placeholder="'请输入'+(form.cri.naturalYn === 'Y'?'姓名':'名称')"
                  v-model="form.cri.partyName"
                ></a-input>
                <span v-else>{{ form.cri.partyName }}</span>
              </a-form-model-item>
            </a-col>-->

            <a-col :span="2" v-if="optType !== 'view'">
              <a-button v-if="form.cri.naturalYn === 'Y'" style="margin-top: 4px" type="primary" @click="choosePX('xm')"
                >选择</a-button
              >
            </a-col>

            <a-col
              v-if="
                (relType === 'CLIENT' || relType === 'BENEFICIARY' || relType === 'EXECUTOR') &&
                form.cri.naturalYn === 'Y'
              "
              :span="8"
            >
              <a-form-model-item label="是否家族成员" prop="cri.sibYn">
                <j-d-select-tag v-if="optType !== 'view'" v-model="form.cri.sibYn" dict-code="y_n"></j-d-select-tag>
                <span v-else>{{ fdText('y_n', form.cri.sibYn) }}</span>
              </a-form-model-item>
            </a-col>
          </a-row>
          <!--      <a-row :gutter="24" v-if="form.cri.naturalYn === 'N'">
            <a-col :span="8"  >
              <a-form-model-item label="机构类型" prop="cri.orgType">
                <j-d-select-tag
                  v-if="optType !== 'view'"
                  dict-code="CUS_CATEGORY_ORGAN"
                  v-model="form.cri.orgType"
                  placeholder="请选择机构类型"
                  :disabled="relType === 'TRUSTEE'&&optType !== 'add'"
                ></j-d-select-tag>
                <span v-else>{{ fdText('CUS_CATEGORY_ORGAN', form.cri.orgType) }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8" >
              <a-form-model-item label="统一社会信用代码:" prop="cri.creditCode">
                <a-input
                  v-if="optType !== 'view'"
                  placeholder="请输入统一社会信用代码"
                  v-model="form.cri.creditCode"
                  :disabled="relType === 'TRUSTEE'&&optType !== 'add'"
                ></a-input>
                <span v-else>{{ form.cri.creditCode }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8" >
              <a-form-model-item  label="金融机构许可证">
                <a-input
                  v-if="optType !== 'view'"
                  placeholder="请输入金融机构许可证"
                  v-model="form.cri.jrxkzh"
                ></a-input>
                <span v-else>{{form.cri.jrxkzh}}</span>
              </a-form-model-item>
            </a-col>
          </a-row>-->

          <!--     <a-row :gutter="24" v-if="(relType==='CLIENT' || relType==='BENEFICIARY' || relType==='EXECUTOR') && form.cri.naturalYn === 'Y'">
            <a-col :span="8">
              <BiFormItemSelect :options="partyList" label="父亲" name="father" v-model="form.cri.father"/>
            </a-col>
            <a-col :span="8">
              <BiFormItemSelect :options="partyList" label="母亲" name="mather" v-model="form.cri.mather"/>
            </a-col>
            <a-col :span="8">
              <BiFormItemSelect :options="partyList" label="配偶" name="spouse" v-model="form.cri.spouse"/>
            </a-col>
          </a-row>-->

          <a-row :gutter="24" v-if="relType === 'COOWNER' && customizeEnv === 'sdic'">
            <a-col :span="8">
              <a-form-model-item label="与委托人关系" :prop="xshs">
                <j-d-select-tag
                  v-if="optType !== 'view'"
                  dict-code="PTY_RELATIVE_TYPE"
                  v-model="form.cppm.cusRelativeType"
                  placeholder="请选择与委托人关系"
                ></j-d-select-tag>
                <span v-else>{{ fdText('PTY_RELATIVE_TYPE', form.cppm.cusRelativeType) }}</span>
              </a-form-model-item>
            </a-col>
          </a-row>

          <a-row :gutter="24">
            <a-col :span="8" v-if="form.cri.naturalYn === 'Y'">
              <a-form-model-item label="证件类型" prop="cri.idnType">
                <j-d-select-tag
                  v-if="optType !== 'view'"
                  :dict-code="form.cri.naturalYn === 'Y' ? 'IDNTYPES' : 'ORGIDNTYPES'"
                  v-model="form.cri.idnType"
                  placeholder="请选择证件类型"
                ></j-d-select-tag>
                <span v-else>{{
                  fdText(form.cri.naturalYn === 'Y' ? 'IDNTYPES' : 'ORGIDNTYPES', form.cri.idnType)
                }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8" v-if="form.cri.naturalYn === 'Y'">
              <a-form-model-item label="证件号码" prop="cri.idn">
                <a-input
                  v-if="optType !== 'view'"
                  placeholder="请输入证件号码"
                  v-model="form.cri.idn"
                  @blur="initbirthDt($event, 'rel')"
                ></a-input>
                <span v-else>{{ form.cri.idn }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8" v-if="form.cri.naturalYn === 'N'">
              <a-form-model-item label="机构类型" prop="cri.orgType">
                <j-d-select-tag
                  v-if="optType !== 'view'"
                  dict-code="CUS_CATEGORY_ORGAN"
                  v-model="form.cri.orgType"
                  placeholder="请选择机构类型"
                  :disabled="relType === 'TRUSTEE' && optType !== 'add'"
                ></j-d-select-tag>
                <span v-else>{{ fdText('CUS_CATEGORY_ORGAN', form.cri.orgType) }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8" v-if="form.cri.naturalYn === 'N'">
              <a-form-model-item label="统一社会信用代码:" prop="cri.creditCode">
                <a-input
                  v-if="optType !== 'view'"
                  placeholder="请输入统一社会信用代码"
                  v-model="form.cri.creditCode"
                  :disabled="relType === 'TRUSTEE' && optType !== 'add'"
                ></a-input>
                <span v-else>{{ form.cri.creditCode }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="有效期" prop="cri.idnDt">
                <j-date-range
                  v-if="optType !== 'view'"
                  v-model="form.cri.idnDt"
                  @calendarChange="calendarChange"
                  :currentDate="currentDate"
                ></j-date-range>
                <span v-else>{{ (form.cri.idnDt[0] || '') + ' ~ ' + (form.cri.idnDt[1] || '') }}</span>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-model-item v-if="form.cri.naturalYn === 'Y'" label="性别" prop="cri.gender">
                <j-d-select-tag
                  v-if="optType !== 'view'"
                  dict-code="sex"
                  v-model="form.cri.gender"
                  placeholder="请选择性别"
                ></j-d-select-tag>
                <span v-else>{{ fdText('sex', form.cri.gender) }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item v-if="form.cri.naturalYn === 'Y'" label="出生日期" prop="cri.birthDt">
                <j-date
                  v-if="optType !== 'view'"
                  :showLongTerm="false"
                  placeholder="请选择出生日期"
                  v-model="form.cri.birthDt"
                  style="width: 100%"
                ></j-date>
                <span v-else>{{ form.cri.birthDt }}</span>
              </a-form-model-item>
            </a-col>
            <a-col v-if="form.cri.naturalYn === 'Y'" :span="8">
              <a-form-model-item label="婚姻状况">
                <j-d-select-tag
                  v-if="optType !== 'view'"
                  v-model="form.cri.maritalCode"
                  dict-code="MARITAL_CODE"
                ></j-d-select-tag>
                <span v-else>{{ fdText('MARITAL_CODE', form.cri.maritalCode) }}</span>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col v-if="form.cri.naturalYn === 'Y' && relType === 'CLIENT'" :span="8">
              <a-form-model-item label="风险等级" prop="client.riskCode">
                <j-d-select-tag
                  v-if="optType !== 'view'"
                  v-model="form.client.riskCode"
                  dict-code="RISK_CODE"
                ></j-d-select-tag>
                <span v-else>{{ fdText('RISK_CODE', form.client.riskCode) }}</span>
              </a-form-model-item>
            </a-col>
            <a-col v-if="relType === 'CLIENT'" :span="8">
              <a-form-model-item label="核心委托人" prop="client.hostCusParty">
                <j-d-select-tag
                  v-if="optType !== 'view'"
                  v-model="form.client.hostCusParty"
                  dict-code="y_n"
                ></j-d-select-tag>
                <span v-else>{{ fdText('y_n', form.client.hostCusParty) }}</span>
              </a-form-model-item>
            </a-col>
            <a-col v-if="relType === 'CLIENT' && customizeEnv != 'sdic'" :span="8">
              <a-form-model-item label="终止权利日">
                <j-date
                  v-if="optType !== 'view'"
                  placeholder="为实际终止权利日"
                  v-model="form.client.rightSuspDt"
                ></j-date>
                <span v-else>{{ form.client.rightSuspDt }}</span>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <!--chenglin-->
            <a-col :span="8" v-if="customizeEnv === 'sdic' && relType === 'CLIENT'">
              <a-form-model-item label="终止权利日">
                <j-d-select-tag
                  v-if="optType !== 'view'"
                  :disabled="optType == 'view_v'"
                  dict-code="DIS_END_TYPE"
                  v-model="form.client.regulEndDtType"
                ></j-d-select-tag>
                <span v-else>{{ fdText('DIS_END_TYPE', form.client.regulEndDtType) }}</span>
              </a-form-model-item>
            </a-col>
            <a-col
              :span="8"
              v-if="customizeEnv === 'sdic' && relType === 'CLIENT' && form.client.regulEndDtType != '3'"
            >
              <a-form-model-item label="终止日期">
                <j-date
                  v-if="optType !== 'view'"
                  :disabled="optType == 'view_v'"
                  v-model="form.client.rightSuspDt"
                ></j-date>
                <span v-else>{{ form.client.rightSuspDt }}</span>
              </a-form-model-item>
            </a-col>
            <a-col
              :span="8"
              v-if="customizeEnv === 'sdic' && relType === 'CLIENT' && form.client.regulEndDtType === '3'"
            >
              <a-form-model-item label="不确定结束日描述">
                <a-input
                  v-if="optType !== 'view'"
                  :disabled="optType == 'view_v'"
                  v-model="form.client.regulEndCondition"
                ></a-input>
                <span v-else>{{ form.client.regulEndCondition }}</span>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row v-if="relType === 'BENEFICIARY' && form.cri.naturalYn === 'Y'" :gutter="24">
            <a-col :span="8">
              <a-form-model-item label="财务状况">
                <j-d-select-tag
                  v-if="optType !== 'view'"
                  v-model="form.cri.fnancialSituation"
                  dict-code="FNANCIAL_SITUATION"
                ></j-d-select-tag>
                <span v-else>{{ fdText('FNANCIAL_SITUATION', form.cri.fnancialSituation) }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="健康状况">
                <j-d-select-tag
                  v-if="optType !== 'view'"
                  v-model="form.cri.physicaSituation"
                  dict-code="PHYSICA_SITUATION"
                ></j-d-select-tag>
                <span v-else>{{ fdText('PHYSICA_SITUATION', form.cri.physicaSituation) }}</span>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col v-if="form.cri.naturalYn === 'Y'" :span="8">
              <a-form-model-item
                label="职业"
                :prop="customizeEnv === 'zrt' && relType === 'CLIENT' ? 'cri.ocuCode' : ''"
                ><!--:prop="relType === 'OTH'?'':relType === 'INV_REP'?'':'cri.ocuCode'"-->
                <j-d-select-tag
                  v-if="optType !== 'view'"
                  v-model="form.cri.ocuCode"
                  dict-code="OCU_CODE"
                ></j-d-select-tag>
                <span v-else>{{ fdText('OCU_CODE', form.cri.ocuCode) }}</span>
              </a-form-model-item>
            </a-col>
            <a-col v-if="form.cri.naturalYn === 'Y' && customizeEnv != 'zrt'" :span="8">
              <a-form-model-item label="职级">
                <j-d-select-tag
                  v-if="optType !== 'view'"
                  v-model="form.cri.jobTitle"
                  dict-code="JOB_TITLE"
                ></j-d-select-tag>
                <span v-else>{{ fdText('JOB_TITLE', form.cri.jobTitle) }}</span>
              </a-form-model-item>
            </a-col>
            <a-col v-if="form.cri.naturalYn === 'Y'" :span="8">
              <a-form-model-item label="工作单位">
                <a-input
                  v-if="optType !== 'view'"
                  placeholder="请输入工作单位"
                  v-model="form.cri.companyName"
                ></a-input>
                <span v-else>{{ form.cri.companyName }}</span>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col v-if="form.cri.naturalYn === 'Y'" :span="8">
              <a-form-model-item :label="sjhm" prop="cri.cphone">
                <a-input v-if="optType !== 'view'" placeholder="请输入手机号码" v-model="form.cri.cphone"></a-input>
                <span v-else>{{ form.cri.cphone }}</span>
              </a-form-model-item>
            </a-col>
            <a-col v-if="form.cri.naturalYn === 'Y'" :span="8">
              <a-form-model-item label="固定电话" prop="cri.fphone">
                <a-input v-if="optType !== 'view'" placeholder="请输入固定电话" v-model="form.cri.fphone"></a-input>
                <span v-else>{{ form.cri.fphone }}</span>
              </a-form-model-item>
            </a-col>
            <a-col v-if="form.cri.naturalYn === 'Y'" :span="8">
              <a-form-model-item label="电子邮箱" prop="cri.email">
                <a-input v-if="optType !== 'view'" placeholder="请输入电子邮箱" v-model="form.cri.email"></a-input>
                <span v-else>{{ form.cri.email }}</span>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-model-item :label="form.cri.naturalYn === 'Y' ? '国籍' : '所属国别'" prop="cri.natCode">
                <j-d-select-tag
                  v-if="optType !== 'view'"
                  v-model="form.cri.natCode"
                  dict-code="NAT_CODE"
                ></j-d-select-tag>
                <span v-else>{{ fdText('NAT_CODE', form.cri.natCode) }}</span>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="24" v-if="form.cri.natCode === '001' || form.cri.natCode === ''">
              <a-form-model-item
                label="所属地区"
                :key="form.cri.naturalYn"
                :prop="relType === 'INV_REP' ? '' : 'cpac.addrCountyCode' && 'cpac.address'"
                :labelCol="{ span: 3 }"
                :wrapperCol="{ span: 21 }"
              >
                <bi-area
                  :showType="optType !== 'view' ? 'select' : 'text'"
                  :models="[
                    form.cpac.addrProvCode,
                    form.cpac.addrCityCode,
                    form.cpac.addrCountyCode,
                    form.cpac.address,
                  ]"
                  @change="handCpacAreaChange"
                  :show-lv="4"
                  :aginway="form.aginway"
                ></bi-area>
              </a-form-model-item>
            </a-col>

            <a-col v-if="form.cri.naturalYn === 'Y' && customizeEnv === 'zrt' && relType === 'CLIENT'" :span="8">
              <a-form-model-item label="邮政编码" prop="cri.postalCode">
                <a-input v-if="optType !== 'view'" placeholder="请输入邮政编码" v-model="form.cri.postalCode"></a-input>
                <span v-else>{{ form.cri.postalCode }}</span>
              </a-form-model-item>
            </a-col>

            <a-col :span="24" v-if="form.cri.natCode !== '001' && form.cri.natCode !== ''">
              <a-form-model-item
                label="所属地区"
                :key="form.cri.naturalYn"
                :prop="relType === 'INV_REP' ? '' : 'cpac.address'"
                :labelCol="{ span: 3 }"
                :wrapperCol="{ span: 21 }"
              >
                <a-input v-if="optType !== 'view'" placeholder="请输入详细地址" v-model="form.cpac.address"></a-input>
                <span v-else>{{ form.cpac.address }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item
                :label="form.cri.naturalYn === 'Y' ? '居住地区' : '通讯地址'"
                :key="form.cri.naturalYn"
                :prop="relType === 'INV_REP' ? '' : 'cpas.addrCountyCode' && 'cpas.address'"
                :labelCol="{ span: 3 }"
                :wrapperCol="{ span: 21 }"
              >
                <bi-area
                  :showType="optType !== 'view' ? 'select' : 'text'"
                  :models="[
                    form.cpas.addrProvCode,
                    form.cpas.addrCityCode,
                    form.cpas.addrCountyCode,
                    form.cpas.address,
                  ]"
                  @change="handCpasAreaChange"
                  :show-lv="4"
                  :aginway="form.aginway"
                ></bi-area>
              </a-form-model-item>
            </a-col>

            <a-col v-if="form.cri.naturalYn === 'Y' && customizeEnv === 'zrt' && relType === 'CLIENT'" :span="8">
              <a-form-model-item label="邮政编码" prop="cri.livePostalCode">
                <a-input
                  v-if="optType !== 'view'"
                  placeholder="请输入邮政编码"
                  v-model="form.cri.livePostalCode"
                ></a-input>
                <span v-else>{{ form.cri.livePostalCode }}</span>
              </a-form-model-item>
            </a-col>

            <a-col v-if="form.cri.naturalYn === 'N'" :span="24">
              <a-form-model-item
                label="注册地址"
                prop="zcdr.address"
                :labelCol="{ span: 3 }"
                :wrapperCol="{ span: 21 }"
              >
                <a-input v-if="optType !== 'view'" placeholder="请输入注册地址" v-model="form.zcdr.address"></a-input>
                <span v-else>
                  <span v-if="form.cri.partyCode === 'TRUSTEE'">
                    {{ form.cpac.address }}
                  </span>
                  <span v-else>
                    {{ form.zcdr.address }}
                  </span>
                </span>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col v-if="relType === 'BENEFICIARY'" :span="24">
              <a-form-model-item
                label="受益人资料是否齐全"
                prop="cri.bnfinfoCompleteYn"
                :labelCol="{ span: 3 }"
                :wrapperCol="{ span: 21 }"
              >
                <j-d-select-tag
                  v-if="optType !== 'view'"
                  v-model="form.cri.bnfinfoCompleteYn"
                  dict-code="y_n"
                ></j-d-select-tag>
                <span v-else>{{ fdText('y_n', form.cri.bnfinfoCompleteYn) }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item
                v-if="form.cri.naturalYn === 'Y' && relType === 'CLIENT'"
                label="委托人权利条款"
                :labelCol="{ span: 3 }"
                :wrapperCol="{ span: 21 }"
              >
                <a-textarea
                  v-if="optType !== 'view'"
                  class="no-resize"
                  placeholder="请输入委托人权利条款"
                  v-model="form.client.memo"
                  allowClear
                  :rows="4"
                ></a-textarea>
                <span v-else>{{ form.client.memo }}</span>
              </a-form-model-item>

              <a-form-model-item
                v-if="form.cri.naturalYn === 'Y' && relType !== 'SUPERVISER'"
                label="备注"
                :labelCol="{ span: 3 }"
                :wrapperCol="{ span: 21 }"
              >
                <a-textarea
                  v-if="optType !== 'view'"
                  class="no-resize"
                  placeholder="请输入备注"
                  v-model="form.cri.memo"
                  allowClear
                  :rows="4"
                ></a-textarea>
                <span v-else>{{ form.cri.memo }}</span>
              </a-form-model-item>
              <a-form-model-item
                v-if="form.cri.naturalYn === 'N'"
                label="经营范围"
                :labelCol="{ span: 3 }"
                :wrapperCol="{ span: 21 }"
              >
                <a-textarea
                  v-if="optType !== 'view'"
                  class="no-resize"
                  placeholder="请输入经营范围"
                  v-model="form.cri.orgBusScope"
                  allowClear
                  :rows="4"
                ></a-textarea>
                <span v-else>{{ form.cri.orgBusScope }}</span>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-card>

        <a-card
          v-if="relType === 'BENEFICIARY' || relType === 'EXECUTOR'"
          size="small"
          :title="relType === 'EXECUTOR' ? '银行账户' : '信托利益分配账户'"
          style="margin-top: 15px"
        >
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-model-item label="开户银行">
                <j-d-select-tag
                  v-if="optType !== 'view'"
                  v-model="form.cbi.bankCode"
                  dict-code="BANK_CODE"
                ></j-d-select-tag>
                <span v-else>{{ fdText('BANK_CODE', form.cbi.bankCode) }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="户名">
                <a-input v-if="optType !== 'view'" placeholder="请输入户名" v-model="form.cbi.accName"></a-input>
                <span v-else>{{ form.cbi.accName }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="账户">
                <a-input v-if="optType !== 'view'" placeholder="请输入账户" v-model="form.cbi.accNo"></a-input>
                <span v-else>{{ form.cbi.accNo }}</span>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-model-item label="开户行所在地" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
                <bi-area
                  class="bankAdress"
                  :showType="optType !== 'view' ? 'select' : 'text'"
                  :additionalText="optType === 'view' ? form.cbi.accOpenBank : ''"
                  :models="[form.cbi.accBankProvCode, form.cbi.accBankCityCode]"
                  @change="handAreaChange"
                  :show-lv="2"
                ></bi-area>
              </a-form-model-item>
            </a-col>

            <a-col v-if="optType !== 'view'" :span="12">
              <a-form-model-item label="开户银行网点" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
                <a-input placeholder="请输入开户银行网点" v-model="form.cbi.accOpenBank"></a-input>

                <!-- <div style="padding-left:5px">
                  <a-input
                    placeholder="请输入开户银行网点"
                    v-model="form.cbi.accOpenBank"
                  ></a-input>
                </div>-->
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-card>
        <a-card v-if="relType === 'TRUSTEE'" size="small" title="账户信息" style="margin-top: 15px">
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-model-item label="开户银行" prop="cai.bankCode">
                <j-d-select-tag
                  v-if="optType !== 'view'"
                  v-model="form.cai.bankCode"
                  dict-code="BANK_CODE"
                ></j-d-select-tag>
                <span v-else>{{ fdText('BANK_CODE', form.cai.bankCode) }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="户名" prop="cai.accName">
                <a-input v-if="optType !== 'view'" placeholder="请输入户名" v-model="form.cai.accName"></a-input>
                <span v-else>{{ form.cai.accName }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="账户" prop="cai.accNo">
                <a-input v-if="optType !== 'view'" placeholder="请输入账户" v-model="form.cai.accNo"></a-input>
                <span v-else>{{ form.cai.accNo }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="开户银行网点" prop="cai.accOpenBank">
                <a-input
                  v-if="optType !== 'view'"
                  placeholder="请输入开户银行网点"
                  v-model="form.cai.accOpenBank"
                ></a-input>
                <span v-else>{{ form.cai.accOpenBank }}</span>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-card>

        <a-card
          v-if="relType === 'BENEFICIARY' && form.cri.naturalYn === 'Y'"
          size="small"
          title="监护人"
          style="margin-top: 15px"
        >
          <span slot="extra">
            <a-button v-if="optType !== 'view'" type="primary" @click="addGuardian">新增</a-button>
          </span>
          <a-table
            :columns="guardianColumns"
            :dataSource="form.guardians"
            rowKey="id"
            row
            bordered
            :scroll="{ x: 1600 }"
          >
            <template
              v-for="col in [
                { c: 'contName', t: ['input'] },
                { c: 'ptyRelativeType', t: ['dict', 'PTY_RELATIVE_TYPE'] },
                { c: 'idnType', t: ['dict', 'IDNTYPES'] },
                { c: 'idn', t: ['input'] },
                { c: 'address', t: ['input'] },
                { c: 'fphone', t: ['input'] },
                { c: 'cphone', t: ['input'] },
                { c: 'email', t: ['input'] },
                { c: 'memo', t: ['input'] },
              ]"
              :slot="col.c"
              slot-scope="text, record, index"
            >
              <div :key="col.c">
                <a-input
                  v-if="record.editable && col.t[0] === 'input'"
                  style="margin: -5px 0"
                  :value="text"
                  @change="(e) => handleGuardianChange(e.target.value, record.id, col, index)"
                ></a-input>
                <j-d-select-tag
                  v-else-if="record.editable && col.t[0] === 'dict'"
                  :dict-code="col.t[1]"
                  :value="text"
                  @change="(e) => handleGuardianChange(e, record.id, col, index)"
                ></j-d-select-tag>
                <template v-else>{{ col.t[0] === 'input' ? text : fdText(col.t[1], text) }}</template>
              </div>
            </template>
            <template v-if="optType !== 'view'" slot="guardianOpt" slot-scope="text, record, index">
              <div class="editable-row-operations">
                <span v-if="record.editable">
                  <a @click="() => guardianSave(record.id)">确定</a>
                  <a @click="() => guardianCancel(record.id)">取消</a>
                </span>
                <span v-else>
                  <a @click="() => guardianEdit(record.id)">编辑</a>
                  <a-popconfirm title="确定删除吗?" @confirm="() => guardianDel(record.id)">
                    <a>删除</a>
                  </a-popconfirm>
                </span>
              </div>
            </template>
          </a-table>
        </a-card>

        <!--      法定代表人或负责人       -->
        <a-card v-if="form.cri.naturalYn === 'N'" size="small" title="法定代表人或负责人" style="margin-top: 15px">
          <a-form-item label="类型" slot="extra" style="width: 200px; margin: 0; padding: 0">
            <j-d-select-tag
              v-if="optType !== 'view'"
              dict-code="NATURAL_YN"
              v-model="form.cri.principalNaturalYn"
            ></j-d-select-tag>
            <span v-else>{{ fdText('NATURAL_YN', form.cri.principalNaturalYn) }}</span>
          </a-form-item>
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-model-item label="姓名/名称" prop="cri.principalName">
                <a-input
                  v-if="optType !== 'view'"
                  placeholder="请输入姓名/名称"
                  v-model="form.cri.principalName"
                ></a-input>
                <span v-else>{{ form.cri.principalName }}</span>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-model-item label="证件类型" prop="cri.principalIdnType">
                <j-d-select-tag
                  v-if="optType !== 'view'"
                  :dict-code="form.cri.principalNaturalYn === 'Y' ? 'IDNTYPES' : 'ORGIDNTYPES'"
                  v-model="form.cri.principalIdnType"
                  placeholder="请选择证件类型"
                ></j-d-select-tag>
                <span v-else>{{
                  fdText(form.cri.principalNaturalYn === 'Y' ? 'IDNTYPES' : 'ORGIDNTYPES', form.cri.principalIdnType)
                }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="证件号码" prop="cri.principalIdnNo">
                <a-input
                  v-if="optType !== 'view'"
                  placeholder="请输入证件号码"
                  v-model="form.cri.principalIdnNo"
                ></a-input>
                <span v-else>{{ form.cri.principalIdnNo }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="有效期" prop="cri.principalIdnDt">
                <j-date-range
                  v-if="optType !== 'view'"
                  v-model="form.cri.principalIdnDt"
                  @calendarChange="calendarChange"
                  :currentDate="currentDate"
                ></j-date-range>
                <span v-else>{{
                  (form.cri.principalIdnDt[0] || '') + ' ~ ' + (form.cri.principalIdnDt[1] || '')
                }}</span>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-card>
        <a-card v-if="form.cri.naturalYn === 'N'" size="small" title="控股股东或实际控制人" style="margin-top: 15px">
          <a-form-item label="类型" slot="extra" style="width: 200px; margin: 0; padding: 0">
            <j-d-select-tag
              v-if="optType !== 'view'"
              dict-code="NATURAL_YN"
              v-model="form.cri.ctrlerNaturalYn"
            ></j-d-select-tag>
            <span v-else>{{ fdText('NATURAL_YN', form.cri.ctrlerNaturalYn) }}</span>
          </a-form-item>
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-model-item label="姓名/名称">
                <a-input
                  v-if="optType !== 'view'"
                  placeholder="请输入姓名/名称"
                  v-model="form.cri.ctrlerName"
                ></a-input>
                <span v-else>{{ form.cri.ctrlerName }}</span>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-model-item label="证件类型">
                <j-d-select-tag
                  v-if="optType !== 'view'"
                  :dict-code="form.cri.ctrlerNaturalYn === 'Y' ? 'IDNTYPES' : 'ORGIDNTYPES'"
                  v-model="form.cri.ctrlerIdnType"
                  placeholder="请选择证件类型"
                ></j-d-select-tag>
                <span v-else>{{
                  fdText(form.cri.ctrlerNaturalYn === 'Y' ? 'IDNTYPES' : 'ORGIDNTYPES', form.cri.ctrlerIdnType)
                }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="证件号码">
                <a-input
                  v-if="optType !== 'view'"
                  placeholder="请输入证件号码"
                  v-model="form.cri.ctrlerIdnNo"
                ></a-input>
                <span v-else>{{ form.cri.ctrlerIdnNo }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="有效期">
                <j-date-range
                  v-if="optType !== 'view'"
                  v-model="form.cri.ctrlerIdnDt"
                  @calendarChange="calendarChange"
                  :currentDate="currentDate"
                ></j-date-range>
                <span v-else>{{ (form.cri.ctrlerIdnDt[0] || '') + ' ~ ' + (form.cri.ctrlerIdnDt[1] || '') }}</span>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-card>
        <a-card v-if="form.cri.naturalYn === 'N'" size="small" title="联系人（授权经办人）" style="margin-top: 15px">
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-model-item prop="contactors[0].contName" label="姓名/名称">
                <a-input
                  v-if="optType !== 'view'"
                  placeholder="请输入姓名/名称"
                  v-model="form.contactors[0].contName"
                ></a-input>
                <span v-else>{{ form.contactors[0].contName }}</span>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-model-item prop="contactors[0].idnType" label="证件类型">
                <j-d-select-tag
                  v-if="optType !== 'view'"
                  dict-code="IDNTYPES"
                  v-model="form.contactors[0].idnType"
                  placeholder="请选择证件类型"
                ></j-d-select-tag>
                <span v-else>{{ fdText('IDNTYPES', form.contactors[0].idnType) }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item prop="contactors[0].idn" label="证件号码">
                <a-input
                  v-if="optType !== 'view'"
                  placeholder="请输入证件号码"
                  v-model="form.contactors[0].idn"
                ></a-input>
                <span v-else>{{ form.contactors[0].idn }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item prop="contactors[0].idnDt" label="有效期">
                <j-date-range
                  v-if="optType !== 'view'"
                  v-model="form.contactors[0].idnDt"
                  @calendarChange="calendarChange"
                  :currentDate="currentDate"
                ></j-date-range>
                <span v-else>{{
                  (form.contactors[0].idnDt[0] || '') + ' ~ ' + (form.contactors[0].idnDt[1] || '')
                }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="手机号码" prop="contactors[0].cphone">
                <a-input
                  v-if="optType !== 'view'"
                  placeholder="请输入手机号码"
                  v-model="form.contactors[0].cphone"
                ></a-input>
                <span v-else>{{ form.contactors[0].cphone }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="固定电话" prop="contactors[0].fphone">
                <a-input
                  v-if="optType !== 'view'"
                  placeholder="请输入固定电话"
                  v-model="form.contactors[0].fphone"
                ></a-input>
                <span v-else>{{ form.contactors[0].fphone }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="电子邮箱" prop="contactors[0].email">
                <a-input
                  v-if="optType !== 'view'"
                  placeholder="请输入电子邮箱"
                  v-model="form.contactors[0].email"
                ></a-input>
                <span v-else>{{ form.contactors[0].email }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="联系地址" :labelCol="{ span: 3 }" :wrapperCol="{ span: 21 }">
                <bi-area
                  :showType="optType !== 'view' ? 'select' : 'text'"
                  :models="[
                    form.contactors[0].contAddr.addrProvCode,
                    form.contactors[0].contAddr.addrCityCode,
                    form.contactors[0].contAddr.addrCountyCode,
                  ]"
                  @change="handContactorAreaChange"
                  :show-lv="3"
                ></bi-area>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-card>

        <a-card
          v-if="form.cri.naturalYn === 'Y' && relType === 'SUPERVISER'"
          size="small"
          title="监察人（如有）信息"
          style="margin-top: 15px"
        >
          <a-row :gutter="24">
            <a-col :span="24">
              <a-form-model-item
                label="监察人（如有）产生和解任机制"
                :labelCol="{ span: 4 }"
                :wrapperCol="{ span: 20 }"
              >
                <a-textarea
                  v-if="optType !== 'view'"
                  class="no-resize"
                  v-model="form.csi.supervisorInfo"
                  allowClear
                  :rows="4"
                ></a-textarea>
                <span v-else>{{ form.csi.supervisorInfo }}</span>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-card>

        <a-card size="small" title="附件" style="margin-top: 15px">
          <a-row :gutter="24">
            <a-col :span="24">
              <a-form-item label="文件上传">
                <a-upload :fileList="form.files" :multiple="true" :remove="handleRemove" :beforeUpload="beforeUpload">
                  <a-button v-if="optType !== 'view'"> <a-icon type="upload"></a-icon>选择 </a-button>
                </a-upload>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>

        <a-card
          v-if="form.cri.naturalYn === 'Y' && relType !== 'EXECUTOR'"
          size="small"
          title="联系人"
          style="margin-top: 15px"
        >
          <span slot="extra">
            <a-button v-if="optType !== 'view'" type="primary" @click="addContactor">新增</a-button>
          </span>
          <a-table :columns="contactorColumns" :dataSource="form.contactors" rowKey="id" row bordered>
            <template
              v-for="col in [
                { c: 'contName', t: ['input'] },
                { c: 'ptyRelativeType', t: ['dict', 'PTY_RELATIVE_TYPE'] },
                { c: 'address', t: ['input'] },
                { c: 'fphone', t: ['input'] },
                { c: 'cphone', t: ['input'] },
                { c: 'email', t: ['input'] },
                { c: 'memo', t: ['input'] },
              ]"
              :slot="col.c"
              slot-scope="text, record, index"
            >
              <div :key="col.c">
                <a-input
                  v-if="record.editable && col.t[0] === 'input'"
                  style="margin: -5px 0"
                  :value="text"
                  @change="(e) => handleContactorChange(e.target.value, record.id, col, index)"
                ></a-input>
                <j-d-select-tag
                  v-else-if="record.editable && col.t[0] === 'dict'"
                  :dict-code="col.t[1]"
                  :value="text"
                  @change="(e) => handleContactorChange(e, record.id, col, index)"
                ></j-d-select-tag>
                <template v-else>{{ col.t[0] === 'input' ? text : fdText(col.t[1], text) }}</template>
              </div>
            </template>
            <template v-if="optType !== 'view'" slot="contactorOpt" slot-scope="text, record, index">
              <div class="editable-row-operations">
                <span v-if="record.editable">
                  <a @click="() => contactorSave(record.id)">确定</a>
                  <a @click="() => contactorCancel(record.id)">取消</a>
                </span>
                <span v-else>
                  <a @click="() => contactorEdit(record.id)">编辑</a>
                  <a-popconfirm title="确定删除吗?" @confirm="() => contactorDel(record.id)">
                    <a>删除</a>
                  </a-popconfirm>
                </span>
              </div>
            </template>
          </a-table>
        </a-card>
      </a-form-model>
    </a-spin>
    <BiModal
      :visible.sync="modal.visible"
      :width="1000"
      :title="modal.title"
      :fullscreen.sync="modal.fullscreen"
      :switchFullscreen="modal.switchFullscreen"
      @handleOk="addRel"
      :confirmLoading="modal.confirmLoading"
    >
      <a-card :bordered="false">
        <div class="table-page-search-wrapper">
          <a-form-model layout="inline">
            <a-row :gutter="24">
              <a-col :span="10">
                <BiFormItemInput label="受益人姓名/名称" placeholder="受益人姓名/名称" v-model="queryP.partyName" />
              </a-col>
              <BiCol>
                <BiTableSearchBtns @searchReset="searchReset" @searchQuery="searchQuery" :isAdvanced="false" />
              </BiCol>
            </a-row>
          </a-form-model>
        </div>

        <a-table
          class="table-min-height"
          ref="table"
          size="small"
          rowKey="id"
          :columns="columns"
          :dataSource="real"
          :pagination="false"
          :loading="loading"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, selectionRows: selectionRows, onChange: onSelectChange }"
          @change="handleTableChange1"
        >
          <template slot="partyPersent" slot-scope="text, record, index">{{ text }}</template>
          <template v-for="(col, i) in ['partyPersent']" :slot="col" slot-scope="text, record, index">
            <a-input
              :key="col"
              style="margin: -5px 0"
              :value="text"
              @change="(e) => handleChange(e.target.value, col, record.id)"
            />
          </template>
        </a-table>
      </a-card>
    </BiModal>

    <BiModal
      :visible.sync="modal.visibles"
      :width="1000"
      title="关系人"
      :fullscreen.sync="modal.fullscreen"
      :switchFullscreen="modal.switchFullscreen"
      @handleOk="addRelForXm"
      @cancel="cancelForXm"
      :confirmLoading="modal.confirmLoading"
    >
      <a-card :bordered="false">
        <div class="table-page-search-wrapper">
          <a-form-model layout="inline">
            <a-row :gutter="24">
              <a-col :span="10">
                <BiFormItemInput label="关系人姓名/名称" placeholder="关系人姓名/名称" v-model="queryP.partyName" />
              </a-col>
              <BiCol>
                <BiTableSearchBtns
                  @searchReset="searchResetforxm"
                  @searchQuery="searchQueryforxm"
                  :isAdvanced="false"
                />
              </BiCol>
            </a-row>
          </a-form-model>
        </div>

        <a-table
          class="table-min-height"
          ref="table"
          size="small"
          rowKey="id"
          :columns="columnsforxm"
          :dataSource="real"
          :pagination="false"
          :loading="loading"
          :rowSelection="{
            type: 'radio',
            selectedRowKeys: selectedRowKeys,
            selectionRows: selectionRows,
            onChange: onSelectChange,
          }"
          @change="handleTableChange1"
        ></a-table>
      </a-card>
    </BiModal>
  </a-modal>
</template>

<script>
import dictMixin from '@mixins/dictMixin'
import { getDict } from '@/api/BiApi'
import JDSelectTag from '../../../components/dict/JDSelectTag'
import JDate from '../../../components/jeecg/JDate'
import JDateRange from '../../../components/jeecg/JDateRange'
import BiArea from '../../../components/BI/BiArea'
import JUpload from '../../../components/jeecg/JUpload'
import WkfNextUserModal from '@views/activiti/modules/WkfNextUserModal'
import { filterDictText, initDictOptions } from '@/components/dict/JDictSelectUtil'
import { postAction, httpActionWF } from '../../../api/manage'
import { initDictOptionsBatch } from '../../../components/dict/JDictSelectUtil'
import { filterObj } from '@/utils/util'
import { getAction, deleteActionByPostMethod, downFile } from '@/api/manage'
import { handleRemove } from '../../../utils/fileRemove'
import moment from 'moment'
import * as customizeConfigs from '../../../customizeConfig'

export default {
  name: 'RelPartyModal',
  components: { JUpload, BiArea, JDateRange, JDate, JDSelectTag, WkfNextUserModal },
  mixins: [dictMixin],
  inject: ['closeCurrent'],
  data() {
    let that = this
    let customizeEnv = customizeConfigs.customizeEnv
    let ruleReq = [{ required: true, message: '必输字段', trigger: ['change', 'blur'] }]
    let ruleEmail = [{ validator: that.validateEmail, trigger: ['change', 'blur'] }]
    let rulePhone = [{ validator: that.validatePhone, trigger: ['change', 'blur'] }]
    let ruleFphone = [{ validator: that.validateFphone, trigger: ['change', 'blur'] }]
    let cri = {
      naturalYn: 'Y',
      partyName: '',
      sibYn: 'Y',
      father: '',
      mather: '',
      spouse: '',
      gender: '',
      // 所属地区邮政编码
      postalCode: '',
      // 居住地区邮政编码
      livePostalCode: '',
      birthDt: '',
      idnType: '',
      idn: '',
      idnDt: [],
      natCode: '',
      maritalCode: '',
      ocuCode: '',
      jobTitle: '',
      companyName: '',
      cphone: '',
      fphone: '',
      email: '',
      prjCode: that.$route.query.prjCode,
      orgType: '',
      jrxkzh: '',
      orgBusScope: '',
      principalNaturalYn: 'Y',
      principalName: '',
      principalIdnType: '',
      principalIdnNo: '',
      principalIdnDt: [],
      ctrlerNaturalYn: 'Y',
      ctrlerName: '',
      ctrlerIdnType: '',
      ctrlerIdnNo: '',
      ctrlerIdnDt: [],
      bnfinfoCompleteYn: '',
      fnancialSituation: '',
      physicaSituation: '',
      creditCode: '',
    }
    let cpac = { addrProvCode: '', addrCityCode: '', addrCountyCode: '', address: '' }
    let cpas = { addrProvCode: '', addrCityCode: '', addrCountyCode: '', address: '' }
    let zcdr = { address: '' }
    let client = {
      riskCode: '',
      hostCusParty: '',
      rightSuspDt: '',
      memo: '',
      prjCode: that.$route.query.prjCode,
      regulEndDtType: '',
      regulEndCondition: '',
    }
    let cppm = { prjCode: that.$route.query.prjCode, relTypeCode: '', cusRelativeType: '', cusRelativeName: '' }
    let cai = { bankCode: '', accName: '', accNo: '', accOpenBank: '' }
    let cbi = {
      bankCode: '',
      bnfType: '',
      bnfRank: '',
      bnfStatus: '',
      bnfModifyDt: '',
      bnfReason: '',
      accName: '',
      accNo: '',
      accOpenBank: '',
      accBankProvCode: '',
      accBankCityCode: '',
      memo: '',
    }
    let csi = {
      supRank: '',
      officeStdDt: '',
      officeEndDt: '',
      supervisorInfo: '',
      officeEndType: '',
      officeStdType: '',
      oneYearOld: '',
    }
    let cii = {
      invRank: '',
    }
    let oth = {
      relRank: '',
      relType: '',
    }
    let files = []
    let fo = {
      cri: cri,
      client: client,
      cpac: cpac,
      cpas: cpas,
      zcdr: zcdr,
      cai: cai,
      cbi: cbi,
      csi: csi,
      cii: cii,
      oth: oth,
      files: files,
      cppm: cppm,
      contactors: [],
      guardians: [],
      aginway: false, //预处理选择信息带入，地址翻译不全标记，在地址插件中使用
    }
    let r = {}
    let genRules = function (obj, name) {
      let xx = Object.keys(obj)
      for (let i = 0; i < xx.length; i++) {
        r[name + '.' + xx[i]] = ruleReq
        if (xx[i] == 'email') {
          r[name + '.' + xx[i]] = ruleEmail
        }
        if (xx[i] == 'cphone') {
          r[name + '.' + xx[i]] = rulePhone
        }
        if (xx[i] == 'fphone') {
          r[name + '.' + xx[i]] = ruleFphone
        }
      }
    }
    genRules(cri, 'cri')
    genRules(cai, 'cai')
    genRules(cppm, 'cppm')
    genRules(client, 'client')
    genRules(cpac, 'cpac')
    genRules(cpas, 'cpas')
    genRules(zcdr, 'zcdr')
    genRules(cbi, 'cbi')
    genRules(csi, 'csi')
    genRules(cii, 'cii')
    genRules(oth, 'oth')
    r['contactors[0].contName'] = ruleReq
    r['contactors[0].idnType'] = ruleReq
    r['contactors[0].idn'] = ruleReq
    r['contactors[0].idnDt'] = ruleReq
    r['contactors[0].fphone'] = [{ validator: this.validateConFhone, trigger: ['change', 'blur'] }]
    r['contactors[0].cphone'] = [{ validator: this.validateConChone, trigger: ['change', 'blur'] }]
    r['contactors[0].email'] = ruleEmail
    let conColumns = [
      {
        title: '与委托人关系',
        width: 130,
        dataIndex: 'ptyRelativeType',
        scopedSlots: { customRender: 'ptyRelativeType' },
      },
      {
        title: '姓名',
        width: 100,
        dataIndex: 'contName',
        scopedSlots: { customRender: 'contName' },
      },
      {
        title: '联系地址',
        dataIndex: 'address',
        scopedSlots: { customRender: 'address' },
      },
      {
        title: '手机号码',
        width: 150,
        dataIndex: 'fphone',
        scopedSlots: { customRender: 'fphone' },
      },
      {
        title: '固定电话',
        width: 150,
        dataIndex: 'cphone',
        scopedSlots: { customRender: 'cphone' },
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        scopedSlots: { customRender: 'email' },
      },
      {
        title: '备注',
        dataIndex: 'memo',
        scopedSlots: { customRender: 'memo' },
      },
    ]
    let gColumns = [
      {
        title: '证件类型',
        width: 100,
        dataIndex: 'idnType',
        scopedSlots: { customRender: 'idnType' },
      },
      {
        title: '证件号码',
        dataIndex: 'idn',
        scopedSlots: { customRender: 'idn' },
      },
    ]
    gColumns.unshift(2, 0)
    let conOption = {
      title: '操作',
      dataIndex: 'operation',
      width: '10%',
      scopedSlots: { customRender: 'contactorOpt' },
    }
    let gOption = {
      title: '操作',
      dataIndex: 'operation',
      fixed: 'right',
      width: '120px',
      scopedSlots: { customRender: 'guardianOpt' },
    }
    let gc = [...conColumns, gOption]
    Array.prototype.splice.apply(gc, gColumns)
    return {
      treeData:[],
      zs: false,
      selectList: ['切换至下拉菜单'],
      spangx: '8',
      other: 'N',
      xshs: 'cppm.cusRelativeType',
      sjhm: '手机号码',
      customizeEnv: customizeEnv,
      momVal: '',
      moment,
      subPerson: '',
      title: ' ',
      titles: '',
      optType: '',
      relType: '',
      visible: false,
      visibles: false,
      model: {},
      real: [],
      realData: '',
      devd: '',
      confirmLoading: false,
      formStr: JSON.stringify(fo),
      form: fo,
      rules: r,
      isPrjSetup: false,
      trustExprDt: '',
      contName: null,
      url: {
        list: '/prj/rel/beneficiary',
        save: '/prj/rel/save',
        upload: '/sys/common/biUpload',
        findByPartyCode: '/prj/rel/findByPrjCode',
        findPartysByPrjCode: '/prj/rel/relatedpersoninformation',
        updateRealperson: '/prj/rel/updatePerson',
        getSubPerson: '/prj/rel/getSubPerson',
      },
      formStyle: {},
      contactorColumns: [...conColumns, conOption],
      guardianColumns: gc,
      cacheData: [],
      editingId: '',
      guardianCacheData: [],
      guardianEditingId: '',
      dictOptionsData: [],
      currentDate: {},
      queryP: {},
      dataSource1: [],
      /* table加载状态 */
      loading: false,
      /* table选中keys*/
      selectedRowKeys: [],
      /* table选中records*/
      selectionRows: [],
      partyList: [],
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 90,
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          },
        },
        {
          title: '姓名/名称',
          width: '100',
          dataIndex: 'partyName',
        },
        {
          title: '占当前受益人比例（%）',
          dataIndex: 'partyPersent',
          key: 'partyPersent',
          width: '100',
          scopedSlots: { customRender: 'partyPersent' },
        },
        {
          title: '证件类型',
          dataIndex: 'idnType',
          width: '100',
          customRender: function (t, r, index) {
            if (r.naturalYn === 'Y') {
              return that.fdText('IDNTYPES', t)
            } else {
              return that.fdText('ORGIDNTYPES', t)
            }
          },
        },
        {
          title: '证件号码',
          dataIndex: 'idn',
          width: '150',
        },
        {
          title: '手机号码',
          dataIndex: 'cphone',
          width: '100',
          customRender: function (t, r, index) {
            if (t == null || t == '') {
              return '--'
            } else {
              return t
            }
          },
        },
        {
          title: '与委托人关系',
          dataIndex: 'cusRelativeType',
          width: '50',
          customRender: (text) => that.getDictNameByCode(that.dicts.PTY_RELATIVE_TYPE, text),
        },
      ],
      columnsforxm: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 90,
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          },
        },
        {
          title: '姓名/名称',
          width: '100',
          dataIndex: 'partyName',
        },
        {
          title: '证件类型',
          dataIndex: 'idnType',
          width: '100',
          customRender: function (t, r, index) {
            if (r.naturalYn === 'Y') {
              return that.fdText('IDNTYPES', t)
            } else {
              return that.fdText('ORGIDNTYPES', t)
            }
          },
        },
        {
          title: '证件号码',
          dataIndex: 'idn',
          width: '150',
        },
        {
          title: '手机号码',
          dataIndex: 'cphone',
          width: '100',
          customRender: function (t, r, index) {
            if (t == null || t == '') {
              return '--'
            } else {
              return t
            }
          },
        },
        {
          title: '与委托人关系',
          dataIndex: 'cusRelativeType',
          width: '50',
          customRender: (text) => that.getDictNameByCode(that.dicts.PTY_RELATIVE_TYPE, text),
        },
      ],
      modal: {
        title: '下级收益人',
        visible: false,
        visibles: false,
        fullscreen: false,
        switchFullscreen: false,
        confirmLoading: false,
      },
    }
  },
  created() {
    // 初始化监察人权利数据
    getAction('/sys/category/getListByPid/1330809779664211969','').then((res)=>{
      if(res.success){
        this.treeData = [...this.getTreeData(res.result)];
      }
    })
    // 初始化字典
    this.initDict()
    this.initDictConfig()
    // 中融个性化
    if (this.form.cppm.cusRelativeType == 'OTH') {
      this.other = 'Y'
    }
    if (this.customizeEnv == 'zrt') {
      this.spangx = '6'
      this.xshs = ''
      this.sjhm = '手机号码'
    }
    this.formStyle = { height: document.body.clientHeight - 160 + 'px', overflowY: 'auto' }
  },
  watch: {
    relType(val) {
      if (val === 'CLIENT') {
        this.contactorColumns[0].title = '与委托人关系'
      } else if (val === 'BENEFICIARY') {
        this.contactorColumns[0].title = '与受益人关系'
      } else if (val === 'SUPERVISER') {
        this.contactorColumns[0].title = '与监察人关系'
      }
    },
    'form.cri.idnDt'(val) {
      if (val[0] == '') {
        this.form.cri.idnDt = []
      }
    },
    'form.csi.officeStdType'(val) {
      if (val === '3') {
        this.zs = true
      } else {
        this.zs = false
      }
    },

    'form.cri.birthDt'(val, oldVal) {
      if (!val) return
      this.momVal = moment()
      if ((this.momVal.format(val.replace(/-/gi, '').substring(0, 8)) || 0) > this.momVal.format('YYYYMMDD')) {
        this.$message.warn('出生日期不能大于当前日期')
        this.$set(this.form.cri, 'birthDt', oldVal)
      }
    },
    'form.client.regulEndDtType'(val, oldVal) {
      if (this.customizeEnv === 'sdic') {
        if (val === '2') {
          this.form.client.rightSuspDt = this.trustExprDt
          this.form.client.regulEndCondition = ''
        } else if (val === '3') {
          this.form.client.rightSuspDt = ''
        }
      }
    },

    /* 'form.csi.officeStdType'(val){
      this.rules['csi.officeStdType'][0].message=val
    },*/

    //任职开始和任职结束 日期 校验
    'form.csi.officeStdDt'(val) {
      //任职开始
      if (!val || !this.form.csi.officeEndDt) return
      if ((val.replace(/-/gi, '') || 0) > (this.form.csi.officeEndDt.replace(/-/gi, '') || 0)) {
        this.$message.error('任职结束不能早于开始')
        this.form.csi.officeStdDt = ''
      }
    },
    'form.csi.officeEndDt'(val) {
      //任职结束
      if (!val || !this.form.csi.officeStdDt) return
      if ((val.replace(/-/gi, '') || 0) < (this.form.csi.officeStdDt.replace(/-/gi, '') || 0)) {
        this.$message.error('任职结束不能早于开始')
        this.form.csi.officeEndDt = ''
        return
      }
    },
    /*'form.cppm.cusRelativeType'(val, oldVal) {
      if ((oldVal !== '' && val !== '') || (this.optType === 'add' && oldVal === '')) {
        this.titles = '关系人'
        //加载数据 若传入参数1则加载第一页的内容
        this.ipagination1.current = 1
        this.url.list = '/prj/rel/relatedpersoninformation'
        let params = this.getQueryParams1() //查询条件
        this.loading = true
        getAction(this.url.list, params).then((res) => {
          if (res.success && res.result) {
            this.dataSource1 = res.result.records
            this.real = this.dataSource1
            this.ipagination1.total = res.result.total
          }
          if (res.code === 510) {
            this.$message.warning(res.message)
          }
        })
        this.loading = false
        this.selectedRowKeys = []
        this.selectionRows = []z
        this.modal.visibles = true
      }
    },*/
  },
  methods: {
    getTreeData(arr) {
      arr.length && arr.forEach(item=>{
        item.key = item.id
        item.value = item.id
        item.title = item.name
        if( item.children.length ){
          this.getTreeData(item.children)
        }
      })
      return arr
    },
    cancelForXm() {
      this.modal.visibles = false
    },
    handleChangeOth(value) {
      if (value == '切换至下拉菜单') {
        this.other = 'N'
      }
    },
    valueOther(value) {
      if (value === 'OTH') {
        this.other = 'Y'
      } else {
        this.other = 'N'
      }
    },
    validatePhone(rule, value, callback) {
      if (!(this.form.cri.cphone || this.form.cri.fphone)) {
        callback('手机号码和固定电话至少填写一个')
        return
      }

      if (value) {
        if (!new RegExp(/^1[3|4|5|7|8|9][0-9]\d{8}$/).test(value)) {
          callback('请输入正确格式手机号码!')
          return
        }
      }
      callback()
      this.$refs.form.clearValidate('cri.fphone')
    },
    validateConChone(rule, value, callback) {
      if (!(this.form.contactors[0].cphone || this.form.contactors[0].fphone)) {
        callback('手机号码和固定电话至少填写一个')
        return
      }
      if (value) {
        if (!new RegExp(/^1[3|4|5|7|8|9][0-9]\d{8}$/).test(value)) {
          callback('请输入正确格式手机号码!')
          return
        }
      }
      callback()
      this.$refs.form.clearValidate('contactors[0].fphone')
    },
    validateFphone(rule, value, callback) {
      if (!(this.form.cri.cphone || this.form.cri.fphone)) {
        callback('手机号码和固定电话至少填写一个')
        return
      }
      if (value) {
        if (!new RegExp(/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/).test(value)) {
          callback('请输入正确格式固定电话!')
          return
        }
      }
      callback()
      this.$refs.form.clearValidate('cri.cphone')
    },
    validateConFhone(rule, value, callback) {
      if (!(this.form.contactors[0].cphone || this.form.contactors[0].fphone)) {
        callback('手机号码和固定电话至少填写一个')
        return
      }
      if (value) {
        if (!new RegExp(/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/).test(value)) {
          callback('请输入正确格式固定电话!')
          return
        }
      }
      callback()
      this.$refs.form.clearValidate('contactors[0].cphone')
    },
    validateEmail(rule, value, callback) {
      if (!value) {
        callback()
      } else {
        if (
          new RegExp(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ).test(value)
        ) {
          callback()
        } else {
          callback('请输入正确格式的邮箱!')
        }
      }
    },
    async addRel() {
      if (!this.selectedRowKeys.length) {
        this.$message.warn('请选择要加入的受益人')
        return
      }
      if (this.selectedRowKeys.length === 1) {
        if (this.selectionRows[0].partyPersent !== '100') {
          this.$message.warn('分配比例总和必须为100%')
          return
        }
      }
      if (this.selectedRowKeys.length > 1) {
        let vsl = 0
        this.selectionRows.forEach((a) => {
          vsl += parseInt(a.partyPersent)
        })
        if (vsl !== 100) {
          this.$message.warn('分配比例总和必须为100%')
          return
        }
      }
      let param = {}
      this.loading = true
      this.selectionRows.forEach((a) => {
        a.parentNode = this.form.cri.partyCode
        this.realData += JSON.stringify(a) + '&'
      })
      param.da = this.realData
      if (this.form.cri.partyCode !== undefined && this.form.cri.partyCode !== '') {
        //新增受益人调用该方法
        deleteActionByPostMethod(this.url.updateRealperson, param)
          .then((res) => {
            if (res.success) {
              this.$message.success('操作成功')
              this.subPerson = ''
              this.realData = ''
              this.selectionRows.forEach((a) => {
                this.subPerson += a.partyName + '(' + a.partyPersent + '%)' + ','
              })
              this.subPerson = this.subPerson.substring(0, this.subPerson.length - 1)
              this.modal.visible = false
              this.modal.visibles = false
            } else {
              this.$message.warning(res.message)
            }
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        this.subPerson = ''
        this.selectionRows.forEach((a) => {
          this.subPerson += a.partyName + '(' + a.partyPersent + '%)' + ','
        })
        this.subPerson = this.subPerson.substring(0, this.subPerson.length - 1)
        this.modal.visible = false
        this.modal.visibles = false
      }
    },
    async addRelForXm() {
      if (!this.selectedRowKeys.length) {
        this.$message.warn('请选择要加入的关系人')
        return
      }
      if (this.selectedRowKeys.length > 1) {
        this.$message.warn('关系人必须唯一')
        return
      }
      let param = {}
      this.loading = true
      this.realData = ''
      this.selectionRows.forEach((a) => {
        a.parentNode = this.form.cri.partyCode
        this.realData += JSON.stringify(a)
      })

      param.da = this.realData
      if (param.da != null && param.da != '') {
        let newDate = JSON.parse(param.da)
        // 姓名
        this.form.cri.partyName = newDate.partyName
        if (newDate.partyName) {
          this.$refs.form.clearValidate('cri.partyName')
        }
        //与委托人关系 兼容性处理
        if (newDate.cusRelativeType != '' && newDate.cusRelativeType != null) {
          this.form.cppm.cusRelativeType = newDate.cusRelativeType
        }
        // 手机号
        this.form.cri.cphone = newDate.cphone
        // 证件号
        this.form.cri.idn = newDate.idn
        // 证件类型
        this.form.cri.idnType = newDate.idnType
        // 性别
        this.form.cri.gender = newDate.gender
        // 出生日期
        this.form.cri.birthDt = newDate.birthDt
        // 国籍
        this.form.cri.natCode = newDate.natCode
        // 邮箱
        this.form.cri.email = newDate.email
        // 证件有效期
        /*this.form.cri.idnDt[0] = newDate.idnStdDt
        this.form.cri.idnDt[1] = newDate.idnEndDt*/
        this.form.cri.idnDt = [newDate.idnStdDt, newDate.idnEndDt]
        // 婚姻状况
        this.form.cri.maritalCode = newDate.maritalCode
        // 财务状况
        this.form.cri.fnancialSituation = newDate.fnancialSituation
        // 健康状况
        this.form.cri.physicaSituation = newDate.physicaSituation
        //固定电话
        this.form.cri.fphone = newDate.fphone
        //地址1
        this.form.cpac.addrProvCode = newDate.addrProvCode
        this.form.cpac.addrCityCode = newDate.addrCityCode
        this.form.cpac.addrCountyCode = newDate.addrCountyCode
        this.form.cpac.address = newDate.address
        //地址2
        this.form.cpas.addrProvCode = newDate.addrProvCode1
        this.form.cpas.addrCityCode = newDate.addrCityCode1
        this.form.cpas.addrCountyCode = newDate.addrCountyCode1
        this.form.cpas.address = newDate.address1
        //备注
        this.form.cri.memo = newDate.memo
        this.form.aginway = true //标识是选择录入得信息
      }
      // 关闭模态框
      this.modal.visibles = false
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectedRows
    },
    handleChange(value, column, index) {
      this.real.forEach((item) => {
        if (item.id === index) {
          item.partyPersent = value
        }
      })
    },
    initDict() {
      this.getDict('IDNTYPES,ORGIDNTYPES,PTY_RELATIVE_TYPE,OTH_REL_TYPE,BNF_RANK')
      let params = this.getQueryParams1() //查询条件
      this.loading = true
      getAction(this.url.findPartysByPrjCode, params).then((res) => {
        if (res.success && res.result) {
          let typeAndIdSet = new Set()
          let record = []
          if (res.result) {
            record = res.result.filter((item) => {
              var typeAndId = item.idnType + '|' + item.idn
              if (!typeAndIdSet.has(typeAndId)) {
                typeAndIdSet.add(typeAndId)
                return true
              } else {
                return false
              }
            })
          }

          this.partyList = record.map((item) => {
            return { name: item.partyName, value: item.id }
          })
        }
        if (res.code === 510) {
          this.$message.warning(res.message)
        }
      })
    },
    searchQuery() {
      this.loadNetData(1)
    },
    // 重置
    searchReset() {
      this.queryP = {}
      this.loadNetData(1)
    },
    searchQueryforxm() {
      this.loadNetData('xm')
    },
    // 重置
    searchResetforxm() {
      this.queryP = {}
      this.loadNetData('xm')
    },
    wkfUserComplete() {
      this.$emit('ok')
      this.close()
    },
    loadNetData(arg) {
      if (!this.url.list) {
        this.$message.error('请设置url.list属性!')
        return
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 'xm') {
        this.url.list = '/prj/rel/relatedpersoninformation'
      }
      let params = this.getQueryParams1() //查询条件
      this.loading = true
      getAction(this.url.list, params).then((res) => {
        if (res.success && res.result) {
          //对关系人进行去重，前端处理，后端有些需要全部查询
          let typeAndIdSet = new Set()
          let record = []
          if (res.result) {
            record = res.result.filter((item) => {
              var typeAndId = item.id
              if (!typeAndIdSet.has(typeAndId)) {
                typeAndIdSet.add(typeAndId)
                return true
              } else {
                return false
              }
            })
          }
          this.dataSource1 = record
          this.real = this.dataSource1
        }
        if (res.code === 510) {
          this.$message.warning(res.message)
        }
      })
      this.loading = false
    },
    getQueryParams1() {
      let that = this
      //获取查询条件
      let sqp = {}
      if (this.superQueryParams) {
        sqp['superQueryParams'] = encodeURI(this.superQueryParams)
      }
      let param = Object.assign(sqp, that.queryP, this.isorter, this.filters)
      param.prjCode = this.$route.query.prjCode
      param.parentNode = this.form.cri.partyCode
      //处理关系人之间不同类型不能共存的问题
      param.relTypeCode = this.relType
      return filterObj(param)
    },

    handleTableChange1(pagination, filters, sorter) {
      //分页、排序、筛选变化时触发
      //TODO 筛选
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field
        this.isorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
      }
      this.ipagination1 = pagination
      this.loadNetData()
    },
    chooseP(value) {
      this.loadNetData(value)
      this.selectedRowKeys = []
      this.selectionRows = []
      this.modal.visible = true
    },
    choosePX(value) {
      this.titles = '关系人'
      this.loadNetData(value)
      this.selectedRowKeys = []
      this.selectionRows = []
      this.modal.visibles = true
      this.form.aginway = false //勿删，地址插件监控使用
    },
    initDictConfig() {
      let that = this
      initDictOptionsBatch(
        'BANK_CODE,STATUS_RSN_CODE,BNF_STATUS,BNF_RANK,BNF_TYPE,PTY_RELATIVE_TYPE,OTH_REL_TYPE,sex,IDNTYPES,RISK_CODE,NAT_CODE,MARITAL_CODE,y_n,OCU_CODE,JOB_TITLE,ORGIDNTYPES,ORG_TYPE,CUS_CATEGORY_ORGAN,' +
          'NATURAL_YN,FNANCIAL_SITUATION,PHYSICA_SITUATION,CUSSUP_OFFICE_STD_TYPE,CUSSUP_OFFICE_END_TYPE,REL_TYPE,DIS_END_TYPE'
      ).then((res) => {
        if (res.success) {
          that.dictOptionsData = res.result
        }
      })
    },
    fdText(o, v) {
      return filterDictText(this.dictOptionsData[o], v)
    },
    queryPrjInfo() {
      postAction('/prj/findByPrjCode', { cli: { prjCode: this.$route.query.prjCode } }).then((res) => {
        if (res.success) {
          this.trustExprDt = res.result.cli.trustExprDt
          this.isPrjSetup = res.result.cli.prjStatus === 'R'
        }
      })
    },
    initPage(relType, record) {
      //获取下级受益人信息
      this.subPerson = ''
      let par = {}
      par.partyCode = record.PARTY_CODE
      getAction(this.url.getSubPerson, par).then((res) => {
        if (res.success && res.result) {
          res.result.records.forEach((item) => {
            if (item.partyPersent != '0') {
              this.subPerson += item.partyName + '(' + item.partyPersent + '%)' + ','
            }
          })
          this.subPerson = this.subPerson.substring(0, this.subPerson.length - 1)
        }
      })
      this.queryPrjInfo()
      this.confirmLoading = true
      this.relType = relType
      this.visible = true
      /*if (relType === 'OTH') {
        this.form.cppm.relTypeCode = record.REL_TYPE_CODE
      } else {*/
      this.form.cppm.relTypeCode = this.relType
      /*}*/
      this.form.cri.partyCode = record.PARTY_CODE
      let that = this
      postAction(this.url.findByPartyCode, this.form)
        .then((res) => {
          if (res.success) {
            let conColumns = [
              {
                title: '与委托人关系',
                width: 130,
                dataIndex: 'ptyRelativeType',
                scopedSlots: { customRender: 'ptyRelativeType' },
              },
              {
                title: '姓名',
                width: 100,
                dataIndex: 'contName',
                scopedSlots: { customRender: 'contName' },
              },
              {
                title: '联系地址',
                dataIndex: 'address',
                scopedSlots: { customRender: 'address' },
              },
              {
                title: '手机号码',
                width: 150,
                dataIndex: 'fphone',
                scopedSlots: { customRender: 'fphone' },
              },
              {
                title: '固定电话',
                width: 150,
                dataIndex: 'cphone',
                scopedSlots: { customRender: 'cphone' },
              },
              {
                title: '邮箱',
                dataIndex: 'email',
                scopedSlots: { customRender: 'email' },
              },
              {
                title: '备注',
                dataIndex: 'memo',
                scopedSlots: { customRender: 'memo' },
              },
            ]
            let gColumns = [
              {
                title: '证件类型',
                width: 100,
                dataIndex: 'idnType',
                scopedSlots: { customRender: 'idnType' },
              },
              {
                title: '证件号码',
                dataIndex: 'idn',
                scopedSlots: { customRender: 'idn' },
              },
            ]
            gColumns.unshift(2, 0)
            let conOption = {
              title: '操作',
              dataIndex: 'operation',
              width: '10%',
              scopedSlots: { customRender: 'contactorOpt' },
            }
            let gOption = {
              title: '操作',
              dataIndex: 'operation',
              fixed: 'right',
              width: '120px',
              scopedSlots: { customRender: 'guardianOpt' },
            }
            if (this.optType == 'view') {
              //查看页面去掉操作那一列
              let gc = [...conColumns]
              Array.prototype.splice.apply(gc, gColumns)
              this.contactorColumns = [...conColumns]
              this.guardianColumns = gc
            } else {
              let gc = [...conColumns, gOption]
              Array.prototype.splice.apply(gc, gColumns)
              this.contactorColumns = [...conColumns, conOption]
              this.guardianColumns = gc
            }

            Object.keys(res.result).forEach((key) => res.result[key] == null && delete res.result[key])
            res.result.cri.idnDt = [res.result.cri.idnStdDt, res.result.cri.idnEndDt]
            if (res.result.contactors && res.result.contactors.length > 0) {
              res.result.contactors.forEach((contactor) => {
                contactor.idnDt = [contactor.idnStdDt, contactor.idnEndDt]
                contactor.address = contactor.contAddr.address
              })
            } else if (relType === 'TRUSTEE') {
              res.result.contactors = [{ idnDt: [], contAddr: {} }]
            }
            if (res.result.cbi && res.result.cbi.bnfType === '2') {
              that.rules = {}
            } else {
              let ruleReq = [{ required: true, message: '必输字段', trigger: ['change', 'blur'] }]
              let ruleEmail = [{ validator: this.validateEmail, trigger: ['change', 'blur'] }]
              let rulePhone = [{ validator: this.validatePhone, trigger: ['change', 'blur'] }]
              let ruleFphone = [{ validator: this.validateFphone, trigger: ['change', 'blur'] }]
              let cri = {
                partyName: '',
                sibYn: 'Y',
                father: '',
                mather: '',
                spouse: '',
                gender: '',
                // 所属地区邮政编码
                postalCode: '',
                // 居住地区邮政编码
                livePostalCode: '',
                birthDt: '',
                idnType: '',
                idn: '',
                idnDt: [],
                natCode: '',
                maritalCode: '',
                ocuCode: '',
                jobTitle: '',
                companyName: '',
                cphone: '',
                fphone: '',
                email: '',
                prjCode: this.$route.query.prjCode,
                orgType: '',
                jrxkzh: '',
                orgBusScope: '',
                principalNaturalYn: 'Y',
                principalName: '',
                principalIdnType: '',
                principalIdnNo: '',
                principalIdnDt: [],
                ctrlerNaturalYn: 'Y',
                ctrlerName: '',
                ctrlerIdnType: '',
                ctrlerIdnNo: '',
                ctrlerIdnDt: [],
                bnfinfoCompleteYn: '',
                fnancialSituation: '',
                physicaSituation: '',
                creditCode: '',
              }
              let cpac = { addrProvCode: '', addrCityCode: '', addrCountyCode: '', address: '' }
              let cpas = { addrProvCode: '', addrCityCode: '', addrCountyCode: '', address: '' }
              let zcdr = { address: '' }
              let client = {
                riskCode: '',
                hostCusParty: '',
                rightSuspDt: '',
                memo: '',
                prjCode: this.$route.query.prjCode,
              }
              let cppm = {
                prjCode: this.$route.query.prjCode,
                relTypeCode: '',
                cusRelativeType: '',
                cusRelativeName: '',
              }
              let cai = { bankCode: '', accName: '', accNo: '', accOpenBank: '' }
              let cbi = {
                bankCode: '',
                bnfType: '',
                bnfRank: '',
                bnfStatus: '',
                bnfModifyDt: '',
                bnfReason: '',
                accName: '',
                accNo: '',
                accOpenBank: '',
                memo: '',
              }
              let csi = {
                supRank: '',
                officeStdDt: '',
                officeEndDt: '',
                supervisorInfo: '',
                officeEndType: '',
                officeStdType: '',
                oneYearOld: '',
              }
              let cii = {
                invRank: '',
              }
              let oth = {
                relRank: '',
                relType: '',
              }
              let r = {}
              let genRules = function (obj, name) {
                let xx = Object.keys(obj)
                for (let i = 0; i < xx.length; i++) {
                  r[name + '.' + xx[i]] = ruleReq
                  if (xx[i] == 'email') {
                    r[name + '.' + xx[i]] = ruleEmail
                  }
                  if (xx[i] == 'cphone') {
                    r[name + '.' + xx[i]] = rulePhone
                  }
                  if (xx[i] == 'fphone') {
                    r[name + '.' + xx[i]] = ruleFphone
                  }
                }
              }

              genRules(cri, 'cri')
              genRules(cai, 'cai')
              genRules(cppm, 'cppm')
              genRules(client, 'client')
              genRules(cpac, 'cpac')
              genRules(cpas, 'cpas')
              genRules(zcdr, 'zcdr')
              genRules(cbi, 'cbi')
              genRules(csi, 'csi')
              genRules(cii, 'cii')
              genRules(oth, 'oth')
              r['contactors[0].contName'] = ruleReq
              r['contactors[0].idnType'] = ruleReq
              r['contactors[0].idn'] = ruleReq
              r['contactors[0].idnDt'] = ruleReq
              r['contactors[0].fphone'] = [{ validator: this.validateConFhone, trigger: ['change', 'blur'] }]
              r['contactors[0].cphone'] = [{ validator: this.validateConChone, trigger: ['change', 'blur'] }]
              r['contactors[0].email'] = ruleEmail
              that.rules = r
            }

            if (res.result.guardians && res.result.guardians.length > 0) {
              res.result.guardians.forEach((item) => {
                item.address = item.contAddr.address
              })
            }
            res.result.files.forEach((file) => {
              file.uid = file.id
              file.name = file.fileName
              file.status = 'done'
              file.response = '{"status": "success"}'
              file.url = window._CONFIG['domianURL'] + '/sys/common/downloadStatic/' + file.filePath
            })
            that.form.files = res.result.files
            res.result.cri.principalIdnDt = [
              res.result.cri.principalIdnStdDt || '',
              res.result.cri.principalIdnEndDt || '',
            ]
            res.result.cri.ctrlerIdnDt = [res.result.cri.ctrlerIdnStdDt || '', res.result.cri.ctrlerIdnEndDt || '']
            that.form = Object.assign(that.form, res.result)
            that.cacheData = that.form.contactors.map((item) => ({ ...item }))
            that.guardianCacheData = that.form.guardians.map((item) => ({ ...item }))
          } else {
            that.$message.error(res.message)
          }
        })
        .finally(() => {
          that.confirmLoading = false
        })
    },
    add(relType) {
      this.queryPrjInfo()
      this.optType = 'add'
      this.relType = relType
      this.form = JSON.parse(this.formStr)
      /*  if (relType !== 'OTH') {
        this.form.cppm.relTypeCode = relType
      }*/
      this.form.cppm.relTypeCode = this.relType
      this.form.cri.naturalYn = relType === 'TRUSTEE' ? 'N' : 'Y'
      this.tabChange(this.form.cri.naturalYn)
      this.editingId = ''
      this.subPerson = ''
      this.visible = true
    },
    view(relType, record) {
      //清掉监护人和联系人的缓存
      //this.form.contactors = []
      this.form.contactors = [
        {
          contName: '',
          idnType: '',
          idn: '',
          idnDt: [],
          fphone: '',
          cphone: '',
          email: '',
          contAddr: {
            addrProvCode: '',
            addrCityCode: '',
            addrCountyCode: '',
          },
        },
      ]
      this.form.guardians = []
      let that = this
      this.optType = 'view'
      let myFun = function () {
        if (Object.keys(that.dictOptionsData).length > 0) {
          that.initPage(relType, record)
          clearInterval(itv)
        }
      }
      let itv = setInterval(myFun, 100)
    },
    edit(relType, record) {
      this.optType = 'edit'
      //清掉监护人和联系人的缓存
      this.form.cppm.cusRelativeType = '' //清掉与委托人关系缓存
      // this.form.contactors = []
      this.form.contactors = [
        {
          contName: '',
          idnType: '',
          idn: '',
          idnDt: [],
          fphone: '',
          cphone: '',
          email: '',
          contAddr: {
            addrProvCode: '',
            addrCityCode: '',
            addrCountyCode: '',
          },
        },
      ]
      this.form.guardians = []
      this.subPerson = ''
      this.initPage(relType, record)
    },
    close() {
      if (this.optType === 'edit') {
        this.form.cppm.cusRelativeType = ''
      }
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      const that = this
      this.$refs.form.validate((valid) => {
        if (valid) {
          that.confirmLoading = true
          that.form.cri.idnStdDt = that.form.cri.idnDt[0]
          that.form.cri.idnEndDt = that.form.cri.idnDt[1]
          if (that.form.cri.principalIdnDt.length > 1) {
            that.form.cri.principalIdnStdDt = that.form.cri.principalIdnDt[0]
            that.form.cri.principalIdnEndDt = that.form.cri.principalIdnDt[1]
          }
          if (that.form.cri.ctrlerIdnDt.length > 1) {
            that.form.cri.ctrlerIdnStdDt = that.form.cri.ctrlerIdnDt[0]
            that.form.cri.ctrlerIdnEndDt = that.form.cri.ctrlerIdnDt[1]
          }
          if (that.form.cri.naturalYn === 'N') {
            that.form.contactors[0].idnStdDt = that.form.contactors[0].idnDt[0]
            that.form.contactors[0].idnEndDt = that.form.contactors[0].idnDt[1]
          }
          let flag = false
          //受益人的监护人和受益人不能是同一个人，需要加校验，前端给出提示信息
          that.form.guardians.forEach((item) => {
            if (item.idnType == that.form.cri.idnType) {
              if (item.idn.replace(/\s*/g, '') == that.form.cri.idn.replace(/\s*/g, '')) {
                flag = true
              }
            }
          })
          if (flag) {
            that.$message.warning('受益人的监护人和受益人不能是同一个人')
            that.confirmLoading = false
            return
          }
          /*     if (this.form.cri.naturalYn == 'N' && this.form.cbi.bnfType == '1') {
            if (
              that.form.cpac.address == null ||
              that.form.cpac.address === '' ||
              that.form.cpac.address === undefined
            ) {
              that.$message.warning('请输入注册地址')
              that.confirmLoading = false
              return
            }
          }*/

          if (this.form.cri.naturalYn == 'Y' && this.form.cbi.bnfType == '1' && this.relType == 'CLIENT') {
            if (
              that.form.cpas.address == null ||
              that.form.cpas.address === '' ||
              that.form.cpas.address === undefined
            ) {
              that.$message.warning('请输入联系地址')
              that.confirmLoading = false
              return
            }
          }
          let c = ''
          that.form.contactors.forEach((item) => {
            //受益人机构和自然人手机号和固定电话对应字段是反的（其他关系人也存在）
            if (this.relType == 'BENEFICIARY' && this.form.cri.naturalYn == 'Y') {
              //手机号码、固定电话、邮箱添加校验
              if (item.fphone != null && item.fphone != '' && item.fphone != undefined) {
                if (!new RegExp(/^1[3|4|5|7|8|9][0-9]\d{8}$/).test(item.fphone)) {
                  c = 'fphone'
                  return
                }
              }
              if (item.cphone != null && item.cphone != '' && item.cphone != undefined) {
                if (!new RegExp(/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/).test(item.cphone)) {
                  c = 'cphone'
                  return
                }
              }
              if (item.email != null && item.email != '' && item.email != undefined) {
                if (
                  !new RegExp(
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                  ).test(item.email)
                ) {
                  c = 'email'
                  return
                }
              }
            }
            if (this.relType == 'BENEFICIARY' && this.form.cri.naturalYn == 'N') {
              //手机号码、固定电话、邮箱添加校验
              if (item.cphone != null && item.cphone != '' && item.cphone != undefined) {
                if (!new RegExp(/^1[3|4|5|7|8|9][0-9]\d{8}$/).test(item.cphone)) {
                  c = 'cphone'
                  return
                }
              }
              if (item.fphone != null && item.fphone != '' && item.fphone != undefined) {
                if (!new RegExp(/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/).test(item.fphone)) {
                  c = 'fphone'
                  return
                }
              }
              if (item.email != null && item.email != '' && item.email != undefined) {
                if (
                  !new RegExp(
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                  ).test(item.email)
                ) {
                  c = 'email'
                  return
                }
              }
            }
            item.contAddr.address = item.address
          })
          if (c !== '') {
            if (this.relType == 'BENEFICIARY' && this.form.cri.naturalYn == 'Y') {
              if (c == 'fphone') {
                this.$message.error('请输入正确格式的联系人手机号码!')
              }
              if (c == 'cphone') {
                this.$message.error('请输入正确格式的联系人固定电话!')
              }
              if (c == 'email') {
                this.$message.error('请输入正确格式的联系人邮箱!')
              }
              that.confirmLoading = false
              return
            }
            if (this.relType == 'BENEFICIARY' && this.form.cri.naturalYn == 'N') {
              if (c == 'cphone') {
                this.$message.error('请输入正确格式的联系人手机号码!')
              }
              if (c == 'fphone') {
                this.$message.error('请输入正确格式的联系人固定电话!')
              }
              if (c == 'email') {
                this.$message.error('请输入正确格式的联系人邮箱!')
              }
              that.confirmLoading = false
              return
            }
          }

          let f = ''
          that.form.guardians.forEach((item) => {
            if (this.relType == 'BENEFICIARY' && this.form.cri.naturalYn == 'Y') {
              //手机号码、固定电话、邮箱添加校验
              if (item.fphone != null && item.fphone != '' && item.fphone != undefined) {
                if (!new RegExp(/^1[3|4|5|7|8|9][0-9]\d{8}$/).test(item.fphone)) {
                  f = 'fphone'
                  return
                }
              }
              if (item.cphone != null && item.cphone != '' && item.cphone != undefined) {
                if (!new RegExp(/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/).test(item.cphone)) {
                  f = 'cphone'
                  return
                }
              }
              if (item.email != null && item.email != '' && item.email != undefined) {
                if (
                  !new RegExp(
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                  ).test(item.email)
                ) {
                  f = 'email'
                  return
                }
              }
            }
            if (this.relType == 'BENEFICIARY' && this.form.cri.naturalYn == 'N') {
              //手机号码、固定电话、邮箱添加校验
              if (item.cphone != null && item.cphone != '' && item.cphone != undefined) {
                if (!new RegExp(/^1[3|4|5|7|8|9][0-9]\d{8}$/).test(item.cphone)) {
                  f = 'cphone'
                  return
                }
              }
              if (item.fphone != null && item.fphone != '' && item.fphone != undefined) {
                if (!new RegExp(/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/).test(item.fphone)) {
                  f = 'fphone'
                  return
                }
              }
              if (item.email != null && item.email != '' && item.email != undefined) {
                if (
                  !new RegExp(
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                  ).test(item.email)
                ) {
                  f = 'email'
                  return
                }
              }
            }
            item.contAddr.address = item.address
          })

          if (f !== '') {
            if (this.relType == 'BENEFICIARY' && this.form.cri.naturalYn == 'Y') {
              if (f == 'fphone') {
                this.$message.error('请输入正确格式的监护人手机号码!')
              }
              if (f == 'cphone') {
                this.$message.error('请输入正确格式的监护人固定电话!')
              }
              if (f == 'email') {
                this.$message.error('请输入正确格式的监护人邮箱!')
              }
              that.confirmLoading = false
              return
            }
            if (this.relType == 'BENEFICIARY' && this.form.cri.naturalYn == 'N') {
              if (f == 'cphone') {
                this.$message.error('请输入正确格式的联系人手机号码!')
              }
              if (f == 'fphone') {
                this.$message.error('请输入正确格式的联系人固定电话!')
              }
              if (f == 'email') {
                this.$message.error('请输入正确格式的联系人邮箱!')
              }
              that.confirmLoading = false
              return
            }
          }
          if (this.optType == 'edit') {
            that.form.isflag = 'Y'
          }
          postAction(that.url.save, that.form).then((res) => {
            if (res.success) {
              //判读是否需要审批流
              let needWkf = res.result && res.result.processId

              //更新下级受益人信息
              if (this.selectionRows.length > 0) {
                this.selectionRows.forEach((b) => {
                  b.parentNode = res.message
                  this.devd += JSON.stringify(b) + '&'
                })
                let param = {}
                param.da = this.devd
                deleteActionByPostMethod(this.url.updateRealperson, param)
                  .then((re) => {
                    if (re.success) {
                      this.devd = ''
                    } else {
                      this.$message.warning(re.message)
                    }
                  })
                  .finally(() => {})
              }

              const filesNeed2Upload = that.form.files.filter((file) => file.id === undefined)
              if (filesNeed2Upload.length > 0) {
                const formData = new FormData()
                formData.append('module', 'RELPARTY_' + that.form.cppm.relTypeCode)
                formData.append('dataId', res.message)
                filesNeed2Upload.forEach((file) => {
                  formData.append('files', file)
                })
                httpActionWF(that.url.upload, formData)
                  .then((res) => {
                    if (res.success) {
                      that.$message.success('保存成功！')
                      if (!needWkf) {
                        that.$emit('ok')
                        this.close()
                      }
                    } else {
                      //  that.$message.error(res.message) 后端已处理异常
                    }
                  })
                  .catch(function (error) {
                    that.$message.error('文件上传失败，请稍后重新上传，注意文件大小不可超过10M')
                  })
                  .finally(() => {
                    that.confirmLoading = false
                  })
              } else {
                that.$message.success('保存成功！')
                that.confirmLoading = false
                if (!needWkf) {
                  that.$emit('ok')
                  this.close()
                }
              }

              if (needWkf) {
                that.$nextTick(() => {
                  that.$refs.wkfUserForm.edit(res.result.processId)
                  that.$refs.wkfUserForm.disableSubmit = false
                })
              }
            } else {
              // that.$message.error(res.message) 异常后端统一处理

              that.confirmLoading = false
            }
          })
        } else {
          that.$message.error('校验未通过')
          return false
        }
      })
    },
    handleCancel() {
      this.close()
    },
    handCpacAreaChange(areaStr) {
      if (areaStr) {
        let a = areaStr.split(',')
        this.form.cpac.addrProvCode = a[0]
        this.form.cpac.addrCityCode = a[1]
        this.form.cpac.addrCountyCode = a[2]
        this.form.cpac.address = a[3]
      }
    },
    handCpasAreaChange(areaStr) {
      if (areaStr) {
        let a = areaStr.split(',')
        this.form.cpas.addrProvCode = a[0]
        this.form.cpas.addrCityCode = a[1]
        this.form.cpas.addrCountyCode = a[2]
        this.form.cpas.address = a[3]
      }
    },
    handContactorAreaChange(areaStr) {
      if (areaStr) {
        let a = areaStr.split(',')
        this.form.contactors[0].contAddr.addrProvCode = a[0]
        this.form.contactors[0].contAddr.addrCityCode = a[1]
        this.form.contactors[0].contAddr.addrCountyCode = a[2]
      }
    },
    handAreaChange(areaStr) {
      if (areaStr) {
        let a = areaStr.split(',')
        console.dir(a)
        this.form.cbi.accBankProvCode = a[0]
        this.form.cbi.accBankCityCode = a[1]
      }
    },
    addContactor() {
      let id = new Date().getTime()
      this.form.contactors = [
        ...this.form.contactors,
        {
          id: id,
          contName: '',
          ptyRelativeType: '',
          contAddr: { addrProvCode: '', addrCityCode: '', addrCountyCode: '', address: '' },
          fphone: '',
          cphone: '',
          email: '',
          memo: '',
        },
      ]
      let that = this
      this.$nextTick(() => {
        that.contactorEdit(id)
        that.cacheData = that.form.contactors.map((item) => ({ ...item }))
      })
    },
    addGuardian() {
      let id = new Date().getTime()
      this.form.guardians = [
        ...this.form.guardians,
        {
          id: id,
          contName: '',
          ptyRelativeType: '',
          contAddr: { addrProvCode: '', addrCityCode: '', addrCountyCode: '', address: '' },
          idnType: '',
          idn: '',
          fphone: '',
          cphone: '',
          email: '',
          memo: '',
        },
      ]
      let that = this
      this.$nextTick(() => {
        that.guardianEdit(id)
        that.guardianCacheData = that.form.guardians.map((item) => ({ ...item }))
      })
    },
    handleGuardianChange(value, id, column, index) {
      const newData = [...this.form.guardians]
      const target = newData.filter((item) => id === item.id)[0]
      if (target) {
        target[column.c] = value
        this.form.guardians = newData
        if (column.c === 'ptyRelativeType') {
          if (target.ptyRelativeType === '0') {
            this.$set(this.form.guardians[index], 'contName', this.form.cri.partyName)
            this.form.guardians[index].address = this.form.cpac.address
            this.form.guardians[index].idn = this.form.cri.idn
            this.form.guardians[index].idnType = this.form.cri.idnType
            this.form.guardians[index].fphone = this.form.cri.cphone
            this.form.guardians[index].cphone = this.form.cri.fphone
            this.form.guardians[index].email = this.form.cri.email
            this.form.guardians[index].memo = this.form.cri.memo
          } else {
            this.form.guardians[index].idn = ''
            this.form.guardians[index].idnType = ''
            this.form.guardians[index].contName = ''
            this.form.guardians[index].address = ''
            this.form.guardians[index].fphone = ''
            this.form.guardians[index].cphone = ''
            this.form.guardians[index].email = ''
            this.form.guardians[index].memo = ''
          }
        }
      }
    },
    handleContactorChange(value, id, column, index) {
      const newData = [...this.form.contactors]
      const target = newData.filter((item) => id === item.id)[0]
      if (target) {
        target[column.c] = value
        this.form.contactors = newData
        // 选择本人是自动带入信息
        if (column.c === 'ptyRelativeType') {
          if (target.ptyRelativeType === '0') {
            this.$set(this.form.contactors[index], 'contName', this.form.cri.partyName)
            this.form.contactors[index].address = this.form.cpac.address
            this.form.contactors[index].fphone = this.form.cri.cphone
            this.form.contactors[index].cphone = this.form.cri.fphone
            this.form.contactors[index].email = this.form.cri.email
            this.form.contactors[index].memo = this.form.cri.memo
          } else {
            this.form.contactors[index].contName = ''
            this.form.contactors[index].address = ''
            this.form.contactors[index].fphone = ''
            this.form.contactors[index].cphone = ''
            this.form.contactors[index].email = ''
            this.form.contactors[index].memo = ''
          }
        }
      }
    },
    guardianEdit(id) {
      const newData = [...this.form.guardians]
      const target = newData.filter((item) => id === item.id)[0]
      this.guardianEditingId = id
      if (target) {
        target.editable = true
        this.form.guardians = newData
      }
    },
    contactorEdit(id) {
      let newData = [...this.form.contactors]
      let target = newData.filter((item) => id === item.id)[0]
      this.editingId = id
      if (target) {
        target.editable = true
        this.form.contactors = newData
      }
    },
    guardianSave(id) {
      let newData = [...this.form.guardians]
      let newCacheData = [...this.guardianCacheData]
      let target = newData.filter((item) => id === item.id)[0]
      let targetCache = newCacheData.filter((item) => id === item.id)[0]

      if (target && targetCache) {
        delete target.editable
        this.form.guardians = newData
        Object.assign(targetCache, target)
        this.guardianCacheData = newCacheData
      }
      this.guardianEditingId = ''
    },
    contactorSave(id) {
      let newData = [...this.form.contactors]
      let newCacheData = [...this.cacheData]
      let target = newData.filter((item) => id === item.id)[0]
      let targetCache = newCacheData.filter((item) => id === item.id)[0]

      if (target && targetCache) {
        delete target.editable
        this.form.contactors = newData
        Object.assign(targetCache, target)
        this.cacheData = newCacheData
      }
      this.editingId = ''
    },
    guardianCancel(id) {
      const newData = [...this.form.guardians]
      const target = newData.filter((item) => id === item.id)[0]
      this.guardianEditingId = ''
      if (target) {
        Object.assign(target, this.guardianCacheData.filter((item) => id === item.id)[0])
        delete target.editable
        this.form.guardians = newData
      }
    },
    contactorCancel(id) {
      const newData = [...this.form.contactors]
      const target = newData.filter((item) => id === item.id)[0]
      this.editingId = ''
      if (target) {
        Object.assign(target, this.cacheData.filter((item) => id === item.id)[0])
        delete target.editable
        this.form.contactors = newData
      }
    },
    guardianDel(id) {
      const newData = [...this.form.guardians]
      this.form.guardians = newData.filter((item) => id !== item.id)
      this.guardianEditingId = ''
    },
    contactorDel(id) {
      const newData = [...this.form.contactors]
      this.form.contactors = newData.filter((item) => id !== item.id)
      this.editingId = ''
    },
    handleDDPartyChange() {},
    bnfChange(value) {
      let that = this
      if (value == '2') {
        that.rules = {}
      } else {
        let ruleReq = [{ required: true, message: '必输字段', trigger: ['change', 'blur'] }]
        let ruleEmail = [{ validator: this.validateEmail, trigger: ['change', 'blur'] }]
        let rulePhone = [{ validator: this.validatePhone, trigger: ['change', 'blur'] }]
        let ruleFphone = [{ validator: this.validateFphone, trigger: ['change', 'blur'] }]
        let cri = {
          partyName: '',
          sibYn: 'Y',
          father: '',
          mather: '',
          spouse: '',
          gender: '',
          // 所属地区邮政编码
          postalCode: '',
          // 居住地区邮政编码
          livePostalCode: '',
          birthDt: '',
          idnType: '',
          idn: '',
          idnDt: [],
          natCode: '',
          maritalCode: '',
          ocuCode: '',
          jobTitle: '',
          companyName: '',
          cphone: '',
          fphone: '',
          email: '',
          prjCode: this.$route.query.prjCode,
          orgType: '',
          jrxkzh: '',
          orgBusScope: '',
          principalNaturalYn: 'Y',
          principalName: '',
          principalIdnType: '',
          principalIdnNo: '',
          principalIdnDt: [],
          ctrlerNaturalYn: 'Y',
          ctrlerName: '',
          ctrlerIdnType: '',
          ctrlerIdnNo: '',
          ctrlerIdnDt: [],
          bnfinfoCompleteYn: '',
          fnancialSituation: '',
          physicaSituation: '',
          memo: '',
          creditCode: '',
        }
        let cpac = { addrProvCode: '', addrCityCode: '', addrCountyCode: '', address: '' }
        let cpas = { addrProvCode: '', addrCityCode: '', addrCountyCode: '', address: '' }
        let zcdr = { address: '' }
        let client = { riskCode: '', hostCusParty: '', rightSuspDt: '', memo: '', prjCode: this.$route.query.prjCode }
        let cppm = { prjCode: this.$route.query.prjCode, relTypeCode: '', cusRelativeType: '', cusRelativeName: '' }
        let cai = { bankCode: '', accName: '', accNo: '', accOpenBank: '' }
        let cbi = {
          bankCode: '',
          bnfType: '',
          bnfRank: '',
          bnfStatus: '',
          bnfModifyDt: '',
          bnfReason: '',
          accName: '',
          accNo: '',
          accOpenBank: '',
          memo: '',
        }
        let csi = {
          supRank: '',
          officeStdDt: '',
          officeEndDt: '',
          supervisorInfo: '',
          officeEndType: '',
          officeStdType: '',
          oneYearOld: '',
        }
        let cii = {
          invRank: '',
        }
        let oth = {
          relRank: '',
          relType: '',
        }
        let r = {}
        let genRules = function (obj, name) {
          let xx = Object.keys(obj)
          for (let i = 0; i < xx.length; i++) {
            r[name + '.' + xx[i]] = ruleReq
            if (xx[i] == 'email') {
              r[name + '.' + xx[i]] = ruleEmail
            }
            if (xx[i] == 'cphone') {
              r[name + '.' + xx[i]] = rulePhone
            }
            if (xx[i] == 'fphone') {
              r[name + '.' + xx[i]] = ruleFphone
            }
          }
        }

        genRules(cri, 'cri')
        genRules(cai, 'cai')
        genRules(cppm, 'cppm')
        genRules(client, 'client')
        genRules(cpac, 'cpac')
        genRules(cpas, 'cpas')
        genRules(zcdr, 'zcdr')
        genRules(cbi, 'cbi')
        genRules(csi, 'csi')
        genRules(cii, 'cii')
        genRules(oth, 'oth')
        r['contactors[0].contName'] = ruleReq
        r['contactors[0].idnType'] = ruleReq
        r['contactors[0].idn'] = ruleReq
        r['contactors[0].idnDt'] = ruleReq
        r['contactors[0].fphone'] = [{ validator: this.validateConFhone, trigger: ['change', 'blur'] }]
        r['contactors[0].cphone'] = [{ validator: this.validateConPhone, trigger: ['change', 'blur'] }]
        r['contactors[0].email'] = ruleEmail
        that.rules = r
      }
    },
    tabChange(key) {
      let ruleReq = [{ required: true, message: '必输字段', trigger: ['change', 'blur'] }]
      let ruleEmail = [{ validator: this.validateEmail, trigger: ['change', 'blur'] }]
      let rulePhone = [{ validator: this.validatePhone, trigger: ['change', 'blur'] }]
      let ruleFphone = [{ validator: this.validateFphone, trigger: ['change', 'blur'] }]
      let cri = {
        partyName: '',
        sibYn: 'Y',
        father: '',
        mather: '',
        spouse: '',
        gender: '',
        // 所属地区邮政编码
        postalCode: '',
        // 居住地区邮政编码
        livePostalCode: '',
        birthDt: '',
        idnType: '',
        idn: '',
        idnDt: [],
        natCode: '',
        maritalCode: '',
        ocuCode: '',
        jobTitle: '',
        companyName: '',
        cphone: '',
        fphone: '',
        email: '',
        prjCode: this.$route.query.prjCode,
        orgType: '',
        jrxkzh: '',
        orgBusScope: '',
        principalNaturalYn: 'Y',
        principalName: '',
        principalIdnType: '',
        principalIdnNo: '',
        principalIdnDt: [],
        ctrlerNaturalYn: 'Y',
        ctrlerName: '',
        ctrlerIdnType: '',
        ctrlerIdnNo: '',
        ctrlerIdnDt: [],
        bnfinfoCompleteYn: '',
        fnancialSituation: '',
        physicaSituation: '',
        creditCode: '',
      }
      let cpac = { addrProvCode: '', addrCityCode: '', addrCountyCode: '', address: '' }
      let cpas = { addrProvCode: '', addrCityCode: '', addrCountyCode: '', address: '' }
      let zcdr = { address: '' }
      let client = { riskCode: '', hostCusParty: '', rightSuspDt: '', memo: '', prjCode: this.$route.query.prjCode }
      let cppm = { prjCode: this.$route.query.prjCode, relTypeCode: '', cusRelativeType: '', cusRelativeName: '' }
      let cai = { bankCode: '', accName: '', accNo: '', accOpenBank: '' }
      let cbi = {
        bankCode: '',
        bnfType: '',
        bnfRank: '',
        bnfStatus: '',
        bnfModifyDt: '',
        bnfReason: '',
        accName: '',
        accNo: '',
        accOpenBank: '',
        memo: '',
      }
      let csi = {
        supRank: '',
        officeStdDt: '',
        officeEndDt: '',
        supervisorInfo: '',
        officeEndType: '',
        officeStdType: '',
        oneYearOld: '',
      }
      let cii = {
        invRank: '',
      }
      let oth = {
        relRank: '',
        relType: '',
      }
      let r = {}
      let genRules = function (obj, name) {
        let xx = Object.keys(obj)
        for (let i = 0; i < xx.length; i++) {
          r[name + '.' + xx[i]] = ruleReq
          if (xx[i] == 'email') {
            r[name + '.' + xx[i]] = ruleEmail
          }
          if (xx[i] == 'cphone') {
            r[name + '.' + xx[i]] = rulePhone
          }
          if (xx[i] == 'fphone') {
            r[name + '.' + xx[i]] = ruleFphone
          }
        }
      }

      genRules(cri, 'cri')
      genRules(cai, 'cai')
      genRules(cppm, 'cppm')
      genRules(client, 'client')
      genRules(cpac, 'cpac')
      genRules(cpas, 'cpas')
      genRules(zcdr, 'zcdr')
      genRules(cbi, 'cbi')
      genRules(csi, 'csi')
      genRules(cii, 'cii')
      genRules(oth, 'oth')
      r['contactors[0].contName'] = ruleReq
      r['contactors[0].idnType'] = ruleReq
      r['contactors[0].idn'] = ruleReq
      r['contactors[0].idnDt'] = ruleReq
      r['contactors[0].fphone'] = [{ validator: this.validateConFhone, trigger: ['change', 'blur'] }]
      r['contactors[0].cphone'] = [{ validator: this.validateConChone, trigger: ['change', 'blur'] }]
      r['contactors[0].email'] = ruleEmail
      this.rules = r
      this.form = JSON.parse(this.formStr)
      /*  if (this.relType !== 'OTH') {
        this.form.cppm.relTypeCode = this.relType
      }*/
      this.form.cppm.relTypeCode = this.relType
      this.editingId = ''

      if ('Y' === key) {
        this.form.contactors = []
      } else {
        this.form.contactors = [
          {
            contName: '',
            idnType: '',
            idn: '',
            idnDt: [],
            fphone: '',
            cphone: '',
            email: '',
            contAddr: {
              addrProvCode: '',
              addrCityCode: '',
              addrCountyCode: '',
            },
          },
        ]
      }
      this.form.cri.naturalYn = key
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    beforeUpload(file) {
      this.form.files = [...this.form.files, file]
      return false
    },
    handleRemove(file) {
      if (this.optType !== 'view') {
        const index = this.form.files.indexOf(file)
        const newFileList = this.form.files.slice()
        newFileList.splice(index, 1)
        this.form.files = newFileList
        handleRemove(this, file)
      } else {
        return false
      }
    },
    calendarChange(val) {
      this.currentDate = val
    },
  },
}
</script>

<style lang="less" scoped>
.editable-row-operations a {
  margin-right: 8px;
}

.bankAdress {
  width: 1180px;
}
</style>