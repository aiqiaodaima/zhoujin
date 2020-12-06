/**
  输入数字金额，显示中文金额
  name: 表单验证的prop

  isForm: 是否表单元素，默认正常组件

  customStyle: 自定义input样式
 */

<template>
  <div>
    <a-form-model-item v-if='isForm' :label="label" :prop="name" :ref="name" :rules="rules">
      <a-tooltip :trigger="['focus','hover']" placement="topLeft" overlay-class-name="numeric-input">
        <span v-if="val" slot="title" class="numeric-input-title">
          {{ val !== '-' ? capitalAmount(val) : '-' }}
        </span>
        <template v-else slot="title">
          请输入数字
        </template>
        <a-input-number  v-model="val" :min="min" :max="max" :precision="precision" 
        :placeholder="placeholder" :disabled="disabled"
        :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
        :parser="value => value.replace(/\$\s?|(,*)/g, '')"
        :style="customStyle"/>
      </a-tooltip>
    </a-form-model-item>
    <a-tooltip v-else :trigger="['focus','hover']" placement="topLeft" overlay-class-name="numeric-input">
      <span v-if="val" slot="title" class="numeric-input-title">
        {{ val !== '-' ? capitalAmount(val) : '-' }}
      </span>
      <template v-else slot="title">
        请输入数字
      </template>
      <a-input-number  v-model="val" :min="min" :max="max"
      :precision="precision" :placeholder="placeholder"
      :disabled="disabled" :style="customStyle"
      :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
      :parser="value => value.replace(/\$\s?|(,*)/g, '')"
      />
    </a-tooltip>
  </div>

</template>

<script>
import { capitalAmount } from '@utils/util'


  export default {
    name: 'BiInputCapitalAmount',
    data() {
      return {
        // value: '',
      };
    },
    props: {
      label: {
        type: String,
        default: ''
      },
      name: {
        type: String,
        default: 'name'
      },
      placeholder: {
        type: String,
        default: '请输入'
      },
      decorator: {
        type: Array,
        default: ()=>{}
      },
      value:{

      },
      rules:{},
      disabled: {
        default: false
      },
      // 是否表单元素,默认是正常的元素
      isForm: {
        default: false
      },
      customStyle:{
        default: 'width:100%'
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
    methods: {
      capitalAmount,
      onChange(e) {
        const { value } = e.target;
        const reg = /^-?[0-9]*(\.[0-9]*)?$/;
        if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
          this.val = value;
        }
      },
      // '.' at the end or only '-' in the input box.
      onBlur() {
        const { val, onChange } = this;
        let valueTemp = val;
        if (val.charAt(val.length - 1) === '.' || val === '-') {
          onChange({ value: val.slice(0, -1) });
        }
      },
    },
    model: {
      prop: 'value',
      event: 'input'
    }
  };
</script>
<style scoped>
/* to prevent the arrow overflow the popup container,
or the height is not enough when content is empty */
.numeric-input .ant-tooltip-inner {
  min-width: 32px;
  min-height: 37px;
}

.numeric-input .numeric-input-title {
  font-size: 14px;
}
</style>