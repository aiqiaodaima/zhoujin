<template>
  <div style="background: rgb(240, 242, 245)">
    <a-spin :spinning="loading">
      <a-form-model :model="form" :rules="rules" ref="VTaFundinfo" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }">
        <a-layout>
          <a-layout-content>
            <a-card size="small" title="基本信息" :bordered="false">
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-model-item label="产品代码" prop="cli.cFundcode">
                    <a-input
                      id="cFundcode"
                      placeholder="请输入产品代码"
                      v-model="form.cli.cFundcode"
                      :disabled="isPrjSetup"
                    ></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="产品名称" prop="cli.cFundname">
                    <a-input id="cFundname" placeholder="请输入产品名称" v-model="form.cli.cFundname"></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="项目编号" prop="cli.cProjcode">
                    <a-input
                      id="cProjcode"
                      placeholder="请输入项目编号"
                      v-model="form.cli.cProjcode" :disabled="isPrjSetup"
                    ></a-input>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-model-item label="结构化标志" prop="cli.cSubprojcode">
                    <j-d-select-tag
                      id="cSubprojcode"
                      v-model="form.cli.cSubprojcode"
                      dict-code="y_n"
                    ></j-d-select-tag>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="受益权分级" prop="cli.lStrucflag">
                    <j-d-select-tag
                      id="lStrucflag"
                      v-model="form.cli.lStrucflag"
                      dict-code="BENEFIT_CLASS"
                    ></j-d-select-tag>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="产品属性">
                    <j-d-select-tag
                      id="cProperty"
                      v-model="form.cli.cProperty"
                      dict-code="PRODUCT_ATTRIBUTES"
                    ></j-d-select-tag>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-model-item label="发行日期" prop="cli.dIssuedate">
                    <j-date
                      id="dIssuedate"
                      placeholder="请选择发行日期"
                      v-model="form.cli.dIssuedate"
                      :disabled="isPrjSetup"
                      style="width: 100%"
                    ></j-date>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="发行价格" prop="cli.fCollprice">
                    <a-tooltip :trigger="['focus', 'hover']" placement="topLeft" overlay-class-name="numeric-input">
                      <span v-if="showtip !== ''" slot="title" class="numeric-input-title">
                        {{ showtip }}
                      </span>
                      <template v-else slot="title"> 请输入数字 </template>
                      <a-input-number
                        id="fCollprice"
                        :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                        style="width: 100%"
                        :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                        placeholder="请输入发行价格"
                        :min="2"
                        :precision="2"
                        v-model="form.cli.fCollprice"
                      ></a-input-number>
                    </a-tooltip>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="募集开始日" prop="cli.dCollbdate">
                    <j-date
                      id="dCollbdate"
                      placeholder="请选择募集开始日"
                      v-model="form.cli.dCollbdate"
                      :disabled="isPrjSetup"
                      style="width: 100%"
                    ></j-date>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-model-item label="募集结束日" prop="cli.dColledate">
                    <j-date
                      id="dColledate"
                      placeholder="请选择募集结束日"
                      v-model="form.cli.dColledate"
                      :disabled="isPrjSetup"
                      style="width: 100%"
                    ></j-date>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="计划募集资金上限" prop="cli.fMaxcollcap">
                    <a-tooltip :trigger="['focus', 'hover']" placement="topLeft" overlay-class-name="numeric-input">
                      <span v-if="showtip !== ''" slot="title" class="numeric-input-title">
                        {{ showtip }}
                      </span>
                      <template v-else slot="title"> 请输入数字 </template>
                      <a-input-number
                        id="fCollprice"
                        :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                        style="width: 100%"
                        :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                        placeholder="请输入计划募集资金上限"
                        :min="2"
                        :precision="2"
                        v-model="form.cli.fMaxcollcap"
                      ></a-input-number>
                    </a-tooltip>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="募集总金额" prop="cli.fCollamount">
                    <a-tooltip :trigger="['focus', 'hover']" placement="topLeft" overlay-class-name="numeric-input">
                      <span v-if="showtip !== ''" slot="title" class="numeric-input-title">
                        {{ showtip }}
                      </span>
                      <template v-else slot="title"> 请输入数字 </template>
                      <a-input-number
                        id="fCollamount"
                        :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                        style="width: 100%"
                        :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                        placeholder="请输入募集总金额"
                        :min="2"
                        :precision="2"
                        v-model="form.cli.fCollamount"
                        :disabled="isPrjSetup"
                      ></a-input-number>
                    </a-tooltip>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-model-item label="费用金额" prop="cli.fCollfees">
                    <a-tooltip :trigger="['focus', 'hover']" placement="topLeft" overlay-class-name="numeric-input">
                      <span v-if="showtip !== ''" slot="title" class="numeric-input-title">
                        {{ showtip }}
                      </span>
                      <template v-else slot="title"> 请输入数字 </template>
                      <a-input-number
                        id="fCollfees"
                        :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                        style="width: 100%"
                        :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                        placeholder="请输入费用金额"
                        :min="2"
                        :precision="2"
                        v-model="form.cli.fCollfees"
                      ></a-input-number>
                    </a-tooltip>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="财产作价" prop="cli.fPropright">
                    <a-tooltip :trigger="['focus', 'hover']" placement="topLeft" overlay-class-name="numeric-input">
                      <span v-if="showtip !== ''" slot="title" class="numeric-input-title">
                        {{ showtip }}
                      </span>
                      <template v-else slot="title"> 请输入数字 </template>
                      <a-input-number
                        id="fPropright"
                        :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                        style="width: 100%"
                        :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                        placeholder="请输入财产作价"
                        :min="2"
                        :precision="2"
                        v-model="form.cli.fPropright"
                      ></a-input-number>
                    </a-tooltip>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="募集份额" prop="cli.fCollshares">
                    <a-tooltip :trigger="['focus', 'hover']" placement="topLeft" overlay-class-name="numeric-input">
                      <span v-if="showtip !== ''" slot="title" class="numeric-input-title">
                        {{ showtip }}
                      </span>
                      <template v-else slot="title"> 请输入数字 </template>
                      <a-input-number
                        id="fCollshares"
                        :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                        style="width: 100%"
                        :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                        placeholder="请输入募集份额"
                        :min="2"
                        :precision="2"
                        v-model="form.cli.fCollshares"
                      ></a-input-number>
                    </a-tooltip>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-model-item label="成立日期" prop="cli.dSetupdate">
                    <j-date
                      id="dSetupdate"
                      placeholder="请选择成立日期"
                      v-model="form.cli.dSetupdate"
                      :disabled="isPrjSetup"
                      style="width: 100%"
                    ></j-date>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="预计到期" prop="cli.dEnddate">
                    <j-date
                      id="dEnddate"
                      placeholder="请选择预计到期"
                      v-model="form.cli.dEnddate"
                      :disabled="isPrjSetup"
                      style="width: 100%"
                    ></j-date>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="他益产品录入模式" prop="cli.cBenefitmode">
                    <j-d-select-tag
                      id="cBenefitmode"
                      v-model="form.cli.cBenefitmode"
                      dict-code="y_n"
                    ></j-d-select-tag>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-model-item label="清算日期" prop="cli.dLiqudate">
                    <j-date
                      id="dLiqudate"
                      placeholder="请选择清算日期"
                      v-model="form.cli.dLiqudate"
                      style="width: 100%"
                    ></j-date>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="产品状态" prop="cli.cStatus">
                    <j-d-select-tag
                      id="cStatus"
                      v-model="form.cli.cStatus"
                      dict-code="PRODUCT_STATUS"
                      placeholder="请选择产品状态"
                    ></j-d-select-tag>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="受益方式" prop="cli.cBenefittype">
                    <j-d-select-tag
                      id="cBenefittype"
                      v-model="form.cli.cBenefittype"
                      dict-code="BENEFIT_TYPE"
                      :disabled="isPrjSetup"
                    ></j-d-select-tag>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-model-item label="年化天数" prop="cli.lAnnualdays">
                    <a-input id="lAnnualdays" placeholder="请输入产品代码" v-model="form.cli.lAnnualdays"></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="是否净值型" >
                    <j-d-select-tag
                      id="lIsnav"
                      v-model="form.cli.lIsnav"
                      dict-code="y_n"
                    ></j-d-select-tag>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="是否预成立" >
                    <j-d-select-tag
                      id="lIspresetup"
                      v-model="form.cli.lIspresetup"
                      dict-code="y_n"
                    ></j-d-select-tag>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-card>
            <br />


          </a-layout-content>
          <a-layout-footer
            :style="{
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
            <!--  <span v-if="form.cli.prjStatus === 'R'">审核</span>-->
            </a-button>
          </a-layout-footer>
        </a-layout>
      </a-form-model>
    </a-spin>
  </div>
</template>

 

<script>
  import JDSelectTag from '../../components/dict/JDSelectTag'
  import JMultiSelectTag from '../../components/dict/JMultiSelectTag'
  import { httpAction } from '@/api/manage'
  import JDate from '../../components/jeecg/JDate'
  import { getAction } from '../../api/manage'
  import * as customizeConfigs from '../../customizeConfig'
  import { capitalAmount } from '@utils/util'
  import { initDictOptionsBatch } from '../../components/dict/JDictSelectUtil'

  export default {
    name: 'VTaFundinfo',
    components: {
      JDate,
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
      },
 /*     'form.cli.trustTermOth'(val) {
        //过滤特殊字符
        this.form.cli.trustTermOth = val.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\w]/g, '').trim()
      },*/
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
      let cli = {
        cFundcode:'',
        cFundname:'',
        cProjcode:'',
        cSubprojcode:'',
        lStrucflag:'',
        lBeneftype:'',
        cProperty:'',
        dIssuedate:'',
        fCollprice:'',
        dCollbdate:'',
        dColledate:'',
        fMaxcollcap:'',
        fCollamount:'',
        fCollfees:'',
        fPropright:'',
        fCollshares:'',
        dSetupdate:'',
        dEnddate:'',
        cBenefitmode:'',
        dLiqudate:'',
        cStatus:'',
        cBenefittype:'',
        lAnnualdays:'',
        cMfundcode:'',
        lIsnav:'',
        lIspresetup:'',

      }

      let r = {}
      let xx = Object.keys(cli)
      for (let i = 0; i < xx.length; i++) {
          r['cli.' + xx[i]] = ruleReq
      }

      return {
        customizeEnv: customizeEnv,
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
          trustTermType: '',
          addrProp: '',
          cusLoaDdRelevance: {},
        },
        rules: r,
        url: {
          action: '/prj/savePrjEle',
          findByPrjCode: '/prj/findByPrjCode',
        },
        isPrjSetup:'',
        prjCode: '',
        optType: '',
        treeData: [],
        khlyTreeData: [],
        allTmData: [],
        tmCodes: [],
        showtip:'',
        loading: false
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
        initDictOptionsBatch('PRODUCT_STATUS,BENEFIT_TYPE,PRODUCT_ATTRIBUTES,BENEFIT_CLASS').then((res) => {
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
        that.prjCode = that.$route.query.prjCode
        if (that.prjCode) {
          let param = { cli: { prjCode: that.prjCode } }
          that.loading = true
          await httpAction(that.url.findByPrjCode, param, 'post').then((res) => {
            console.log('项目信息', res)
            if (res.success) {
              console.log('prjInfo=', res.result)
              that.form = res.result
              that.form.cli.cProjcode=res.result.cli.trustPrjCode
              that.form.cli.cFundcode=res.result.cli.productCode
              that.form.cli.cBenefittype=res.result.clci.bnfSelfYn//受益方式
              that.form.cli.dIssuedate=res.result.cli.trustStdDt//发行日
              that.form.cli.dCollbdate=res.result.cli.trustStdDt//募集开始
              that.form.cli.dColledate=res.result.cli.signingDt//募集结束
              that.form.cli.fCollamount=res.result.cli.setScaleAmt//初始信托规模
              that.form.cli.dSetupdate=res.result.cli.trustStdDt//成立日期
              that.form.cli.dEnddate=res.result.cli.trustExprDt//预计到期
              that.isPrjSetup = res.result.cli.prjStatus === 'R'
            } else {
              that.$error({
                title: res.message,
              })
            }
          })
        }
        that.loading = false
      },
      tmpSave() {
        this.form.cli.status = 'temp'
        this.sendData()
      },
      doSave() {
        let that = this
        this.$refs.VTaFundinfo.validate((valid) => {
          if (valid) {
            that.form.saveType = 'submit'
            that.sendData()
          } else {
            return false
          }
        })
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