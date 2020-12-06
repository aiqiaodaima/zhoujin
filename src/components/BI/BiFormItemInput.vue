/**

 */
<template>
  <div>
    <a-form-model-item :label="label" :prop="name" :ref="name" :rules="rules">
      <a-input v-if="decorator" v-decorator="decorator" :placeholder="placeholder" :disabled="disabled" @pressEnter="enterKeyPress" @blur="blur" @click="click"/>
      <a-input v-else v-model="val" :placeholder="placeholder" @pressEnter="enterKeyPress"
      :disabled="disabled" @blur="blur($event)"  @click="click"/>
    </a-form-model-item>
  </div>
</template>
<script>
export default {
  name: 'BiFormItemInput',
    components: {
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
      // form-model 校验时候的属性
      // prop: {
      //   type: String,
      //   default: 'name'
      // },
      value:{

      },
      rules:{},
      disabled: {
        default: false
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
      // pressKey
      enterKeyPress(e) {
        this.$emit('pressEnter', e);
      },
      click(e) {
        this.$emit('click', e);
      },
      blur(event) {
        this.$emit('initbirthDt', event);
      }
    },
    model: {
      prop: 'value',
      event: 'input'
    }
}
</script>