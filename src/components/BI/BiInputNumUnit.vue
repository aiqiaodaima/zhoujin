/**
  格式：选择+输入+单位选择 isBefore，isAfter控制前后显示
 */
<template>
  <div>
    <a-input
      v-model="val"
      :disabled='disabledAfter'
      :name="name"
      :placeholder="placeholder" >
      <a-select slot="addonBefore"  style="width: 120px" placeholder="请选择" v-if="isBefore" @change="changeBefore" :value='beforeVal'>
        <a-select-option v-for="(item,index) in beforeOptions" :key="index"  
          :value="item.value">{{item.name}}</a-select-option>
      </a-select>
      <a-select slot="addonAfter" defaultValue="D" style="width: 60px" v-if="isAfter" @change='changeAfter' :disabled='disabledAfter' :value='afterVal'>
          <a-select-option v-for="(item,index) in afterOptions" :key="index"  
          :value="item.value">{{item.name}}</a-select-option>
      </a-select>
    </a-input>
      
  </div>
</template>
<script>
export default {
  name: 'BiInputNumUnit',
    components: {
    },
    computed: {
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
      // 是否需要前缀
      isBefore: {
        type: Boolean,
        default: true
      },
      // 是否需要后缀
      isAfter: {
        type: Boolean,
        default: true
      },
      beforeOptions: {
        type: Array
      },
      afterOptions: {
        type: Array
      },
      // 输入框和后缀不可编辑
      disabledAfter: {
        default: false
      },
      afterVal: {
        default: 'D'
      },
      beforeVal: {

      },
      value: {

      }
    },
    data(){
      return {
      }
    },
    watch:{
    },
    methods:{
      changeBefore(val) {
        this.$emit('changeBefore',val)
      },
      changeAfter(val) {
        this.$emit('changeAfter',val)
      }
    },
    model: {
      prop: 'value',
      event: 'input'
    }
}
</script>