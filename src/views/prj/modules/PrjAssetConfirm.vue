<template>
  <a-spin :spinning="loading">
    <a-form-model ref="assetConfirmForm" :model="form" :rules="rules">
      <a-card size="small" style="margin-top: 12px;padding-bottom: 12px" :bordered="false" title="委托资产">
        <a-row>
          <BiCol>
            <BiFormItemDatePiker label="申请交易日期" :disabled="disabled" v-model="form.applyDate" name="applyDate"></BiFormItemDatePiker>
          </BiCol>
          <BiCol>
            <BiFormItemDatePiker label="实际成交日" :disabled="disabled" v-model="form.payDate" name="payDate"></BiFormItemDatePiker>
          </BiCol>
          <BiCol>
            <BiFormItemDatePiker label="净值日期" :disabled="disabled" v-model="form.priceDate" name="priceDate"></BiFormItemDatePiker>
          </BiCol>
        </a-row>
      </a-card>

      <template v-for="acc in cusAccInfoList">
        <a-card v-if="assetsDataSource[acc.accNo]&&assetsDataSource[acc.accNo].length" :key="acc.accNo" size="small" style="margin-top: 12px;padding-bottom: 12px"
                :bordered="false" :title="getDictNameByCode(dicts['BNF_MODE'],acc.bnfMode)+'子账户：'+acc.accName">
          <a-row>
            <BiCol>
              <a-form-model-item label="成交金额">
                {{ f(accTotal[acc.accNo]) }}
              </a-form-model-item>
            </BiCol>
            <BiCol>
              <BiCol>
                <a-form-model-item label="成交单位价格" :prop="'accs.'+acc.accNo">
                  <a-input-number :disabled="disabled" :ref="'price_'+acc.accNo" :precision='4' :min="0.01" v-model="form.accs[acc.accNo]" @change="e => handlePriceChange(e,acc.accNo)"></a-input-number>
                </a-form-model-item>
              </BiCol>
            </BiCol>
          </a-row>
          <a-table :loading="loading" :columns="assetColumns" :dataSource="assetsDataSource[acc.accNo]" row>
            <template slot="unit" slot-scope="text, record, index">
              <a-input-number
                :disabled="disabled"
                style="margin: -5px 0;width: 100%"
                placeholder="请输入"
                :value="text"
                @change="e => handleChange(e,'UNIT',record.ID, acc.accNo, 'assetsDataSource')"
              />
            </template>
          </a-table>
          <a-table :loading="loading" :columns="getBnfColumns(acc.bnfMode)" :dataSource="bnfDataSource[acc.accNo]" row>
            <template slot="AST_AMT" slot-scope="text, record, index">
              <a-input-number
                :disabled="disabled"
                style="margin: -5px 0;width: 100%"
                placeholder="请输入"
                :value="text"
                @change="e => handleChange(e,'AST_AMT',record.ID, acc.accNo, 'bnfDataSource')"
              />
            </template>
            <template slot="UNIT" slot-scope="text, record, index">
              <a-input-number
                :disabled="disabled"
                style="margin: -5px 0;width: 100%"
                placeholder="请输入"
                :value="text"
                @change="e => handleChange(e,'UNIT',record.ID, acc.accNo, 'bnfDataSource')"
              />
            </template>
          </a-table>
  <!--        <j-editable-table style="padding-bottom: 20px" :columns="getBnfColumns(acc.bnfMode)" :dataSource="bnfDataSource[acc.accNo]"-->
  <!--                          :actionButton="false" :ref="acc.accNo+'_bnfEditTable'"/>-->
        </a-card>
      </template>

    </a-form-model>
  </a-spin>
</template>
<script>
  import { mapState, mapActions, mapMutations } from "vuex";
  import dictMixin from '@mixins/dictMixin'
  import moment from 'moment'
  import MatchFlow from '@views/fundFlow/MatchFlow'
  import { getPrjAssets } from '@/api/BiApi'
  import { postAction } from '../../../api/manage'
  import JDate from '../../../components/jeecg/JDate'
  import BiFormItemDatePiker from '../../../components/BI/BiFormItemDatePicker'
  import { FormTypes } from '../../../utils/JEditableTableUtil'
  import JEditableTable from '../../../components/jeecg/JEditableTable'
  import BiFormItemNumPercent from '../../../components/BI/BiFormItemNumPercent'
  import { formatAmt } from '../../../utils/util'

  export default {
    name: "PrjAssetConfirm",
    mixins:[dictMixin],
    data() {
      return {
        rules:{},
        url:{
          getRelatedBnf: '/prj/asset/relatedBnfList',
          saveUint:'/prj/asset/saveUnit'
        },
        bnfDataSource: {},
        form:{
          applyDate: '',
          payDate:'',
          priceDate: '',
          accs:{}
        },
        accTotal:{},
        assetColumns:[
          {
            title: '序号',
            dataIndex: '',
            key:'rowIndex',
            width:70,
            align:"center",
            customRender: function (t,r,index) {
              return parseInt(index)+1;
            }
          },{
            title:'资产名称',
            width:120,
            dataIndex: '',
            customRender: (text, record) => {
              let astName = '';
              if(record.PROPERTY_TYPE === 'S'){
                astName = this.getDictNameByCode(this.dicts.PROPERTY_TYPE,record.PROPERTY_TYPE);
              }else if(record.PROPERTY_TYPE === 'P'){
                astName = record.PRO_NAME;
              }else{
                astName = this.getDictNameByCode(this.dicts.TRUST_ASSET_TYPE,record.ASSET_TYPE);
              }
              record.astName = astName;
              return astName;
            }
          },{
            title:'成交金额',
            width:120,
            dataIndex: 'TRUST_PROPERTY_AMT',
            customRender: (text, record) => {
              let amt = 0;
              if(record.PROPERTY_TYPE === 'P'){
                amt = record.INV_AMT_FC;
              }else{
                amt = record.TRUST_PROPERTY_AMT;
              }
              return formatAmt(amt,2);
            }
          },{
            title:'成交份额',
            dataIndex: 'UNIT',
            width:'190px',
            scopedSlots: { customRender: 'unit' }
          }
        ],
        assetsDataSource:{},
        loading:false
      }
    },
    components: {
      BiFormItemNumPercent,
      JEditableTable,
      BiFormItemDatePiker,
      JDate,
      MatchFlow
    },
    computed: {
      ...mapState("project", [
        "status","batchId","prjCode","prjAssets","periodNo","cusAccInfoList"
      ])
    },
    props: {
      disabled: {
        default: false
      }
    },
    methods: {
      ...mapActions("project",["addOrdersOptLogs","getCusAccInfoList"]),
      ...mapMutations("project",["SET_prjAssets"]),
      moment,
      f(amt){
        return formatAmt(amt,2);
      },
      getRules() {
        let r = { required: true, message: '必输字段', trigger: 'change' };
        let rtn = {
          payDate: [r],
          priceDate: [r],
          applyDate:[r]
        };
        this.cusAccInfoList.forEach(acc=>{
          rtn["accs."+acc.accNo] = [r];
        });
        this.rules = rtn;
      },
      del(index){
        this.prjAssets.splice(index,1)
      },
      handleChange(val,col,id,accNo, dataSource){
        let x={};
        let that = this;
        Object.keys(that[dataSource]).forEach(astKey=>{
          if(astKey!==accNo){
            x[astKey] = that[dataSource][astKey];
          }else{
            const newData = that[dataSource][astKey];
            const target = newData.filter(item => id === item.ID)[0];
            if (target) {
              target[col] = val;
            }
            x[astKey] = newData;
          }
        });
        that[dataSource] = x;
      },
      async handleOk(){
        this.modal.visible = false
        this.$emit('handleUpdate')
      },
      async initPage(){
        this.loading = true;
        await this.getDict('PROPERTY_TYPE,TRUST_ASSET_TYPE,BNF_MODE,MARITAL_CODE,BNF_STATUS,PTY_RELATIVE_TYPE');
        if(this.prjCode){
          let that = this;
          await postAction(this.url.getRelatedBnf,{prjCode: that.prjCode, periodNo: that.periodNo}).then(res=>{
            if(res.success){
              res.result.forEach((r,index)=>{
                if(!r.key){
                  r.key = index;
                }
                if(!that.bnfDataSource[r.ACC_NO]){
                  that.bnfDataSource[r.ACC_NO] = [];
                }
                that.bnfDataSource[r.ACC_NO].push(r);
              });
            }else{
              this.$notification[ 'error' ]({
                message: "获取子账户关联数据失败",
                description:res.message,
                duration: 4
              });
            }
          });
          await this.getCusAccInfoList({prjCode: this.prjCode});
          this.getRules();
          const { result } = await getPrjAssets({prjCode:this.prjCode,periodNo:this.periodNo,batchId:this.batchId,pageSize:99999});
          if(result.records && result.records.length>0){
            result.records.forEach((data,index)=>{
              if(data.TRX_STATUS=='15'){
                return
              }
              if(!data.key){
                data.key = index;
              }
              if(!that.assetsDataSource[data.ACC_NO]){
                that.assetsDataSource[data.ACC_NO] = [];
              }
              that.assetsDataSource[data.ACC_NO].push(data);
              if(!that.accTotal[data.ACC_NO]){
                that.accTotal[data.ACC_NO] = 0;
              }
              let amt = 0;
              if(data.PROPERTY_TYPE === 'P'){
                amt = data.INV_AMT_FC;
              }else{
                amt = data.TRUST_PROPERTY_AMT;
              }
              if(data.PRICE){
                that.form.accs[data.ACC_NO] = data.PRICE
              }
              that.accTotal[data.ACC_NO] = that.accTotal[data.ACC_NO]+Number(amt);
              that.form.payDate = data.PAY_DT;
              that.form.applyDate = data.TRAN_DT;
              that.form.priceDate = data.PRICE_DT;
            });
          }
        }
        // if(Number(this.periodNo) === 0 && this.status==='20'){
        //   this.cusAccInfoList.forEach(acc => {
        //     this.form.accs[acc.accNo]=1;
        //     // let p = this.$refs['price_'+acc.accNo];
        //     // console.log('p=',p);
        //     // this.$refs['price_'+acc.accNo][0].$emit('change',1);
        //     // this.handlePriceChange(1, acc.accNo);
        //   });
        // }
        this.loading = false;
      },
      tradeSuccess(){
        let that = this;
        this.$refs.assetConfirmForm.validate(valid => {
          if (valid) {
            let pass = true;
            that.cusAccInfoList.forEach(acc=>{
              if(that.assetsDataSource[acc.accNo]){
                that.assetsDataSource[acc.accNo].forEach(astInfo=>{
                  let amt = 0;
                  if(astInfo.PROPERTY_TYPE === 'P'){
                    amt = astInfo.INV_AMT_FC;
                  }else{
                    amt = astInfo.TRUST_PROPERTY_AMT;
                  }
                  let u1 = Number(astInfo.UNIT).toFixed(2);
                  let u2 = (amt/that.form.accs[acc.accNo]).toFixed(2);
                  if(u1 !== u2){
                    that.$notification[ 'error' ]({
                      message: "错误",
                      description: astInfo.ACC_NAME+"成交份额数据错误",
                      duration: 4
                    });
                    pass = false;
                  }
                });
              }
              if(acc.bnfMode === 'U'){
                if(that.bnfDataSource[acc.accNo]){
                  if(that.assetsDataSource[acc.accNo]&&that.assetsDataSource[acc.accNo].length){
                    that.bnfDataSource[acc.accNo].forEach(bnfInfo=> {
                      console.log('bnfInfo=',bnfInfo);
                      let astAmt = Number(bnfInfo.AST_AMT||0).toFixed(2);
                      console.log("astAmt2=",astAmt);
                      let t = (Number(that.accTotal[acc.accNo]||0)*bnfInfo.AMT_PERCENT/100).toFixed(2);
                      console.log('t=',t);
                      if(astAmt !== t){
                        that.$notification[ 'error' ]({
                          message: "错误",
                          description: bnfInfo.PARTY_NAME+"成交金额数据错误",
                          duration: 4
                        });
                        pass = false;
                      }else if(((bnfInfo.AST_AMT||0)/that.form.accs[acc.accNo]).toFixed(2) !== Number(bnfInfo.UNIT||0).toFixed(2)){
                        that.$notification[ 'error' ]({
                          message: "错误",
                          description: bnfInfo.PARTY_NAME+"成交份额数据错误",
                          duration: 4
                        });
                        pass = false;
                      }
                    });
                  }
                }
              }
            });
            if(pass){
              that.loading = true;
              let formData = that.form;
              formData.bnfData = that.bnfDataSource;
              formData.assetsData = that.assetsDataSource;
              formData.prjCode = that.prjCode;
              formData.periodNo = that.periodNo;
              formData.batchId = this.batchId;
              console.log('formData=',formData);
              postAction(this.url.saveUint,formData).then(res=>{
                if(res.success){
                  this.$notification[ 'success' ]({
                    message: "确认份额成功",
                    description:"",
                    duration: 4
                  });
                  //添加埋点
                  that.$emit('handleUpdate');
                  // that.initialPage();
                  that.addOrdersOptLogs({
                    batchId: formData.batchId,
                    optType: '委托资产确认交付',
                    oprations: '确认份额',
                    status: '交易成功',
                  });
                  that.$emit('handleUpdate');
                }else{
                  this.$notification[ 'error' ]({
                    message: "确认份额失败",
                    description:res.message,
                    duration: 4
                  });
                }
              }).finally(()=>{
                that.loading = false;
              });
            }
          } else {
            this.$notification[ 'error' ]({
              message: "请输入必填项",
              description:"",
              duration: 4
            });
            return false;
          }
        });
      },
      getBnfColumns(bnfMode){
        let that=this
        let w= (bnfMode==='U'?'8%':'10%');
        let c = [
          {
            title:'受益顺位',
            width: w,
            dataIndex:'BNF_RANK'
          },{
            title:'姓名/名称',
            width: w,
            dataIndex:'PARTY_NAME'
          },{
            title:'受益比例(%)',
            width: w,
            dataIndex:'AMT_PERCENT',
            customRender: function (text) {
              return bnfMode==='U'?text:'--';
            }
          },{
            title:'受益人状态',
            width: w,
            dataIndex:'BNF_STATUS',
            customRender: function (text) {
              return that.getDictNameByCode(that.dicts.BNF_STATUS,text);
            }
          },{
            title:'与委托人关系',
            width: w,
            dataIndex:'CUS_RELATIVE_TYPE',
            customRender: function (text) {
              return that.getDictNameByCode(that.dicts.PTY_RELATIVE_TYPE,text);
            }
          },{
            title:'证件类型/证件号码',
            width: '20%',
            dataIndex:'IDN'
          },{
            title:'婚姻状况',
            width: w,
            key:'MARITAL_CODE',
            type: FormTypes.normal,
            customRender: function (text) {
              return that.getDictNameByCode(that.dicts.MARITAL_CODE,text.MARITAL_CODE);
            }
          },{
            title:'手机号码',
            width: w,
            dataIndex:'CPHONE'
          },{
            title:'固定电话',
            width: w,
            dataIndex:'FPHONE'
          }
        ];
        if(bnfMode==='U'){
          c.splice(3,0,{
            title: '成交金额',
            dataIndex: 'AST_AMT',
            width: '8%',
            scopedSlots: { customRender: 'AST_AMT' }
          });
          c.splice(4,0,{
            title: '成交份额',
            dataIndex: 'UNIT',
            width: '8%',
            scopedSlots: { customRender: 'UNIT' }
          });
        }
        return c;
      },
      handlePriceChange(val,accNo){
        if(this.assetsDataSource[accNo]){
          this.assetsDataSource[accNo].forEach(ad => {
            let total=Number(ad.PROPERTY_TYPE === 'P'?ad.INV_AMT_FC:ad.TRUST_PROPERTY_AMT);
            let unitPrice=Number(val);
            if(isNaN(total)||isNaN(unitPrice)||!unitPrice){
              ad.UNIT = '';
            }else{
              ad.UNIT = (total/unitPrice).toFixed(2);
            }            
          });
        }

        let acc = this.cusAccInfoList.filter(item => accNo === item.accNo);
        if(acc[0].bnfMode === 'U' && this.bnfDataSource[accNo]){
          this.bnfDataSource[accNo].forEach(bd => {
            bd.AST_AMT = (bd.AMT_PERCENT/100*(this.accTotal[accNo]?this.accTotal[accNo]:0)).toFixed(2);
            bd.UNIT = (bd.AST_AMT/val).toFixed(2);
          });
        }
      }
    },
    created(){
      this.initPage();
    }
  }
</script>
<style>

</style>