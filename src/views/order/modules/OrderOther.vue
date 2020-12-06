/**
  订单其他
 */
<template>
  <a-card size="small" style="margin-top: 12px;" :bordered="false" title="其他">
    <a-row>
      <BiCol>
        <BiUpload v-model="files" :disabled="disabled"></BiUpload>
      </BiCol>
    </a-row>
    <br/>
    <!-- <a-form-model-item label="备注" :labelCol="{span: 1}" :wrapperCol="{span: 21}">
      <a-textarea class="no-resize" placeholder="请输入备注" allowClear :rows="4"></a-textarea>
    </a-form-model-item> -->
    <!-- <a-form-model-item :wrapperCol="{span: 21}">
      <a-button> 流动性试算 </a-button>
      <a-button style="margin-left: 20px;"> 投资策略检核 </a-button>
    </a-form-model-item> -->
  </a-card>
</template>
<script>
import biUploadMixin from '@mixins/biUploadMixin'
export default {
  name: "OrderOther",
  mixins: [biUploadMixin],
  data() {
    return {
      //  fileList:[],
    }
  },
  components: {
  
  },
  props: {
    disabled:{
      type:Boolean,
      required:false,
      default: false
    },
  },
  methods: {
   
  },
  provide () {
  }
}
</script>
<style lang="stylus" scoped>

</style>