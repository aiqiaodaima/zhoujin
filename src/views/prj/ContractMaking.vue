/**
信托合同制作
 */
<template>   
  <a-card size="small" title="信托合同制作" :bordered="false">
    <div class="table-operator">          
      <a-button type="primary" @click="handleEdit()">制作合同</a-button>      
    </div>      
    <div>
      <a-table
        ref="table"
        size="middle"
        rowKey="FILE_NAME" 
        :columns="columns"
        :dataSource="dataSource"
        bordered>
      </a-table>
    </div>
    <div class="table-operator">          
      <a-button type="primary">开始上传</a-button>
    </div> 
  </a-card>
</template>

<script>
  import { filterDictText } from '@/components/dict/JDictSelectUtil'
  import biTableMixin from '@mixins/biTableMixin'
  import { getAction } from '../../api/manage'//请求方式
  // import { result } from 'lodash'



  export default {
    name: 'ContractMaking',
    components: {    
    },
    watch:{
    
    },
    // mixins:[biTableMixin,dictMixin],
    data() {
      return {
        dataSource:[],
        queryParam: {
        prjCode: this.$route.query.prjCode
        },       
        columns:[
          {
            title: '合同名称',
            dataIndex: 'FILE_NAME',
           
            
          },
          {
            title: '大小',
            dataIndex: 'FILE_SIZE',
            
          },
          {
            title: '状态',
            dataIndex: 'REMOVE_YN',
           
          },
          {
            title: '操作',
            dataIndex: '', 
          },
        ],
        url:{
          // list:"/sys/common/findFileInfo",
          // 接口测试mock
          list:'https://www.fastmock.site/mock/16d7c20653b64c6d41a3ab384b9494d0/fts/sys/common/findFileInfo'

        },
      }
    },
    created() {

    },
    mounted() {
      let that = this;
      getAction(this.url.list,this.prjCode).then((res)=>{
        
        that.dataSource = res.result  
        //  console.log(res);    
      })
    },
    methods: {
      handleEdit() {            
        let prjCode = this.$route.query.prjCode
        // console.log(prjCode)
        var BaseUrl = 'http://182.92.165.252:8080/fts-module-front/ReplaceData.html'
        window.open(BaseUrl+"?prjCode="+prjCode);
      }
    },
   
    
  }
</script>

<style lang="stylus" scoped>
  @import '~@assets/less/common.less'
</style>