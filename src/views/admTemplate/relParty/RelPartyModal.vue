<template>
  <a-modal
    :title="title"
    width="100%"
    style="top: 0px;padding-bottom: 0;"
    :destroyOnClose="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel">
    <template slot="footer">
      <a-row :gutter="24" style="margin:0;padding:0">
        <a-col :span="23" style="text-align: center;">
          <a-button v-if="optType !== 'view'" type="primary" @click="handleOk">提交</a-button>
          <a-button @click="handleCancel">关闭</a-button>
        </a-col>
      </a-row>
    </template>
    <a-spin :spinning="confirmLoading" :style="formStyle">
      <a-form-model :model="form" :rules="rules" ref="form" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }" style="margin-right: 10px">
        <a-tabs :activeKey="form.cri.naturalYn" size="small" @change="tabChange" v-if="relType !== 'TRUSTEE' && relType !== 'COOWNER'">
          <a-tab-pane tab="自然人" key="Y" v-if="optType==='add' || (optType!=='add'&&form.cri.naturalYn==='Y')">
          </a-tab-pane>
          <a-tab-pane tab="机构" key="N" v-if="optType==='add' || (optType!=='add'&&form.cri.naturalYn==='N')">
          </a-tab-pane>
        </a-tabs>

        <a-card size="small" title="基本信息">
          <span slot="extra">
            选择尽调关系人：<a-select defaultValue="lucy" style="width: 120px" @change="handleDDPartyChange"></a-select>
          </span>
          <a-row v-if="relType === 'BENEFICIARY'" :gutter="24">
            <a-col :span="8">
              <a-form-model-item label="受益人类型" prop="cbi.bnfType">
                <j-d-select-tag v-if="optType !== 'view'" dict-code="BNF_TYPE" v-model="form.cbi.bnfType" placeholder="请选择受益人类型"></j-d-select-tag>
                <span v-else>{{ fdText('BNF_TYPE', form.cbi.idnType) }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="受益顺位" prop="cbi.bnfRank">
                <j-d-select-tag v-if="optType !== 'view'" dict-code="BNF_RANK" v-model="form.cbi.bnfRank" placeholder="请选择受益顺位"></j-d-select-tag>
                <span v-else>{{ fdText('BNF_RANK', form.cbi.bnfRank) }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="与委托人关系" prop="cppm.cusRelativeType">
                <j-d-select-tag v-if="optType !== 'view'" dict-code="PTY_RELATIVE_TYPE" v-model="form.cppm.cusRelativeType" placeholder="请选择与委托人关系"></j-d-select-tag>
                <span v-else>{{ fdText('PTY_RELATIVE_TYPE', form.cppm.cusRelativeType) }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="下级受益人">
                <a-input v-if="optType !== 'view'"></a-input>
                <span v-else>--</span>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row v-if="relType === 'SUPERVISER'" :gutter="24">
            <a-col :span="8">
              <a-form-model-item label="监察顺位" prop="csi.supRank">
                <j-d-select-tag v-if="optType !== 'view'" dict-code="BNF_RANK" v-model="form.csi.supRank" placeholder="请选择监察顺位"></j-d-select-tag>
                <span v-else>{{ fdText('BNF_RANK', form.csi.supRank) }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="与委托人关系" prop="cppm.cusRelativeType">
                <j-d-select-tag v-if="optType !== 'view'" dict-code="PTY_RELATIVE_TYPE" v-model="form.cppm.cusRelativeType" placeholder="请选择与委托人关系"></j-d-select-tag>
                <span v-else>{{ fdText('PTY_RELATIVE_TYPE', form.cppm.cusRelativeType) }}</span>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row v-if="relType === 'SUPERVISER'" :gutter="24">
            <a-col :span="8">
              <a-form-model-item label="任职开始" prop="csi.officeStdType">
                <a-col :span="form.csi.officeStdType === 'O'?12:24">
                  <j-d-select-tag v-if="optType !== 'view'" dict-code="CUSSUP_OFFICE_STD_TYPE" v-model="form.csi.officeStdType"></j-d-select-tag>
                  <span v-else>{{ fdText('CUSSUP_OFFICE_STD_TYPE', form.csi.officeStdType) }}</span>
                </a-col>
                <a-col v-if="form.csi.officeStdType === 'O'" :span="12">
                  <j-date v-if="optType !== 'view'" v-model="form.csi.officeStdDt"></j-date>
                  <span v-if="optType === 'view'">{{ fdText('CUSSUP_OFFICE_STD_TYPE', form.csi.officeStdType) }}</span>
                </a-col>
              </a-form-model-item>
            </a-col>
           
            <a-col :span="8">
              <a-form-model-item label="任职结束" prop="csi.officeStdType">
                <a-col :span="form.csi.officeEndType === 'O'?12:24">
                  <j-d-select-tag v-if="optType !== 'view'" dict-code="CUSSUP_OFFICE_END_TYPE" v-model="form.csi.officeEndType"></j-d-select-tag>
                  <span v-else>{{ fdText('CUSSUP_OFFICE_END_TYPE', form.csi.officeEndType) }}</span>
                </a-col>
                <a-col v-if="form.csi.officeEndType === 'O'" :span="12">
                  <j-date v-if="optType !== 'view'" v-model="form.csi.officeEndDt"></j-date>
                  <span v-else>{{ fdText('CUSSUP_OFFICE_END_TYPE', form.csi.officeStdType) }}</span>
                </a-col>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-model-item :label="form.cri.naturalYn === 'Y'?'姓名':'名称'" prop="cri.partyName">
                <a-input v-if="optType !== 'view'" :placeholder="'请输入'+(form.cri.naturalYn === 'Y'?'姓名':'名称')" v-model="form.cri.partyName"></a-input>
                <span v-else>{{ form.cri.partyName }}</span>
              </a-form-model-item>
            </a-col>
            <a-col v-if="relType !== 'COOWNER'" :span="8">
              <a-form-model-item v-if="form.cri.naturalYn === 'Y'" label="性别" prop="cri.gender">
                <j-d-select-tag v-if="optType !== 'view'" dict-code="sex" v-model="form.cri.gender" placeholder="请选择性别"></j-d-select-tag>
                <span v-else>{{ fdText('sex', form.cri.gender) }}</span>
              </a-form-model-item>
              <a-form-model-item v-else label="机构类型" prop="cri.orgType">
                <j-d-select-tag v-if="optType !== 'view'" dict-code="ORG_TYPE" v-model="form.cri.orgType" placeholder="请选择机构类型"></j-d-select-tag>
                <span v-else>{{ fdText('ORG_TYPE', form.cri.orgType) }}</span>
              </a-form-model-item>
            </a-col>
            <a-col v-if="relType !== 'COOWNER'" :span="8">
              <a-form-model-item v-if="form.cri.naturalYn === 'Y' && relType !== 'SUPERVISER'" label="出生日期" prop="cri.birthDt">
                <j-date v-if="optType !== 'view'" placeholder="请选择出生日期" v-model="form.cri.birthDt" style="width: 100%;"></j-date>
                <span v-else>{{ form.cri.birthDt }}</span>
              </a-form-model-item>
              <a-form-model-item v-if="form.cri.naturalYn === 'N'" label="金融机构许可证">
                <a-input v-if="optType !== 'view'" placeholder="请输入金融机构许可证" v-model="form.cri.jrxkzh"></a-input>
                <span v-else>{{ form.cri.jrxkzh }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="证件类型" prop="cri.idnType">
                <j-d-select-tag v-if="optType !== 'view'" :dict-code="form.cri.naturalYn === 'Y'?'IDNTYPES':'ORGIDNTYPES'" v-model="form.cri.idnType" placeholder="请选择证件类型"></j-d-select-tag>
                <span v-else>{{ fdText(form.cri.naturalYn === 'Y'?'IDNTYPES':'ORGIDNTYPES', form.cri.idnType) }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="证件号码" prop="cri.idn">
                <a-input v-if="optType !== 'view'" placeholder="请输入证件号码" v-model="form.cri.idn"></a-input>
                <span v-else>{{ form.cri.idn }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="有效期" prop="cri.idnDt">
                <j-date-range v-if="optType !== 'view'" v-model="form.cri.idnDt" @calendarChange="calendarChange" :currentDate="currentDate"></j-date-range>
                <span v-else>{{ form.cri.idnDt[0]+" ~ "+form.cri.idnDt[1] }}</span>
              </a-form-model-item>
            </a-col>
            <a-col v-if="form.cri.naturalYn === 'Y' && relType==='CLIENT'" :span="8">
              <a-form-model-item label="风险等级" prop="client.riskCode">
                <j-d-select-tag v-if="optType !== 'view'" v-model="form.client.riskCode" dict-code="RISK_CODE"></j-d-select-tag>
                <span v-else>{{ fdText('RISK_CODE', form.client.riskCode) }}</span>
              </a-form-model-item>
            </a-col>
            <a-col v-if="form.cri.naturalYn === 'Y' && relType !== 'COOWNER'" :span="8">
              <a-form-model-item label="国籍" prop="cri.natCode">
                <j-d-select-tag v-if="optType !== 'view'" v-model="form.cri.natCode" dict-code="NAT_CODE"></j-d-select-tag>
                <span v-else>{{ fdText('NAT_CODE', form.cri.natCode) }}</span>
              </a-form-model-item>
            </a-col>
            <a-col v-if="form.cri.naturalYn === 'Y' && relType !== 'SUPERVISER' && relType !== 'COOWNER'" :span="8">
              <a-form-model-item label="婚姻状况">
                <j-d-select-tag v-if="optType !== 'view'" v-model="form.cri.maritalCode" dict-code="MARITAL_CODE"></j-d-select-tag>
                <span v-else>{{ fdText('MARITAL_CODE', form.cri.maritalCode) }}</span>
              </a-form-model-item>
            </a-col>
            <a-col v-if="relType==='CLIENT'" :span="8">
              <a-form-model-item label="核心委托人" prop="client.hostCusParty">
                <j-d-select-tag v-if="optType !== 'view'" v-model="form.client.hostCusParty" dict-code="y_n"></j-d-select-tag>
                <span v-else>{{ fdText('y_n', form.client.hostCusParty) }}</span>
              </a-form-model-item>
            </a-col>
            <a-col v-if="relType==='CLIENT'" :span="8">
              <a-form-model-item label="终止权利日">
                <j-date v-if="optType !== 'view'" placeholder="为实际终止权利日" v-model="form.client.rightSuspDt"></j-date>
                <span v-else>{{ form.client.rightSuspDt }}</span>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row v-if="relType==='BENEFICIARY' && form.cri.naturalYn ==='Y' " :gutter="24">
            <a-col :span="8">
              <a-form-model-item label="财务状况">
                <j-d-select-tag v-if="optType !== 'view'" v-model="form.cri.fnancialSituation" dict-code="FNANCIAL_SITUATION"></j-d-select-tag>
                <span v-else>{{ fdText('FNANCIAL_SITUATION', form.cri.fnancialSituation) }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="健康状况">
                <j-d-select-tag v-if="optType !== 'view'" v-model="form.cri.physicaSituation" dict-code="PHYSICA_SITUATION"></j-d-select-tag>
                <span v-else>{{ fdText('PHYSICA_SITUATION', form.cri.physicaSituation) }}</span>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row v-if="relType !== 'COOWNER'" :gutter="24">
            <a-col v-if="form.cri.naturalYn === 'Y' && relType !== 'BENEFICIARY' && relType !== 'SUPERVISER'" :span="8">
              <a-form-model-item label="职业">
                <j-d-select-tag v-if="optType !== 'view'" v-model="form.cri.ocuCode" dict-code="OCU_CODE"></j-d-select-tag>
                <span v-else>{{ fdText('OCU_CODE', form.cri.ocuCode) }}</span>
              </a-form-model-item>
            </a-col>
            <a-col v-if="form.cri.naturalYn === 'Y' && relType !== 'BENEFICIARY' && relType !== 'SUPERVISER' " :span="8">
              <a-form-model-item label="职级">
                <j-d-select-tag v-if="optType !== 'view'" v-model="form.cri.jobTitle" dict-code="JOB_TITLE"></j-d-select-tag>
                <span v-else>{{ fdText('JOB_TITLE', form.cri.jobTitle) }}</span>
              </a-form-model-item>
            </a-col>
            <a-col v-if="form.cri.naturalYn === 'Y' && relType === 'CLIENT'" :span="8">
              <a-form-model-item label="工作单位">
                <a-input v-if="optType !== 'view'" placeholder="请输入工作单位" v-model="form.cri.companyName"></a-input>
                <span v-else>{{ form.cri.companyName }}</span>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col v-if="form.cri.naturalYn === 'Y'" :span="8">
              <a-form-model-item label="手机号码">
                <a-input v-if="optType !== 'view'" placeholder="请输入手机号码" v-model="form.cri.cphone"></a-input>
                <span v-else>{{ form.cri.cphone }}</span>
              </a-form-model-item>
            </a-col>
            <a-col v-if="form.cri.naturalYn === 'Y'" :span="8">
              <a-form-model-item label="固定电话">
                <a-input v-if="optType !== 'view'" placeholder="请输入固定电话" v-model="form.cri.fphone"></a-input>
                <span v-else>{{ form.cri.fphone }}</span>
              </a-form-model-item>
            </a-col>
            <a-col v-if="form.cri.naturalYn === 'Y'" :span="8">
              <a-form-model-item label="电子邮箱">
                <a-input v-if="optType !== 'view'" placeholder="请输入电子邮箱" v-model="form.cri.email"></a-input>
                <span v-else>{{ form.cri.email }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item :label="form.cri.naturalYn === 'Y'?'联系地址':'所属区域'" prop="cpac.addrProvCode" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                <bi-area :showType="optType !== 'view'?'select':'text'" :models="[form.cpac.addrProvCode, form.cpac.addrCityCode, form.cpac.addrCountyCode]" @change="handCpacAreaChange" :show-lv="3"></bi-area>
              </a-form-model-item>
            </a-col>
            <a-col v-if="form.cri.naturalYn === 'Y' && relType === 'CLIENT'" :span="24">
              <a-form-model-item label="寄送地址" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                <bi-area :showType="optType !== 'view'?'select':'text'" :models="[form.cpas.addrProvCode, form.cpas.addrCityCode, form.cpas.addrCountyCode]" @change="handCpasAreaChange" :show-lv="3"></bi-area>
              </a-form-model-item>
            </a-col>
            <a-col v-if="form.cri.naturalYn === 'N'" :span="24">
              <a-form-model-item label="注册地址" prop="cpac.address" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                <a-input v-if="optType !== 'view'" placeholder="请输入注册地址" v-model="form.cpac.address"></a-input>
                <span v-else>{{ form.cpac.address }}</span>
              </a-form-model-item>
            </a-col>
            <a-col v-if="relType === 'BENEFICIARY'" :span="24">
              <a-form-model-item label="受益人资料是否齐全" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                <j-d-select-tag v-if="optType !== 'view'" v-model="form.cri.bnfinfoCompleteYn" dict-code="y_n"></j-d-select-tag>
                <span v-else>{{ fdText('y_n', form.cri.bnfinfoCompleteYn) }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item v-if="form.cri.naturalYn === 'Y' && relType==='CLIENT'" label="委托人权利条款" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                <a-textarea v-if="optType !== 'view'" class="no-resize" placeholder="请输入委托人权利条款" v-model="form.client.principalRight" allowClear :rows="4"></a-textarea>
                <span v-else>{{ form.client.memo }}</span>
              </a-form-model-item>
              <a-form-model-item v-if="form.cri.naturalYn === 'Y' && relType !== 'SUPERVISER' && relType !== 'COOWNER'" label="备注" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                <a-textarea v-if="optType !== 'view'" class="no-resize" placeholder="请输入备注" v-model="form.client.memo" allowClear :rows="4"></a-textarea>
                <span v-else>{{ form.client.memo }}</span>
              </a-form-model-item>
              <a-form-model-item v-if="form.cri.naturalYn === 'N'" label="经营范围" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                <a-textarea v-if="optType !== 'view'" class="no-resize" placeholder="请输入经营范围" v-model="form.cri.orgBusScope" allowClear :rows="4"></a-textarea>
                <span v-else>{{ form.cri.orgBusScope }}</span>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-card>

        <a-card v-if="relType === 'BENEFICIARY' || relType === 'EXECUTOR'" size="small" title="信托利益分配账户" style="margin-top: 15px">
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-model-item label="户名" >
                <a-input v-if="optType !== 'view'" placeholder="请输入户名" v-model="form.cbi.accName"></a-input>
                <span v-else>{{ form.cbi.accName }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="账户" >
                <a-input v-if="optType !== 'view'" placeholder="请输入账户" v-model="form.cbi.accNo"></a-input>
                <span v-else>{{ form.cbi.accNo }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="开户行" >
                <a-input v-if="optType !== 'view'" placeholder="请输入账户" v-model="form.cbi.accOpenBank"></a-input>
                <span v-else>{{ form.cbi.accOpenBank }}</span>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-card>
        <a-card v-if="relType === 'TRUSTEE'" size="small" title="账户信息" style="margin-top: 15px">
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-model-item label="户名" >
                <a-input v-if="optType !== 'view'" placeholder="请输入户名" v-model="form.cai.accName"></a-input>
                <span v-else>{{ form.cai.accName }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="账户" >
                <a-input v-if="optType !== 'view'" placeholder="请输入账户" v-model="form.cai.accNo"></a-input>
                <span v-else>{{ form.cai.accNo }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="开户行" >
                <a-input v-if="optType !== 'view'" placeholder="请输入账户" v-model="form.cai.accOpenBank"></a-input>
                <span v-else>{{ form.cai.accOpenBank }}</span>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-card>

        <a-card v-if="relType === 'BENEFICIARY' && form.cri.naturalYn === 'Y'" size="small" title="监护人" style="margin-top: 15px">
          <span slot="extra">
            <a-button v-if="optType !== 'view'" :disabled="guardianEditingId !== ''" type="primary" @click="addGuardian">新增</a-button>
          </span>
          <a-table :columns="guardianColumns" :dataSource="form.guardians" rowKey="id" row bordered :scroll="{ x: 1600 }">
            <template v-for="col in [{c:'contName',t:['input']},{c:'ptyRelativeType',t:['dict','PTY_RELATIVE_TYPE']},{c:'idnType',t:['dict','IDNTYPES']},{c:'idn',t:['input']},{c:'contAddr.address',t:['input']},{c:'ctelNo',t:['input']},{c:'ftelNo',t:['input']},{c:'email',t:['input']},{c:'memo',t:['input']}]" :slot="col.c" slot-scope="text, record, index">
              <div :key="col.c">
                <a-input v-if="record.editable && col.t[0] === 'input'" style="margin: -5px 0"
                         :value="text" @change="e => handleGuardianChange(e.target.value, record.id, col)"></a-input>
                <j-d-select-tag v-else-if="record.editable && col.t[0] === 'dict'" :dict-code="col.t[1]" :value="text"
                                @change="e => handleGuardianChange(e, record.id, col)"></j-d-select-tag>
                <template v-else>{{ col.t[0] === 'input'?text:fdText(col.t[1], text) }}</template>
              </div>
            </template>
            <template v-if="optType !== 'view'" slot="guardianOpt" slot-scope="text, record, index">
              <div class="editable-row-operations">
                <span v-if="record.editable">
                  <a @click="() => guardianSave(record.id)">确定</a>
                  <a @click="() => guardianCancel(record.id)">取消</a>
                </span>
                <span v-else>
                  <a :disabled="guardianEditingId !== ''" @click="() => guardianEdit(record.id)">编辑</a>
                  <a-popconfirm title="确定删除吗?" @confirm="() => guardianDel(record.id)">
                    <a :disabled="guardianEditingId !== ''">删除</a>
                  </a-popconfirm>
                </span>
              </div>
            </template>
          </a-table>
        </a-card>

        <!--      法定代表人或负责人       -->
        <a-card v-if="form.cri.naturalYn === 'N'" size="small" title="法定代表人或负责人" style="margin-top: 15px">
          <a-form-item label="类型" slot="extra" style="width: 200px;margin: 0;padding: 0;">
            <j-d-select-tag v-if="optType !== 'view'" dict-code="NATURAL_YN" v-model="form.cri.principalNaturalYn"></j-d-select-tag>
            <span v-else>{{ fdText('NATURAL_YN', form.cri.principalNaturalYn) }}</span>
          </a-form-item>
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-model-item label="姓名/名称">
                <a-input v-if="optType !== 'view'" placeholder="请输入姓名/名称" v-model="form.cri.principalName"></a-input>
                <span v-else>{{ form.cri.principalName }}</span>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-model-item label="证件类型">
                <j-d-select-tag v-if="optType !== 'view'" :dict-code="form.cri.principalNaturalYn === 'Y'?'IDNTYPES':'ORGIDNTYPES'" v-model="form.cri.principalIdnType" placeholder="请选择证件类型"></j-d-select-tag>
                <span v-else>{{ fdText(form.cri.principalNaturalYn === 'Y'?'IDNTYPES':'ORGIDNTYPES', form.cri.principalIdnType) }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="证件号码">
                <a-input v-if="optType !== 'view'" placeholder="请输入证件号码" v-model="form.cri.principalIdnNo"></a-input>
                <span v-else>{{ form.cri.principalIdnNo }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="有效期">
                <j-date-range v-if="optType !== 'view'" v-model="form.cri.principalIdnDt" @calendarChange="calendarChange" :currentDate="currentDate"></j-date-range>
                <span v-else>{{ form.cri.principalIdnDt[0]+" ~ "+form.cri.principalIdnDt[1] }}</span>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-card>
        <a-card v-if="form.cri.naturalYn === 'N'" size="small" title="控股股东或实际控制人" style="margin-top: 15px">
          <a-form-item label="类型" slot="extra" style="width: 200px;margin: 0;padding: 0;">
            <j-d-select-tag v-if="optType !== 'view'" dict-code="NATURAL_YN" v-model="form.cri.ctrlerNaturalYn"></j-d-select-tag>
            <span v-else>{{ fdText('NATURAL_YN', form.cri.ctrlerNaturalYn) }}</span>
          </a-form-item>
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-model-item label="姓名/名称">
                <a-input v-if="optType !== 'view'" placeholder="请输入姓名/名称" v-model="form.cri.ctrlerName"></a-input>
                <span v-else>{{ form.cri.ctrlerName }}</span>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-model-item label="证件类型">
                <j-d-select-tag v-if="optType !== 'view'" :dict-code="form.cri.ctrlerNaturalYn === 'Y'?'IDNTYPES':'ORGIDNTYPES'" v-model="form.cri.ctrlerIdnType" placeholder="请选择证件类型"></j-d-select-tag>
                <span v-else>{{ fdText(form.cri.ctrlerNaturalYn === 'Y'?'IDNTYPES':'ORGIDNTYPES', form.cri.ctrlerIdnType) }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="证件号码">
                <a-input v-if="optType !== 'view'" placeholder="请输入证件号码" v-model="form.cri.ctrlerIdnNo"></a-input>
                <span v-else>{{ form.cri.ctrlerIdnNo }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="有效期">
                <j-date-range v-if="optType !== 'view'" v-model="form.cri.ctrlerIdnDt" @calendarChange="calendarChange" :currentDate="currentDate"></j-date-range>
                <span v-else>{{ form.cri.ctrlerIdnDt[0]+" ~ "+form.cri.ctrlerIdnDt[1] }}</span>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-card>

        <a-card v-if="form.cri.naturalYn === 'N'" size="small" title="联系人（授权经办人）" style="margin-top: 15px">
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-model-item prop="contactors[0].contName" label="姓名/名称">
                <a-input v-if="optType !== 'view'" placeholder="请输入姓名/名称" v-model="form.contactors[0].contName"></a-input>
                <span v-else>{{ form.contactors[0].contName }}</span>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-model-item prop="contactors[0].idnType" label="证件类型">
                <j-d-select-tag v-if="optType !== 'view'" dict-code="IDNTYPES" v-model="form.contactors[0].idnType" placeholder="请选择证件类型"></j-d-select-tag>
                <span v-else>{{ fdText('IDNTYPES', form.contactors[0].idnType) }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item prop="contactors[0].idn" label="证件号码">
                <a-input v-if="optType !== 'view'" placeholder="请输入证件号码" v-model="form.contactors[0].idn"></a-input>
                <span v-else>{{ form.contactors[0].idn }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item prop="contactors[0].idnDt" label="有效期">
                <j-date-range v-if="optType !== 'view'" v-model="form.contactors[0].idnDt" @calendarChange="calendarChange" :currentDate="currentDate"></j-date-range>
                <span v-else>{{ form.contactors[0].idnDt[0]+" ~ "+form.contactors[0].idnDt[1] }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="手机号码">
                <a-input v-if="optType !== 'view'" placeholder="请输入手机号码" v-model="form.contactors[0].ctelNo"></a-input>
                <span v-else>{{ form.contactors[0].ctelNo }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="固定电话">
                <a-input v-if="optType !== 'view'" placeholder="请输入固定电话" v-model="form.contactors[0].ftelNo"></a-input>
                <span v-else>{{ form.contactors[0].ftelNo }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="电子邮箱">
                <a-input v-if="optType !== 'view'" placeholder="请输入电子邮箱" v-model="form.contactors[0].email"></a-input>
                <span v-else>{{ form.contactors[0].email }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="联系地址" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                <bi-area :showType="optType !== 'view'?'select':'text'"
                         :models="[form.contactors[0].contAddr.addrProvCode, form.contactors[0].contAddr.addrCityCode, form.contactors[0].contAddr.addrCountyCode]"
                         @change="handContactorAreaChange" :show-lv="3"></bi-area>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-card>

        <a-card v-if="form.cri.naturalYn === 'Y' && relType==='SUPERVISER'" size="small" title="监察人（如有）信息" style="margin-top: 15px">
          <a-row :gutter="24">
            <a-col :span="24">
              <a-form-model-item label="监察人（如有）产生和解任机制" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                <a-textarea v-if="optType !== 'view'" class="no-resize" v-model="form.csi.supervisorInfo" allowClear :rows="4"></a-textarea>
                <span v-else>{{ form.csi.supervisorInfo }}</span>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-card>

        <a-card size="small" v-if="relType !== 'COOWNER'" title="附件" style="margin-top: 15px">
          <a-row :gutter="24">
            <a-col :span="24">
              <a-form-item label="文件上传">
                <a-upload :fileList="form.files" :multiple="true" :remove="handleRemove" :beforeUpload="beforeUpload">
                  <a-button v-if="optType !== 'view'"> <a-icon type="upload"></a-icon> 选择 </a-button>
                </a-upload>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>

        <a-card v-if="form.cri.naturalYn === 'Y' && relType !== 'EXECUTOR' && relType !=='COOWNER' " size="small" title="联系人" style="margin-top: 15px">
          <span slot="extra">
            <a-button v-if="optType !== 'view'" :disabled="editingId !== ''" type="primary" @click="addContactor">新增</a-button>
          </span>
          <a-table :columns="contactorColumns" :dataSource="form.contactors" rowKey="id" row bordered>
            <template v-for="col in [{c:'contName',t:['input']},{c:'ptyRelativeType',t:['dict','PTY_RELATIVE_TYPE']},{c:'contAddr.address',t:['input']},{c:'ctelNo',t:['input']},{c:'ftelNo',t:['input']},{c:'email',t:['input']},{c:'memo',t:['input']}]" :slot="col.c" slot-scope="text, record, index">
              <div :key="col.c">
                <a-input v-if="record.editable && col.t[0] === 'input'" style="margin: -5px 0"
                         :value="text" @change="e => handleContactorChange(e.target.value, record.id, col)"></a-input>
                <j-d-select-tag v-else-if="record.editable && col.t[0] === 'dict'" :dict-code="col.t[1]" :value="text"
                                @change="e => handleContactorChange(e, record.id, col)"></j-d-select-tag>
                <template v-else>{{ col.t[0] === 'input'?text:fdText(col.t[1], text) }}</template>
              </div>
            </template>
            <template v-if="optType !== 'view'" slot="contactorOpt" slot-scope="text, record, index">
              <div class="editable-row-operations">
                <span v-if="record.editable">
                  <a @click="() => contactorSave(record.id)">确定</a>
                  <a @click="() => contactorCancel(record.id)">取消</a>
                </span>
                <span v-else>
                  <a :disabled="editingId !== ''" @click="() => contactorEdit(record.id)">编辑</a>
                  <a-popconfirm title="确定删除吗?" @confirm="() => contactorDel(record.id)">
                    <a :disabled="editingId !== ''">删除</a>
                  </a-popconfirm>
                </span>
              </div>
            </template>
          </a-table>
        </a-card>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
  import JDSelectTag from '@comp/dict/JDSelectTag'
  import JDate from '@comp/jeecg/JDate'
  import JDateRange from '@comp/jeecg/JDateRange'
  import BiArea from '@comp/BI/BiArea'
  import JUpload from '@comp/jeecg/JUpload'
  import { filterDictText, initDictOptions } from '@comp/dict/JDictSelectUtil'
  import { postAction, httpActionWF } from '@api/manage'
  import { initDictOptionsBatch } from '@comp/dict/JDictSelectUtil'
  import { handleRemove } from '../../../utils/fileRemove'

  export default {
    name: "RelPartyModal",
    components: { JUpload, BiArea, JDateRange, JDate, JDSelectTag },
    data () {
      let ruleReq = [{required: true, message: '必输字段',trigger:['change','blur']}];
      let cri = {naturalYn:"Y",partyName:"",gender:"",birthDt:"",idnType:"",idn:"",idnDt:[],natCode:"",maritalCode:"",ocuCode:"",jobTitle:""
        ,companyName:"",cphone:"",fphone:"",email:"",prjCode:this.$route.query.prjCode,orgType:"",jrxkzh:"",orgBusScope:"",principalNaturalYn:"Y",
        principalName:"",principalIdnType:"",principalIdnNo:"",principalIdnDt:[],ctrlerNaturalYn:"Y",ctrlerName:"",ctrlerIdnType:"",ctrlerIdnNo:"",
        ctrlerIdnDt:[],bnfinfoCompleteYn:'',fnancialSituation:'',physicaSituation:''};
      let cpac = {addrProvCode:"",addrCityCode:"",addrCountyCode:"",address:""};
      let cpas = {addrProvCode:"",addrCityCode:"",addrCountyCode:""};
      let client = {riskCode:"",hostCusParty:"",rightSuspDt:"",memo:"",prjCode:this.$route.query.prjCode};
      let cppm = {prjCode:this.$route.query.prjCode,relTypeCode:"",cusRelativeType:''};
      let cai = {accName:'',accNo:'',accOpenBank:''};
      let cbi = {bnfType:'',bnfRank:'',bnfStatus:'',accName:'',accNo:'',accOpenBank:''};
      let csi = {supRank:'',officeStdDt:'',officeEndDt:'',supervisorInfo:'',officeEndType:'',officeStdType:''};
      let files = [];
      let fo = {
        cri:cri,
        client:client,
        cpac:cpac,
        cpas:cpas,
        cai:cai,
        cbi:cbi,
        csi:csi,
        files:files,
        cppm:cppm,
        contactors:[],
        guardians:[]
      };
      let r = {};
      let genRules = function(obj,name){
        let xx = Object.keys(obj);
        for(let i=0;i<xx.length;i++){
          r[name+"."+xx[i]] = ruleReq;
        }
      }
      genRules(cri,"cri");
      genRules(cppm,"cppm");
      genRules(client,"client");
      genRules(cpac,"cpac");
      genRules(cbi,"cbi");
      genRules(csi,"csi");
      r['contactors[0].contName'] = ruleReq;
      r['contactors[0].idnType'] = ruleReq;
      r['contactors[0].idn'] = ruleReq;
      r['contactors[0].idnDt'] = ruleReq;

      let conColumns = [
        {
          title:'与委托人关系',
          dataIndex: 'ptyRelativeType',
          scopedSlots: { customRender: 'ptyRelativeType' }
        },
        {
          title:'姓名',
          dataIndex: 'contName',
          scopedSlots: { customRender: 'contName' }
        },{
          title:'联系地址',
          dataIndex: 'contAddr.address',
          scopedSlots: { customRender: 'contAddr.address' }
        },{
          title:'手机号码',
          dataIndex: 'ctelNo',
          scopedSlots: { customRender: 'ctelNo' }
        },{
          title:'固定电话',
          dataIndex: 'ftelNo',
          scopedSlots: { customRender: 'ftelNo' }
        },{
          title:'邮箱',
          dataIndex: 'email',
          scopedSlots: { customRender: 'email' }
        },{
          title:'备注',
          dataIndex: 'memo',
          scopedSlots: { customRender: 'memo' }
        }
      ];
      let gColumns=[
        {
          title:'证件类型',
          dataIndex: 'idnType',
          scopedSlots: { customRender: 'idnType' }
        },{
          title:'证件号码',
          dataIndex: 'idn',
          scopedSlots: { customRender: 'idn' }
        }
      ];
      gColumns.unshift(2, 0);
      let conOption={
        title: '操作',
        dataIndex: 'operation',
        width: '10%',
        scopedSlots: { customRender: 'contactorOpt' },
      };
      let gOption={
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        width: '120px',
        scopedSlots: { customRender: 'guardianOpt' },
      };
      let gc = [...conColumns,gOption];
      Array.prototype.splice.apply(gc,gColumns);
      return {
        customizeEnv: customizeEnv,
        title:" ",
        optType:'',
        relType:'',
        visible: false,
        model: {},
        confirmLoading: false,
        formStr: JSON.stringify(fo),
        form: fo,
        rules: r,
        url: {
          save: "/prj/rel/save",
          upload: "/sys/common/biUpload",
          findByPartyCode:"/prj/rel/findByPrjCode"
        },
        formStyle:{},
        contactorColumns:[...conColumns,conOption],
        guardianColumns: gc,
        cacheData:[],
        editingId: '',
        guardianCacheData:[],
        guardianEditingId: '',
        currentDate: {},
        dictOptionsData:[]
      }
    },
    created () {
      this.formStyle={height:(document.body.clientHeight-160)+'px',overflowY:'auto'};
      this.initDictConfig();
    },
    methods: {
      initDictConfig() {
        let that = this;
        initDictOptionsBatch("PTY_RELATIVE_TYPE,sex,IDNTYPES,RISK_CODE,NAT_CODE,MARITAL_CODE,y_n,OCU_CODE,JOB_TITLE,ORGIDNTYPES,ORG_TYPE," +
          "NATURAL_YN,FNANCIAL_SITUATION,PHYSICA_SITUATION,CUSSUP_OFFICE_STD_TYPE,CUSSUP_OFFICE_END_TYPE").then((res) => {
          if (res.success) {
            that.dictOptionsData = res.result;
          }
        });
      },
      fdText(o,v){
        return filterDictText(this.dictOptionsData[o],v);
      },
      initPage(relType, record){
        this.confirmLoading = true;
        this.relType = relType;
        this.visible = true;
        this.form.cppm.relTypeCode = relType;
        this.form.cri.partyCode = record.PARTY_CODE;
        let that = this;
        postAction(this.url.findByPartyCode, this.form).then((res)=>{
          if(res.success){
            Object.keys(res.result).forEach((key) => (res.result[key] == null) && delete res.result[key]);
            res.result.cri.idnDt = [res.result.cri.idnStdDt, res.result.cri.idnEndDt];
            if(res.result.contactors && res.result.contactors.length>0){
              res.result.contactors.forEach((contactor) => {
                contactor.idnDt = [contactor.idnStdDt, contactor.idnEndDt];
              });
            }else if(relType === 'TRUSTEE'){
              res.result.contactors=[{idnDt:[],contAddr:{}}]
            }
            res.result.files.forEach((file)=>{
              file.uid = file.id;
              file.name = file.fileName;
              file.status = 'done';
              file.response = '{"status": "success"}';
              file.url = window._CONFIG['domianURL']+"/sys/common/downloadStatic/" + file.filePath;
            });
            res.result.cri.principalIdnDt = [res.result.cri.principalIdnStdDt||'',res.result.cri.principalIdnEndDt||''];
            res.result.cri.ctrlerIdnDt = [res.result.cri.ctrlerIdnStdDt||'',res.result.cri.ctrlerIdnEndDt||''];
            console.dir(res.result);
            that.form = Object.assign(that.form, res.result);
            that.cacheData = that.form.contactors.map(item => ({ ...item }));
            that.guardianCacheData = that.form.guardians.map(item => ({ ...item }));
          }else{
            that.$message.error(res.message);
          }
        }).finally(()=>{
          that.confirmLoading = false;
        });
      },
      add (relType) {
        this.optType = "add";
        this.relType = relType;
        this.form = JSON.parse(this.formStr);
        this.form.cppm.relTypeCode = relType;
        this.form.cri.naturalYn = relType === 'TRUSTEE'?'N':'Y';
        this.tabChange(this.form.cri.naturalYn);
        this.editingId = '';
        this.visible = true;
      },
      view (relType, record) {
        let that = this;
        this.optType = "view";
        let myFun = function(){
          if(Object.keys(that.dictOptionsData).length>0){
            that.initPage(relType, record);
            clearInterval(itv);
          }
        };
        let itv = setInterval(myFun, 100);
      },
      edit (relType, record) {
        this.optType = "edit";
        this.initPage(relType, record);
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true;
            that.form.cri.idnStdDt = that.form.cri.idnDt[0];
            that.form.cri.idnEndDt = that.form.cri.idnDt[1];
            if(that.form.cri.principalIdnDt.length>1){
              that.form.cri.principalIdnStdDt = that.form.cri.principalIdnDt[0];
              that.form.cri.principalIdnEndDt = that.form.cri.principalIdnDt[1];
            }
            if(that.form.cri.ctrlerIdnDt.length>1){
              that.form.cri.ctrlerIdnStdDt = that.form.cri.ctrlerIdnDt[0];
              that.form.cri.ctrlerIdnEndDt = that.form.cri.ctrlerIdnDt[1];
            }
            if(that.form.cri.naturalYn === 'N'){
              that.form.contactors[0].idnStdDt = that.form.contactors[0].idnDt[0];
              that.form.contactors[0].idnEndDt = that.form.contactors[0].idnDt[1];
            }
            postAction(that.url.save, that.form).then((res)=>{
              if(res.success){
                const filesNeed2Upload = that.form.files.filter(file => file.id == undefined);
                if(filesNeed2Upload.length>0){
                  const formData = new FormData();
                  formData.append("module","RELPARTY_"+that.form.cppm.relTypeCode);
                  formData.append("dataId", res.message);
                  filesNeed2Upload.forEach(file => {
                    formData.append('files', file);
                  });
                  httpActionWF(that.url.upload, formData).then((res)=>{
                    if(res.success){
                      that.$message.success('保存成功！');
                      that.$emit('ok');
                      this.close();
                    }else{
                      that.$message.error(res.message);
                    }
                  }).catch(function(error){
                    that.$message.error('文件上传失败，请稍后重新上传，注意文件大小不可超过10M');
                  }).finally(() => {
                    that.confirmLoading = false;
                  });
                }else{
                  that.$message.success('保存成功！');
                  that.confirmLoading = false;
                  that.$emit('ok');
                  this.close();
                }
              }else{
                that.$message.error(res.message);
                that.confirmLoading = false;
              }
            });
          } else {
            that.$message.error('校验未通过');
            return false;
          }
        });
      },
      handleCancel () {
        this.close()
      },
      handCpacAreaChange(areaStr){
        if(areaStr){
          let a = areaStr.split(",");
          this.form.cpac.addrProvCode = a[0];
          this.form.cpac.addrCityCode = a[1];
          this.form.cpac.addrCountyCode = a[2];
        }
      },
      handCpasAreaChange(areaStr){
        if(areaStr){
          let a = areaStr.split(",");
          this.form.cpas.addrProvCode = a[0];
          this.form.cpas.addrCityCode = a[1];
          this.form.cpas.addrCountyCode = a[2];
        }
      },
      handContactorAreaChange(areaStr){
        if(areaStr){
          let a = areaStr.split(",");
          this.form.contactors[0].contAddr.addrProvCode = a[0];
          this.form.contactors[0].contAddr.addrCityCode = a[1];
          this.form.contactors[0].contAddr.addrCountyCode = a[2];
        }
      },
      addContactor(){
        let id = new Date().getTime();
        this.form.contactors = [...this.form.contactors, {id:id,contName:'',ptyRelativeType:'',contAddr:{addrProvCode:'',addrCityCode:'',addrCountyCode:'',address:''},ctelNo:'',ftelNo:'',email:'',memo:''}]
        let that = this;
        this.$nextTick(()=>{
          that.contactorEdit(id);
          that.cacheData = that.form.contactors.map(item => ({ ...item }));
        });
      },
      addGuardian(){
        let id = new Date().getTime();
        this.form.guardians = [...this.form.guardians, {id:id,contName:'',ptyRelativeType:'',contAddr:{addrProvCode:'',addrCityCode:'',addrCountyCode:'',address:''},idnType:'',idn:'',ctelNo:'',ftelNo:'',email:'',memo:''}]
        let that = this;
        this.$nextTick(()=>{
          that.guardianEdit(id);
          that.guardianCacheData = that.form.guardians.map(item => ({ ...item }));
        });
      },
      handleGuardianChange(value, id, column){
        const newData = [...this.form.guardians];
        const target = newData.filter(item => id === item.id)[0];
        if (target) {
          target[column.c] = value;
          this.form.guardians = newData;
        }
      },
      handleContactorChange(value, id, column){
        const newData = [...this.form.contactors];
        const target = newData.filter(item => id === item.id)[0];
        if (target) {
          target[column.c] = value;
          this.form.contactors = newData;
        }
      },
      guardianEdit(id) {
        const newData = [...this.form.guardians];
        const target = newData.filter(item => id === item.id)[0];
        this.guardianEditingId = id;
        if (target) {
          target.editable = true;
          this.form.guardians = newData;
        }
      },
      contactorEdit(id) {
        let newData = [...this.form.contactors];
        let target = newData.filter(item => id === item.id)[0];
        this.editingId = id;
        if (target) {
          target.editable = true;
          this.form.contactors = newData;
        }
      },
      guardianSave(id) {
        let newData = [...this.form.guardians];
        let newCacheData = [...this.guardianCacheData];
        let target = newData.filter(item => id === item.id)[0];
        let targetCache = newCacheData.filter(item => id === item.id)[0];

        if (target && targetCache) {
          delete target.editable;
          this.form.guardians = newData;
          Object.assign(targetCache, target);
          this.guardianCacheData = newCacheData;
        }
        this.guardianEditingId = '';
      },
      contactorSave(id) {
        let newData = [...this.form.contactors];
        let newCacheData = [...this.cacheData];
        let target = newData.filter(item => id === item.id)[0];
        let targetCache = newCacheData.filter(item => id === item.id)[0];

        if (target && targetCache) {
          delete target.editable;
          this.form.contactors = newData;
          Object.assign(targetCache, target);
          this.cacheData = newCacheData;
        }
        this.editingId = '';
      },
      guardianCancel(id) {
        const newData = [...this.form.guardians];
        const target = newData.filter(item => id === item.id)[0];
        this.guardianEditingId = '';
        if (target) {
          Object.assign(target, this.guardianCacheData.filter(item => id === item.id)[0]);
          delete target.editable;
          this.form.guardians = newData;
        }
      },
      contactorCancel(id) {
        const newData = [...this.form.contactors];
        const target = newData.filter(item => id === item.id)[0];
        this.editingId = '';
        if (target) {
          Object.assign(target, this.cacheData.filter(item => id === item.id)[0]);
          delete target.editable;
          this.form.contactors = newData;
        }
      },
      guardianDel(id){
        const newData = [...this.form.guardians];
        this.form.guardians = newData.filter(item => id !== item.id);
        this.guardianEditingId = '';
      },
      contactorDel(id){
        const newData = [...this.form.contactors];
        this.form.contactors = newData.filter(item => id !== item.id);
        this.editingId = '';
      },
      handleDDPartyChange(){

      },
      tabChange(key){
        this.form = JSON.parse(this.formStr);
        this.form.cppm.relTypeCode = this.relType;
        this.editingId = '';

        if("Y" === key){
          this.form.contactors=[];
        }else{
          this.form.contactors=[{
            contName:'',
            idnType:'',
            idn:'',
            idnDt:[],
            ctelNo:'',
            ftelNo:'',
            email:'',
            contAddr:{
              addrProvCode:'',
              addrCityCode:'',
              addrCountyCode:''
            }
          }]
        }
        this.form.cri.naturalYn=key;
        this.$nextTick(()=>{
          this.$refs.form.clearValidate();
        });
      },
      beforeUpload(file) {
        this.form.files = [...this.form.files, file];
        return false;
      },
      handleRemove(file) {
        if(this.optType !== 'view'){
          const index = this.form.files.indexOf(file);
          const newFileList = this.form.files.slice();
          newFileList.splice(index, 1);
          this.form.files = newFileList;
          handleRemove(this, file);
        }else{
          return false;
        }
      },
      calendarChange(val) {
        this.currentDate = val
      },
    }
  }
</script>

<style lang="less" scoped>
  .editable-row-operations a {
    margin-right: 8px;
  }
</style>