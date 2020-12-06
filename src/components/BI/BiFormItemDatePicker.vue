/** 
  基于form-model表单日期选择器，value为moment格式
*/

<template>
  <a-form-model-item :label="label" :prop="name" :ref="name">
    <a-date-picker
      :disabled="disabled || readOnly"
      :placeholder="placeholder"
      @change="handleDateChange"
      :value="momVal"
      :showTime="showTime"
      :format="dateFormat"
      :getCalendarContainer="getCalendarContainer"
      :style="customStyle"
    />
  </a-form-model-item>
</template>
<script>
  import moment from 'moment'
  export default {
    name: 'BiFormItemDatePiker',
    props: {
      label: {
        type: String,
        default: '日期'
      },
      name: {
        type: String,
        default: 'name'
      },
      customStyle: {
        default: 'width: 100%'
      },
      placeholder:{
        type: String,
        default: '请选择日期',
        required: false
      },
      value:{
        type: String,
        required: false
      },
      dateFormat:{
        type: String,
        default: 'YYYY-MM-DD',
        required: false
      },
      readOnly:{
        type: Boolean,
        required: false,
        default: false
      },
      disabled:{
        type: Boolean,
        required: false,
        default: false
      },
      showTime:{
        type: Boolean,
        required: false,
        default: false
      },
      getCalendarContainer: {
        type: Function,
        default: () => document.body
      }
    },
    data () {
      let dateStr = this.value;
      return {
        decorator:"",
        momVal:!dateStr?null:moment(dateStr,this.dateFormat)
      }
    },
    watch: {
      value (val) {
        if(!val){
          this.momVal = null
        }else{
          this.momVal = moment(val,this.dateFormat)
        }
      }
    },
    methods: {
      moment,
      handleDateChange(mom,dateStr){
        this.$emit('change', dateStr);
      }
    },
    model: {
      prop: 'value',
      event: 'change'
    }
  }
</script>
