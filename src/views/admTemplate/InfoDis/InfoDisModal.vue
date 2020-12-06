<template>
  <a-spin :spinning="loading">
    <a-layout>
      <a-layout-content>
        <a-card size="small" title="信息披露规则">
          <a-form-model :model="form" :rules="rules" ref="form"  style="margin-right: 10px">

            <a-row :gutter="24">
             
              <a-col :span="12">
                <a-form-model-item label="信息披露模版名称" :labelCol="{span: 10}" :wrapperCol="{span: 14}" prop="clidr.templateType">
                  <a-input v-if="optType !== 'view'" v-model="form.clidr.templateType"></a-input>
                  <span v-else>{{ form.clidr.templateType }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="合同系列" :labelCol="{span: 8}" :wrapperCol="{span: 16}" prop="clidr.templateCode">
                  <j-multi-select-tag v-if="optType !== 'view'" dict-code="CONTRACT_SERIE" v-model="form.clidr.templateCode"></j-multi-select-tag>
                  <span v-else>{{  fdText('CONTRACT_SERIE', form.clidr.templateCode) }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="披露报告类型" :labelCol="{span: 4}" :wrapperCol="{span: 20}" prop="clidr.disRptType">
                  <j-multi-select-tag v-if="optType !== 'view'" dict-code="DIS_RPT_TYPE" v-model="form.clidr.disRptType" ></j-multi-select-tag>
                  <span v-else>{{ fdText('DIS_RPT_TYPE', form.clidr.disRptType) }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="24" v-if="form.clidr.disRptType&&form.clidr.disRptType.indexOf('1')>-1">
                <a-form-model-item label="季度报告" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                  受托人应当于本信托成立之日起，按
                  <j-d-select-tag v-if="optType !== 'view'" dict-code="RPT_YEAR" v-model="form.clidrds[0].calendarType" style="width: 95px"></j-d-select-tag>
                  <span v-else>{{ fdText('DIS_RPT_TYPE', form.clidrds[0].calendarType) }}</span>

                  <span v-if="form.clidrds[0].calendarType === '1'">
                    <j-multi-select-tag v-if="optType !== 'view'" dict-code="MONTHS" v-model="form.clidrds[0].disMon" style="width: 450px"></j-multi-select-tag>
                    <span v-else>{{ fdText('MONTHS', form.clidrds[0].disMon) }}</span>

                    <j-d-select-tag v-if="optType !== 'view'" dict-code="INT_RULE_TERM_UNIT" v-model="form.clidrds[0].disWeekday" style="width: 70px"></j-d-select-tag>
                    <span v-else>{{ fdText('INT_RULE_TERM_UNIT', form.clidrds[0].disWeekday) }}</span>

                    <j-d-select-tag v-if="optType !== 'view'" :dict-code="form.clidrds[0].disWeekday === '1'?'INT_RULE_WEEK_TYPE':'INT_RULE_DAY_TYPE'" v-model="form.clidrds[0].disWeekdayType" style="width: 100px"></j-d-select-tag>
                    <span v-else>{{ fdText(form.clidrds[0].disWeekday === '1'?'INT_RULE_WEEK_TYPE':'INT_RULE_DAY_TYPE', form.clidrds[0].disWeekdayType) }}</span>

                    <a-input-number v-if="optType !== 'view'" v-model="form.clidrds[0].disWeekdayNum" :min="1" :max="4" style="width: 50px"></a-input-number>
                    <span v-else>{{ form.clidrds[0].disWeekdayNum }}</span>

                    <span v-if="form.clidrds[0].disWeekday === '1'">
                      周的
                      <j-d-select-tag v-if="optType !== 'view'" dict-code="INT_RULE_WEEK_NUM_TYPE" v-model="form.clidrds[0].disDayofweekType" style="width: 110px"></j-d-select-tag>
                      <span v-else>{{ fdText('INT_RULE_WEEK_NUM_TYPE', form.clidrds[0].disDayofweekType) }}</span>

                      <a-input-number v-if="optType !== 'view'" v-model="form.clidrds[0].disDayofweekNum" :min="1" :max="4" style="width: 50px"></a-input-number>
                      <span v-else>{{ form.clidrds[0].disDayofweekNum }}</span>
                    </span>

                    <span v-if="(form.clidrds[0].disWeekday === '1'&&form.clidrds[0].disDayofweekType !== '1')||(form.clidrds[0].disWeekday !== '1'&&form.clidrds[0].disWeekdayType!=='1')">
                      个
                      <j-d-select-tag v-if="optType !== 'view'" dict-code="WORK_NATURE_DAY" v-model="form.clidrds[0].disDayType" style="width: 90px"></j-d-select-tag>
                      <span v-else>{{ fdText('WORK_NATURE_DAY', form.clidrds[0].disDayType) }}</span>
                    </span>
                   </span>
                  后的
                  <a-input-number v-if="optType !== 'view'" v-model="form.clidrds[0].delayTerm" :min="1" :max="4" style="width: 50px"></a-input-number>
                  <span v-else>{{ form.clidrds[0].delayTerm }}</span>
                  个工作日内完成季度报告，如果委托人和受益人未在
                  <a-input-number v-if="optType !== 'view'" v-model="form.clidrds[0].disagreeTerm" :min="1" :max="4" style="width: 50px"></a-input-number>
                  <span v-else>{{ form.clidrds[0].disagreeTerm }}</span>
                  个工作日内提出书面异议的，视为认可受托人报告内容。
                </a-form-model-item>
              </a-col>

              <a-col :span="24" v-if="form.clidr.disRptType&&form.clidr.disRptType.indexOf('2')>-1">
                <a-form-model-item label="半年度报告" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                  受托人应当于本信托成立之日起，按
                  <j-d-select-tag v-if="optType !== 'view'" dict-code="RPT_YEAR" v-model="form.clidrds[1].calendarType" style="width: 95px"></j-d-select-tag>
                  <span v-else>{{ fdText('DIS_RPT_TYPE', form.clidrds[1].calendarType) }}</span>

                  <span v-if="form.clidrds[1].calendarType === '1'">
                    <j-multi-select-tag v-if="optType !== 'view'" dict-code="MONTHS" v-model="form.clidrds[1].disMon" style="width: 450px"></j-multi-select-tag>
                    <span v-else>{{ fdText('MONTHS', form.clidrds[1].disMon) }}</span>

                    <j-d-select-tag v-if="optType !== 'view'" dict-code="INT_RULE_TERM_UNIT" v-model="form.clidrds[1].disWeekday" style="width: 70px"></j-d-select-tag>
                    <span v-else>{{ fdText('INT_RULE_TERM_UNIT', form.clidrds[1].disWeekday) }}</span>

                    <j-d-select-tag v-if="optType !== 'view'" :dict-code="form.clidrds[1].disWeekday === '1'?'INT_RULE_WEEK_TYPE':'INT_RULE_DAY_TYPE'" v-model="form.clidrds[1].disWeekdayType" style="width: 100px"></j-d-select-tag>
                    <span v-else>{{ fdText(form.clidrds[1].disWeekday === '1'?'INT_RULE_WEEK_TYPE':'INT_RULE_DAY_TYPE', form.clidrds[1].disWeekdayType) }}</span>

                    <a-input-number v-if="optType !== 'view'" v-model="form.clidrds[1].disWeekdayNum" :min="1" :max="4" style="width: 50px"></a-input-number>
                    <span v-else>{{ form.clidrds[1].disWeekdayNum }}</span>

                    <span v-if="form.clidrds[1].disWeekday === '1'">
                      周的
                      <j-d-select-tag v-if="optType !== 'view'" dict-code="INT_RULE_WEEK_NUM_TYPE" v-model="form.clidrds[1].disDayofweekType" style="width: 110px"></j-d-select-tag>
                      <span v-else>{{ fdText('INT_RULE_WEEK_NUM_TYPE', form.clidrds[1].disDayofweekType) }}</span>

                      <a-input-number v-if="optType !== 'view'" v-model="form.clidrds[1].disDayofweekNum" :min="1" :max="4" style="width: 50px"></a-input-number>
                      <span v-else>{{ form.clidrds[1].disDayofweekNum }}</span>
                    </span>

                    <span v-if="(form.clidrds[1].disWeekday === '1'&&form.clidrds[1].disDayofweekType !== '1')||(form.clidrds[1].disWeekday !== '1'&&form.clidrds[1].disWeekdayType!=='1')">
                      个
                      <j-d-select-tag v-if="optType !== 'view'" dict-code="WORK_NATURE_DAY" v-model="form.clidrds[1].disDayType" style="width: 90px"></j-d-select-tag>
                      <span v-else>{{ fdText('WORK_NATURE_DAY', form.clidrds[1].disDayType) }}</span>
                    </span>
                   </span>
                  后的
                  <a-input-number v-if="optType !== 'view'" v-model="form.clidrds[1].delayTerm" :min="1" :max="4" style="width: 50px"></a-input-number>
                  <span v-else>{{ form.clidrds[1].delayTerm }}</span>
                  个工作日内完成半年度报告，如果委托人和受益人未在
                  <a-input-number v-if="optType !== 'view'" v-model="form.clidrds[1].disagreeTerm" :min="1" :max="4" style="width: 50px"></a-input-number>
                  <span v-else>{{ form.clidrds[1].disagreeTerm }}</span>
                  个工作日内提出书面异议的，视为认可受托人报告内容。
                </a-form-model-item>
              </a-col>

              <a-col :span="24" v-if="form.clidr.disRptType&&form.clidr.disRptType.indexOf('3')>-1">
                <a-form-model-item label="年度报告" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                  受托人应当于本信托成立之日起，按
                  <j-d-select-tag v-if="optType !== 'view'" dict-code="RPT_YEAR" v-model="form.clidrds[2].calendarType" style="width: 95px"></j-d-select-tag>
                  <span v-else>{{ fdText('DIS_RPT_TYPE', form.clidrds[2].calendarType) }}</span>

                  <span v-if="form.clidrds[2].calendarType === '1'">
                    <j-multi-select-tag v-if="optType !== 'view'" dict-code="MONTHS" v-model="form.clidrds[2].disMon" style="width: 450px"></j-multi-select-tag>
                    <span v-else>{{ fdText('MONTHS', form.clidrds[2].disMon) }}</span>

                    <j-d-select-tag v-if="optType !== 'view'" dict-code="INT_RULE_TERM_UNIT" v-model="form.clidrds[2].disWeekday" style="width: 70px"></j-d-select-tag>
                    <span v-else>{{ fdText('INT_RULE_TERM_UNIT', form.clidrds[2].disWeekday) }}</span>

                    <j-d-select-tag v-if="optType !== 'view'" :dict-code="form.clidrds[2].disWeekday === '1'?'INT_RULE_WEEK_TYPE':'INT_RULE_DAY_TYPE'" v-model="form.clidrds[2].disWeekdayType" style="width: 100px"></j-d-select-tag>
                    <span v-else>{{ fdText(form.clidrds[2].disWeekday === '1'?'INT_RULE_WEEK_TYPE':'INT_RULE_DAY_TYPE', form.clidrds[2].disWeekdayType) }}</span>

                    <a-input-number v-if="optType !== 'view'" v-model="form.clidrds[2].disWeekdayNum" :min="1" :max="4" style="width: 50px"></a-input-number>
                    <span v-else>{{ form.clidrds[2].disWeekdayNum }}</span>

                    <span v-if="form.clidrds[2].disWeekday === '1'">
                      周的
                      <j-d-select-tag v-if="optType !== 'view'" dict-code="INT_RULE_WEEK_NUM_TYPE" v-model="form.clidrds[2].disDayofweekType" style="width: 110px"></j-d-select-tag>
                      <span v-else>{{ fdText('INT_RULE_WEEK_NUM_TYPE', form.clidrds[2].disDayofweekType) }}</span>

                      <a-input-number v-if="optType !== 'view'" v-model="form.clidrds[2].disDayofweekNum" :min="1" :max="4" style="width: 50px"></a-input-number>
                      <span v-else>{{ form.clidrds[2].disDayofweekNum }}</span>
                    </span>

                    <span v-if="(form.clidrds[2].disWeekday === '1'&&form.clidrds[2].disDayofweekType !== '1')||(form.clidrds[2].disWeekday !== '1'&&form.clidrds[2].disWeekdayType!=='1')">
                      个
                      <j-d-select-tag v-if="optType !== 'view'" dict-code="WORK_NATURE_DAY" v-model="form.clidrds[2].disDayType" style="width: 90px"></j-d-select-tag>
                      <span v-else>{{ fdText('WORK_NATURE_DAY', form.clidrds[2].disDayType) }}</span>
                    </span>
                   </span>
                  后的
                  <a-input-number v-if="optType !== 'view'" v-model="form.clidrds[2].delayTerm" :min="1" :max="4" style="width: 50px"></a-input-number>
                  <span v-else>{{ form.clidrds[2].delayTerm }}</span>
                  个工作日内完成年度报告，如果委托人和受益人未在
                  <a-input-number v-if="optType !== 'view'" v-model="form.clidrds[2].disagreeTerm" :min="1" :max="4" style="width: 50px"></a-input-number>
                  <span v-else>{{ form.clidrds[2].disagreeTerm }}</span>
                  个工作日内提出书面异议的，视为认可受托人报告内容。
                </a-form-model-item>
              </a-col>

              <a-col :span="24" v-if="form.clidr.disRptType&&form.clidr.disRptType.indexOf('4')>-1">
                <a-form-model-item label="期间重要事项报告" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                  信托存续期间发生严重影响信托事项时，受托人应在知道该等事项发生之日立即通知报告接收人，并在发生之日起的
                  <a-input-number v-if="optType !== 'view'" v-model="form.clidrds[3].delayTerm" :min="1" :max="4" style="width: 50px"></a-input-number>
                  <span v-else>{{ form.clidrds[3].delayTerm }}</span>
                  个工作日内以书面形式报告接收人。
                </a-form-model-item>
              </a-col>

              <a-col :span="24" v-if="form.clidr.disRptType&&form.clidr.disRptType.indexOf('5')>-1">
                <a-form-model-item label="清算报告" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                  受托人应当于
                  <j-d-select-tag v-if="optType !== 'view'" dict-code="LIQ_RPT_TIME_TYPE" v-model="form.clidrds[4].calendarType" style="width: 160px"></j-d-select-tag>
                  <span v-else>{{ fdText('LIQ_RPT_TIME_TYPE', form.clidrds[4].calendarType) }}</span>
                  后的
                  <a-input-number v-if="optType !== 'view'" v-model="form.clidrds[4].delayTerm" :min="1" :max="4" style="width: 50px"></a-input-number>
                  <span v-else>{{ form.clidrds[4].delayTerm }}</span>
                  个工作日内完成清算报告，如果委托人和受益人未在
                  <a-input-number v-if="optType !== 'view'" v-model="form.clidrds[4].disagreeTerm" :min="1" :max="4" style="width: 50px"></a-input-number>
                  <span v-else>{{ form.clidrds[4].disagreeTerm }}</span>
                  个工作日内提出书面异议的，视为认可受托人报告内容。
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </a-card>
      </a-layout-content>
      <!-- <a-layout-footer style="background-color: #FFFFFF;text-align: center;">
        <a-button :disabled="optType === 'view'" @click="handleSubmit" type="primary">提交</a-button>
      </a-layout-footer> -->
    </a-layout>
  </a-spin>
</template>

<script>
  import JDSelectTag from '@comp/dict/JDSelectTag'
  import JMultiSelectTag from '@comp/dict/JMultiSelectTag'
  import { filterDictText,initDictOptionsBatch } from '@comp/dict/JDictSelectUtil'
  import { postAction,getAction } from '@api/manage'
  export default {
    name: 'InfoDisModal',
    components: {
      JMultiSelectTag,
      JDSelectTag
    },
    props:{
      optType: {
        default: 'add'
      },
      batchId: {
        default:''
      },
    },
    data() {
      let ruleReq = [{required: true, message: '必输字段',trigger:['change','blur']}];
      return {
        loading:false,
        rules:{
          'clidr.templateType':ruleReq,
          'clidr.templateCode':ruleReq,
          'clidr.disRptType':ruleReq
        },
        form:{
          clidr:{},
          clidrds:[{},{},{},{},{}]
        },
        url:{
          find:'/baseline/admDisInfoMould/queryById',
          save:'/baseline/admDisInfoMould/admDisInfoSave'
        },
        dictOptionsData:[],
      }
    },
    watch:{
      batchId:function(newVal,oldVal){
        this.getInfoDis()
      },
      'form.clidr.disRptType':function(newVal,oldVal){
        this.form.clidrds.forEach((item,index) => {
          if( newVal.indexOf(index+1) == -1){
            this.$set(this.form.clidrds,index,{})
          }
        })
      }
    },
    created() {
      if(this.batchId){
        this.initDictConfig()
        this.getInfoDis()
        
      }
    },
    mounted() {
      //mounted here
    },
    methods: {
      fdText(o,v){
        return filterDictText(this.dictOptionsData[o],v);
      },
      handleSubmit(){
        this.$refs.form.validate(valid => {
          if (valid) {
            this.loading = true;
            let d = this.form.clidr.disRptType.split(",");
            d.forEach(item => {
              this.form.clidrds[item-1].disType = item+'';
              // this.form.clidrds[item-1].prjCode = this.$route.query.prjCode;
              
            });
            const param = {
              templateType: this.form.clidr.templateType,
              templateCode: this.form.clidr.templateCode,
              clidrds: this.form.clidrds,
            }
            if(this.batchId && this.optType!== 'copy'){
              param.batchId = this.batchId
            }
            return postAction(this.url.save, param).then((res)=>{
              if(res.success){
                this.$emit('update')
                this.$message.success('保存成功！');
              }else{
                this.$message.error(res.message);
              }
            }).finally(()=>{
              this.loading = false;
            });
          } else {
            this.$message.error('校验未通过');
            return false;
          }
        });
      },
      getInfoDis(){
        this.loading = true;
        getAction(this.url.find,{batchId:this.batchId}).then((res)=>{
          if(res.success){
            let disRptType = [];
            res.result.forEach((clidrd)=>{
              if(clidrd.disType){
                disRptType.push(clidrd.disType);
                this.form.clidrds[clidrd.disType-1] = clidrd
              }
            });
            
            this.form = { 
              clidr:{ templateType: res.result[0].templateType,
                templateCode:res.result[0].templateCode,
                disRptType: disRptType.toString()
              }, 
              clidrds: [...this.form.clidrds] 
            };
          }else{
            this.$message.error(res.message);
          }
        }).finally(()=>{
          this.loading=false;
        });
      },
      initDictConfig() {
        initDictOptionsBatch("INT_RULE_WEEK_NUM_TYPE,WORK_NATURE_DAY,INT_RULE_WEEK_TYPE,INT_RULE_TERM_UNIT,MONTHS,DIS_RPT_TYPE,CONTRACT_SERIE" ).then(
          (res) => {
          if (res.success) {
            this.dictOptionsData = res.result;
          }
        });
      },
    }
  }
</script>

<style scoped>
  @import '~@assets/less/common.less'
</style>