/**下拉框组件
  name: 表单验证的prop
  allowClear允许清楚
  showSearch 单选模式下能够搜索
  mode 模式：默认单选，可选multiple和tags模式
  focus： 聚焦事件
  isForm: 是否表单元素，正常组件,默认表单组件
  customKey: 自定义key值，默认value
  customVal: 自定义选项的值,默认name
  customStyle: 自定义样式
 */
<template>
  <div>
    <a-form-model-item :label="label" :prop="name" :ref="name" :rules="rules" v-if="isForm">
      <a-select v-if="decorator" :getPopupContainer="node => node.parentNode" 
        :placeholder="placeholder" :allowClear="allowClear" :showSearch="showSearch" :mode="mode" v-decorator="decorator"
        @focus="focus" @deselect="deselect" @select="select" :disabled="disabled" option-filter-prop="children" :filter-option="filterOption" @change="change">
        <a-select-option v-for="(item,index) in options" :key="index" :value="item[customKey]">{{item[customVal]}}</a-select-option>
      </a-select>
      <a-select v-else :placeholder="placeholder" :allowClear="allowClear" :showSearch="showSearch" :mode="mode" v-model="val" :getPopupContainer="node => node.parentNode"
                @focus="focus" @deselect="deselect" @select="select" :disabled="disabled" option-filter-prop="children" :filter-option="filterOption">
        <a-select-option v-for="(item,index) in options" :key="index" :value="item[customKey]">{{item[customVal]}}</a-select-option>
      </a-select>
    </a-form-model-item>
    
    <a-select v-else-if="decorator" style="width:150px" :placeholder="placeholder" :allowClear="allowClear" :getPopupContainer="node => node.parentNode"
              :showSearch="showSearch" @change="change" :mode="mode" v-decorator="decorator" @focus="focus" :disabled="disabled"
              @deselect="deselect" @select="select"
              option-filter-prop="children" :filter-option="filterOption">

        <a-select-option v-for="(item,index) in options" :key="index" :value="item[customKey]">{{item[customVal]}}</a-select-option>
    </a-select>
    <a-select v-else :style="customStyle" :getPopupContainer="node => node.parentNode"
              :placeholder="placeholder" :allowClear="allowClear" :showSearch="showSearch" :mode="mode"
              v-model="val" @focus="focus" @deselect="deselect" @select="select" :disabled="disabled" option-filter-prop="children" :filter-option="filterOption">
      <a-select-option v-for="(item,index) in options" :key="index" :value="item[customKey]">{{item[customVal]}}</a-select-option>
    </a-select>
  </div>
</template>
<script>
export default {
  name: 'BiFormItemSelect',
    components: {
    },
    computed: {
      val: {
        get: function(){
          return this.value
        },
        set: function(newVal){
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
      required: {
        type: Boolean,
        default: false
      },
      options:{
        // type: Array,
        required: true
      },
      placeholder: {
        type: String,
        default: '请选择'
      },
      decorator: {
        type: Array,
      },
      // form-model v-model时候
      value:{

      },
      rules:{

      },
      name: {
        type: String,
        default: 'name'
      },
      allowClear: {
        default: true
      },
      showSearch: {
        default: false
      },
      mode: {
        default: 'default'
      },
      isForm: {
        default: true
      },
      customKey: {
        default: 'value'
      },
      customVal: {
        default: 'name'
      },
      disabled:{
        default: false
      },
      customStyle:{
        default: 'width:150px'
      }
    },
    data(){
      return {
      }
    },
    watch:{
    },
    methods:{
      focus(e) {
        this.$emit('focus',e)
      },
      select(e) {
        this.$emit('select',e)
      },
      deselect(e) {
        this.$emit('deselect',e)
      },
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text.indexOf(input) >= 0
        );
      },
      change(newVal){
        this.$emit('input', newVal);
        this.$emit('change', newVal);
      }
    },
    model: {
      prop: 'value',
      event: 'change'
    }
}
</script>