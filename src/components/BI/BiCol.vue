/**
自适应列
 */
<template>
  <div>
    <a-col :xl="xl" :lg="lg" :md="md" :sm="sm">
      <slot></slot>
    </a-col>
  </div>
</template>
<script>
export default {
  name: 'BiCol',
    components: {
    },
    props: {
       xl: {
         default: function() {return { span: 6, offset: 1}},
       },
       lg: {
         default: function() {return { span: 7, offset: 1}},
       },
       md: {
         default: function() {return { span: 10, offset: 1}},
       },
       sm: {
         default: "24"
       }
    },
    data(){
      return {
        // xl: {span: 6, offset: 1},
        // lg: {span: 7, offset: 1},
        // md: {span: 10, offset: 1},
        // sm: "24",
      }
    },
    watch:{
    },
    methods:{
      
    },
    model: {
      
    }
}
</script>