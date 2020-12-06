/**
左中右3列排列，一列中文本居上，输入框居下
 */

<template>
  <div>
    <a-row class="form-row" :gutter="16">
      <a-col :xl="xl" :lg="lg" :md="md" :sm="sm">
        <slot name="left"></slot>
      </a-col>
      <a-col :xl="xl" :lg="lg" :md="md" :sm="sm">
        <slot name="center"></slot>
      </a-col>
      <a-col :xl="xl" :lg="lg" :md="md" :sm="sm">
        <slot name="right"></slot>
      </a-col>
    </a-row>
  </div>
</template>
<script>
export default {
  name: 'BiRow',
    components: {
    },
    props: {
    },
    data(){
      return {
        xl: {span: 6, offset: 1},
        lg: {span: 7, offset: 1},
        md: {span: 12},
        sm: "24",
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