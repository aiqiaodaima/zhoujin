/**
新增和详情的注释模块
comments:传人的p标签数组，展示内容
 */
<template>
  <div class="comments">
    <p>注释：</p>
    <p v-for="(comment,i) in comments" :key='i'>{{comment}}</p>
  </div>
</template>
<script>
export default {
  name: 'BiComments',
    components: {
    },
    props: {
      comments:{

      }
    },
    data(){
      return {
       
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
<style lang="stylus" scoped>
  .comments{
    font-size: 12px;
    line-height: 1.6;
    background: #FAFAFA;
    border-radius: 4px;
    padding: 10px 16px;
    margin-top: 10px;
    p{
      margin-bottom: 0
    }
  }
</style>