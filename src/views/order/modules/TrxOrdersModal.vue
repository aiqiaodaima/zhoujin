<template>
  <a-modal
    :title="title"
    :width="width"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item label="订单编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'odrCode', validatorRules.odrCode]" placeholder="请输入订单编号"></a-input>
        </a-form-item>
        <a-form-item label="项目系统编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'prjCode', validatorRules.prjCode]" placeholder="请输入项目系统编号"></a-input>
        </a-form-item>
        <a-form-item label="账户系统编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'accNo', validatorRules.accNo]" placeholder="请输入账户系统编号"></a-input>
        </a-form-item>
        <a-form-item label="账户类型(ACC:子账户,BNF:记账账户)" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'accType', validatorRules.accType]" placeholder="请输入账户类型(ACC:子账户,BNF:记账账户)"></a-input>
        </a-form-item>
        <a-form-item label="订单类型，PARAM_TYPE("ODR_TYPE")" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'odrtypeCode', validatorRules.odrtypeCode]" placeholder="请输入订单类型，PARAM_TYPE("ODR_TYPE")"></a-input>
        </a-form-item>
        <a-form-item label="交易类型，REF:TRX_TRANTYPES" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'trantypeCode', validatorRules.trantypeCode]" placeholder="请输入交易类型，REF:TRX_TRANTYPES"></a-input>
        </a-form-item>
        <a-form-item label="交易次类代码，PARAM_TYPE("TRX_SUB_TYPES")" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tranSubtypeCode', validatorRules.tranSubtypeCode]" placeholder="请输入交易次类代码，PARAM_TYPE("TRX_SUB_TYPES")"></a-input>
        </a-form-item>
        <a-form-item label="群组订单标识(NTG:普通订单,GRP:群组主订单,SUB:群组次订单,TALLY:内部记账订单)" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'groupOdrType', validatorRules.groupOdrType]" placeholder="请输入群组订单标识(NTG:普通订单,GRP:群组主订单,SUB:群组次订单,TALLY:内部记账订单)"></a-input>
        </a-form-item>
        <a-form-item label="群组号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'groupOdrCode', validatorRules.groupOdrCode]" placeholder="请输入群组号"></a-input>
        </a-form-item>
        <a-form-item label="关联订单编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'refOdrCode', validatorRules.refOdrCode]" placeholder="请输入关联订单编号"></a-input>
        </a-form-item>
        <a-form-item label="关联产品购买合同号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'refContractNo', validatorRules.refContractNo]" placeholder="请输入关联产品购买合同号"></a-input>
        </a-form-item>
        <a-form-item label="系统自定义产品代码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'proCode', validatorRules.proCode]" placeholder="请输入系统自定义产品代码"></a-input>
        </a-form-item>
        <a-form-item label="交易币别代码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tranCurCode', validatorRules.tranCurCode]" placeholder="请输入交易币别代码"></a-input>
        </a-form-item>
        <a-form-item label="交易日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tranDt', validatorRules.tranDt]" placeholder="请输入交易日期"></a-input>
        </a-form-item>
        <a-form-item label="交易金额（原币）" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'tranAmt', validatorRules.tranAmt]" placeholder="请输入交易金额（原币）" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="预计或约定的付款/收款日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'payDt', validatorRules.payDt]" placeholder="请输入预计或约定的付款/收款日期"></a-input>
        </a-form-item>
        <a-form-item label="预计或约定的付款/收款金额，不含转账手续费" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'payAmt', validatorRules.payAmt]" placeholder="请输入预计或约定的付款/收款金额，不含转账手续费" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="折算交易份额" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'tranUnit', validatorRules.tranUnit]" placeholder="请输入折算交易份额" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="成交价格" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'tranPrice', validatorRules.tranPrice]" placeholder="请输入成交价格" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="投资管理方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'imStyle', validatorRules.imStyle]" placeholder="请输入投资管理方式"></a-input>
        </a-form-item>
        <a-form-item label="投资决策人" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'deciMaker', validatorRules.deciMaker]" placeholder="请输入投资决策人"></a-input>
        </a-form-item>
        <a-form-item label="投资决策人-其他" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'deciMakerOth', validatorRules.deciMakerOth]" placeholder="请输入投资决策人-其他"></a-input>
        </a-form-item>
        <a-form-item label="订单状态，参考交易状态参数" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'status', validatorRules.status]" placeholder="请输入订单状态，参考交易状态参数"></a-input>
        </a-form-item>
        <a-form-item label="状态变更日期（营业日期）" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'statusDt', validatorRules.statusDt]" placeholder="请输入状态变更日期（营业日期）"></a-input>
        </a-form-item>
        <a-form-item label="创建订单时的营业日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'createDataDt', validatorRules.createDataDt]" placeholder="请输入创建订单时的营业日期"></a-input>
        </a-form-item>
        <a-form-item label="是否部分成交(Y/N)（针对买单、卖单）" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'partBargainYn', validatorRules.partBargainYn]" placeholder="请输入是否部分成交(Y/N)（针对买单、卖单）"></a-input>
        </a-form-item>
        <a-form-item label="订单取消/失败原因" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'cancelComment', validatorRules.cancelComment]" placeholder="请输入订单取消/失败原因"></a-input>
        </a-form-item>
        <a-form-item label="备注信息" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'memo', validatorRules.memo]" placeholder="请输入备注信息"></a-input>
        </a-form-item>
        <a-form-item label="投资限制检核强行通过理由" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'invlmtComment', validatorRules.invlmtComment]" placeholder="请输入投资限制检核强行通过理由"></a-input>
        </a-form-item>
        <a-form-item label="流动性检核强行通过理由" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'mobilityComment', validatorRules.mobilityComment]" placeholder="请输入流动性检核强行通过理由"></a-input>
        </a-form-item>
        <a-form-item label="创建时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'createDt', validatorRules.createDt]" placeholder="请输入创建时间"></a-input>
        </a-form-item>
        <a-form-item label="创建人" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'createBy', validatorRules.createBy]" placeholder="请输入创建人"></a-input>
        </a-form-item>
        <a-form-item label="修改时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'modifyDt', validatorRules.modifyDt]" placeholder="请输入修改时间"></a-input>
        </a-form-item>
        <a-form-item label="修改人" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'modifyBy', validatorRules.modifyBy]" placeholder="请输入修改人"></a-input>
        </a-form-item>
        <a-form-item label="是否符合转让方受益人备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'memoMustYn', validatorRules.memoMustYn]" placeholder="请输入是否符合转让方受益人备注"></a-input>
        </a-form-item>
        <a-form-item label="投资决策人类型,PARAM_TYPE("DECI_MAKER_TYPE")" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'deciMakerType', validatorRules.deciMakerType]" placeholder="请输入投资决策人类型,PARAM_TYPE("DECI_MAKER_TYPE")"></a-input>
        </a-form-item>
        <a-form-item label="投资决策计划ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'planId', validatorRules.planId]" placeholder="请输入投资决策计划ID" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="批量订单-流水号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'batchId', validatorRules.batchId]" placeholder="请输入批量订单-流水号"></a-input>
        </a-form-item>
        <a-form-item label="CRM结果说明" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'crmMemo', validatorRules.crmMemo]" placeholder="请输入CRM结果说明"></a-input>
        </a-form-item>
        <a-form-item label="不验证通用合同审批" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'conAdoptYn', validatorRules.conAdoptYn]" placeholder="请输入不验证通用合同审批"></a-input>
        </a-form-item>
        <a-form-item label="合同审批ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'applyInfoId', validatorRules.applyInfoId]" placeholder="请输入合同审批ID"></a-input>
        </a-form-item>
        <a-form-item label="不验证通用资金审批" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'recAdoptYn', validatorRules.recAdoptYn]" placeholder="请输入不验证通用资金审批"></a-input>
        </a-form-item>
        <a-form-item label="不验证CRM审批" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'crmAdoptYn', validatorRules.crmAdoptYn]" placeholder="请输入不验证CRM审批"></a-input>
        </a-form-item>
        <a-form-item label="投资账户类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'invAccType', validatorRules.invAccType]" placeholder="请输入投资账户类型"></a-input>
        </a-form-item>
        <a-form-item label="是否删除审批中" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'delWkfYn', validatorRules.delWkfYn]" placeholder="请输入是否删除审批中"></a-input>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import { validateDuplicateValue } from '@/utils/util'

  export default {
    name: "TrxOrdersModal",
    components: { 
    },
    data () {
      return {
        form: this.$form.createForm(this),
        title:"操作",
        width:800,
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        validatorRules: {
          odrCode: {rules: [
            {required: true, message: '请输入订单编号!'},
          ]},
          prjCode: {rules: [
            {required: true, message: '请输入项目系统编号!'},
          ]},
          accNo: {rules: [
          ]},
          accType: {rules: [
          ]},
          odrtypeCode: {rules: [
            {required: true, message: '请输入订单类型，PARAM_TYPE("ODR_TYPE")!'},
          ]},
          trantypeCode: {rules: [
            {required: true, message: '请输入交易类型，REF:TRX_TRANTYPES!'},
          ]},
          tranSubtypeCode: {rules: [
          ]},
          groupOdrType: {rules: [
            {required: true, message: '请输入群组订单标识(NTG:普通订单,GRP:群组主订单,SUB:群组次订单,TALLY:内部记账订单)!'},
          ]},
          groupOdrCode: {rules: [
          ]},
          refOdrCode: {rules: [
          ]},
          refContractNo: {rules: [
          ]},
          proCode: {rules: [
          ]},
          tranCurCode: {rules: [
          ]},
          tranDt: {rules: [
          ]},
          tranAmt: {rules: [
          ]},
          payDt: {rules: [
          ]},
          payAmt: {rules: [
          ]},
          tranUnit: {rules: [
          ]},
          tranPrice: {rules: [
          ]},
          imStyle: {rules: [
          ]},
          deciMaker: {rules: [
          ]},
          deciMakerOth: {rules: [
          ]},
          status: {rules: [
            {required: true, message: '请输入订单状态，参考交易状态参数!'},
          ]},
          statusDt: {rules: [
            {required: true, message: '请输入状态变更日期（营业日期）!'},
          ]},
          createDataDt: {rules: [
          ]},
          partBargainYn: {rules: [
          ]},
          cancelComment: {rules: [
          ]},
          memo: {rules: [
          ]},
          invlmtComment: {rules: [
          ]},
          mobilityComment: {rules: [
          ]},
          createDt: {rules: [
            {required: true, message: '请输入创建时间!'},
          ]},
          createBy: {rules: [
          ]},
          modifyDt: {rules: [
          ]},
          modifyBy: {rules: [
          ]},
          memoMustYn: {rules: [
          ]},
          deciMakerType: {rules: [
          ]},
          planId: {rules: [
          ]},
          batchId: {rules: [
          ]},
          crmMemo: {rules: [
          ]},
          conAdoptYn: {rules: [
          ]},
          applyInfoId: {rules: [
          ]},
          recAdoptYn: {rules: [
          ]},
          crmAdoptYn: {rules: [
          ]},
          invAccType: {rules: [
          ]},
          delWkfYn: {rules: [
          ]},
        },
        url: {
          add: "/cn.one2rich.order/trxOrders/add",
          edit: "/cn.one2rich.order/trxOrders/edit",
        }
      }
    },
    created () {
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'odrCode','prjCode','accNo','accType','odrtypeCode','trantypeCode','tranSubtypeCode','groupOdrType','groupOdrCode','refOdrCode','refContractNo','proCode','tranCurCode','tranDt','tranAmt','payDt','payAmt','tranUnit','tranPrice','imStyle','deciMaker','deciMakerOth','status','statusDt','createDataDt','partBargainYn','cancelComment','memo','invlmtComment','mobilityComment','createDt','createBy','modifyDt','modifyBy','memoMustYn','deciMakerType','planId','batchId','crmMemo','conAdoptYn','applyInfoId','recAdoptYn','crmAdoptYn','invAccType','delWkfYn'))
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            let formData = Object.assign(this.model, values);
            console.log("表单提交数据",formData)
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })
          }
         
        })
      },
      handleCancel () {
        this.close()
      },
      popupCallback(row){
        this.form.setFieldsValue(pick(row,'odrCode','prjCode','accNo','accType','odrtypeCode','trantypeCode','tranSubtypeCode','groupOdrType','groupOdrCode','refOdrCode','refContractNo','proCode','tranCurCode','tranDt','tranAmt','payDt','payAmt','tranUnit','tranPrice','imStyle','deciMaker','deciMakerOth','status','statusDt','createDataDt','partBargainYn','cancelComment','memo','invlmtComment','mobilityComment','createDt','createBy','modifyDt','modifyBy','memoMustYn','deciMakerType','planId','batchId','crmMemo','conAdoptYn','applyInfoId','recAdoptYn','crmAdoptYn','invAccType','delWkfYn'))
      },

      
    }
  }
</script>