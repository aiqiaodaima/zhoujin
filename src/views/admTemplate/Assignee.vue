/**
  受托人维护
*/
<template>
  <a-form-model ref="assetForm" :model="form" :rules="rules">
    <a-card class="card" title="基本信息" :bordered="false"> 
      <a-row>
        <BiCol>
          <BiFormItemInput label="名称" name="partyName" placeholder="请输入名称" v-model="form.partyName"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.CUS_CATEGORY_ORGAN" label="机构类型" name="orgType" v-model="form.orgType"/>
        </BiCol>
        <BiCol>
          <BiFormItemInput label="金融机构许可证" name="jrxkzh" placeholder="请输入金融机构许可证" v-model="form.jrxkzh"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.ORGIDNTYPES" label="证件类型" name="idnType" v-model="form.idnType"/>
        </BiCol>
        <BiCol>
          <BiFormItemInput label="证件号码" name="idn" placeholder="请输入证件号码" v-model="form.idn"/>
        </BiCol>
        <BiCol>
          <BiRangeDatePicker label="有效期" :dateEnd="form.idnEndDt" :dateStart="form.idnStdDt" @change="changeDate($event,'idnStdDt','idnEndDt')"  />
        </BiCol>
        <BiCol>
          <BiFormItemCascader label="所属区域" v-model="areas" :needCountry='false'/>
        </BiCol>
        <BiCol>
          <BiFormItemInput label="注册地址"  placeholder="请输入注册地址" v-model="address"/>
        </BiCol>
        <BiCol>
          <BiFormItemTextarea label="经营范围" name="orgBusScope" v-model="form.orgBusScope" placeholder="请输入经营范围"/>
        </BiCol>
      </a-row>
    </a-card>
    <a-card class="card" title="账户信息" :bordered="false">
      <BiCol>
        <BiFormItemSelect label="开户银行" :options="dicts.BANK_CODE" name="cai.bankCode" placeholder="请输入开户银行" v-model="form.cai.bankCode"/>
      </BiCol>
      <BiCol>
        <BiFormItemInput label="户名" name="cai.accName" placeholder="请输入户名" v-model="form.cai.accName"/>
      </BiCol>
      <BiCol>
        <BiFormItemInput label="账户" name="cai.accNo" placeholder="请输入账户" v-model="form.cai.accNo"/>
      </BiCol>
        <BiCol>
        <BiFormItemInput label="开户银行网点" name="cai.accOpenBank" placeholder="请输入开户银行网点" v-model="form.cai.accOpenBank"/>
      </BiCol>
    </a-card>
    <a-card class="card" title="法定代表人或负责人" :bordered="false">
      <a-form-item label="类型" slot="extra" style="width: 200px;margin: 0;padding: 0;" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }">
        <j-d-select-tag dict-code="NATURAL_YN" v-model="form.principalNaturalYn"></j-d-select-tag>
      </a-form-item>
      <BiCol>
        <BiFormItemInput label="姓名/名称" name="principalName" placeholder="请输入姓名/名称" v-model="form.principalName"/>
      </BiCol>
      <BiCol>
      <BiFormItemSelect :options="form.principalNaturalYn === 'Y'?dicts.IDNTYPES:dicts.ORGIDNTYPES" label="证件类型" name="principalIdnType" v-model="form.principalIdnType"/>
      </BiCol>
      <BiCol>
        <BiFormItemInput label="证件号码" name="principalIdnNo" placeholder="请输入证件号码" v-model="form.principalIdnNo"/>
      </BiCol>
      <BiCol>
        <BiRangeDatePicker label="有效期" :dateEnd="form.principalIdnEndDt" :dateStart="form.principalIdnStdDt" @change="changeDate($event,'principalIdnStdDt','principalIdnEndDt')"  />
      </BiCol>
    </a-card>
    <a-card class="card" title="控股股东或实际控制人" :bordered="false">
      <a-form-item label="类型" slot="extra" style="width: 200px;margin: 0;padding: 0;" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }">
        <j-d-select-tag dict-code="NATURAL_YN" v-model="form.ctrlerNaturalYn"></j-d-select-tag>
      </a-form-item>
      <BiCol>
        <BiFormItemInput label="姓名/名称" name="ctrlerName" placeholder="请输入姓名/名称" v-model="form.ctrlerName"/>
      </BiCol>
      <BiCol>
      <BiFormItemSelect :options="form.ctrlerNaturalYn === 'Y'?dicts.IDNTYPES:dicts.ORGIDNTYPES" label="证件类型" name="ctrlerIdnType" v-model="form.ctrlerIdnType"/>
      </BiCol>
      <BiCol>
        <BiFormItemInput label="证件号码" name="ctrlerIdnNo" placeholder="请输入证件号码" v-model="form.ctrlerIdnNo"/>
      </BiCol>
      <BiCol>
        <BiRangeDatePicker label="有效期" :dateEnd="form.ctrlerIdnEndDt" :dateStart="form.ctrlerIdnStdDt" @change="changeDate($event,'ctrlerIdnStdDt','ctrlerIdnEndDt')"  />
      </BiCol>
    </a-card>
    <a-card class="card" title="联系人（授权经办人）" :bordered="false">
      <BiCol>
        <BiFormItemInput label="姓名/名称" name="contactor.contName" placeholder="请输入姓名/名称" v-model="form.contactor.contName"/>
      </BiCol>
      <BiCol>
      <BiFormItemSelect :options="dicts.IDNTYPES" label="证件类型" name="contactor.idnType" v-model="form.contactor.idnType"/>
      </BiCol>
      <BiCol>
        <BiFormItemInput label="证件号码" name="contactor.idn" placeholder="请输入证件号码" v-model="form.contactor.idn"/>
      </BiCol>
      <BiCol>
        <BiRangeDatePicker label="有效期" :dateEnd="form.contactor.idnEndDt" :dateStart="form.contactor.idnStdDt" @change="changeDate($event,'idnStdDt','idnEndDt','contactor')"  />
      </BiCol>
      <BiCol>
        <BiFormItemInput label="手机号码" name="cphone" placeholder="请输入手机号码" v-model="form.contactor.cphone" />
      </BiCol>
      <BiCol>
        <BiFormItemInput label="固定电话" name="fphone" placeholder="请输入固定电话" v-model="form.contactor.fphone"/>
      </BiCol>
      <BiCol>
        <BiFormItemInput label="电子邮箱" name="email" placeholder="请输入电子邮箱" v-model="form.contactor.email"/>
      </BiCol>
      <BiCol>
        <BiFormItemCascader label="联系地址" v-model="contactorAreas" :needCountry='false'/>
      </BiCol>
      <BiCol>
        <BiFormItemInput label="详细地址"  placeholder="请输入详细地址" v-model="contactorAddress"/>
      </BiCol>
    </a-card>
    <a-card class="card" title="附件上传" :bordered="false">
      <BiCol>
        <BiUpload v-model="files"></BiUpload>
      </BiCol>
      <br/>
    </a-card>
    <a-form-item
        :wrapperCol="{ span: 24 }"
        style="text-align: center"
      >
        <a-button @click="onSubmit" type="primary">提交</a-button>
        <a-button style="margin-left: 8px" @click="back">返回</a-button>
    </a-form-item>
  </a-form-model>

</template>

<script>
import { saveAssignee, showAssignee } from '@/api/BiApi'
import JDSelectTag from '@comp/dict/JDSelectTag'
import dictMixin from '@mixins/dictMixin'
import biUploadMixin from '@mixins/biUploadMixin'

  export default {
    name: 'Assignee',
    components: {
      JDSelectTag
    },
    inject:['closeCurrent'],
    mixins:[dictMixin,biUploadMixin],
    data () {
      return {
        // 省市区
        areas: [],
        address: '',//详细地址
        contactorAreas:[],
        contactorAddress:'',
        form: {
          cai: {},
          contactor:{},
          ctrlerNaturalYn: 'Y',
          principalNaturalYn: 'Y'
        },
        rules: {
          partyName: [
            { required: true, message: '请输入名称', trigger: 'blur' },
          ],
          idn: [
            { required: true, message: '请输入证件号码', trigger: 'blur' },
            { max: 20, message: '长度最多为20个字符', trigger: 'blur' },
            { pattern: /^[a-zA-Z0-9\-\_]+$/, message: '只能含字母、数字、连接线"-"下划线"_"', trigger: 'blur'},
          ],
          'cai.accOpenBank': [
            { required: true, message: '请输入开户银行网点', trigger: 'blur' },
          ],
          'cai.accNo': [
            { required: true, message: '请输入账户', trigger: 'blur' },
          ],
          'cai.accName': [
            { required: true, message: '请输入户名', trigger: 'blur' },
          ],
          'cai.bankCode':[
            { required: true, message: '请选择开户银行', trigger: 'change' },
          ],
          orgType: [
            { required: true, message: '请选择机构类型', trigger: 'change' },
          ],
          idnType: [
            { required: true, message: '请选择证件类型', trigger: 'change' },
          ],
          'contactor.contName': [
            { required: true, message: '请输入姓名/名称', trigger: 'blur' },
          ],
          'contactor.idnType': [
            { required: true, message: '请选择证件类型', trigger: 'change' },
          ],
          'contactor.idn': [
            { required: true, message: '请输入证件号码', trigger: 'blur' },
            { max: 20, message: '长度最多为20个字符', trigger: 'blur' },
            { pattern: /^[a-zA-Z0-9\-\_]+$/, message: '只能包含字母、数字、连接线"-",下划线"_"', trigger: 'blur'},
          ],
        },

        perctSum: 0,
        // 复制新增
        copyNew: false,
      }
    },
    methods: {
      back () {
        this.$router.push({ name:'assetTacticList' })
        this.closeCurrent()
      },
      onSubmit () {
        let res = ''
        let param = {
          cri:{...this.form, naturalYn:'N'},
          cai: this.form.cai,
          cpac: {},
          contactor:this.form.contactor,
          files:[],
        }
        if( this.areas.length ){
          param.cpac = {
            addrProvCode: this.areas[0],
            addrCityCode: this.areas[1],
            addrCountyCode: this.areas[2],
            address: this.address
          }
        }
        if( this.contactorAreas.length ){
          param.contactor.contAddr = {
            addrProvCode: this.contactorAreas[0],
            addrCityCode: this.contactorAreas[1],
            addrCountyCode: this.contactorAreas[2],
            address: this.contactorAddress
          }
        }
        this.$refs.assetForm.validate( async(valid) => {
          if (valid) {
            res = await saveAssignee(param)
            if (res.success) {
              //result.cri.id
              this.$message.success('操作成功');
              // 上传文件

              this.uploadFiles('RELPARTY_TRUSTEE','AssigneeFiles')//统一参数管理委托人以及项目新增委托人统一附件规则，AssigneeFiles值不可以修改后台逻辑用
            }
          }
        });
      },
      handleChange (value,column,index) {
        const newData = [...this.tacticPercents]
        const target = newData[index]
        if (target) {
          // if( (+target.perctMin) > (+target.perctMax) ) {
          //   this.$message.warning('警示下限不能大于警示上限')
          //   return
          // }
          target[column] = value
          this.tacticPercents = newData
        }
        let sum = 0
        this.tacticPercents.forEach(item=>{
          sum += item.perct
        })
        this.perctSum  = sum
      },
      changeDate (val,startKey,endKey,childKey) {
        this.$set(childKey? this.form[childKey] : this.form,startKey,val[0]|| '')
        this.$set(childKey? this.form[childKey] : this.form,endKey,val[1]|| '')
      },
      async showAssignee () {
        const res = await showAssignee()
        if( res.success ){
          // 获取文件
          this.getFiles('RELPARTY_TRUSTEE','AssigneeFiles')
          const {cai,contactor,cri,cpac } = res.result
          if(cai){
            this.form = {
              ...cri,cai,contactor
            }
          }
          if(cpac){
            // 地址处理
            this.areas = [cpac.addrProvCode,cpac.addrCityCode,cpac.addrCountyCode]
            this.address = cpac.address
          }
          if(contactor){
            this.contactorAreas = [contactor.contAddr.addrProvCode,contactor.contAddr.addrCityCode,contactor.contAddr.addrCountyCode]
            this.contactorAddress = contactor.contAddr.address
          }
        }
      },
    },
    mounted() {

    },
    created() {
      this.getDict('ORG_TYPE,IDNTYPES,ORGIDNTYPES,BANK_CODE,CUS_CATEGORY_ORGAN')
      this.showAssignee()

    }
  }
</script>
<style lang="stylus" scoped>
  .card{
    margin-bottom: 24px;
  }
  .desc{
    line-height: 1
  }
</style>