/*
  委托资产交付
 */
<template>
  <div style="background-color: #ffffff!important;">
    <component :is="comp" ref="assetModal"></component>
    <a-table :loading="loading" :columns="assetTransferColumns" :dataSource="datasource" :scroll="{ x: 1250 }" row :pagination='false'>
      <template slot="contractNo" slot-scope="text, record, index">
        <a-input
          v-if='record.PROPERTY_TYPE === "P" && record.TRX_STATUS==="75"'
          :disabled="disabled"
          style="margin: -5px 0;width: 100%"
          placeholder="请输入"
          :value="text"
          @change="e => handleChange(e.target.value,'REF_CONTRACT_NO',index)"
        />
        <span v-else-if='record.PROPERTY_TYPE === "P"'>{{ text }}</span>
        <span v-else>--</span>
      </template>
      <template  slot="payDt"  slot-scope="text, record, index">
        <a-date-picker
          :disabled="disabled"
          style="margin: -5px 0;width:100%"
          placeholder="请选择交付日期"
          v-if='record.TRX_STATUS==="75"'
          :value="text ? moment(text) : null"
          @change="e => handleChange(e,'PAY_DT',index)"
        />
        <span v-else>
          {{ text?moment(text).format("YYYY-MM-DD"):'' }}
        </span>
      </template>
      <template slot="assetTransferOpt" slot-scope="text, record, index">
        <div class="editable-row-operations">
          <a @click="handleView(record)">查看</a>
          <template v-if='!disabled&&record.TRX_STATUS==="75"'>
            <a-divider type="vertical"/>
            <span v-if="Number(record.MAP_AMT||0)<Number(record.TRUST_PROPERTY_AMT) && record.PROPERTY_TYPE === 'S' && record.mapCapitalYN === 'Y'">
              <a @click="match(record)" >勾稽</a>
              <a-divider type="vertical"/>
            </span>
            <a @click="confirmOdr(record)">确认交付</a>
            <a-divider type="vertical"/>
            <a-popconfirm title="确定取消吗?" @confirm="del(record, index)">
              <a>取消</a>
            </a-popconfirm>
          </template>
        </div>
      </template>
    </a-table>
    <BiModal
      :visible.sync="modal.visible"
      width="90%"
      :title="modal.title"
      :fullscreen.sync="modal.fullscreen"
      :switchFullscreen="modal.switchFullscreen"
      @handleOk='handleOk'
      @handleCancel='handleOk'
      :confirmLoading='modal.confirmLoading'
    >
      <MatchFlow v-if="modal.visible" :odrCode="odrCode"  ref="matchFlow"/>
    </BiModal>
  </div>
</template>
<script>
  import { mapState, mapActions, mapMutations } from "vuex";
  import dictMixin from '@mixins/dictMixin'
  import moment from 'moment'
  import MatchFlow from '@views/fundFlow/MatchFlow'
  import { getPrjAssets } from '@/api/BiApi'
  import { postAction } from '../../../api/manage'

  export default {
    name: "PrjAssetTransfer",
    mixins:[dictMixin],
    data() {
      return {
        comp:'',
        comps:[],
        assetTransferColumns: [
          {
            title: '序号',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title:'资产名称',
            width:120,
            dataIndex: 'A',
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
          },
          {
            title:'交易金额',
            width:90,
            dataIndex: 'TRUST_PROPERTY_AMT',
            customRender: (text, record) => {
              if(record.PROPERTY_TYPE === 'P'){
                return record.INV_AMT_FC;
              }else{
                return record.TRUST_PROPERTY_AMT;
              }
            }
          },
          {
            title:'子账户名称',
            width:120,
            dataIndex: 'ACC_NAME'
          },
          {
            title:'委托人',
            width:100,
            dataIndex: 'PARTY_NAME'
          },
          {
            title:'资产类型',
            width:120,
            dataIndex: 'PROPERTY_TYPE',
            customRender: (text) => {
              return this.getDictNameByCode(this.dicts.PROPERTY_TYPE,text);
            }
          },
          {
            title:'委托状态',
            width:110,
            dataIndex: 'STATUS_NAME',
            fixed: 'right',
            customRender: (text) => {
              return text?text:'未提交';
            }
          },
          {
            title:'转让协议编号',
            dataIndex: 'REF_CONTRACT_NO',
            fixed: 'right',
            width:'150px',
            scopedSlots: { customRender: 'contractNo' }
          },
          {
            title:'交付日期',
            dataIndex: 'PAY_DT',
            fixed: 'right',
            width:'150px',
            scopedSlots: { customRender: 'payDt' }
          },
          {
            title: '操作',
            fixed: 'right',
            dataIndex: 'assetTransferOpt',
            scopedSlots: { customRender: 'assetTransferOpt' },
          }
        ],
        modal: {
          visible: false,
          title: '流水钩稽',
          fullscreen: false,
          switchFullscreen: false,
          confirmLoading: false,
        },
        odrCode: '',
        datasource:[],
        url:{
          confirmAccount:'/prj/asset/confirmAccount',
          cancelOrder:'/prj/asset/cancel'
        },
        loading:false
      }
    },
    components: {
      MatchFlow
    },
    computed: {
      ...mapState("project", [
        "status","batchId","prjCode","prjAssets","periodNo"
      ])
    },
    props: {
      disabled: {
        default: false
      }
    },
    watch:{
      prjCode(){
        console.log('patPrjCode=', this.prjCode);
      }
    },
    methods: {
      ...mapActions("project",["addOrdersOptLogs"]),
      ...mapMutations("project",["SET_prjAssets"]),
      moment,
      match(record) {
        this.modal.visible = true
        this.odrCode = record.ORDER_CODE
      },
      del(record, index){
        let that = this;
        that.loading = true;
        let param = {
          odrCode: record.ORDER_CODE
        }
        postAction(this.url.cancelOrder, param).then(res=>{
          if(res.success){
            this.$notification[ 'success' ]({
              message: "取消成功",
              description:"",
              duration: 4
            });
            //添加操作日志
            this.addOrdersOptLogs({
              batchId: this.batchId,
              optType:'委托资产确认交付',
              oprations: '交易取消',
              status:'已取消',
              memo: record.astName
            });
            that.$emit('handleUpdate');
          }else{
            this.$notification[ 'error' ]({
              message: "取消失败",
              description:res.message,
              duration: 4
            });
          }
        }).finally(()=>{
          that.loading = false;
        });
      },
      handleChange(val,col,index,isAppend){

        const newData = [...this.datasource];
        const target = newData.filter(item => index === item.key)[0];
        if (target) {
          if(isAppend){
            if(val){
              target[col] = (target[col]?target[col]:'')+val+'';
            }else{
              target[col] = val
            }
          }else{
            target[col] = val
          }
          this.datasource = newData;
        }
        this.SET_prjAssets(this.datasource);
      },
      async handleOk(){
        this.modal.visible = false
        this.$emit('handleUpdate');
      },
      async initPage(){
        this.loading = true;
        await this.getDict('PROPERTY_TYPE,TRUST_ASSET_TYPE,BNF_MODE');
        if(this.prjCode){
          const { result } = await getPrjAssets({prjCode:this.prjCode,periodNo:this.periodNo,pageSize:99999,batchId:this.batchId});
          console.log('getPrjAssets=====>',result.records);
          this.datasource = result.records;
          if(this.datasource && this.datasource.length>0){
            this.datasource.forEach((data,index)=>{
              if(!data.key){
                data.key = index;
              }
            });
          }
          console.log(this.datasource);
          this.SET_prjAssets(this.datasource);
        }
        this.loading = false;
      },
      confirmOdr(record){
        //资金，判定是否勾稽
        if(Number(record.MAP_AMT||0)<Number(record.TRUST_PROPERTY_AMT) && record.PROPERTY_TYPE === 'S' && record.mapCapitalYN === 'Y'){
          this.$notification[ 'error' ]({
            message: "流水未勾稽！",
            description:"",
            duration: 4
          });
          return
        }

        //投资类资产，转让协议编号必填
        if(record.PROPERTY_TYPE=='P'&&!record.REF_CONTRACT_NO){
          this.$notification[ 'error' ]({
            message: "请填写转让协议编号",
            description:"",
            duration: 4
          })
          return
        }

        //交付日期
        if(!record.PAY_DT){
          this.$notification[ 'error' ]({
            message: "请选择交付日期",
            description:"",
            duration: 4
          });
          return
        }

        let that = this;
        that.loading = true;
        let param = {
          orderCode: record.ORDER_CODE,
          payDt:record.PAY_DT,
          contractNo:record.REF_CONTRACT_NO
        };
        postAction(this.url.confirmAccount, param).then(res=>{
          if(res.success){
            this.$notification[ 'success' ]({
              message: "确认到账成功",
              description:"",
              duration: 4
            });
            this.addOrdersOptLogs({
              batchId: this.batchId,
              optType: '委托资产确认交付',
              oprations:  '提交',
              status:'未确认份额',
              memo:record.astName//资产类型
            });
            that.$emit('handleUpdate');
          }else{
            this.$notification[ 'error' ]({
              message: "确认到账失败",
              description:res.message,
              duration: 4
            });
          }
        }).finally(()=>{
          that.loading = false;
        });
      },
      loadComp(c){
        let v = c;
        if(v){
          let that = this;
          if(!that.comps[v]){
            that.comps[v] = ()=>import('@/views/prj/modules/Asset' + v + 'Modal.vue');
          }
          that.comp = that.comps[v];
        }
      },
      handleView (record){
        let that = this;
        this.loadComp(record.PROPERTY_TYPE+record.ASSET_TYPE);
        let i = setInterval(()=>{
          if(that.$refs.assetModal){
            that.$refs.assetModal.view(record);
            clearInterval(i);
          }
        }, 200);
      }
    },
    created(){
      this.initPage();
    }
  }
</script>
<style>

</style>