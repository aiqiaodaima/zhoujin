/** 表单文本输入框*/

<template>
  <div>
    <!-- form表单形式,需要decorator封装 -->
    <a-form-item :label="label" v-if='decorator'>
      <a-textarea v-decorator="decorator" :rows="rows" :read-only="readonly" :disabled="disabled" :placeholder="placeholder" />
    </a-form-item>
    <!-- form-model表单形式，直接可以用v-model -->
    <a-form-model-item :label="label" :prop="name" :ref="name" :rules="rules" v-else>
      <a-textarea v-model="val" :rows="rows" :read-only="readonly" :disabled="disabled" :placeholder="placeholder" />
    </a-form-model-item>
  </div>
</template>
<script>
export default {
  name: 'BiFormItemTextarea',
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
        default: '请输入文本'
      },
      readonly:{
        type:Boolean,
        default: false
      },

      disabled:{
        type:Boolean,
        default: false
      },
      // 装饰的
      decorator: {
        type: Array,
      },
      rows: {
        default: '4'
      },
      rules:{

      },
      
      // form-model 校验时候的属性
      
      value:{

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
      }
    },
    watch:{
    },
    methods:{
      
    },
    model: {
      prop: 'value',
      event: 'input'
    }
}
</script>