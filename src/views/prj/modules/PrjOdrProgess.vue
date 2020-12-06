/**
订单流程进度
*/
<template>
  <a-card :bordered="false" title="流程进度" style="margin-top: 12px">
    <a-steps type="navigation" size="small" :current="current" >
      <a-step :status="current > i ? 'finish' : current < i ? 'wait': 'process'" :title="step.name" v-for="(step,i) in steps" :key="i" ></a-step>
    </a-steps>
  </a-card>
</template>
<script>
  import { mapState, mapMutations } from "vuex";
  const steps = [
    {
      id: '0',
      name: '委托资产录入',
      status:['80','5']
    },
    {
      id: '1',
      name: '委托审核',
      status:['0']
    },
    {
      id: '2',
      name: '委托资产交付',
      status:['75']
    },
    {
      id: '3',
      name: '信托份额确认',
      status:['20']
    },
    {
      id: '4',
      name: '交易完成',
      status:['15','25','50','55']
    }
  ]

  export default {
    name: "FlowProgress",
    data(){
      return {
      }
    },
    computed: {
      ...mapState("project", [
        "status"
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
              name: '委托资产录入',
              status:['80','5']
            },
            {
              id: '1',
              name: '委托审核',
              status:['0']
            },
            {
              id: '2',
              name: '委托资产交付',
              status:['75']
            },
            {
              id: '3',
              name: '信托份额确认',
              status:['20']
            },
            {
              id: '4',
              name: '交易完成',
              status:['15','25','50','55']
            }
          ]
        }
      }
    },
    methods: {
      ...mapMutations("project",["SET_current"]),
    },
  }
</script>
<style lang="stylus" scoped>

</style>
