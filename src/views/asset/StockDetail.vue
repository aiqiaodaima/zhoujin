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
          <a-button @click="handleCancel">关闭</a-button>
          <a-button v-if="optType !== 'view'" type="primary" @click="onSubmit">提交</a-button>
        </a-col>
      </a-row>
    </template>
  <a-form-model ref="form" :model="form" :rules="rules">
    <a-card size="small" title="股权基本信息">
      <a-row :gutter="24">
        <a-col  :span="12">
          <a-form-model-item label="企业名称" prop="sto.enterpriseName">
            <a-input v-if="optType !== 'view'" placeholder="请输入企业名称" v-model="form.sto.enterpriseName"></a-input>
            <span v-else>{{ form.sto.enterpriseName }}</span>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="统一社会信用代码" prop="sto.socialCode">
            <a-input v-if="optType !== 'view'" placeholder="请输入统一社会信用代码" v-model="form.sto.socialCode"></a-input>
            <span v-else>{{ form.sto.socialCode }}</span>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-model-item label="机构性质" prop="sto.organizationType">
            <j-d-select-tag v-if="optType !== 'view'" dict-code="EAST_JGXZ" v-model="form.sto.organizationType" placeholder="请选择机构性质"></j-d-select-tag>
            <span v-else>{{ fdText('EAST_JGXZ', form.sto.organizationType) }}</span>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="企业注册类别" prop="sto.registrationType">
            <j-d-select-tag v-if="optType !== 'view'" dict-code="EAST_QYZCLB" v-model="form.sto.registrationType" placeholder="请选择企业注册类别"></j-d-select-tag>
            <span v-else>{{ fdText('EAST_QYZCLB', form.sto.registrationType) }}</span>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-model-item label="行业分类" prop="sto.industryType">
            <j-d-select-tag v-if="optType !== 'view'" dict-code="BNF_RANK" v-model="form.sto.industryType" placeholder="请选择行业分类"></j-d-select-tag>
            <span v-else>{{ fdText('BNF_RANK', form.sto.industryType) }}</span>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="行业明细" prop="sto.industrySubType">
            <j-d-select-tag v-if="optType !== 'view'" dict-code="PTY_RELATIVE_TYPE" v-model="form.sto.industrySubType" placeholder="请选择行业明细"></j-d-select-tag>
            <span v-else>{{ fdText('PTY_RELATIVE_TYPE', form.sto.industrySubType) }}</span>
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-model-item label="净资产余额" prop="sto.netAsset">
            <a-input-number v-if="optType !== 'view'" id="netAsset" :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" style="width:100%;"
                            :parser="value => value.replace(/\$\s?|(,*)/g, '')" placeholder="请输入净资产余额" :min="0" :precision="2"
                            v-model="form.sto.netAsset"></a-input-number>
            <span v-else>{{ form.sto.netAsset}}</span>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="总资产">
            <a-input-number v-if="optType !== 'view'" id="totalAsset" :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" style="width:100%;"
                            :parser="value => value.replace(/\$\s?|(,*)/g, '')" placeholder="请输入总资产" :min="0" :precision="2"
                            v-model="form.sto.totalAsset"></a-input-number>
            <span v-else>{{ form.sto.totalAsset }}</span>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="总负债">
            <a-input-number v-if="optType !== 'view'" id="totalDebt" :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" style="width:100%;"
                            :parser="value => value.replace(/\$\s?|(,*)/g, '')" placeholder="请输入总负债" :min="0" :precision="2"
                            v-model="form.sto.totalDebt"></a-input-number>
            <span v-else>{{ form.sto.totalDebt}}</span>
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-model-item label="企业规模" >
            <j-d-select-tag v-if="optType !== 'view'" dict-code="EAST_QYGM" v-model="form.sto.enterpriseType" placeholder="请选择企业规模"></j-d-select-tag>
            <span v-else>{{ fdText('EAST_QYGM', form.sto.enterpriseType) }}</span>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="注册资本" >
            <a-input-number v-if="optType !== 'view'"  id="registeredCapita" :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" style="width:100%;"
                            :parser="value => value.replace(/\$\s?|(,*)/g, '')" placeholder="请输入总负债" :min="0" :precision="2"
                            v-model="form.sto.registeredCapita"></a-input-number>
            <span v-else>{{form.sto.registeredCapita}}</span>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
        <a-form-model-item label="工商注册日期" >
          <j-date v-if="optType !== 'view'" :showLongTerm="false" placeholder="请选择工商注册日期" v-model="form.sto.registrationDate" style="width: 100%;"></j-date>
          <span v-else>{{ form.sto.registrationDate}}</span>
        </a-form-model-item>
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-model-item label="所属国别/地区" prop="sto.countryType">
            <j-d-select-tag v-if="optType !== 'view'" dict-code="NAT_CODE" v-model="form.sto.countryType" placeholder="请选择所属国别/地区"></j-d-select-tag>
            <span v-else>{{ fdText('NAT_CODE', form.sto.countryType) }}</span>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24" v-if="form.sto.countryType=='001'">
        <a-col :span="24">
          <a-form-model-item label="所属地区" prop="sto.entProvCode">
            <bi-area :showType="optType !== 'view'?'select':'text'" @change="handShareChange" :models="[form.sto.entProvCode, form.sto.entCityCode, form.sto.entCountyCode,form.sto.entAddress]"  :show-lv="4"></bi-area>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="24">
          <a-form-model-item label="经营范围">
            <a-textarea v-if="optType !== 'view'" class="no-resize" placeholder="请输入经营范围" v-model="form.sto.businessScope" allowClear :rows="4"></a-textarea>
            <span v-else>{{ form.sto.businessScope }}</span>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-card>

    <a-card  size="small" title="法定代表人">
      <a-form-item label="类型" slot="extra" style="width: 150px;margin: 0;padding: 0;">
        <j-d-select-tag v-if="optType !== 'view'" dict-code="NATURAL_YN" v-model="form.legal.naturalYn"></j-d-select-tag>
        <span v-else>{{ fdText('NATURAL_YN', form.legal.naturalYn) }}</span>
      </a-form-item>
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-model-item label="姓名/名称" prop="legal.contName">
            <a-input v-if="optType !== 'view'" placeholder="请输入姓名/名称" v-model="form.legal.contName"></a-input>
            <span v-else>{{ form.legal.contName }}</span>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-model-item label="证件类型" prop="legal.idnType">
            <j-d-select-tag v-if="optType !== 'view'" :dict-code="form.legal.naturalYn === 'Y'?'IDNTYPES':'ORGIDNTYPES'" v-model="form.legal.idnType" placeholder="请选择证件类型"></j-d-select-tag>
            <span v-else>{{ fdText(form.legal.naturalYn === 'Y'?'IDNTYPES':'ORGIDNTYPES', form.legal.idnType) }}</span>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="证件号码" prop="legal.idn">
            <a-input v-if="optType !== 'view'" placeholder="请输入证件号码" v-model="form.legal.idn"></a-input>
            <span v-else>{{ form.legal.idn }}</span>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="有效期" prop="legal.idnDt">
            <j-date-range v-if="optType !== 'view'" v-model="form.legal.idnDt"></j-date-range>
            <span v-else>{{ form.legal.idnDt[0]+" ~ "+form.legal.idnDt[1] }}</span>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-card>

    <a-card  size="small" title="实际控制人">
      <a-form-item label="类型" slot="extra" style="width: 150px;margin: 0;padding: 0;">
        <j-d-select-tag v-if="optType !== 'view'" dict-code="NATURAL_YN" v-model="form.actual.naturalYn"></j-d-select-tag>
        <span v-else>{{ fdText('NATURAL_YN', form.actual.naturalYn) }}</span>
      </a-form-item>
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-model-item label="姓名/名称">
            <a-input v-if="optType !== 'view'" placeholder="请输入姓名/名称" v-model="form.actual.contName"></a-input>
            <span v-else>{{ form.actual.contName }}</span>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-model-item label="证件类型">
            <j-d-select-tag v-if="optType !== 'view'" :dict-code="form.actual.naturalYn === 'Y'?'IDNTYPES':'ORGIDNTYPES'" v-model="form.actual.idnType" placeholder="请选择证件类型"></j-d-select-tag>
            <span v-else>{{ fdText(form.actual.naturalYn === 'Y'?'IDNTYPES':'ORGIDNTYPES', form.actual.idnType) }}</span>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="证件号码">
            <a-input v-if="optType !== 'view'" placeholder="请输入证件号码" v-model="form.actual.idn"></a-input>
            <span v-else>{{ form.actual.idn }}</span>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="有效期">
            <j-date-range v-if="optType !== 'view'" v-model="form.actual.idnDt"></j-date-range>
            <span v-else>{{(form.actual.idnDt[0]||'')+" ~ "+(form.actual.idnDt[1]||'') }}</span>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-card>

    <a-card  size="small" title="股东信息" style="margin-top: 15px">
          <span slot="extra">
            <a-button v-if="optType !== 'view'" type="primary" @click="addShare()">新增</a-button>
          </span>
      <a-table class="table-min-height"
               ref="table"
               size="small"
               rowKey="shareId"
               :scroll="{ x: 1500,y: 400 }"
               :columns="shareholderColumns"
               :dataSource="form.shares"
               :pagination="shareIpagination"
               :loading="loading"
               @change="shareHandleTableChange">
       <template
          v-for="col in [{c:'contributionAmount',t:['input']},{c:'proprietarType',t:['dict','EAST_KGFS']},{c:'shareholdingRatio',t:['input']},{c:'shareholdingCount',t:['input']}]"
          :slot="col.c"
          slot-scope="text, record, index"
        >
           <a-input
             v-if="optType !== 'view' && col.t[0] === 'input'"
             style="margin: -5px 0"
             :key="col.c"
             :value="text"
             @change="e => handleChange(e.target.value, record.shareId, col)"
           ></a-input>
           <j-d-select-tag
             v-else-if="optType !== 'view' && col.t[0] === 'dict'"
             :dict-code="col.t[1]"
             :value="text"
             :key="col.c"
             @change="e => handleChange(e, record.shareId, col)"
           ></j-d-select-tag>
           <template v-else>{{ col.t[0] === 'input'?text:fdText(col.t[1], text) }}</template>
        </template>


        <template slot="action" slot-scope="text, record">
          <div class="editable-row-operations">
            <span>
              <a @click="shareView(record)">查看</a>
              <a-divider v-if="optType!=='view'"  type="vertical" />
              <a v-if="optType!=='view'" @click="shareEdit(record)">编辑</a>
              <a-divider v-if="optType!=='view'" type="vertical" />
              <a-popconfirm
                            title="确认删除吗?"
                            @confirm="()=>shareDel(record)"
              >
                <a v-if="optType!=='view'"  href="#">删除</a>
              </a-popconfirm>
            </span>
          </div>
        </template>
      </a-table>
      <BiModal
        :visible.sync="modal.visible"
        :width="1000"
        :title="modal.title"
        :fullscreen.sync="modal.fullscreen"
        :switchFullscreen="modal.switchFullscreen"
        :confirmLoading='modal.confirmLoading'
      >
        <template slot="footer">
          <a-row :gutter="24" style="margin:0;padding:0">
            <a-col :span="23" style="text-align: center;">
              <a-button @click="hClose">关闭</a-button>
              <a-button v-if="optType !== 'view'" type="primary" @click="handleOk">提交</a-button>
            </a-col>
          </a-row>
        </template>
        <a-form-model ref="shareForm" :model="shareForm" :rules="shareRules">
          <a-tabs :activeKey="shareForm.share.naturalYn" size="small" @change="tabChange" >
            <a-tab-pane tab="自然人" key="Y" v-if="shareType==='add' || (shareType!=='add'&&shareForm.share.naturalYn==='Y')">
            </a-tab-pane>
            <a-tab-pane tab="机构" key="N" v-if="shareType==='add' || (shareType!=='add'&&shareForm.share.naturalYn==='N')">
            </a-tab-pane>
            <a-tab-pane tab="金融产品" key="F" v-if="shareType==='add' || (shareType!=='add'&&shareForm.share.naturalYn==='F')">
            </a-tab-pane>
          </a-tabs>

          <a-card size="small" title="基本信息">
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-model-item label="股东类型" prop="share.shareholderType">
                  <j-d-select-tag v-if="shareType !== 'view'" dict-code="GQ_GDLX" v-model="shareForm.share.shareholderType" placeholder="请选择股东类型"></j-d-select-tag>
                  <span v-else>{{ fdText('GQ_GDLX', shareForm.share.shareholderType) }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item :label="shareForm.share.naturalYn==='Y'?'姓名':'名称'" prop="share.shareholderName">
                  <a-input v-if="shareType !== 'view'" :placeholder="shareForm.share.naturalYn==='Y'?'请输入姓名':'请输入名称'" v-model="shareForm.share.shareholderName"></a-input>
                  <span v-else>{{shareForm.share.shareholderName}}</span>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-model-item label="证件类型" prop="share.idnType">
                  <j-d-select-tag v-if="shareType !== 'view'" :dict-code="shareForm.share.naturalYn === 'Y'?'IDNTYPES':'ORGIDNTYPES'" v-model="shareForm.share.idnType" placeholder="请选择证件类型"></j-d-select-tag>
                  <span v-else>{{ fdText(shareForm.share.naturalYn === 'Y'?'IDNTYPES':'ORGIDNTYPES', shareForm.share.idnType) }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="证件号码" prop="share.idn">
                  <a-input v-if="shareType !== 'view'" placeholder="请输入证件号码" v-model="shareForm.share.idn"></a-input>
                  <span v-else>{{ shareForm.share.idn }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="有效期" prop="share.idnDt">
                  <j-date-range v-if="shareType !== 'view'" v-model="shareForm.share.idnDt"></j-date-range>
                  <span v-else>{{ shareForm.share.idnDt[0]+" ~ "+shareForm.share.idnDt[1] }}</span>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-card>
          <a-card size="small" title="附件" style="margin-top: 15px">
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-item label="文件上传">
                  <a-upload :fileList="shareForm.share.shareFiles" :multiple="true" :remove="handleRemove" :beforeUpload="beforeUpload">
                    <a-button v-if="shareType !== 'view'"> <a-icon type="upload"></a-icon> 选择 </a-button>
                  </a-upload>
                </a-form-item>
              </a-col>
            </a-row>
          </a-card>
        </a-form-model>
      </BiModal>
    </a-card>

    <a-card  size="small" title="对外投资" style="margin-top: 15px">
          <span slot="extra">
            <a-button v-if="optType !== 'view'"  type="primary" @click="addInvestment">新增</a-button>
          </span>
      <a-table class="table-min-height"
               ref="table"
               size="small"
               rowKey="id"
               :scroll="{ x: 1500,y: 400 }"
               :columns="investmentColumns"
               :dataSource="investmentDataSource"
               :pagination="investmentIpagination"
               :loading="loading"
               @change="investmentHandleTableChange">
        <template slot="action" slot-scope="text, record">
          <div class="editable-row-operations">
            <span>
              <a  @click="viewInvestment(record)">查看</a>
              <a-divider v-if="optType!=='view'"  type="vertical" />
              <a v-if="optType!=='view'" @click="editInvestment(record)">编辑</a>
              <a-divider v-if="optType!=='view'"  type="vertical" />
              <a-popconfirm
                title="确认删除吗?"
                @confirm="()=>delInvestment(record)"
              >
                <a v-if="optType!=='view'" href="#">删除</a>
              </a-popconfirm>
            </span>
          </div>
        </template>
      </a-table>
    </a-card>
    <a-card  size="small" title="股权穿透图" style="margin-top: 15px">
      <TreeChart :json="equityData" :class="{landscape: landscape.length}" @click-node="clickNode" />
    </a-card>

    <a-card  size="small" title="联系人"  style="margin-top: 15px">
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-model-item label="姓名">
            <a-input v-if="optType !== 'view'" placeholder="请输入姓名" v-model="form.contact.contName"></a-input>
            <span v-else>{{ form.contact.contName }}</span>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-model-item label="证件类型">
            <j-d-select-tag v-if="optType !== 'view'" dict-code="IDNTYPES" v-model="form.contact.idnType" placeholder="请选择证件类型"></j-d-select-tag>
            <span v-else>{{ fdText('IDNTYPES', form.contact.idnType) }}</span>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="证件号码">
            <a-input v-if="optType !== 'view'" placeholder="请输入证件号码" v-model="form.contact.idn"></a-input>
            <span v-else>{{ form.contact.idn }}</span>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="有效期">
            <j-date-range v-if="optType !== 'view'" v-model="form.contact.idnDt"></j-date-range>
            <span v-else>{{(form.contact.idnDt[0]||'')+" ~ "+(form.contact.idnDt[1]||'') }}</span>
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-model-item label="手机号码">
            <a-input v-if="optType !== 'view'" placeholder="请输入手机号码" v-model="form.contact.fphone"></a-input>
            <span v-else>{{ form.contact.fphone }}</span>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="固定电话">
            <a-input v-if="optType !== 'view'" placeholder="请输入固定电话" v-model="form.contact.cphone"></a-input>
            <span v-else>{{ form.contact.cphone }}</span>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="电子邮箱">
            <a-input v-if="optType !== 'view'" placeholder="请输入电子邮箱" v-model="form.contact.email"></a-input>
            <span v-else>{{ form.contact.email }}</span>
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col :span="24">
          <a-form-model-item label="联系地址">
            <bi-area :showType="optType !== 'view'?'select':'text'" @change="handContactChange" :models="[form.contact.contProvCode, form.contact.contCityCode, form.contact.contCountyCode, form.contact.contAddress]"  :show-lv="4"></bi-area>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-card>

    <a-card  size="small" title="资产相关文档及说明" style="margin-top: 15px">
      <a-tabs :activeKey="fileType" size="small" @change="fileTabChange" >
        <a-tab-pane tab="财务报表" key="F">
        </a-tab-pane>
        <a-tab-pane tab="重大事项报告" key="M">
        </a-tab-pane>
        <a-tab-pane tab="其他" key="OTH">
        </a-tab-pane>
      </a-tabs>
      <a-row :gutter="24" >
        <a-col :span="24">
          <a-form-item label="文件上传" v-if="fileType==='F'">
            <a-upload :fileList="form.Ffiles" :multiple="true" :remove="handleRemove" :beforeUpload="beforeUpload">
              <a-button v-if="optType !== 'view'"> <a-icon type="upload"></a-icon>选择</a-button>
            </a-upload>
          </a-form-item>
          <a-form-item label="文件上传" v-if="fileType==='M'">
            <a-upload :fileList="form.Mfiles" :multiple="true" :remove="handleRemove" :beforeUpload="beforeUpload">
              <a-button v-if="optType !== 'view'"> <a-icon type="upload"></a-icon>选择</a-button>
            </a-upload>
          </a-form-item>
          <a-form-item label="文件上传" v-if="fileType==='OTH'">
            <a-upload :fileList="form.OthFiles" :multiple="true" :remove="handleRemove" :beforeUpload="beforeUpload">
              <a-button v-if="optType !== 'view'"> <a-icon type="upload"></a-icon>选择</a-button>
            </a-upload>
          </a-form-item>
        </a-col>
      </a-row>
    </a-card>
  </a-form-model>
  </a-modal>
</template>

<script>
  import { filterObj } from '@/utils/util';
  import biTableMixin from '@mixins/biTableMixin'
  import { getDict } from '@/api/BiApi'
  import dictMixin from '@mixins/dictMixin'
  import JDSelectTag from '@comp/dict/JDSelectTag'
  import JDate from '@comp/jeecg/JDate'
  import JDateRange from '@comp/jeecg/JDateRange'
  import BiArea from '@comp/BI/BiArea'
  import JUpload from '@comp/jeecg/JUpload'
  import { filterDictText, initDictOptions } from '@comp/dict/JDictSelectUtil'
  import { postAction, httpActionWF } from '@api/manage'
  import { initDictOptionsBatch } from '@comp/dict/JDictSelectUtil'
  import TreeChart from "@/components/TreeChart";
  import { addStock, editStock,makeProCode,getStockDetail,getEquityData} from '@/api/BiApi'
  import { handleRemove } from '../../utils/fileRemove'
  import { formatAmt } from '../../utils/util'
  export default {
    name: 'StockDetail',
    components: { TreeChart,JUpload, BiArea, JDateRange, JDate, JDSelectTag },
    mixins:{dictMixin,biTableMixin},
    data () {
      let that=this
      let ruleReq = [{required: true, message: '必输字段',trigger:['change','blur']}];
      //股权基本信息
      let sto = {proCode:"",enterpriseName:"",socialCode:"",organizationType:"",registrationType:"",industryType:"",industrySubType:"",netAsset:"",totalAsset:"",totalDebt:"",enterpriseType:""
        ,registeredCapita:"",registrationDate:"",countryType:"",entProvCode:"",entCityCode:"",entCountyCode:"",entAddress:"",businessScope:"",parentNode:that.parentNode};

      //法定代表人信息
      let legal = {proCode:"",contType:"LEGAL",naturalYn:"Y",contName:"",idnType:"",idn:"",idnDt:[],idnStdDt:"",idnEndDt:"",fphone:"",cphone:"",email:"",contProvCode:"",contCityCode:"",contCountyCode:"",contAddress:""};
      //实际控制人信息
      let actual = {proCode:"",contType:"ACTUAL",naturalYn:"Y",contName:"",idnType:"",idn:"",idnDt:[],idnStdDt:"",idnEndDt:"",fphone:"",cphone:"",email:"",contProvCode:"",contCityCode:"",contCountyCode:"",contAddress:""};
      //联系人信息
      let contact = {proCode:"",contType:"CONTACT",naturalYn:"",contName:"",idnType:"",idn:"",idnDt:[],idnStdDt:"",idnEndDt:"",fphone:"",cphone:"",email:"",contProvCode:"",contCityCode:"",contCountyCode:"",contAddress:""};

      //股东信息
      let share = {proCode:"",naturalYn:"Y",shareholderType:"",shareholderName:"",idnType:"",idn:"",idnDt:[],proprietarType:"",contributionAmount:"",curCode:"156",shareholdingRatio:""
        ,shareholdingCount:"",idnStdDt:"",idnEndDt:"",shareFiles:[],shareId:"",defultYn:'N'};

      //所有上传文件
      let files=[];
      //股东信息页面上传文件
      let shareFiles = [];
      //重大事项报告文件
      let Mfiles=[];
      //财务报表文件
      let Ffiles=[];
      //其他文件
      let OthFiles=[];

      //股东信息
      let shares=[];
      //关系人
      let stockParty=[];

      let fo = {
        sto:sto,
        legal:legal,
        actual:actual,
        contact:contact,
        shareFiles:shareFiles,
        shares:shares,
        stockParty:stockParty,
        Mfiles:Mfiles,
        Ffiles:Ffiles,
        OthFiles:OthFiles,
        files:files
      };
      let r = {};
      let genRules = function(obj,name){
        let xx = Object.keys(obj);
        for(let i=0;i<xx.length;i++){
          r[name+"."+xx[i]] = ruleReq;
        }
      }
      genRules(sto,"sto");
      genRules(legal,"legal");

      let shareForm={
        share:share,
      }
      let shareRules = {};
      let sh = function(obj,name){
        let xx = Object.keys(obj);
        for(let i=0;i<xx.length;i++){
          shareRules[name+"."+xx[i]] = ruleReq;
        }
      }
      sh(share,"share");
      return {
        parentNode:'',
        fileType:"F",
        proCode:"",
        form: fo,
        shareForm:shareForm,
        shareRules:shareRules,
        rules: r,
        optType:'',
        shareType:'',
        isShowParent:false,
        visible: false,
        confirmLoading:false,
        loading:false,
        removeIds:'',
        shareIds:'',
        investmentIds:'',
        title:'',
        dictOptionsData:[],
        shareDataSource:[],
        shareIpagination:{
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        investmentDataSource:[],
        investmentIpagination:{
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        modal: {
          title: '股东信息',
          visible: false,
          fullscreen: false,
          switchFullscreen: false,
          confirmLoading: false,
        },
        landscape: [],
        equityData:'',
        // 表头
        shareholderColumns: [
        {
          title: '姓名/名称',
          dataIndex: 'shareholderName',
        },
        {
          title: '股东类型',
          dataIndex: 'shareholderType',
          customRender: function (t) {
            return that.fdText('GQ_GDLX',t)
          }
        },
        {
          title: '证件类型|证件号码',
          dataIndex: 'idnType',
          customRender: function (t,r) {
            let name =''
            let idnType=that.fdText(r.naturalYn=='Y'?'IDNTYPES':'ORGIDNTYPES',t)
            name=idnType+'|'+r.idn
            return name
          }
        },
        {
          title: '控股方式',
          dataIndex: 'proprietarType',
          scopedSlots: { customRender: 'proprietarType' },
        },
        {
          title: '出资金额（元）',
          dataIndex: 'contributionAmount',
          scopedSlots: { customRender: 'contributionAmount' },
        },
        {
          title: '币别',
          dataIndex: 'curCode',
          customRender: function (t) {
            return that.fdText('CUR_CODE',t)
          }
        },
        {
          title: '持股比例（%）',
          dataIndex: 'shareholdingRatio',
          scopedSlots: { customRender: 'shareholdingRatio' },
        },
        {
          title: '持股数量',
          dataIndex: 'shareholdingCount',
          scopedSlots: { customRender: 'shareholdingCount' },
        },
        {
          title: '操作',
          dataIndex: 'action',
          fixed: 'right',
          scopedSlots: { customRender: 'action' },
        }
      ],
        investmentColumns: [
          {
            title: '名称',
            dataIndex: 'enterpriseName',
          },
          {
            title: '证件类型|证件号码',
            dataIndex: 'idnType',
            customRender: function (t,r) {
              let name =''
              let idnType=that.fdText('ORGIDNTYPES',t)
              name=idnType+'|'+r.idn
              return name
            }
          },
          {
            title: '法人',
            dataIndex: 'contName',
          },
          {
            title: '控股方式',
            dataIndex: 'proprietarType',
            customRender: function (t) {
              return that.fdText('EAST_KGFS',t)
            }
          },
          {
            title: '出资金额（元）',
            dataIndex: 'contributionAmount',
            customRender: function (text) {
              return formatAmt(Number(text||0),2);
            }
          },
          {
            title: '币别',
            dataIndex: 'curCode',
            customRender: function (t) {
              return that.fdText('CUR_CODE',t)
            }
          },
          {
            title: '持股比例（%）',
            dataIndex: 'shareholdingRatio',
            customRender: function (text) {
              return formatAmt(Number(text||0),2);
            }
          },
          {
            title: '持股数量',
            dataIndex: 'shareholdingCount',
            customRender: function (text) {
              return formatAmt(Number(text||0),2);
            }
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: '150px',
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          upload: "/sys/common/biUpload",
          getFiles: "/proStock/getFiles",
        },
      }
    },
    methods:{
       addShare(){
         this.shareType='add'
         console.log("proCode-------->"+this.proCode)
         //股东信息
          this.shareForm.share = {proCode:this.proCode,naturalYn:"Y",shareholderType:"",shareholderName:"",idnType:"",idn:"",idnDt:[],proprietarType:"",contributionAmount:"",curCode:"156",shareholdingRatio:""
           ,shareholdingCount:"",idnStdDt:"",idnEndDt:"",shareFiles:[],shareId:"",defultYn:'N'};
         this.fileType='S'
        this.modal.visible=true
      },
      addInvestment(){
        if (this.optType!='edit'){
          //将上级股权信息暂存
          this.proStatus = 'T'
          //编辑时不需要再次保存父页面信息
          this.saveStock()
        } else {
          this.close()
          setTimeout(()=>{   //设置延迟执行
            this.$emit('addChild',this.proCode)
          },5);
        }

      },
      viewInvestment(record){
         this.close();
         setTimeout(()=>{
           this.$emit('viewChild',record.proCode)
         },5)
      },
      editInvestment(record){
        this.close();
        setTimeout(()=>{
            this.$emit('editChild',record.proCode)
        },5)

      },
      hClose(){
         this.modal.visible=false
      },
      tabChange(key){
         this.shareForm.share.naturalYn=key;
      },

      fileTabChange(key){
        this.fileType=key;
      },
      shareEdit(item) {
        this.shareType=''
        this.fileType='S'
        this.modal.visible = true;
        this.shareForm.share= {
          proCode:item.proCode,
          shareId: item.shareId,
          naturalYn: item.naturalYn,
          shareholderType: item.shareholderType,
          shareholderName: item.shareholderName,
          idnType: item.idnType,
          idn: item.idn,
          idnDt:item.idnDt,
          shareFiles:item.shareFiles
        }
      },
      shareView(item) {
         this.shareType='view'
        this.fileType='S'
        this.modal.visible = true;
         item.idnDt=[item.idnStdDt,item.idnEndDt];
        this.shareForm.share= {
          proCode:item.proCode,
          shareId: item.shareId,
          naturalYn: item.naturalYn,
          shareholderType: item.shareholderType,
          shareholderName: item.shareholderName,
          idnType: item.idnType,
          idn: item.idn,
          idnDt:item.idnDt,
          shareFiles:item.shareFiles
        }
      },
      handleOk(){
        this.$refs.shareForm.validate((valid) => {
          if (valid){
            if (this.shareForm.share.shareId){
              //编辑页面
              //找到对应的数据赋值
              this.form.shares.forEach(item=>{
                if (item.shareId==this.shareForm.share.shareId) {
                  item.naturalYn=this.shareForm.share.naturalYn
                  item.shareholderType=this.shareForm.share.shareholderType
                  item.shareholderName=this.shareForm.share.shareholderName
                  item.idnType=this.shareForm.share.idnType
                  item.idn=this.shareForm.share.idn
                  item.idnDt=this.shareForm.share.idnDt

                  //遍历对应的文件添加股东id作为标识
                  item.shareFiles.forEach((file)=>{
                    if (file.extDate != item.shareId){
                      file.extDate =item.shareId;
                      this.uploadFile('S',item.shareId,file,item.proCode);
                    }
                  });

                }
              })
            }else {
              //新增
              this.shareForm.share.idnStdDt = this.shareForm.share.idnDt[0]
              this.shareForm.share.idnEndDt = this.shareForm.share.idnDt[1]
              this.shareForm.share.shareId=this.getNum();
              //遍历对应的文件添加股东id作为标识
              this.shareForm.share.shareFiles.forEach((file)=>{
                file.extDate =this.shareForm.share.shareId;
              });
              this.uploadFile('S',this.shareForm.share.shareId,this.shareForm.share.shareFiles,this.proCode);
              this.form.shares.push(this.shareForm.share)
            }
            console.log("数据源-----》"+JSON.stringify(this.form.shares))
            this.fileType='F'
            this.modal.visible=false
          } else {
            this.$message.error('校验未通过')
            return false
          }

        })

      },
      handleCancel () {
         if (this.isShowParent){
           //只有isShowParent为true的时候才需要回显父页面
           this.isShowParent=false;
           //关闭的时候判断当前页面是否有父页面，有则关闭后显示父页面
           if (this.form.sto.parentNode!=null && this.form.sto.parentNode!='' && this.form.sto.parentNode!=undefined){
             this.close()
             if (this.optType=='add' || this.optType=='edit'){
               setTimeout(()=>{
                 this.$emit('editChild',this.form.sto.parentNode)
               },5)
             }
             if (this.optType=='view'){
               setTimeout(()=>{
                 this.$emit('viewChild',this.form.sto.parentNode)
               },5)
             }
           } else {
             this.close()
             this.$emit('ok')
           }
         } else {
           this.close()
           this.$emit('ok')
         }


      },
      close () {
        this.visible = false;
      },
      clickNode: function(node){
        // eslint-disable-next-line
        console.log(node)
      },
      shareHandleTableChange(pagination, filters, sorter) {
        //分页、排序、筛选变化时触发
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field;
          this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
        }
        this.shareIpagination = pagination;
        // this.loadShareData();
      },
      investmentHandleTableChange(pagination, filters, sorter) {
        //分页、排序、筛选变化时触发
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field;
          this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
        }
        this.investmentIpagination = pagination;
        // this.loadInvestmentData();
      },
      beforeUpload(file) {
         if (this.fileType=='F'){
           this.form.Ffiles = [...this.form.Ffiles, file];
           return false;
         }
      else  if (this.fileType=='M'){
          this.form.Mfiles = [...this.form.Mfiles, file];
          return false;
        }
      else  if (this.fileType=='OTH'){
          this.form.OthFiles = [...this.form.OthFiles, file];
          return false;
        }
      else{
           this.shareForm.share.shareFiles = [...this.shareForm.share.shareFiles, file];
           return false;
         }

      },
      handleRemove(file) {
        if (this.proCode){
          //编辑页面删除现有的上传文件
          this.removeIds +=file.id+',';
        }
        if(this.optType !== 'view'){
          if (this.fileType=='F'){
            const index = this.form.Ffiles.indexOf(file);
            const newFileList = this.form.Ffiles.slice();
            newFileList.splice(index, 1);
            this.form.Ffiles = newFileList;
            handleRemove(this, file);
          }
          else  if (this.fileType=='M'){
            const index = this.form.Mfiles.indexOf(file);
            const newFileList = this.form.Mfiles.slice();
            newFileList.splice(index, 1);
            this.form.Mfiles = newFileList;
            handleRemove(this, file);
          }
          else  if (this.fileType=='OTH'){
            const index = this.form.OthFiles.indexOf(file);
            const newFileList = this.form.OthFiles.slice();
            newFileList.splice(index, 1);
            this.form.OthFiles = newFileList;
            handleRemove(this, file);
          }
          else{
            const index = this.shareForm.share.shareFiles.indexOf(file);
            const newFileList = this.shareForm.share.shareFiles.slice();
            newFileList.splice(index, 1);
            this.shareForm.share.shareFiles = newFileList;
            handleRemove(this, file);
          }
        }else{
          return false;
        }
      },
      shareDel(record){
        var index = this.form.shares.findIndex(item =>{
          if(item.idn==record.idn){
            return true
          }
        })
        if (this.optType=='edit'){
          //如果是编辑页面删除时  记录删除的id
          this.shareIds+=record.id+',';
        }
        this.form.shares.splice(index,1)
      },
      delInvestment(record){
        var index = this.investmentDataSource.findIndex(item =>{
          if(item.proCode==record.proCode){
            return true
          }
        })
        if (this.optType=='edit'){
          //如果是编辑页面删除时  记录删除的id
          this.investmentIds+=record.proCode+',';
        }
        this.investmentDataSource.splice(index,1)
      },
      initDictConfig() {
        let that = this;
        initDictOptionsBatch("EAST_QYGM,EAST_JGXZ,EAST_QYZCLB,NAT_CODE,IDNTYPES,ORGIDNTYPES,CUR_CODE,NATURAL_YN,EAST_KGFS,GQ_GDLX,y_n").then((res) => {
          if (res.success) {
            that.dictOptionsData = res.result;
          }
        });
      },
      fdText(o,v){
        return filterDictText(this.dictOptionsData[o],v);
      },
      addChild(parentNode){
         let that =this;
         that.parentNode=parentNode;
         that.isShowParent=true
        that.makeProCode();
        //先清空上级股东信息
        that.shareForm.share = {proCode:that.proCode,naturalYn:"Y",shareholderType:"",shareholderName:"",idnType:"",idn:"",idnDt:[],proprietarType:"",contributionAmount:"",curCode:"156",shareholdingRatio:""
          ,shareholdingCount:"",idnStdDt:"",idnEndDt:"",shareFiles:[],shareId:""};
        //股东信息
        that.form.shares=[];
        //将上级股权基本信息作为对外投资的股东信息默认带出
        that.shareForm.share = {proCode:that.proCode,naturalYn:"N",shareholderType:"",shareholderName:that.form.sto.enterpriseName,idnType:"Z",idn:that.form.sto.socialCode,idnDt:[],proprietarType:"",contributionAmount:"",curCode:"156",shareholdingRatio:""
          ,shareholdingCount:"",idnStdDt:"",idnEndDt:"",shareFiles:[],shareId:this.getNum(),defultYn:'Y'};
        that.form.shares.push(that.shareForm.share)



        //股权基本信息
        that.form.sto = {proCode:that.proCode,enterpriseName:"",socialCode:"",organizationType:"",registrationType:"",industryType:"",industrySubType:"",netAsset:"",totalAsset:"",totalDebt:"",enterpriseType:""
          ,registeredCapita:"",registrationDate:"",countryType:"",entProvCode:"",entCityCode:"",entCountyCode:"",entAddress:"",businessScope:"",parentNode:parentNode};

        //法定代表人信息
        that.form.legal = {proCode:that.proCode,contType:"LEGAL",naturalYn:"Y",contName:"",idnType:"",idn:"",idnDt:[],idnStdDt:"",idnEndDt:"",fphone:"",cphone:"",email:"",contProvCode:"",contCityCode:"",contCountyCode:"",contAddress:""};
        //实际控制人信息
        that.form.actual = {proCode:that.proCode,contType:"ACTUAL",naturalYn:"Y",contName:"",idnType:"",idn:"",idnDt:[],idnStdDt:"",idnEndDt:"",fphone:"",cphone:"",email:"",contProvCode:"",contCityCode:"",contCountyCode:"",contAddress:""};
        //联系人信息
        that.form.contact = {proCode:that.proCode,contType:"CONTACT",naturalYn:"",contName:"",idnType:"",idn:"",idnDt:[],idnStdDt:"",idnEndDt:"",fphone:"",cphone:"",email:"",contProvCode:"",contCityCode:"",contCountyCode:"",contAddress:""};



        //所有上传文件
        that.form.files=[];
        //股东信息页面上传文件
        that.form.shareFiles = [];
        //重大事项报告文件
        that.form.Mfiles=[];
        //财务报表文件
        that.form.Ffiles=[];
        //其他文件
        that.form.OthFiles=[];
        that.investmentDataSource=[];
        //关系人
        that.form.stockParty=[];
        //打开页面后
         console.log('addChild------>'+parentNode)
        this.optType='add';
        this.proStatus='';
        this.parentNode=parentNode;
        this.visible = true;
      },
      editChild(proCode) {
        this.investmentIds='';
        this.shareIds='';
         this.proCode=proCode;
        this.optType='edit';
        this.isShowParent=true
        this.initPage(proCode)
        this.visible = true;
      },
      viewChild(proCode){
        this.initPage(proCode)
        this.optType='view';
        this.isShowParent=true
        this.visible = true;
      },
      add () {
         let that=this;
        that.makeProCode();
        //股权基本信息
        that.form.sto = {proCode:that.proCode,enterpriseName:"",socialCode:"",organizationType:"",registrationType:"",industryType:"",industrySubType:"",netAsset:"",totalAsset:"",totalDebt:"",enterpriseType:""
          ,registeredCapita:"",registrationDate:"",countryType:"",entProvCode:"",entCityCode:"",entCountyCode:"",entAddress:"",businessScope:"",parentNode:that.parentNode};

        //法定代表人信息
        that.form.legal = {proCode:that.proCode,contType:"LEGAL",naturalYn:"Y",contName:"",idnType:"",idn:"",idnDt:[],idnStdDt:"",idnEndDt:"",fphone:"",cphone:"",email:"",contProvCode:"",contCityCode:"",contCountyCode:"",contAddress:""};
        //实际控制人信息
        that.form.actual = {proCode:that.proCode,contType:"ACTUAL",naturalYn:"Y",contName:"",idnType:"",idn:"",idnDt:[],idnStdDt:"",idnEndDt:"",fphone:"",cphone:"",email:"",contProvCode:"",contCityCode:"",contCountyCode:"",contAddress:""};
        //联系人信息
        that.form.contact = {proCode:that.proCode,contType:"CONTACT",naturalYn:"",contName:"",idnType:"",idn:"",idnDt:[],idnStdDt:"",idnEndDt:"",fphone:"",cphone:"",email:"",contProvCode:"",contCityCode:"",contCountyCode:"",contAddress:""};

        //股东信息
        that.shareForm.share = {proCode:that.proCode,naturalYn:"Y",shareholderType:"",shareholderName:"",idnType:"",idn:"",idnDt:[],proprietarType:"",contributionAmount:"",curCode:"156",shareholdingRatio:""
          ,shareholdingCount:"",idnStdDt:"",idnEndDt:"",shareFiles:[],shareId:"",defultYn:'N'};

        //所有上传文件
        that.form.files=[];
        //股东信息页面上传文件
        that.form.shareFiles = [];
        //重大事项报告文件
        that.form.Mfiles=[];
        //财务报表文件
        that.form.Ffiles=[];
        //其他文件
        that.form.OthFiles=[];
        //关系人
        that.form.stockParty=[];
        that.form.shares=[];
        that.investmentDataSource=[];
        that.optType='add';
        that.proStatus='';
        that.visible = true;
      },
      edit(record) {
        this.investmentIds='';
        this.shareIds='';
        this.optType='edit';
        this.initPage(record.proCode)
        this.visible = true;
      },
      view(record){
        this.initPage(record.proCode)
        this.optType='view';
        this.visible = true;
      },
      async getEquityData(proCode){
        const res = await getEquityData({proCode:proCode})
        if (res.success){
          this.equityData=res.result.data;
          console.log('股权穿透图----》'+res.result.data)
        }
      },
     async initPage(proCode){
         console.log('initPage---->'+proCode)
        const res = await getStockDetail({proCode:proCode})
       if (res.success){
         Object.keys(res.result).forEach((key) => res.result[key] == null && delete res.result[key])
         this.form.sto=res.result.sto;
         this.parentNode=res.result.sto.parentNode;
         this.proCode=res.result.sto.proCode;
         res.result.stockParty.forEach(party=>{
           if (party.contType=='LEGAL') {
             //法定代表人
             this.form.legal=party;
             this.form.legal.idnDt=[party.idnStdDt,party.idnEndDt];
           }
           if (party.contType=='ACTUAL') {
             //实际控制人
             this.form.actual=party
             this.form.actual.idnDt=[party.idnStdDt,party.idnEndDt];
           }
           if (party.contType=='CONTACT') {
             //联系人
             this.form.contact=party;
             this.form.contact.idnDt=[party.idnStdDt,party.idnEndDt];
           }
         })

          this.fileType='F';
         this.form.shares=res.result.shares;
         this.investmentDataSource=res.result.stocks;
         this.getUploadFiles(proCode);
         this.getEquityData(proCode);
       }

      },
      handleChange(value, id, column) {
        const newData = [...this.form.shares]
        const target = newData.filter((item) => id === item.shareId)[0]
        if (target) {
          target[column.c] = value
          this.form.shares = newData
        }
      },
      onSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.saveStock()
          } else {
            this.$message.error('校验未通过')
            return false
          }
        })
      },
      handShareChange(areaStr) {
        if (areaStr) {
          let a = areaStr.split(',')
          this.form.sto.entProvCode = a[0]
          this.form.sto.entCityCode = a[1]
          this.form.sto.entCountyCode = a[2]
          this.form.sto.entAddress = a[3]
        }
      },
      handContactChange(areaStr) {
        if (areaStr) {
          let a = areaStr.split(',')
          this.form.contact.contProvCode = a[0]
          this.form.contact.contCityCode = a[1]
          this.form.contact.contCountyCode = a[2]
          this.form.contact.contAddress = a[3]
        }
      },
      async saveStock(){
        const that = this
        if (that.parentNode!=null && that.parentNode!='' && that.parentNode!=undefined){
          that.form.sto.parentNode=that.parentNode;
          console.log("提交对外投资时parentNode------"+that.parentNode)
        }
        that.confirmLoading = true
        that.form.legal.idnStdDt = that.form.legal.idnDt[0]
        that.form.legal.idnEndDt = that.form.legal.idnDt[1]
        if (that.form.actual.idnDt.length > 1) {
          that.form.actual.idnStdDt = that.form.actual.idnDt[0]
          that.form.actual.idnEndDt = that.form.actual.idnDt[1]
        }
        if (that.form.contact.idnDt.length > 1) {
          that.form.contact.idnStdDt = that.form.contact.idnDt[0]
          that.form.contact.idnEndDt = that.form.contact.idnDt[1]
        }
        that.form.sto.proCode=this.proCode
        that.form.legal.proCode=this.proCode
        that.form.stockParty.push(that.form.legal)
        if (that.form.actual.contName!=null && that.form.actual.contName!='' && that.form.actual.contName!=undefined){
          that.form.actual.proCode=this.proCode
          that.form.stockParty.push(that.form.actual)
        }
        if (that.form.contact.contName!=null && that.form.contact.contName!='' && that.form.contact.contName!=undefined ){
          that.form.contact.proCode=this.proCode
          that.form.stockParty.push(that.form.contact)
        }
        //上传文件
        this.uploadFile('F','','','');
        this.uploadFile('M','','','');
        this.uploadFile('OTH','','','');
        let res = ''
        let param = {
          shares: that.form.shares,
          sto: that.form.sto,
          stockParty:that.form.stockParty,
          //编辑时删除的文件id
          ids:this.removeIds,
          proStatus:this.proStatus,
          investmentIds:this.investmentIds,
          shareIds:this.shareIds
        }

        // 编辑
        if (that.optType=='edit') {
          res = await editStock(param)
          if (res.success) {
            that.$message.success('操作成功');
            that.close()
            if (res.message!=='NONE'){
              //说明不是最底层弹窗，回显上级股权信息
              setTimeout(()=>{   //设置延迟执行
                that.$emit('editChild',res.message)
              },5);
            } else {
              that.$emit('ok')
            }
          }
        } else {
          res = await addStock(param) // 新增
          console.log("新增时proStatus---->"+that.proStatus)
          if (res.success) {
            if (that.proStatus =='T'){
              that.parentNode=that.proCode;
              that.close()
              setTimeout(()=>{   //设置延迟执行
                that.$emit('addChild',that.proCode)
              },5);
            } else{
              that.$message.success('操作成功');
              that.close()
              if (res.message!=='NONE'){
                //说明不是最底层弹窗，回显上级股权信息
                setTimeout(()=>{   //设置延迟执行
                  that.$emit('editChild',res.message)
                },5);
              } else {
                 that.$emit('ok')
              }

            }
          }
        }
      },
      //生成32位随机数
      getNum() {
        var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        var nums = "";
        for (var i = 0; i < 32; i++) {
          var id = parseInt(Math.random() * 61);
          nums += chars[id];
        }
        return nums;
      },
      async  makeProCode(){
        const res = await makeProCode()
        if (res.success){
          this.proCode=res.message;
          console.log('初始化页面时'+this.proCode)
        }
      },
    async  uploadFile(value,id,files,proCode){
         let that =this
        //保存上传的文件
        this.loading = true;
        const formData = new FormData();
        if (value=='F'){
          formData.append("dataId",proCode);
          formData.append("module","F");
          formData.append("moduleName","财务报告");
          that.form.Ffiles.forEach(file => {
            formData.append('files', file);
          });
        }
    else  if (value=='M'){
          formData.append("dataId",proCode);
          formData.append("module","M");
        formData.append("moduleName","重大事项报告");
        that.form.Mfiles.forEach(file => {
          formData.append('files', file);
        });
      }
    else  if (value=='OTH'){
          formData.append("dataId",proCode);
          formData.append("module","OTH");
        formData.append("moduleName","其他");
        that.form.OthFiles.forEach(file => {
          formData.append('files', file);
        });
      }else {
          if (value=='S'){
            formData.append("dataId",proCode);
            formData.append("module","S");
            formData.append("moduleName","股东信息相关文件");
            formData.append("extData",id);
            files.forEach(file=>{
              formData.append('files', file);
            })
          }
        }


        httpActionWF(that.url.upload, formData).then((res)=>{
          if(res.success){
          }else{
            that.$message.error(res.message);
            return
          }
        }).catch(function(error){
          that.$message.error('文件上传失败，请稍后重新上传，注意文件大小不可超过10M');
        }).finally(() => {
          that.loading = false;
        });
      },

    async  getUploadFiles(proCode){
        let that = this;
        that.loading = true;
        const formData = new FormData();
        formData.append("dataId",proCode);
      formData.append("module","F");
        console.log('获取上传的文件-----》'+proCode)
        postAction(this.url.getFiles, formData).then((res)=>{
          if(res.success){
            res.result.forEach((file)=>{
                file.uid = file.id;
                file.name = file.fileName;
                file.status = 'done';
                file.response = '{"status": "success"}';
                file.url = window._CONFIG['domianURL']+"/sys/common/downloadStatic/" + file.filePath;
                if (file.moduleCode=='F'){
                  this.form.Ffiles.push(file);
                }
                if (file.moduleCode=='M'){
                  this.form.Mfiles.push(file);
                }
                if (file.moduleCode=='OTH'){
                  this.form.OthFiles.push(file);
                }
                if (file.moduleCode=='S'){
                  this.form.shares.forEach(share=>{
                    if (share.shareId==file.extDate) {
                      share.shareFiles.push(file);
                    }

                  })
                }
              });
          }else{
            that.$message.error(res.message);
          }
        }).catch(function(error){
          that.$message.error('获取文件失败');
        }).finally(() => {
          that.loading = false;
        });
      },
  },
    created (){
      this.initDictConfig()
    },
  }
</script>

<style scoped>
  .btns{
    position: fixed;
    bottom: 10px;
    left: 50%;
  }
</style>