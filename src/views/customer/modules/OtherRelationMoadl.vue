<template>
  <div class="page-header-index-wide">
    <a-row>
        <div>
          <a-tabs :default-active-key="clientType=='all'?'1':clientType" size="small" @change="changePage" :tab-bar-style="{paddingLeft: '0',paddingTop: '0px'}">
            <a-tab-pane loading="true" tab="自然人" key="1" v-if="clientType=='1'||clientType=='all'">
              <a-row>
                <other-natural :optType='optType' ref="otherNatural" :id="id" :ddCode="ddCode" @update='updateList'></other-natural>
              </a-row>
            </a-tab-pane>
            <a-tab-pane tab="机构" key="2" v-if="clientType=='2'||clientType=='all'">
              <a-row>
               <other-mechanism :optType='optType' ref="othermechanism" :id="id" :ddCode="ddCode" @update='updateList'></other-mechanism>
              </a-row>
            </a-tab-pane>
          </a-tabs>
        </div>
    </a-row>
  </div>
</template>

<script>
  import ACol from "ant-design-vue/es/grid/Col"
  import ATooltip from "ant-design-vue/es/tooltip/Tooltip"
  import OtherNatural from "./OtherNatural"
  import OtherMechanism from "./OtherMechanism"
  export default {
    name: "OtherRelationMoadl",
    components: {
      ATooltip,
      OtherMechanism,
      OtherNatural,
      ACol,
    },
    props: {
      ddCode:{
        default: ''
      },
      clientType:{
        default:'all'
      },
      optType:{
        defailt:'add'
      },
      id:{
        id:''
      }
    },
    data() {
      return {
        center: null,
        activePage:'1'
      }
    },
    created() {
      if(this.clientType!='all'){
        this.activePage=this.clientType
      }
    },
    methods: {
      handleSubmit(){
        this.activePage=='1'?this.$refs.otherNatural.handleSubmit():this.$refs.othermechanism.handleSubmit()
      },
      updateList(){
        this.$emit('update')
      },
      changePage(key) {
        this.activePage = key
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>