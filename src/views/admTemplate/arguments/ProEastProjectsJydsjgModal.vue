<template>
  <a-form-model ref="assetForm" :model="form" :rules="rules">
    <a-card class="card" title="基本信息" :bordered="false">
      <a-row>
        <BiCol>
          <BiFormItemInput label="名称" name="orgName" placeholder="请输入名称" v-model="form.orgName"/>
        </BiCol>
        <BiCol>
          <BiFormItemInput label="统一社会信用代码" name="creditCode" placeholder="请输入统一社会信用代码" v-model="form.creditCode"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.ORG_TYPE" label="机构类型" name="orgTypeDic" v-model="form.orgTypeDic"/>
        </BiCol>
        <BiCol v-if="orgType !=='PS'">
          <BiFormItemSelect :options="dicts.COOPERATE_TYPE" label="合作方式"  v-model="form.coopMode"/>
        </BiCol>
        <BiCol v-if="orgType !=='PS'">
          <BiFormItemInput label="注册资本" name="registCapital" placeholder="请输入注册资本" v-model="form.registCapital"/>
        </BiCol>
        <!-- <BiCol>
          <BiFormItemSelect :options="dicts.ORGIDNTYPES" label="证件类型" name="idnType" v-model="form.idnType"/>
        </BiCol>
        <BiCol>
          <BiFormItemInput label="证件号码" name="idn" placeholder="请输入证件号码" v-model="form.idn"/>
        </BiCol> -->
        <BiCol v-if="orgType !=='PS'">
          <BiFormItemDatePicker label="工商注册日期" name="businessRegistrationDt" dateFormat='YYYY-MM-DD' v-model="form.businessRegistrationDt"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.AREA_CODE" label="所属国别/地区" name="accNationality" v-model="form.accNationality"/>
        </BiCol>
        <BiCol>
          <BiFormItemCascader label="所属区域" v-model="form.areas" name="areas" :needCountry='false'/>
        </BiCol>
        <BiCol v-if="orgType !== 'PS'">
          <BiFormItemInput label="注册地址"  placeholder="请输入注册地址" name="address" v-model="form.address"/>
        </BiCol>
        <BiCol v-if="orgType == 'PS'">
          <BiFormItemInput label="通讯地址"  placeholder="请输入通讯地址" name="address" v-model="form.address"/>
        </BiCol>
        <BiCol v-if="orgType !== 'PS'">
          <BiFormItemTextarea label="经营范围" name="orgBusScope" v-model="form.orgBusScope" placeholder="请输入经营范围"/>
        </BiCol>
      </a-row>
    </a-card>
    <a-card class="card" title="账户信息" :bordered="false" v-if="orgType !== 'PS'">
      <BiCol>
        <BiFormItemInput label="户名" name="accName" placeholder="请输入户名" v-model="form.accName"/>
      </BiCol>
      <BiCol>
        <BiFormItemInput label="账户" name="accNo" placeholder="请输入账户" v-model="form.accNo"/>
      </BiCol>
      <BiCol>
        <BiFormItemInput label="开户行" name="accOpenBank" placeholder="请输入开户行" v-model="form.accOpenBank"/>
      </BiCol>
    </a-card>
    <a-card class="card" title="法定代表人或负责人" :bordered="false" v-if="orgType !== 'PS'">
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
    name: 'ProEastProjectsJydsjgModal',
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
        form: {
          areas:[],
          principalNaturalYn:'Y'
        },
        rules: {
          areas:[
            { required: true, message: '请输入所属区域', trigger: 'blur' },
          ],
          address:[
            { required: true, message: '请输入地址', trigger: 'blur' },
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
            { required: true, message: '请选择证', trigger: 'change' },
          ],

        },
        contactors: [],
        // 复制新增
        copyNew: false,
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
      back () {
        this.$router.push({ name:'assetTacticList' })
        this.closeCurrent()
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
        if( this.form.areas.length ){
          param.cpac = {
            addrProvCode: this.form.areas[0],
            addrCityCode: this.form.areas[1],
            addrCountyCode: this.form.areas[2],
            address: this.form.address
          }
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
          const {contactors,aoi,cpac } = res.result
          this.form = {
            ...aoi
          }
          if(!aoi.principalNaturalYn){
            this.form.principalNaturalYn = 'Y'
          }
          // 地址处理
          this.form.areas = [cpac.addrProvCode,cpac.addrCityCode,cpac.addrCountyCode]
          this.form.address = cpac.address
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
    },
    created() {
      this.getDict('ORG_TYPE,IDNTYPES,ORGIDNTYPES,COOPERATE_TYPE,AREA_CODE')
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