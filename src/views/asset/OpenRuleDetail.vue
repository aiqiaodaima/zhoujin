<template>
  <a-form-model ref="kfqForm" :model="form" :rules="rules">
    <a-card class="card" title="基本信息" :bordered="false">
      <a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <BiFormItemSelect :options="pros" label="资产名称" name="proCode" v-model="form.proCode" disabled="disabled" :showSearch='true'/>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <BiFormItemSelect :options="dicts.PRO_OPEN_TYPE" label="开放类型" name="openType" v-model="form.openType" disabled="disabled"/>
          </a-col >
        </a-row>
        <a-row :gutter="24">
          <a-col :span="6">
            <BiFormItemSelect :options="dicts.OPEN_START_RULE" label="开始日"  @change="startC" name="openStartRule" v-model="form.openStartRule" disabled="disabled"/>
          </a-col >
          <a-col :span="6">
            <BiFormItemDatePicker label="日期" name="startDt" dateFormat='YYYY-MM-DD' v-model="form.startDt" disabled="disabled"/>
          </a-col >
          <div v-if="this.form.openStartRule==='2'" style="margin-left: 100px; margin-top: 45px">
            <span >后</span>
            <span  style="margin-left: 10px">
                <a-input style="width: 100px" v-model="form.startTfix" name="startTfix"  disabled="disabled"></a-input><!--placeholder="N1"-->
              </span>
            <span style="margin-left: 10px">
                <a-select :options="dicts.TERM_UNIT"  v-model="form.openStartUnit" style="width: 100px" name="openStartUnit" disabled="disabled"></a-select>
              </span>
          </div>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="6">
            <BiFormItemSelect  label="结束日" :options="dicts.OPEN_END_RULE"  v-model="form.openEndRule" name="openEndRule" disabled="disabled" />
          </a-col>
          <a-col :span="6">
            <BiFormItemDatePicker  label="日期" v-model="form.endDt" dateFormat='YYYY-MM-DD' name="endDt" disabled="disabled"/>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="4">
            <BiFormItemSelect :options="dicts.NATUREDAY_YN"  @change="handleChange"  label="开放日"  v-model="form.naturedayYn" name="naturedayYn"  disabled="disabled"/>
          </a-col>
          <!--按信托年度-->
          <div v-if="this.form.naturedayYn==='N'"  style="margin-left: 100px; margin-top: 45px">
            <span >每</span>
            <span style="margin-left: 10px">
                <a-input style="width: 100px" v-model="form.tfix" name="tfix"  disabled="disabled"></a-input><!--placeholder="N2"-->
              </span>
            <span style="margin-left: 10px">
                <a-select :options="dicts.TERM_UNIT"  v-model="form.dayType" style="width: 100px" name="dayType" disabled="disabled"></a-select>
              </span>

            <span style="margin-left: 10px">
                <a-select :options="dicts.OPEN_DAY_RULE_TRUST"  v-model="form.trustOpenDayRule" style="width: 100px" name="trustOpenDayRule" disabled="disabled"></a-select>
              </span>

            <span style="margin-left: 10px">
                <a-input style="width: 100px" v-model="form.trustOpenDayTfix" name="trustOpenDayTfix"  disabled="disabled"></a-input><!--placeholder="N6"-->
              </span>
            <span style="margin-left: 10px">
                <a-select :options="dicts.WORKDAY_TYPE" v-model="form.workdayType" style="width: 100px" name="workdayType" disabled="disabled"></a-select>
              </span>

          </div>

          <!--按自然年度====年====月===日 -->
          <div v-if="this.form.naturedayYn==='Y'" style="margin-left: 100px; margin-top: 40px">
            <span   >每</span>
            <span  v-if="this.form.dayType==='Y'"  style="margin-left: 10px">
                <a-input style="width: 100px" v-model="form.yearTfix" name="yearTfix"  disabled="disabled"></a-input><!--placeholder="N3"-->
              </span>
            <span style="margin-left: 10px">
                <a-select :options="dicts.TERM_UNIT"  v-model="form.dayType"  style="width: 100px" name="dayType" disabled="disabled"></a-select>
              </span>

            <span v-if="this.form.dayType!=='M' && this.form.dayType!=='W' && this.form.dayType!=='D'"  style="margin-left: 10px">
                <a-select
                  mode="multiple"
                  :size="size"
                  placeholder="请选择"
                  style="width: 200px"
                  @popupScroll="popupScroll"
                  :options="dicts.MONTH_LIST"
                  v-model="form.monthList"
                  name="monthList"
                  disabled="disabled"
                  @change="mChange"
                >
    </a-select>
              </span>

            <span v-if="this.form.dayType!=='D' && this.form.dayType!=='W'"   style="margin-left: 10px">
                <a-select :options="dicts.INT_RULE_TERM_UNIT" v-model="form.openRuleTermUnit" style="width: 100px" name="openRuleTermUnit" disabled="disabled"></a-select>
              </span>
            <!--按日-->
            <span v-if="this.form.openRuleTermUnit==='0' && this.form.dayType!=='D'  && this.form.dayType!=='W'"  style="margin-left: 10px">
                <a-select :options="dicts.OPEN_RULE_ORDER" v-model="form.openRuleOrder"   style="width: 100px" name="openRuleOrder" disabled="disabled"></a-select>
              </span>

            <span v-if="this.form.openRuleTermUnit==='1' && this.form.dayType!=='W'" style="margin-left: 10px">
                <a-select :options="dicts.INT_RULE_BY_WEEK" v-model="form.openRuleByWeek"  style="width: 100px" name="openRuleByWeek" disabled="disabled"></a-select>
              </span>

            <span v-if="this.form.openRuleTermUnit==='1' &&this.form.openRuleByWeek !=='1' && this.form.dayType!=='W'" style="margin-left: 10px">
                <a-input style="width: 100px" v-model="form.weekIdx" name="weekIdx"  disabled="disabled"></a-input><!--placeholder="N4"-->
              </span>
            <span v-if="this.form.openRuleTermUnit==='1'&& this.form.dayType!=='W'"  >周的</span>
            <!--按周-->
            <span v-if="this.form.openRuleTermUnit==='1' ||  this.form.dayType==='W'"  style="margin-left: 10px">
                <a-select :options="dicts.OPEN_RULE_ORDER" v-model="form.openRuleOrderByWeek"   style="width: 100px" name="openRuleOrderByWeek" disabled="disabled"></a-select>
              </span>
            <span v-if="this.form.openRuleTermUnit==='1' && this.form.openRuleOrderByWeek ==='fixed' " style="margin-left: 10px">
               <a-select
                 mode="multiple"
                 :size="size"
                 placeholder="请选择"
                 style="width: 200px"
                 @popupScroll="popupScroll"
                 :options="dicts.WEEK_DAY_LIST"
                 v-model="form.weekDayList"
                 name="weekDayList"
                 disabled="disabled"
                 @change="wChange"
               >
    </a-select>
              </span>
            <span v-if="this.form.openRuleOrder !=='fixed'  && this.form.openRuleTermUnit==='0'&& this.form.dayType!=='D' || this.form.openRuleOrderByWeek !=='fixed' && this.form.openRuleTermUnit==='1' && this.form.dayType!=='D'||this.form.openRuleOrderByWeek !=='fixed' && this.form.dayType==='W'" style="margin-left: 10px">
                <a-input style="width: 100px" v-model="form.tfix" name="tfix" disabled="disabled"></a-input><!--placeholder="N5" -->
              </span>
            <span v-if="this.form.openRuleOrder ==='fixed' && this.form.dayType!=='D'  && this.form.dayType!=='W' && this.form.openRuleTermUnit==='0' ||this.form.openRuleOrderByWeek ==='fixed' && this.form.dayType==='W' && this.form.openRuleTermUnit==='0'"   style="margin-left: 10px">
                <a-select
                  mode="multiple"
                  :size="size"
                  placeholder="请选择"
                  style="width: 200px"
                  @popupScroll="popupScroll"
                  :options="dicts.DAY_LIST"
                  v-model="form.dayList"
                  name="dayList"
                  disabled="disabled"
                  @change="dChange"
                >
    </a-select>
              </span>
            <span  v-if="this.form.openRuleOrder !=='fixed'  && this.form.openRuleTermUnit==='0' && this.form.dayType!=='D' || this.form.openRuleOrderByWeek !=='fixed'&& this.form.openRuleTermUnit==='1'&&this.form.dayType!=='D' ||this.form.openRuleOrderByWeek !=='fixed' && this.form.dayType==='W' " style="margin-left: 10px">
                <a-select  :options="dicts.WORKDAY_TYPE" v-model="form.workdayType" style="width: 100px" name="workdayType" disabled="disabled"></a-select>
              </span>


          </div>


        </a-row>


        <a-row :gutter="24">
          <a-col :span="10">
            <BiFormItemSelect :options="dicts.CALENDAR_TYPE" label="参考日历"  v-model="form.calendarType" name="calendarType" disabled="disabled"/>
          </a-col>
          <a-col :span="10">
            <BiFormItemSelect :options="dicts.HOLIDAY_ADJUST_TYPE"  label="遇节假日调整方式" v-model="form.holidayAdjustType" name="holidayAdjustType" disabled="disabled"/>
          </a-col>
        </a-row>


        <a-row :gutter="24"  >
          <a-col :span="24">
            <BiFormItemTextarea label="备注" v-model="form.memo" name="memo" placeholder="" :disabled="true"/>
          </a-col>
        </a-row>
        <!--<div style="float: right;margin-bottom: 10px;margin-top: -15px">
          <a-button @click="onSubmit" type="primary">保存并生成计划</a-button>
        </div>-->
      </a-row>


    </a-card>
    <a-card class="card" title="开放期计划" :bordered="false">

      <!--<a-row :gutter="24">
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
          <BiFormItemSelect :options="dicts.PRO_OPEN_TYPE" label="开放类型" name="openType" v-model="aform.openType"/>
          <BiFormItemDatePicker  label="开始日期（含）" dateFormat='YYYY-MM-DD' v-model="aform.startDt" @change="startChange" name="startDt"/>
          <BiFormItemDatePicker  label="结束日期（含）" dateFormat='YYYY-MM-DD' v-model="aform.endDt" @change="endChange" name="endDt"/>
          <a-row :gutter="24">
            <a-col :span="10">
              <a-form-item label="开放天数"   name="dayCnt" v-model="aform.dayCnt" style="width: 500px">{{this.aform.dayCnt}}
              </a-form-item>
            </a-col>
          </a-row>
          <BiFormItemSelect :options="dicts.DATA_GEN_TYPE" label="计划分类"  name="dataGenType" v-model="aform.dataGenType"/>
          <BiFormItemTextarea  label="备注" v-model="aform.memo" name="memo" placeholder="备注"/>
        </a-form-model>
      </BiModal>

    </a-card>
  </a-form-model>

</template>

<script>
  import biTableMixin from '@mixins/biTableMixin'
  import { addOpenRule,editOpenRule,getProducts,addkfqPlan,editkfqPlan,getOpenRuleDetail,getProductDetail  } from '@/api/BiApi'
  import dictMixin from '@mixins/dictMixin'
  import {getAction, postAction, deleteActionByPostMethod} from '@/api/manage'
  export default {
    name: 'OpenRuleDetail',
    components: {

    },
    mixins:[dictMixin,biTableMixin],
    data () {
      return {
        zType:'',
        mList:'',
        size: 'large',
        test:'',
        type:'',
        paramId:'',
        proCode: '',
        queryParam: {},
        pispro:{},
        mStr:'',
        wStr:'',
        dStr:'',
        mc:'',
        wc:'',
        dc:'',
        form: {
          id:'',
          proCode: '',
          bankProCode:'',
          openType: '',
          openStartRule: '',
          startDt: '',
          startTfix:'',
          openStartUnit:'',
          openEndRule: '',
          endDt: '',
          naturedayYn: '',
          tfix:'',
          dayType:'',
          yearTfix:'',
          monthList:'',
          openRuleTermUnit:'',
          openRuleOrder:'',
          openRuleByWeek:'',
          weekIdx:'',
          openRuleOrderByWeek:'',
          weekDayList:'',
          dayList:'',
          workdayType:'',
          calendarType: '',
          holidayAdjustType: '',
          trustOpenDayRule:'',
          trustOpenDayTfix:'',
          memo: '',

        },
        kfqPlanList:[],
        editkfqPlanList:[],
        dataSource1:[],
        ipagination1:{
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
        loading:false,
        /* table选中keys*/
        selectedRowKeys: [],
        /* table选中records*/
        selectionRows: [],
        aform: {
          id:'',
          openType: '',
          startDt: '',
          endDt: '',
          dayCnt: '',
          dataGenType: '',
          memo: '',
          paramId:'',
          proCode:'',
          removeYn:'',
        },
        rules: {
          proCode: [
            { required: true, message: '请选择资产名称', trigger: 'change' },
          ],
          openType: [
            { required: true, message: '请选择开放类型', trigger: 'change' },
          ],
          openStartRule: [
            { required: true, message: '请选择开始日', trigger: 'change' },
          ],
          startDt: [
            { required: true, message: '请选择日期', trigger: 'change' },
          ],
          openEndRule: [
            { required: true, message: '请选择结束日', trigger: 'change' },
          ],
          endDt: [
            { required: true, message: '请选择日期', trigger: 'change' },
          ],
          naturedayYn: [
            { required: true, message: '请选择开放日', trigger: 'change' },
          ],
          calendarType: [
            { required: true, message: '请选择参考日历', trigger: 'change' },
          ],
          holidayAdjustType: [
            { required: true, message: '请选择遇节假日调整方式', trigger: 'change' },
          ]
        },
        rulesA: {
          startDt: [
            { required: true, message: '请选择日期', trigger: 'change' },
          ],
          endDt: [
            { required: true, message: '请选择日期', trigger: 'change' },
          ],
          openType: [
            { required: true, message: '请选择开放类型', trigger: 'change' },
          ],
        },
        pros:[],
        modal: {
          title: '开放期规则',
          visible: false,
          fullscreen: false,
          switchFullscreen: false,
          confirmLoading: false,
        },
        url: {
          list: "/proOpen/list",
          delete: "/proOpen/delete",
        },
        // table
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',
            width: 90,
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '开放类型',
            dataIndex: 'openType',
            width: '100',
            customRender: (text) => this.getDictNameByCode(this.dicts.PRO_OPEN_TYPE,text)
          },
          {
            title: '开始日期',
            dataIndex: 'startDt',
            width: '20',
          },
          {
            title: '结束日期',
            dataIndex: 'endDt',
            width: '20',
          },
          {
            title: '计划分类',
            dataIndex: 'dataGenType',
            width: '20',
            customRender: (text) => this.getDictNameByCode(this.dicts.DATA_GEN_TYPE,text)
          },

        ],
      }
    },

    methods: {
      //保存并生成计划
      onSubmit () {
        this.$refs.kfqForm.validate( async(valid) => {
          if (valid) {
            if (this.form.naturedayYn=='N'){
              //把自然年度相关的值设为空
              this.form.monthList='';
              this.form.openRuleTermUnit='';
              this.form.openRuleOrder='';
              this.form.openRuleByWeek='';
              this.form.openRuleOrderByWeek='';
              this.form.weekDayList='';
              this.form.dayList='';
            }
            if (this.form.dayType!='Y'){
              this.form.monthList='';
            }
            if (this.mc=='1') {
              this.form.monthList=this.mStr;
            }
            if (this.form.openRuleOrderByWeek!='fixed' ){
              this.form.weekDayList='';
            }
            if (this.wc=='1') {
              this.form.weekDayList=this.wStr;
            }
            if (this.form.openRuleOrder!='fixed' ||this.form.dayType=='D'){
              this.form.dayList='';
            }
            if (this.dc=='1') {
              this.form.dayList=this.dStr;
            }
            this.submitSave()
          }
        });
      },
      async submitSave () {

        // 开始日结束日判断
        if (this.form.startDt && this.form.endDt) {
          const time =  new Date(this.form.endDt)-new Date(this.form.startDt)
          if( time < 0 ){
            this.$message.warning('开始日不能大于结束日')
            return
          }
        }
        let res = ''

        if (this.id) {
          this.form.id = this.id
          res = await editOpenRule(this.form)
        } else {
          res = await editOpenRule(this.form); // 新增
        }


        if (res.success) {
          //重复点击保存 相当于编辑第一次点击保存生成的数据
          this.id =res.result.proOpenParam.id;
          this.paramId=res.result.proOpenParam.id;
          this.proCode=res.result.proOpenParam.proCode;
          this.loadkfqData(1);
          this.$message.success('操作成功');

        }
      },
      startC(value){
        if (value!='2'){
          this.form.startTfix='';
          this.form.openStartUnit='';
        }
      },

      async addOpenPlan(){
        if (this.paramId===''){
          this.$message.warn('请先生成开放期规则');
          return
        }
        this.modal.visible=true;
        //新增时赋值手工录入
        this.aform.dataGenType='MANUAL';
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
      mChange(value){
        this.mStr=`${value}`;
        //表示有没有出发过该事件  如果没有 保存的时候就传初始值
        this.mc='1';
        // this.form.monthList=`${value}`;
        console.log(`mChange: ${value}`);
      },
      wChange(value){
        this.wStr=`${value}`;
        //表示有没有出发过该事件  如果没有 保存的时候就传初始值
        this.wc='1';
        // this.form.weekDayList=`${value}`;
        console.log(`wChange: ${value}`);
      },
      dChange(value){
        this.dStr=`${value}`;
        //表示有没有出发过该事件  如果没有 保存的时候就传初始值
        this.dc='1';
        // this.form.dayList=`${value}`;
        console.log(`dChange: ${value}`);
      },
      handleChange(value) {
        this.test=value;
        console.log(`Selected: ${value}`);
      },
      startChange(value){
        console.log(`startChange: ${value}`);
        if (this.aform.startDt && this.aform.endDt) {
          const time =  new Date(this.aform.endDt)-new Date(this.aform.startDt)
          if( time < 0 ){
            this.$message.warning('开始日不能大于结束日')
            this.aform.startDt==='';
            return
          }else {
            this.aform.dayCnt=time/(1000 * 60 * 60 * 24);
          }
        }
      },
      endChange(value){
        console.log(`endChange: ${value}`);
        if (this.aform.startDt && this.aform.endDt) {
          const time =  new Date(this.aform.endDt).getTime()-new Date(this.aform.startDt).getTime()
          console.log(`tttttttttttttt: ${time}`);
          if( time < 0 ){
            this.$message.warning('开始日不能大于结束日')
            return
          }else {
            this.aform.dayCnt=time/(1000 * 60 * 60 * 24) + 1;
          }
        }
      },
      popupScroll() {
        console.log('popupScroll');
      },

      initDict() {
        this.getDict('PRO_OPEN_TYPE,DATA_GEN_TYPE,OPEN_DAY_RULE_TRUST,OPEN_START_RULE,OPEN_END_RULE,CALENDAR_TYPE,HOLIDAY_ADJUST_TYPE,TERM_UNIT,NATUREDAY_YN,INT_RULE_TERM_UNIT,OPEN_RULE_ORDER,WORKDAY_TYPE,INT_RULE_BY_WEEK,MONTH_LIST,DAY_LIST,WEEK_DAY_LIST')
      },

      async getProducts() {
        const res = await getProducts({ pageSize:999,channel:'O',rpoOpenYn:'1' })
        if (res.success) {
          this.pros = res.result.records.map(pro=>{
            return {
              name: pro.proName,
              value: pro.proCode
            }
          })
        }
      },
      async productChange(value){
        const res = await getProductDetail({proCode:value});
        if(res.success ){
          this.form.bankProCode = res.result.products.bankProCode;
        }

      },

      async getOpenRuleDetail () {
        const res = await getOpenRuleDetail({id:this.id})
        if( res.success ){
          this.form = res.result.proOpenParam;
          this.paramId=res.result.proOpenParam.id;
          this.proCode=res.result.proOpenParam.proCode;
          const res1 = await getProductDetail({proCode:this.proCode});
          if(res1.success ){
            this.form.bankProCode = res1.result.products.bankProCode;
          }
          this.loadkfqData(1);
        }
      },
      edit(item) {
        this.pispro = Object.assign({}, item);
        this.modal.visible = true;
        this.aform = {
          id: +item.id,
          openType: item.openType,
          startDt: item.startDt,
          endDt: item.endDt,
          dayCnt: item.dayCnt,
          dataGenType: item.dataGenType,
          memo: item.memo,
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
            console.log('88888888888888888888>>>>>>>>>>>'+this.paramId);
            if (this.aform.id) {
              //编辑操作保存时将值放到pispro中
              this.pispro.openType=this.aform.openType;
              this.pispro.startDt=this.aform.startDt;
              this.pispro.endDt=this.aform.endDt;
              this.pispro.dayCnt=this.aform.dayCnt;
              this.pispro.dataGenType=this.aform.dataGenType;
              this.pispro.memo=this.aform.memo;
            }else {
              //新增的时候 赋值项目编号  paramid
              this.aform.paramId=this.paramId;
              this.aform.proCode=this.proCode;
              this.aform.removeYn='N';
            }
            this.modal.confirmLoading = true
            const res = this.aform.id ? await editkfqPlan(this.pispro) : await addkfqPlan(this.aform)
            if (res.success) {
              this.modal.confirmLoading = false
              this.modal.visible = false
              this.aform = {
                id:'',
                openType: '',
                startDt: '',
                endDt: '',
                dayCnt: '',
                dataGenType: '',
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
    mounted() {
      this.getProducts();

    },
    created() {
      // 初始化字典
      this.initDict()
      if (this.$route.query.id) {
        this.id=this.$route.query.id;
        this.zType='1',

          this.getOpenRuleDetail()
      }else{
        //给下拉框赋初始值
        this.form.workdayType='2';
        this.form.openType='BUY';
        this.form.openStartRule='1';
        this.form.openEndRule='1';
        this.form.naturedayYn='N';
        this.form.openStartUnit='Y';
        this.form.calendarType='LEGAL';
        this.form.holidayAdjustType='NON';
        this.form.dayType='Y';
        this.form.trustOpenDayRule='1';
        this.form.dayList='1';
        this.form.monthList='01';
        this.form.weekDayList='1';
      }

      //从资产列表点击按钮进入时赋值
      if (this.$route.query.asset_proName && this.$route.query.asset_proCode){
        this.form.proCode=this.$route.query.asset_proCode;
        this.form.bankProCode=this.$route.query.asset_bankProCode;
        this.form.proName=this.$route.query.asset_proName;
        //type用来区分显示哪个资产名称的文本框
        this.type ='asset';
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