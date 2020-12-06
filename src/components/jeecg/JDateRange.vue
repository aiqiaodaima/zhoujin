<template>
  <a-range-picker :ranges="{'今天': [moment(), moment()], '月底': [moment(), moment().endOf('month')],'长期': [1===temp?moment():currentDate, langeDate]}" v-model="momVal" @change="handleDateChange" @calendarChange="calendarChange"></a-range-picker>
</template>
<script>
  import moment from 'moment'
  export default {
    name: 'JDateRange',
    props: {
      placeholder:{
        type: String,
        default: '',
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
      //此属性可以被废弃了
      triggerChange:{
        type: Boolean,
        required: false,
        default: false
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
      currentDate: {
        type: Object,
        required: false
      }
    },
    data () {
      return {
        decorator:"",
        momVal:[],
        langeDate: moment("21991231", "YYYYMMDD"),
        temp: 1
      }
    },
    watch: {
      /*value (val) {
        if(!val){
          this.momVal = [];
        }else{
          this.momVal = [];
          val.forEach((v)=>{
            this.momVal.push(moment(v,this.dateFormat));
          });
        }
      }*/

      value: {
        handler(val, oldVal) {
          if(!val ||(val[0]=='' && val[1]=='')){
            this.momVal = [];
          }else{
            this.momVal = [];
            val.forEach((v)=>{
              this.momVal.push(moment(v,this.dateFormat));
            });
          }
        },
        deep: true, // 默认立即触发一次
        immediate: true
      },
    },
    methods: {
      moment,
      handleDateChange(mom, dateStr){
        this.$emit('change', dateStr);
      },
      calendarChange(mom, dateStr){
        this.temp = 2
        let date = Array.isArray(mom)  ? mom[0] : mom
        this.$emit('calendarChange', moment(new Date(date._d).valueOf()))
      }
    },
   
    model: {
      prop: 'value',
      event: 'change'
    }
  }
</script>