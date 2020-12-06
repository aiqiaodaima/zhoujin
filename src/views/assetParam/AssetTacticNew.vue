<template>
  <a-form-model ref="assetForm" :model="form" :rules="rules">
    <a-card class="card" title="策略基本资料" :bordered="false"> 
      <a-row>
        <BiCol>
          <BiFormItemInput label="策略名称" name="assetcomName" placeholder="请输入策略名称" v-model="form.assetcomName"/>
        </BiCol>
        <BiCol>
          <BiFormItemSelect :options="dicts.RISK_CODE" label="策略风险等级" name="comRiskCode" v-model="form.comRiskCode"/>
        </BiCol>
        <BiCol>
          <BiFormItemTextarea label="资产相关产品说明" name="assetcomDesc" v-model="form.assetcomDesc" placeholder="请输入资产相关产品说明"/>
        </BiCol>
      </a-row> 
      
    </a-card>
    <a-card class="card" title="资产管理策略比例-资产类别" :bordered="false">
      <a-table
        :columns="columns"
        :dataSource="tacticPercents"
        :pagination="false"
        rowKey="assetcatName"
      >
        <template v-for="(col, i) in ['perct', 'perctMin', 'perctMax',]" :slot="col" slot-scope="text, record, index">
          <!-- <a-input
            :key="col"
            style="margin: -5px 0"
            :value="text"
            :placeholder="columns[i+1].title"
            @change="e => handleChange(e.target.value,col,index)"
          /> -->
          <a-input-number  :key="col" :value="text"  :min="0" :max="100" :precision="2" :placeholder="columns[i+1].title" @change="e => handleChange(e,col,index)"
          />
        </template>
        <template slot="footer">
          <p>
            <span>配置比重合计:</span> <span style="margin-left:50px;font-size:16px">{{perctSum}}%</span>
          </p>
        </template>
      </a-table>
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
import { addAssetParam, getAssetParam } from '@/api/BiApi'
import dictMixin from '@mixins/dictMixin'
  export default {
    name: 'AssetTacticNew',
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
        ],
        rules: {
          assetcomName: [
            { required: true, message: '请输入策略名称', trigger: 'blur' },
          ],
          comRiskCode: [
            { required: true, message: '请选择策略风险等级', trigger: 'change' },
          ],
          assetcomDesc: [
            { required: true, message: '请输入资产相关产品说明', trigger: 'blur' },
          ],
        },
        // table
        columns: [
          {
            title: '资产类别',
            key: 'index',
            dataIndex: 'assetcatName',
            width: 10,
          },
          {
            title: '配置比重%',
            dataIndex: 'perct',
            key: 'perct',
            width: 20,
            scopedSlots: { customRender: 'perct' }
          },
          {
            title: '警示下限%',
            dataIndex: 'perctMin',
            key: 'perctMin',
            width: 20,
            scopedSlots: { customRender: 'perctMin' }
          },
          {
            title: '警示上限%',
            dataIndex: 'perctMax',
            key: 'perctMax',
            width: 20,
            scopedSlots: { customRender: 'perctMax' }
          },
        ],
        perctSum: 0,
        // 复制新增
        copyNew: false, 
      }
    },
    methods: {
      back () {
        this.$router.push({ name:'assetTacticList' })
        this.closeCurrent()
      },
      onSubmit () {
        let res = ''
        let param = {
          moneyPerct: this.tacticPercents[0].perct || 0,
          moneyPerctMax: this.tacticPercents[0].perctMax || 0,
          moneyPerctMin: this.tacticPercents[0].perctMin || 0,
          bondPerct: this.tacticPercents[1].perct || 0,
          bondPerctMax: this.tacticPercents[1].perctMax || 0,
          bondPerctMin: this.tacticPercents[1].perctMin || 0,
          stockPerct: this.tacticPercents[2].perct || 0,
          stockPerctMax: this.tacticPercents[2].perctMax || 0,
          stockPerctMin: this.tacticPercents[2].perctMin || 0,
          otherPerct: this.tacticPercents[3].perct || 0,
          otherPerctMax: this.tacticPercents[3].perctMax || 0,
          otherPerctMin: this.tacticPercents[3].perctMin || 0,
          assetcomCode: '',
          ComType: '',
          ...this.form
        }
        if( this.perctSum > 100 ) {
          this.$message.warning('配置比重合计不能超过100%')
          return 
        }
        if( this.perctSum < 100 ) {
          this.$message.warning('配置比重合计不能小于100%')
          return 
        }
        if( (+this.tacticPercents[0].perctMin) > (+this.tacticPercents[0].perctMax) || 
          (+this.tacticPercents[1].perctMin) > (+this.tacticPercents[1].perctMax) || 
          (+this.tacticPercents[2].perctMin) > (+this.tacticPercents[2].perctMax) ||
          (+this.tacticPercents[3].perctMin) > (+this.tacticPercents[3].perctMax) 
        ) {
          this.$message.warning('警示下限不能大于警示上限')
          return 
        }
        if( (+this.tacticPercents[0].perct) > (+this.tacticPercents[0].perctMax) || 
          (+this.tacticPercents[1].perct) > (+this.tacticPercents[1].perctMax) || 
          (+this.tacticPercents[2].perct) > (+this.tacticPercents[2].perctMax) ||
          (+this.tacticPercents[3].perct) > (+this.tacticPercents[3].perctMax) 
        ) {
          this.$message.warning('配置比重不能大于警示上限')
          return 
        }
        if( (+this.tacticPercents[0].perctMin) > (+this.tacticPercents[0].perct) || 
          (+this.tacticPercents[1].perctMin) > (+this.tacticPercents[1].perct) || 
          (+this.tacticPercents[2].perctMin) > (+this.tacticPercents[2].perct) ||
          (+this.tacticPercents[3].perctMin) > (+this.tacticPercents[3].perct) 
        ) {
          this.$message.warning('配置比重不能小于警示下限')
          return 
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
          // if( (+target.perctMin) > (+target.perctMax) ) {
          //   this.$message.warning('警示下限不能大于警示上限')
          //   return 
          // }
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
          this.tacticPercents[0].perct = moneyPerct || 0
          this.tacticPercents[0].perctMax = moneyPerctMax || 0
          this.tacticPercents[0].perctMin = moneyPerctMin || 0
          this.tacticPercents[1].perct = bondPerct || 0
          this.tacticPercents[1].perctMax = bondPerctMax || 0
          this.tacticPercents[1].perctMin = bondPerctMin || 0
          this.tacticPercents[2].perct = stockPerct || 0
          this.tacticPercents[2].perctMax = stockPerctMax || 0
          this.tacticPercents[2].perctMin = stockPerctMin || 0
          this.tacticPercents[3].perct = otherPerct || 0
          this.tacticPercents[3].perctMax = otherPerctMax || 0
          this.tacticPercents[3].perctMin = otherPerctMin || 0
          this.perctSum = moneyPerct + bondPerct + stockPerct + otherPerct
        }
      },
    },
    mounted() {

    },
    created() {
      this.getDict('RISK_CODE')
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
    margin-bottom: 24px;
  }
  .desc{
    line-height: 1
  }
</style>