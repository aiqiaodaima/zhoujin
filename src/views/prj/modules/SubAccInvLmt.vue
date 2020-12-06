<template>
  <a-layout>
    <a-layout-content ref="iContent" style="margin-top: -16px">
      <a-spin :spinning="loading">
        <a-form-model
          :model="form"
          ref="form"
          :label-col="{ span: 9 }"
          :wrapper-col="{ span: 15 }"
          style="">
          <a-card size="small" :bordered="false">
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-model-item label="投资限制模版" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                  <a-select v-if="optType !== 'VIEW'" v-model="form.lmtTempId">
                    <a-select-option  v-for="item in investmentRestrictionTemplateList" :key="item.assetcomCode" :value="item.assetcomCode">{{item.assetcomName}}</a-select-option>
                  </a-select>
                  <span v-else>{{ form.lmtTempId }}</span>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-card>

          <a-card size="small" title="资产投资比例" style="margin-top: 15px" v-if="customizeEnv !== 'zrt'">
            <span slot="extra" v-if="optType !== 'VIEW'">
              资产投资比例模版：<a-select style="width: 120px"></a-select>
            </span>
            <a-row :gutter="24">
              <a-col :span="13">
                <a-form-model-item label="现金类警示下限（%）" >
                  <a-input-number :min="0" :max="100" v-if="optType !== 'VIEW'" v-model="form.zctzbl.xj.xx"></a-input-number>
                  <span v-else>{{ form.zctzbl.xj.xx }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="警示上限（%）" >
                  <a-input-number :min="0" :max="100"  v-if="optType !== 'VIEW'" v-model="form.zctzbl.xj.sx"></a-input-number>
                  <span v-else>{{ form.zctzbl.xj.sx }}</span>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="13">
                <a-form-model-item label="固定受益类警示下限（%）" >
                  <a-input-number :min="0" :max="100"  v-if="optType !== 'VIEW'" v-model="form.zctzbl.gdsy.xx"></a-input-number>
                  <span v-else>{{ form.zctzbl.gdsy.xx }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="警示上限（%）" >
                  <a-input-number :min="0" :max="100"  v-if="optType !== 'VIEW'" v-model="form.zctzbl.gdsy.sx"></a-input-number>
                  <span v-else>{{ form.zctzbl.gdsy.sx }}</span>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="13">
                <a-form-model-item label="权益类警示下限（%）" >
                  <a-input-number :min="0" :max="100"  v-if="optType !== 'VIEW'" v-model="form.zctzbl.qy.xx"></a-input-number>
                  <span v-else>{{ form.zctzbl.qy.xx }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="警示上限（%）" >
                  <a-input-number :min="0" :max="100"  v-if="optType !== 'VIEW'" v-model="form.zctzbl.qy.sx"></a-input-number>
                  <span v-else>{{ form.zctzbl.qy.sx }}</span>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="13">
                <a-form-model-item label="另类警示下限（%）" >
                  <a-input-number :min="0" :max="100"  v-if="optType !== 'VIEW'" v-model="form.zctzbl.l.xx"></a-input-number>
                  <span v-else>{{ form.zctzbl.l.xx }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="警示上限（%）" >
                  <a-input-number :min="0" :max="100"  v-if="optType !== 'VIEW'" v-model="form.zctzbl.l.sx"></a-input-number>
                  <span v-else>{{ form.zctzbl.l.sx }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="限制描述" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                  <a-textarea v-if="optType !== 'VIEW'" class="no-resize" placeholder="请输入限制描述" v-model="form.zctzbl.memo" allowClear :rows="4"></a-textarea>
                  <span v-else>{{ form.zctzbl.memo }}</span>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-card>



          <a-card size="small" title="资产投资比例" style="margin-top: 15px" v-if="customizeEnv === 'zrt'">
            <span slot="extra" v-if="optType !== 'VIEW'">
              资产投资比例模版：<a-select style="width: 120px"></a-select>
            </span>
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-model-item label="固定收益类产品（含流动性管理产品）" :labelCol="{span: 10}" :wrapperCol="{span: 4}">
                  <a-input-number :min="0" :max="100"  v-if="optType !== 'VIEW'" v-model="form.zctzbl.xj.sx"></a-input-number>
                  <span v-else>{{ form.zctzbl.xj.sx }}</span>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-model-item label="中融国际信托有限公司及其子公司发行的评级为中风险及以下的权益类产品" :labelCol="{span: 10}" :wrapperCol="{span: 4}">
                  <a-input-number :min="0" :max="100"  v-if="optType !== 'VIEW'" v-model="form.zctzbl.xj.sx"></a-input-number>
                  <span v-else>{{ form.zctzbl.xj.sx }}</span>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-model-item label="中融国际信托有限公司及其子公司发行的评级为中高风险的权益类产品" :labelCol="{span: 10}" :wrapperCol="{span: 4}">
                  <a-input-number :min="0" :max="100"  v-if="optType !== 'VIEW'" v-model="form.zctzbl.xj.sx"></a-input-number>
                  <span v-else>{{ form.zctzbl.xj.sx }}</span>
                </a-form-model-item>
              </a-col>
            </a-row>

            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-model-item label="其他权益类产品" >
                  <a-input-number :min="0" :max="100"  v-if="optType !== 'VIEW'" v-model="form.zctzbl.xj.sx"></a-input-number>
                  <span v-else>{{ form.zctzbl.xj.sx }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="11">
                <a-form-model-item label="商品及金融衍生品类产品" >
                  <a-input-number :min="0" :max="100"  v-if="optType !== 'VIEW'" v-model="form.zctzbl.xj.sx"></a-input-number>
                  <span v-else>{{ form.zctzbl.xj.sx }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="5">
                <a-form-model-item label="混合类产品" >
                  <a-input-number :min="0" :max="100"  v-if="optType !== 'VIEW'" v-model="form.zctzbl.xj.sx"></a-input-number>
                  <span v-else>{{ form.zctzbl.xj.sx }}</span>
                </a-form-model-item>
              </a-col>
            </a-row>


            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-model-item label="其他资产" >
                  <a-input-number :min="0" :max="100"  v-if="optType !== 'VIEW'" v-model="form.zctzbl.xj.sx"></a-input-number>
                  <span v-else>{{ form.zctzbl.xj.sx }}</span>
                </a-form-model-item>
              </a-col>
            </a-row>
            
          </a-card>


          <a-card size="small" title="发行机构投资限制" style="margin-top: 15px">
            <a-col :span="24">
              <a-form-model-item label="只能投资" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                <a-select v-if="optType !== 'VIEW'" v-model="form.fxjg.zntz" mode="multiple">
                  <a-select-option v-for="item in getgetInvestmentRestrictionIssuerList" :key="item.orgId" :value="item.orgName">{{item.orgName}}</a-select-option>
                </a-select>
                <span v-else >{{ form.fxjg.zntz }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="不能投资" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                <a-select v-if="optType !== 'VIEW'" v-model="form.fxjg.bntz" mode="multiple">
                  <a-select-option v-for="item in getgetInvestmentRestrictionIssuerList" :key="item.orgId" :value="item.orgName">{{item.orgName}}</a-select-option>
                </a-select>
                <span v-else>{{ form.fxjg.bntz }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="限制描述" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                <a-textarea v-if="optType !== 'VIEW'" class="no-resize" placeholder="请输入限制描述" v-model="form.fxjg.memo" allowClear :rows="4"></a-textarea>
                <span v-else>{{ form.fxjg.memo }}</span>
              </a-form-model-item>
            </a-col>
          </a-card>

          <a-card size="small" title="单笔投资比例限制" style="margin-top: 15px">
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-model-item label="下限（%）">
                  <a-input-number :min="0" v-if="optType !== 'VIEW'" :max="100" v-model="form.dbtzbl.xx"/>
                  <span v-else>{{ form.dbtzbl.xx }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="上限（%）">
                  <a-input-number v-if="optType !== 'VIEW'" :min="0" :max="100" v-model="form.dbtzbl.sx"/>
                  <span v-else>{{ form.dbtzbl.sx }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="限制描述" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                  <a-textarea v-if="optType !== 'VIEW'" class="no-resize" placeholder="请输入限制描述" v-model="form.dbtzbl.memo" allowClear :rows="4"></a-textarea>
                  <span v-else>{{ form.dbtzbl.memo }}</span>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-card>

          <a-card size="small" title="单笔投资币种限制" style="margin-top: 15px">
            <a-row :gutter="24" v-for="(item, index) in form.dbtzbz.xz" :key="index">
              <a-col :span="7">
                <a-form-model-item label="币种">
                  <j-d-select-tag v-if="optType !== 'VIEW'" dict-code="CUR_CODE" v-model="form.dbtzbz.xz[index].bz"></j-d-select-tag>
                  <span v-else>{{ fdText('CUR_CODE', form.dbtzbz.xz[index].bz) }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="7">
                <a-form-model-item label="下限（%）">
                  <a-input-number v-if="optType !== 'VIEW'" :min="0" :max="100" v-model="form.dbtzbz.xz[index].xx"/>
                  <span v-else>{{ form.dbtzbz.xz[index].xx }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="7">
                <a-form-model-item label="上限（%）">
                  <a-input-number v-if="optType !== 'VIEW'" :min="0" :max="100" v-model="form.dbtzbz.xz[index].sx"/>
                  <span v-else>{{ form.dbtzbz.xz[index].sx }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="3">
                <a-button icon="delete" shape="circle" type="danger" ghost @click="delXz('dbtzbz',index)"></a-button>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <a-button v-if="optType !== 'VIEW'" style="width: 100%; margin-bottom: 30px" type="dashed" icon="plus" @click="addXz('dbtzbz','bz')">新增</a-button>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="限制描述" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                  <a-textarea v-if="optType !== 'VIEW'" class="no-resize" placeholder="请输入限制描述" v-model="form.dbtzbz.memo" allowClear :rows="4"></a-textarea>
                  <span v-else>{{ form.dbtzbz.memo }}</span>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-card>

          <a-card size="small" title="单个计划投资比例限制" style="margin-top: 15px">
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-model-item label="下限（%）">
                  <a-input-number :min="0" v-if="optType !== 'VIEW'" :max="100" v-model="form.dgjhtzbl.xx"/>
                  <span v-else>{{ form.dgjhtzbl.xx }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="上限（%）">
                  <a-input-number v-if="optType !== 'VIEW'" :min="0" :max="100" v-model="form.dgjhtzbl.sx"/>
                  <span v-else>{{ form.dgjhtzbl.sx }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="限制描述" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                  <a-textarea v-if="optType !== 'VIEW'" class="no-resize" placeholder="请输入限制描述" v-model="form.dgjhtzbl.memo" allowClear :rows="4"></a-textarea>
                  <span v-else>{{ form.dgjhtzbl.memo }}</span>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-card>

          <a-card size="small" title="占计划发行总规模比例" style="margin-top: 15px">
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-model-item label="下限（%）">
                  <a-input-number :min="0" v-if="optType !== 'VIEW'" :max="100" v-model="form.zjhfxzgmbl.xx"/>
                  <span v-else>{{ form.zjhfxzgmbl.xx }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="上限（%）">
                  <a-input-number v-if="optType !== 'VIEW'" :min="0" :max="100" v-model="form.zjhfxzgmbl.sx"/>
                  <span v-else>{{ form.zjhfxzgmbl.sx }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="限制描述" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                  <a-textarea v-if="optType !== 'VIEW'" class="no-resize" placeholder="请输入限制描述" v-model="form.zjhfxzgmbl.memo" allowClear :rows="4"></a-textarea>
                  <span v-else>{{ form.zjhfxzgmbl.memo }}</span>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-card>

          <a-card size="small" title="行业投资比例" style="margin-top: 15px">
            <a-row :gutter="24">
              <div v-for="(item, index) in form.hytzbl.xz" :key="index">
                <a-col :span="7">
                  <a-form-model-item label="行业">
                    <j-d-select-tag v-if="optType !== 'VIEW'" dict-code="IDS_TYPE" v-model="form.hytzbl.xz[index].hy"></j-d-select-tag>
                    <span v-else>{{ fdText('IDS_TYPE', form.hytzbl.xz[index].hy) }}</span>
                  </a-form-model-item>
                </a-col>
                <a-col :span="7">
                  <a-form-model-item label="下限（%）">
                    <a-input-number v-if="optType !== 'VIEW'" :min="0" :max="100" v-model="form.hytzbl.xz[index].xx"/>
                    <span v-else>{{ form.hytzbl.xz[index].xx }}</span>
                  </a-form-model-item>
                </a-col>
                <a-col :span="7">
                  <a-form-model-item label="上限（%）">
                    <a-input-number v-if="optType !== 'VIEW'" :min="0" :max="100" v-model="form.hytzbl.xz[index].sx"/>
                    <span v-else>{{ form.hytzbl.xz[index].sx }}</span>
                  </a-form-model-item>
                </a-col>
                <a-col :span="3">
                  <a-button icon="delete" shape="circle" type="danger" ghost @click="delXz('hytzbl',index)"></a-button>
                </a-col>
              </div>
              <a-col :span="24">
                <a-button v-if="optType !== 'VIEW'" style="width: 100%; margin-bottom: 30px" type="dashed" icon="plus" @click="addXz('hytzbl','hy')">新增</a-button>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-model-item label="限制描述" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                  <a-textarea v-if="optType !== 'VIEW'" class="no-resize" placeholder="请输入限制描述" v-model="form.hytzbl.memo" allowClear :rows="4"></a-textarea>
                  <span v-else>{{ form.hytzbl.memo }}</span>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-card>

          <a-card size="small" title="投资区域" style="margin-top: 15px">
            <a-row :gutter="24">
              <div v-for="(item, index) in form.tzqy.xz" :key="index">
                <a-col :span="7">
                  <a-form-model-item label="投资区域">
                    <j-d-select-tag v-if="optType !== 'VIEW'" dict-code="AREA_CODE" v-model="form.tzqy.xz[index].qy"></j-d-select-tag>
                    <span v-else>{{ fdText('AREA_CODE', form.tzqy.xz[index].qy) }}</span>
                  </a-form-model-item>
                </a-col>
                <a-col :span="7">
                  <a-form-model-item label="下限（%）">
                    <a-input-number v-if="optType !== 'VIEW'" :min="0" :max="100" v-model="form.tzqy.xz[index].xx"/>
                    <span v-else>{{ form.tzqy.xz[index].xx }}</span>
                  </a-form-model-item>
                </a-col>
                <a-col :span="7">
                  <a-form-model-item label="上限（%）">
                    <a-input-number v-if="optType !== 'VIEW'" :min="0" :max="100" v-model="form.tzqy.xz[index].sx"/>
                    <span v-else>{{ form.tzqy.xz[index].sx }}</span>
                  </a-form-model-item>
                </a-col>
                <a-col :span="3">
                  <a-button icon="delete" shape="circle" type="danger" ghost @click="delXz('tzqy',index)"></a-button>
                </a-col>
              </div>
              <a-col :span="24">
                <a-button v-if="optType !== 'VIEW'" style="width: 100%; margin-bottom: 30px" type="dashed" icon="plus" @click="addXz('tzqy','qy')">新增</a-button>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-model-item label="限制描述" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                  <a-textarea v-if="optType !== 'VIEW'" class="no-resize" placeholder="请输入限制描述" v-model="form.tzqy.memo" allowClear :rows="4"></a-textarea>
                  <span v-else>{{ form.tzqy.memo }}</span>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-card>

          <a-card size="small" title="投资币种" style="margin-top: 15px">
            <a-row :gutter="24">
              <div v-for="(item, index) in form.tzbz.xz" :key="index">
                <a-col :span="7">
                  <a-form-model-item label="币种">
                    <j-d-select-tag v-if="optType !== 'VIEW'" dict-code="CUR_CODE" v-model="form.tzbz.xz[index].bz"></j-d-select-tag>
                    <span v-else>{{ fdText('CUR_CODE', form.tzbz.xz[index].bz) }}</span>
                  </a-form-model-item>
                </a-col>
                <a-col :span="7">
                  <a-form-model-item label="下限（%）">
                    <a-input-number v-if="optType !== 'VIEW'" :min="0" :max="100" v-model="form.tzbz.xz[index].xx"/>
                    <span v-else>{{ form.tzbz.xz[index].xx }}</span>
                  </a-form-model-item>
                </a-col>
                <a-col :span="7">
                  <a-form-model-item label="上限（%）">
                    <a-input-number v-if="optType !== 'VIEW'" :min="0" :max="100" v-model="form.tzbz.xz[index].sx"/>
                    <span v-else>{{ form.tzbz.xz[index].sx }}</span>
                  </a-form-model-item>
                </a-col>
                <a-col :span="3">
                  <a-button icon="delete" shape="circle" type="danger" ghost @click="delXz('tzbz',index)"></a-button>
                </a-col>
              </div>
              <a-col :span="24">
                <a-button v-if="optType !== 'VIEW'" style="width: 100%; margin-bottom: 30px" type="dashed" icon="plus" @click="addXz('tzbz','bz')">新增</a-button>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-model-item label="限制描述" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                  <a-textarea v-if="optType !== 'VIEW'" class="no-resize" placeholder="请输入限制描述" v-model="form.tzbz.memo" allowClear :rows="4"></a-textarea>
                  <span v-else>{{ form.tzbz.memo }}</span>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-card>

          <a-card size="small" title="资产风险等级" style="margin-top: 15px">
            <a-row :gutter="24">
              <div v-for="(item, index) in form.zcfxdj.xz" :key="index">
                <a-col :span="7">
                  <a-form-model-item label="风险等级">
                    <j-d-select-tag v-if="optType !== 'VIEW'" dict-code="RISK_CODE" v-model="form.zcfxdj.xz[index].dj"></j-d-select-tag>
                    <span v-else>{{ fdText('RISK_CODE', form.zcfxdj.xz[index].dj) }}</span>
                  </a-form-model-item>
                </a-col>
                <a-col :span="7">
                  <a-form-model-item label="下限（%）">
                    <a-input-number v-if="optType !== 'VIEW'" :min="0" :max="100" v-model="form.zcfxdj.xz[index].xx"/>
                    <span v-else>{{ form.zcfxdj.xz[index].xx }}</span>
                  </a-form-model-item>
                </a-col>
                <a-col :span="7">
                  <a-form-model-item label="上限（%）">
                    <a-input-number v-if="optType !== 'VIEW'" :min="0" :max="100" v-model="form.zcfxdj.xz[index].sx"/>
                    <span v-else>{{ form.zcfxdj.xz[index].sx }}</span>
                  </a-form-model-item>
                </a-col>
                <a-col :span="3">
                  <a-button icon="delete" shape="circle" type="danger" ghost @click="delXz('zcfxdj',index)"></a-button>
                </a-col>
              </div>
              <a-col :span="24">
                <a-button v-if="optType !== 'VIEW'" style="width: 100%; margin-bottom: 30px" type="dashed" icon="plus" @click="addXz('zcfxdj','dj')">新增</a-button>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-model-item label="限制描述" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                  <a-textarea v-if="optType !== 'VIEW'" class="no-resize" placeholder="请输入限制描述" v-model="form.zcfxdj.memo" allowClear :rows="4"></a-textarea>
                  <span v-else>{{ form.zcfxdj.memo }}</span>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-card>

          <a-card size="small" title="融资主体评级" style="margin-top: 15px">
            <a-row :gutter="24">
              <a-form-model-item label="评级范围" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                <j-multi-select-tag v-if="optType !== 'VIEW'" dict-code="COMM_RANKS" v-model="form.rzztpj.fw"></j-multi-select-tag>
                <span v-else>{{ form.rzztpj.fw }}</span>
              </a-form-model-item>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-model-item label="下限（%）">
                  <a-input-number v-if="optType !== 'VIEW'" :min="0" :max="100" v-model="form.rzztpj.xx"/>
                  <span v-else>{{ form.rzztpj.xx }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="上限（%）">
                  <a-input-number v-if="optType !== 'VIEW'" :min="0" :max="100" v-model="form.rzztpj.sx"/>
                  <span v-else>{{ form.rzztpj.sx }}</span>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-model-item label="限制描述" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                  <a-textarea v-if="optType !== 'VIEW'" class="no-resize" placeholder="请输入限制描述" v-model="form.rzztpj.memo" allowClear :rows="4"></a-textarea>
                  <span v-else>{{ form.rzztpj.memo }}</span>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-card>

          <a-card size="small" title="担保主体评级" style="margin-top: 15px">
            <a-row :gutter="24">
              <a-form-model-item label="评级范围" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                <j-multi-select-tag v-if="optType !== 'VIEW'" dict-code="COMM_RANKS" v-model="form.dbztpj.fw"></j-multi-select-tag>
                <span v-else>{{ form.dbztpj.fw }}</span>
              </a-form-model-item>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-model-item label="下限（%）">
                  <a-input-number v-if="optType !== 'VIEW'" :min="0" :max="100" v-model="form.dbztpj.xx"/>
                  <span v-else>{{ form.dbztpj.xx }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="上限（%）">
                  <a-input-number v-if="optType !== 'VIEW'" :min="0" :max="100" v-model="form.dbztpj.sx"/>
                  <span v-else>{{ form.dbztpj.sx }}</span>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-model-item label="限制描述" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                  <a-textarea v-if="optType !== 'VIEW'" class="no-resize" placeholder="请输入限制描述" v-model="form.dbztpj.memo" allowClear :rows="4"></a-textarea>
                  <span v-else>{{ form.dbztpj.memo }}</span>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-card>

          <a-card size="small" title="债项评级/产品评级" style="margin-top: 15px">
            <a-row :gutter="24">
              <a-form-model-item label="长期债券评级范围" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
                <j-multi-select-tag v-if="optType !== 'VIEW'" dict-code="COMM_RANKS" v-model="form.cqzqpj.fw"></j-multi-select-tag>
                <span v-else>{{ form.cqzqpj.fw }}</span>
              </a-form-model-item>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="10">
                <a-form-model-item label="长期债券下限（%）">
                  <a-input-number v-if="optType !== 'VIEW'" :min="0" :max="100" v-model="form.cqzqpj.xx"/>
                  <span v-else>{{ form.cqzqpj.xx }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="10">
                <a-form-model-item label="长期债券上限（%）">
                  <a-input-number v-if="optType !== 'VIEW'" :min="0" :max="100" v-model="form.cqzqpj.sx"/>
                  <span v-else>{{ form.cqzqpj.sx }}</span>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-form-model-item label="短期债券评级范围" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
                <j-multi-select-tag v-if="optType !== 'VIEW'" dict-code="COMM_RANKS" v-model="form.dqzqpj.fw"></j-multi-select-tag>
                <span v-else>{{ form.dqzqpj.fw }}</span>
              </a-form-model-item>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="10">
                <a-form-model-item label="短期债券下限（%）">
                  <a-input-number v-if="optType !== 'VIEW'" :min="0" :max="100" v-model="form.dqzqpj.xx"/>
                  <span v-else>{{ form.dqzqpj.xx }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="10">
                <a-form-model-item label="短期债券上限（%）">
                  <a-input-number v-if="optType !== 'VIEW'" :min="0" :max="100" v-model="form.dqzqpj.sx"/>
                  <span v-else>{{ form.dqzqpj.sx }}</span>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-model-item label="限制描述" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                  <a-textarea v-if="optType !== 'VIEW'" class="no-resize" placeholder="请输入限制描述" v-model="form.dqzqpj.memo" allowClear :rows="4"></a-textarea>
                  <span v-else>{{ form.zxcppj.memo }}</span>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-card>

          <a-card size="small" title="预警止损线" style="margin-top: 15px">
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-model-item label="预警线">
                  <a-input-number v-if="optType !== 'VIEW'" :min="0" :max="999999999999" v-model="form.yjzs.xx"/>
                  <span v-else>{{ form.yjzs.xx }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="止损线">
                  <a-input-number v-if="optType !== 'VIEW'" :min="0" :max="999999999999" v-model="form.yjzs.sx"/>
                  <span v-else>{{ form.yjzs.sx }}</span>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-model-item label="限制描述" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                  <a-textarea v-if="optType !== 'VIEW'" class="no-resize" placeholder="请输入限制描述" v-model="form.yjzs.memo" allowClear :rows="4"></a-textarea>
                  <span v-else>{{ form.yjzs.memo }}</span>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-card>

          <a-card size="small" title="附件" style="margin-top: 15px">
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-item label="文件上传">
                  <a-upload :fileList="form.files" :multiple="true" :remove="handleRemove" :beforeUpload="beforeUpload">
                    <a-button v-if="optType !== 'VIEW'"> <a-icon type="upload"></a-icon> 选择 </a-button>
                  </a-upload>
                </a-form-item>
              </a-col>
            </a-row>
          </a-card>
        </a-form-model>
        <WkfNextUserModal ref="wkfUserForm" @complete="wkfUserComplete" />
      </a-spin>
    </a-layout-content>
    <!--foot !== '1' 表示在审核页面查看-->
    <a-layout-footer v-if=" foot !== '1'" :style="{ textAlign: 'center', backgroundColor:'#ffffff',position: 'fixed', zIndex: 1, width: footWidth ,bottom:'1px', border:'solid 1px rgb(232,232,232)'}">
      <a-button type="primary" :disabled="status==='ADTING'" @click="handleSave" v-if="optType !== 'VIEW' &&status!=='ADTING'">提交<span v-if="prjStatus==='R'">审核</span></a-button>
      <!--:va="va" va='1'表示隐藏掉子组件中的返回按钮   项目视图中查看子账户信息专用-->
      <a-button v-if="va !== '1'" @click="handleBack" style="margin-left: 15px;">返回</a-button>
    </a-layout-footer>
  </a-layout>
</template>

<script>
  import JDSelectTag from '../../../components/dict/JDSelectTag'
  import { filterDictText } from '../../../components/dict/JDictSelectUtil'
  import JMultiSelectTag from '../../../components/dict/JMultiSelectTag'
  import { getAction, httpActionWF, postAction } from '../../../api/manage'
  import WkfNextUserModal from '../../activiti/modules/WkfNextUserModal'
  import * as customizeConfigs from '../../../customizeConfig'
  export default {
    name: 'SubAccInvLmt',
    components: {
      JMultiSelectTag,
      JDSelectTag,
      WkfNextUserModal
      //components here
    },
    inject: [ "psToPage" ],
    props:{
      optType:'',
      prjCode:'',
      accNo:'',
      va:'',
      status:'',
      prjStatus:'',
      foot:''
    },
    computed: {
      currUrl: function() {
        return this.$route.query.prjCode+this.$route.query.accNo+this.$route.query.prjCode;
      }
    },
    watch:{
      currUrl(){
        this.initPage();
      },
      accNo(val){
        if (val!=''){
          this.initPage();
          // this.finPrj()
        }
      }
    },
    data() {
      let customizeEnv = customizeConfigs.customizeEnv
      let xz = {
        xz:[],
        memo:''
      };
      return {
        customizeEnv: customizeEnv,
        loading:false,
        investmentRestrictionTemplateList:[],
        getgetInvestmentRestrictionIssuerList:[],
        form:{
          zctzbl:{xj:{},gdsy:{},qy:{},l:{},memo:''},
          fxjg:{zntz:[],bntz:[],memo:''},
          dbtzbl:{},
          dbtzbz:{xz:[],memo:''},
          dgjhtzbl:{},
          zjhfxzgmbl:{},
          hytzbl:{xz:[],memo:''},
          tzqy:{xz:[],memo:''},
          tzbz:{xz:[],memo:''},
          zcfxdj:{xz:[],memo:''},
          rzztpj:{},
          dbztpj:{},
          cqzqpj:{},
          dqzqpj:{},
          zxcppj:{},
          yjzs:{xx:0,sx:0,memo:''},
          files:[]
        },
        url:{
          save:'/subacc/limit/save',
          find:'/subacc/getInvLimit',
          upload: "/sys/common/biUpload"
        },
        footWidth:'500px',
        orgType:'PS',
        pageNo:1,
        pageSize:999
        
      }
    },
    created() {
      this.getInvestmentRestrictionTemplateInfo();
      this.getgetInvestmentRestrictionIssuerInfo();
      if (this.accNo!=''){
        this.initPage();
      }
      
    },
    mounted() {
      this.footWidth = this.$refs.iContent.$el.offsetWidth+'px';
    },
    methods: {
      // 获取投资限制模板信息
      getInvestmentRestrictionTemplateInfo(){
         getAction("/proAssetCombinations/list","").then((res)=>{
           this.investmentRestrictionTemplateList = res.result.records;
          //  console.log("模板信息={}",this.investmentRestrictionTemplateList);
         })
      },
      // 获取发行机构投资限制信息
      getgetInvestmentRestrictionIssuerInfo(){
        getAction("/baseline/coopOrgan/queryAdmOrganInfo",{orgType:this.orgType,pageNo:this.pageNo,pageSize:this.pageSize}).then((res)=>{
           this.getgetInvestmentRestrictionIssuerList = res.result.records;
        })
      },
      initPage(){
        let deepVal = function(o,v){
          if(Object.keys(o).length>0){
            for(let k in o){
              if(v[k]){
                if(typeof(o[k] === 'object')){
                  if (o[k].constructor === Array) {
                    o[k] = v[k];
                  }else{
                    o[k] = deepVal(o[k], v[k]);
                  }
                }else{
                  o[k] = v[k];
                }
              }
            }
          }else{
            if(v){
              o=v;
            }
          }
          return o;
        }
        this.loading = true;
        postAction(this.url.find, { accNo:this.accNo }).then((res)=>{
          if(res.success){
            this.loading = false;
            if(res.result.files){
              res.result.files.forEach((file)=>{
                file.uid = file.id;
                file.name = file.fileName;
                file.status = 'done';
                file.response = '{"status": "success"}';
                file.url = window._CONFIG['domianURL']+"/sys/common/static/" + file.filePath;
              });
            }
            deepVal(this.form, res.result);
          }else{
            this.$message.error(res.message);
            this.loading = false;
          }
        });
      },
      /*async finPrj(){
        postAction('/subacc/find', { accNo: this.accNo, id:''}).then((res)=>{
          if(res.success){
            this.form.status = res.result.status;
          }else{
            this.$message.error(res.message);
          }
        }).catch(function(error){
          this.$message.error('数据加载失败！');
        }).finally(() => {
          this.loading = false;
        });

        postAction('/prj/findByPrjCode', { cli:{prjCode: this.prjCode}}).then((res)=>{
          if(res.success){
            console.log('cli===',res);
            this.form.prjStatus = res.result.cli.prjStatus;
          }else{
            this.$message.error(res.message);
          }
        }).catch(function(error){
          this.$message.error('数据加载失败！');
        }).finally(() => {
          this.loading = false;
        });
      },*/
      wkfUserComplete(){
        this.psToPage('prj/SubAccount', {optType: 'VIEW', prjCode: this.prjCode, accNo: this.accNo});
      },
      handleBack(){
        this.psToPage('prj/SubAccountList', {});
      },
      fdText(o,v){
        return filterDictText(this.dictOptionsData[o],v);
      },
      addXz(v,b){
        let bo = {xx:0,sx:0};
        bo[b]='';
        this.form[v].xz.push(bo);
      },
      delXz(v,index){
        this.form[v].xz.splice(index,1);
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
        }else{
          return false;
        }
      },
      handleSave(){
        if(this.form.zctzbl.xj.xx>this.form.zctzbl.xj.sx){
          this.$message.error('现金类警示下限不能大于上限');
          return
        }
        if(this.form.zctzbl.gdsy.xx>this.form.zctzbl.gdsy.sx){
          this.$message.error('固定受益类警示下限不能大于上限');
          return
        }
        if(this.form.zctzbl.qy.xx>this.form.zctzbl.qy.sx){
          this.$message.error('权益类警示下限不能大于上限');
          return
        }
        if(this.form.zctzbl.l.xx>this.form.zctzbl.l.sx){
          this.$message.error('另类警示下限不能大于上限');
          return
        }
        if(this.form.dbtzbl.xx>this.form.dbtzbl.sx){
          this.$message.error('单笔投资比例下限不能大于上限');
          return
        }
        for(var i=0;i<this.form.dbtzbz.xz.length;i++){
          if(this.form.dbtzbz.xz[i].xx>this.form.dbtzbz.xz[i].sx){
            this.$message.error('单笔投资币种限制下限不能大于上限');
            return
          }
        }
        if(this.form.dgjhtzbl.xx>this.form.dgjhtzbl.sx){
          this.$message.error('单个计划投资比例下限不能大于上限');
          return
        }
        if(this.form.zjhfxzgmbl.xx>this.form.zjhfxzgmbl.sx){
          this.$message.error('占计划发行总规模比例下限不能大于上限');
          return
        }
        for(var i=0;i<this.form.hytzbl.xz.length;i++){
          if(this.form.hytzbl.xz[i].xx>this.form.hytzbl.xz[i].sx){
            this.$message.error('行业投资比例下限不能大于上限');
            return
          }
        }
        for(var i=0;i<this.form.tzqy.xz.length;i++){
          if(this.form.tzqy.xz[i].xx>this.form.tzqy.xz[i].sx){
            this.$message.error('投资区域下限不能大于上限');
            return
          }
        }
        for(var i=0;i<this.form.tzbz.xz.length;i++){
          if(this.form.tzbz.xz[i].xx>this.form.tzbz.xz[i].sx){
            this.$message.error('投资币种下限不能大于上限');
            return
          }
        }
        for(var i=0;i<this.form.zcfxdj.xz.length;i++){
          if(this.form.zcfxdj.xz[i].xx>this.form.zcfxdj.xz[i].sx){
            this.$message.error('资产风险等级下限不能大于上限');
            return
          }
        }
        if(this.form.rzztpj.xx>this.form.rzztpj.sx){
          this.$message.error('融资主体评级下限不能大于上限');
          return
        }

        if(this.form.cqzqpj.xx>this.form.cqzqpj.sx){
          this.$message.error('长期债券下限不能大于上限');
          return
        }
        if(this.form.dbztpj.xx>this.form.dbztpj.sx){
          this.$message.error('担保主体评级下限不能大于上限');
          return
        }
        if(this.form.dqzqpj.xx>this.form.dqzqpj.sx){
          this.$message.error('短期债券下限不能大于上限');
          return
        }
        let that = this;
        that.loading = true;
        that.form.accNo = that.accNo;
        that.form.prjCode = that.prjCode;
        postAction(that.url.save, that.form).then((res)=>{
          if(res.success){
            const filesNeed2Upload = that.form.files.filter(file => file.id === undefined);
            if(filesNeed2Upload.length>0){
              const formData = new FormData();
              formData.append("module","SUBACC_INVLMT");
              formData.append("dataId", that.accNo);
              filesNeed2Upload.forEach(file => {
                formData.append('files', file);
              });
              httpActionWF(that.url.upload, formData).then((res)=>{
                if(res.success){
                  //项目已成立，走审核
                  if(that.prjStatus==='R'){
                    //发起审核 审核单选择审核人
                    if (res.result.processId) {
                      this.$refs.wkfUserForm.edit(res.result.processId);
                      this.$refs.wkfUserForm.disableSubmit = false;
                    }
                  }else{
                    that.$message.success('保存成功！');
                  }

                }else{
                  that.$message.error(res.message);
                }
              }).catch(function(error){
                that.$message.error('文件上传失败，请稍后重新上传，注意文件大小不可超过10M');
              }).finally(() => {
                that.loading = false;
              });
            }else{
              //项目已成立，走审核
              if(that.prjStatus==='R'){
                //发起审核 审核单选择审核人
                if (res.result.processId) {
                  this.$refs.wkfUserForm.edit(res.result.processId);
                  this.$refs.wkfUserForm.disableSubmit = false;
                }
              }else{
                that.$message.success('保存成功！');
              }
              that.loading = false;
            }
          }else{
            that.$message.error(res.message);
            that.loading = false;
          }
        });
      }
    }
  }
</script>

<style scoped>
  @import '~@assets/less/common.less'
</style>