<template>
  <a-form-model ref="bonusRuleForm" :model="form" :rules="rules">
    <a-card class="card" title="基本信息" :bordered="false">
      <a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <BiFormItemSelect :options="pros" label="资产名称" name="proCode" @change="productChange" v-model="form.proCode" :showSearch='true' disabled="disabled"/>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <BiFormItemSelect :options="dicts.PRO_INT_FREQUENCY" label="付息频率" name="frequency" v-model="form.frequency" disabled="disabled"/>
          </a-col>
          <!--头尾处理 由产品信息带过来   不可编辑-->
         <!-- <a-col :span="12">
            <BiFormItemSelect :options="dicts.ENDDAY_CAL_TYPE" label="头尾处理" name="enddayCalType" v-model="form.enddayCalType" disabled="disabled"/>
          </a-col>-->
          <a-col :span="12">
            <BiFormItemSelect :options="dicts.DIVIDEND_TYPE" label="分红方式" name="dividendType"
                              v-model="form.dividendType" disabled="disabled"/>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <BiFormItemSelect :options="dicts.ANN_DAYS" label="计息基数" name="annDays" v-model="form.annDays" disabled="disabled"/>
          </a-col>
        </a-row>
        <!--<div v-if="this.form.frequency==='1'" style="float: right;margin-bottom: 10px;margin-top: -15px">
          <a-button @click="onSubmit" type="primary">保存规则</a-button>
        </div>-->
      </a-row>
    </a-card>
    <div v-if="this.form.frequency==='2'">
    <a-card  class="card" title="固定分红规则" :bordered="false">
      <a-row >

        <a-row :gutter="24">
          <a-col :span="12">
            <BiFormItemSelect :options="dicts.INT_START_RULE" label="开始日" name="intStartRule"
                              v-model="form.intStartRule" disabled="disabled"/>
          </a-col>
          <a-col :span="12" v-if="this.form.intStartRule==='1'">
            <BiFormItemDatePicker label="日期" name="startDt" v-model="form.startDt" disabled="disabled"/>
          </a-col>

        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <BiFormItemSelect :options="dicts.INT_END_RULE" label="结束日" name="intEndRule" v-model="form.intEndRule" disabled="disabled"/>
          </a-col>

          <a-col :span="12" v-if="this.form.intEndRule==='1'">
            <BiFormItemDatePicker label="日期" name="endDt" v-model="form.endDt" disabled="disabled"/>
          </a-col>
        </a-row>


        <a-row :gutter="24">
          <a-col :span="8">
            <BiFormItemSelect :options="dicts.CALENDAR_TYPE" label="参考日历" name="calendarType"
                              v-model="form.calendarType" disabled="disabled"/>
          </a-col>
          <a-col :span="8">
            <BiFormItemSelect :options="dicts.HOLIDAY_ADJUST_TYPE" label="遇节假日调整方式" name="holidayAdjustType"
                              v-model="form.holidayAdjustType" disabled="disabled"/>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="4">
            <BiFormItemSelect :options="dicts.NATUREDAY_YN"  @change="handleChange"   label="分红日"  v-model="form.naturedayYn" name="naturedayYn" disabled="disabled" />
          </a-col>
          <!--按信托年度-->
          <div v-if="test==='N' || test===''"  style="margin-left: 100px; margin-top: 45px">
            <span >每</span>
            <span style="margin-left: 10px">
                <a-input style="width: 100px" v-model="form.tfix" name="tfix"  disabled="disabled"></a-input><!--placeholder="N2"-->
              </span>
            <span style="margin-left: 10px">
                <a-select :options="dicts.TERM_UNIT"  v-model="form.intDayType" style="width: 100px" name="intDayType" disabled="disabled"></a-select>
              </span>

          </div>

          <!--按自然年度====年====月===日 -->
          <div v-if="test==='Y'" style="margin-left: 100px; margin-top: 40px">
            <span   >每</span>
            <span  v-if="this.form.intDayType==='Y'"  style="margin-left: 10px">
                <a-input style="width: 100px" v-model="form.yearTfix" name="yearTfix"  disabled="disabled"></a-input><!--placeholder="N3"-->
              </span>
            <span style="margin-left: 10px">
                <a-select :options="dicts.TERM_UNIT"  v-model="form.intDayType"  style="width: 100px" name="intDayType" disabled="disabled"></a-select>
              </span>

            <span v-if="this.form.intDayType!=='M' && this.form.intDayType!=='W' && this.form.intDayType!=='D'"  style="margin-left: 10px">
                <a-select
                  mode="multiple"
                  :size="size"
                  placeholder="请选择"
                  style="width: 200px"
                  @popupScroll="popupScroll"
                  :options="dicts.MONTH_LIST"
                  v-model="form.intMouthList"
                  name="intMouthList"
                  disabled="disabled"
                  @change="mChange"
                >
    </a-select>
              </span>

            <span v-if="this.form.intDayType!=='D' && this.form.intDayType!=='W'"   style="margin-left: 10px">
                <a-select :options="dicts.INT_RULE_TERM_UNIT" v-model="form.intRuleTermUnit" style="width: 100px" name="intRuleTermUnit" disabled="disabled"></a-select>
              </span>
            <!--按日-->
            <span v-if="this.form.intRuleTermUnit==='0' && this.form.intDayType!=='D'  && this.form.intDayType!=='W'"  style="margin-left: 10px">
                <a-select :options="dicts.OPEN_RULE_ORDER" v-model="form.intRuleOrder"   style="width: 100px" name="intRuleOrder" disabled="disabled"></a-select>
              </span>

            <span v-if="this.form.intRuleTermUnit==='1' && this.form.intDayType!=='W' && this.form.intDayType!=='D'" style="margin-left: 10px">
                <a-select :options="dicts.INT_RULE_BY_WEEK" v-model="form.intRuleByWeek"  style="width: 100px" name="intRuleByWeek" disabled="disabled"></a-select>
              </span>

            <span v-if="this.form.intRuleTermUnit==='1' &&this.form.intRuleByWeek !=='1' && this.form.intDayType!=='W' && this.form.intDayType!=='D'" style="margin-left: 10px">
                <a-input style="width: 100px" v-model="form.weekIdx" name="weekIdx"  disabled="disabled"></a-input><!--placeholder="N4"-->
              </span>
            <span v-if="this.form.intRuleTermUnit==='1'&& this.form.intDayType!=='W' && this.form.intDayType!=='D'"  >周的</span>
            <!--按周-->
           <span v-if="this.form.intRuleTermUnit==='1' && this.form.intDayType!=='D' ||  this.form.intDayType==='W' && this.form.intDayType!=='D'"  style="margin-left: 10px">
                <a-select :options="dicts.INT_RULE_ORDER_BY_WEEK" v-model="form.intRuleOrderByWeek"   style="width: 100px" name="intRuleOrderByWeek" disabled="disabled"></a-select>
              </span>
            <span v-if=" this.form.intRuleTermUnit==='0'&& this.form.intDayType!=='D' || this.form.intRuleTermUnit==='1' && this.form.intDayType!=='D'|| this.form.intDayType==='W'" style="margin-left: 10px">
                <a-input style="width: 100px" v-model="form.tfix" name="tfix"  disabled="disabled"></a-input><!--placeholder="N5"-->
              </span>
            <span v-if=" this.form.intRuleOrderByWeek !=='1' && this.form.intRuleOrder !=='fixed'  && this.form.intRuleTermUnit==='0' && this.form.intDayType!=='D' ||this.form.intRuleOrderByWeek !=='1' &&  this.form.intRuleOrderByWeek !=='fixed'&& this.form.intRuleTermUnit==='1'&&this.form.intDayType!=='D' || this.form.intRuleOrderByWeek !=='1' && this.form.intRuleOrderByWeek !=='fixed' && this.form.intDayType==='W' " style="margin-left: 10px">
                <a-select :options="dicts.WORKDAY_TYPE" v-model="form.workdayType" style="width: 100px" name="workdayType" disabled="disabled"></a-select>
              </span>


          </div>


        </a-row>


        <a-row :gutter="24">
          <a-col :span="12">
            <BiFormItemSelect :options="dicts.TAIL_MODE" label="尾数处理" name="tailMode" v-model="form.tailMode" disabled="disabled"/>
          </a-col>
          <a-col :span="12">
            <BiFormItemSelect :options="dicts.TAIL_DIGIT_TYPE" label="尾数保留位数" name="tailDigitType"
                              v-model="form.tailDigitType" disabled="disabled"/>
          </a-col>
        </a-row>


        <a-row :gutter="24">
          <a-col :span="24">
            <BiFormItemTextarea  label="备注" v-model="form.memo" name="memo" placeholder="" :disabled="true"/>
          </a-col>
        </a-row>
        <!--<div style="float: right;margin-bottom: 10px;margin-top: -15px">
          <a-button @click="onSubmit" type="primary">保存并生成计划</a-button>
        </div>-->
      </a-row>
    </a-card>
    </div>

    <a-card  class="card" title="分红计划" :bordered="false">

     <!-- <a-row :gutter="24" v-if="this.form.frequency==='2'">
        <a-col :span="2">
          <a-button type="primary" icon="plus" @click="()=>{modal.visible=true}">新增</a-button>
        </a-col>
      </a-row>-->

      <a-table
        ref="table"
        size="middle"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource1"
        :pagination="ipagination1"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange1">
        >
       <!-- <span slot="operation" slot-scope="text, record">
          <a-divider type="vertical"></a-divider>
          <a @click="edit(record)">编辑</a>
          <a-divider type="vertical"></a-divider>
          <a-popconfirm
            title="确认删除吗?" @confirm="()=>handleDelete1({ id:(+record.id)})"
          >
                <a href="#">删除</a>
              </a-popconfirm>
        </span>-->
      </a-table>

      <BiModal
        :visible.sync="modal.visible"
        :width="600"
        :title="modal.title"
        :fullscreen.sync="modal.fullscreen"
        :switchFullscreen="modal.switchFullscreen"
        @handleOk='handleOk'
        :confirmLoading='modal.confirmLoading'
      >

        <a-form-model ref="aform" :model="aform" :rules="rulesA">
          <BiFormItemDatePicker label="计划分红日" v-model="aform.tday" dateFormat='YYYY-MM-DD' name='tday'/>
          <BiFormItemDatePicker label="开始日期(含)" v-model="aform.startDt" @change="startChange" dateFormat='YYYY-MM-DD' name='startDt'/>
          <BiFormItemDatePicker label="结束日期(含)" name="endDt" @change="endChange" dateFormat='YYYY-MM-DD' v-model="aform.endDt"/>
          <a-row :gutter="24">
            <a-col :span="10">
              <a-form-item label="付息天数"   name="dayCnt" v-model="aform.dayCnt" style="width: 500px">{{this.aform.dayCnt}}
              </a-form-item>
            </a-col>
          </a-row>
          <BiFormItemSelect :options="dicts.DIVIDEND_TYPE" label="分红方式" name="dividendType" v-model="aform.dividendType"/>
          <BiFormItemSelect :options="dicts.ANN_DAYS" label="计息基数" name="annDays" v-model="aform.annDays"/>
          <BiFormItemSelect :options="dicts.TAIL_MODE" label="尾数处理" name="tailMode" v-model="aform.tailMode"/>
          <BiFormItemSelect :options="dicts.TAIL_DIGIT_TYPE" label="尾数保留位数" name="tailDigitType" v-model="aform.tailDigitType"/>
          <BiFormItemSelect :options="dicts.DATA_GEN_TYPE" label="计划分类" disabled="disabled" name="dataGenType" v-model="aform.dataGenType"/>
          <BiFormItemTextarea  label="备注" v-model="aform.memo" name="memo" placeholder="备注"/>
        </a-form-model>
      </BiModal>

    </a-card>
  </a-form-model>

</template>

<script>
  import { addBonusRule,getIdByProCode, editBonusRule,getProducts,getBonusRuleDetail, getProIntParamDetail, editBonusPlan, addBonusPlan,getProductDetail,  } from '@/api/BiApi'
  import dictMixin from '@mixins/dictMixin'
  import biTableMixin from '@mixins/biTableMixin'
  import {getAction, postAction, deleteActionByPostMethod} from '@/api/manage'

  export default {
    name: 'BonusRuleNew',
    components: {
       },
    mixins: [biTableMixin, dictMixin],
    proIntList: [],
    data() {
      return {
        size: 'large',
        test:'',
        paramId: '',
        proCode: '',
        queryParam: {},
        pispro: {},
        form: {
          id: '',
          proCode: '',
          dividendType:'',
          annDays:'',
          intStartRule:'',
          startDt: '',
          intEndRule:'',
          calendarType: '',
          holidayAdjustType: '',
          naturedayYn: '',
          tfix: '',
          yearTfix: '',
          intDayType: '',
          intMouthList: '',
          intRuleTermUnit: '',
          intRuleOrder: '',
          intRuleByWeek: '',
          weekIdx: '',
          intRuleOrderByWeek: '',
          workdayType: '',
          tailMode:'',
          tailDigitType:'',
          memo: '',
          frequency:'',
          enddayCalType:'',

        },
        ycxModel:{
          //选择一次性付清 保存规则时传的对象
          proCode: '',
          dividendType:'',
          annDays:'',
          frequency:'',
          enddayCalType:'',
        }
        ,
        kfqPlanList: [],
        editkfqPlanList: [],
        dataSource1: [],
        ipagination1: {
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        /* table加载状态 */
        loading: false,
        /* table选中keys*/
        selectedRowKeys: [],
        /* table选中records*/
        selectionRows: [],
        aform: {
          id: '',
          tday:'',
          annDays:'',
          tailMode:'',
          tailDigitType:'',
          dividendType: '',
          startDt: '',
          endDt: '',
          dayCnt: '',
          memo: '',
          paramId: '',
          proCode: '',
          removeYn: '',
        },
        rules: {
          proCode: [
            { required: true, message: '请选择资产名称', trigger: 'change' },
          ],
          frequency: [
        { required: true, message: '请选择付息频率', trigger: 'change' },
      ],
          naturedayYn: [
        { required: true, message: '请选择分红日', trigger: 'change' },
      ],
          dividendType: [
            { required: true, message: '请选择分红方式', trigger: 'change' }
          ],
          annDays: [
            { required: true, message: '请选择计息基数', trigger: 'change' }
          ],
          intStartRule: [
            { required: true, message: '请选择开始日', trigger: 'change' }
          ],
          intEndRule: [
            { required: true, message: '请选择结束日', trigger: 'change' }
          ],
          calendarType: [
            { required: true, message: '请选择参考日历', trigger: 'change' }
          ],
          holidayAdjustType: [
            { required: true, message: '请选择遇节假日调整方式', trigger: 'change' }
          ]

        },
        rulesA: {
          tday: [
        { required: true, message: '请选择分红日', trigger: 'change' }
      ],

          startDt: [
            { required: true, message: '请选择日期', trigger: 'change' },
          ],
          endDt: [
            { required: true, message: '请选择日期', trigger: 'change' },
          ],
        },

        pros: [],
        modal: {
          title: '分红规则',
          visible: false,
          fullscreen: false,
          switchFullscreen: false,
          confirmLoading: false,
        },
        url: {
          list: '/proInt/list',
          delete: '/proInt/delete'
        },
        props:{
          proCodeV:{
            default: ''
          }
        },
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',
            width: 90,
            customRender: function(t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '计划分红日',
            dataIndex: 'tday',
            width: '20'
          },
          {
            title: '分红方式',
            dataIndex: 'dividendType',
            width: '100',
            customRender: (text) => this.getDictNameByCode(this.dicts.DIVIDEND_TYPE,text)
          },
          {
            title: '分红区间起始日',
            dataIndex: 'startDt',
            width: '20'
          },
          {
            title: '分红区间结束日',
            dataIndex: 'endDt',
            width: '20'
          },
          {
            title: '计息天数',
            dataIndex: 'dayCnt',
            width: '20'
          },
          {
            title: '计划分类',
            dataIndex: 'dataGenType',
            width: '20',
            customRender: (text) => this.getDictNameByCode(this.dicts.DATA_GEN_TYPE,text)
          },
          {
            title: '操作',
            width: '150',
            scopedSlots: { customRender: 'operation' }
          }
        ],
      }
    },
    methods: {
      open(proCodeV) {
        this.getIdByProCode(proCodeV);
      },
      async getIdByProCode(proCodeV){
        const res =await  getIdByProCode({proCode:proCodeV})
        if (res.success){
          this.id =res.result;
          this.getBonusRuleDetail()
        }
      },
      //保存并生成计划
      onSubmit () {
        this.$refs.bonusRuleForm.validate( async(valid) => {
          if (valid) {
            //如果付息频率选择到期一次性付清 重新封装一个对象传到后台
            if (this.form.frequency==='1'){
                 this.ycxModel.proCode=this.form.proCode;
              this.ycxModel.dividendType=this.form.dividendType;
                this.ycxModel.annDays=this.form.annDays;
                this.ycxModel.frequency=this.form.frequency;
                this.ycxModel.enddayCalType=this.form.enddayCalType;
            }


            if (this.form.naturedayYn=='N'){
              //把自然年度相关的值设为空
              this.form.intMouthList='';
              this.form.intRuleTermUnit='';
              this.form.intRuleOrder='';
              this.form.intRuleByWeek='';
              this.form.intRuleOrderByWeek='';
            }
            
            if (this.form.intDayType !=='Y'){
              this.form.intMouthList='';
            }
            //如果没有选择产品成立日和结束日  则清空日期值
            if(this.form.intStartRule==='2'){
              this.form.startDt='';
            }
            if(this.form.intEndRule==='2'){
              this.form.endDt='';
            }
            this.submitSave()
          }
        });
      },
      async submitSave () {
        //把月转换成字符串逗号拼接
        var str = "";
        for (let i = 0; i < this.form.intMouthList.length; i++) {
          if (i < this.form.intMouthList.length - 1) {
            str += this.form.intMouthList[i] + ",";
          } else {
            str += this.form.intMouthList[i];
          }
        }
        this.form.intMouthList=str;

        // 开始日结束日判断
        if (this.form.startDt && this.form.endDt) {
          const time =  new Date(this.form.endDt)-new Date(this.form.startDt)
          if( time < 0 ){
            this.$message.warning('开始日不能大于结束日')
            return
          }
        }
        let res = ''
        this.loading=true;
        if (this.id) {
          this.form.id = this.id
          res = await editBonusRule(this.form)
        } else {
          if ( this.form.frequency==='1'){
            res = await addBonusRule(this.ycxModel); // 选择一次性付清利息时新增
          } else {
            res = await addBonusRule(this.form); // 选择固定频率时新增
          }

        }


        if (res.success) {
          this.paramId=res.result.proIntParam.id;
          this.proCode=res.result.proIntParam.proCode;
          this.loadkfqData(1);
          this.loading=false;
          this.$message.success('操作成功');

        }
      },

      loadkfqData(arg) {
        if(!this.url.list){
          this.$message.error("请设置url.list属性!")
          return
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination1.current = 1;
        }
        // var params = this.getQueryParams();//查询条件
        var params = this.queryParam;
        params.paramId = this.paramId;
        params.removeYn='N';
        params.pageNo = this.ipagination1.current;
        params.pageSize = this.ipagination1.pageSize;
        this.loading = true;
        getAction(this.url.list, params).then((res) => {
          if (res.success && res.result) {
            this.dataSource1 = res.result.records;
            this.ipagination1.total = res.result.total;
          }
          if(res.code===510){
            this.$message.warning(res.message)
          }
        })
        this.loading = false;
      },
      handleChange(value) {
        this.test=value;
      },
      mChange(value){
        this.form.intMouthList=`${value}`;
      },
      async productChange(value){
        const res = await getProductDetail({proCode:value});
        if(res.success ){
          this.form.enddayCalType = res.result.products.headAndTailProcessing;
        }

      },
      handleTableChange1(pagination, filters, sorter) {
        //分页、排序、筛选变化时触发
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field;
          this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
        }
        this.ipagination1 = pagination;
        this.loadkfqData();
      },
      async handleDelete1(param) {
        const res = await deleteActionByPostMethod(this.url.delete, param)
        if (res.success) {
          this.$message.success('删除成功');
          this.loadkfqData();
        } else {
          this.$message.warning(res.message);
        }
      },

      startChange(value){
        if (this.aform.startDt && this.aform.endDt) {
          const time =  new Date(this.aform.endDt)-new Date(this.aform.startDt)
          if( time < 0 ){
            this.$message.warning('开始日不能大于结束日')
            this.aform.startDt==='';
            return
          }
        }
      },
      endChange(value){
        if (this.aform.startDt && this.aform.endDt) {
          const time =  new Date(this.aform.endDt).getTime()-new Date(this.aform.startDt).getTime()
          if( time < 0 ){
            this.$message.warning('开始日不能大于结束日')
            return
          }else {
            this.aform.dayCnt=time/(1000 * 60 * 60 * 24);
          }
        }
      },


      popupScroll() {
      },

      initDict() {
        this.getDict('ENDDAY_CAL_TYPE,PRO_INT_FREQUENCY,TAIL_DIGIT_TYPE,TAIL_MODE,INT_RULE_ORDER_BY_WEEK,INT_END_RULE,INT_START_RULE,DIVIDEND_TYPE,ANN_DAYS,PRO_OPEN_TYPE,DATA_GEN_TYPE,OPEN_DAY_RULE_TRUST,OPEN_START_RULE,OPEN_END_RULE,CALENDAR_TYPE,HOLIDAY_ADJUST_TYPE,TERM_UNIT,NATUREDAY_YN,INT_RULE_TERM_UNIT,OPEN_RULE_ORDER,WORKDAY_TYPE,INT_RULE_BY_WEEK,MONTH_LIST,DAY_LIST,WEEK_DAY_LIST')
      },

      async getProducts() {
        const res = await getProducts({ pageSize:999 })
        if (res.success) {
          this.pros = res.result.records.map(pro=>{
            return {
              name: pro.proName,
              value: pro.proCode
            }
          })
        }
      },

      async getBonusRuleDetail () {
        const res = await getBonusRuleDetail({id:this.id})
        if( res.success ){
          this.form = res.result.proIntParam;
          if (this.form.naturedayYn=='Y'){
            this.test='Y';
          }
          if (this.form.naturedayYn=='N'){
            this.test='N';
          }
          this.paramId=res.result.proIntParam.id;
          this.proCode=res.result.proIntParam.proCode;
          this.loadkfqData(1);
        }
      },
      edit(item) {
        this.pispro = Object.assign({}, item);
        this.modal.visible = true;
        this.aform = {
          id: +item.id,
          tday: item.tday,
          annDays: item.annDays,
          tailMode: item.tailMode,
          tailDigitType: item.tailDigitType,
          memo: item.memo,
          dividendType: item.dividendType,
          dataGenType:item.dataGenType,

          startDt: item.startDt,
          endDt: item.endDt,
          dayCnt: item.dayCnt,



        }
      },
      async handleOk() {
        if (this.aform.startDt && this.aform.endDt) {
          const time =  new Date(this.aform.endDt)-new Date(this.aform.startDt)
          if( time < 0 ){
            this.$message.warning('开始日不能大于结束日')
            return
          }
        }
        this.$refs.aform.validate( async(valid) => {
          if (valid) {
            if (this.aform.id) {
              //编辑操作保存时将值放到pispro中
              this.pispro.dividendType=this.aform.dividendType;
              this.pispro.tday=this.aform.tday;
              this.pispro.annDays=this.aform.annDays;
              this.pispro.tailMode=this.aform.tailMode;
              this.pispro.tailDigitType=this.aform.tailDigitType;
              this.pispro.startDt=this.aform.startDt;
              this.pispro.endDt=this.aform.endDt;
              this.pispro.dayCnt=this.aform.dayCnt;
              this.pispro.memo=this.aform.memo;
            }else {
              //新增的时候 赋值项目编号  paramid
              this.aform.paramId=this.paramId;
              this.aform.proCode=this.proCode;
              this.aform.removeYn='N';
            }
            this.modal.confirmLoading = true
            const res = this.aform.id ? await editBonusPlan(this.pispro) : await addBonusPlan(this.aform)
            if (res.success) {
              this.modal.confirmLoading = false
              this.modal.visible = false
              this.aform = {
                id:'',
                dividendType: '',
                tday: '',
                annDays: '',
                tailMode: '',
                tailDigitType: '',
                dataGenType:'',
                startDt: '',
                endDt: '',
                dayCnt: '',
                memo: '',
                paramId:'',
                proCode:'',
                removeYn:'',
              }
              this.pispro = Object.assign({},{});
              this.$message.success('操作成功');
              this.loadkfqData(1);
            } else {
              this.$message.warning(res.message);
            }
          }
        });
      },
    },
    created() {
      // 初始化字典
      this.initDict()
      if (this.$route.query.id) {
        this.id=this.$route.query.id;
        this.getBonusRuleDetail()
      }else{
        //给下拉框赋初始值
        this.form.workdayType='1';
        this.form.naturedayYn='N';
        this.form.calendarType='LEGAL';
        this.form.holidayAdjustType='NON';
        this.form.intDayType='Y';
        this.form.dividendType='0';
        this.form.annDays='1';
        this.form.intStartRule='1';
        this.form.intEndRule='1';
        this.form.tailMode='0';
        this.form.tailDigitType='1';
        this.form.frequency='2';
      }
    },
    mounted() {
      this.getProducts();
      //新增计划页面默认值
      this.aform.dividendType='0';
      this.aform.annDays='1';
      this.aform.tailMode='0';
      this.aform.tailDigitType='1';
      this.aform.dataGenType='MANUAL';
    }
  }
</script>
<style lang="stylus" scoped>
  .card {
    margin-bottom: 12px;
  }

  .desc {
    line-height: 1
  }

  .btns {
    position: fixed;
    bottom: 10px;
    left: 50%;
  }
</style>
