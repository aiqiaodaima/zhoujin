<template>
  <a-form-model ref="form" :model="form" :rules="rules" v-cloak>
    <a-spin :spinning="loading">
      
      <a-card size="small" title="费用规则">
        <a-row :gutter="24"  class="mbStyle" v-if="feeModalOptions.length>0&&optType !== 'view'">
          <a-col :span="10" class="modalStyle">
            <BiFormItemSelect  :options="feeModalOptions" label="费用模版"  name="feeModal" v-model="feeModal" />
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <BiFormItemSelect :disabled="optType == 'view'"  v-if="dicts.FEE_NAMES&&dicts.FEE_NAMES.length>0" :options="dicts.FEE_NAMES.slice(0,3)" label="费用性质" name="feeCatCode" v-model="form.feeCatCode" />
          </a-col>
         <a-col :span="8">
            <BiFormItemSelect :disabled="optType == 'view'"   v-if="typeOrsubTypes&&typeOrsubTypes.length>0"  :options="typeOrsubTypes" label="费用名称" name="feeTypeCode" v-model="form.feeTypeCode" />
          </a-col>
          <a-col :span="8">
            <BiFormItemSelect :disabled="optType == 'view'"  :options="dicts.FEE_CAL_MODE" label="计费模式" name="calMode" v-model="form.calMode" />
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <BiFormItemSelect :disabled="optType == 'view'"  :options="dicts.FEE_PAY_OBJECT" label="支付对象"  v-model="form.payObject" name="payObject" />
          </a-col>
          <a-col :span="8">
            <BiFormItemDatePicker :disabled="optType == 'view'" label="起始日" name="regulStartDt" v-model="form.regulStartDt"/>
          </a-col>
          <a-col :span="8">
            <BiFormItemDatePicker :disabled="optType == 'view'" label="结束日" name="regulEndDt" v-model="form.regulEndDt"/>
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
        <a-row :gutter="24"  v-if="form.calMode!=='F'">
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
            <BiFormItemSelect :disabled="optType == 'view'" :options="dicts.FREQUENCY2" label="核算频率"  v-model="form.calFrequency" name="calFrequency" @change="onChange" />
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
        </a-row>
        <a-row :gutter="24">
           <a-col :span="8">
            <BiFormItemSelect :disabled="optType == 'view'" :options="dicts.INT_DAY_BASE" label="计费基数"  v-model="form.annDays" name="annDays" />
          </a-col>
        </a-row>
        <a-row :gutter="24" v-if="form.calMode !='F'">
          <a-col :span="24">
            <BiFormItemSelect :disabled="optType == 'view'" :options="dicts.RATE_BASE" label="提取基数"  v-model="form.rateBase" name="rateBase" />
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

        <a-row :gutter="24" v-if="accInfoOptions.length>0">
          <a-col :span="24">
            <a-form-model-item label="适用子账户"  :wrapperCol="{span: 24}" prop="subAccounts">
                <j-multi-select-tag :disabled="optType == 'view'" v-model="form.subAccounts" :options="accInfoOptions"  ></j-multi-select-tag>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
        <a-col :span="24">
          <BiFormItemTextarea :disabled="optType == 'view'" :readonly="optType == 'view'" label="备注" v-model="form.remarks" name="remarks" placeholder="备注"/>
        </a-col>
      </a-row>
      <div style="float: right;margin-bottom: 30px;margin-top: -15px">
        <a-button :disabled="optType == 'view'" @click="generatePlan" type="primary">生成计划</a-button>
      </div>
        <a-row :gutter="24">
          <a-col :span="24">
        <div style="float: right;margin-bottom: 10px;margin-top: -15px;margin-left: 15px">
          <a-button @click="viewAccountPlan" type="primary">查看核算计划</a-button>
        </div>
        <div style="float: right;margin-bottom: 10px;margin-top: -15px">
          <a-button @click="viewPayPlan" type="primary">查看支付计划</a-button>
        </div>
          </a-col>
      </a-row>

      <a-row :gutter="24" v-if="payPlanYn">
        <a-col :span="24">
          <h3>支付计划</h3>
          <a-table
            ref="table"
            size="middle"
            bordered
            :columns="conColumns4"
            :dataSource="dataSource4"
            :pagination='pagination'
            @change='tableChange'
          >
          </a-table>
        </a-col>
      </a-row>

      <a-row :gutter="24" v-if="!payPlanYn">
        <a-col :span="24">
          <h3>核算计划</h3>
          <a-table
            ref="table"
            size="middle"
            bordered
            :columns="conColumns4"
            :dataSource="dataSource5"
            :pagination='pagination'
            @change='tableChange'
          >
          </a-table>
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
        
          <a-row :gutter="24" v-if="form.calMode=='CI-AR'||form.calMode=='CI-R'">
              <a-col :span="24">
                <BiFormItemSelect :options="dicts.COM_MODE" label="计算方式"  v-model="comMode" name="comMode" />
              </a-col>
          </a-row>
          <a-table :scroll="{ x: 700 }" :columns="form.calMode=='CI-AR'?conColumns2:(form.calMode=='CI-F'?conColumns:conColumns3)" :dataSource="form.billingModes" rowKey="id" row bordered>
            <template  slot="clsMin" slot-scope="text, record">
              <div class="editable-row-operations inputStyle">
                <BiFormItemNumPercent  v-if="record.canEdit" :min="0" label='' :precision="2" :value="text" @change="e => clsMinChange(e, record.id,record.clsMax)" >
                </BiFormItemNumPercent>
                <template v-else>{{text||0}}</template>
              </div>
            </template>
            <template  slot="includeMinYn" slot-scope="text, record">
              <div class="editable-row-operations inputStyle">
                <a-switch  checkedChildren="含" :disabled="!record.canEdit" :checked="text"  unCheckedChildren="不含" :value="text"  @change="e =>onChoseMin(e, record.id)"/>
              </div>
            </template>
            <template  slot="clsMax" slot-scope="text, record">
              <div class="editable-row-operations inputStyle">
                <BiFormItemNumPercent   v-if="record.canEdit"    :min="0" label='' :precision="2"  :value="text" @change="e => clsMaxChange(e, record.id,record.clsMin)"></BiFormItemNumPercent>
                <template v-else>{{text||0}}</template>
              </div>
            </template>
            <template  slot="includeMaxYn" slot-scope="text, record">
              <div class="editable-row-operations inputStyle">
                <a-switch  checkedChildren="含"  :disabled="!record.canEdit" unCheckedChildren="不含" :checked="text" :value="text"  @change="e =>onChoseMax(e, record.id)"/>
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
    </a-spin>
  </a-form-model>
</template>

<script>
import { saveAssignee, showAssignee } from '@/api/BiApi'
import JDSelectTag from '@comp/dict/JDSelectTag'
import { postAction, getAction, putAction } from '@api/manage'
import JMultiSelectTag from '../../../components/dict/JMultiSelectTag'
import dictMixin from '@mixins/dictMixin'
import { initDictOptionsBatch } from '../../../components/dict/JDictSelectUtil'
import { filterDictText } from '@/components/dict/JDictSelectUtil'
export default {
  name: 'ProjectPeriodFeeModel',
  components: {
    JDSelectTag,
    JMultiSelectTag
  },
  mixins: [dictMixin],
  props: {
    optType: {
      default: 'add'
    },
    prjCode:{
      default: ''
    },
    id: {
      default: ''
    },
    businessKey:''
  },
  data() {
    let that = this
    return {
      sx:'10000',
      mode:'',
      typeOrsubTypes: [],
      isFirst: 0,
      record:{},
      canEdit:false,
      feeModalOptions:[],
      feeModal:undefined,
      accInfoOptions:[],
      comMode:'',
      payPlanYn: true,
      modal: {
          title: '级距费用',
          visible: false,
          fullscreen: false,
          switchFullscreen: false,
      },
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
      pagination: {
        current: 1,//当前页数 v-model
        defaultCurrent: 1,//默认的当前页数
        defaultPageSize: 10//每页显示几条数据
      },
      dataSource4: [],
      dataSource5: [],
      conColumns4: [
        {
          key: 'qc',
          title: '期次',
          dataIndex: 'qc',
          width: 50,
          customRender: (text, record, index) => `${(this.pagination.current - 1) * this.pagination.defaultPageSize + (index + 1)}`

        },
        {
          key: 'tday',
          title: '支付日',
          dataIndex: 'tday',
          width: 50,
          customRender: function(text, record, index) {
            return text.substring(0, 10)
          }

        },
        {
          key: 'startDt',
          title: '开始日',
          dataIndex: 'startDt',
          width: 50,
          customRender: function(text, record, index) {
            return text.substring(0, 10)
          }

        },
        {
          key: 'endDt',
          title: '结束日',
          dataIndex: 'endDt',
          width: 50,
          customRender: function(text, record, index) {
            return text.substring(0, 10)
          }

        },
        {
          key: 'days',
          title: '区间天数',
          dataIndex: 'days',
          width: 50
        },
        /*{
          key: 'amtRangeType',
          title: '分配财产来源',
          dataIndex: 'amtRangeType',
          width: 50,
          customRender: function(text) {
            return filterDictText(that.dictOptionsData['AMT_TYPE_A_TYPE'], text)
          }
        },
        {
          key: 'amtBase',
          title: '分配基数',
          dataIndex: 'amtBase',
          width: 50,
          customRender: function(text) {
            return filterDictText(that.dictOptionsData['AMT_CALCULATION_BASE'], text)
          }
        },*/
        {
          key: 'dataGenType',
          title: '计划分类',
          dataIndex: 'dataGenType',
          width: 50,
          customRender: function(text) {
            return filterDictText(that.dictOptionsData['DATA_GEN_TYPE'], text)
          }
        }
      ],
      loading: false,
      rules:{
          achievementType:[{required: true, message: '请选择业绩比较基准类型', trigger: 'change'},],
          achievementCompref:[{required: true, message: '请输入业绩比较基准', trigger: 'change'},],
          subAccounts:[{required: true, message: '请输入适用子账户', trigger: 'change'},],
          fee1:[
            {required: true, message: '请输入费用金额', trigger: 'change'},
          ],
          regulStartDt:[
            {required: true, message: '请选择起始日', trigger: 'change'},
          ],
          regulEndDt:[
            {required: true, message: '请选择结束日', trigger: 'change'},
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
      form: {
        billingModes:[],
      },
      url: {
        // typeOrsubType: 'sys/dict/typeOrsubType', 
        typeOrsubType: 'sys/dict/getSonType', 
        find: '/prj/cusFee/regulations/queryById',
        save: '/prj/cusFee/regulations/add',
        edite: '/prj/cusFee/regulations/edit',
        findByPrjCode:'/prj/findByPrjCode',
        getFeeModals:'/baseline/cusFeeRegulationsTemplate/list',
        getInfoById:'/baseline/cusFeeRegulationsTemplate/queryById',
        subAccounts:'subacc/listByPrj?prjCode='+this.$route.query.prjCode,
        generatePlan: '/prj/cusFee/regulations/getDisPlanByRule'
      },
      dictOptionsData: [],
      help: '1',
    }
  },
  watch: {
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
                  this.$set(this.form,'feeTypeCode',this.typeOrsubTypes[0].value)
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
    id: function(newVal, oldVal) {
      this.getInfoDis()
    },
    feeModal:function(newVal, oldVal) {
      if(!newVal)
      return
      getAction(this.url.getInfoById,{id:newVal})
        .then(res => {
          if (res.success) {
          var regulEndDt=this.form.regulEndDt
          var regulStartDt=this.form.regulStartDt
          var subAccounts=this.form.subAccounts
          
          res.result.regulEndDt=regulEndDt
          res.result.regulStartDt=regulStartDt
          res.result.subAccounts=subAccounts
          this.form = res.result
          this.mode = this.form.calMode
          this.form.billingModes.forEach((item,idx)=>{
              item.includeMinYn=='true'?item.includeMinYn=true:item.includeMinYn=false
              item.includeMaxYn=='true'?item.includeMaxYn=true:item.includeMaxYn=false
              item.id=idx
              item.canEdit=false
          })
          } else {
            this.$message.error(res.message)
          }
        }).finally(() => {
      })
    },
    'payPlanYn'(val){
      if(val === false){
        this.conColumns4[1].title = '核算日'
      }else{
        this.conColumns4[1].title = '支付日'
      }
    }
  },
  created() {
    let that = this
    if(this.businessKey){
      this.id=this.businessKey.split(':')[1]
      this.optType='view'
    }
    initDictOptionsBatch('DATA_GEN_TYPE').then((res) => {
      if (res.success) {
        that.dictOptionsData = res.result
      }
      that.confirmLoading = false
    })
    if(this.id){
      this.getInfoDis()
    }else{
      this.getDictConfigs()
    }
    if(this.optType === 'add'){
      this.form.calNaturedayYn = 'Y'
      this.form.naturedayYn = 'Y'
    }
    console.log(this.help)
    if(this.optType === 'edite'){
      this.help = '0'
    }
  },
  mounted() {
    //mounted here
  },
  methods: {
    onChange(val){
      // 按日
      if(val === '5'){
         this.form.rateBase = '4';
      }
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
      generatePlan(){
        this.$refs.form.validate(valid => {
          if (valid) {
            const commonResult = { ...this.form, prjCode: this.prjCode }
            getAction(this.url.generatePlan, commonResult)
              .then(res => {
                if (res.success) {
                  this.dataSource4 = res.result.listFeePaypla
                  this.help = '1'
                } else {
                  this.$message.error(res.message)
                }
              }).finally(() => {
            })
          }
        })
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
        console.log("value",value);
        console.log("clsMax",clsMax);
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
    returnDict(dict) {
      dict.forEach(item => {
        item.name = item.text
      })
      return dict
    },
    getByPrjCode(){
      if(this.optType !== 'add')
      return
      let param = {cli:{prjCode:this.prjCode}};
      postAction(this.url.findByPrjCode,param)
        .then(res => {
          if (res.success) {
            //this.form.regulEndDt=res.result.cli.trustEndDt
            this.$set(this.form,'regulEndDt',res.result.cli.trustEndDt)
            this.$set(this.form,'regulStartDt',res.result.cli.trustStdDt)
          } else {
            this.$message.error(res.message)
          }
        }).finally(() => {
      })
    },
    getFeeModals(){
      getAction(this.url.getFeeModals)
        .then(res => {
          if (res.success) {
            this.feeModalOptions=res.result.records.map((item,idx)=>{
              return {value:item.id+'',name:item.templateName,title:item.templateName,text:item.templateName,active: "1"}
            })
          } else {
            this.$message.error(res.message)
          }
        }).finally(() => {
      })
    },
    getAccInfo(){
      getAction(this.url.subAccounts)
        .then(res => {
          if (res.success) {
            this.accInfoOptions=res.result.map((item,idx)=>{
              return {value:item.accNo,title:item.accName,text:item.accName,active: "1"}
            })
          } else {
            this.$message.error(res.message)
          }
        }).finally(() => {
      })
    },
    getDictConfigs() {
      this.loading = true
      let promises = [
          this.getDict('CONTRACT_SERIE,FEE_NAMES,FEE_NAMES_MSG,FEE_CAL_MODE,COM_MODE,FEE_PAY_OBJECT,FREQUENCY2,NATUREDAY_YN,TFIX_TYPE,INT_DAY_BASE,FREQUENCY,FEE_BASE,ACHIEVEMENT_TYPE,RATE_BASE'),
          this.getAccInfo(),
          this.getByPrjCode(),
          this.getFeeModals()
        ]
        Promise.all(promises).then((res)=>{
          let param = {
              dictCode: 'FEE_NAMES',
              parentValue: this.form.feeCatCode || '01'
            }
            getAction(this.url.typeOrsubType, param).then(res => {
              if (res.success) {
                this.typeOrsubTypes = this.returnDict(res.result)
              }
            })
        }).finally(() => {
          this.loading = false
        })
    },
    getInfoDis() {
      this.loading = true
      getAction(this.url.find, { id: this.id })
        .then(res => {
          if (res.success) {
            this.form = res.result.cusFeeRegulations
            this.mode=res.result.cusFeeRegulations.calMode
            this.comMode=this.form.comMode
            this.getDictConfigs()
            if(this.form.calMode=='F'){
              this.form.fee1=this.form.fee
            }
            this.$set(this.form,'billingModes',res.result.billingModes)
            // if(this.form.billingModes&&this.form.billingModes.length>0&&this.form.billingModes[0].comMode)
            // this.comMode=this.form.billingModes[0].comMode
            if(!this.form.billingModes){
              this.form.billingModes=[]
            } 
            this.form.billingModes.forEach((item,idx)=>{
              item.includeMinYn=='true'?item.includeMinYn=true:item.includeMinYn=false
              item.includeMaxYn=='true'?item.includeMaxYn=true:item.includeMaxYn=false
              item.id=idx
              item.canEdit=false
            })
            this.form.regulEndDt=this.form.regulEndDt.slice(0,10)
            this.form.regulStartDt=this.form.regulStartDt.slice(0,10)
            this.dataSource4 = res.result.cusFeePayplanLogs
          } else {
            this.$message.error(res.message)
          }
        }).finally(() => {
          this.loading=false;
        })
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if(this.help === '0'){
            if(this.dataSource4){
              this.$message.warning('请生成计划后提交');
              return;
            }
          }
          this.loading = true
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
          //const param = this.form
          let param = {
            cusFeeRegulations:  {...this.form,id: this.id,prjCode: this.prjCode},
            listFeePaypla: this.dataSource4
          }
          this.form.regulStartDt+=' 00:00:00'
          this.form.regulEndDt+=' 00:00:00'
          //param.prjCode=this.prjCode
          if (this.id && this.optType == 'edite') {
            //param.id = this.id
            return putAction(this.url.edite, param)
              .then(res => {
                if (res.success) {
                  var processId=''
                  if(res.result){
                    processId=res.result.processId||''
                  }
                  this.$emit('update',processId)
                  this.$message.success('保存成功！')
                } else {
                  this.$message.error(res.message)
                }
              })
              .finally(() => {
                this.loading = false
              })
          } else {
            return postAction(this.url.save, param)
              .then(res => {
                if (res.success) {
                  var processId=''
                  if(res.result){
                    processId=res.result.processId||''
                  }
                  this.$emit('update',processId)
                  this.$message.success('保存成功！')
                } else {
                  this.$message.error(res.message)
                }
              })
              .finally(() => {
                this.loading = false
              })
          }
        } else {
          this.$message.error('校验未通过')
          return false
        }
      })
    },
    tableChange(pagination, filters, sorter) {
      this.pagination = pagination
    },
    viewPayPlan(){
        this.payPlanYn = true
    },
    viewAccountPlan(){
      this.payPlanYn = false
    }
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
  .modalStyle .ant-row.ant-form-item{
    display:flex
  }
  .modalStyle .ant-row.ant-form-item .ant-col.ant-form-item-control-wrapper{
    flex: 1 1;
  }
  .modalStyle {
    position:absolute;
    right:0;
    top:-62px;
    z-index:1;
  }
  .modalStyle .ant-row.ant-form-item .ant-select-selection{
    max-width:209px
  }
  .inputStyle .ant-form-item{
    margin-top:12px;
    margin-bottom:12px;
  }
  .ant-table-bordered .ant-table-tbody > tr > td{
    height: 68px !important;
  }
</style>