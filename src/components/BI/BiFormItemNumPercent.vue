/** 表单数字输入框*/

<template>
  <div class="num-input-width">
    <a-form-model-item :label="label" :prop="name" :ref="name" :rules="rules">
     <a-input-number v-if="decorator" v-decorator="decorator" :min="min" :max="max" :precision="precision" :placeholder="placeholder" :disabled="disabled" @change="change"/>
      <a-input-number v-else v-model="val" :min="min" :max="max" :precision="precision" :placeholder="placeholder" :disabled="disabled"/>
<!--   
      <a-tooltip  :trigger="['focus','hover']" placement="topLeft" overlay-class-name="numeric-input">
      <span v-if="showtip!==''" slot="title" class="numeric-input-title">
        {{showtip}}
      </span>
        <template v-else slot="title">
          请输入数字
        </template>
        <a-input-number  @change="change"   v-if="decorator" v-decorator="decorator"    :parser="value => value.replace(/\$\s?|(,*)/g, '')" :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :min="min" :max="max" :precision="precision" :placeholder="placeholder" :disabled="disabled"/>
        <a-input-number v-else v-model="val"   @change="change" :min="min" :max="max" :precision="precision" :placeholder="placeholder" :disabled="disabled" />
      </a-tooltip> --> 



    </a-form-model-item>
  </div>
</template>
<script>
 import { capitalAmount } from '@utils/util'
 export default {
  name: 'BiFormItemNumPercent',
    components: {
    },
    props: {
      label: {
        type: String,
        default: '名字'
      },
      name: {
        type: String,
        default: 'name'
      },
      placeholder: {
        type: String,
        default: '请输入数字'
      },
      // 装饰的
      decorator: {
        type: Array,
      },
      min: {
        default: 0
      },
      max: {
        // default: 100
      },
      precision: {
        default: 2
      },
      // form-model 校验时候的属性
      value:{

      },
      disabled:{
        default: false
      },
      rules:{

      }


    },
    computed:{
      val: {
        get: function(){
          return this.value
        },
        set: function(newVal){
          // this.$emit(event, ${[…args]})
          this.$emit('input', newVal);
          this.$emit('change', newVal);
        }
      }
    },
    data(){
      return {
        showtip:'',
      }
    },
    watch:{
    },
    methods:{
      capitalAmount,
      // 新添加的事件
      change(e){
        this.$emit('change', e);
        //新增
          // this.showtip=capitalAmount(e)
          // console.log("ceshi-------"+this.showtip)
      }
    },
    model: {
      prop: 'value',
      event: 'input'
    }
}
</script>
<style lang="stylus" scoped>
  .num-input-width .ant-input-number{
    width: 100%
  }

  .numeric-input .ant-tooltip-inner {
    min-width: 32px;
    min-height: 37px;
  }

  .numeric-input .numeric-input-title {
    font-size: 14px;
  }
</style>