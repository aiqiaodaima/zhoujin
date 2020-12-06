<template> 
  <div style="background: rgb(240, 242, 245)">
    <a-spin :spinning="loading">
      <a-form-model :model="form" :rules="rules" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }">
        <a-layout>
          <a-layout-content>
            <a-card size="small" title="基本信息" :bordered="false">
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-model-item label="合同ID" prop="cli.cPactId">
                    <a-input id="cPactId" placeholder="请输入合同ID" v-model="form.cli.cPactId"  :disabled="isPrjSetup"></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="合同编号" prop="cli.cPactNo">
                    <a-input id="cPactNo" placeholder="请输入合同编号" v-model="form.cli.cPactNo" :disabled="isPrjSetup">  </a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                    <a-form-model-item label="合同规范全称" prop="cli.cPactName">
                      <a-input id="cPactName" placeholder="请输入合同规范全称" v-model="form.cli.cPactName" :disabled="isPrjSetup">  </a-input>
                    </a-form-model-item>
                </a-col>
              </a-row>
            </a-card>
          </a-layout-content>

          <a-layout-footer>

          </a-layout-footer>
        </a-layout>
      </a-form-model>
    </a-spin>
  </div>
</template>
<script>
export default {
  name:'VAmPact',
  components: {

  },
  inject: {

  },
  computed: {

  },
  watch: {

  },
  data() {
    let ruleReq = [{ required: true, message: '必输字段', trigger: ['change', 'blur'] }]
    let cli = {
      cPactId:'',cPactNo:'',cPactName:''
    }
    let r ={}
    let xx = Object.keys(cli)
    for (let i = 0; i < xx.length; i++) {
          r['cli.' + xx[i]] = ruleReq
    }
    return {
      loading:false,
      isPrjSetup:false,
      form: {//表单对象
        cli:cli,
      },
      rules: r,
      // url: {

      // },
      

    }
  }
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
</style>