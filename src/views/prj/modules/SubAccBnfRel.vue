<template>
  <div style="padding-top: 15px;background-color: #FFFFFF">
    <a-spin :spinning="loading">
      <a-row :gutter="24">
        <a-col :span="18">
          <a-form-model-item label="受益人" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
            <a-select   v-if="optType !== 'VIEW'" mode="multiple" option-label-prop="label" style="width: 100%" v-model="newSection">
              <a-select-option v-for="bnf in bnfs" :key="bnf.PARTY_CODE" :value="bnf.PARTY_CODE" :label="bnf.PARTY_NAME">{{ bnf.PARTY_NAME }}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="6" style="text-align: center;">
          <a-button  v-if="optType !== 'VIEW'" @click="handleAdd" type="primary" icon="arrow-down">加入</a-button>
        </a-col>
      </a-row>
      <a-card size="small" title="已关联受益人" style="margin: 10px;">
        <a-table
          ref="table"
          bordered
          :scroll="{ x: 1500,y: 400 }"
          size="small"
          rowKey="PARTY_CODE"
          :columns="columns"
          :dataSource="selectedBnfs"
          :pagination="false">

            <template slot="amtPercentSlot" slot-scope="text, record, index">
              <a-input-number :min="0" :max="100" :step="0.1"
                v-if="optType !== 'VIEW'"
                placeholder="请输入比例"
                :defaultValue="text"
                @change="val => percentChange(val,index)"
              />
              <span v-else>{{ text }}</span>
            </template>

            <span slot="action" slot-scope="text, record"  v-if="optType !== 'VIEW'">
              <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record)">
                <a>移除</a>
              </a-popconfirm>
            </span>
        </a-table>
      </a-card>
      <WkfNextUserModal ref="wkfUserForm" @complete="wkfUserComplete" />
      <!--:va="va" va='1'表示隐藏掉子组件中的返回按钮   项目视图中查看子账户信息专用-->
      <a-row :gutter="24" style="text-align: center; padding: 15px;"  >
        <a-col>
          <!--<a-button  @click="handleSave" type="primary">保存</a-button>-->
          <a-button type="primary" :disabled="status==='ADTING'" @click="handleSave" v-if="optType !== 'VIEW' &&status!=='ADTING'">提交<span v-if="prjStatus==='R'">审核</span></a-button>
          <a-button v-if=" va !== '1'" @click="handleBack" style="margin-left: 15px;">返回</a-button>
        </a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<script>
  import { postAction } from '../../../api/manage'
  import dictMixin from '../../../mixins/dictMixin'
  import { contains } from '../../../utils/util'
  import WkfNextUserModal from '../../activiti/modules/WkfNextUserModal'

  export default {
    name: 'SubAccBnfRel',
    mixins:[dictMixin],
    components: {
      WkfNextUserModal
    },
    inject:['psToPage'],
    props:{
      optType:'',
      prjCode:'',
      accNo:'',
      va:'',
      status:'',
      prjStatus:'',
    },
    watch:{
      bnfMode(val){
        if(val=='U'){
          this.columns[4].title='受益比例（%）'
        }else{
          this.columns[4].title='可分配信托份额比例上限（%）'
        }
      },
      accNo(val){
        if (val!=''){
          this.init()
          // this.finPrj()
        }
      }
    },
    data() {
      let that = this;
      return {
        loading:false,
        bnfMode:'',
        selectedBnfs:[],
        newSection:[],
        bnfs:[],
        columns:[
          {
            title: '受益顺位',
            align: "center",
            fixed: 'left',
            width: 90,
            dataIndex: 'BNF_RANK',
            customRender: function (text) {
              return that.getDictNameByCode(that.dicts.BNF_RANK,text);
            }
          },
          {
            title: '姓名/名称',
            align: "center",
            dataIndex: 'PARTY_NAME'
          },
          {
            title: '受益人状态',
            align: "center",
            dataIndex: 'BNF_STATUS',
            customRender: function (text) {
              return that.getDictNameByCode(that.dicts.BNF_STATUS,text);
            }
          },          
          {
            title: '与委托人关系',
            align: "center",
            dataIndex: 'REL_TYPE_CODE',
            customRender: function (text) {
              return that.getDictNameByCode(that.dicts.REL_TYPE,text);
            }
          },
          {
            title: '可分配信托份额比例上限（%）',
            align: "center",
            dataIndex: 'amtPercent',
            scopedSlots: { customRender: 'amtPercentSlot' }
          },
          {
            title: '证件类型',
            align: "center",
            width: '180px',
            dataIndex: 'IDN_TYPE',
            // customRender: (text,record) => {
            //   let rtnStr = that.getDictNameByCode(that.dicts[record.NATURAL_YN === 'Y'?"IDNTYPES":"ORGIDNTYPES"],text);
            //   if(text === "OTH"){
            //     rtnStr += "："+record.IDN_TYPE_OTH;
            //   }
            //   return rtnStr;
            // }
            customRender: function (text) {
              return that.getDictNameByCode(that.dicts.IDNTYPES,text);
            }
          },
          {
            title: '证件号码',
            align: "center",
            dataIndex: 'IDN'
          },
          {
            title: '婚姻状况',
            align: "center",
            relTypes:["BENEFICIARY","SUPERVISER"],
            dataIndex: 'MARITAL_CODE',
            customRender: function (text) {
              return that.getDictNameByCode(that.dicts.MARITAL_CODE,text);
            }
          },
          {
            title: '手机号码',
            align: "center",
            relTypes:["!TRUSTEE"],
            dataIndex: 'CPHONE'
          },
          {
            title: '固定电话',
            align: "center",
            relTypes:["!TRUSTEE"],
            dataIndex: 'FPHONE'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            width: 140,
            fixed: 'right',
            scopedSlots: {
              customRender: 'action'
            }
          }
        ],
        rels:[],
        allBnfs:[],
        url:{
          bnfs:'/subacc/getAccBnfs',
          save:'/subacc/bnfrel/save'
        }
      }
    },
    created() {
      console.log('SubAccBnfRel----->'+this.prjStatus)
      this.getDict('BNF_RANK,REL_TYPE,IDNTYPES,MARITAL_CODE,BNF_STATUS');
      this.$bus.$on('bnfMode',(bnfMode)=>{
        this.bnfMode = bnfMode
      })
      if (this.accNo!=''){
        this.init();
      }
    },
    mounted() {

    },
    methods: {
      wkfUserComplete(){
        this.psToPage('prj/SubAccount', {optType: 'VIEW', prjCode: this.prjCode, accNo: this.accNo});
      },
      async init(){
        postAction(this.url.bnfs,{prjCode:this.prjCode,accNoFlag:'BENEFICIARY',relType:'BENEFICIARY',periodNo: 0,accNo:this.accNo}).then((res)=>{
          if(res.success){
            this.allBnfs = res.result.allBnfs.records;
            if (res.result.cai!=null) {
              this.bnfMode=res.result.cai.bnfMode;
            }

            if(res.result.rels){
              this.rels = [];
              for(let i=0;i<res.result.rels.length;i++){
                let rel=res.result.rels[i];
                this.rels.push(rel.partyCode);
                //判断是否带入比例
                for(let j=0;j<this.allBnfs.length;j++){
                  let bnf=this.allBnfs[j];
                  if(rel.partyCode==bnf.PARTY_CODE){
                    if(!bnf.amtPercent){
                      bnf.amtPercent=rel.amtPercent;
                    }
                  }
                }
              }
              this.initPage();
            }else{
              this.bnfs = res.result.allBnfs.records;
            }
          }else{
            this.$message.error(res.message);
          }
        });
      },
  /*    async finPrj(){
        postAction('/subacc/find', { accNo: this.accNo, id:''}).then((res)=>{
          if(res.success){
            this.status = res.result.status;
          }else{
            this.$message.error(res.message);
          }
        }).catch(function(error){
          this.$message.error('数据加载失败！');
        }).finally(() => {
          this.loading = false;
        });

        postAction('/prj/findByPrjCode', { cli:{prjCode: this.prjCode}}).then((res)=>{
          if(res.success){
            console.log('cli===',res);
            this.prjStatus = res.result.cli.prjStatus;
          }else{
            this.$message.error(res.message);
          }
        }).catch(function(error){
          this.$message.error('数据加载失败！');
        }).finally(() => {
          this.loading = false;
        });
      },*/
      handleBack(){
        this.psToPage('prj/SubAccountList', {});
      },
      handleAdd(){
        if(this.newSection.length>0){
          this.rels = this.rels.concat(this.newSection);
          this.initPage();
          this.newSection=[];
        }
      },
      handleDelete(rec){
        this.rels.splice(this.rels.indexOf(rec),1);
        this.initPage();
        this.newSection=[];
      },
      initPage(){
        let that = this;
        this.bnfs=[];
        this.selectedBnfs=[];
        this.allBnfs.forEach(bnf=>{
          if(contains(that.rels, bnf.PARTY_CODE)){
            that.selectedBnfs.push(bnf);
          }else{
            bnf.amtPercent=0;
            that.bnfs.push(bnf);
          }
        });
      },
      handleSave(){
        let that = this;
        //份额制，判断比例之和是否为100
        if(that.bnfMode=='U'){
          if(that.selectedBnfs.length!=0){
          let allPercent=0;
          for(let i=0;i<that.selectedBnfs.length;i++){
            let amt=that.selectedBnfs[i].amtPercent;
          　allPercent+=amt;
          }
          if(allPercent!=100){
            that.$message.warning('份额制子账受益比例之和必须为100%')
            return
          }
        }
        }
        that.loading = true;
        let param = {prjCode: that.prjCode, accNo:that.accNo, periodNo: 0, cbtList:that.selectedBnfs};
        console.log('param',param);
        postAction(this.url.save,param).then(res=>{
          if(res.success){
            //项目已成立，走审核
            if(that.prjStatus==='R'){
              //发起审核 审核单选择审核人
              if (res.result.processId) {
                this.$refs.wkfUserForm.edit(res.result.processId);
                this.$refs.wkfUserForm.disableSubmit = false;
              }
            }else{
              that.$message.success('保存成功！');
            }
          }else{
            that.$message.error(res.message);
          }
        }).finally(()=>{
          that.loading = false;
        });
      },
      percentChange(val,index){
        this.selectedBnfs[index].amtPercent=val
      }
    }
  }
</script>

<style scoped>
  @import '~@assets/less/common.less'
</style>