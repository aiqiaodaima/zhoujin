<template>
  <div>
    <a-select showSearch :showArrow="false" :value="value" :filterOption="false" @search="fetchBank" @change="handleChange" :notFoundContent="fetching ? undefined : null">
      <a-spin v-if="fetching" slot="notFoundContent" size="small"></a-spin>
      <a-select-option v-for="d in data" :key="d.bankId">{{d.bankName}}</a-select-option>
    </a-select>
  </div>
</template>

<script>
  import { getAction } from '@/api/manage'
  export default {
    name: 'BiBanks',
    components: {
      //components here
    },
    data() {
      return {
        data: [],
        value: [],
        fetching: false
      }
    },
    created() {
      //created here
    },
    mounted() {

    },
    methods: {
      fetchBank(val){
        let that = this;
        if(val){
          getAction('/common/cusBankNew/listAll?key='+val).then((res) => {
            console.dir(res);
            if (res.success) {

            }
          }).catch(error => {
            console.log("系统获取开户行数据异常",error);//这行打印permissionName is undefined
          });
        }
      },
      handleChange(){

      }
    }
  }
</script>

<style scoped>
  @import '~@assets/less/common.less'
</style>