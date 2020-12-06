<template>
  <a-select :placeholder="placeholder" default-value="Y" :disabled="disabled" :value="getValueSting" @change="handleInput"
            :getPopupContainer = "(target) => target.parentNode">
    <a-select-option v-if="needEmptyOption" :value="undefined">请选择</a-select-option>
    <a-select-option v-for="(item, key) in dictOptions" :key="key" :value="item.value">
      <span style="display: inline-block;width: 100%" :title=" item.text || item.label ">
        {{ item.text || item.label }}
      </span>
    </a-select-option>
  </a-select>
</template>

<script>
  import { ajaxGetDictItems } from '@/api/api'
  export default {
    name: 'JDSelectTag',
    props: {
      needEmptyOption:true,
      dictCode: String,
      filters: {type:Array, default:()=>[]},
      chooses: {type:Array, default:()=>[]},
      placeholder: {type:String, default:'请选择'},
      value: [String, Number],
      showHiddenOption: {type:Boolean, default: false},
      disabled: Boolean
    },
    data() {
      return {
        dictOptions: [],
        allOptions:[]
      }
    },
    watch:{
      dictCode:{
        immediate:true,
        handler() {
          this.initDictData()
        }
      },
      filters:{
        immediate:true,
        deep: true,
        handler() {
          this.filterOption();
        }
      },
      chooses:{
        immediate:true,
        deep: true,
        handler() {
          this.choosesOption();
        }
      },
    },
    computed: {
      getValueSting(){
        return this.value ? this.value.toString() : undefined;
      },
    },
    methods: {
      initDictData() {
        //根据字典Code, 初始化字典数组
        let that = this;
        if(that.dictCode){
          ajaxGetDictItems(this.dictCode, null).then((res) => {
            if (res.success) {
              if(!that.showHiddenOption){
                res.result = res.result.filter(item => item.active === "1");
              }
              that.allOptions = res.result;
              that.filterOption();
              that.choosesOption();
            }
          })
        }else{
          that.allOptions = [];
          that.filterOption();
          that.choosesOption();
        }
      },
      filterOption(){
        let that = this;
        that.dictOptions = that.allOptions;
        if(that.filters.length>0){
          that.filters.forEach(filterItem => {
            that.dictOptions = that.dictOptions.filter(item => item[filterItem.fieldName]&&item[filterItem.fieldName].indexOf(filterItem.fieldValue)>=0);
          });
        }
      },
      choosesOption(){
        let that = this;
        that.dictOptions = that.allOptions;
        if(that.chooses.length>0){
          that.chooses.forEach(filterItem => {
            that.dictOptions = that.dictOptions.filter(item => item[filterItem.fieldName]&&(filterItem.fieldValue.indexOf(item[filterItem.fieldName]))>=0);
          });
        }
      },
      handleInput(e) {
        this.$emit('input', e);
        this.$emit('change', e);
      },
      setCurrentDictOptions(dictOptions){
        this.dictOptions = dictOptions
      },
      getCurrentDictOptions(){
        return this.dictOptions
      }
    }
  }
</script>

<style scoped>

</style>