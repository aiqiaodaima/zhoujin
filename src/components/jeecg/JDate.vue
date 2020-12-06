<template>
  <a-date-picker
    :disabled="disabled || readOnly"
    :placeholder="placeholder"
    @change="handleDateChange"
    :value="momVal"
    :showTime="showTime"
    :format="dateFormat"
    :showToday="false"
    @openChange="handleOpenChange"
    :open="isOpen"
    :getCalendarContainer="getCalendarContainer"
  >
    <template slot="renderExtraFooter">
      <div style="width: 100%; text-align: center;">
        <a-button type="link" @click="selectToday" v-if="showbtn">今天</a-button>
        <a-button type="link" @click="selectLongTerm" v-if="showLongTerm">长期</a-button>
      </div>
    </template>
  </a-date-picker>
</template>
<script>
  import moment from 'moment'
  export default {
    name: 'JDate',
    props: {
      placeholder:{
        type: String,
        default: '',
        required: false
      },
      value:{
        type: String,
        required: false
      },
      showbtn:{
        type: Boolean,
        required: false,
        default: true
      },
      showLongTerm:{
        type: Boolean,
        required: false,
        default: true
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
      }
    },
    data () {
      let dateStr = this.value;
      return {
        decorator:"",
        momVal:!dateStr?null:moment(dateStr,this.dateFormat),
        isOpen:false
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
        this.isOpen = false;
      },
      selectToday(){
        this.momVal = moment();
        this.$emit('change', this.momVal.format('YYYY-MM-DD'));
        this.isOpen = false;
      },
      selectLongTerm(){
        this.momVal = moment("21991231", "YYYYMMDD");
        this.$emit('change', this.momVal.format('YYYY-MM-DD'));
        this.isOpen = false;
      },
      handleOpenChange(status){
        this.isOpen = status;
      }
    },
    //2.2新增 在组件内定义 指定父组件调用时候的传值属性和事件类型 
    model: {
      prop: 'value',
      event: 'change'
    }
  }
</script>
