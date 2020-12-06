<template>
  <a-form-model ref="BonusForm" :model="form" >
    <a-row>
      <bi-col>
        <BiFormItemInput label="资产名称" v-model="form.proName"/>
      </bi-col>
      <bi-col>
        <BiFormItemSelect v-model="form.intDayType"
          label="付息频率" :options="pays" />
      </bi-col>
      <bi-col>
        <BiFormItemSelect v-model="form.dividendType"
          label="分红方式" :options="bonus" />
      </bi-col>
      <bi-col>
        <BiFormItemSelect v-model="form.annDays"
          label="计息基数" :options="paybases" />
      </bi-col>
      <bi-col>
        <BiFormItemSelect v-model="form.enddayCalType"
          label="头尾处理" :options="paybases" />
      </bi-col>
      <bi-col>
        <BiFormItemSelect v-model="form.intDayType"
          label="分红日" :options="bonus" />
      </bi-col>
      <bi-col>
        <BiFormItemDatePicker label="开始日" name="intStartRule" v-model="form.intStartRule"/>
      </bi-col>
      <bi-col>
        <BiFormItemDatePicker label="结束日" name="intEndRule" v-model="form.intEndRule"/>
      </bi-col>
      <bi-col>
        <BiFormItemSelect v-model="form.calendarType"
          label="参考日历" :options="bonus" />
      </bi-col>
      <bi-col>
        <BiFormItemSelect v-model="form.holidayAdjustType"
          label="遇节假日调整方式" :options="paybases" />
      </bi-col>
      <bi-col>
        <BiFormItemSelect v-model="form.tailMode"
          label="尾数处理" :options="bonus" />
      </bi-col>
      <bi-col>
        <BiFormItemSelect v-model="form.tailDigitType"
          label="尾数保留位数" :options="bonus" />
      </bi-col>
    </a-row>
    <BiFormItemTextarea label="备注" v-model="form.memo" placeholder="请输入备注"/>
  
    <a-form-item
        :wrapperCol="{ span: 24 }"
        style="text-align: center"
      >
        <a-button type="primary" @click="save">保存</a-button>
        <a-button type="primary" class="btn">保存及查看计划</a-button>
        <a-button type="primary" class="btn">引入其他资产分红规则</a-button>
    </a-form-item>
  </a-form-model>
</template>

<script>
import { BiRow, BiFormItemInput, BiFormItemRadio, BiFormItemSelect, BiInputNumUnit, BiCol,
   BiFormItemDatePicker,BiFormItemTextarea,
} from "@bi"
import mock from './mock'
import { addBonusRule,editBonusRule } from '@/api/BiApi'

export default {
    name: "BonusRuleSet",
    components: { 
      BiRow,BiCol, BiFormItemInput, BiFormItemRadio, BiFormItemSelect, BiInputNumUnit,
      BiFormItemDatePicker,BiFormItemTextarea,
    },
    mixins: [mock],
    props: {
      showSubmit: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        form: {
          proCode: 'ZPoOOfWVB7o65Jga'
        }
      }
    },
    methods: {
      async save () {
        const res = await addBonusRule(this.form)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .btn {
    margin-left: 8px;
  }
</style>