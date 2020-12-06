<template>
  <a-form-model ref="assetForm" :model="form" :rules="rules">
    <a-card class="card" title="基本信息" :bordered="false">
      <a-row>
        <BiCol>
          <BiFormItemInput :disabled="disabled" label="名称" name="orgName" placeholder="请输入名称" v-model="form.orgName"/>
        </BiCol>
        <BiCol>
          <BiFormItemInput :disabled="disabled" label="统一社会信用代码" name="creditCode" placeholder="请输入统一社会信用代码" v-model="form.creditCode"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :disabled="disabled" :options="dicts.CUS_CATEGORY_ORGAN" label="机构类型" name="orgTypeDic" v-model="form.orgTypeDic"/>
        </BiCol>
      </a-row>

      <a-row>
        <BiCol v-if="orgType !=='PS'">
          <BiFormItemSelect :disabled="disabled" :options="dicts.COOPERATE_TYPE" label="合作方式"  v-model="form.coopMode"/>
        </BiCol>
        <BiCol v-if="orgType !=='PS'">
          <BiInputCapitalAmount :disabled="disabled"  label="注册资本":isForm='true'  :min="0" :precision="2" name="registCapital" placeholder="请输入注册资本" v-model="form.registCapital"/>
        </BiCol>
        <!-- <BiCol>
          <BiFormItemSelect :options="dicts.ORGIDNTYPES" label="证件类型" name="idnType" v-model="form.idnType"/>
        </BiCol>
        <BiCol>
          <BiFormItemInput label="证件号码" name="idn" placeholder="请输入证件号码" v-model="form.idn"/>
        </BiCol> -->
        <BiCol v-if="orgType !=='PS'">
          <BiFormItemDatePicker :disabled="disabled" label="工商注册日期" name="businessRegistrationDt" dateFormat='YYYY-MM-DD' v-model="form.businessRegistrationDt"/>
        </BiCol>
      </a-row>
      <a-row>
        <BiCol>
          <BiFormItemSelect :disabled="disabled" :options="dicts.AREA_CODE" label="所属国别/地区" name="accNationality" v-model="form.accNationality" @change="changeNation"/>
        </BiCol>
        <BiCol v-if="addshow">
          <BiFormItemCascader :disabled="disabled" label="所属地区" v-model="areas" name="areas" placeholder="请选择所属地区" :needCountry='false'/>
        </BiCol>
        <BiCol v-else>
          <BiFormItemInput label="所属地区" :disabled="disabled"   placeholder="请输入所属地区" name="ssdqaddress" v-model="form.ssdqaddress"/>
        </BiCol>

        <BiCol v-if="orgType !== 'PS'">
          <BiFormItemInput label="注册地址" :disabled="disabled"   placeholder="请输入注册地址" name="address" v-model="form.address"/>
        </BiCol>
        <BiCol v-if="orgType == 'PS'">
          <BiFormItemInput label="通讯地址" :disabled="disabled" placeholder="请输入通讯地址" name="address" v-model="form.address"/>
        </BiCol>
      </a-row>
      <a-row>
        <BiCol v-if="orgType !== 'PS'">
          <BiFormItemTextarea :disabled="disabled" label="经营范围" name="orgBusScope" v-model="form.orgBusScope" placeholder="请输入经营范围"/>
        </BiCol>
      </a-row>
    </a-card>
    <a-card class="card" title="账户信息" :bordered="false" v-if="orgType !== 'PS'">
      <a-row>
        <BiCol>
          <BiFormItemInput label="户名":disabled="disabled" name="accName" placeholder="请输入户名" v-model="form.accName"/>
        </BiCol>
        <BiCol>
          <BiFormItemInput label="账户" :disabled="disabled" name="accNo" placeholder="请输入账户" v-model="form.accNo"/>
        </BiCol>
        <BiCol>
          <BiFormItemInput label="开户行" :disabled="disabled" name="accOpenBank" placeholder="请输入开户行" v-model="form.accOpenBank"/>
        </BiCol>
      </a-row>
    </a-card>
    <a-card class="card" title="法定代表人或负责人" :bordered="false" v-if="orgType !== 'PS'">
      <a-form-item label="类型"  slot="extra" style="width: 200px;margin: 0;padding: 0;" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }">
        <j-d-select-tag  v-if="type !== 'view'" dict-code="NATURAL_YN" v-model="form.principalNaturalYn"></j-d-select-tag>
        <span v-else v-text="this.getDictNameByCode(this.dicts.NATURAL_YN,form.principalNaturalYn)"></span>
      </a-form-item>
      <a-row>
        <BiCol>
          <BiFormItemInput label="姓名/名称":disabled="disabled" name="principalName" placeholder="请输入姓名/名称" v-model="form.principalName"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :disabled="disabled" :options="form.principalNaturalYn === 'Y'?dicts.IDNTYPES:dicts.ORGIDNTYPES" label="证件类型" name="principalIdnType" v-model="form.principalIdnType"/>
        </BiCol>
        <BiCol>
          <BiFormItemInput label="证件号码" :disabled="disabled" name="principalIdnNo" placeholder="请输入证件号码" v-model="form.principalIdnNo"/>
        </BiCol>
      </a-row>
      <a-row>
        <BiCol>
          <BiRangeDatePicker  :disabled="disabled" label="有效期" :dateEnd="form.principalIdnEndDt" :dateStart="form.principalIdnStdDt" @change="changeDate($event,'principalIdnStdDt','principalIdnEndDt')"  />
        </BiCol>
      </a-row>
    </a-card>
    <a-card class="card" title="联系人" :bordered="false">
      <Contactor ref="contactor" :contactors="contactors" :disabled="type=='view'"/>
    </a-card>
  </a-form-model>
</template>

<script>
import { saveOrg, showAdmOrganInfo } from '@/api/BiApi'
import JDSelectTag from '@comp/dict/JDSelectTag'
import dictMixin from '@mixins/dictMixin'
import Contactor from './Contactor'
  export default {
    name: 'ArgumentsModal',
    components: { 
      JDSelectTag,Contactor
    },
    inject:['closeCurrent'],
    mixins:[dictMixin],
    data () {
      return {
        // 省市区
        //areas: [],
        // address: '',//详细地址
        contactorAreas:[],
        contactorAddress:'',
        areas:[],
        form: {
          principalNaturalYn:'Y',
          address:'',
          ssdqaddress:''

        },
        rules: {
          address:[
            { required: true, message: '请输入地址', trigger: 'blur' },
          ],
          ssdqaddress:[
            { required: true, message: '请输入所属地区', trigger: 'blur' },
          ],
          accNationality:[
            { required: true, message: '请选择所属国别/地区', trigger: 'blur' },
          ],
          orgName: [
            { required: true, message: '请输入名称', trigger: 'blur' },
          ],
          creditCode: [
            { required: true, message: '请输入统一社会信用代码', trigger: 'blur' },
          ],
          registCapital: [
            { required: true, message: '请输入注册资本', trigger: 'blur' },
          ],
          idn: [
            { required: true, message: '请输入证件号码', trigger: 'blur' },
          ],
          'accOpenBank': [
            { required: true, message: '请输入开户行', trigger: 'blur' },
          ],
          'accNo': [
            { required: true, message: '请输入账户', trigger: 'blur' },
          ],
          'accName': [
            { required: true, message: '请输入户名', trigger: 'blur' },
          ],
          orgTypeDic: [
            { required: true, message: '请选择机构类型', trigger: 'change' },
          ],
          // coopMode: [
          //   { required: true, message: '请选择合作方式', trigger: 'change' },
          // ],
          idnType: [
            { required: true, message: '请选择证件类型', trigger: 'change' },
          ],
          businessRegistrationDt: [
            { required: true, message: '请选择工商注册日期', trigger: 'change' },
          ],
        },
        contactors: [],
        // 复制新增
        copyNew: false,
        addshow:true,
        disabled:false

      }
    },
    props: {
      id:{
        default: ''
      },
      // 标识 投资顾问基本信息IM 保险人基本信息IN 财产管理机构基本信息AS 资产发行机构基本信息  PS
      orgType:{
        default: 'IM'
      },
      // 新增，编辑，查看 edite,view
      type:{
        default: 'add'
      },
    },
    methods: {
      cphoneRule(value, ){
          return new RegExp(/^1[3|4|5|7|8|9][0-9]\d{8}$/).test(value)
      },
      fphoneRule(value){
        return new RegExp(/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/).test(value)
      },
      emailRule(value){
        return new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(value)
      },
      personRule(value){
        return new RegExp(/^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/).test(value)
       },


     back () {
        this.$router.push({ name:'assetTacticList' })
        this.closeCurrent()
      },
      changeNation(val){
        if(val == '001'){
          if(!this.rules.hasOwnProperty('areas')){
            this.rules = {...this.rules, areas:[
            { required: true,
              message: '请选择所属地区',
              validator: this.belongAddrProvCodeRule,
              trigger: ['change', 'blur'] },
          ], }
          }
          this.addshow=true
        } else {
          delete this.rules.areas
          this.rules = {...this.rules}
          this.areas=[]
          this.addshow=false

        }
      },
      belongAddrProvCodeRule(rule, value, callback){
        if(!this.areas.length>0){
          callback("请选择所属地区")
        }
        else{
          callback()
        }
      },


      onSubmit () {
        if(this.type == 'view'){
          this.$emit('update')
          return
        }
        let res = ''
        let param = {
          aoi:{...this.form, orgType:this.orgType, id:this.id},
          cpac: {},
          contactors:this.$refs.contactor.contactors,
          files:[],
          addr:{},//wuxuewei xz
        }
        if(!param.contactors||!param.contactors.length){
          this.$message.error('至少填写一个联系人信息');
          return
        }
        for(var i=0;i<param.contactors.length;i++){
          if(!param.contactors[i].ctelNo&&!param.contactors[i].ftelNo){
            this.$message.error(`联系人${param.contactors[i].contName}手机号和固定电话至少填写其中一个`);
            return
          }
        }
        for(var i=0;i<param.contactors.length;i++){
          if(param.contactors[i].ctelNo){
            if(!this.cphoneRule(param.contactors[i].ctelNo)){
              this.$message.error(`联系人${param.contactors[i].contName}手机号格式不正常`);
              return
            }
          }
          if(param.contactors[i].ftelNo){
            if(!this.fphoneRule(param.contactors[i].ftelNo)){
              this.$message.error(`联系人${param.contactors[i].contName}固定电话格式不正常`);
              return
            }
          }
          if(param.contactors[i].email){
            if(!this.emailRule(param.contactors[i].email)){
              this.$message.error(`联系人${param.contactors[i].contName}邮箱格式不正常`);
              return
            }
          }
          
        }
        if(this.areas.length>0){
          param.cpac = {
            addrProvCode: this.areas[0],
            addrCityCode: this.areas[1],
            addrCountyCode: this.areas[2],
            address: this.form.address
          }
        }
        else{//修复不选省市区，地址丢失问题
          param.cpac = {
            address: this.form.address
          }
        }

        if(this.form.principalIdnType=='10'||this.form.principalIdnType=='11'){//身份证或者临时身份证规则验证

          if(!this.personRule(this.form.principalIdnNo)){
            this.$message.error(`证件号码格式不正常`);
            return
          }
        }

        param.addr = {
          address: this.form.ssdqaddress
        }

        this.$refs.assetForm.validate( async(valid) => {
          if (valid) { 
            res = await saveOrg(param)
            if (res.success) {
              this.$message.success('操作成功');
              this.$emit('update')
            }
          }
        });
      },
    
      changeDate (val,startKey,endKey,childKey) {
        this.$set(childKey? this.form[childKey] : this.form,startKey,val[0]|| '')
        this.$set(childKey? this.form[childKey] : this.form,endKey,val[1]|| '')
      },
      async showAdmOrganInfo () {
        const res = await showAdmOrganInfo({id:this.id,orgType:this.orgType})
        if( res.success ){
          const {contactors,aoi,cpac,addr } = res.result
          this.form = {
            ...aoi,address:cpac.address,ssdqaddress:addr.address
          }
          if(!aoi.principalNaturalYn){
            this.form.principalNaturalYn = 'Y'
          }
          this.changeNation(this.form.accNationality)//调用国别为中国大陆时 地区项必填验证
          // 地址处理
          this.areas = [cpac.addrProvCode,cpac.addrCityCode,cpac.addrCountyCode]
          if(contactors&&contactors.length){
            contactors.forEach(item=>{
              item.key = item.id
            })
            this.contactors = contactors
          }
        }
      },
    },

    mounted() {
      if( this.id ){
        this.showAdmOrganInfo()
      }
      if(this.type == 'view'){
        this.disabled=true
      }
    },
    created() {
      this.getDict('ORG_TYPE,CUS_CATEGORY_ORGAN,IDNTYPES,ORGIDNTYPES,COOPERATE_TYPE,AREA_CODE,NATURAL_YN')
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