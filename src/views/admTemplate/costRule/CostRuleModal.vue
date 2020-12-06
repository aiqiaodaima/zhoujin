<template> 
  <a-form-model ref="form" :model="form" :rules="rules">
    <a-card class="card" title="基本信息" :bordered="false">
      <a-row :gutter="24">
        <a-col :span="24">
          <BiFormItemInput  :disabled="optType == 'view'"    label="模板名称" name="templateName" placeholder="请输入模板名称" v-model="form.templateName"/>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="24">
          <!-- <BiFormItemSelect :disabled="optType == 'view'"    :options="dicts.CONTRACT_SERIE" label="合同系列"  v-model="form.contractSerie" name="contractSerie" /> -->
          <a-form-model-item label="合同系列" prop="contractSerie">
            <j-multi-select-tag :disabled="optType == 'view'" dict-code="CONTRACT_SERIE" v-model="form.contractSerie"></j-multi-select-tag>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="8">
          <BiFormItemSelect v-if="dicts.FEE_NAMES&&dicts.FEE_NAMES.length>0" :options="dicts.FEE_NAMES.slice(0,2)" label="费用性质"  :disabled="optType == 'view'"  v-model="form.feeCatCode" name="feeCatCode" />
          
        </a-col>
        <a-col :span="8">
          <BiFormItemSelect :disabled="optType == 'view'" v-if="typeOrsubTypes&&typeOrsubTypes.length>0"  :options="typeOrsubTypes" label="费用名称"   v-model="form.feeTypeCode" name="feeTypeCode" />
        </a-col>
        <a-col :span="8">
          <BiFormItemSelect :disabled="optType == 'view'"   :options="dicts.FEE_CAL_MODE" label="计费模式"  v-model="form.calMode" name="calMode" />
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="24">
          <BiFormItemSelect :disabled="optType == 'view'"  :options="dicts.FEE_PAY_OBJECT" label="支付对象"  v-model="form.payObject" name="payObject" />
        </a-col>
      </a-row>
      <a-row :gutter="24" v-if="form.calMode=='F'">
        <a-col :span="8">
          <BiFormItemNumPercent :disabled="optType == 'view'" label="费用金额" placeholder="请输入费用金额"  name="fee1" v-model="form.fee1" :min="0"  :precision="2"/>
        </a-col>
      </a-row>
      <a-row style="margin-bottom: 12px;" :gutter="24" v-if="form.calMode=='CI-F'">
        <a-col :span="24">
          <a-form-model-item label="级距费用" class="required">
           <a-button type="primary"  @click="setBillingModel">级距费用设置</a-button>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row style="margin-bottom: 12px;" :gutter="24" v-if="form.calMode=='CI-R'">
        <a-col :span="24">
          <a-form-model-item label="级距费率" class="required">
           <a-button type="primary"  @click="setBillingModel">级距费率设置</a-button>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row style="margin-bottom: 12px;" :gutter="24" v-if="form.calMode=='CI-AR'">
        <a-col :span="24">
          <a-form-model-item label="级距业绩报酬" class="required">
           <a-button  type="primary"  @click="setBillingModel">级距业绩报酬设置</a-button>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24" v-if="form.calMode!=='F'">
        <a-col :span="24">
          <BiFormItemSelect :disabled="optType == 'view'"  :options="dicts.FEE_BASE" label="计提标准"  v-model="form.feeBase" name="feeBase" />
        </a-col>
      </a-row>
      <a-row :gutter="24" v-if="form.calMode=='R'||form.calMode=='AR'">
        <a-col :span="8">
          <BiFormItemNumPercent :disabled="optType == 'view'"  label="适用费率(%)" placeholder="请输入数字"  name="fee" v-model="form.fee" :min="0" :max="100" :precision="2"/>
        </a-col>
        <a-col :span="8">
          <BiFormItemNumPercent :disabled="optType == 'view'" label="最低收费金额" placeholder="请输入金额"  name="minFee" v-model="form.minFee" :min="0"  :precision="2"/>
        </a-col>
      </a-row>
      <a-row :gutter="24" v-if="form.calMode=='AR'">
        <a-col :span="8">
          <BiFormItemSelect :disabled="optType == 'view'"  :options="dicts.ACHIEVEMENT_TYPE" placeholder="请选择"  label="业绩比较基准类型"  v-model="form.achievementType" name="achievementType" />
        </a-col>
        <a-col :span="8">
          <BiFormItemNumPercent :disabled="optType == 'view'"  label="业绩比较基准(%)" placeholder="请输入数字"  name="achievementCompref" v-model="form.achievementCompref" :min="0" :max="100" :precision="2"/>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="8">
          <BiFormItemSelect :disabled="optType == 'view'" :options="dicts.FREQUENCY2" label="核算频率"  v-model="form.calFrequency" name="calFrequency" />
        </a-col>
        <a-col :span="8">
          <BiFormItemSelect :disabled="optType == 'view'" :options="dicts.NATUREDAY_YN" label="核算日历类型"  v-model="form.calNaturedayYn" name="calNaturedayYn" />
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="8">
          <BiFormItemSelect :disabled="optType == 'view'" :options="dicts.TFIX_TYPE" label="核算日类型"  v-model="form.calTfixType" name="calTfixType" />
        </a-col>
        <a-col :span="8" v-if="form.calTfixType=='FDT'">
          <BiFormItemNumPercent :disabled="optType == 'view'" label="核算日-固定日期" placeholder="请输核算日-固定日期"  name="calTfix" v-model="form.calTfix" :min="0"  :precision="0"/>
        </a-col>
         <a-col :span="8">
          <BiFormItemSelect :disabled="optType == 'view'" :options="dicts.INT_DAY_BASE" label="计费基数"  v-model="form.annDays" name="annDays" />
        </a-col>
      </a-row>
      <a-row :gutter="24" v-if="form.calMode !='F'">
        <a-col :span="24">
          <BiFormItemSelect  :disabled="optType == 'view'" :options="dicts.RATE_BASE" label="提取基数"  v-model="form.rateBase" name="rateBase" />
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="8">
          <BiFormItemSelect :disabled="optType == 'view'" :options="dicts.FREQUENCY" label="支付频率"  v-model="form.frequency" name="frequency" />
        </a-col>
        <a-col :span="8">
          <BiFormItemSelect :disabled="optType == 'view'" :options="dicts.NATUREDAY_YN" label="支付日历类型"  v-model="form.naturedayYn" name="naturedayYn" />
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="8">
          <BiFormItemSelect :disabled="optType == 'view'" :options="dicts.TFIX_TYPE" label="支付日类型"  v-model="form.tfixType" name="tfixType" />
        </a-col>
        <a-col :span="8" v-if="form.tfixType=='FDT'">
           <BiFormItemNumPercent :disabled="optType == 'view'" label="支付日-固定日期" placeholder="请输入支付日-固定日期"  name="tfix" v-model="form.tfix" :min="0"  :precision="0"/>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="24">
          <BiFormItemTextarea :readonly="optType == 'view'"  label="备注" v-model="form.remarks" name="remarks" placeholder="备注"/>
        </a-col>
      </a-row>
      
    <BiModal
      :visible.sync="modal.visible"
      :width="800"
      :title="form.calMode=='CI-F'?'级距费用':(form.calMode=='CI-R'?'级距费率':'级距业绩报酬')"
      :fullscreen.sync="modal.fullscreen"
      :switchFullscreen="modal.switchFullscreen"
      @handleOk='handleOk'
      :destroyOnClose='true'>
      <div class="table-operator">
        <a-button type="primary" icon="plus" :disabled="canEdit" @click="addBillingMode" style="float: right;margin-bottom:10px">新增</a-button>
      </div>
      
        <a-row :gutter="24" v-if="form.calMode=='CI-AR'">
            <a-col :span="24">
              <BiFormItemSelect :options="dicts.COM_MODE" label="计算方式"  v-model="comMode" name="comMode" />
            </a-col>
        </a-row>
      <a-table :scroll="{ x: 700}" :columns="form.calMode=='CI-AR'?conColumns2:(form.calMode=='CI-F'?conColumns:conColumns3)" :dataSource="form.billingModes" rowKey="id" row bordered>
        <template  slot="clsMin" slot-scope="text, record">
          <div class="editable-row-operations inputStyle">
            <BiFormItemNumPercent v-if="record.canEdit" :min="0" label='' :precision="2" :value="text" @change="e => clsMinChange(e, record.id,record.clsMax)">
            </BiFormItemNumPercent>
             <template v-else>{{text||0}}</template>
          </div>
        </template>
        <template  slot="includeMinYn" slot-scope="text, record">
          <div class="editable-row-operations inputStyle">
            <a-switch  checkedChildren="含" :disabled="!record.canEdit" unCheckedChildren="不含" :checked="text" :value="text"  @change="e =>onChoseMin(e, record.id)"/>
          </div>
        </template>
        <template  slot="clsMax" slot-scope="text, record">
          <div class="editable-row-operations inputStyle">
            <BiFormItemNumPercent v-if="record.canEdit" :min="0" label='' :precision="2"  :value="text" @change="e => clsMaxChange(e, record.id,record.clsMin)"></BiFormItemNumPercent>
            <template v-else>{{text||0}}</template>
          </div>
        </template>
        <template  slot="includeMaxYn" slot-scope="text, record">
          <div class="editable-row-operations inputStyle">
            <a-switch  checkedChildren="含" :disabled="!record.canEdit" unCheckedChildren="不含" :checked="text" :value="text"  @change="e =>onChoseMax(e, record.id)"/>
          </div>
        </template>
        <template  slot="fee" slot-scope="text, record">
            <div class="editable-row-operations inputStyle">
              <BiFormItemNumPercent v-if="record.canEdit"  :min="0" label='' :precision="2" :max="form.calMode!='CI-F'?100:Number.POSITIVE_INFINITY" :value="text" @change="e => feeChange(e, record.id)"></BiFormItemNumPercent>
              <template v-else>{{text||0}}</template>
            </div>
          </template>
          <template  slot="minBase" slot-scope="text, record">
          <div class="editable-row-operations inputStyle">
            <BiFormItemNumPercent v-if="record.canEdit" :min="0" label='' :precision="2"  :value="text" @change="e => minBaseChange(e, record.id)"></BiFormItemNumPercent>
            <template v-else>{{text||0}}</template>
          </div>
        </template>
        <template  slot="operation" slot-scope="text, record">
          <div class="editable-row-operations inputStyle" v-if="record.canEdit">
              <a  @click="() => guardianEdit(record,'save')">保存 </a>
              <a  @click="() => guardianEdit(record,'cancel')"> 取消</a>
          </div>
          <div class="editable-row-operations inputStyle" v-else>
              <a  @click="() => guardianEdit(record,'edit')">编辑 </a>
              <a-popconfirm title="确定删除吗?" @confirm="() => contactorDel(record.id)">
                <a> 删除</a>
              </a-popconfirm>
          </div>
        </template>
      </a-table>
      <!-- <BillingModel ></BillingModel> -->
    </BiModal>
    </a-card>
  </a-form-model>
</template>

<script>
  import JDSelectTag from '@comp/dict/JDSelectTag'
  import JMultiSelectTag from '@comp/dict/JMultiSelectTag'
  import { filterDictText,initDictOptionsBatch } from '@comp/dict/JDictSelectUtil'
  import { postAction,getAction,putAction } from '@api/manage'
  import dictMixin from '@mixins/dictMixin'
  export default {
    name: 'CostRuleModal',
    components: {
      JMultiSelectTag,
      JDSelectTag
    },
    mixins:[dictMixin],
    props:{
      optType: {
        default: 'add'
      },
      id: {
        default:''
      },
    },
    data() {

      return {
        mode:'',
        typeOrsubTypes: [],
        record:{},
        canEdit:false,
        comMode:'',
        conColumns: [
          {
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',
            width: 65,
            // align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title:'区间开始【计提标准金额】',
            dataIndex: 'clsMin',
            scopedSlots: { customRender: 'clsMin' }
          },
          {
            title:'是否包含区间开始',
            dataIndex: 'includeMinYn',
            scopedSlots: { customRender: 'includeMinYn' }
          },
          {
            title:'区间结束【计提标准金额】',
            dataIndex: 'clsMax',
            scopedSlots: { customRender: 'clsMax' }
          },
          {
            title:'是否包含区间结束',
            dataIndex: 'includeMaxYn',
            scopedSlots: { customRender: 'includeMaxYn' }
          },
          {
            title:'费用金额',
            dataIndex: 'fee',
            scopedSlots: { customRender: 'fee' }
          },
          {
            title: '操作',
            dataIndex: 'operation',
            width: '120px',
            scopedSlots: { customRender: 'operation' },
          }
      ],
      conColumns2: [
          {
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',
            width: 65,
            // align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title:'区间开始【业绩比较基准（%）】',
            dataIndex: 'clsMin',
            scopedSlots: { customRender: 'clsMin' }
          },
          {
            title:'是否包含区间开始',
            dataIndex: 'includeMinYn',
            scopedSlots: { customRender: 'includeMinYn' }
          },
          {
            title:'区间结束【业绩比较基准（%）】',
            dataIndex: 'clsMax',
            scopedSlots: { customRender: 'clsMax' }
          },
          {
            title:'是否包含区间结束',
            dataIndex: 'includeMaxYn',
            scopedSlots: { customRender: 'includeMaxYn' }
          },
          {
            title:'费率（%）',
            dataIndex: 'fee',
            scopedSlots: { customRender: 'fee' }
          },
          {
            title: '操作',
            dataIndex: 'operation',
            width: '120px',
            scopedSlots: { customRender: 'operation' },
          }
      ],
      conColumns3: [
          {
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',
            width: 65,
            // align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title:'区间开始【计提标准金额】',
            dataIndex: 'clsMin',
            scopedSlots: { customRender: 'clsMin' }
          },
          {
            title:'是否包含区间开始',
            dataIndex: 'includeMinYn',
            scopedSlots: { customRender: 'includeMinYn' }
          },
          {
            title:'区间结束【计提标准金额】',
            dataIndex: 'clsMax',
            scopedSlots: { customRender: 'clsMax' }
          },
          {
            title:'是否包含区间结束',
            dataIndex: 'includeMaxYn',
            scopedSlots: { customRender: 'includeMaxYn' }
          },
          {
            title:'费率(%)',
            dataIndex: 'fee',
            scopedSlots: { customRender: 'fee' }
          },
          {
            title:'最低收费金额',
            dataIndex: 'minBase',
            scopedSlots: { customRender: 'minBase' }
          },
          {
            title: '操作',
            dataIndex: 'operation',
            width: '120px',
            scopedSlots: { customRender: 'operation' },
          }
      ],
        modal: {
          title: '级距费用',
          visible: false,
          fullscreen: false,
          switchFullscreen: false,
        },
        loading:false,
        rules:{
          achievementType:[{required: true, message: '请选择业绩比较基准类型', trigger: 'change'}],
          achievementCompref:[{required: true, message: '请输入业绩比较基准', trigger: 'change'}],
          templateName: [
            {required: true, message: '请输入模板名称', trigger: 'change'},
          ],
          contractSerie:[
            {required: true, message: '请选择合同系列', trigger: 'change'},
          ],
          feeCatCode:[
            {required: true, message: '请选择费用性质', trigger: 'change'},
          ],
          feeTypeCode:[
            {required: true, message: '请选择费用名称', trigger: 'change'},
          ],
          calMode:[
            {required: true, message: '请选择计费模式', trigger: 'change'},
          ],
          payObject:[
            {required: true, message: '请选择支付对象', trigger: 'change'},
          ],
          feeBase:[
            {required: true, message: '请选择计提标准', trigger: 'change'},
          ],
          fee:[
            {required: true, message: '请输入适用费率', trigger: 'change'},
          ],
          fee1:[
            {required: true, message: '请输入费用金额', trigger: 'change'},
          ],
          calFrequency:[
            {required: true, message: '请选择核算频率', trigger: 'change'},
          ],
          calNaturedayYn:[
            {required: true, message: '请选择核算日历类型', trigger: 'change'},
          ],
          calTfixType:[
            {required: true, message: '请选择核算日类型', trigger: 'change'},
          ],
          calTfix:[
            {required: true, message: '请选择核算日-固定日期', trigger: 'change'},
          ],
          annDays:[
            {required: true, message: '请选择计费基数', trigger: 'change'},
          ],
          rateBase:[
            {required: true, message: '请选择提取基数', trigger: 'change'},
          ],
          frequency:[
            {required: true, message: '请选择支付频率', trigger: 'change'},
          ],
          naturedayYn:[
            {required: true, message: '请选择支付日历类型', trigger: 'change'},
          ],
          tfixType:[
            {required: true, message: '请选择支付日类型', trigger: 'change'},
          ],
          tfix:[
            {required: true, message: '请选择支付日-固定日期', trigger: 'change'},
          ],
        },
        isFirst: 0,
        form:{
           billingModes:[],
        },
        url:{
          // typeOrsubType:'/sys/dict/typeOrsubType',
          typeOrsubType:'/sys/dict/getSonType',
          find:'/baseline/cusFeeRegulationsTemplate/queryById',
          save:'/baseline/cusFeeRegulationsTemplate/add',
          edite:'/baseline/cusFeeRegulationsTemplate/edit',
          
        },
        dictOptionsData:[],
      }
    },
    watch:{
        'form.feeCatCode': function(newVal, oldVal) {
        this.isFirst++
        let param = {
          dictCode: 'FEE_NAMES',
          parentValue: newVal || '01'
        }
        if (this.isFirst > 1) {
          //this.loading=true;
          getAction(this.url.typeOrsubType, param)
            .then(res => {
              if (res.success) {
                //this.typeOrsubTypes=res.result
                this.typeOrsubTypes = this.returnDict(res.result)
                if (this.typeOrsubTypes.length > 0) {
                  this.form.feeTypeCode = this.typeOrsubTypes[0].value
                } else {
                  this.form.feeTypeCode = ''
                }
              }
            })
            .finally(() => {
              this.loading = false
            })
        }
      },
      'modal.visible'(val){
        if(val==true){
        if(this.form.calMode!=this.mode){
          this.form.billingModes=[]
        }
       this.mode=this.form.calMode
      }
        this.form.billingModes.forEach((item)=>{
          item.canEdit=false
        })
        this.canEdit=false
      },
      id:function(newVal,oldVal){
        this.getInfoDis()
      },
      'form.clidr.disRptType':function(newVal,oldVal){
        this.form.clidrds.forEach((item,index) => {
          if( newVal.indexOf(index+1) == -1){
            this.$set(this.form.clidrds,index,{})
          }
        })
      }
    },
    created() {
      
      if(this.id){
        this.getInfoDis()
      }else{
        this.getDictConfigs()
      }
    },
    mounted() {
      //mounted here
    },
    methods: {
      getDictConfigs() {
        this.loading = true
        let promises = [this.getDict('CONTRACT_SERIE,FEE_NAMES,FEE_NAMES_MSG,FEE_CAL_MODE,COM_MODE,FEE_PAY_OBJECT,FREQUENCY2,NATUREDAY_YN,TFIX_TYPE,INT_DAY_BASE,FREQUENCY,TFIX_TYPE,FEE_BASE,ACHIEVEMENT_TYPE,RATE_BASE')]
        Promise.all(promises)
          .then(res => {
            let param = {
              dictCode: 'FEE_NAMES',
              parentValue: this.form.feeCatCode || '01'
            }
            getAction(this.url.typeOrsubType, param).then(res => {
              if (res.success) {
                this.typeOrsubTypes = this.returnDict(res.result)
              }
            })
          })
          .finally(() => {
            this.loading = false
          })
      },
      returnDict(dict) {
        dict.forEach(item => {
          item.name = item.text
        })
        return dict
      },
      addBillingMode(){
        this.form.billingModes.forEach((item)=>{
          item.canEdit=false
        })
        this.canEdit=true
        if(this.form.billingModes.length>0){
          var BillingModeId=this.form.billingModes[this.form.billingModes.length-1].id+1
          this.form.billingModes.push({
            clsMax:0, clsMin:0,id:BillingModeId,includeMinYn:false,includeMaxYn:false,fee:0,minBase:0,canEdit:true
          })
          this.record={
            clsMax:0, clsMin:0,id:BillingModeId,includeMinYn:false,includeMaxYn:false,fee:0,minBase:0,canEdit:false
          }
        }else{
          this.form.billingModes.push({
             clsMax:0, clsMin:0,id:1,includeMinYn:false,includeMaxYn:false,fee:0,minBase:0,canEdit:true
          })
          this.record={
            clsMax:0, clsMin:0,id:1,includeMinYn:false,includeMaxYn:false,fee:0,minBase:0,canEdit:false
          }
        }

      },
      onChoseMin(value, id){
        const newData = [...this.form.billingModes]; 
        const target = newData.filter(item => id === item.id)[0];
        if (target) {
          target['includeMinYn'] = value;
          this.form.billingModes = newData;
        }
      },
      onChoseMax(value, id){
        const newData = [...this.form.billingModes];
        const target = newData.filter(item => id === item.id)[0];
        if (target) {
          target['includeMaxYn'] = value;
          this.form.billingModes = newData;
        }
      },
      clsMinChange(value, id,clsMax){
        if(value>clsMax){
          this.$message.error(`区间开始不能大于区间结束`);
          return
        }
        const newData = [...this.form.billingModes];
        const target = newData.filter(item => id === item.id)[0];
        if (target) {
          target['clsMin'] = value;
          this.form.billingModes = newData;
        }
      },
      clsMaxChange(value, id,clsMin){
        if(value<clsMin){
          this.$message.error(`区间开始不能大于区间结束`);
          return
        }
        const newData = [...this.form.billingModes];
        const target = newData.filter(item => id === item.id)[0];
        if (target) {
          target['clsMax'] = value;
          this.form.billingModes = newData;
        }
      },
      feeChange(value, id){
        const newData = [...this.form.billingModes];
        const target = newData.filter(item => id === item.id)[0];
        if (target) {
          target['fee'] = value;
          this.form.billingModes = newData;
        }
      },
      minBaseChange(value, id){
        const newData = [...this.form.billingModes];
        const target = newData.filter(item => id === item.id)[0];
        if (target) {
          target['minBase'] = value;
          this.form.billingModes = newData;
        }
      },
      guardianEdit(r,operate) {
        this.canEdit=false
        this.form.billingModes.forEach((item)=>{
          item.canEdit=false
        })
        
        if(operate=='edit'){
           this.record=JSON.parse(JSON.stringify(r))
           r.canEdit=true
           this.canEdit=true
        }else if(operate=='cancel'){
           for(var key in this.record){
             r[key]=this.record[key]
           }
        }
      },
      contactorDel(id){
        this.form.billingModes.forEach((item,idx)=>{
          if(item.id==id){
            this.form.billingModes.splice(idx,1)
          }
        })
      },
      handleOk(){
        if(!this.comMode&&this.form.calMode=='CI-AR'){
          this.$message.error('计算方式不能为空');
          return
        }
        this.modal.visible=false
        return
      },
      setBillingModel(){
        this.modal.visible = true
      },
     
      fdText(o,v){
        return filterDictText(this.dictOptionsData[o],v);
      },
      handleSubmit(){
        this.$refs.form.validate(valid => {
          if (valid) {
            this.loading = true;
            if(this.comMode){
              this.form.comMode=this.comMode
              this.form.billingModes.forEach((item)=>{
                item.comMode=this.comMode
              })
            }
            if(this.form.calMode=='F'){
              this.form.fee=this.form.fee1
            }
            if(this.form.calMode=='CI-F'||this.form.calMode=='CI-R'||this.form.calMode=='CI-AR'){
                this.form.fee=''
            }
            const param = this.form
            if(this.id && this.optType== 'edite'){
              param.id = this.id
              return putAction(this.url.edite, param).then((res)=>{
                if(res.success){
                  this.$emit('update')
                  this.$message.success('保存成功！');
                }else{
                  this.$message.error(res.message);
                }
              }).finally(()=>{
                this.loading = false;
              });
            }else{
              return postAction(this.url.save, param).then((res)=>{
                if(res.success){
                  this.$emit('update')
                  this.$message.success('保存成功！');
                }else{
                  this.$message.error(res.message);
                }
              }).finally(()=>{
                this.loading = false;
              });
            }
          } else {
            this.$message.error('校验未通过');
            return false;
          }
        });
      },
      getInfoDis(){
        this.loading = true;
        getAction(this.url.find,{id:this.id}).then((res)=>{
          if(res.success){
            this.form=res.result
            this.mode=res.result.calMode
            this.comMode=this.form.comMode
            this.getDictConfigs()
            this.$set(this.form,'billingModes',res.result.billingModes)
            if(!this.form.billingModes){
              this.form.billingModes=[]
            }
            this.form.billingModes.forEach((item,idx)=>{
              item.includeMinYn=='true'?item.includeMinYn=true:item.includeMinYn=false
              item.includeMaxYn=='true'?item.includeMaxYn=true:item.includeMaxYn=false
              item.id=idx
              item.canEdit=false
            })
          }else{
            this.$message.error(res.message);
          }
        }).finally(()=>{
          this.loading=false;
        });
      },
      initDictConfig() {
        initDictOptionsBatch("INT_RULE_WEEK_NUM_TYPE,WORK_NATURE_DAY,INT_RULE_WEEK_TYPE,INT_RULE_TERM_UNIT,MONTHS,DIS_RPT_TYPE,CONTRACT_SERIE" ).then(
          (res) => {
          if (res.success) {
            this.dictOptionsData = res.result;
          }
        });
      },
    }
  }
</script>

<style>
  @import '~@assets/less/common.less';
  .ant-select{
    width: 100%
  }
  .table-operator::after{
    display: block;
    content: '';
    clear: both;
  }
  .required .ant-form-item-label::before{
    display: inline-block;
    margin-right: 4px;
    color: #f5222d;
    font-size: 14px;
    font-family: SimSun, sans-serif;
    line-height: 1;
    content: '*';
  }
  .inputStyle .ant-form-item{
    margin-top:12px;
    margin-bottom:12px;
  }
  .ant-table-bordered .ant-table-tbody > tr > td{
    height: 68px !important;
  }
</style>