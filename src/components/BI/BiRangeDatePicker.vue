/** 
  基于form-model表单日期区间选择器，value为[moment,moment]格式，
  dateStart开始日期，dateEnd结束日期
*/

<template>
  <a-form-model-item :label="label" :prop="name" :ref="name">
    <a-range-picker  v-if="decorator" v-decorator="decorator"
      :disabled="disabled || readOnly"
      @change="handleDateChange"
      @calendarChange="calendarChange"
      :showTime="showTime"
      :format="dateFormat"
      :getCalendarContainer="getCalendarContainer"
      :style="customStyle"
      :ranges="{'今天': [moment(), moment()], '月底': [moment(), moment().endOf('month')],'长期': [currentDate || moment(), langeDate]}"
    />
     <a-range-picker  v-else
      :disabled="disabled || readOnly"
      @change="handleDateChange"
      @calendarChange="calendarChange"
      :value="momVal"
      :showTime="showTime"
      :format="dateFormat"
      :getCalendarContainer="getCalendarContainer"
      :style="customStyle"
      :ranges="{'今天': [moment(), moment()], '月底': [moment(), moment().endOf('month')],'长期': [currentDate || moment(), langeDate]}"
    />
  </a-form-model-item>
</template>
<script>
  import moment from 'moment'
  export default {
    name: 'BiRangeDatePicker',
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
        type: Array,
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
      },
      // currentDate: {
      //   type: Object,
      //   required: false
      // },
      dateStart: {

      },
      dateEnd: {

      },
       decorator: {
        type: Array,
        default: ()=>{}
      },

    },
    data () {
      let dateStr = this.value;
      return {
        momVal:!dateStr?null:[moment(dateStr[0],this.dateFormat),moment(dateStr[1],this.dateFormat)],
        langeDate: moment("21991231", this.dateFormat),
        currentDate: null
      }
    },
    watch: {
      value (val) {
        if(!val || !val[0]){
          this.momVal = null
        } else {
          this.momVal = [moment(val[0],this.dateFormat),moment(val[1],this.dateFormat)]
        }
      },
      dateStart (val) {
        if( !val ){
          this.momVal = null
        } else {
          this.momVal = [moment(val,this.dateFormat),moment(this.dateEnd,this.dateFormat)]
        }
      },
      dateEnd (val) {
        if( !val ){
          this.momVal = null
        } else {
          this.momVal = [moment(this.dateStart,this.dateFormat),moment(val,this.dateFormat)]
        }
      }
    },
    methods: {
      moment,
      handleDateChange(dates,dateStrings){
        console.log('handleDateChange',dateStrings)
        this.$emit('change', dateStrings);
      },
      calendarChange(mom, dateStr){
        let date = Array.isArray(mom)  ? mom[0] : mom
        this.currentDate =  moment(new Date(date._d).valueOf())
        // this.$emit('calendarChange', moment(new Date(date._d).valueOf()))
      }
    },
    model: {
      prop: 'value',
      event: 'change'
    }
  }
</script>
