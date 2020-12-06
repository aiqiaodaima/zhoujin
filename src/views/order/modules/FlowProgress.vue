/**
  订单流程进度
 */
<template>
  <a-card :bordered="false" title="流程进度" style="margin-top: 12px" >
    <a-steps type="navigation" size="small" :current="current" class="steps">
      <a-step :status="current > i ? 'finish' : current < i ? 'wait': 'process'" :title="step.name" v-for="(step,i) in steps" :key="i" ></a-step>
    </a-steps>
  </a-card>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  name: "FlowProgress",
  data(){
    return {
    }
  },
  computed: {
    ...mapState("order", [
      "status","current"
    ]),
    current: function(){
      const current = this.steps.filter(item=>{
        if( item.status.indexOf(this.status) !== -1 ){
          return item
        }   
      })[0]
      if(current){
        this.SET_current(+current.id)
        return (+current.id)
      }
    }
  },
  components: {
   
  },
  props: {
   steps: {
     default(){
       return  [
        {
         id: '0',
         name: '请填写申请单',
         status:['80']
        },
        {
         id: '1',
         name: '申请审核中',
         status:['0','101']
        },
        {
         id: '2',
         name: '核对流水确认划款',
         status:['10']
        },
        {
         id: '3',
         name: '确认交易份额',
         status:['20']
        },
        {
         id: '4',
         name: '交易完成',
         status:['15','20','25','60','50','55']
        }
      ]
     }
   }
  },
  methods: {
    ...mapMutations("order",["SET_current"]),
  },
}
</script>
<style lang="less" scoped>
 
</style>