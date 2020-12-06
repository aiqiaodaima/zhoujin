<template>
  <div style="background: rgb(240, 242, 245)">
    <a-spin :spinning="loading">
      <!-- :rules="rules" -->
      <a-form-model
        ref="assetForm"
        :model="form"
        :rules="rules"
        :label-col="{ span: 9 }"
        :wrapper-col="{ span: 15 }"
      >
        <a-layout>
          <a-layout-content>
            <a-card size="small" title="基本信息" :bordered="false">
              <a-row :gutter="24">
                <a-col :span="8">
                  <!-- 需提供合同文本编号有点疑惑，数据带入还是input -->
                  <a-form-model-item label="合同编号" prop="cpactno">
                    <a-input id="cpactno" placeholder="请输入合同编号" v-model="form.cpactno" :disabled="isPrjSetup">  </a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                    <a-form-model-item label="合同规范全称" prop="cpactname">
                      <a-input id="cpactname" placeholder="请输入合同规范全称" v-model="form.cpactname" :disabled="isPrjSetup">  </a-input>
                    </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <!--prop="cprojcode" 这个放上面还是下面有疑惑 放上面下面都可以不会报错  下拉显示项目名称，选中时候 是编号-->
                    <a-form-model-item label="项目编号" prop="cprojcode">
                       <a-select id="cprojcode" v-model="form.cprojcode" >
                          <a-select-option v-for="item in cprojcodeList" :key="item.PRJ_CODE " :value="item.PRJ_CODE">
                                {{item.ACC_NAME}}
                          </a-select-option>
                        </a-select>
                    </a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-model-item label="被投标的编号" prop="cassetno">
                    <!-- cassetnoList -->
                    <!-- 在这里弄个change事件监听选择回来的proCode 注意这里 -->
                        <a-select id="cassetno" v-model="form.cassetno" @change="handleChange">
                          <a-select-option v-for="item in cassetnoList" :key="item.proCode " :value="item.proCode">
                                {{item.proName}}
                          </a-select-option>
                        </a-select>

                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="投资标的最新评估日期" prop="dTargetsAssessDate">
                    <j-date
                      id="dTargetsAssessDate"
                      placeholder="请选择投资标的最新评估日期"
                      v-model="form.dTargetsAssessDate"
                      style="width: 100%"
                    ></j-date>
                  </a-form-model-item>
                </a-col>
              <a-col :span="8">
                <a-form-model-item label="是否回购" >
                  <j-d-select-tag id="crepurchaseflag" v-model="form.crepurchaseflag" dict-code="y_n ">
                  </j-d-select-tag>
                </a-form-model-item>
              </a-col>
            </a-row>
              <a-row :gutter="24">

                <a-col :span="8">
                  <a-form-model-item label="投资项目编号" prop="cinvestcode">
                    <a-input id="cinvestcode" placeholder="请输入投资项目编号" v-model="form.cinvestcode"  :disabled="isPrjSetup"></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="关联产品代码" prop="cFundCode">
                    <a-input id="cFundCode" placeholder="请输入关联产品代码" v-model="form.cFundCode" :disabled="isPrjSetup">  </a-input>
                  </a-form-model-item>
                </a-col>
<!-- 交易对手ID   下拉选择对应产品的管理机构----- -->
                <a-col :span="8">
                    <a-form-model-item label="交易对手ID" prop="crivalid">
                      <a-input id="crivalid" placeholder="请输入交易对手ID" v-model="form.crivalid" :disabled="isPrjSetup">  </a-input>
                    </a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="8">
                    <a-form-model-item label="合同性质" prop="cpactprop">
                      <j-d-select-tag id="cpactprop" v-model="form.cpactprop" :disabled="isPrjSetup" dict-code="contract_nature">
                      </j-d-select-tag>
                    </a-form-model-item>
                </a-col>
                <a-col :span="8">
                    <a-form-model-item label="投融资标志" prop="lifflag">
                      <j-d-select-tag id="lifflag" v-model="form.lifflag" :disabled="isPrjSetup" dict-code="Investment_financing_mark">
                      </j-d-select-tag>
                    </a-form-model-item>
                </a-col>
                <a-col :span="8">
                    <a-form-model-item label="业务种类" prop="cbtype">
                      <j-d-select-tag id="cbtype" v-model="form.cbtype" :disabled="isPrjSetup" dict-code="business_lines">
                      </j-d-select-tag>
                    </a-form-model-item>
                </a-col>
              </a-row>

              <a-row :gutter="24">
                <a-col :span="8">
                    <a-form-model-item label="业务扩展分类" prop="cetype">
                      <j-d-select-tag id="cetype" v-model="form.cetype" :disabled="isPrjSetup" dict-code="business_extend_lines">
                      </j-d-select-tag>
                    </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="合同签订日期" prop="dsdate">
                    <j-date
                      id="dsdate"
                      placeholder="请选择合同签订日期"
                      date-format="YYYY-MM-DD"
                      v-model="form.dsdate"
                      style="width: 100%"
                    ></j-date>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="合同开始日期" prop="dbdate">
                    <j-date
                      id="dbdate"
                      placeholder="请选择开始日期"
                      date-format="YYYY-MM-DD"
                      v-model="form.dbdate"
                      style="width: 100%"
                    ></j-date>
                  </a-form-model-item>
                </a-col>
              </a-row>
<!-- 日期 -->
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-model-item label="合同到期日期" prop="dedate">
                    <j-date
                      id="dedate"
                      placeholder="请选择合同到期日期"
                      date-format="YYYY-MM-DD"
                      v-model="form.dedate"
                      style="width: 100%"
                    ></j-date>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="合同签订金额" prop="famount">
                    <a-input id="famount" placeholder="请输入合同签订金额" v-model="form.famount"  :disabled="isPrjSetup"></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="利率类别" prop="cratetype">
                    <j-d-select-tag id="cratetype" v-model="form.cratetype" :disabled="isPrjSetup" dict-code="rate_category">
                    </j-d-select-tag>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-model-item label="合同签约利率" prop="ffprate">
                    <a-input id="ffprate" placeholder="请输入合同签约利率" v-model="form.ffprate"  :disabled="isPrjSetup"></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="综合融资成本" prop="fcfcosts">
                    <a-input id="fcfcosts" placeholder="请输入综合融资成本" v-model="form.fcfcosts"  :disabled="isPrjSetup"></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="投向行业" prop="lindustry">
                    <j-d-select-tag id="lindustry" v-model="form.lindustry" :disabled="isPrjSetup" dict-code="tothe_industry">
                    </j-d-select-tag>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-model-item label="行业明细" prop="cindustrydtl">
                    <j-d-select-tag id="cindustrydtl" v-model="form.cindustrydtl" :disabled="isPrjSetup" dict-code="industry_detail">
                    </j-d-select-tag>
                  </a-form-model-item>
                </a-col>

                <a-col :span="8">
<!-- 地区联动 -->
                    <!-- <j-d-select-tag id="careacode" v-model="form.careacode" :disabled="isPrjSetup" dict-code="">
                    </j-d-select-tag> -->
                  <BiFormItemCascader label="资金运用地区" :needCountry='false' v-model="areas"  prop="careacode"/>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="资金运用方式" prop="ccapuseway">
                    <j-d-select-tag id="ccapuseway" v-model="form.ccapuseway" :disabled="isPrjSetup" dict-code="capital_operation_way">
                    </j-d-select-tag>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-model-item label="项目投入分类" prop="cinvesttype">
                    <j-d-select-tag id="cinvesttype" v-model="form.cinvesttype" :disabled="isPrjSetup" dict-code="project_input_classify">
                    </j-d-select-tag>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="资金用途说明" prop="cfunduseof">
                    <a-input id="cfunduseof" placeholder="请输入资金用途说明" v-model="form.cfunduseof"  :disabled="isPrjSetup"></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="退出方式" prop="cexitmode">
                    <j-d-select-tag id="cexitmode" v-model="form.cexitmode" :disabled="isPrjSetup" dict-code="quit_way">
                    </j-d-select-tag>
                  </a-form-model-item>
                </a-col>

              </a-row>
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-model-item label="提前终止" prop="lallowstop">
                    <j-d-select-tag id="lallowstop" v-model="form.lallowstop" :disabled="isPrjSetup" dict-code="early_termination">
                    </j-d-select-tag>
                  </a-form-model-item>
                </a-col>
<!-- 无字典是否的都用了字典的方式 -->
                <a-col :span="8">
                  <a-form-model-item label="是否TOT" prop="cistot">
                    <j-d-select-tag id="cistot" v-model="form.cistot" :disabled="isPrjSetup" dict-code="y_n">
                    </j-d-select-tag>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="资产五级分类" prop="lassetclass5">
                    <j-d-select-tag id="lassetclass5" v-model="form.lassetclass5" :disabled="isPrjSetup" dict-code="property_classify   ">
                    </j-d-select-tag>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
               <a-col :span="8">
                  <a-form-model-item label="资产四级分类" prop="lassetclass4">
                    <j-d-select-tag id="lassetclass4" v-model="form.lassetclass4" :disabled="isPrjSetup" dict-code="property_classify   ">
                    </j-d-select-tag>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="关联合同ID" prop="clinkpactid">
                    <a-input id="clinkpactid" placeholder="请输入投资项目编号" v-model="form.clinkpactid"  :disabled="isPrjSetup"></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="合同状态" prop="lstate">
                    <j-d-select-tag id="lstate" v-model="form.lstate" :disabled="isPrjSetup" dict-code="L_STATE">
                    </j-d-select-tag>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
               <a-col :span="8">
                  <a-form-model-item label="信托交易种类" >
                    <j-d-select-tag id="laffltradetype" v-model="form.laffltradetype" dict-code="transaction_types   ">
                    </j-d-select-tag>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="数据确认日期" >
                    <j-date
                      id="dqrdate"
                      placeholder="请选择数据确认日期"
                      v-model="form.dqrdate"
                      style="width: 100%"
                    ></j-date>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="备注">
                    <a-input id="cremark" placeholder="请输入备注" v-model="form.cremark" ></a-input>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-model-item label="评估周期">
                    <j-d-select-tag id="cevaluateCycle" v-model="form.cevaluateCycle" dict-code="evaluation_period">
                    </j-d-select-tag>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="评估日期" >
                    <j-date
                      id="dEvaluateDate"
                      placeholder="请选择数据确认日期"
                      v-model="form.dEvaluateDate"
                      style="width: 100%"
                    ></j-date>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="成本是否含税" >
                    <j-d-select-tag id="crivalcostTax" v-model="form.crivalcostTax" dict-code="y_n">
                    </j-d-select-tag>
                  </a-form-model-item>
                </a-col>
              </a-row>

            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-model-item label="成本率类型">
                  <j-d-select-tag id="crivalcosttaxType" v-model="form.crivalcosttaxType" dict-code="cost_rate_type ">
                  </j-d-select-tag>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="合伙净资产">
                  <a-input id="fpartnerassetBalance" placeholder="请输入估值价值" v-model="form.fpartnerassetBalance" ></a-input>
                </a-form-model-item>
              </a-col>
                <a-col :span="8">
                  <a-form-model-item label="估值价值">
                    <a-input id="fgzValue" placeholder="请输入估值价值" v-model="form.fgzValue" ></a-input>
                  </a-form-model-item>
                </a-col>
              <a-col :span="8">
                <a-form-model-item label="保证金（资金归集）到位履约情况" >
                  <j-d-select-tag id="cbzStatus" v-model="form.cbzStatus" dict-code="performance_condition ">
                  </j-d-select-tag>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-model-item label="信托项目兑付资金来源" >
                  <j-d-select-tag id="ccashSource" v-model="form.ccashSource" dict-code="cash_fund_source ">
                  </j-d-select-tag>
                </a-form-model-item>
              </a-col>
                <a-col :span="8">
                  <a-form-model-item label="基础资产期末余额" >
                    <a-input id="flastBasebalance" placeholder="请输入基础资产期末余额" v-model="form.flastBasebalance" ></a-input>
                  </a-form-model-item>
                </a-col>
              <a-col :span="8">
                <a-form-model-item label="是否聘请投资顾问" >
                  <j-d-select-tag id="cisHireconsultant" v-model="form.cisHireconsultant" dict-code="y_n ">
                  </j-d-select-tag>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-model-item label="是否有保证金" >
                  <j-d-select-tag id="cisBzbalance" v-model="form.cisBzbalance" dict-code="y_n ">
                  </j-d-select-tag>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="是否投向本公司产品" >
                  <j-d-select-tag id="cisinvestcomfund" v-model="form.cisinvestcomfund" dict-code="y_n ">
                  </j-d-select-tag>
                </a-form-model-item>
              </a-col>
                <a-col :span="8">
                  <a-form-model-item label="被投本公司产品编号" >
                    <a-input id="ctocomprojectcode" placeholder="请输入被投本公司产品编号" v-model="form.ctocomprojectcode" ></a-input>
                  </a-form-model-item>
                </a-col>

            </a-row>
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-model-item label="回购方" >
                  <a-input id="crepurchaser" placeholder="请填写回购方" v-model="form.crepurchaser" ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="回购是否有担保" >
                  <j-d-select-tag id="crepurchaseassureflag" v-model="form.crepurchaseassureflag" dict-code="y_n ">
                  </j-d-select-tag>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="基础资产类型" >
                  <a-input id="cassettype" placeholder="请输入基础资产类型" v-model="form.cassettype" ></a-input>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-model-item label="是否在基金协会备案" >
                  <j-d-select-tag id="cisassociationflag" v-model="form.cisassociationflag" dict-code="y_n ">
                  </j-d-select-tag>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="投资标的最新评估价值" >
                  <a-input id="fevaluationbalance" placeholder="请输入投资标的最新评估价值" v-model="form.fevaluationbalance" ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="股权出让方" >
                  <a-input id="cgqcrfid" placeholder="请输入股权出让方" v-model="form.cgqcrfid" ></a-input>
                </a-form-model-item>
              </a-col>
            </a-row>

            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-model-item label="代偿方" >
                  <a-input id="cIndemnifierid" placeholder="请输入代偿方" v-model="form.cIndemnifierid" ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="是否固定资产投资" >
                  <j-d-select-tag id="cisfixedassets" v-model="form.cisfixedassets" dict-code="y_n ">
                  </j-d-select-tag>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="是否发生借新还旧" >
                  <j-d-select-tag id="crefinancingflag" v-model="form.crefinancingflag" dict-code="y_n ">
                  </j-d-select-tag>
                </a-form-model-item>
              </a-col>
            </a-row>

            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-model-item label="数据日期" >
                  <j-date
                    id="ddatadate"
                    placeholder="请选择数据日期"
                    v-model="form.ddatadate"
                    style="width: 100%"
                  ></j-date>
                </a-form-model-item>
              </a-col>
<!-- 字典无   -->
              <a-col :span="8">
                <a-form-model-item label="数据来源" >
                  <!-- <j-d-select-tag id="csourceno" v-model="form.csourceno" dict-code=" ">
                  </j-d-select-tag> -->
                   <a-input id="csourceno" placeholder="请输入行标识" v-model="form.csourceno" ></a-input>
                </a-form-model-item>
              </a-col>
<!-- 字典无 -->
              <a-col :span="8">
                <a-form-model-item label="行标识" >
                  <!-- <j-d-select-tag id="crowflag" v-model="form.crowflag" dict-code=" ">
                  </j-d-select-tag> -->
                  <a-input id="crowflag" placeholder="请输入行标识" v-model="form.crowflag" ></a-input>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
<!-- 字典无数据是那里来的？ -->
              <a-col :span="8">
                <a-form-model-item label="采集标志" >
                  <!-- <j-d-select-tag id="lcollflag" v-model="form.lcollflag" dict-code=" ">
                  </j-d-select-tag> -->
                  <a-input id="lcollflag" placeholder="请输入采集标志" v-model="form.lcollflag" ></a-input>
                </a-form-model-item>
              </a-col>
<!-- 字典无数据是那里来的？ -->
             <a-col :span="8">
                <a-form-model-item label="维护标志" >
                  <!-- <j-d-select-tag id="lmodiflag" v-model="form.lmodiflag" dict-code=" ">
                  </j-d-select-tag> -->
                  <a-input id="lmodiflag" placeholder="请输入维护标志" v-model="form.lmodiflag" ></a-input>
                </a-form-model-item>
              </a-col>
<!-- 字典无数据是那里来的？ -->
              <a-col :span="8">
                <a-form-model-item label="更新人" >
                  <a-input id="cmodiman" placeholder="请输入更新人" v-model="form.cmodiman" ></a-input>
                </a-form-model-item>
              </a-col>
            </a-row>
            </a-card>
          </a-layout-content>

          <!-- <a-layout-footer>

          </a-layout-footer> -->
        </a-layout>
      </a-form-model>
    </a-spin>
  </div>
</template>
<script>
  import moment from 'moment'
  import dictMixin from '@mixins/dictMixin'
  import JDate from '@comp/jeecg/JDate'
  import JDSelectTag from '@comp/dict/JDSelectTag'
  import { getAction, postAction } from '@api/manage'
  // import JMultiSelectTag from '../../components/dict/JMultiSelectTag'

  export default {
    name:'InvestmentContractManageModel',
    components: {
      JDSelectTag,
      JDate,
      // JMultiSelectTag,
    },
    // inject: ['closeCurrent'],
    mixins: [dictMixin],
    props: {
      optType: {
        default: 'add'
      },
      id: {
        default: ''
      }
    },
    data() {
      let form = {//表单对象
          // cPactId:'',
          cpactno:'',
          cpactname:'',
          cprojcode:'',
          // cprojcode:[],
          cinvestcode:'',//投资项目编号
          cFundCode:'',
          crivalid:'',
          cpactprop:'',
          lifflag:0,  //投融资标志
          lfFlag:'',
          cBtype:'',
          cetype:'',//业务扩展分类
          dsdate:'',
          dbdate:'',
          dedate:'',//合同到期日期
          famount:0,//合同签订金额
          cratetype:'',
          ffprate:0,//合同签约利率
          fcfcosts:0,//综合融资成本
          lindustry:0,//投向行业
          cindustrydtl:'',//行业明细
          // careacode:[],//资金运用地区省市区---是否为数组
          ccapuseway:'',
          cinvesttype:'',//项目投入分类
          cfunduseof:'',
          cexitmode:'',
          lallowstop:0,//提前终止
          cistot:'',
          lassetclass5:0,
          lassetclass4:0,//资产四级分类
          clinkpactid:'',
          lstate:0,//合同状态
          laffltradetype:0,//信托交易种类
          dqrdate:'',
          cremark:'',
          cevaluateCycle:'',//评估周期
          dEvaluateDate:'',
          crivalcostTax:'',
          crivalcosttaxType:'',//成本率类型
          fpartnerassetBalance:0,//合伙净资产
          fgzValue:0,//估值价值
          cbzStatus:'',
          ccashSource:'',
          flastBasebalance:0,//基础资产期末余额
          cisHireconsultant:'',
          cisBzbalance:'',
          cisinvestcomfund:'',
          ctocomprojectcode:'',//被投本公司产品编号
          cassetno:'',//被投标的编号
          dTargetsAssessDate:'',
          crepurchaseflag:'',
          crepurchaser:'', // 回购方
          crepurchaseassureflag:'',
          cassettype:'',
          cisassociationflag:'',
          fevaluationbalance:0,//投资标的最新评估价值
          cgqcrfid:'',
          cIndemnifierid:'',
          cisfixedassets:'',
          crefinancingflag:'',
          ddatadate:'',
          csourceno:'',
          crowflag:'',
          lcollflag:'',
          lmodiflag:'',
          cmodiman:''//更新人

      }
      let ruleReq = [{ required: true, message: '必输字段', trigger: ['change', 'blur'] }]
      let r = {}
      let xx = Object.keys(form)
        for (let i = 0; i < xx.length; i++) {
            r[xx[i]] = ruleReq
        }
      console.log(r)
      return {
        cprojcodeList:[],// 1.写数组接收项目编号
        cassetnoList:[],//被投标的编号
        crivalidList:[],// 交易对手ID--用来接收请求回来的数据
        loading:false,
        isPrjSetup:false,
        // isPrjSetup:'',

        form,
        url:{
          save:'/project/vAmPact/add',//添加
          find: '/project/vAmPact/queryById',//查看
          edite: '/project/vAmPact/edit',//编辑
        },
        areas:[], // 地区
        rules:r,
        tempIssuerCode: ''
      }

    },
    watch:{
      id: function(newVal, oldVal) {
        this.getInfoDis()
      },
    },
    methods: {
      // 页面初始化请求页面中默认的数据
      async initPage(){
        // 请求项目编号
        await getAction('/prj/list').then(res=>{
          if(res.success){
            // 2.请求数据给这个数组
            this.cprojcodeList =res.result.records
          }else {
            this.$message.warning(res.message);
          }
        }).finally(()=>{

        });
        //被请求的投标编号
        this.getAssetName()
        // 交易对手ID
        this.getCrivalId()
      },

      // 通过ID查找对应的数据
      getInfoDis() {
        this.loading = true
        getAction(this.url.find, { cpactid: this.id })
          .then(res => {
            if (res.success) {
            this.loading = false

              this.form = res.result
              // this.getDictConfigs()
            } else {
              this.$message.error(res.message)
            }
          })
          .finally(() => {
            //this.loading=false;
          })
      },
      // 1.发送请求，请求数据后判断
      // 被投标的编号
      async getAssetName(){
        let productSearchConditionVo = {
        }
        await postAction('orders/common/queryPro',productSearchConditionVo).then(res=>{
          if(res.success){
            this.cassetnoList = res.result
          }
        })
      },
      // 投资项目编号如果 prjCode 为空 页面填写
      handleChange(value){
        console.log(value)
        // item是选中的数据对象
        let item = this.cassetnoList.filter(item => item.proCode === value)[0] || {}
        if(item.proCode){
          // 被投标的编号 orders/common/queryPro请求 接口返回的proCode，选中后 带出 投资项目编号 和产品代码
          // 投资项目编号 如果prjCode 如果为空就页面填写，有数据则带出数据，
          // 这里投资项目编号 prjCode
          this.form.cinvestcode = item.prjCode
          // 产品代码
          this.form.cFundCode = item.profitId

           // 临时存储的tempIssuerCode
          this.issuerCodeId = item.issuerCode
          
          // 每次下拉就请求接口
          this.getCrivalId()
        }


      },
      // 1.请求交易对手ID--数组
      async getCrivalId(){
        await getAction('admOrgnaiztionInfo/list').then(res=>{
          if(res.success){
            try {
              let arr = res.result.records//这个是请求回来的数组--我们给一个定义的数组变量
              // 为什么定义在内部呢？因为定义在data中的数据是占内存的。
              // 使用arr 数组中的find方法---返回符合传入测试（函数）条件的数组元素，如果没有符合条件的元素返回 undefinedfind() 对于空数组，函数是不会执行的
              //避免参数类型不同，所以统一设成String类型
              // 为了避免 res.result后台返回{} || undefined 所以 写一个try catch
              let findItem = arr.find(item=>String(item.orgCode)  ===  String(this.tempIssuerCode))
              // // findItem === undefined 代表没有找到符合条件的这个根据返回的issuerCode与orgCode 相等自动选择
              if (typeof findItem === 'undefined') {
                } else {
                  // 找到就赋值
                  this.form.crivalid = findItem.orgCode
                }
              } catch (error) {
              
            }
          }
        })
      },
      // 交易对手ID中  orgCode == 被投标编号的issuerCode 就自动带出接口中的orgCode，否则就页面填写
      /**
      1.在data中定义一个变量tempIssuerCode: ''存储临时issuerCode
      2.因为下拉选中一条数据后（在下拉那里写change） 就可以得到那条数据的issureCode,所以把这个数据给这个临时的tempIssuerCode
      3.交易对手ID请求接口，因为要取到orgCode做比较，所以到请求交易对手ID那里
      4.交易对手ID请求那一块，页面初始化时候不请求接口，所以把请求放到 下拉的时候
      */



      //提交
      onSubmit() {
        // 地区
        if (this.areas.length == 1) {
          this.form.careaCode = this.areas[0]
        }
        if (this.areas.length == 3) {
          this.form.careaCode = this.areas[0]
          this.form.careaProvCode = this.areas[1]
          this.form.careaCityCode = this.areas[2]
        }
        // 保存和编辑的校验
        this.$refs.assetForm.validate(valid => {
          if(valid) {
            this.loading = true
            const param = this.form
            // 如果编辑
            if (this.id && this.optType == 'edite') {
              param.id = this.id
              return putAction(this.url.edite, param)
              .then(res => {
                if (res.success) {
                  this.$emit('update')
                  this.$message.success('保存成功！')
                } else {
                  this.$message.error(res.message)
                }
              })
              .finally(() => {
                this.loading = false
              })
            }else{
            return postAction(this.url.save,param)
              .then(res => {
                if(res.success) {
                   this.$message.success('保存成功！')
                  //  关闭页面
                  this.$emit('update')
                  // 刷新列表页
                }else {
                   this.$message.error(res.message)
                }
              })
              .finally(()=>{
                 this.loading = false
              })
            }
          }else {
            this.$message.error('校验未通过')
            return false
          }
        })
      }
    },
    mounted() {
      this.initPage();
    },
    created() {

      if (this.id) {
        this.getInfoDis()
      } else {
        // this.getDictConfigs()
      }
      // this.getDict('contract_nature')
    }


  }
</script>
<style lang="stylus" scoped>
  .ant-input ant-cascader-input {
  
  }
</style>