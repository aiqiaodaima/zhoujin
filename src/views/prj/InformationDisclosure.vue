<template>
  <a-spin :spinning="loading">
    <a-layout>
      <a-layout-content>
        <a-card size="small" title="信息披露规则">
          <a-form-model :model="form" :rules="rules" ref="form" style="margin-right: 10px">
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-model-item  label="是否披露" :labelCol="{span: 3}" :wrapperCol="{span: 21}" prop="clidr.disYn">
                  <j-d-select-tag  v-if="optType !== 'view'"  dict-code="y_n" v-model="form.clidr.disYn"></j-d-select-tag>
                  <span v-else>{{ fdText('y_n', form.clidr.disYn) }}</span>
                </a-form-model-item>
              </a-col>
            </a-row>

            <a-row v-if="form.clidr.disYn==='Y'" :gutter="24">
              <a-col :span="24">
                <a-form-model-item label="披露对象" :labelCol="{span: 3}" :wrapperCol="{span: 21}" prop="clidr.disTarget">
                  <j-multi-select-tag v-if="optType !== 'view'" dict-code="DIS_TARGET" v-model="form.clidr.disTarget"></j-multi-select-tag>
                  <span v-else>{{ fdText('DIS_TARGET', form.clidr.disTarget) }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="24"><!-- prop="clidr.disChannel"-->
                <a-form-model-item :label="customizeEnv === 'sdic'?'信批报告传递方式':'披露渠道'" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                  <j-d-select-tag v-if="optType !== 'view'" dict-code="DIS_CHANNEL" v-model="form.clidr.disChannel"></j-d-select-tag>
                  <span v-else>{{ fdText('DIS_CHANNEL', form.clidr.disChannel) }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="披露方式" :labelCol="{span: 3}" :wrapperCol="{span: 21}" prop="clidr.disMode">
                  <j-multi-select-tag v-if="optType !== 'view'" dict-code="DIS_WAY" v-model="form.clidr.disMode"></j-multi-select-tag>
                  <span v-else>{{ fdText('DIS_WAY', form.clidr.disMode) }}</span>
                </a-form-model-item>
              </a-col>
<!--             todo 暂时关闭模板,后边打开处理-->
<!--              <a-col :span="12">-->
<!--                <a-form-model-item label="信息披露模板" :labelCol="{span: 6}" :wrapperCol="{span: 18}">-->
<!--                  <a-select v-if="optType !== 'view'" v-model="form.clidr.templateId">-->
<!--                    <a-select-option value="">&#45;&#45;</a-select-option>-->
<!--                  </a-select>-->
<!--                  <span v-else>{{ form.clidr.templateId }}</span>-->
<!--                </a-form-model-item>-->
<!--              </a-col>-->
              <a-col :span="12">
                <a-form-model-item label="成立不满N月不披露" :labelCol="{span: 9}" :wrapperCol="{span: 15}" >
                  <a-input-number :min="0" v-if="optType !== 'view'" v-model="form.clidr.distLimit"></a-input-number>
                  <span v-else>{{ form.clidr.distLimit }}</span>
                </a-form-model-item>
              </a-col>

              <a-col :span="24">
                <a-form-model-item label="披露报告类型" :labelCol="{span: 3}" :wrapperCol="{span: 21}" prop="clidr.disRptType">
                  <j-multi-select-tag v-if="optType !== 'view'" dict-code="DIS_RPT_TYPE" v-model="form.clidr.disRptType"></j-multi-select-tag>
                  <span v-else>{{ fdText('DIS_RPT_TYPE', form.clidr.disRptType) }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="24" v-if="form.clidr.disRptType&&form.clidr.disRptType.indexOf('1')>-1">
                <a-form-model-item label="季度报告" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                  <a-form-model :model="form" ref="quarterRpt" :rules="rptRules" layout="inline">
                    <span class="dis-rpt-text">受托人应当于本信托成立之日起，按</span>
                    <a-form-model-item v-if="optType !== 'view'">
                      <j-d-select-tag dict-code="RPT_YEAR" v-model="form.clidrds[0].calendarType" style="width: 95px"></j-d-select-tag>
                    </a-form-model-item>
                    <span v-else>{{ fdText('DIS_RPT_TYPE', form.clidrds[0].calendarType) }}</span>

                    <template v-if="form.clidrds[0].calendarType == '1'">
                      <a-form-model-item v-if="optType !== 'view'" prop="clidrds[0].disMon">
                        <j-multi-select-tag dict-code="MONTHS" v-model="form.clidrds[0].disMon" style="width: 390px"></j-multi-select-tag>
                      </a-form-model-item>
                      <span v-else>{{ fdText('MONTHS', form.clidrds[0].disMon) }}</span>

                      <a-form-model-item v-if="optType !== 'view'" prop="clidrds[0].disWeekday">
                        <j-d-select-tag dict-code="INT_RULE_TERM_UNIT" v-model="form.clidrds[0].disWeekday" style="width: 70px"></j-d-select-tag>
                      </a-form-model-item>
                      <span v-else>{{ fdText('INT_RULE_TERM_UNIT', form.clidrds[0].disWeekday) }}</span>

                      <a-form-model-item v-if="optType !== 'view'" prop="clidrds[0].disWeekdayType">
                        <j-d-select-tag :dict-code="form.clidrds[0].disWeekday == '1'?'INT_RULE_WEEK_TYPE':'INT_RULE_DAY_TYPE'" v-model="form.clidrds[0].disWeekdayType" style="width: 100px"></j-d-select-tag>
                      </a-form-model-item>
                      <span v-else>{{ fdText(form.clidrds[0].disWeekday == '1'?'INT_RULE_WEEK_TYPE':'INT_RULE_DAY_TYPE', form.clidrds[0].disWeekdayType) }}</span>

                      <a-form-model-item v-if="optType !== 'view'" prop="clidrds[0].disWeekdayNum">
                        <a-input-number v-model="form.clidrds[0].disWeekdayNum" :min="1" :max="365" style="width: 60px"></a-input-number>
                      </a-form-model-item>
                      <span v-else>{{ form.clidrds[0].disWeekdayNum }}</span>

                      <template v-if="form.clidrds[0].disWeekday == '1'">
                        <span class="dis-rpt-text">周的</span>
                        <a-form-model-item v-if="optType !== 'view'" prop="clidrds[0].disDayofweekType">
                          <j-d-select-tag dict-code="INT_RULE_WEEK_NUM_TYPE" v-model="form.clidrds[0].disDayofweekType" style="width: 110px"></j-d-select-tag>
                        </a-form-model-item>
                        <span v-else>{{ fdText('INT_RULE_WEEK_NUM_TYPE', form.clidrds[0].disDayofweekType) }}</span>

                        <a-form-model-item v-if="optType !== 'view'" prop="clidrds[0].disDayofweekNum">
                          <a-input-number v-model="form.clidrds[0].disDayofweekNum" :min="1" :max="365" style="width: 60px"></a-input-number>
                        </a-form-model-item>
                        <span v-else>{{ form.clidrds[0].disDayofweekNum }}</span>
                      </template>

                      <span v-if="(form.clidrds[0].disWeekday == '1'&&form.clidrds[0].disDayofweekType !== '1')||(form.clidrds[0].disWeekday !== '1'&&form.clidrds[0].disWeekdayType!=='1')">
                        <span class="dis-rpt-text">个</span>
                        <a-form-model-item v-if="optType !== 'view'" prop="clidrds[0].disDayType">
                          <j-d-select-tag dict-code="WORK_NATURE_DAY" v-model="form.clidrds[0].disDayType" style="width: 90px"></j-d-select-tag>
                        </a-form-model-item>
                        <span v-else>{{ fdText('WORK_NATURE_DAY', form.clidrds[0].disDayType) }}</span>
                      </span>
                    </template>
                    <span class="dis-rpt-text">后的</span>
                    <a-form-model-item v-if="optType !== 'view'" prop="clidrds[0].delayTerm">
                      <a-input-number v-model="form.clidrds[0].delayTerm" :min="1" :max="365" style="width: 60px"></a-input-number>
                    </a-form-model-item>
                    <span v-else>{{ form.clidrds[0].delayTerm }}</span>

                    <span class="dis-rpt-text">个工作日内完成季度报告，如果委托人和受益人未在</span>
                    <a-form-model-item v-if="optType !== 'view'" prop="clidrds[0].disagreeTerm">
                      <a-input-number v-model="form.clidrds[0].disagreeTerm" :min="1" :max="365" style="width: 60px"></a-input-number>
                    </a-form-model-item>
                    <span v-else>{{ form.clidrds[0].disagreeTerm }}</span>
                    <span class="dis-rpt-text">个工作日内提出书面异议的，视为认可受托人报告内容。</span>
                  </a-form-model>
                </a-form-model-item>
              </a-col>

              <a-col :span="24" v-if="form.clidr.disRptType&&form.clidr.disRptType.indexOf('2')>-1">
                <a-form-model-item label="半年度报告" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                  <a-form-model :model="form" ref="semiRpt" :rules="rptRules" layout="inline">
                    <span class="dis-rpt-text">受托人应当于本信托成立之日起，按</span>
                    <a-form-model-item v-if="optType !== 'view'">
                      <j-d-select-tag dict-code="RPT_YEAR" v-model="form.clidrds[1].calendarType" style="width: 95px"></j-d-select-tag>
                    </a-form-model-item>
                    <span v-else>{{ fdText('DIS_RPT_TYPE', form.clidrds[1].calendarType) }}</span>

                    <span v-if="form.clidrds[1].calendarType == '1'">
                      <a-form-model-item v-if="optType !== 'view'" prop="clidrds[1].disMon">
                        <j-multi-select-tag dict-code="MONTHS" v-model="form.clidrds[1].disMon" style="width: 390px"></j-multi-select-tag>
                      </a-form-model-item>
                      <span v-else>{{ fdText('MONTHS', form.clidrds[1].disMon) }}</span>

                      <a-form-model-item v-if="optType !== 'view'" prop="clidrds[1].disWeekday">
                        <j-d-select-tag dict-code="INT_RULE_TERM_UNIT" v-model="form.clidrds[1].disWeekday" style="width: 70px"></j-d-select-tag>
                      </a-form-model-item>
                      <span v-else>{{ fdText('INT_RULE_TERM_UNIT', form.clidrds[1].disWeekday) }}</span>

                      <a-form-model-item v-if="optType !== 'view'" prop="clidrds[1].disWeekdayType">
                        <j-d-select-tag :dict-code="form.clidrds[1].disWeekday == '1'?'INT_RULE_WEEK_TYPE':'INT_RULE_DAY_TYPE'" v-model="form.clidrds[1].disWeekdayType" style="width: 100px"></j-d-select-tag>
                      </a-form-model-item>
                      <span v-else>{{ fdText(form.clidrds[1].disWeekday == '1'?'INT_RULE_WEEK_TYPE':'INT_RULE_DAY_TYPE', form.clidrds[1].disWeekdayType) }}</span>

                      <a-form-model-item v-if="optType !== 'view'" prop="clidrds[1].disWeekdayNum">
                        <a-input-number v-model="form.clidrds[1].disWeekdayNum" :min="1" :max="365" style="width: 60px"></a-input-number>
                      </a-form-model-item>
                      <span v-else>{{ form.clidrds[1].disWeekdayNum }}</span>

                      <span v-if="form.clidrds[1].disWeekday == '1'">
                        <span class="dis-rpt-text">周的</span>
                        <a-form-model-item v-if="optType !== 'view'" prop="clidrds[1].disDayofweekType">
                          <j-d-select-tag dict-code="INT_RULE_WEEK_NUM_TYPE" v-model="form.clidrds[1].disDayofweekType" style="width: 110px"></j-d-select-tag>
                        </a-form-model-item>
                        <span v-else>{{ fdText('INT_RULE_WEEK_NUM_TYPE', form.clidrds[1].disDayofweekType) }}</span>

                        <a-form-model-item v-if="optType !== 'view'" prop="clidrds[1].disDayofweekNum">
                          <a-input-number v-model="form.clidrds[1].disDayofweekNum" :min="1" :max="365" style="width: 60px"></a-input-number>
                        </a-form-model-item>
                        <span v-else>{{ form.clidrds[1].disDayofweekNum }}</span>
                      </span>

                      <span v-if="(form.clidrds[1].disWeekday == '1'&&form.clidrds[1].disDayofweekType !== '1')||(form.clidrds[1].disWeekday !== '1'&&form.clidrds[1].disWeekdayType!=='1')">
                        <span class="dis-rpt-text">个</span>
                        <a-form-model-item v-if="optType !== 'view'" prop="clidrds[1].disDayType">
                          <j-d-select-tag dict-code="WORK_NATURE_DAY" v-model="form.clidrds[1].disDayType" style="width: 90px"></j-d-select-tag>
                        </a-form-model-item>
                        <span v-else>{{ fdText('WORK_NATURE_DAY', form.clidrds[1].disDayType) }}</span>
                      </span>
                    </span>
                    <span class="dis-rpt-text">后的</span>
                    <a-form-model-item v-if="optType !== 'view'" prop="clidrds[1].delayTerm">
                      <a-input-number v-model="form.clidrds[1].delayTerm" :min="1" :max="365" style="width: 60px"></a-input-number>
                    </a-form-model-item>
                    <span v-else>{{ form.clidrds[1].delayTerm }}</span>

                    <span class="dis-rpt-text">个工作日内完成季度报告，如果委托人和受益人未在</span>
                    <a-form-model-item v-if="optType !== 'view'" prop="clidrds[1].disagreeTerm">
                      <a-input-number v-model="form.clidrds[1].disagreeTerm" :min="1" :max="365" style="width: 60px"></a-input-number>
                    </a-form-model-item>
                    <span v-else>{{ form.clidrds[1].disagreeTerm }}</span>
                    <span class="dis-rpt-text">个工作日内提出书面异议的，视为认可受托人报告内容。</span>
                  </a-form-model>
                </a-form-model-item>
              </a-col>

              <a-col :span="24" v-if="form.clidr.disRptType&&form.clidr.disRptType.indexOf('0')>-1">
                <a-form-model-item label="年度报告" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                  <a-form-model :model="form" ref="annualRpt" :rules="rptRules" layout="inline">
                    <span class="dis-rpt-text">受托人应当于本信托成立之日起，按</span>
                    <a-form-model-item v-if="optType !== 'view'">
                      <j-d-select-tag dict-code="RPT_YEAR" v-model="form.clidrds[2].calendarType" style="width: 95px"></j-d-select-tag>
                    </a-form-model-item>
                    <span v-else>{{ fdText('DIS_RPT_TYPE', form.clidrds[2].calendarType) }}</span>

                    <span v-if="form.clidrds[2].calendarType == '1'">
                      <a-form-model-item v-if="optType !== 'view'" prop="clidrds[2].disMon">
                        <j-multi-select-tag v-if="optType !== 'view'" dict-code="MONTHS" v-model="form.clidrds[2].disMon" style="width: 390px"></j-multi-select-tag>
                      </a-form-model-item>
                      <span v-else>{{ fdText('MONTHS', form.clidrds[2].disMon) }}</span>

                      <a-form-model-item v-if="optType !== 'view'" prop="clidrds[2].disWeekday">
                        <j-d-select-tag dict-code="INT_RULE_TERM_UNIT" v-model="form.clidrds[2].disWeekday" style="width: 70px"></j-d-select-tag>
                      </a-form-model-item>
                      <span v-else>{{ fdText('INT_RULE_TERM_UNIT', form.clidrds[2].disWeekday) }}</span>

                      <a-form-model-item v-if="optType !== 'view'" prop="clidrds[2].disWeekdayType">
                        <j-d-select-tag :dict-code="form.clidrds[2].disWeekday == '1'?'INT_RULE_WEEK_TYPE':'INT_RULE_DAY_TYPE'" v-model="form.clidrds[2].disWeekdayType" style="width: 100px"></j-d-select-tag>
                      </a-form-model-item>
                      <span v-else>{{ fdText(form.clidrds[2].disWeekday == '1'?'INT_RULE_WEEK_TYPE':'INT_RULE_DAY_TYPE', form.clidrds[2].disWeekdayType) }}</span>

                      <a-form-model-item v-if="optType !== 'view'" prop="clidrds[2].disWeekdayNum">
                        <a-input-number v-model="form.clidrds[2].disWeekdayNum" :min="1" :max="365" style="width: 60px"></a-input-number>
                      </a-form-model-item>
                      <span v-else>{{ form.clidrds[2].disWeekdayNum }}</span>

                      <span v-if="form.clidrds[2].disWeekday == '1'">
                        <span class="dis-rpt-text">周的</span>
                        <a-form-model-item v-if="optType !== 'view'" prop="clidrds[2].disDayofweekType">
                          <j-d-select-tag dict-code="INT_RULE_WEEK_NUM_TYPE" v-model="form.clidrds[2].disDayofweekType" style="width: 110px"></j-d-select-tag>
                        </a-form-model-item>
                        <span v-else>{{ fdText('INT_RULE_WEEK_NUM_TYPE', form.clidrds[2].disDayofweekType) }}</span>

                        <a-form-model-item v-if="optType !== 'view'" prop="clidrds[2].disDayofweekNum">
                          <a-input-number v-if="optType !== 'view'" v-model="form.clidrds[2].disDayofweekNum" :min="1" :max="365" style="width: 60px"></a-input-number>
                        </a-form-model-item>
                        <span v-else>{{ form.clidrds[2].disDayofweekNum }}</span>
                      </span>

                      <span v-if="(form.clidrds[2].disWeekday == '1'&&form.clidrds[2].disDayofweekType !== '1')||(form.clidrds[2].disWeekday !== '1'&&form.clidrds[2].disWeekdayType!=='1')">
                        <span class="dis-rpt-text">个</span>
                        <a-form-model-item v-if="optType !== 'view'" prop="clidrds[2].disDayType">
                          <j-d-select-tag dict-code="WORK_NATURE_DAY" v-model="form.clidrds[2].disDayType" style="width: 90px"></j-d-select-tag>
                        </a-form-model-item>
                        <span v-else>{{ fdText('WORK_NATURE_DAY', form.clidrds[2].disDayType) }}</span>
                      </span>
                    </span>
                    <span class="dis-rpt-text">后的</span>
                    <a-form-model-item v-if="optType !== 'view'" prop="clidrds[2].delayTerm">
                      <a-input-number v-model="form.clidrds[2].delayTerm" :min="1" :max="365" style="width: 60px"></a-input-number>
                    </a-form-model-item>
                    <span v-else>{{ form.clidrds[2].delayTerm }}</span>

                    <span class="dis-rpt-text">个工作日内完成季度报告，如果委托人和受益人未在</span>
                    <a-form-model-item v-if="optType !== 'view'" prop="clidrds[2].disagreeTerm">
                      <a-input-number v-model="form.clidrds[2].disagreeTerm" :min="1" :max="365" style="width: 60px"></a-input-number>
                    </a-form-model-item>
                    <span v-else>{{ form.clidrds[2].disagreeTerm }}</span>
                    <span class="dis-rpt-text">个工作日内提出书面异议的，视为认可受托人报告内容。</span>
                  </a-form-model>
                </a-form-model-item>
              </a-col>

              <a-col :span="24" v-if="form.clidr.disRptType&&form.clidr.disRptType.indexOf('4')>-1">
                <a-form-model-item label="期间重要事项报告" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
                  <a-form-model :model="form" ref="importantRpt" :rules="rptRules" layout="inline">
                    <span class="dis-rpt-text">信托存续期间发生严重影响信托事项时，受托人应在知道该等事项发生之日立即通知报告接收人，并在发生之日起的</span>
                    <a-form-model-item v-if="optType !== 'view'" prop="clidrds[3].delayTerm">
                      <a-input-number v-model="form.clidrds[3].delayTerm" :min="1" :max="365" style="width: 60px"></a-input-number>
                    </a-form-model-item>
                    <span v-else>{{ form.clidrds[3].delayTerm }}</span>
                    <span class="dis-rpt-text">个工作日内以书面形式报告接收人。</span>
                  </a-form-model>
                </a-form-model-item>
              </a-col>

              <a-col :span="24" v-if="form.clidr.disRptType&&form.clidr.disRptType.indexOf('3')>-1">
                <a-form-model-item label="清算报告" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                  <a-form-model :model="form" ref="liquidationRpt" :rules="rptRules" layout="inline">
                    <span class="dis-rpt-text">受托人应当于</span>
                    <a-form-model-item v-if="optType !== 'view'" prop="clidrds[4].calendarType">
                      <j-d-select-tag dict-code="LIQ_RPT_TIME_TYPE" v-model="form.clidrds[4].calendarType" style="width: 160px"></j-d-select-tag>
                    </a-form-model-item>
                    <span v-else>{{ fdText('LIQ_RPT_TIME_TYPE', form.clidrds[4].calendarType) }}</span>
                    
                    <span class="dis-rpt-text">后的</span>
                    <a-form-model-item v-if="optType !== 'view'" prop="clidrds[4].delayTerm">
                      <a-input-number v-model="form.clidrds[4].delayTerm" :min="1" :max="365" style="width: 60px"></a-input-number>
                    </a-form-model-item>
                    <span v-else>{{ form.clidrds[4].delayTerm }}</span>

                    <span class="dis-rpt-text">个工作日内完成清算报告，如果委托人和受益人未在</span>
                    <a-form-model-item v-if="optType !== 'view'" prop="clidrds[4].disagreeTerm">
                      <a-input-number v-model="form.clidrds[4].disagreeTerm" :min="1" :max="365" style="width: 60px"></a-input-number>
                    </a-form-model-item>
                    <span v-else>{{ form.clidrds[4].disagreeTerm }}</span>
                    <span class="dis-rpt-text">个工作日内提出书面异议的，视为认可受托人报告内容。</span>
                  </a-form-model>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </a-card>
      </a-layout-content>
      <a-layout-footer style="background-color: #FFFFFF;text-align: center;">
        <a-button :disabled="optType === 'view'" @click="handleSubmit" type="primary">提交</a-button>
      </a-layout-footer>
    </a-layout>
  </a-spin>
</template>

<script>
  import JDSelectTag from '../../components/dict/JDSelectTag'
  import JMultiSelectTag from '../../components/dict/JMultiSelectTag'
  import { postAction } from '../../api/manage'
  import { filterDictText,initDictOptionsBatch } from '@comp/dict/JDictSelectUtil'
  import * as customizeConfigs from '../../customizeConfig'
  export default {
    name: '',
    components: {
      JMultiSelectTag,
      JDSelectTag
      //components here
    },
    data() {
      let customizeEnv = customizeConfigs.customizeEnv
      let ruleReq = [{required: true, message: '必输字段',trigger:['change','blur']}];
      let rptRules = {}
      for(let i=0;i<5;i++){
        let key=`clidrds[${i}].`
        rptRules[key+'disMon']=ruleReq
        rptRules[key+'disWeekday']=ruleReq
        rptRules[key+'disWeekdayType']=ruleReq
        rptRules[key+'disWeekdayNum']=ruleReq
        rptRules[key+'disDayofweekType']=ruleReq
        rptRules[key+'disDayofweekNum']=ruleReq
        rptRules[key+'disDayType']=ruleReq
        rptRules[key+'delayTerm']=ruleReq
        rptRules[key+'disagreeTerm']=ruleReq
        rptRules[key+'calendarType']=ruleReq
      }
      return {
        optType:'',
        loading:false,
        rules:{
          'clidr.disYn':ruleReq,
          'clidr.disTarget':ruleReq,
          'clidr.disMode':ruleReq,
          'clidr.distLimit':ruleReq,
          'clidr.disRptType':ruleReq
        },
        rptRules:rptRules,
        form:{
          clidr:{
              disYn:'Y'
          },
          clidrds:[{},{},{},{},{}]
        },
        url:{
          find:'/prj/findDisRule',
          save:'/prj/saveDisRule'
        },
        quarter: '0',
        year: '0',
        halfYear: '0',
        customizeEnv: customizeEnv,
        dictOptionsData:[],
      }
    },
    created() {
      
      
      let that = this;
      that.loading = true;
      if(that.optType==='view'){
        that.initDictConfig();
      }
      postAction(that.url.find,{clidr:{prjCode:that.$route.query.prjCode}}).then((res)=>{
        if(res.success){
          let disRptType = [];
          console.log('res.result = ',res.result);
          res.result.clidrds.forEach((clidrd)=>{
            if(clidrd.disType){
              disRptType.push(clidrd.disType);
            }
          });
          console.log(disRptType)
          console.log(disRptType.indexOf('2')>-1)
          if(disRptType.indexOf('1')>-1){
            this.quarter = '1'
          }
          if(disRptType.indexOf('2')>-1){
            this.halfYear = '1'
          }
          if(disRptType.indexOf('0')>-1){
            this.year = '1'
          }
          if(!res.result.clidr){
            res.result.clidr = {disMode:'1,2'};
          }
          res.result.clidr.disRptType = disRptType.toString();
          that.form = res.result;
        }else{
          that.$message.error(res.message);
        }
      }).finally(()=>{
        that.loading=false;
      });
    },
    mounted() {
      //mounted here
    },
    methods: {
      fdText(o,v){
        return filterDictText(this.dictOptionsData[o],v);
      },
      initDictConfig() {
        initDictOptionsBatch("y_n,DIS_TARGET,DIS_CHANNEL,DIS_WAY,DIS_RPT_TYPE,MONTHS,INT_RULE_TERM_UNIT,INT_RULE_WEEK_TYPE,INT_RULE_DAY_TYPE,INT_RULE_WEEK_NUM_TYPE,WORK_NATURE_DAY,LIQ_RPT_TIME_TYPE" ).then(
          (res) => {
          if (res.success) {
            this.dictOptionsData = res.result;
          }
        });
      },
      async handleSubmit(){
        const that = this;
        let isValidated=true;
        //校验主表单的内容
        await that.$refs.form.validate().catch(err => {
          isValidated=false
        })
        //校验季度报告
        if(that.$refs.quarterRpt){
          await that.$refs.quarterRpt.validate().catch(err => {
            isValidated=false
          })
        }
        //校验半年度报告
        if(that.$refs.semiRpt){
          await that.$refs.semiRpt.validate().catch(err => {
            isValidated=false
          })
        }
        //年度报告
        if(that.$refs.annualRpt){
          await that.$refs.annualRpt.validate().catch(err => {
            isValidated=false
          })
        }
        //重要事项报告
        if(that.$refs.importantRpt){
          await that.$refs.importantRpt.validate().catch(err => {
            isValidated=false
          })
        }
        //清算报告
        if(that.$refs.liquidationRpt){
          await that.$refs.liquidationRpt.validate().catch(err => {
            isValidated=false
          })
        }

        if(!isValidated) {
          that.$message.error('校验未通过');
          return false;
        }

        that.form.clidr.prjCode = that.$route.query.prjCode;            
        that.form.clidrds.forEach((item)=>{
          item.prjCode=null;
        })

        if(that.form.clidr.disRptType){
         let d = that.form.clidr.disRptType.split(',')
          if (d != null && d != '') {
            /* Bug 12287 数据字典中排序和值的映射关系不一样，需要手动维护映射关系
                                值  排序
                季度报告	         1    0
                半年度报告         2    1
                年度报告           0    2
                期间重要事项报告   4    3
                清算报告          3    4 */
            d.forEach((item) => {
              console.log(item)
              let ruleIndex = 0
              switch (item) {
                case '0':
                  ruleIndex = 2
                  break
                case '1':
                  ruleIndex = 0
                  break
                case '2':
                  ruleIndex = 1
                  break
                case '3':
                  ruleIndex = 4
                  break
                case '4':
                  ruleIndex = 3
                  break
              }
              that.form.clidrds[ruleIndex].disType = item + ''
              that.form.clidrds[ruleIndex].prjCode = that.$route.query.prjCode
            })
          }
        }
        
        that.loading = true;
        postAction(that.url.save, that.form).then((res)=>{
          if(res.success){
            that.$message.success('保存成功！');
          }else{
            that.$message.error(res.message);
          }
        }).finally(()=>{
          that.loading = false;
        });
      }
    },
    watch: {
      'form.clidr.disRptType'(val){
        console.log(val)
        if(val){
          console.log(this.year)
          if(val && val.indexOf('1')>-1 && this.quarter === '0'){
            this.form.clidrds[0].calendarType = '1'
          }
          if(val && val.indexOf('2')>-1 && this.halfYear === '0'){
            this.form.clidrds[1].calendarType = '1'
          }
          if(val && val.indexOf('0')>-1 && this.year === '0'){
            this.form.clidrds[2].calendarType = '1'
          }
        }
      }
    }
  }
</script>

<style scoped>
  .dis-rpt-text {
    line-height: 40px;
    padding-right: 5px;
  }
  @import '~@assets/less/common.less'
</style>