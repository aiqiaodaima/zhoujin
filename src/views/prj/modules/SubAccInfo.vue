<template>
  <a-spin :spinning="loading">
    <a-form-model
      :model="form"
      :rules="rules"
      ref="form"
      :label-col="{ span: 9 }"
      :wrapper-col="{ span: 15 }"
      style="padding-top: 15px;background-color: #ffffff;margin-right: 15px;">

      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-model-item label="子账户名称" prop="accName">
            <a-input v-if="optType !== 'VIEW'" v-model="form.accName" placeholder="子账户名称"></a-input>
            <span v-else>{{ form.accName }}</span>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="子账户编号" prop="accCode">
            <a-input v-if="optType !== 'VIEW'" v-model="form.accCode" placeholder="子账户编号"></a-input>
            <span v-else>{{ form.accCode }}</span>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="受益权模式" prop="bnfMode">
            <j-d-select-tag v-if="optType !== 'VIEW'" dict-code="BNF_MODE" v-model="form.bnfMode" placeholder="请选择受益权模式"></j-d-select-tag>
            <span v-else>{{ fdText('BNF_MODE', form.bnfMode) }}</span>
          </a-form-model-item>
        </a-col>

        <a-col :span="12">
          <a-form-model-item label="投资管理方式" prop="imStyle">
            <j-d-select-tag v-if="optType !== 'VIEW'" dict-code="IM_STYLE" v-model="form.imStyle" placeholder="请选择投资管理方式"></j-d-select-tag>
            <span v-else>{{ fdText('IM_STYLE', form.imStyle) }}</span>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="投资指令人类型" prop="imSubStyle">
            <j-d-select-tag v-if="optType !== 'VIEW'" dict-code="IM_SUB_STYLE" v-model="form.imSubStyle" placeholder="请选择投资指令人类型" @change="investmentOrderMaker"></j-d-select-tag>
            <span v-else>{{ fdText('IM_SUB_STYLE', form.imSubStyle) }}</span>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="投资指令人" prop="icOrgCode">
            <a-select v-if="optType !== 'VIEW'" v-model="form.icOrgCode">
              <a-select-option :value="item.value" v-for="(item,i) in investment" :key="i"  >{{item.value}}</a-select-option>
            </a-select>
            <span v-else>{{ form.icOrgCode }}</span>
          </a-form-model-item>
        </a-col>

        <a-col :span="12">
          <a-form-model-item label="风险等级">
            <j-d-select-tag v-if="optType !== 'VIEW'" dict-code="RISK_CODE" v-model="form.invType" placeholder="请选择风险等级"></j-d-select-tag>
            <span v-else>{{ fdText('RISK_CODE', form.invType) }}</span>
          </a-form-model-item>
        </a-col>
        <!-- <a-col :span="8">
          <a-form-model-item label="是否收费" prop="feeYn">
            <j-d-select-tag v-if="optType !== 'view'" dict-code="y_n" v-model="form.feeYn" placeholder="请选择投是否收费"></j-d-select-tag>
            <span v-else>{{ fdText('y_n', form.feeYn) }}</span>
          </a-form-model-item>
        </a-col> -->
        <!-- <a-col :span="8">
          <a-form-model-item label="是否估值" prop="voaYn">
            <j-d-select-tag v-if="optType !== 'view'" dict-code="y_n" v-model="form.voaYn" placeholder="请选择是否估值"></j-d-select-tag>
            <span v-else>{{ fdText('y_n', form.voaYn) }}</span>
          </a-form-model-item>
        </a-col> -->

        <a-col :span="24" >
          <a-form-model-item label="备注" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
            <a-textarea v-if="optType !== 'VIEW'" class="no-resize" placeholder="请输入备注" v-model="form.memo" allowClear :rows="4"></a-textarea>
            <span v-else>{{ form.memo }}</span>
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row :gutter="24" >
        <a-col :span="24" style="text-align: center">
          <a-button type="primary" :disabled="form.status==='ADTING'" @click="handleSave" v-if="optType !== 'VIEW' && form.status!=='ADTING'">提交<span v-if="form.prjStatus==='R'">审核</span></a-button>
          <!--:va="va" va='1'表示隐藏掉子组件中的返回按钮   项目视图中查看子账户信息专用-->
          <a-button v-if="va !== '1'" @click="handleBack"  style="margin-left: 15px;">返回</a-button>
        </a-col>
      </a-row>
      <br/>
    </a-form-model>
    <WkfNextUserModal ref="wkfUserForm" @complete="wkfUserComplete" />
  </a-spin>
</template>

<script>
  import JDSelectTag from '../../../components/dict/JDSelectTag'
  import { postAction, getAction } from '../../../api/manage'
  import { filterDictText,initDictOptionsBatch } from '@comp/dict/JDictSelectUtil'
  import WkfNextUserModal from '../../activiti/modules/WkfNextUserModal'
  import * as customizeConfigs from '../../../customizeConfig'
  import vueBus from '@/utils/vueBus'
  
  export default {
    name: 'SubAccInfo',
    components: {
      WkfNextUserModal,
      JDSelectTag
    },
    inject: [ "psToPage" ],
    props:{
      optType:'',
      accNo:'',
      prjCode: '',
      va:''
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
      'form.imStyle'(val) {
        this.rules['imSubStyle'][0].required = (val != '1')
        this.rules['icOrgCode'][0].required = (val != '1')
      },
      'form.bnfMode'(val) {
        this.$bus.$emit('bnfMode',val)
      },
      accNo(val){
        if (val!=''){
          this.initPage();
        }
      }
    },
    data() {
      let customizeEnv = customizeConfigs.customizeEnv
      let ruleReq = [{required: true, message: '必输字段',trigger:['change','blur']}];
      return {
        customizeEnv: customizeEnv,
        loading: false,
        form: {
          icOrgCode:'',
          prjStatus:'',
        },
        rules: {
          accName:ruleReq,
          accCode:ruleReq,
          bnfMode:ruleReq,
          imStyle:ruleReq,
          imSubStyle:[{required: true, message: '必输字段',trigger:['change','blur']}],
          icOrgCode:[{required: true, message: '必输字段',trigger:['change','blur']}],
          feeYn:ruleReq,
        },
        url:{
          save:'/subacc/save',
          find:'/subacc/find'
        },
        type:'',
        investment:[],
        dictOptionsData:[],
      }
    },
    created() {
        this.initDictConfig();
    },
    mounted() {
      this.initPage();
    },
    methods: {
      wkfUserComplete(){
        this.psToPage('prj/SubAccount', {optType: 'VIEW', prjCode: this.prjCode, accNo: this.accNo});
      },
      handleBack(){
        this.psToPage('prj/SubAccountList', {});
      },
      fdText(o,v){
        return filterDictText(this.dictOptionsData[o],v);
      },
      initPage(){
        let that = this;
        that.loading = true;
        if(this.optType === 'EDIT' || this.optType === 'VIEW' && this.accNo ){
          postAction(that.url.find, { accNo: this.accNo, id:''}).then((res)=>{
            if(res.success){
              console.log("子账户={}",res);
              that.form = res.result;              
              that.investmentOrderMaker('init')
            }else{
              that.$message.error(res.message);
            }
          }).catch(function(error){
            that.$message.error('数据加载失败！');
          }).finally(() => {
            that.loading = false;
          });
        }else{
          postAction('/prj/findByPrjCode', { cli:{prjCode: this.prjCode}}).then((res)=>{
             console.log("子账户={}",res);
            if(res.success){
              console.log('cli===',res);
              if(this.customizeEnv === 'zrt'){
               // 项目编号
              this.form.accCode = res.result.cli.trustPrjCode;
              // 项目名称
              this.form.accName =  res.result.cli.trustPrjName;
              }
             
              that.form.prjStatus = res.result.cli.prjStatus;
              if(this.customizeEnv === 'sdic'){
                that.form.accName = res.result.cli.trustPrjName;
              }
              this.form = {...this.form}
            }else{
              that.$message.error(res.message);
            }
          }).catch(function(error){
            that.$message.error('数据加载失败！');
          }).finally(() => {
            that.loading = false;
          });
        }
      },
      handleSave(){
        const that = this;
        that.loading = true;
        this.$refs.form.validate(valid => {
          if (valid) {
            that.form.prjCode = that.prjCode;
            that.form.accNo = that.accNo;
            postAction(that.url.save, that.form).then((res)=>{
              if(res.success){
                this.accNo=res.result.cai.accNo;
                //项目已成立，走审核
                if(that.form.prjStatus==='R'){
                  //发起审核 审核单选择审核人
                  if (res.result.processId) {
                    this.$refs.wkfUserForm.edit(res.result.processId);
                    this.$refs.wkfUserForm.disableSubmit = false;
                  }
                }else{
                  that.$message.success('保存成功！');
                  that.psToPage('prj/SubAccount', {optType: 'EDIT', prjCode: this.prjCode, accNo: res.result.cai.accNo});
                  // this.psToPage('', {optType: 'EDIT', prjCode: this.prjCode, accNo: res.result.cai.accNo});
                  this.$emit("updateActive",'2')
                  // this.psToPage('prj/SubAccountList', {});
                }
              }
            }).catch(function(error){
              that.$message.error('保存失败：'+error.toString());
            }).finally(() => {
              that.loading = false;
            });
          } else {
            that.$message.error('校验未通过');
            that.loading = false;
            return false;
          }
        });
      },
      investmentOrderMaker(unknown){
        const param =  {
          prjCode:this.prjCode,
          type:this.form.imSubStyle
        }
        if(unknown!=='init'){
          this.form.icOrgCode =''
        }        
        getAction("/subacc/investmentOrderMaker",param).then((res)=>{
            console.log(res);
            this.investment = res.result;
            console.log(this.investment);
        })
      },
      initDictConfig() {
        initDictOptionsBatch("BNF_MODE,IM_STYLE,IM_SUB_STYLE,RISK_CODE" ).then(
          (res) => {
          if (res.success) {
            console.log("result",res);
            this.dictOptionsData = res.result;
          }
        });
      },
    },

  }
</script>

<style>
  textarea {
    resize: none !important;
  }
</style>
