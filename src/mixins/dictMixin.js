/** 
 *字典的维护
 #资产归属  PRO_CHANNEL
  #币种         CUR_CODE
  #产品风险等级  PRO_RISK_CODE
  产品维护状态  PRO_STATUS
  #资产来源    PRO_SOURCE
  #期限单位  TERM_UNIT
  #收益率类型 INCOME_TYPE
  #付息方式 PRO_INT_TYPE
  #赎回方式 REDEMPTIONMODE
  #融资主体评级 担保人评级 BOND_RANK_L BOND_RANK_S
  #债项/产品评级 BOND_TERM
  #认/申费扣收方式 FEE_TYPES
  #资金投向行业  IDS_TYPE
  #资产期限  PRODUCT_DEADLINE_TYPE
  #国家 AREA_CODE
  #客户风险等级 RISK_CODE
  合同系列 CONTRACT_SERIE
  头尾处理 ENDDAY_CAL_TYPE
  信托资金约定用途TRUST_CAPITALE_USE
  收益分配方式C_DIVFLAG
  投资决策人DECI_MAKER_TYPE
*/
import { getProInvCats,getProInvTypes,getProAssetcats,getDict,getProPfcats,getAdmOrgnaiztionInfo } from '@/api/BiApi'
export default{
  data() {
    return {
      proInvCats: [],// 产品投资类别一级
      proInvTypes: [],// 投资细类二级
      proAssetcats: [],// 资产类别参数表
      proPfcats: [], // 产品类别
      admOrgnaiztions: [], // 发行机构
      dicts: [],//通用字典
    }
  },
  methods: {
    // 通过code获得名称
    getDictNameByCode (dict,code,customKey='value',customVal='name') {
      const arr = dict && dict.length && dict.filter(item=>{ return item[customKey] == code }) || []
      return arr.length ? arr[0][customVal] : '--'
    },
    // 资产类别
    async getProAssetcats () {
      const res = await getProAssetcats()
      if ( res.success ) {
        this.proAssetcats = res.result.records.map(item=>{return {name:item.assetcatName,value:item.assetcatCode}})
      }
    },
    // 根据资产类别和一级获取二级
    async getProInvTypes (assetcatCode,invCatCode) {
      const res = await getProInvTypes({ assetcatCode,invCatCode })
      if ( res.success ) {
        this.proInvTypes = res.result.records.map(item=>{return {name:item.invtypeName,value:item.invtypeCode}})
      }
    },
    // 一级
    async getProInvCats () {
      const res = await getProInvCats()
      if ( res.success ) {
        this.proInvCats = res.result.records.map(item=>{return {name:item.invcatName,value:item.invcatCode}})
      }
    },
    // 产品类别
    async getProPfcats () {
      const res = await getProPfcats()
      if ( res.success ) {
        this.proPfcats = res.result.records.map(item=>{return {name:item.pfcatName,value:item.pfcatCode}})
      }
    },
    // 发行机构
    async   getAdmOrgnaiztionInfo (param) {
      const res = await getAdmOrgnaiztionInfo(param)
      if ( res.success ) {
        this.admOrgnaiztions = res.result.records.map(item=>{return {name:item.orgName,value:item.orgCode}})
      }
    },
    // 字典
    async getDict (param) {
      //param 以逗号分隔的字符串
      const res = await getDict({dictCodes:param})
      if ( res.success ) {
        for(let key in res.result){
          res.result[key].forEach(item=>{
            item.name = item.text
            if(key == 'AREA_CODE'){
              item.areaName = item.text
              item.areaCode = item.value
              item.areaLv = 0
              item.value == '001' && (item.isLeaf = false)
            }
          })
        }
        this.dicts = res.result
      }
    },
    async initbirthDt(event, val){
      let flag = '';
      if(val === 'rel'){
        flag = this.form.cri.idnType
      }else{
        flag = this.form.cusBasicInfo.idnType
      }
      if(flag ==='10'){
        const idCard = event.target.value
        let birthday = "";
        let sex = '';
        if(idCard != null && idCard != ""){
          if(idCard.length == 15){
            birthday = "19"+idCard.slice(6,12);
            sex = idCard.substring(13,14);
          } else if(idCard.length == 18){
            birthday = idCard.slice(6,14);
            sex = idCard.substring(16,17);
          }
          birthday = birthday.replace(/(.{4})(.{2})/,"$1-$2-");
          //通过正则表达式来指定输出格式为:1990-01-01
        }
        if(val === 'rel'){
          this.form.cri.birthDt = birthday;
          this.form.cri.natCode = '001'
          //初始化性别
          if(!sex)
          return
          if(sex%2 === 0) this.form.cri.gender = '2';
          else this.form.cri.gender = '1';
        }else{
          this.form.cusBasicInfo.birthDt = birthday;
          this.form.cusBasicInfo.natCode = '001';
          //初始化性别
          if(!sex)
          return
          if(sex%2 === 0) this.$set(this.form.cusBasicInfo,'gender','F');
          else this.$set(this.form.cusBasicInfo,'gender','M');
        }
      }
    },

  }
}