<template>
  <j-modal
    :title="title"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :fullscreen="true"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <template slot="footer">
      <a-row :gutter="24" style="margin: 0; padding: 0">
        <a-col :span="23" style="text-align: center">
          <a-button :disabled="optType == 'view_v'" type="primary" @click="handleOk">保存 </a-button>
          <a-button
            v-if="
              (form.cbd.distCatCode === 'LOA0401' &&
                form.cbd.regulStartDtType !== '5' &&
                form.cbd.regulStartDt !== '' &&
                form.cbd.regulStartDt !== undefined) ||
              (form.cbd.distCatCode === 'LOA0402' &&
                form.cbd.calendarType !== '' &&
                form.cbd.calendarType !== undefined &&
                form.cbd.holidayAdjustType !== '' &&
                form.cbd.holidayAdjustType !== undefined &&
                form.cbd.regulStartDt !== '' &&
                form.cbd.regulStartDt !== undefined &&
                form.cbd.dayType !== '' &&
                form.cbd.dayType !== undefined)
            "
            @click="getIntPlanListNew"
            :disabled="optType == 'view_v'"
            >生成计划
          </a-button>
          <a-button @click="handleCancel">关闭</a-button>
        </a-col>
      </a-row>
    </template>
    <a-spin :spinning="confirmLoading">
      <a-form-model
        :model="form"
        :rules="rules"
        ref="form"
        :label-col="{ span: 9 }"
        :wrapper-col="{ span: 15 }"
        style="margin-right: 10px"
      >
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-model-item v-if="customizeEnv === 'zrt'" label="分配名称" prop="cbd.distCatCode">
              <j-d-select-tag
                :disabled="optType === 'view_v'"
                v-model="form.cbd.distCatCode"
                dict-code="TRX_SUB_TYPES"
                :chooses="[{ fieldName: 'value', fieldValue: 'LOA0401,LOA0402,LOA0403,LOA0404,LOA0405' }]"
                @change="distCatCodeChange"
              />
            </a-form-model-item>
            <a-form-model-item v-else label="分配名称" prop="cbd.distCatCode">
              <j-d-select-tag
                :disabled="optType === 'view_v'"
                v-model="form.cbd.distCatCode"
                dict-code="TRX_SUB_TYPES"
                :chooses="[{ fieldName: 'value', fieldValue: 'LOA0401,LOA0402' }]"
                @change="distCatCodeChange"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="showFlag">
            <a-form-model-item label="分配细类">
              <j-d-select-tag
                :disabled="optType === 'view_v'"
                v-model="form.cbd.distTypeCode"
                dict-code="DIST_TYPE"
                ref="JDSelectTag"
                :filters="[{ fieldName: 'value', fieldValue: form.cbd.distCatCode }]"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="8"
            v-if="
              form.cbd.distTypeCode === 'LOA0401LOA0402OTH' ||
              form.cbd.distCatCode === 'LOA0404' ||
              form.cbd.distCatCode === 'LOA0405'
            "
          >
            <a-form-model-item label="分配细类描述" prop="cbd.distTypeCondition">
              <a-input :disabled="optType === 'view_v'" v-model="form.cbd.distTypeCondition" />
            </a-form-model-item>
          </a-col>
          <a-col :span="4" style="margin-top:3px" v-if="jyjj">
              <j-d-select-tag
                :disabled="optType === 'view_v'"
                v-model="form.cbd.classificationOfFamousSchools"
                dict-code="CLASSIFICATION_OF_FAMOUS_SCHOOLS"
                ref="JDSelectTag"
              />
          </a-col>
          <a-col v-if="mc" :span="1" style="margin-top:3px">
              <a-input :disabled="optType === 'view_v'" v-model="form.cbd.ranking" />
          </a-col>
         
          <a-col :span="3" style="margin-top:3px" v-if="jyjj">
              <j-d-select-tag
                :disabled="optType === 'view_v'"
                v-model="form.cbd.degreeClassification"
                dict-code="DEGREE_CLASSIFICATION"
                ref="JDSelectTag"
              />
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-model-item :label="customizeEnv === 'zrt' ? '分配对象' : '受益人'" :required="true">
              <bi-rel-party-tag
                :mode="form.cbd.distCatCode=='LOA0403'? 'multiple' : 'default'"
                :prj-code="this.$route.query.prjCode"
                rel-type="BENEFICIARY"
                ref="BiRelPartyTag"
                :disabled="optType === 'view_v'"
                :defaultValue="form.bnfs"
                v-model="form.bnfs"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="申请人" prop="cbd.applyerName">
              <j-d-select-tag
                :disabled="optType === 'view_v'"
                v-model="form.cbd.applyerName"
                dict-code="APPLYER_NAME"
                ref="JDSelectTag"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-model-item label="开始日" prop="cbd.regulStartDtType">
              <j-d-select-tag
                :disabled="optType === 'view_v'"
                dict-code="DIS_START_TYPE"
                v-model="form.cbd.regulStartDtType"
                @change="(e) => regulDtTypeChange(e, 'start')"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.cbd.regulStartDtType !== '5'">
            <a-form-model-item label="固定日期" prop="cbd.regulStartDt">
              <j-date :disabled="optType === 'view_v'" v-model="form.cbd.regulStartDt" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.cbd.regulStartDtType === '5'">
            <a-form-model-item label="不确定开始日描述" prop="cbd.regulStartCondition">
              <a-input :disabled="optType === 'view_v'" v-model="form.cbd.regulStartCondition" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-model-item label="结束日" prop="cbd.regulEndDtType">
              <j-d-select-tag
                :disabled="optType === 'view_v'"
                dict-code="DIS_END_TYPE"
                v-model="form.cbd.regulEndDtType"
                @change="(e) => regulDtTypeChange(e, 'end')"
              />
              
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.cbd.regulEndDtType !== '3'">
            <a-form-model-item label="固定日期" prop="cbd.regulEndDt">
              <j-date :disabled="optType === 'view_v'" v-model="form.cbd.regulEndDt" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.cbd.regulEndDtType === '3'">
            <a-form-model-item label="不确定结束日描述" prop="cbd.regulEndCondition">
              <a-input :disabled="optType === 'view_v'" v-model="form.cbd.regulEndCondition" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-model-item
              label="按金额分配/比例分配"
              :labelCol="{ span: 3 }"
              :wrapperCol="{ span: 21 }"
              prop="cbd.amtType"
            >
              <j-d-select-tag
                :disabled="optType === 'view_v'"
                dict-code="AMT_TYPE"
                @change="resetForm"
                v-model="form.cbd.amtType"
              />
            </a-form-model-item>
          </a-col>

          <a-col v-if="form.cbd.amtType === 'A'" :span="24">
            <a-form-model-item
              label="分配金额类型"
              :labelCol="{ span: 3 }"
              :wrapperCol="{ span: 21 }"
              prop="cbd.amtTypeAType"
            >
              <j-d-select-tag
                :disabled="optType === 'view_v'"
                dict-code="AMT_TYPE_A_TYPE"
                v-model="form.cbd.amtTypeAType"
              />
            </a-form-model-item>
          </a-col>
          <a-col v-if="form.cbd.amtType === 'A' && showFlagDq" :span="24">
            <a-form-model-item label="地区" :labelCol="{ span: 3 }" :wrapperCol="{ span: 21 }" prop="cbd.areaCode">
              <j-d-select-tag
                :disabled="optType === 'view_v'"
                dict-code="DIS_PRO"
                v-model="form.cbd.areaCode"
              />
            </a-form-model-item>
          </a-col>

          <a-col
            v-if="form.cbd.amtType === 'A' && '14568'.indexOf(form.cbd.amtTypeAType || '') > -1"
            :span="form.cbd.amtTypeAType === '1' ? 24 : 8"
            :pull="form.cbd.amtTypeAType === '1' ? 6 : 0"
          >
            <!--   <a-form-model-item :label="form.cbd.amtTypeAType==='1'?'固定金额':'首次金额'" prop="cbd.distAmt">
              <a-input-number :disabled="optType === 'view_v'" v-model="form.cbd.distAmt"
                              :min="0.01"
                              style="width: 100%"/>
            </a-form-model-item>-->
            <a-form-model-item :label="form.cbd.amtTypeAType === '1' ? '固定金额' : '首次金额'" prop="cbd.distAmt">
              <a-tooltip :trigger="['focus', 'hover']" placement="topLeft" overlay-class-name="numeric-input">
                <span v-if="showtip !== ''" slot="title" class="numeric-input-title">
                  {{ showtip }}
                </span>
                <template v-else slot="title"> 请输入数字 </template>
                <a-input-number
                  id="setScaleAmt"
                  :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                  :placeholder="'请输入' + form.cbd.amtTypeAType === '1' ? '固定金额' : '首次金额'"
                  :min="0.01"
                  :disabled="optType === 'view_v'"
                  v-model="form.cbd.distAmt"
                  style="width: 100%"
                  :precision="2"
                ></a-input-number>
              </a-tooltip>
            </a-form-model-item>
          </a-col>

          <!--          添加按比例分配录入项-->
          <a-col v-if="form.cbd.amtType === 'P'" :span="8">
            <a-form-model-item label="财产来源" prop="cbd.amtRangeType">
              <j-d-select-tag
                :disabled="optType === 'view_v'"
                dict-code="AMT_SOURCE_TYPE"
                v-model="form.cbd.amtRangeType"
              />
            </a-form-model-item>
          </a-col>
          <a-col v-if="form.cbd.amtType === 'P' && form.cbd.amtRangeType === '2'" :span="8">
            <a-form-model-item label="计算基数" prop="cbd.amtBase">
              <j-d-select-tag
                :disabled="optType === 'view_v'"
                dict-code="AMT_CALCULATION_BASE"
                v-model="form.cbd.amtBase"
              />
            </a-form-model-item>
          </a-col>
          <a-col v-if="form.cbd.amtType === 'P'" :span="8">
            <a-form-model-item label="分配比例%" prop="cbd.amtDistributionRatio">
              <a-input-number
                :disabled="optType === 'view_v'"
                v-model="form.cbd.amtDistributionRatio"
                style="width: 100%"
              />
            </a-form-model-item>
          </a-col>
          <a-col v-if="'456'.indexOf(form.cbd.amtTypeAType || '') > -1" :span="8">
            <a-form-model-item
              label="开始时间"
              prop="cbd.cpiIncreasePercentBase"
              v-if="form.cbd.amtType === 'A' && (form.cbd.amtTypeAType === '5' || form.cbd.amtTypeAType === '4' || form.cbd.amtTypeAType === '6')"
            >
              <j-d-select-tag
                :disabled="optType === 'view_v'"
                dict-code="AMT_TYPEA_STD_TYPE"
                v-model="form.cbd.cpiIncreasePercentBase"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row v-if="form.cbd.amtTypeAType === '5' && form.cbd.amtType === 'A'">
          <a-col :span="8">
            <a-form-model-item label="调整比例" prop="cbd.cpiIncreasePercent">
              <a-input-number :disabled="optType === 'view_v'" v-model="form.cbd.cpiIncreasePercent" :min="0.01" />
              %
            </a-form-model-item>
          </a-col>
          <a-col :span="3" pull="4">
            <a-form-model-item label=":" prop="cbd.amtTypeaStdType">
              <j-d-select-tag
                v-if="optType !== 'view'"
                :disabled="optType === 'view_v'"
                dict-code="AMT_TYPEA_ADJFRQ"
                v-model="form.cbd.amtTypeaStdType"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="3" pull="4">
            <a-form-model-item label=":" prop="cbd.amtTypeaStdNum" v-if="form.cbd.amtTypeaStdType === '2'">
              <a-input v-model="form.cbd.amtTypeaStdNum" :disabled="optType === 'view_v'" addon-after="月" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row v-if="form.cbd.amtTypeAType === '6' && form.cbd.amtType === 'A'">
          <a-col :span="8">
            <!-- <a-form-model-item label="调整金额" prop="cbd.cpiIncreasePercent"> -->
            <BiInputCapitalAmount
              :isForm="true"
              label="调整金额"
              :disabled="optType == 'view_v'"
              v-model="form.cbd.cpiIncreasePercent"
              :min="0.01"
              :precision="2"
              name="cbd.cpiIncreasePercent"
            />
              <!-- <a-input-number :disabled="optType === 'view_v'" v-model="form.cbd.cpiIncreasePercent" :min="0.01" />
            </a-form-model-item> -->
          </a-col>
          <a-col :span="3">
            <a-form-model-item label=":" prop="cbd.amtTypeaStdType">
              <j-d-select-tag
                v-if="optType !== 'view'"
                :disabled="optType === 'view_v'"
                dict-code="AMT_TYPEA_ADJFRQ"
                v-model="form.cbd.amtTypeaStdType"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="3">
            <a-form-model-item label=":" prop="cbd.amtTypeaStdNum" v-if="form.cbd.amtTypeaStdType === '2'">
              <a-input v-model="form.cbd.amtTypeaStdNum" :disabled="optType === 'view_v'" addon-after="月" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-model-item label="每次分配金额限制">
              <j-d-select-tag
                :disabled="optType === 'view_v'"
                dict-code="EVERY_DIS_LMT_TYPE"
                v-model="form.cbd.everyDisLmtType"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <!--   <a-form-model-item label="金额">
              <a-input-number :disabled="optType === 'view_v'"
                              v-model="form.cbd.everyDisLmtAmt"
                              :min="0.01"
                              style="width: 100%"/>
            </a-form-model-item>-->

            <BiInputCapitalAmount
              :isForm="true"
              label="金额"
              :disabled="optType == 'view_v'"
              v-model="form.cbd.everyDisLmtAmt"
              :min="0.01"
              :precision="2"
            />
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-model-item label="每年分配金额限制">
              <j-d-select-tag
                :disabled="optType === 'view_v'"
                dict-code="EVERY_DIS_LMT_TYPE"
                v-model="form.cbd.everyYearLmtType"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <!-- <a-form-model-item label="金额">
              <a-input-number :disabled="optType === 'view_v'"
                              v-model="form.cbd.everyYearLmtAmt"
                              :min="0"
                              style="width: 100%"/>
            </a-form-model-item>-->
            <BiInputCapitalAmount
              :isForm="true"
              label="金额"
              :disabled="optType == 'view_v'"
              v-model="form.cbd.everyYearLmtAmt"
              :min="0.01"
              :precision="2"
            />
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-model-item label="累计分配金额限制">
              <j-d-select-tag
                :disabled="optType === 'view_v'"
                dict-code="ALL_DIS_LMT_TYPE"
                v-model="form.cbd.allDisLmtType"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <!-- <a-form-model-item label="金额">
              <a-input-number :disabled="optType === 'view_v'" v-model="form.cbd.allDisLmtAmt"
                              :min="0.01"
                              style="width: 100%"/>
            </a-form-model-item>-->
            <BiInputCapitalAmount
              :isForm="true"
              label="金额"
              :disabled="optType == 'view_v'"
              v-model="form.cbd.allDisLmtAmt"
              :min="0.01"
              :precision="2"
            />
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-model-item label="每年分配次数限制">
              <j-d-select-tag
                :disabled="optType === 'view_v'"
                dict-code="DIS_TIMES_LMT_TYPE"
                v-model="form.cbd.disTimesLmtYearType"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="次数">
              <a-input-number
                v-if="optType !== 'view'"
                :disabled="optType === 'view_v'"
                v-model="form.cbd.disTimesYearLmt"
                :min="0"
                style="width: 100%"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-model-item label="累计分配次数限制">
              <j-d-select-tag
                :disabled="optType === 'view_v'"
                dict-code="DIS_TIMES_LMT_TYPE"
                v-model="form.cbd.disTimesLmtType"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="次数">
              <a-input-number
                :disabled="optType === 'view_v'"
                v-model="form.cbd.disTimesLmt"
                :min="0"
                style="width: 100%"
              />
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-model-item label="参考日历" v-if="customizeEnv === 'zrt'">
              <j-d-select-tag
                :disabled="optType === 'view_v'"
                dict-code="CALENDAR_TYPE"
                v-model="form.cbd.calendarType"
                :chooses="[{ fieldName: 'value', fieldValue: 'LEGAL,CUSTOM' }]"
              />
            </a-form-model-item>
            <a-form-model-item label="参考日历" v-else prop="cbd.calendarType">
              <j-d-select-tag
                :disabled="optType === 'view_v'"
                dict-code="CALENDAR_TYPE"
                v-model="form.cbd.calendarType"
                :chooses="[{ fieldName: 'value', fieldValue: 'LEGAL,CUSTOM' }]"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="遇节假日调整方式" prop="cbd.holidayAdjustType">
              <j-d-select-tag
                v-if="optType !== 'view'"
                :disabled="optType === 'view_v'"
                dict-code="HOLIDAY_ADJUST_TYPE"
                v-model="form.cbd.holidayAdjustType"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24" v-if="form.cbd.distCatCode=='LOA0401'||form.cbd.distCatCode=='LOA0403'">
          <a-col :span="24" >
            <a-form-model-item label="分配日" :labelCol="{ span: 3 }" :wrapperCol="{ span: 21 }" prop="cbd.dayType">
              <!--              分配日类型-->
              <j-d-select-tag
                v-if="optType !== 'view'"
                :disabled="optType === 'view_v'"
                dict-code="RPT_YEAR"
                v-model="form.cbd.dayType"
                style="width: 95px"
              />
              <!--              自然日-->
              <span v-if="form.cbd.dayType === '1' || customizeEnv === 'zrt'">
                <span>每</span>
                <span v-if="form.cbd.yearTfix === 'Y'">
                  <a-input-number
                    :disabled="optType === 'view_v'"
                    v-model="form.cbd.dateNumbers"
                    :min="1"
                    :max="100"
                    style="width: 60px"
                  />
                </span>
                <j-d-select-tag
                  :disabled="optType === 'view_v'"
                  dict-code="TERM_UNIT"
                  v-model="form.cbd.yearTfix"
                  @change="onChangeJDSelectTag"
                  style="width: 90px"
                />

                <span v-if="form.cbd.yearTfix === 'Y'">
                  <j-multi-select-tag
                    :disabled="optType === 'view_v'"
                    dict-code="MONTHS"
                    v-model="form.cbd.monthList"
                    style="width: 200px"
                  />
                </span>

                <!--按周还是按日-->
                <span v-if="form.cbd.yearTfix === 'Y' || form.cbd.yearTfix === 'M' || form.cbd.yearTfix === 'J'">
                  <j-d-select-tag
                    v-if="optType !== 'view'"
                    :disabled="optType === 'view_v'"
                    dict-code="INT_RULE_TERM_UNIT"
                    v-model="form.cbd.ruleTermUnit"
                    style="width: 70px"
                  />
                  <span v-else>{{ fdText('INT_RULE_TERM_UNIT', form.cbd.ruleTermUnit) }}</span>
                </span>
                <!--选择周或者日排序方式-->
                <span v-if="form.cbd.yearTfix === 'Y' || form.cbd.yearTfix === 'M' || form.cbd.yearTfix === 'J'">
                  <j-d-select-tag
                    v-if="optType !== 'view'"
                    :disabled="optType === 'view_v'"
                    :dict-code="form.cbd.ruleTermUnit === '1' ? 'INT_RULE_BY_WEEK' : 'INT_RULE_DAY_TYPE'"
                    v-model="form.cbd.openRuleOrder"
                    style="width: 100px"
                  />
                  <span v-else>{{
                    fdText(
                      form.cbd.ruleTermUnit === '1' ? 'INT_RULE_BY_WEEK' : 'INT_RULE_DAY_TYPE',
                      form.cbd.openRuleOrder
                    )
                  }}</span>
                </span>

                <!--周的具体数值-->
                <span
                  v-if="
                    (form.cbd.yearTfix === 'Y' || form.cbd.yearTfix === 'M' || form.cbd.yearTfix === 'J') &&
                    form.cbd.ruleTermUnit === '1' &&
                    form.cbd.openRuleOrder !== '1'
                  "
                >
                  <a-input-number
                    v-if="optType !== 'view'"
                    :disabled="optType === 'view_v'"
                    v-model="form.cbd.weekIdx"
                    :min="1"
                    :max="365"
                    style="width: 60px"
                  />
                  <span v-else>{{ form.cbd.weekIdx }}</span>
                </span>
                <span
                  v-if="
                    (form.cbd.yearTfix === 'Y' || form.cbd.yearTfix === 'M' || form.cbd.yearTfix === 'J') &&
                    form.cbd.ruleTermUnit === '1'
                  "
                >
                  周的
                </span>

                <span
                  v-if="
                    (form.cbd.yearTfix === 'Y' ||
                      form.cbd.yearTfix === 'M' ||
                      form.cbd.yearTfix === 'W' ||
                      form.cbd.yearTfix === 'J') &&
                    form.cbd.yearTfix !== 'D' &&
                    form.cbd.ruleTermUnit !== '0'
                  "
                >
                  <j-d-select-tag
                    v-if="optType !== 'view'"
                    :disabled="optType === 'view_v'"
                    dict-code="INT_RULE_WEEK_NUM_TYPE"
                    v-model="form.cbd.weekDayList"
                    style="width: 110px"
                  />
                  <span v-else>{{ fdText('INT_RULE_WEEK_NUM_TYPE', form.cbd.weekDayList) }}</span>
                </span>
                <span
                  v-if="
                    form.cbd.yearTfix === 'Y' ||
                    form.cbd.yearTfix === 'M' ||
                    form.cbd.yearTfix === 'W' ||
                    form.cbd.yearTfix === 'J'
                  "
                >
                  <a-input-number
                    v-if="optType !== 'view'"
                    :disabled="optType === 'view_v'"
                    v-model="form.cbd.ruleOrder"
                    :min="1"
                    :max="365"
                    style="width: 60px"
                  />
                  <span v-else>{{ form.cbd.ruleOrder }}</span>
                </span>

                <span
                  v-if="
                    (form.cbd.yearTfix === 'Y' ||
                      form.cbd.yearTfix === 'M' ||
                      form.cbd.yearTfix === 'W' ||
                      form.cbd.yearTfix === 'J') &&
                    ((form.cbd.ruleTermUnit === '1' && form.cbd.weekDayList !== '1') ||
                      (form.cbd.ruleTermUnit === '0' && form.cbd.openRuleOrder !== '1') ||
                      (form.cbd.yearTfix === 'W' && form.cbd.weekDayList !== '1'))
                  "
                >
                  个
                  <j-d-select-tag
                    v-if="optType !== 'view'"
                    :disabled="optType === 'view_v'"
                    dict-code="WORK_NATURE_DAY"
                    v-model="form.cbd.workdayType"
                    style="width: 90px"
                  />
                  <span v-else>{{ fdText('WORKDAY_TYPE', form.cbd.workdayType) }}</span>
                </span>
              </span>
              <!--              信托日-->
              <span v-if="form.cbd.dayType === '2'&& customizeEnv !== 'zrt' ">
                每
                <a-input-number
                  v-if="optType !== 'view'"
                  :disabled="optType === 'view_v'"
                  v-model="form.cbd.trustOpenDayTfix"
                  :min="1"
                  :max="365"
                  style="width: 80px"
                />
                <span v-else>{{ form.cbd.trustOpenDayTfix }}</span>

                <j-d-select-tag
                  v-if="optType !== 'view'"
                  :disabled="optType === 'view_v'"
                  dict-code="TERM_UNIT"
                  v-model="form.cbd.trustOpenDayRule"
                  style="width: 90px"
                />
                <span v-else>{{ fdText('TERM_UNIT', form.cbd.trustOpenDayRule) }}</span>
              </span>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24" :pull="6">
            <BiFormItemTextarea
              :label="customizeEnv === 'zrt' ? '申请资料' : '资格验证'"
              v-model="form.cbd.recAdopt"
              name="recAdopt"
              :placeholder="customizeEnv === 'zrt' ? '申请资料' : '资格验证'"
              :disabled="optType === 'view_v'"
            />
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24" :pull="6">
            <BiFormItemTextarea
              label="备注"
              v-model="form.cbd.memo"
              name="memo"
              placeholder="备注"
              :disabled="optType === 'view_v'"
            />
          </a-col>
        </a-row>
      </a-form-model>
      <a-row
        type="flex"
        justify="center"
        v-if="
          (form.cbd.distCatCode === 'LOA0401' &&
            form.cbd.regulStartDtType !== '5' &&
            form.cbd.regulStartDt !== '' &&
            form.cbd.regulStartDt !== undefined) ||
          (form.cbd.distCatCode === 'LOA0402' &&
            form.cbd.calendarType !== '' &&
            form.cbd.calendarType !== undefined &&
            form.cbd.holidayAdjustType !== '' &&
            form.cbd.holidayAdjustType !== undefined &&
            form.cbd.regulStartDt !== '' &&
            form.cbd.regulStartDt !== undefined &&
            form.cbd.dayType !== '' &&
            form.cbd.dayType !== undefined)
        "
      >
        <a-col :span="24">
          <h3>分配计划</h3>
          <a-table
            ref="table"
            size="small"
            bordered
            :columns="columns"
            :dataSource="dataSource"
            :pagination="pagination"
            @change="tableChange"
          >
          </a-table>
        </a-col>
      </a-row>
    </a-spin>

    <wkf-next-user-modal ref="wkfUserForm" @complete="wkfUserComplete" />
  </j-modal>
</template>

<script>
import moment from 'moment'
import JDSelectTag from '../../../components/dict/JDSelectTag'
import { initDictOptionsBatch } from '../../../components/dict/JDictSelectUtil'
import BiRelPartyTag from '../../../components/BI/BiRelPartyTag'
import JDate from '../../../components/jeecg/JDate'
import { postAction, getAction } from '../../../api/manage'
import WkfNextUserModal from '../../activiti/modules/WkfNextUserModal'
import JMultiSelectTag from '../../../components/dict/JMultiSelectTag'
import * as customizeConfigs from '../../../customizeConfig'
import { httpAction } from '@/api/manage'
import { filterDictText } from '@/components/dict/JDictSelectUtil'
import { capitalAmount } from '@utils/util'

export default {
  name: 'DistplanModal',
  components: { WkfNextUserModal, JDate, BiRelPartyTag, JDSelectTag, JMultiSelectTag },
  watch: {
    id: function (newVal, oldVal) {
      this.getDate()
      this.getInfoDistplan()
    },
    visible: function (newVal, oldVal) {
      //打开页面刷新数据  关闭页面清空数据
      if (this.visible) {
        this.getDate()
        this.getInfoDistplan()
      } else {
        this.form.cbd = {}
        this.form.bnfs = []
        this.dataSource = []
        this.resetForm()
      }
    },
    'form.cbd.distAmt'(val) {
      this.showtip = capitalAmount(val)
      console.log('ceshi-------' + this.showtip)
    },
    // 中融个性化
    'form.cbd.amtTypeAType'(val) {
      if (this.customizeEnv === 'zrt' && val === '8') {
        this.showFlagDq = true;
      }else{
        this.showFlagDq = false;
      }
    },
    'form.cbd.distTypeCode'(val){
      // 条件分配--教育奖励金/教育基金，后面加两个下拉选单；选择「U.S. News世界大学排名前N名」和「泰晤士高等教育世界大学排名前N名」时需要填写N名填写框
      if(this.customizeEnv === 'zrt'){
        if(val === 'LOA040202' || val === 'LOA040203' || val === 'LOA040204' || val === 'LOA040205'){         
           this.jyjj = true;
        }else{
          this.jyjj = false;
        }
        
      }
    },
    'form.cbd.classificationOfFamousSchools'(val){
      if(this.customizeEnv === 'zrt'){
         if(val === '1' || val === '2'){
            this.mc = true
         }else{
           this.mc = false
         }
      }
    }
  },
  data() {
    let that = this
    let customizeEnv = customizeConfigs.customizeEnv
    return {
      mc:false,
      jyjj:false,
      showFlag: true,
      showFlagDq: false,
      showtip: '',
      visible: false,
      title: '',
      confirmLoading: false,
      disId: this.id,
      customizeEnv: customizeEnv,
      isRequired: true,
      form: {
        cbd: {
          distCatCode: ' ',
          amtType: '',
          partyName: '',
          dayType: '',
          yearTfix: '',
          monthList: '',
          openRuleTermUnit: '',
          openRuleOrder: '',
          openRuleByWeek: '',
          weekIdx: '',
          openRuleOrderByWeek: '',
          weekDayList: '',
          dayList: '',
          workdayType: '',
          calendarType: '',
          disTimesLmtYearType: '',
          disTimesYearLmt: '',
          areaCode:'',
          classificationOfFamousSchools:'',
          ranking:'',
          degreeClassification:''
        },
        cli: {
          trustStdDt: '',
          trustExprDt: '',
        },
        clci: {
          closedPeriod: '',
          closedUnit: '',
        },
        bnfs: [],
      },
      validatorRules: {},
      rules: {
        'cbd.amtRangeType': [{ required: true, message: '必输字段', trigger: 'change' }],
        'cbd.amtBase': [{ required: true, message: '必输字段', trigger: 'change' }],
        'cbd.amtDistributionRatio': [{ required: true, message: '必输字段', trigger: 'change' }],
        'cbd.distCatCode': [{ required: true, message: '必输字段', trigger: 'change' }],
        'cbd.regulStartDtType': [{ required: true, message: '必输字段', trigger: 'change' }],
        'cbd.regulEndDtType': [{ required: true, message: '必输字段', trigger: 'change' }],
        'cbd.amtType': [{ required: true, message: '必输字段', trigger: 'change' }],
        'cbd.amtTypeAType': [{ required: true, message: '必输字段', trigger: 'change' }],
        'cbd.distAmt': [{ required: true, message: '必输字段', trigger: 'change' }],
        'cbd.cpiIncreasePercent': [{ required: true, message: '必输字段', trigger: 'change' }],
        'cbd.calendarType': [{ required: true, message: '必输字段', trigger: 'change' }],
        'cbd.holidayAdjustType': [{ required: true, message: '必输字段', trigger: 'change' }],
        'cbd.regulStartDt': [{ required: true, message: '必输字段', trigger: 'change' }],
        'cbd.regulStartCondition': [{ required: true, message: '必输字段', trigger: 'change' }],
        'cbd.regulEndDt': [{ required: true, message: '必输字段', trigger: 'change' }],
        'cbd.regulEndCondition': [{ required: true, message: '必输字段', trigger: 'change' }],
        'cbd.cpiIncreasePercentBase': [{ required: true, message: '必输字段', trigger: 'change' }],
        'cbd.amtTypeaStdType': [{ required: true, message: '必输字段', trigger: 'change' }],
        'cbd.amtTypeaStdNum': [{ required: true, message: '必输字段', trigger: 'change' }],
        'cbd.dayType': [{ required: true, message: '必输字段', trigger: 'change' }],
        'cbd.distTypeCondition': [{ required: true, message: '必输字段', trigger: 'change' }],
        'cbd.applyerName': [{ required: true, message: '必输字段', trigger: 'change' }],
        'cbd.areaCode': [{ required: true, message: '必输字段', trigger: 'change' }],
        'cbd.classificationOfFamousSchools': [{ required: true, message: '必输字段', trigger: 'change' }],
        'cbd.degreeClassification': [{ required: true, message: '必输字段', trigger: 'change' }],
      },
      dictOptionsData: [],
      url: {
        save: '/prj/displan/save',
        find: '/prj/displan/findDistplanById',
        findByPrjCode: '/prj/findByPrjCode',
        planListSave: '/prj/displan/planListSave',
        getIntPlanListNew: '/prj/displan/getIntPlanListNew',
        getDistplanId: '/prj/displan/getDistplanId',
      },
      pagination: {
        current: 1, //当前页数 v-model
        defaultCurrent: 1, //默认的当前页数
        defaultPageSize: 10, //每页显示几条数据
      },
      dataSource: [],
      columns: [
        {
          key: 'qc',
          title: '期次',
          dataIndex: 'qc',
          width: 50,
          customRender: (text, record, index) =>
            `${(this.pagination.current - 1) * this.pagination.defaultPageSize + (index + 1)}`,
        },
        {
          key: 'tday',
          title: '分配日',
          dataIndex: 'tday',
          width: 50,
          customRender: function (text, record, index) {
            return text.substring(0, 10)
          },
        },
        {
          key: 'distAmt',
          title: '分配金额/比例',
          dataIndex: 'distAmt',
          width: 50,
          customRender: function (text) {
            if (text == null || text === '') {
              return '--'
            } else {
              return text
            }
          },
        },
        {
          key: 'amtRangeType',
          title: '分配财产来源',
          dataIndex: 'amtRangeType',
          width: 50,
          customRender: function (text) {
            if (text == null || text === '') {
              return '--'
            } else {
              return filterDictText(that.dictOptionsData['AMT_SOURCE_TYPE'], text)
            }
          },
        },
        {
          key: 'amtBase',
          title: '分配基数',
          dataIndex: 'amtBase',
          width: 50,
          customRender: function (text) {
            if (text == null || text === '') {
              return '--'
            } else {
              return filterDictText(that.dictOptionsData['AMT_CALCULATION_BASE'], text)
            }
          },
        },
        {
          key: 'dataGenType',
          title: '计划分类',
          dataIndex: 'dataGenType',
          width: 50,
          customRender: function (text) {
            return filterDictText(that.dictOptionsData['DATA_GEN_TYPE'], text)
          },
        },
      ],
    }
  },
  props: {
    optType: {
      default: 'view_v',
    },
    id: {
      default: '',
    },
    // 审核单业务key
    businessKey: {
      default: '',
    },
  },
  created() {
    let that = this
    that.confirmLoading = true
    initDictOptionsBatch(
      'AMT_CALCULATION_BASE,AMT_SOURCE_TYPE,DATA_GEN_TYPE,APPLYER_NAME,TRX_SUB_TYPES,DIST_TYPE,DIS_START_TYPE,AMT_TYPE,AMT_TYPE_A_TYPE,EVERY_DIS_LMT_TYPE,DIS_TIMES_LMT_TYPE,TERM_UNIT,MONTHS,INT_RULE_WEEK_TYPE,INT_RULE_DAY_TYPE,INT_RULE_WEEK_NUM_TYPE,WORK_NATURE_DAY'
    ).then((res) => {
      if (res.success) {
        that.dictOptionsData = res.result
      }
      that.confirmLoading = false
    })
    //审核页面加载
    if (that.businessKey) {
      this.id = this.businessKey.split(':')[1]
    }
    that.getDate()
    //查看加载数据
    that.getInfoDistplan()
  },
  methods: {
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      const that = this
      that.getPartyName()
      if (that.form.cbd.partyName === '') {
        that.$message.error('受益人不能为空')
        return false
      }
      // 触发表单验证
      that.$refs.form.validate((valid) => {
        if (valid) {
          //校验开始日小于结束日
          if (!that.checkDate()) {
            that.$message.error('结束日需要大于开始日')
            return false
          }
          that.confirmLoading = true
          //保存分配计划
          if (that.dataSource.length !== 0) {
            console.log('that.dataSource', that.dataSource)
            postAction(that.url.planListSave, that.dataSource)
              .then((res) => {
                if (res.success) {
                } else {
                  that.$message.error(res.message)
                }
              })
              .finally(() => {
                that.confirmLoading = false
              })
          }

          that.form.cbd.prjCode = that.$route.query.prjCode
          postAction(that.url.save, { cbd: that.form.cbd, disId: that.disId })
            .then((res) => {
              if (res.success) {
                that.$message.success('保存成功！' + res.message)
                if (res.message !== '') {
                  //在存续中的项目启动审核流   未成立的项目不启动审核流
                  that.$refs.wkfUserForm.edit(res.message)
                  that.$refs.wkfUserForm.disableSubmit = false
                }
                that.handleCancel()
              } else {
                that.$message.error(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
            })
        } else {
          that.$message.error('校验未通过')
          return false
        }
      })
    },
    handleCancel() {
      this.close()
      this.$emit('close')
    },
    resetForm() {
      this.$refs.form.clearValidate()
      const that = this
      if (that.form.cbd.amtType === 'A') {
        that.$set(that.form.cbd, 'amtRangeType', '')
        that.$set(that.form.cbd, 'amtBase', '')
        that.$set(that.form.cbd, 'amtDistributionRatio', '')
      }
      if (that.form.cbd.amtType === 'P') {
        that.$set(that.form.cbd, 'cpiIncreasePercent', '')
        that.$set(that.form.cbd, 'amtTypeaStdType', '')
        that.$set(that.form.cbd, 'amtTypeaStdNum', '')

        that.$set(that.form.cbd, 'amtTypeAType', '')
        that.$set(that.form.cbd, 'distAmt', '')
        that.$set(that.form.cbd, 'cpiIncreasePercentBase', '')
      }
    },
    wkfUserComplete() {
      this.$emit('ok')
    },
    getPartyName() {
      const that = this
      that.form.cbd.partyName = ''
      let partyNameArr = that.$refs.BiRelPartyTag.getValue()

      if(Array.isArray(partyNameArr)){
        partyNameArr.forEach((item) => {
          that.form.cbd.partyName += item + ','
        })
        that.form.cbd.partyName = that.form.cbd.partyName.substr(0, that.form.cbd.partyName.length - 1)
      } else {
        this.form.cbd.partyName = partyNameArr
      }
    },
    //校验结束日不能小于开始日
    checkDate() {
      const that = this
      const regulStartDt = that.form.cbd.regulStartDt
      const regulEndDt = that.form.cbd.regulEndDt
      if (
        that.form.cbd.regulStartDtType != '5' &&
        that.form.cbd.regulEndDtType != '3' &&
        regulStartDt !== '' &&
        regulEndDt !== ''
      ) {
        return moment(regulStartDt).isSameOrBefore(regulEndDt)
      }
      return true
    },
    distCatCodeChange(e) {
      if (this.customizeEnv === 'zrt') {
        if (this.form.cbd.distCatCode === 'LOA0404' || this.form.cbd.distCatCode === 'LOA0405') {
          this.showFlag = false
        } else {
          this.showFlag = true
        }
      }
      this.form.bnfs = []
      const that = this
      that.$set(that.form.cbd, 'distTypeCode', '')
      //将 条件分配：起始日、结束日、遇节假日调整方式、参考日历、分配日为非必填
      let rule = [{ required: true, message: '必输字段', trigger: 'change' }]
      if (e === 'LOA0402') {
        rule = [{ required: false, message: '必输字段', trigger: 'change' }]
      }
      that.rules['cbd.regulStartDt'] = rule
      that.rules['cbd.regulEndDt'] = rule
      that.rules['cbd.calendarType'] = rule
      that.rules['cbd.holidayAdjustType'] = rule
      that.rules['cbd.dayType'] = rule
    },
    getInfoDistplan() {
      const that = this
      if (that.id) {
        that.loading = true
        getAction(that.url.find, { id: that.id })
          .then((res) => {
            if (res.success) {
              that.form.cbd = res.result.bnfDisPlanVO.cbd
              that.dataSource = res.result.cusBnfDistplanList
              that.form.bnfs = res.result.bnfDisPlanVO.cbd.partyName.split(',')
            } else {
              that.$message.error(res.message)
            }
          })
          .finally(() => {
            that.loading = false
          })
      } else {
        postAction(that.url.getDistplanId)
          .then((res) => {
            if (res.success) {
              that.disId = res.message
            } else {
              that.$message.error(res.message)
            }
            console.log('that.disId', that.disId)
          })
          .finally(() => {
            that.loading = false
          })
      }
    },
    getDate() {
      const that = this
      //将项目成立日和终止日 封闭期数据带进来
      that.prjCode = that.$route.query.prjCode
      if (that.prjCode) {
        let param = { cli: { prjCode: that.prjCode } }
        that.loading = true
        httpAction(that.url.findByPrjCode, param, 'post').then((res) => {
          if (res.success) {
            that.form.cli = res.result.cli
            that.form.clci = res.result.clci
          } else {
            that.$error({
              title: res.message,
            })
          }
        })
      }
    },
    regulDtTypeChange(e, type) {
      const that = this
      if (type === 'start' && e === '2') {
        that.$set(that.form.cbd, 'regulStartDt', that.form.cli.trustStdDt)
      } else if (type === 'start' && e === '3') {
        if (that.form.cli.trustStdDt === null || that.form.cli.trustStdDt === 'undefined') {
          that.$message.error('未维护 项目成立日期')
        }
        if (that.form.clci.closedUnit === null || that.form.clci.closedUnit === 'undefined') {
          that.$message.error('未维护 封闭期单位')
        }
        if (that.form.clci.closedPeriod === null || that.form.clci.closedPeriod === 'undefined') {
          that.$message.error('未维护 封闭期')
        }
        that.$set(
          that.form.cbd,
          'regulStartDt',
          that.DateAdd(that.form.clci.closedUnit, that.form.clci.closedPeriod, that.form.cli.trustStdDt)
        )
      } else if (type === 'start' && e === '4') {
        that.$set(that.form.cbd, 'regulStartDt', that.form.cli.trustExprDt)
      } else if (type === 'start' && e === '5') {
        that.$set(that.form.cbd, 'regulStartDt', '')
      } else if (type === 'end' && e === '2') {
        that.$set(that.form.cbd, 'regulEndDt', that.form.cli.trustExprDt)
      } else if (type === 'end' && e === '3') {
        that.$set(that.form.cbd, 'regulEndDt', '')
      }
    },
    getIntPlanListNew() {
      const that = this
      if (that.checkPlanData()) {
        that.$message.error('分配日填写信息不完整')
        return
      }
      if (that.form.cbd.regulStartDt == null || that.form.cbd.regulStartDt === '') {
        that.$message.error('开始日 固定日期不能为空')
        return
      }
      if (that.form.cbd.dayType === '1') {
        if (that.form.cbd.calendarType == null || that.form.cbd.calendarType === '') {
          that.$message.error('自然年度，参考日历不能为空')
          return
        }
        if (that.form.cbd.holidayAdjustType == null || that.form.cbd.holidayAdjustType === '') {
          that.$message.error('自然年度，遇节假日调整方式不能为空')
          return
        }
      }
      postAction(that.url.getIntPlanListNew, { cbd: that.form.cbd, disId: that.disId })
        .then((res) => {
          if (res.success) {
            that.dataSource = res.result
            that.$message.success('分配计划生成成功！' + res.message)
          } else {
            that.$message.error(res.message)
          }
        })
        .finally(() => {
          that.confirmLoading = false
        })
    },
    //校验分配计划数据填写是否完整
    checkPlanData() {
      const that = this
      let flag = false
      if (that.form.cbd.dayType == null || that.form.cbd.dayType == '') {
        flag = true
      }
      if (that.form.cbd.dayType == '2') {
        //按信托年度
        if (
          that.form.cbd.trustOpenDayTfix == null ||
          that.form.cbd.trustOpenDayTfix == '' ||
          that.form.cbd.trustOpenDayRule == null ||
          that.form.cbd.trustOpenDayRule == ''
        ) {
          flag = true
        }
      }
      if (that.form.cbd.dayType == '1') {
        //按自然年度
        if (that.form.cbd.yearTfix == null || that.form.cbd.yearTfix == '') {
          flag = true
        }
        if (that.form.cbd.yearTfix == 'Y') {
          if (that.form.cbd.dateNumbers == null || that.form.cbd.dateNumbers == '') {
            flag = true
          }
          if (that.form.cbd.monthList == null || that.form.cbd.monthList == '') {
            flag = true
          }
          if (that.form.cbd.ruleTermUnit == null || that.form.cbd.ruleTermUnit == '') {
            flag = true
          }
          //按日
          if (that.form.cbd.ruleTermUnit == '0') {
            if (that.form.cbd.openRuleOrder == null || that.form.cbd.openRuleOrder == '') {
              flag = true
            }
            if (that.form.cbd.ruleOrder == null || that.form.cbd.ruleOrder == '') {
              flag = true
            }
            if (that.form.cbd.openRuleOrder == '2' || that.form.cbd.openRuleOrder == '3') {
              if (that.form.cbd.workdayType == null || that.form.cbd.workdayType == '') {
                flag = true
              }
            }
          }
          //按周
          if (that.form.cbd.ruleTermUnit == '1') {
            if (that.form.cbd.openRuleOrder == null || that.form.cbd.openRuleOrder == '') {
              flag = true
            }
            if (that.form.cbd.openRuleOrder == '2' || that.form.cbd.openRuleOrder == '3') {
              if (that.form.cbd.weekIdx == null || that.form.cbd.weekIdx == '') {
                flag = true
              }
            }
            if (that.form.cbd.weekDayList == null || that.form.cbd.weekDayList == '') {
              flag = true
            }
            if (that.form.cbd.ruleOrder == null || that.form.cbd.ruleOrder == '') {
              flag = true
            }
            if (that.form.cbd.weekDayList == '2' || that.form.cbd.weekDayList == '3') {
              if (that.form.cbd.workdayType == null || that.form.cbd.workdayType == '') {
                flag = true
              }
            }
          }
        }
        if (that.form.cbd.yearTfix == 'M') {
          if (that.form.cbd.ruleTermUnit == null || that.form.cbd.ruleTermUnit == '') {
            flag = true
          }
          //按日
          if (that.form.cbd.ruleTermUnit == '0') {
            if (that.form.cbd.openRuleOrder == null || that.form.cbd.openRuleOrder == '') {
              flag = true
            }
            if (that.form.cbd.ruleOrder == null || that.form.cbd.ruleOrder == '') {
              flag = true
            }
            if (that.form.cbd.openRuleOrder == '2' || that.form.cbd.openRuleOrder == '3') {
              if (that.form.cbd.workdayType == null || that.form.cbd.workdayType == '') {
                flag = true
              }
            }
          }
          //按周
          if (that.form.cbd.ruleTermUnit == '1') {
            if (that.form.cbd.openRuleOrder == null || that.form.cbd.openRuleOrder == '') {
              flag = true
            }
            if (that.form.cbd.openRuleOrder == '2' || that.form.cbd.openRuleOrder == '3') {
              if (that.form.cbd.weekIdx == null || that.form.cbd.weekIdx == '') {
                flag = true
              }
            }
            if (that.form.cbd.weekDayList == null || that.form.cbd.weekDayList == '') {
              flag = true
            }
            if (that.form.cbd.ruleOrder == null || that.form.cbd.ruleOrder == '') {
              flag = true
            }
            if (that.form.cbd.weekDayList == '2' || that.form.cbd.weekDayList == '3') {
              if (that.form.cbd.workdayType == null || that.form.cbd.workdayType == '') {
                flag = true
              }
            }
          }
        }
        if (that.form.cbd.yearTfix == 'J') {
          if (that.form.cbd.ruleTermUnit == null || that.form.cbd.ruleTermUnit == '') {
            flag = true
          }
          //按日
          if (that.form.cbd.ruleTermUnit == '0') {
            if (that.form.cbd.openRuleOrder == null || that.form.cbd.openRuleOrder == '') {
              flag = true
            }
            if (that.form.cbd.ruleOrder == null || that.form.cbd.ruleOrder == '') {
              flag = true
            }
            if (that.form.cbd.openRuleOrder == '2' || that.form.cbd.openRuleOrder == '3') {
              if (that.form.cbd.workdayType == null || that.form.cbd.workdayType == '') {
                flag = true
              }
            }
          }
          //按周
          if (that.form.cbd.ruleTermUnit == '1') {
            if (that.form.cbd.openRuleOrder == null || that.form.cbd.openRuleOrder == '') {
              flag = true
            }
            if (that.form.cbd.openRuleOrder == '2' || that.form.cbd.openRuleOrder == '3') {
              if (that.form.cbd.weekIdx == null || that.form.cbd.weekIdx == '') {
                flag = true
              }
            }
            if (that.form.cbd.weekDayList == null || that.form.cbd.weekDayList == '') {
              flag = true
            }
            if (that.form.cbd.ruleOrder == null || that.form.cbd.ruleOrder == '') {
              flag = true
            }
            if (that.form.cbd.weekDayList == '2' || that.form.cbd.weekDayList == '3') {
              if (that.form.cbd.workdayType == null || that.form.cbd.workdayType == '') {
                flag = true
              }
            }
          }
        }
        if (that.form.cbd.yearTfix == 'W') {
          if (that.form.cbd.weekDayList == null || that.form.cbd.weekDayList == '') {
            flag = true
          }
          if (that.form.cbd.ruleOrder == null || that.form.cbd.ruleOrder == '') {
            flag = true
          }
          if (that.form.cbd.weekDayList == '2' || that.form.cbd.weekDayList == '3') {
            if (that.form.cbd.workdayType == null || that.form.cbd.workdayType == '') {
              flag = true
            }
          }
        }
      }
      if (that.form.cbd.dayType == '2') {
        //把自然年度相关的值设为空
        that.form.cbd.yearTfix = ''
        that.form.cbd.dateNumbers = ''
        that.form.cbd.monthList = ''
        that.form.cbd.ruleTermUnit = ''
        that.form.cbd.openRuleOrder = ''
        that.form.cbd.ruleOrder = ''
        that.form.cbd.workdayType = ''
        that.form.cbd.weekIdx = ''
        that.form.cbd.weekDayList = ''
      }
      return flag
    },
    onChangeJDSelectTag() {
      //把自然年度相关的值设为空
      const that = this
      that.$set(that.form.cbd, 'monthList', '')
      that.$set(that.form.cbd, 'ruleTermUnit', '')
      that.$set(that.form.cbd, 'openRuleOrder', '')
      that.$set(that.form.cbd, 'ruleOrder', '')
      that.$set(that.form.cbd, 'workdayType', '')
      that.$set(that.form.cbd, 'weekIdx', '')
      that.$set(that.form.cbd, 'weekDayList', '')
    },
    tableChange(pagination, filters, sorter) {
      this.pagination = pagination
    },
    initPage(data) {
      console.log('data', data)
    },
    /*
     * 功能:实现VBScript的DateAdd功能.
     * 参数:interval,字符串表达式，表示要添加的时间间隔.
     * 参数:number,数值表达式，表示要添加的时间间隔的个数.
     * 参数:trustStdDt,时间对象.
     * 返回:新的时间对象.
     */
    /**
     * @return {string}
     */
    DateAdd(interval, number, trustStdDt) {
      const that = this
      let date = new Date(trustStdDt)
      switch (interval) {
        case 'Y':
          date.setFullYear(date.getFullYear() + number)
          return that.timeToString(date)
        case 'M':
          date.setMonth(date.getMonth() + number)
          return that.timeToString(date)
        case 'J':
          date.setMonth(date.getMonth() + number + 3)
          return that.timeToString(date)
        case 'D':
          date.setDate(date.getDate() + number)
          return that.timeToString(date)
      }
    },
    //定义将Date对象转换为字符串函数
    timeToString(timeObj) {
      var str = ''
      var year = timeObj.getFullYear()
      var month = timeObj.getMonth() + 1
      var date = timeObj.getDate()
      str = year + '-' + month + '-' + date
      return str
    },
  },
}
</script>

<style lang="less" scoped>
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