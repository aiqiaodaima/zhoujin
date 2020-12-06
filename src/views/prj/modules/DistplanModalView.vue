<template>
    <a-spin :spinning="confirmLoading">
      <a-form-model :model="form" :rules="rules" ref="form" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }"
                    style="margin-right: 10px">
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-model-item label="分配名称" prop="cbd.distCatCode">
              <j-d-select-tag v-if="optType !== 'view'" :disabled="optType == 'view_v'" v-model="form.cbd.distCatCode"
                              dict-code="TRX_SUB_TYPES"
                              :filters="[{fieldName:'value',fieldValue:'LOA04'}]"></j-d-select-tag>
              <span v-else>{{ fdText('TRX_SUB_TYPES', form.cbd.distCatCode) }}</span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="分配细类">
              <j-d-select-tag v-if="optType !== 'view'" :disabled="optType == 'view_v'" v-model="form.cbd.distTypeCode"
                              dict-code="DIST_TYPE"
                              ref="JDSelectTag"
                              :filters="[{fieldName:'value',fieldValue:form.cbd.distCatCode}]"></j-d-select-tag>
              <span v-else>{{ fdText('DIST_TYPE', form.cbd.distCatCode) }}</span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.cbd.distTypeCode ==='LOA0401LOA0402OTH'">
            <a-form-model-item label="分配细类描述" prop="cbd.distTypeCondition">
              <a-input v-if="optType !== 'view'" :disabled="optType == 'view_v'"
                       v-model="form.cbd.distTypeCondition"></a-input>
              <span v-else>{{ form.distTypeCondition }}</span>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-model-item :label="customizeEnv==='zrt'?'分配对象':'受益人'" :required="true">
              <bi-rel-party-tag :prj-code="this.$route.query.prjCode" rel-type="BENEFICIARY" ref="BiRelPartyTag"
                                :disabled="optType === 'view_v'"
                                :defaultValue="form.bnfs" v-model="form.bnfs"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="申请人" prop="cbd.applyerName">
              <j-d-select-tag v-if="optType !== 'view'" :disabled="optType == 'view_v'" v-model="form.cbd.applyerName"
                              dict-code="APPLYER_NAME"
                              ref="JDSelectTag"></j-d-select-tag>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-model-item label="开始日" prop="cbd.regulStartDtType">
              <j-d-select-tag v-if="optType !== 'view'" :disabled="optType == 'view_v'" dict-code="DIS_START_TYPE"
                              v-model="form.cbd.regulStartDtType"
                              @change="(e)=>regulDtTypeChange(e,'start')"></j-d-select-tag>
              <span v-else>{{ fdText('DIS_START_TYPE', form.cbd.regulStartDtType) }}</span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.cbd.regulStartDtType !='5'">
            <a-form-model-item label="固定日期" prop="cbd.regulStartDt">
              <j-date v-if="optType !== 'view'" :disabled="optType == 'view_v'"
                      v-model="form.cbd.regulStartDt"></j-date>
              <span v-else>{{ moment(form.cbd.regulStartDt,'yyyy-MM-dd') }}</span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.cbd.regulStartDtType ==='5'">
            <a-form-model-item label="不确定开始日描述" prop="cbd.regulStartCondition">
              <a-input v-if="optType !== 'view'" :disabled="optType == 'view_v'"
                       v-model="form.cbd.regulStartCondition"></a-input>
              <span v-else>{{ form.cbd.regulStartCondition }}</span>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-model-item label="结束日" prop="cbd.regulEndDtType">
              <j-d-select-tag v-if="optType !== 'view'" :disabled="optType == 'view_v'" dict-code="DIS_END_TYPE"
                              v-model="form.cbd.regulEndDtType" @change="(e)=>regulDtTypeChange(e,'end')"/>
              <span v-else>{{ fdText('DIS_END_TYPE', form.cbd.regulEndDtType) }}</span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.cbd.regulEndDtType !='3'">
            <a-form-model-item label="固定日期" prop="cbd.regulEndDt">
              <j-date v-if="optType !== 'view'" :disabled="optType == 'view_v'" v-model="form.cbd.regulEndDt"></j-date>
              <span v-else>{{ moment(form.cbd.regulEndDt,'yyyy-MM-dd') }}</span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.cbd.regulEndDtType ==='3'">
            <a-form-model-item label="不确定结束日描述" prop="cbd.regulEndCondition">
              <a-input v-if="optType !== 'view'" :disabled="optType == 'view_v'"
                       v-model="form.cbd.regulEndCondition"></a-input>
              <span v-else>{{ form.regulEndCondition }}</span>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-model-item label="按金额分配/比例分配" :labelCol="{span: 3}" :wrapperCol="{span: 21}" prop="cbd.amtType">
              <j-d-select-tag v-if="optType !== 'view'" :disabled="optType == 'view_v'" dict-code="AMT_TYPE"
                              v-model="form.cbd.amtType"></j-d-select-tag>
              <span v-else>{{ fdText('AMT_TYPE', form.cbd.amtType) }}</span>
            </a-form-model-item>
          </a-col>

          <a-col v-if="form.cbd.amtType === 'A'" :span="24">
            <a-form-model-item label="分配金额类型" :labelCol="{span: 3}" :wrapperCol="{span: 21}" prop="cbd.amtTypeAType">
              <j-d-select-tag v-if="optType !== 'view'" :disabled="optType == 'view_v'" dict-code="AMT_TYPE_A_TYPE"
                              v-model="form.cbd.amtTypeAType"></j-d-select-tag>
              <span v-else>{{ fdText('AMT_TYPE_A_TYPE', form.cbd.amtTypeAType) }}</span>
            </a-form-model-item>
          </a-col>

          <a-col v-if="form.cbd.amtType === 'A' && ('145'.indexOf(form.cbd.amtTypeAType||'')>-1)"
                 :span="form.cbd.amtTypeAType==='1'?24:8" :pull="form.cbd.amtTypeAType==='1'?6:0">
            <a-form-model-item :label="form.cbd.amtTypeAType==='1'?'固定金额':'首次金额'" prop="cbd.distAmt">
              <a-input-number v-if="optType !== 'view'" :disabled="optType == 'view_v'" v-model="form.cbd.distAmt"
                              :min="0.01"
                              style="width: 100%"></a-input-number>
              <span v-else>{{ form.cbd.distAmt }}</span>
            </a-form-model-item>
          </a-col>

          <!--          添加按比例分配录入项-->
          <a-col v-if="form.cbd.amtType === 'P'" :span="8">
            <a-form-model-item label="财产来源" prop="cbd.amtRangeType">
              <j-d-select-tag v-if="optType !== 'view'" :disabled="optType == 'view_v'" dict-code="AMT_SOURCE_TYPE"
                              v-model="form.cbd.amtRangeType"></j-d-select-tag>
              <span v-else>{{ fdText('AMT_TYPE_A_TYPE', form.cbd.amtTypeAType) }}</span>
            </a-form-model-item>
          </a-col>
          <a-col v-if="form.cbd.amtType === 'P'&&form.cbd.amtRangeType==='2'" :span="8">
            <a-form-model-item label="计算基数" prop="cbd.amtBase">
              <j-d-select-tag v-if="optType !== 'view'" :disabled="optType == 'view_v'" dict-code="AMT_CALCULATION_BASE"
                              v-model="form.cbd.amtBase"></j-d-select-tag>
              <span v-else>{{ fdText('AMT_CALCULATION_BASE', form.cbd.amtBase) }}</span>
            </a-form-model-item>
          </a-col>
          <a-col v-if="form.cbd.amtType === 'P'" :span="8">
            <a-form-model-item label="分配比例%" prop="cbd.amtDistributionRatio">
              <a-input-number v-if="optType !== 'view'" :disabled="optType == 'view_v'"
                              v-model="form.cbd.amtDistributionRatio"
                              style="width: 100%"></a-input-number>
            </a-form-model-item>
          </a-col>
          <a-col v-if="'45'.indexOf(form.cbd.amtTypeAType||'')>-1" :span="8">
            <a-form-model-item label="开始时间" prop="cbd.cpiIncreasePercentBase"
                               v-if="form.cbd.amtType==='A'&&form.cbd.amtTypeAType==='5'">
              <j-d-select-tag v-if="optType !== 'view'" :disabled="optType == 'view_v'" dict-code="AMT_TYPEA_STD_TYPE"
                              v-model="form.cbd.cpiIncreasePercentBase"></j-d-select-tag>
              <span v-else>{{ fdText('AMT_TYPEA_STD_TYPE', form.cbd.cpiIncreasePercentBase) }}</span>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row v-if="form.cbd.amtTypeAType === '5'&&form.cbd.amtType==='A'">
          <a-col :span="8">
            <a-form-model-item label="调整比例" prop="cbd.cpiIncreasePercent">
              <a-input-number v-if="optType !== 'view'" :disabled="optType == 'view_v'"
                              v-model="form.cbd.cpiIncreasePercent" :min="0.01"/>
              %
            </a-form-model-item>
          </a-col>
          <a-col :span="4" pull="3">
            <a-form-model-item label="" prop="cbd.amtTypeaStdType">
              <j-d-select-tag v-if="optType !== 'view'" :disabled="optType == 'view_v'" dict-code="AMT_TYPEA_ADJFRQ"
                              v-model="form.cbd.amtTypeaStdType"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="3" pull="4">
            <a-form-model-item label="" prop="cbd.amtTypeaStdNum" v-if="form.cbd.amtTypeaStdType =='2'">
              <a-input v-model="form.cbd.amtTypeaStdNum" :disabled="optType == 'view_v'"
                       addon-after="月"/>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-model-item label="每次分配金额限制">
              <j-d-select-tag v-if="optType !== 'view'" :disabled="optType == 'view_v'" dict-code="EVERY_DIS_LMT_TYPE"
                              v-model="form.cbd.everyDisLmtType"></j-d-select-tag>
              <span v-else>{{ fdText('EVERY_DIS_LMT_TYPE', form.everyDisLmtType) }}</span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="金额">
              <a-input-number v-if="optType !== 'view'" :disabled="optType == 'view_v'"
                              v-model="form.cbd.everyDisLmtAmt"
                              :min="0.01"
                              style="width: 100%"></a-input-number>
              <span v-else>{{ form.everyDisLmtAmt }}</span>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-model-item label="每年分配金额限制">
              <j-d-select-tag v-if="optType !== 'view'" :disabled="optType == 'view_v'" dict-code="EVERY_DIS_LMT_TYPE"
                              v-model="form.cbd.everyYearLmtType"></j-d-select-tag>
              <span v-else>{{ fdText('DIS_TIMES_LMT_TYPE', form.cbd.everyYearLmtType) }}</span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="金额">
              <a-input-number v-if="optType !== 'view'" :disabled="optType == 'view_v'"
                              v-model="form.cbd.everyYearLmtAmt"
                              :min="0"
                              style="width: 100%"></a-input-number>
              <span v-else>{{ form.cbd.everyYearLmtAmt }}</span>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-model-item label="累计分配金额限制">
              <j-d-select-tag v-if="optType !== 'view'" :disabled="optType == 'view_v'" dict-code="ALL_DIS_LMT_TYPE"
                              v-model="form.cbd.allDisLmtType"></j-d-select-tag>
              <span v-else>{{ fdText('ALL_DIS_LMT_TYPE', form.allDisLmtType) }}</span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="金额">
              <a-input-number v-if="optType !== 'view'" :disabled="optType == 'view_v'" v-model="form.cbd.allDisLmtAmt"
                              :min="0.01"
                              style="width: 100%"></a-input-number>
              <span v-else>{{ form.allDisLmtAmt }}</span>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-model-item label="分配次数限制">
              <j-d-select-tag v-if="optType !== 'view'" :disabled="optType == 'view_v'" dict-code="DIS_TIMES_LMT_TYPE"
                              v-model="form.cbd.disTimesLmtType"></j-d-select-tag>
              <span v-else>{{ fdText('DIS_TIMES_LMT_TYPE', form.disTimesLmtType) }}</span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="次数">
              <a-input-number v-if="optType !== 'view'" :disabled="optType == 'view_v'" v-model="form.cbd.disTimesLmt"
                              :min="0"
                              style="width: 100%"></a-input-number>
              <span v-else>{{ form.disTimesLmt }}</span>
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-model-item label="参考日历" prop="cbd.calendarType">
              <j-d-select-tag v-if="optType !== 'view'" :disabled="optType == 'view_v'" dict-code="CALENDAR_TYPE"
                              v-model="form.cbd.calendarType"></j-d-select-tag>
              <span v-else>{{ fdText('CALENDAR_TYPE', form.calendarType) }}</span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="遇节假日调整方式" prop="cbd.holidayAdjustType">
              <j-d-select-tag v-if="optType !== 'view'" :disabled="optType == 'view_v'" dict-code="HOLIDAY_ADJUST_TYPE"
                              v-model="form.cbd.holidayAdjustType"></j-d-select-tag>
              <span v-else>{{ fdText('HOLIDAY_ADJUST_TYPE', form.holidayAdjustType) }}</span>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-model-item label="分配日" :labelCol="{span: 3}" :wrapperCol="{span: 21}" prop="cbd.dayType">
              <!--              分配日类型-->
              <j-d-select-tag v-if="optType !== 'view'" :disabled="optType == 'view_v'" dict-code="RPT_YEAR"
                              v-model="form.cbd.dayType"
                              style="width: 95px"></j-d-select-tag>
              <span v-else>{{ fdText('DIS_RPT_TYPE', form.cbd.dayType) }}</span>
              <!--              自然日-->
              <span v-if="form.cbd.dayType === '1'">
                <span>每</span>
              <span v-if="form.cbd.yearTfix==='Y'">
                <a-input-number v-if="optType !== 'view'" :disabled="optType == 'view_v'"
                                v-model="form.cbd.dateNumbers" :min="1" :max="100" style="width: 60px"/>
              </span>
                <j-d-select-tag v-if="optType !== 'view'" :disabled="optType == 'view_v'" dict-code="TERM_UNIT"
                                v-model="form.cbd.yearTfix" style="width: 90px"/>
                <span v-else>{{ fdText('TERM_UNIT', form.cbd.yearTfix) }}</span>

                <span v-if="form.cbd.yearTfix==='Y'">
                  <j-multi-select-tag v-if="optType !== 'view'" :disabled="optType == 'view_v'" dict-code="MONTHS"
                                      v-model="form.cbd.monthList"  style="width: 200px"/>
                  <span v-else>{{ fdText('MONTHS', form.cbd.monthList) }}</span>
                </span>

                <!--按周还是按日-->
                <span v-if="form.cbd.yearTfix==='Y'||form.cbd.yearTfix==='M'">
                  <j-d-select-tag v-if="optType !== 'view'" :disabled="optType == 'view_v'"
                                  dict-code="INT_RULE_TERM_UNIT" v-model="form.cbd.ruleTermUnit" style="width: 70px"/>
                  <span v-else>{{ fdText('INT_RULE_TERM_UNIT',form.cbd.ruleTermUnit) }}</span>
                </span>
                <!--选择周或者日排序方式-->
                <span v-if="form.cbd.yearTfix==='Y'||form.cbd.yearTfix==='M'">
                  <j-d-select-tag v-if="optType !== 'view'" :disabled="optType == 'view_v'"
                                  :dict-code="form.cbd.ruleTermUnit === '1'?'INT_RULE_BY_WEEK':'INT_RULE_DAY_TYPE'"
                                  v-model="form.cbd.openRuleOrder" style="width: 100px"/>
                  <span v-else>{{ fdText(form.cbd.ruleTermUnit === '1'?'INT_RULE_BY_WEEK':'INT_RULE_DAY_TYPE', form.cbd.openRuleOrder) }}</span>
                </span>

                <!--周的具体数值-->
                <span
                  v-if="(form.cbd.yearTfix==='Y'||form.cbd.yearTfix==='M')&&(form.cbd.ruleTermUnit==='1'&&form.cbd.openRuleOrder!=='1')">
                  <a-input-number v-if="optType !== 'view'" :disabled="optType == 'view_v'" v-model="form.cbd.weekIdx"
                                  :min="1" :max="365" style="width: 60px"/>
                  <span v-else>{{ form.cbd.weekIdx}}</span>
                </span>
                <span v-if="(form.cbd.yearTfix==='Y'||form.cbd.yearTfix==='M')&&(form.cbd.ruleTermUnit==='1')">
                    周的
                </span>

                <span
                  v-if="(form.cbd.yearTfix==='Y'||form.cbd.yearTfix==='M'||form.cbd.yearTfix==='W')&&form.cbd.yearTfix!=='D'&&form.cbd.ruleTermUnit!=='0'">
                  <j-d-select-tag v-if="optType !== 'view'" :disabled="optType == 'view_v'"
                                  dict-code="INT_RULE_WEEK_NUM_TYPE" v-model="form.cbd.weekDayList"
                                  style="width: 110px"/>
                    <span v-else>{{ fdText('INT_RULE_WEEK_NUM_TYPE', form.cbd.weekDayList) }}</span>
                  </span>
                <span v-if="form.cbd.yearTfix==='Y'||form.cbd.yearTfix==='M'||form.cbd.yearTfix==='W'">
                   <a-input-number v-if="optType !== 'view'" :disabled="optType == 'view_v'"
                                   v-model="form.cbd.ruleOrder" :min="1" :max="365" style="width: 60px"/>
                  <span v-else>{{ form.cbd.ruleOrder }}</span>
                </span>

                <span
                  v-if="(form.cbd.yearTfix==='Y'||form.cbd.yearTfix==='M'||form.cbd.yearTfix==='W')&&((form.cbd.ruleTermUnit==='1'&&form.cbd.weekDayList !== '1')||(form.cbd.ruleTermUnit==='0'&&form.cbd.openRuleOrder!=='1')||(form.cbd.yearTfix==='W'&&form.cbd.weekDayList !== '1'))">
                  个
                  <j-d-select-tag v-if="optType !== 'view'" :disabled="optType == 'view_v'" dict-code="WORK_NATURE_DAY"
                                  v-model="form.cbd.workdayType" style="width: 90px"/>
                  <span v-else>{{ fdText('WORKDAY_TYPE', form.cbd.workdayType) }}</span>
                 </span>
              </span>
              <!--              信托日-->
              <span v-if="form.cbd.dayType === '2'">
              每
              <a-input-number v-if="optType !== 'view'" :disabled="optType == 'view_v'"
                              v-model="form.cbd.trustOpenDayTfix" :min="1" :max="365"
                              style="width: 80px"/>
              <span v-else>{{ form.cbd.trustOpenDayTfix }}</span>

              <j-d-select-tag v-if="optType !== 'view'" :disabled="optType == 'view_v'" dict-code="TERM_UNIT"
                              v-model="form.cbd.trustOpenDayRule" style="width: 90px"/>
              <span v-else>{{ fdText('TERM_UNIT', form.cbd.trustOpenDayRule) }}</span>
              </span>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24" :pull="6">
            <BiFormItemTextarea label="资格验证" v-model="form.cbd.recAdopt" name="recAdopt" placeholder="资格验证"
                                :disabled="optType == 'view_v'"/>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24" :pull="6">
            <BiFormItemTextarea label="备注" v-model="form.cbd.memo" name="memo" placeholder="备注"
                                :disabled="optType == 'view_v'"/>
          </a-col>
        </a-row>

      </a-form-model>
      <a-row type="flex" justify="center"
             v-if="(form.cbd.distCatCode ==='LOA0401'&&form.cbd.regulStartDtType!=='5'&&form.cbd.regulStartDt!=='')||(form.cbd.distCatCode ==='LOA0402'&&form.cbd.calendarType!==''&&form.cbd.holidayAdjustType!==''&&form.cbd.regulStartDt!==''&&form.cbd.dayType!=='')">
        <a-col :span="24">
          <h3>分配计划</h3>
          <a-table
            ref="table"
            size="small"
            bordered
            :columns="columns"
            :dataSource="dataSource"
            :pagination='pagination'
            @change='tableChange'
          >
          </a-table>
        </a-col>
      </a-row>
    </a-spin>
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

  export default {
    name: 'DistplanModalView',
    components: { WkfNextUserModal, JDate, BiRelPartyTag, JDSelectTag, JMultiSelectTag },
    watch: {
      id: function(newVal, oldVal) {
        this.getInfoDistplan()
      },
    },
    data() {
      let that = this
      let customizeEnv = customizeConfigs.customizeEnv
      return {
        optType:'view_v',
        id:'',
        visible: true,
        title: '',
        confirmLoading: false,
        customizeEnv: customizeEnv,
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
            calendarType: ''
          },
          cli: {
            trustStdDt: '',
            trustExprDt: ''
          },
          bnfs: []
        },
        validatorRules: {},
        rules: {
          'cbd.amtRangeType': [
            { required: true, message: '必输字段', trigger: 'change' }
          ],
          'cbd.amtBase': [
            { required: true, message: '必输字段', trigger: 'change' }
          ],
          'cbd.amtDistributionRatio': [
            { required: true, message: '必输字段', trigger: 'change' }
          ],
          'cbd.distCatCode': [
            { required: true, message: '必输字段', trigger: 'change' }
          ],
          'cbd.regulStartDtType': [
            { required: true, message: '必输字段', trigger: 'change' }
          ],
          'cbd.regulEndDtType': [
            { required: true, message: '必输字段', trigger: 'change' }
          ],
          'cbd.amtType': [
            { required: true, message: '必输字段', trigger: 'change' }
          ],
          'cbd.amtTypeAType': [
            { required: true, message: '必输字段', trigger: 'change' }
          ],
          'cbd.distAmt': [
            { required: true, message: '必输字段', trigger: 'change' }
          ],
          'cbd.cpiIncreasePercent': [
            { required: true, message: '必输字段', trigger: 'change' }
          ],
          'cbd.calendarType': [
            { required: true, message: '必输字段', trigger: 'change' }
          ],
          'cbd.holidayAdjustType': [
            { required: true, message: '必输字段', trigger: 'change' }
          ],

          'cbd.regulStartDt': [
            { required: true, message: '必输字段', trigger: 'change' }
          ],
          'cbd.regulStartCondition': [
            { required: true, message: '必输字段', trigger: 'change' }
          ],
          'cbd.regulEndDt': [
            { required: true, message: '必输字段', trigger: 'change' }
          ],
          'cbd.regulEndCondition': [
            { required: true, message: '必输字段', trigger: 'change' }
          ],
          'cbd.cpiIncreasePercentBase': [
            { required: true, message: '必输字段', trigger: 'change' }
          ],
          'cbd.amtTypeaStdNum': [
            { required: true, message: '必输字段', trigger: 'change' }
          ],
          'cbd.dayType': [
            { required: false, message: '必输字段', trigger: 'change' }
          ],
          'cbd.distTypeCondition': [
            { required: true, message: '必输字段', trigger: 'change' }
          ],
          'cbd.applyerName': [
            { required: true, message: '必输字段', trigger: 'change' }
          ]

        },
        dictOptionsData: [],
        url: {
          save: '/prj/displan/save',
          find: '/prj/displan/findDistplanById',
          findByPrjCode: '/prj/findByPrjCode',
          createPlanAndSave: '/prj/displan/edit'
        },
        pagination: {
          current: 1,//当前页数 v-model
          defaultCurrent: 1,//默认的当前页数
          defaultPageSize: 10//每页显示几条数据
        },
        dataSource: [],
        columns: [
          {
            key: 'qc',
            title: '期次',
            dataIndex: 'qc',
            width: 50,
            customRender: (text, record, index) => `${(this.pagination.current - 1) * this.pagination.defaultPageSize + (index + 1)}`

          },
          {
            key: 'tday',
            title: '分配日',
            dataIndex: 'tday',
            width: 50,
            customRender: function(text, record, index) {
              return text.substring(0, 10)
            }

          },
          {
            key: 'distAmt',
            title: '分配金额/比例',
            dataIndex: 'distAmt',
            width: 50,
            customRender: function(text) {
              if (text==null || text === ''){
                return '--'
              }else{
                return  text
              }
            }
          },
          {
            key: 'amtRangeType',
            title: '分配财产来源',
            dataIndex: 'amtRangeType',
            width: 50,
            customRender: function(text) {
              if (text==null || text === ''){
                return '--'
              }else {
                return filterDictText(that.dictOptionsData['AMT_SOURCE_TYPE'], text)
              }
            }
          },
          {
            key: 'amtBase',
            title: '分配基数',
            dataIndex: 'amtBase',
            width: 50,
            customRender: function(text) {
              if (text==null || text === ''){
                return '--'
              }else{
                return filterDictText(that.dictOptionsData['AMT_CALCULATION_BASE'], text)
              }
            }
          },
          {
            key: 'dataGenType',
            title: '计划分类',
            dataIndex: 'dataGenType',
            width: 50,
            customRender: function(text) {
              return filterDictText(that.dictOptionsData['DATA_GEN_TYPE'], text)
            }

          }
        ]
      }
    },
    props: {
      // 审核单业务key
      businessKey:{
        default: ''
      }
    },
    created() {
      let that = this
      that.confirmLoading = true
      initDictOptionsBatch('AMT_CALCULATION_BASE,AMT_SOURCE_TYPE,DATA_GEN_TYPE,APPLYER_NAME,TRX_SUB_TYPES,DIST_TYPE,DIS_START_TYPE,AMT_TYPE,AMT_TYPE_A_TYPE,EVERY_DIS_LMT_TYPE,DIS_TIMES_LMT_TYPE,TERM_UNIT,MONTHS,INT_RULE_WEEK_TYPE,INT_RULE_DAY_TYPE,INT_RULE_WEEK_NUM_TYPE,WORK_NATURE_DAY').then((res) => {
        if (res.success) {
          that.dictOptionsData = res.result
        }
        that.confirmLoading = false
      })
      //审核页面加载
      if (that.businessKey){
        that.id= this.businessKey.split(':')[1]
      }
      //查看加载数据
      that.getInfoDistplan()
    },
    methods: {
      getPartyName() {
        const that = this
        that.form.cbd.partyName = ''
        let partyNameArr = that.$refs.BiRelPartyTag.getValue()
        partyNameArr.forEach((item) => {
            that.form.cbd.partyName += item + ','
          }
        )
        that.form.cbd.partyName = that.form.cbd.partyName.substr(0, that.form.cbd.partyName.length - 1)
      },
      async getInfoDistplan() {
        const that = this
        if (that.id) {
          that.loading = true
          getAction(that.url.find, { id: that.id })
            .then(res => {
              if (res.success) {
                that.form = res.result.bnfDisPlanVO;
                that.dataSource=res.result.cusBnfDistplanList
                that.form.bnfs = res.result.bnfDisPlanVO.cbd.partyName.split(',')
              } else {
                that.$message.error(res.message)
              }
            }).finally(() => {
            that.loading = false
          })
        }
      },
      tableChange(pagination, filters, sorter) {
        this.pagination = pagination
      },
    }
  }
</script>

<style lang="less" scoped>

</style>