<template>
  <a-form-model ref="assetForm" :model="form" :rules="rules">
    <a-card class="card" title="基本信息" :bordered="false">
      <a-row>
       <BiCol>
          <BiFormItemSelect :options="pros" label="发行机构" name="issuerCode" v-model="form.issuerCode"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.PRO_CHANNEL" @change="zclyChange" label="资产归属" name="channel" v-model="form.channel"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.PRO_SOURCE"  label="资产来源" name="sourceType" v-model="form.sourceType"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.YN" label="是否跨部门查看" name="allYn" v-model="form.allYn"/>
        </BiCol>
        <BiCol v-if="this.orderNum==='0' || this.orderNum===''">
          <BiFormItemInput label="资产代码"  @blur.native.capture="changeCount"    name="bankProCode" placeholder="请输入资产代码" v-model="form.bankProCode"/>
        </BiCol>
        <BiCol v-if="this.orderNum==='1'">
          <BiFormItemInput label="资产代码"  @blur.native.capture="changeCount"    name="bankProCode" placeholder="请输入资产代码" v-model="form.bankProCode" disabled="disabled"/>
        </BiCol>
        <BiCol>
          <BiFormItemInput label="资产代码（估值系统）" name="proCodeGuzhi" v-model="form.proCodeGuzhi" placeholder="请输入资产代码（估值系统）"/>
        </BiCol>
        <BiCol>
          <BiFormItemInput label="中信登登记编号" name="regCodeZxd" v-model="form.regCodeZxd" placeholder="请输入中信登登记编号"/>
        </BiCol>
        <BiCol>
          <BiFormItemInput label="资产名称" name="proName" v-model="form.proName" placeholder="请输入资产名称"/>
        </BiCol>
        <BiCol>
          <BiFormItemInput label="资产简称" name="proShortname" v-model="form.proShortname" placeholder="资产简称"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.CUR_CODE" label="币种" name="curCode" v-model="form.curCode"/>
        </BiCol>
        <BiCol>
          <BiFormItemDatePicker label="资产开始日" name="proStdDt" v-model="form.proStdDt"/>
        </BiCol>
        <BiCol>
          <!-- invTerm,invTermUnit -->
          <a-form-model-item label="资产期限">
            <BiInputNumUnit  name="productDeadline" :beforeVal="form.productDeadlineType" 
              :afterVal="form.invTermUnit" v-model="form.invTerm"
              :beforeOptions="dicts.PRODUCT_DEADLINE_TYPE" :afterOptions="dicts.TERM_UNIT" 
              @changeBefore='changeBefore' @changeAfter='changeAfter' :disabledAfter='disabledAfter'
              />
          </a-form-model-item>
        </BiCol>


        <BiCol >
          <BiFormItemDatePicker disabled label="资产终止日" name="proEndDt" v-model="form.proEndDt"/>
        </BiCol>
          <BiCol >
            <BiFormItemSelect :options="dicts.INCOME_TYPE" label="收益率类型" name="incomeType" v-model="form.incomeType"/>
          </BiCol>
          <BiCol  v-if="this.form.incomeType==='4'" >
            <BiFormItemSelect label="类型" :options="dicts.INCOME_RATE_TYPE_CUR"  :rules="this.form.incomeType==='4' ?{required:true,message:'请选择类型',trigger:'change'}:{required:false}" name="incomeRateType" v-model="form.incomeRateType"/>
          </BiCol>

          <BiCol  v-if="this.form.incomeType==='0'" >
            <BiFormItemSelect label="类型" :options="dicts.INCOME_RATE_TYPE"  :rules="this.form.incomeType==='0' ?{required:true,message:'请选择类型',trigger:'change'}:{required:false}"  name="incomeRateType" v-model="form.incomeRateType"/>
          </BiCol>

          <BiCol >
            <BiFormItemNumPercent label="预期收益率%" :rules="this.form.incomeType==='0' && this.form.incomeRateType==='1' && this.form.expReturnRate===''?{required:true,message:'请填写预期收益率',trigger:'blur'}:{required:false}" v-model="form.expReturnRate" :min="0" :max="100" :precision="2"/>

          </BiCol>
          <BiCol  >
            <BiFormItemTextarea label="收益率浮动说明" :rules="this.form.incomeType==='0' && this.form.incomeRateType==='2' && this.form.floatRateDesc===''?{required:true,message:'请填写收益率浮动说明',trigger:'blur'}:{required:false}" placeholder="请输入收益率浮动说明" v-model="form.floatRateDesc" rows='1'/>

          </BiCol>
          <BiCol >
            <BiFormItemSelect :options="dicts.PRO_INT_TYPE" label="付息方式" :rules="this.form.incomeType==='0' ?{required:true,message:'请选择付息方式',trigger:'change'}:{required:false}" name="intType" v-model="form.intType"/>

          </BiCol>


        <!--<BiCol>
          <a-form-model-item label="分红规则设定"  :rules="this.form.intType==='P'?{required:true,message:'请设定分红规则',trigger:'change'}:{required:false}">
            <a href="javascript:;" @click="fhChange">分红规则设定</a>
          </a-form-model-item>
        </BiCol>-->
        <BiCol>
          <BiFormItemSelect :options="dicts.REDEMPTIONMODE" @change="shfsChange" label="赎回方式" name="redeemType" v-model="form.redeemType"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.YN" label="是否有开放期" name="rpoOpenYn" v-model="form.rpoOpenYn"/>
        </BiCol>
        <!--<BiCol>
          <a-form-model-item label="维护开放期规则">
            <a href="javascript:;" @click="openRuleModal.visible=true">维护开放期规则</a>
          </a-form-model-item>
        </BiCol>-->
        <div>
          <a-col :span="4" style="margin-left: 45px">
            <span>
            <BiFormItemInput label="投资封闭期/投资期限" name="termOfInvestment" :rules="this.tzfbq==='1' ?{required:true,message:'请输入投资封闭期/投资期限',trigger:'blur'}:{required:false}" placeholder="请输入数字" v-model="form.termOfInvestment"/>
            </span>
          </a-col>
          <a-col :span="2" style="margin-top: 43px">
            <span >
                <a-select :options="dicts.TERM_UNIT" @changeAfter='changeInvestment'   v-model="form.deadlineDateFlag" name="deadlineDateFlag"></a-select>
              </span>
          </a-col>
        </div>
       <!-- <BiCol>
          <a-form-model-item label="投资封闭期/投资期限" prop='termOfInvestment'>
            <BiInputNumUnit  name="termOfInvestment" :afterOptions="dicts.TERM_UNIT" :isBefore="false"
              v-model="form.termOfInvestment" @changeAfter='changeInvestment' :afterVal="form.deadlineDateFlag"
            />
          </a-form-model-item>
        </BiCol>-->
        <BiCol>
          <BiFormItemNumPercent label="资产面值" :rules="this.form.incomeType==='0' &&  this.form.faceValue===''?{required:true,message:'请输入资产面值',trigger:'blur'}:{required:false}" v-model="form.faceValue" :min="0" :precision="4"/>
          
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.ENDDAY_CAL_TYPE" label="头尾处理" name="headAndTailProcessing" v-model="form.headAndTailProcessing"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.PRO_RISK_CODE" label="风险等级" name="riskCode" v-model="form.riskCode"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.FEE_TYPES" label="认/申费扣收方式" name="buyFeeType" v-model="form.buyFeeType"/>
        </BiCol>
        <BiCol>
          <BiFormItemNumPercent label="预警线" v-model="form.alertLine" :min="0" :precision="4"/>
        </BiCol>
        <BiCol>
          <BiFormItemNumPercent label="平仓线" v-model="form.alertStoploss" :min="0" :precision="4"/>
        </BiCol>
      </a-row>
      <BiComments :comments="[ '1、【结构化优先级】为结构化产品的特有字段。','2、【资产面值】：资产收益率类型为非净值型时，必须录入面值。','3、【付息方式】：产品收益率类型为非净值型时，必须选择一种付息方式。','4、【预警线】、【平仓线】：仅作为资产属性展示；家族信托计划投资产品的损益警示线以在损益警示设置功能中的设置为准。']"/>
    </a-card>
    <a-card class="card" title="投资相关信息"  :bordered="false">
      <a-row>
        <BiCol>
          <BiFormItemCascader label="投资区域"  v-model="areas"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.IDS_TYPE" label="资金投向行业" name="proIdsType" v-model="form.proIdsType"/>
        </BiCol>

        <BiCol>
          <BiFormItemSelect :options="dicts.BOND_RANK_L" label="融资主体评级" name="financingRank" v-model="form.financingRank"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.BOND_RANK_S" label="担保人评级" name="guarantorRank" v-model="form.guarantorRank"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="proAssetcats" label="资产类别" name="assetcatCode" v-model="form.assetcatCode"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="proPfcats" label="产品类别" name="pfcatCode" v-model="form.pfcatCode"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="proInvCats" label="产品类别（一级）" name="invcatCode" v-model="form.invcatCode" @change="changeAssetcatCode"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="proInvTypes" label="产品类别（二级）" name="invtypeCode" v-model="form.invtypeCode"  @change="changeInvtypeCode"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.BOND_TERM" label="债项/产品评级" name="bondRank" v-model="form.bondRank"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.YN" label="是否场内" name="exchangeProYn" v-model="form.exchangeProYn"/>
        </BiCol>
        <BiCol>
          <BiFormItemNumPercent label="乐观情景%" v-model="form.estimateOptimism" :min="0" :max="100" :precision="2"/>
        </BiCol>
        <BiCol>
          <BiFormItemNumPercent label="中性情景%" v-model="form.estimateNeutral" :min="0" :max="100" :precision="2"/>
        </BiCol>
        <BiCol>
          <BiFormItemNumPercent label="悲观情景%" v-model="form.estimatePessimism" :min="0" :max="100" :precision="2"/>
        </BiCol>
      </a-row>
      <a-row :gutter="24" style="margin-left: 30px" >
        <a-col :span="7" >
          <BiFormItemInput label="资金投向行业明细" name="detailCode" v-model="form.detailCode" placeholder="请输入代码"/>
        </a-col>
        <div style="margin-top: 45px">
          <span>请参考<a href="http://www.stats.gov.cn/statsinfo/auto2073/201710/P020181204372998240694.pdf" target="_Blank">《GB/T 4754 国民经济行业分类》</a>填入代码</span>
        </div>
      </a-row>
      <BiComments :comments="[ '1、【量化对冲投资策略】、【是否中性】为量化对冲产品特有字段。','2、【融资主体评级】、【担保人评级】为债券及债权融资类产品的特有字段。','3、【债项/产品评级】为债券及债权融资类产品的特有字段。']"/>
    </a-card>
    <a-card class="card" title="资产相关文档及说明" :bordered="false"> 
      <a-row>
        <BiCol>
          <BiFormItemTextarea label="风险安排" v-model="form.riskSettleDesc" placeholder="请输入风险安排"/>
        </BiCol>
        <BiCol>
          <BiFormItemTextarea label="资金运用" v-model="form.capitalUsingDesc" placeholder="请输入资金运用"/>
        </BiCol>
        <BiCol>
          <BiFormItemTextarea label="资产相关产品说明" v-model="form.proMemoDesc" placeholder="资产相关产品说明"/>
        </BiCol>
      </a-row> 
      <a-form-item label="文件上传">
        <!--<BiUpload v-model="fileList"></BiUpload>-->
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item>
              <a-upload :fileList="fileList" :multiple="true" :remove="handleRemove" :beforeUpload="beforeUpload">
                <a-button> <a-icon type="upload"></a-icon>文件上传</a-button>
              </a-upload>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form-item>
      
    </a-card>
    <a-card class="card" title="资金交收账户" :bordered="false">
      <a-row>
        <BiCol>
          <BiFormItemSelect :options="dicts.CAP_SET_MED" label="资金交收方式" @change="zjChange" name="capitalSettlementMethod" v-model="form.capitalSettlementMethod"/>
        </BiCol>
      </a-row>
        <a-table v-if="this.form.capitalSettlementMethod !=='2'"
          :columns="columns"
          :dataSource="proSettleAccounts"
          :pagination="false"
          rowKey="key"
        >
          <template slot="index" slot-scope="text, record, index">{{index+1}}</template>
          <template slot="bankCode" slot-scope="text, record, index">
            <BiFormItemSelect :options="dicts.BANK_CODE"  name="bankCode"  customStyle="width:130px"
                              :value="text" @change="handleChange($event,'bankCode',index)"  showSearch
                              :isForm="false" v-if="record.editable" placeholder="请选择"/>
            <template v-else>{{ getDictNameByCode(dicts.BANK_CODE,text) }}</template>
          </template>
          <template slot="accType" slot-scope="text, record, index">
            <BiFormItemSelect :options="dicts.PRO_ACC_TYPE"  name="accType"  customStyle="width:130px"
          :value="text" @change="handleChange($event,'accType',index)"  showSearch 
          :isForm="false" v-if="record.editable" placeholder="请选择"/>
          <template v-else>{{ getDictNameByCode(dicts.PRO_ACC_TYPE,text) }}</template>
          </template>
          <template v-for="(col, i) in ['accName', 'accNo', 'accOpenBank', 'bigAccNo']" :slot="col" slot-scope="text, record, index">
            <a-input
              :key="col"
              v-if="record.editable"
              style="margin: -5px 0"
              :value="text"
              :placeholder="columns[i+3].title"
              @change="e => handleChange(e.target.value,col,index)"
            />
          <template v-else>{{ text }}</template>
          </template>
          <template slot="operation" slot-scope="text, record, index">
            <template v-if="record.editable">
              <span v-if="record.isNew">
                <a @click="saveRow(index)">添加</a>
                <a-divider type="vertical" />
                <a-popconfirm title="是否要删除此行？" @confirm="remove(index)">
                  <a>删除</a>
                </a-popconfirm>
              </span>
              <span v-else>
                <a @click="saveRow(index)">保存</a>
                <a-divider type="vertical" />
                <a @click="cancel(index)">取消</a>
              </span>
            </template>
            <span v-else>
              <a @click="toggle(index)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm title="是否要删除此行？" @confirm="remove(index)">
                <a>删除</a>
              </a-popconfirm>
            </span>
          </template>
        </a-table>
        <a-button v-if="this.form.capitalSettlementMethod !=='2'" style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus" @click="newMember">新增资金清算账户</a-button>
      
    </a-card>
    <div class="btns">
      <a-button @click="onSubmit" type="primary">保存</a-button>
      <a-button style="margin-left: 8px" @click="saveTem">暂存</a-button>
    </div>
    <!-- <a-form-item
        :wrapperCol="{ span: 24 }"
        style="text-align: center"
      >
        <a-button @click="onSubmit" type="primary">保存</a-button>
        <a-button style="margin-left: 8px" @click="saveTem">暂存</a-button>
    </a-form-item> -->
    <BiModal
      :visible.sync="bonusModal.visible"
      :width="1200"
      :title="bonusModal.title"
      :fullscreen.sync="bonusModal.fullscreen"
      :switchFullscreen="bonusModal.switchFullscreen"
    >
      <BonusRuleSet></BonusRuleSet>
    </BiModal>
    <BiModal
      :visible.sync="openRuleModal.visible"
      :width="1200"
      :title="openRuleModal.title"
      :fullscreen.sync="openRuleModal.fullscreen"
      :switchFullscreen="openRuleModal.switchFullscreen"
    >
      <OpenRuleList></OpenRuleList>
    </BiModal>
  </a-form-model>
  
</template>

<script>
  import { formatDate } from '@/utils/util';
import BonusRuleSet from './BonusRuleSet'
import OpenRuleList from './OpenRuleList'
import { addProduct, editProduct, getProductDetail,getAdmOrgnaiztionInfo,checkBankProCode,getProPfcats,getOrderNum,makeBankProCode} from '@/api/BiApi'
import dictMixin from '@mixins/dictMixin'
import ARow from 'ant-design-vue/es/grid/Row'
import ACol from 'ant-design-vue/es/grid/Col'
import { httpActionWF, postAction,deleteActionByPostMethod } from '@/api/manage'
  import { handleRemove } from '../../utils/fileRemove'

  export default {
    name: 'AssetNew',
    components: {
      ACol,
      ARow,
      BonusRuleSet, OpenRuleList
    },
    mixins:[dictMixin],
    inject:['closeCurrent'],
    data () {
      return {
        tzfbq:'',
        loading: false,
        orderNum:'',
        optType:"",
        fhCount:'',
        fileList: [],
        pros:[],
        removeIds:'',
        checkBankProCode:'',
        areas:[],
        form: {
          // 国家省市
          areas: [],
          issuerCode:'',
          detailCode:'',
          incomeRateType:'',
          channel: '',
          sourceType: '',
          allYn: '',
          bankProCode: '',
          proCodeGuzhi: '',
          regCodeZxd: '',
          proName: '',
          proShortname: '',
          curCode: '',
          proStdDt: undefined,
          productDeadline: '',
          headAndTailProcessing:'',
          capitalSettlementMethod:'',
          productDeadlineType: '0',
          invTerm: '',
          invTermUnit: 'D',//期限单位
          proEndDt: undefined,
          incomeType: '',
          expReturnRate: '',
          floatRateDesc: '',
          intType: '',
          redeemType: '',//赎回方式
          rpoOpenYn: '',
          termOfInvestment: '',
          deadlineDateFlag: 'D',
          faceValue: '',
          riskCode: '',
          buyFeeType: '',
          alertLine: 0,
          alertStoploss: 0,
          areaCityCode: '', //投资区域-市
          areaCode: '',
          areaProvCode: '',
          proIdsType: '',
          financingRank: '',
          guarantorRank: '',
          assetcatCode: '',//大类
          pfcatCode: '',//类别
          invcatCode: '',//一级
          invtypeCode: '',//二级
          bondRank: '',
          exchangeProYn: '',
          estimateOptimism: '',//乐观
          estimateNeutral: '',//中性
          estimatePessimism: '',//悲观
          riskSettleDesc: '',
          capitalUsingDesc: '',
          proMemoDesc: '',
        },
        proSettleAccounts: [
            // {
            //   accType:'类型',
            //   accName: '小明',
            //   accNo: '002',
            //   editable: false,
            //   accOpenBank: '开户行',
            //   bigAccNo:"1234"
            // }, 
            
          ],
        rules: {
             /* areas: [
            { required: true, message: '请选择投资区域', trigger: 'change' },
          ],*/
          exchangeProYn: [
            { required: true, message: '请选择是否场内', trigger: 'change' },
          ],
          proIdsType: [
            { required: true, message: '请选择资金投向行业', trigger: 'change' },
          ],
          pfcatCode: [
            { required: true, message: '请选择产品类别', trigger: 'change' },
          ],
          capitalSettlementMethod: [
            { required: true, message: '请选择资金交收方式', trigger: 'change' },
          ],
          issuerCode: [
            { required: true, message: '请选择发行机构', trigger: 'change' },
          ],
          channel: [
            { required: true, message: '请输入资产归属', trigger: 'blur' },
          ],
          sourceType: [
            { required: true, message: '请选择资产来源', trigger: 'change' },
          ],
          allYn: [
            { required: true, message: '请选择是否跨部门查看', trigger: 'change' },
          ],
          regCodeZxd: [
            {max:100,message:'中信登登记编号不能超过100个字符'}
          ],
          proShortname: [
            {max:200,message:'资产简称不能超过200个字符'}
          ],
          proCodeGuzhi: [
            {max:50,message:'资产代码（估值系统）不能超过50个字符'}
          ],
          bankProCode: [
            { required: true, message: '请输入资产代码', trigger: 'blur' },
            {max:50,message:'资产代码不能超过50个字符'}
          ],
          proName: [
            { required: true, message: '请输入资产名称', trigger: 'blur' },
            {max:200,message:'资产名称不能超过200个字符'}
          ],
          curCode: [
            { required: true, message: '请选择币种', trigger: 'change' },
          ],
          incomeType: [
            { required: true, message: '请选择收益率类型', trigger: 'change' },
          ],
          redeemType: [
            { required: true, message: '请选择赎回方式', trigger: 'change' },
          ],
          /*termOfInvestment: [
            { required: true, message: '请输入投资封闭期/投资期限', trigger: 'blur' },
          ],*/
          assetcatCode: [
            { required: true, message: '请选择资产类别', trigger: 'change' },
          ],
          pfcatCode: [
            { required: true, message: '请选择产品类别', trigger: 'change' },
          ],

        },
        url: {
          upload: "/sys/common/biUpload",
          getFiles: "/sys/common/getFiles",
          deleteFiles:"/sys/common/deleteFiles",
        },
        // table
        columns: [
          {
            title: '序号',
            key: 'index',
            width: '20',
            scopedSlots: { customRender: 'index' }
          },
          {
            title: '银行名称',
            dataIndex: 'bankCode',
            key: 'bankCode',
            width: '30',
            scopedSlots: { customRender: 'bankCode' }
          },
          {
            title: '账户类型',
            dataIndex: 'accType',
            key: 'accType',
            width: '20',
            scopedSlots: { customRender: 'accType' }
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
            title: '开户行网点',
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
          {
            title: '操作',
            key: 'action',
            width: '20',
            scopedSlots: { customRender: 'operation' }
          }
        ],

        bonusModal: {
          title: '分红规则设定',
          visible: false,
          fullscreen: true,
          switchFullscreen: true,
        },
        openRuleModal: {
          title: '维护开放期规则',
          visible: false,
          fullscreen: true,
          switchFullscreen: true,
        },
        disabledAfter: false
      }

    },
    watch:{
      'form.productDeadlineType':function() {
        if (this.form.productDeadlineType=='1'){
          this.form.proEndDt='2199-12-31'
          this.this.form.invTerm='';
        }
      },
      'form.invTermUnit':function(newValue) {
        if(this.form.invTerm && newValue &&this.form.proStdDt ){
          let type='';
          if (newValue=='Y'){
            type='y';
          }
          if (newValue=='M'){
            type='m';
          }
          if (newValue=='W'){
            type='w';
          }
          if (newValue=='D'){
            type='d';
          }
          var d = this.DateAdd(type, parseInt(this.form.invTerm),this.form.proStdDt);
          var year = d.getFullYear();
          var month = d.getMonth() + 1;
          if (month < 10) month = "0" + month;
          var date1 = d.getDate();
          if (date1 < 10) date1 = "0" + date1;
          const newDate =year + "-" + month + "-" + date1
          this.form.proEndDt=newDate;
        }
      },
      'form.proStdDt':function(newValue){
        if(this.form.invTerm&&newValue){
          let type='';
          if (this.form.invTermUnit=='Y'){
            type='y';
          }
          if (this.form.invTermUnit=='M'){
            type='m';
          }
          if (this.form.invTermUnit=='W'){
            type='w';
          }
          if (this.form.invTermUnit=='D'){
            type='d';
          }
          var d = this.DateAdd(type, parseInt(this.form.invTerm),newValue);
          var year = d.getFullYear();
          var month = d.getMonth() + 1;
          if (month < 10) month = "0" + month;
          var date1 = d.getDate();
          if (date1 < 10) date1 = "0" + date1;
          const newDate =year + "-" + month + "-" + date1
          this.form.proEndDt=newDate;
        }
        // this.form.proEndDt=this.getNewDay(newValue,this.form.invTerm)
      },
      'form.invTerm':function(newValue){
        if(this.form.proStdDt&&newValue){
          let type='';
          if (this.form.invTermUnit=='Y'){
            type='y';
          }
          if (this.form.invTermUnit=='M'){
            type='m';
          }
          if (this.form.invTermUnit=='W'){
            type='w';
          }
          if (this.form.invTermUnit=='D'){
            type='d';
          }
          var d = this.DateAdd(type, parseInt(newValue),this.form.proStdDt);
          var year = d.getFullYear();
          var month = d.getMonth() + 1;
          if (month < 10) month = "0" + month;
          var date1 = d.getDate();
          if (date1 < 10) date1 = "0" + date1;
          const newDate =year + "-" + month + "-" + date1
          this.form.proEndDt=newDate;
        }
        // this.form.proEndDt=this.getNewDay(this.form.proStdDt,newValue)
      },
    },
    methods: {
      DateAdd(interval, number, date1) {
        /*
        *   功能:实现JSScript的DateAdd功能.
        *   参数:interval,字符串表达式，表示要添加的时间间隔.
        *   参数:number,数值表达式，表示要添加的时间间隔的个数.
        *   参数:date,时间对象.
        *   返回:新的时间对象.
        *   var   now   =   new   Date();
        *   var   newDate   =   DateAdd( "d ",5,now);
        *---------------   DateAdd(interval,number,date)   -----------------
        */
        var date = new Date(date1);
        switch (interval) {
          case "y":
          {
            date.setFullYear(date.getFullYear() + number);
            return date;
            break;
          }
          case "q":
          {
            date.setMonth(date.getMonth() + number * 3);
            return date;
            break;
          }
          case "m":
          {
            date.setMonth(date.getMonth() + number);
            return date;
            break;
          }
          case "w":
          {
            date.setDate(date.getDate() + number * 7);
            return date;
            break;
          }
          case "d":
          {
            date.setDate(date.getDate() + number);
            return date;
            break;
          }
          case "h":
          {
            date.setHours(date.getHours() + number);
            return date;
            break;
          }
          case "m":
          {
            date.setMinutes(date.getMinutes() + number);
            return date;
            break;
          }
          case "s":
          {
            date.setSeconds(date.getSeconds() + number);
            return date;
            break;
          }
          default:
          {
            date.setDate(date.getDate() + number);
            return date;
            break;
          }
        }
      },



      getNewDay(dateTemp, days) {
          var dateTemp = dateTemp.split("-");
          var nDate = new Date(dateTemp[1] + '-' + dateTemp[2] + '-' + dateTemp[0]);  
          var millSeconds = Math.abs(nDate) + (days * 24 * 60 * 60 * 1000);
          var rDate = new Date(millSeconds);
          var year = rDate.getFullYear();
          var month = rDate.getMonth() + 1;
          if (month < 10) month = "0" + month;
          var date = rDate.getDate();
          if (date < 10) date = "0" + date;
          return (year + "-" + month + "-" + date);
      },
      async submitSave () {
        // 资产开始日结束日判断
        if (this.form.proStdDt && this.form.proEndDt) {
         const time =  new Date(this.form.proEndDt)-new Date(this.form.proStdDt)
         if( time < 0 ){
           this.$message.warning('资产开始日不能大于资产结束日')
           return
         }
        }

        // 国家省市处理
        // if (this.form.areas.length == 1) {
        //   this.form.areaCode = this.form.areas[0]
        // } 
        // if (this.form.areas.length == 3) {
        //   this.form.areaCode = this.form.areas[0]
        //   this.form.areaProvCode = this.form.areas[1]
        //   this.form.areaCityCode = this.form.areas[2]
        // }

        //资金交收方式为“主动打款”时，最少维护一个资金清算账户
        let flag=false
        if (this.form.capitalSettlementMethod=='1'){
          if (this.proSettleAccounts.length<1){
            this.$message.warn("至少添加一个资金清算账户");
            return;
          }else {
            //银行账号去空格
            this.proSettleAccounts.forEach(item =>{
              item.accNo=item.accNo.replace(/\s*/g,'');
            })
          }
          this.proSettleAccounts.forEach(target=>{
            if (target.accType==''){
              this.$message.warn("资金清算账户类型不能为空")
              flag=true
            }
            if (target.accName==''){
              this.$message.warn("资金清算账户户名不能为空")
              flag=true
            }
            if (target.accNo==''){
              this.$message.warn("资金清算账户账号不能为空")
              flag=true
            }
            if (target.accOpenBank==''){
              this.$message.warn("资金清算账户开户行网点不能为空")
              flag=true
            }
            if (target.bigAccNo==''){
              this.$message.warn("资金清算账户大额支付号不能为空")
              flag=true
            }
            if (target.bankCode==''){
              this.$message.warn("资金清算账户银行名称不能为空")
              flag=true
            }

          })
          if (flag){
            return
          }
        }

        if (this.checkBankProCode=='1'){
          this.$message.error("资产代码已存在");
          return;
        }

        //保存上传的文件
        this.loading = true;
        let that = this;
        const formData = new FormData();
        formData.append("module","AssetNew");
        formData.append("dataId", this.form.bankProCode);
        that.fileList.forEach(file => {
          formData.append('files', file);
        });
        httpActionWF(that.url.upload, formData).then((res)=>{
          if(res.success){
          }else{
            that.$message.error(res.message);
            return
          }
        }).catch(function(error){
          that.$message.error('文件上传失败，请稍后重新上传，注意文件大小不可超过10M');
        }).finally(() => {
          that.loading = false;
        });
        let res = ''
        let param = {
          proSettleAccounts: this.proSettleAccounts,
          products: this.form,
          ids:this.removeIds
        }
        // 编辑
        if (this.proCode) {
          param.products.proCode = this.proCode
          res = await editProduct(param)
          if (res.success) {
            this.$message.success('操作成功');
            this.init()
            this.closeCurrent()
            this.$router.replace({ name:'assetList' })
          }
        } else {
          res = await addProduct(param) // 新增
          if (res.success) {
            this.$message.success('操作成功');
            //如果付息方式为固定频率  必须设置分红规则
            if (this.form.intType=='P'){
              this.$message.info("请至分红管理中维护分红规则");
            }

            if (this.form.rpoOpenYn=='1'){
              this.$message.info("请至开放期管理中维护开放期规则");
            }
            this.init()
            this.closeCurrent()
            this.$router.replace({ name:'assetList' })
          }
        }


      },
      onSubmit () {
        if (this.areas.length == 1) {
          this.form.areaCode = this.areas[0]
        }
        if (this.areas.length == 3) {
          this.form.areaCode = this.areas[0]
          this.form.areaProvCode = this.areas[1]
          this.form.areaCityCode = this.areas[2]
        }

        /*if (this.form.areaCode==null || this.form.areaCode=='' ||this.form.areaCode==undefined){
          this.$message.warning('请选择投资区域')
          return
        }*/
        // e.preventDefault()
        this.$refs.assetForm.validate( async(valid) => {
          if (valid) {
            this.submitSave()
          }else{
            this.$message.warn('校验未通过');
          }
        });
      },
      // 暂存
      saveTem () {
        this.form.proStatus = 'T'
        this.submitSave()
      },
     async changeCount(){
        //文本框失去焦点时判断资产代码是否重复
       const res = await checkBankProCode({bankProCode:this.form.bankProCode})
       if( res.success ){
         if (res.result=='1'){
           //资产代码已存在
           this.checkBankProCode='1';
           this.$message.error('资产代码已存在');
           return
         }
         else {
           //res.result=='0'表示资产代码可用
           this.checkBankProCode='0';
         }
       }
      },
      fhChange(){
        this.bonusModal.visible=true
        this.fhCount='1';
      },
      newMember () {
        this.proSettleAccounts.push({
          editable: true,
          isNew: true,
          accType:'',
          accName: '',
          accNo: '',
          accOpenBank: '',
          bigAccNo:'',
          bankCode:'',
          key: this.proSettleAccounts.length
        })
      },
      remove (index) {
        this.proSettleAccounts.splice(index,1)
      },
      saveRow (index) {
        let target = this.proSettleAccounts[index]
        target.editable = false
        target.isNew = false
      },
      toggle (index) {
        let target = this.proSettleAccounts[index]
        target.editable = !target.editable
      },
      getRowByKey (key, newData) {
        const data = this.proSettleAccounts
        return (newData || data).filter(item => item.key === key)[0]
      },
      cancel (index) {
        let target = this.proSettleAccounts[index]
        target.editable = false
      },
      handleChange (value,column,index) {
        const newData = [...this.proSettleAccounts]
        const target = newData[index]
        if (target) {
          target[column] = value
          this.proSettleAccounts = newData
        }
      },
      zclyChange(value){
        if (value=='O'){
          this.form.allYn='0';
        }else {
          this.form.allYn='';
        }
      },
      shfsChange(value){
        if (value=='3' || value=='5'){
          //this.tzfbq='1' 表示投资封闭期必填
          this.tzfbq='1';
        }else {
          this.tzfbq='0';
        }
        if (value=='4' || value=='5'){
          this.form.rpoOpenYn='1';
        }
        if (value=='1' || value=='2' || value=='3') {
          this.form.rpoOpenYn='0';
        }


      },
      zjChange(value){

      },
      async getProductDetail () {
        const res = await getProductDetail({proCode:this.proCode})
        if( res.success ){
          this.form = res.result.products
          if (this.form.expReturnRate==null){
            this.form.expReturnRate='';
          }

          if (this.form.faceValue==null){
            this.form.faceValue='';
          }
          if (this.form.floatRateDesc==null){
            this.form.floatRateDesc='';
          }
          this.proSettleAccounts = res.result.proSettleAccounts.map((item,i)=>{
            return { editable: false,key:i, ...item }
          }) || []

          let { areaCode,areaProvCode,areaCityCode } = res.result.products
          // 处理省市区
          if(areaCode && areaProvCode && areaCityCode){
            if(areaCode=='001'){
              this.form.areas = [areaCode, areaProvCode, areaCityCode]
              this.areas = [areaCode, areaProvCode, areaCityCode]
            } else {
              this.form.areas = [areaCode]
              this.areas = [areaCode]
            }
          }
        }
        this.getUploadFiles()
      },
      changeAssetcatCode () {
        if(this.form.assetcatCode==''){
          this.$message.warn("请选择资产类别")
          this.form.invcatCode='';
          this.form.invtypeCode = ''
          return
        }
        if (this.form.pfcatCode==''){
          this.$message.warn("请选择产品类别")
          this.form.invtypeCode = ''
          this.form.invcatCode='';
          return
        }
        this.getProInvTypes( this.form.assetcatCode,this.form.invcatCode )
      },
      changeInvtypeCode(){
        if(this.form.assetcatCode==''){
          this.$message.warn("请选择资产类别")
          this.form.invtypeCode = ''
          this.form.invcatCode='';
          return
        }
        if (this.form.pfcatCode==''){
          this.$message.warn("请选择产品类别")
          this.form.invtypeCode = ''
          this.form.invcatCode='';
          return
        }

        if (this.form.invcatCode==''){
          this.$message.warn("请选择产品类别（一级）")
          this.form.invtypeCode = ''
          return
        }
      },
      changeBefore (val) {
        if( val == 1 ){
          this.disabledAfter = true
          this.form.invTerm = ''
        } else {
          this.disabledAfter = false
        }
        this.form.productDeadlineType = val
      },
      changeAfter (val) {
        this.form.invTermUnit = val
      },
      changeInvestment (val) {
        this.form.deadlineDateFlag = val
      },


      beforeUpload(file) {
        this.fileList = [...this.fileList, file];
        return false;
      },
      handleRemove(file) {
        if (this.proCode){
          //编辑页面删除现有的上传文件
          this.removeIds +=file.id+',';
        }
        let that = this;
        const index = that.fileList.indexOf(file);
        const newFileList = that.fileList.slice();
        newFileList.splice(index, 1);
        that.fileList = newFileList;
        handleRemove(this, file);
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
      getUploadFiles(){
        let that = this;
        that.loading = true;
        const formData = new FormData();
        formData.append("module","AssetNew");
        formData.append("dataId", this.form.bankProCode);
        postAction(this.url.getFiles, formData).then((res)=>{
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
      // 产品类别
      async getProPfcats1 () {
        const res = await getProPfcats({ pageSize:999,enableYn:'Y'})
        if ( res.success ) {
          this.proPfcats = res.result.records.map(item=>{return {name:item.pfcatName,value:item.pfcatCode}})
        }
        },
      async  makeBankProCode(){
        const res = await makeBankProCode()
        if (res.success){
          this.form.bankProCode=res.message;
        }
      },
      async getOrderNum(){
        const res = await getOrderNum({ proCode:this.proCode})
        if ( res.success ) {
          if (res.result=='1'){
            //有关联订单   资产代码不可以被编辑
            this.orderNum='1';
          }
          else {
            //没有关联订单   资产代码可以被编辑
            this.orderNum='0';
          }
        }
      },
      initDict() {
        this.getProAssetcats()
        // 二级
        this.getProInvTypes()
        this.getProInvCats()
        this.getProPfcats1()
        this.getDict('BANK_CODE,INCOME_RATE_TYPE_CUR,INCOME_RATE_TYPE,ENDDAY_CAL_TYPE,CAP_SET_MED,PRO_CHANNEL,CUR_CODE,PRO_RISK_CODE,PRO_STATUS,PRO_SOURCE,TERM_UNIT,INCOME_TYPE,PRO_INT_TYPE,REDEMPTIONMODE,BOND_RANK_L,BOND_RANK_S,BOND_TERM,YN,IDS_TYPE,FEE_TYPES,PRODUCT_DEADLINE_TYPE,PRO_ACC_TYPE')
      },
      async init(){
        this.form= {
          // 国家省市
          areas: [],
          issuerCode:'',
          detailCode:'',
          incomeRateType:'',
          channel: '',
          sourceType: 'SYS',
          allYn: '',
          bankProCode: '',
          proCodeGuzhi: '',
          regCodeZxd: '',
          proName: '',
          proShortname: '',
          curCode: '156',
          proStdDt: undefined,
          productDeadline: '',
          headAndTailProcessing:'',
          capitalSettlementMethod:'',
          productDeadlineType: '0',
          invTerm: '',
          invTermUnit: 'D',//期限单位
          proEndDt: undefined,
          incomeType: '',
          expReturnRate: '',
          floatRateDesc: '',
          intType: '',
          redeemType: '',//赎回方式
          rpoOpenYn: '',
          termOfInvestment: '',
          deadlineDateFlag: 'D',
          faceValue: '',
          riskCode: '',
          buyFeeType: '',
          alertLine: 0,
          alertStoploss: 0,
          areaCityCode: '', //投资区域-市
          areaCode: '',
          areaProvCode: '',
          proIdsType: '',
          financingRank: '',
          guarantorRank: '',
          assetcatCode: '',//大类
          pfcatCode: '',//类别
          invcatCode: '',//一级
          invtypeCode: '',//二级
          bondRank: '',
          exchangeProYn: '0',
          estimateOptimism: '',//乐观
          estimateNeutral: '',//中性
          estimatePessimism: '',//悲观
          riskSettleDesc: '',
          capitalUsingDesc: '',
          proMemoDesc: '',
        },
          this.proSettleAccounts=[],
          this.tzfbq='',
          this.loading=false,
          this.orderNum='',
          this.optType="",
          this.fhCount='',
          this.fileList= [],
          this.pros=[],
          this.removeIds='',
          this.checkBankProCode='',
          this.areas=[]
        this.makeBankProCode();
      },
    },
    mounted() {
      //获取发行机构
      this.getAdmOrgnaiztionInfo()
    },
    created() {

      // 初始化字典
      this.initDict()
      if (this.$route.query.proCode) {
        this.proCode = this.$route.query.proCode
        this.getProductDetail()
        //判断该资产是否有订单
        this.getOrderNum()
      }else {
        this.form.sourceType='SYS';
        this.form.curCode='156';
        this.form.exchangeProYn='0';

        this.makeBankProCode();
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .card{
    margin-bottom: 12px;
  }
  .desc{
    line-height: 1
  }
  .btns{
    position: fixed;
    bottom: 10px;
    left: 50%;
  }
</style>