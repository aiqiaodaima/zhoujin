<template>
  <a-form-model ref="assetForm" :model="form" :rules="rules">
    <a-card class="card" title="投资限制模版基本要素" :bordered="false"> 
      <a-row>
        <BiCol>
          <BiFormItemInput label="模版名称" name="assetcomName" placeholder="请输入模版名称" v-model="form.assetcomName"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.CONTRACT_SERIE" label="合同系列" name="contractSerie" v-model="form.contractSerie"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.RISK_CODE" label="投资类型" name="invType" v-model="form.invType"/>
        </BiCol>
      </a-row> 
    </a-card>
    <a-card class="card" title="资产投资比例" :bordered="false">
      <a-row>
        <BiCol>
          <BiFormItemSelect :options="assetParamList" label="资产管理策略" name="assetcomCode" v-model="form.assetcomCode" @change="changeAssetcomCode"/>
        </BiCol>
      </a-row>
      <a-table
        :columns="columns"
        :dataSource="tacticPercents"
        :pagination="false"
        rowKey="assetcatName"
      >
        <template v-for="(col, i) in [ 'perctMin', 'perctMax',]" :slot="col" slot-scope="text, record, index">
          <a-input-number  :key="col" :value="text"  :min="0" :max="100" :precision="2" :placeholder="columns[i+1].title" @change="e => handleChange(e,col,index)"
          />
        </template>
        <template  slot="perct" slot-scope="text, record, index">
          <a-textarea rows="1"  :value="text" placeholder="请输入限制描述" @change="e => handleChange(e,index)"
          />
        </template>
      </a-table>  
      <BiComments :comments="[ '1、根据风险测评结果，默认带入资产管理策略内容，并且可修改。','2、填写了上下限的限制类别，都会用于投资策略检核；','3、存款记入现金及货币市场类产品。无论投资产品的资产类别和已设置限制的资产类别是否相匹配，每次都针对所有已设置的限制进行检核。']"/>
    </a-card>
    <a-card class="card" title="发行机构投资限制" :bordered="false"> 
      <a-row>
        <BiCol :lg='{span: 12, offset: 1}'>
          <BiFormItemSelect :options="admOrgnaiztions" label="只能投资" name="comRiskCode" v-model="form.comRiskCode" mode='multiple'/>
        </BiCol>
        <BiCol :lg='{span: 7, offset: 1}'>
          <BiFormItemTextarea  rows='1' label="限制描述" name="restrictionDescription" placeholder="请输入限制描述" v-model="form.assetcomName"/>
        </BiCol>
      </a-row> 
      <a-row> 
        <BiCol :lg='{span: 12, offset: 1}'>
          <BiFormItemSelect :options="admOrgnaiztions" label="不能投资" name="noInvestment" v-model="form.comRiskCode" mode='multiple'/>
        </BiCol>
        <BiCol :lg='{span: 7, offset: 1}'>
          <BiFormItemTextarea rows='1'  label="限制描述" name="restrictionDescription" placeholder="请输入限制描述" v-model="form.assetcomName"/>
        </BiCol>
      </a-row> 
      
    </a-card>
    <a-card class="card" title="预警止损线" :bordered="false"> 
      <a-row>
        <BiCol>
          <BiFormItemSelect :options="dicts.RISK_CODE" label="预警线" name="WarningLine" v-model="form.comRiskCode"/>
        </BiCol>
        <BiCol>
          <BiFormItemTextarea  rows='1' label="限制描述" name="restrictionDescription" placeholder="请输入限制描述" v-model="form.assetcomName"/>
        </BiCol>
      </a-row> 
      <a-row> 
        <BiCol>
          <BiFormItemSelect :options="dicts.RISK_CODE" label="止损线" name="stopLossLine" v-model="form.comRiskCode"/>
        </BiCol>
        <BiCol>
          <BiFormItemTextarea rows='1'  label="限制描述" name="restrictionDescription" placeholder="请输入限制描述" v-model="form.assetcomName"/>
        </BiCol>
      </a-row> 
    </a-card>
    <a-card class="card" title="其他限制" :bordered="false"> 
      <a-table
        :columns="otherColumns"
        :dataSource="otherLimits"
        :pagination="false"
        rowKey="index"
      >
        <template slot="index" slot-scope="text, record, index">{{index+1}}</template>
        <template slot="accType" slot-scope="text, record, index">
          <BiFormItemSelect :options="otherLimitTypes" :isForm="false" v-model="form.comRiskCode"/>
          <!-- <a-select  @change="handleChange" placeholder="请选择限制类别">
            <a-select-option v-for="(item,index) in otherLimitTypes" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select> -->
        </template>
        <template v-for="(col, i) in [ 'accName', 'accNo', 'accOpenBank', 'bigAccNo']" :slot="col" slot-scope="text, record, index">
          <a-input
            :key="col"
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            :placeholder="otherColumns[i+1].title"
            @change="e => handleChangeOther(e.target.value,col,index)"
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
      <a-button style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus" @click="newMember">新增资金清算账户</a-button>
    </a-card>
    <a-card class="card" title="扫描件上传" :bordered="false"> 
      <a-form-item label="文件上传">
        <BiUpload v-model="fileList"></BiUpload>
      </a-form-item>
    </a-card>
    <a-form-item
        :wrapperCol="{ span: 24 }"
        style="text-align: center"
      >
        <a-button @click="onSubmit" type="primary">保存</a-button>
        <a-button style="margin-left: 8px" @click="back">返回</a-button>
    </a-form-item>
  </a-form-model>
  
</template>

<script>
import { getInvlmtTemplate, addInvlmtTemplate,getAssetParamList } from '@/api/BiApi'
import dictMixin from '@mixins/dictMixin'
const otherLimitTypes = [
  {
    name:'单笔投资比例',value: 'single'
  },
  {
    name:'单笔投资币种',value: 'CUR_CODE1'
  },
  {
    name:'投资区域',value: 'AREA_CODE'
  },
  {
    name:'行业投资比例',value: 'IDS_TYPE'
  },
  {
    name:'投资币种',value: 'CUR_CODE'
  },
  {
    name:'风险等级',value: 'PRO_RISK_CODE'
  },
  {
    name:'融资主体评级',value: 'BOND_RANK_L'
  },
  {
    name:'担保主体评级',value: 'BOND_RANK_S'
  },
  {
    name:'债项评级/资产评级',value: 'BOND_TERM'
  },
  {
    name:'产品期限',value: 'PRODUCT_DEADLINE_TYPE'
  },
]
  export default {
    name: 'InvlmtTemplateNew',
    components: { 
    },
    inject:['closeCurrent'],
    mixins:[dictMixin],
    data () {
      return {
        form: {
         
        },
        tacticPercents: [
          {
            assetcatName:'现金及货币市场类',
            perct:0,
            perctMin: 0,
            perctMax: 0,
          }, 
          {
            assetcatName:'债权及固定收益类',
            perct: 0,
            perctMin: 0,
            perctMax: 0,
          }, 
          {
            assetcatName:'权益类',
            perct: 0,
            perctMin: 0,
            perctMax: 0,
          }, 
          {
            assetcatName:'另类',
            perct: 0,
            perctMin: 0,
            perctMax: 0,
          },     
        ], //管理策略数据
        rules: {
          assetcomName: [
            { required: true, message: '请输入模版名称', trigger: 'blur' },
          ],
          comRiskCode: [
            { required: true, message: '请选择只能投资', trigger: 'change' },
          ],
          restrictionDescription: [
            { required: true, message: '请输入限制描述', trigger: 'blur' },
          ],
          noInvestment: [
            { required: true, message: '请选择不能投资', trigger: 'blur' },
          ],
          WarningLine: [
            { required: true, message: '请选择预警线', trigger: 'blur' },
          ],
          stopLossLine: [
            { required: true, message: '请选择止损线', trigger: 'blur' },
          ],
        },
        // 管理策略table
        columns: [
          {
            title: '资产类别',
            key: 'index',
            dataIndex: 'assetcatName',
            width: 10,
          },
          {
            title: '警示下限%',
            dataIndex: 'perctMin',
            key: 'perctMin',
            width: 20,
            scopedSlots: { customRender: 'perctMin' }
          },
          {
            title: '警示上线%',
            dataIndex: 'perctMax',
            key: 'perctMax',
            width: 20,
            scopedSlots: { customRender: 'perctMax' }
          },
          {
            title: '限制描述',
            dataIndex: 'perct',
            key: 'perct',
            width: 20,
            scopedSlots: { customRender: 'perct' }
          },
        ],
        perctSum: 0,
        // 复制新增
        copyNew: false, 
        otherColumns: [
          {
            title: '序号',
            key: 'index',
            width: 50,
            scopedSlots: { customRender: 'index' }
          },
          {
            title: '限制类别',
            dataIndex: 'accType',
            key: 'accType',
            width: 100,
            scopedSlots: { customRender: 'accType' }
          },
          {
            title: '限制细类',
            dataIndex: 'accName',
            key: 'accName',
            width: 50,
            scopedSlots: { customRender: 'accName' }
          },
          {
            title: '下限',
            dataIndex: 'accNo',
            key: 'accNo',
            width: 50,
            scopedSlots: { customRender: 'accNo' }
          },
          {
            title: '上限',
            dataIndex: 'accOpenBank',
            key: 'accOpenBank',
            width: 50,
            scopedSlots: { customRender: 'accOpenBank' }
          },
          {
            title: '限制描述',
            dataIndex: 'bigAccNo',
            key: 'bigAccNo',
            width: 50,
            scopedSlots: { customRender: 'bigAccNo' }
          },
          {
            title: '操作',
            key: 'action',
            width: 100,
            scopedSlots: { customRender: 'operation' }
          }
        ], // 其他限制table
        otherLimits:[], // 其他限制数据
        fileList: [], //文件
        otherLimitTypes: otherLimitTypes, // 其他限制类型
        assetParamList: [],// 资产策略列表
      }
    },
    methods: {
      back () {
        this.$router.push({ name:'invlmtTemplateList' })
        this.closeCurrent()
      },
      onSubmit () {
        let res = ''
        let param = {
          moneyPerct: this.tacticPercents[0].perct,
          moneyPerctMax: this.tacticPercents[0].perctMax,
          moneyPerctMin: this.tacticPercents[0].perctMin,
          bondPerct: this.tacticPercents[1].perct,
          bondPerctMax: this.tacticPercents[1].perctMax,
          bondPerctMin: this.tacticPercents[1].perctMin,
          stockPerct: this.tacticPercents[2].perct,
          stockPerctMax: this.tacticPercents[2].perctMax,
          stockPerctMin: this.tacticPercents[2].perctMin,
          otherPerct: this.tacticPercents[3].perct,
          otherPerctMax: this.tacticPercents[3].perctMax,
          otherPerctMin: this.tacticPercents[3].perctMin,
          assetcomCode: '',
          ComType: '',
          ...this.form
        }
        // 编辑
        if (this.assetcomCode && !this.copyNew) {
          param.assetcomCode = this.assetcomCode
        }
        this.$refs.assetForm.validate( async(valid) => {
          if (valid) { 
            res = await addAssetParam(param)
            if (res.success) {
              this.$message.success('操作成功');
              this.$router.replace({ name:'assetTacticList' })
            }
          }
        });
      },
      handleChange (value,column,index) {
        const newData = [...this.tacticPercents]
        const target = newData[index]
        if (target) {
          target[column] = value
          this.tacticPercents = newData
        }
        let sum = 0
        this.tacticPercents.forEach(item=>{
          sum += item.perct
        })
        this.perctSum  = sum
      },
      async getAssetParam () {
        const res = await getAssetParam({assetcomCode:this.assetcomCode})
        if( res.success ){
          let {assetcomName,comRiskCode,assetcomDesc,moneyPerct,moneyPerctMax,moneyPerctMin,bondPerct,
          bondPerctMax,bondPerctMin,stockPerct,stockPerctMax,stockPerctMin,otherPerct,otherPerctMax,otherPerctMin
          } = res.result
          this.form = {
            assetcomName,comRiskCode,assetcomDesc
          }
          this.tacticPercents[0].perct = moneyPerct
          this.tacticPercents[0].perctMax = moneyPerctMax
          this.tacticPercents[0].perctMin = moneyPerctMin
          this.tacticPercents[1].perct = bondPerct
          this.tacticPercents[1].perctMax = bondPerctMax
          this.tacticPercents[1].perctMin = bondPerctMin
          this.tacticPercents[2].perct = stockPerct
          this.tacticPercents[2].perctMax = stockPerctMax
          this.tacticPercents[2].perctMin = stockPerctMin
          this.tacticPercents[3].perct = otherPerct
          this.tacticPercents[3].perctMax = otherPerctMax
          this.tacticPercents[3].perctMin = otherPerctMin
          this.perctSum = moneyPerct + bondPerct + stockPerct + otherPerct
        }
      },
      newMember () {
        this.otherLimits.push({
          editable: true,
          isNew: true,
          accType:'',
          accName: '',
          accNo: '',
          accOpenBank: '',
          bigAccNo:''
        })
      },
      remove (index) {
        this.otherLimits.splice(index,1)
      },
      saveRow (index) {
        let target = this.otherLimits[index]
        target.editable = false
        target.isNew = false
      },
      toggle (index) {
        let target = this.otherLimits[index]
        target.editable = !target.editable
      },
      getRowByKey (key, newData) {
        const data = this.otherLimits
        return (newData || data).filter(item => item.key === key)[0]
      },
      cancel (index) {
        let target = this.otherLimits[index]
        target.editable = false
      },
      handleChangeOther (value,column,index) {
        const newData = [...this.otherLimits]
        const target = newData[index]
        if (target) {
          target[column] = value
          this.otherLimits = newData
        }
      },
      // 获取资产管理策略
      async getAssetParamList() {
        const res = await getAssetParamList({pageSize:9999})
        this.assetParamList = res.result.records.map(item=>{return {
          name:item.assetcomName,
          value:item.assetcomCode,
          ...item
          }})
      },
      changeAssetcomCode(){
       const selected =  this.assetParamList.filter(item=>{return item.assetcomCode== this.form.assetcomCode})
        let {assetcomName,comRiskCode,assetcomDesc,moneyPerct,moneyPerctMax,moneyPerctMin,bondPerct,
          bondPerctMax,bondPerctMin,stockPerct,stockPerctMax,stockPerctMin,otherPerct,otherPerctMax,otherPerctMin
        } = selected[0]
        this.tacticPercents[0].perct = moneyPerct
        this.tacticPercents[0].perctMax = moneyPerctMax
        this.tacticPercents[0].perctMin = moneyPerctMin
        this.tacticPercents[1].perct = bondPerct
        this.tacticPercents[1].perctMax = bondPerctMax
        this.tacticPercents[1].perctMin = bondPerctMin
        this.tacticPercents[2].perct = stockPerct
        this.tacticPercents[2].perctMax = stockPerctMax
        this.tacticPercents[2].perctMin = stockPerctMin
        this.tacticPercents[3].perct = otherPerct
        this.tacticPercents[3].perctMax = otherPerctMax
        this.tacticPercents[3].perctMin = otherPerctMin
      }
    },
    mounted() {

    },
    created() {
      this.getDict('CUR_CODE,AREA_CODE,IDS_TYPE,PRO_RISK_CODE,BOND_RANK_L,BOND_RANK_S,BOND_TERM,PRODUCT_DEADLINE_TYPE,RISK_CODE,CONTRACT_SERIE')
      this.getAssetParamList() // 获取资产管理策略
      this.getAdmOrgnaiztionInfo() // 获取机构信息
      if (this.$route.query.assetcomCode) {
        this.assetcomCode = this.$route.query.assetcomCode
        this.copyNew = this.$route.query.copyNew
        this.getAssetParam()
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
</style>