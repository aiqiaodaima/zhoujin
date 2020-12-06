/**
   区间输入框，minVal较小值 maxVal较大值 changeMin改变小值 changeMin改变大值
 */
<template>
  <div>
    <a-form-model-item :label="label" :prop="name" :ref="name">
      <a-input-group >
        <a-input style="width: 40%;text-align: center" placeholder="较小值" :value="minVal" @change='changeMin'/>
        <a-input
          style=" width: 30px; border-left: 0; pointer-events: none; backgroundColor: #fff"
          placeholder="~"
          disabled
        />
        <a-input style="width: 40%;text-align: center; border-left: 0" placeholder="较大值" :value="maxVal" @change='changeMax'/>
      </a-input-group>
    </a-form-model-item>
  </div>
</template>
<script>
export default {
  name: 'BiInputRange',
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
        default: '请输入'
      },
      // form-model 校验时候的属性
      // prop: {
      //   type: String,
      //   default: 'name'
      // },
      value:{

      },
      maxVal: {

      },
      minVal: {

      },
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
          this.$emit('changeMIn', newVal);
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
      changeMin(e) {
        this.$emit('changeMin', e.target.value);
      },
      changeMax(e) {
        this.$emit('changeMax', e.target.value);
      },
    },
    model: {
      prop: 'value',
      event: 'input'
    }
}
</script>