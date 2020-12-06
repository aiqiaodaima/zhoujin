<template>
  <page-layout :title="`资产编号：${detail.bankProCode}`">

    <a-card style="margin-top: -12px" :bordered="false" title="基本信息">
      <detail-list>
        <detail-list-item term="发行机构">{{getDictNameByCode(pros,detail.issuerCode)}}</detail-list-item>
        <detail-list-item term="资产归属">{{getDictNameByCode(dicts.PRO_CHANNEL,detail.channel)}}</detail-list-item>
        <detail-list-item term="资产来源">{{getDictNameByCode(dicts.PRO_SOURCE,detail.sourceType)}}</detail-list-item>
        <detail-list-item term="是否跨部门查看">{{getDictNameByCode(dicts.YN,detail.allYn) || '--'}}</detail-list-item>
        <detail-list-item term="资产代码">{{detail.bankProCode}}</detail-list-item>
        <detail-list-item term="资产代码（估值系统）">{{detail.proCodeGuzhi}}</detail-list-item>
        <detail-list-item term="中信登登记编号">{{detail.regCodeZxd || '--'}}</detail-list-item>
        <detail-list-item term="资产名称">{{detail.proName}}</detail-list-item>
        <detail-list-item term="资产简称">{{detail.proShortname}}</detail-list-item>
        <detail-list-item term="币种">{{getDictNameByCode(dicts.CUR_CODE,detail.curCode) || '--'}}</detail-list-item>
        <detail-list-item term="资产成立日">{{detail.proStdDt}}</detail-list-item>
        <detail-list-item term="资产期限">{{detail.productDeadlineType==1?'永久存续':((detail.invTerm || 0) + (getDictNameByCode(dicts.TERM_UNIT,detail.invTermUnit)||'天'))}}</detail-list-item>
        <detail-list-item term="资产终止日">{{detail.proEndDt || '--'}}</detail-list-item>
        <detail-list-item term="收益率类型">{{getDictNameByCode(dicts.INCOME_TYPE,detail.incomeType)}}</detail-list-item>
        <detail-list-item term="预期收益率（%）">{{detail.expReturnRate}}</detail-list-item>
        <detail-list-item term="收益率浮动说明">{{detail.floatRateDesc || '--'}}</detail-list-item>
        <detail-list-item term="付息方式">{{getDictNameByCode(dicts.PRO_INT_TYPE,detail.intType)}}</detail-list-item>
        <!--<detail-list-item term="分红规则设定"></detail-list-item>-->
        <detail-list-item term="赎回方式">{{getDictNameByCode(dicts.REDEMPTIONMODE,detail.redeemType) || '--'}}</detail-list-item>
        <!--<detail-list-item term="维护开放期规则"></detail-list-item>-->
        <detail-list-item term="是否有开放期">{{getDictNameByCode(dicts.YN,detail.rpoOpenYn)}}</detail-list-item>
        <detail-list-item term="投资封闭期/投资期限">{{(detail.termOfInvestment|| '--')+getDictNameByCode(dicts.TERM_UNIT,detail.deadlineDateFlag)}}</detail-list-item>
        <detail-list-item term="资产面值">{{detail.faceValue || '--'}}</detail-list-item>
        <detail-list-item term="头尾处理">{{getDictNameByCode(dicts.ENDDAY_CAL_TYPE,detail.headAndTailProcessing)}}</detail-list-item>
        <detail-list-item term="风险等级">{{getDictNameByCode(dicts.PRO_RISK_CODE,detail.riskCode)}}</detail-list-item>
        <detail-list-item term="认/申费扣收方式">{{getDictNameByCode(dicts.FEE_TYPES,detail.buyFeeType) || '--'}}</detail-list-item>
        <detail-list-item term="预警线">{{detail.alertLine}}</detail-list-item>
        <detail-list-item term="平仓线">{{detail.alertStoploss}}</detail-list-item>
      </detail-list>
      <BiComments :comments="[ '1、【结构化优先级】为结构化产品的特有字段。','2、【资产面值】：资产收益率类型为非净值型时，必须录入面值。','3、【付息方式】：产品收益率类型为非净值型时，必须选择一种付息方式。','4、【预警线】、【平仓线】：仅作为资产属性展示；家族信托计划投资产品的损益警示线以在损益警示设置功能中的设置为准。']"/>
    </a-card>

    <a-card style="margin-top: 12px" :bordered="false" title="投资相关信息">
      <detail-list>
        <detail-list-item term="投资区域">{{areas}}</detail-list-item>
        <detail-list-item term="资金投向行业">{{getDictNameByCode(dicts.IDS_TYPE,detail.proIdsType)}}</detail-list-item>
        <!--<detail-list-item term="量化对冲策略">{{detail.qhiStrategy}}</detail-list-item>-->
        <!--<detail-list-item term="是否中性">{{getDictNameByCode(dicts.YN,detail.neutralYn)}}</detail-list-item>-->
        <detail-list-item term="融资主体评级">{{getDictNameByCode(dicts.BOND_RANK_L,detail.financingRank)}}</detail-list-item>
        <detail-list-item term="担保人评级">{{getDictNameByCode(dicts.BOND_RANK_S,detail.guarantorRank)}}</detail-list-item>
        <detail-list-item term="资产类别">{{proAssetcatsName}}</detail-list-item>
        <detail-list-item term="产品类别">{{proPfcatsName}}</detail-list-item>
        <detail-list-item term="产品类别（一级）">{{proInvCatsName}}</detail-list-item>
        <detail-list-item term="产品类别（二级）">{{proInvTypesName}}</detail-list-item>
        <detail-list-item term="债项/产品评级">{{getDictNameByCode(dicts.BOND_TERM,detail.bondRank)}}</detail-list-item>
        <detail-list-item term="是否场内">{{getDictNameByCode(dicts.YN,detail.exchangeProYn)}}</detail-list-item>
        <detail-list-item term="乐观情景%">{{detail.estimateOptimism}}</detail-list-item>
        <detail-list-item term="中性情景%">{{detail.estimateNeutral}}</detail-list-item>
        <detail-list-item term="悲观情景%">{{detail.estimatePessimism}}</detail-list-item>
        <detail-list-item term="资金投向行业明细">{{detail.detailCode}}</detail-list-item>
      </detail-list>
      <BiComments :comments="[ '1、【融资主体评级】、【担保人评级】为债券及债权融资类产品的特有字段。','2、【债项/产品评级】为债券及债权融资类产品的特有字段。']"/>
    </a-card>
    <a-card style="margin-top: 12px" :bordered="false" title="资产相关文档及说明">
      <detail-list>
        <detail-list-item term="风险安排">{{detail.riskSettleDesc}}</detail-list-item>
        <detail-list-item term="资金运用">{{detail.capitalUsingDesc}}</detail-list-item>
        <detail-list-item term="资产相关产品说明">{{detail.proMemoDesc}}</detail-list-item>
        <!--<detail-list-item term="文件"></detail-list-item>-->
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item label="文件">
              <a-upload :fileList="fileList" :multiple="true">
              </a-upload>
            </a-form-item>
          </a-col>
        </a-row>
      </detail-list>

    </a-card>
    <a-card class="card" title="资金交收账户" :bordered="false">
      <detail-list>
      <detail-list-item term="资金交收方式">{{getDictNameByCode(dicts.CAP_SET_MED,detail.capitalSettlementMethod)}}</detail-list-item>
        </detail-list>
      <a-table v-if="detail.capitalSettlementMethod !=='2'"
        :columns="columns"
        :dataSource="proSettleAccounts"
        :pagination="false"
        rowKey="accNo"
      >
        <template slot="index" slot-scope="text, record, index">{{index+1}}</template>
        <template v-for="(col, i) in ['accType', 'accName', 'accNo', 'accOpenBank', 'bigAccNo']" :slot="col" slot-scope="text, record, index">
         
          <template >{{ text }}</template>
        </template>
      </a-table> 
    </a-card>
  </page-layout>
</template>

<script>
  import { mixinDevice } from '@/utils/mixin.js'
  import dictMixin from '@mixins/dictMixin'
  import PageLayout from '@/components/page/PageLayout'
  import DetailList from '@bi/BiDetailList'
  import { getProductDetail,getCusAreaList,getDict,getCusAreaByAreaCode,getAdmOrgnaiztionInfo,getProAssetcats,getProPfcats,getProInvCats,getProInvTypes } from '@/api/BiApi'
  import { httpActionWF, postAction,deleteActionByPostMethod } from '@/api/manage'

  const DetailListItem = DetailList.Item

  export default {
    name: "AssetDetail",
    components: {
      PageLayout,
      DetailList,
      DetailListItem
    },
    mixins: [mixinDevice,dictMixin],
    data () {
      return {
        proAssetcatsName:'',
        proPfcatsName:'',
        proInvCatsName:'',
        proInvTypesName:'',
        areas:'',
        detail: {},
        fileList:[],
        proSettleAccounts: [],
        pros:[],
        // table
        url: {
          upload: "/sys/common/biUpload",
          getFiles: "/sys/common/getFiles",
          deleteFiles:"/sys/common/deleteFiles",
        },
        columns: [
          {
            title: '序号',
            key: 'index',
            width: '10',
            scopedSlots: { customRender: 'index' }
          },
          {
            title: '银行名称',
            dataIndex: 'bankCode',
            key: 'bankCode',
            width: '30',
            customRender: (text) => this.getDictNameByCode(this.dicts.BANK_CODE,text)
          },
          {
            title: '账户类型',
            dataIndex: 'accType',
            key: 'accType',
            width: '20',
            // scopedSlots: { customRender: 'accType' }
            customRender: (text) => this.getDictNameByCode(this.dicts.PRO_ACC_TYPE,text)
          },
          {
            title: '户名',
            dataIndex: 'accName',
            key: 'accName',
            width: '20',
            scopedSlots: { customRender: 'accName' }
          },
          {
            title: '账号',
            dataIndex: 'accNo',
            key: 'accNo',
            width: '20',
            scopedSlots: { customRender: 'accNo' }
          },
          {
            title: '开户行',
            dataIndex: 'accOpenBank',
            key: 'accOpenBank',
            width: '30',
            scopedSlots: { customRender: 'accOpenBank' }
          },
          {
            title: '大额支付号',
            dataIndex: 'bigAccNo',
            key: 'bigAccNo',
            width: '20',
            scopedSlots: { customRender: 'bigAccNo' }
          },
        ],
      }
    },
    methods: {
      async getProductDetail () {
        const res = await getProductDetail({proCode:this.proCode})
        if( res.success ){
          this.detail = res.result.products
          if (this.detail.expReturnRate !=null && this.detail.expReturnRate !=''){
            //保留精度
            this.detail.expReturnRate=this.detail.expReturnRate.toFixed(2)
          }
          if (this.detail.faceValue !=null && this.detail.faceValue !=''){
            //保留精度
            this.detail.faceValue=this.detail.faceValue.toFixed(4)
          }

          if (this.detail.alertLine !=null && this.detail.alertLine !=''){
            //保留精度
            this.detail.alertLine= this.detail.alertLine.toFixed(4)
          }
          if (this.detail.alertStoploss !=null && this.detail.alertStoploss !=''){
            //保留精度
            this.detail.alertStoploss= this.detail.alertStoploss.toFixed(4)
          }
          if (this.detail.estimateOptimism !=null && this.detail.estimateOptimism !=''){
            //保留精度
            this.detail.estimateOptimism=this.detail.estimateOptimism.toFixed(2)
          }
          if (this.detail.estimateNeutral !=null && this.detail.estimateNeutral !=''){
            //保留精度
            this.detail.estimateNeutral=this.detail.estimateNeutral.toFixed(2)
          }

          if (this.detail.estimatePessimism !=null && this.detail.estimatePessimism !=''){
            //保留精度
            this.detail.estimatePessimism=this.detail.estimatePessimism.toFixed(2)
          }

          const re4 = await getProAssetcats({pageSize:999})
          if ( re4.success ) {
            this.proAssetcats = re4.result.records.map(item=>{return {name:item.assetcatName,value:item.assetcatCode}})
            this.proAssetcats.forEach(asset=>{
              if (asset.value ==this.detail.assetcatCode){
                this.proAssetcatsName=asset.name;
              }
            })
          }
          const re1 = await getProPfcats({pageSize:999})
          if ( re1.success ) {
            this.proPfcats = re1.result.records.map(item=>{return {name:item.pfcatName,value:item.pfcatCode}})
            this.proPfcats.forEach(pfcat=>{
              if (pfcat.value ==this.detail.pfcatCode){
                this.proPfcatsName=pfcat.name;
              }
            })
          }


          const re2 = await getProInvCats({pageSize:999})
          if ( re2.success ) {
            this.proInvCats = re2.result.records.map(item=>{return {name:item.invcatName,value:item.invcatCode}})
            this.proInvCats.forEach(inv=>{
              if (inv.value ==this.detail.invcatCode){
                this.proInvCatsName=inv.name;
              }
            })
          }

          const re3 = await getProInvTypes({ assetcatCode:this.detail.assetcatCode,invCatCode:this.detail.invCatCode })
          if ( re3.success ) {
            this.proInvTypes = re3.result.records.map(item=>{return {name:item.invtypeName,value:item.invtypeCode}})
            this.proInvTypes.forEach(type=>{
              if (type.value ==this.detail.invtypeCode){
                this.proInvTypesName=type.name;
              }
            })
          }

          this.proSettleAccounts = res.result.proSettleAccounts || []
            let v1='';
            let v2='';
             let v3='';
            let va ='';
          if (this.detail.areaCode !=null && this.detail.areaCode !=''){
            const res1 = await getDict({dictCodes:'AREA_CODE'})
            if (res1.success){
                  res1.result.AREA_CODE.forEach(item1=>{
                    if (item1.value ==this.detail.areaCode) {
                      v1=item1.text
                      this.areas+=item1.text
                    }
                  })
            }
          }
          if (this.detail.areaProvCode !=null && this.detail.areaProvCode !=''){
            const res2 = await getCusAreaByAreaCode({areaCode:this.detail.areaProvCode})
            if (res2.success){
              v2=res2.result.areaName
              this.areas+=res2.result.areaName
            }
          }
          if (this.detail.areaCityCode !=null && this.detail.areaCityCode !=''){
            const res3 = await getCusAreaByAreaCode({areaCode:this.detail.areaCityCode})
            if (res3.success){
              v3=res3.result.areaName
              va='1'
              this.areas+=res3.result.areaName
            }
          }
          if (va=='1'){
            this.areas=v1+"-"+v2+"-"+v3
          }
          if(this.detail.areaCode !== '001'){
            this.areas=v1
          }
        }
        this.getUploadFiles()
      },
      getUploadFiles(){
        let that = this;
        that.loading = true;
        const formData = new FormData();
        formData.append("module","AssetNew");
        formData.append("dataId", this.detail.bankProCode);
        postAction(this.url.getFiles, formData).then((res)=>{
          console.log("get",res);
          if(res.success){
            res.result.forEach((file)=>{
              file.uid = file.id;
              file.name = file.fileName;
              file.status = 'done';
              file.response = '{"status": "success"}';
              file.url = window._CONFIG['domianURL']+"/sys/common/downloadStatic/" + file.filePath;
            });
            that.fileList = res.result;
          }else{
            that.$message.error(res.message);
          }
        }).catch(function(error){
          that.$message.error('获取文件失败');
        }).finally(() => {
          that.loading = false;
        });
      },
      async getAdmOrgnaiztionInfo() {
        //PS:资产发行机构基本信息
        const res = await getAdmOrgnaiztionInfo({ pageSize:999,orgType:'PS' })
        if (res.success) {
          this.pros = res.result.records.map(pro=>{
            return {
              name: pro.orgName,
              value: pro.orgCode
            }
          })

        }
      },
    },
    props:{
      // 审核单业务key
      businessKey:{
        default: ''
      }
    },
    created() {
      //获取发行机构
      this.getAdmOrgnaiztionInfo()
      this.getProAssetcats()
      // 二级
      this.getProInvTypes()
      this.getProInvCats()
      this.getProPfcats()
      this.getDict('BANK_CODE,CAP_SET_MED,PRO_CHANNEL,PRO_ACC_TYPE,CUR_CODE,PRO_RISK_CODE,PRO_STATUS,PRO_SOURCE,TERM_UNIT,INCOME_TYPE,PRO_INT_TYPE,REDEMPTIONMODE,BOND_RANK_L,BOND_RANK_S,BOND_TERM,YN,IDS_TYPE,FEE_TYPES,PRODUCT_DEADLINE_TYPE,ENDDAY_CAL_TYPE')
      // 审核单中看订单信息
      if(this.businessKey){
        const proCode = this.businessKey.split(':')[1]
        this.proCode =proCode;
        this.getProductDetail()
      }
    },
    mounted() {
      if (this.$route.query.proCode) {
        this.proCode = this.$route.query.proCode
        this.getProductDetail()
      }
    },
    filters: {
    }
  }
</script>

<style lang="scss" scoped>

  .detail-layout {
    margin-left: 44px;
  }
  .text {
    color: rgba(0, 0, 0, .45);
  }

  .heading {
    color: rgba(0, 0, 0, .85);
    font-size: 20px;
  }

  .no-data {
    color: rgba(0, 0, 0, .25);
    text-align: center;
    line-height: 64px;
    font-size: 16px;

    i {
      font-size: 24px;
      margin-right: 16px;
      position: relative;
      top: 3px;
    }
  }

  .mobile {
    .detail-layout {
      margin-left: unset;
    }
    .text {

    }
    .status-list {
      text-align: left;
    }
  }
</style>