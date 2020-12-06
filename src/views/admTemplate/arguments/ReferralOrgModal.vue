/**
客户推荐机构新增查看编辑
 */
<template>
  <div>
    <a-form-model ref="crorg" :model="crorg" :rules="rules">
      <a-card class="card" title="基本信息" :bordered="false">
        <a-row>
            <BiCol>
              <BiFormItemInput  label="上级机构" name="parentOrgCode" placeholder="" v-model="parentOrg.parentOrgName" :disabled="true"/>
            </BiCol>
          </a-row>
        <a-row>
          <BiCol>
            <BiFormItemInput label="名称" :disabled="disabled" name="orgName" placeholder="请输入名称" v-model="crorg.orgName"/>
          </BiCol>
          <BiCol>
            <BiFormItemInput label="统一社会信用代码" :disabled="disabled" name="creditCode" placeholder="请输入统一社会信用代码" v-model="crorg.creditCode"/>
          </BiCol>
          <BiCol>
            <BiFormItemSelect :options="dicts.ORG_TYPE" label="机构类型" name="orgType" :disabled="disabled" v-model="crorg.orgType"/>
          </BiCol>
          <BiCol>
            <BiFormItemSelect :options="dicts.COOPERATE_TYPE" label="合作方式"  :disabled="disabled" v-model="crorg.coopMode"/>
          </BiCol>
          <BiCol>
            <BiFormItemInput label="注册资本" name="registCapital" :disabled="disabled" placeholder="请输入注册资本" v-model="crorg.registCapital"/>
          </BiCol>
          <BiCol>
            <BiFormItemDatePicker label="工商注册日期" name="businessRegistrationDt" :disabled="disabled" dateFormat='YYYY-MM-DD' v-model="crorg.businessRegistrationDt"/>
          </BiCol>
          <BiCol>
            <BiFormItemSelect :options="dicts.AREA_CODE" label="所属国别/地区" name="accNationality":disabled="disabled" v-model="crorg.accNationality"/>
          </BiCol>
          <BiCol>
            <BiFormItemCascader label="所属区域" v-model="areas" :needCountry='false' :disabled="disabled"/>
          </BiCol>
          <BiCol>
            <BiFormItemInput label="注册地址"  placeholder="请输入注册地址" v-model="address" :disabled="disabled"/>
          </BiCol>
          <BiCol>
            <BiFormItemTextarea label="经营范围" name="orgBusScope" v-model="crorg.orgBusScope":disabled="disabled" placeholder="请输入经营范围"/>
          </BiCol>
        </a-row> 
      </a-card>
    </a-form-model>
    <a-form-model ref="cerdj" :model="cerdj" :rules="rules">
      <a-card class="card" title="法定代表人或负责人" :bordered="false">
      <!--  <a-form-item label="类型" slot="extra" style="width: 200px;margin: 0;padding: 0;" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }">
          <j-d-select-tag dict-code="NATURAL_YN" v-model="cerdj.naturalYn"></j-d-select-tag>
        </a-form-item>-->
        <a-form-item label="类型"  slot="extra" style="width: 200px;margin: 0;padding: 0;" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }">
          <j-d-select-tag  v-if="type !== 'view'" dict-code="NATURAL_YN" v-model="cerdj.naturalYn"></j-d-select-tag>
          <span v-else v-text="this.getDictNameByCode(this.dicts.NATURAL_YN,cerdj.naturalYn)==='--'?'':this.getDictNameByCode(this.dicts.NATURAL_YN,cerdj.naturalYn)"></span>
        </a-form-item>

        <BiCol>
          <BiFormItemInput label="姓名/名称" name="fddbr" placeholder="请输入姓名/名称"  :disabled="disabled"v-model="cerdj.fddbr"/>
        </BiCol>
        <BiCol>
        <BiFormItemSelect :options="cerdj.naturalYn === 'Y'?dicts.IDNTYPES:dicts.ORGIDNTYPES" :disabled="disabled" label="证件类型" name="fddbrzjlx" v-model="cerdj.fddbrzjlx"/>
        </BiCol>
        <BiCol>
          <BiFormItemInput label="证件号码" name="fddbrzjhm" placeholder="请输入证件号码" :disabled="disabled" v-model="cerdj.fddbrzjhm"/>
        </BiCol>
        <BiCol>
          <BiRangeDatePicker label="有效期" :dateEnd="cerdj.zjjsrq" :dateStart="cerdj.zjksrq":disabled="disabled" @change="changeDate($event,'zjksrq','zjjsrq')"  />
        </BiCol>
      </a-card>
    </a-form-model>
      <a-card class="card" title="联系人" :bordered="false">
      <Contactor ref="contactor" :contactors="contactors" :disabled="type=='view'"/>
      </a-card>
  </div>
</template>

<script>
import { cusRecommendOrgSave, showCusRecommendOrganInfo } from '@/api/BiApi'
import JDSelectTag from '@comp/dict/JDSelectTag'
import dictMixin from '@mixins/dictMixin'
import Contactor from './Contactor'
  export default {
    name: 'ReferralOrgModal',
    components: { 
      JDSelectTag,Contactor
    },
    inject:['closeCurrent'],
    mixins:[dictMixin],
    data () {
      return {
        // 省市区
        disabled:false,
        areas: [],
        address: '',//详细地址
        contactorAreas:[],
        contactorAddress:'',
        crorg:{},
        cerdj:{},
        rules: {
          'orgName': [
            { required: true, message: '请输入名称', trigger: 'blur' },
          ],
          'creditCode': [
            { required: true, message: '请输入统一社会信用代码', trigger: 'blur' },
          ],
          'registCapital': [
            { required: true, message: '请输入注册资本', trigger: 'blur' },
          ],
          'idn': [
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
          'orgType': [
            { required: true, message: '请选择机构类型', trigger: 'change' },
          ],
          // coopMode: [
          //   { required: true, message: '请选择合作方式', trigger: 'change' },
          // ],
          'idnType': [
            { required: true, message: '请选择证件类型', trigger: 'change' },
          ],
          'businessRegistrationDt': [
            { required: true, message: '请选择证', trigger: 'change' },
          ],
          
        },
        contactors: [],
      }
    },
    props: {
      id:{
        default: ''
      },
      // 父级客户机构
      parentOrg:{
        default: function(){
          return {
            orgCode: '',
            parentOrgCode: '',
            parentOrgName: '',
            strset: '',
            depths: 0,
          }
        }
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
      async onSubmit () {
        if(this.type == 'view'){
          this.$emit('update')
          return
        }
        let res = ''
        let param = {
          crorg:{...this.crorg, 
            orgCode:this.parentOrg.orgCode,
            parentOrgCode:this.parentOrg.parentOrgCode,
            parentOrgName:this.parentOrg.parentOrgName,
            depths:this.parentOrg.depths,
            strset:this.parentOrg.strset,
          },
          cerdj: this.cerdj,
          contactors:this.$refs.contactor.contactors,
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
        const crorgFlag = this.$refs.crorg.validate()
        const cerdjFlag = this.$refs.cerdj.validate();
        Promise.all([crorgFlag,cerdjFlag]).then(async data=>{
           res = await cusRecommendOrgSave(param)
            if (res.success) {
              this.$message.success('操作成功');
              this.$emit('update')
            }
        })
      },
    
      changeDate (val,startKey,endKey,childKey) {
        this.$set(childKey? this.cerdj[childKey] : this.cerdj,startKey,val[0]|| '')
        this.$set(childKey? this.cerdj[childKey] : this.cerdj,endKey,val[1]|| '')
      },
      async showCusRecommendOrganInfo () {
        const res = await showCusRecommendOrganInfo({orgCode:this.parentOrg.orgCode})
        if( res.success ){
          const {contactors,crorg,cpac,cerdj } = res.result
          this.crorg = crorg
          this.cerdj = cerdj
          // 地址处理
          if(cpac){
            this.areas = [cpac.addrProvCode,cpac.addrCityCode,cpac.addrCountyCode]
            this.address = cpac.address
          }
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
      if(this.type == 'view'){
        this.disabled=true
      }

    },
    created() {
      this.getDict('ORG_TYPE,IDNTYPES,ORGIDNTYPES,COOPERATE_TYPE,AREA_CODE,NATURAL_YN')
      if( this.parentOrg.orgCode ){
        this.showCusRecommendOrganInfo()
      }
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