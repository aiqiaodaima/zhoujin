<template>
  <div class="page-header-index-wide">
    <a-card>
      <div class="salesCard">
        <a-tabs :default-active-key="tabcar" size="small" :tab-bar-style="{marginBottom: '0px', paddingLeft: '0px',marginTop: '0px'}">
          <a-tab-pane loading="true" tab="自然人" key="NP">
            <a-row>
              <natural-person :partyCode="partyCode" :id="id" :tabcar="tabcar":groupindex="groupindex" :optType="optType" :type='type' v-bind="$attrs" v-on="$listeners" ></natural-person>
            </a-row>
          </a-tab-pane>
          <a-tab-pane tab="机构" key="ME">
            <a-row>
              <mechanism :partyCode="partyCode" :optType="optType" :id="id" :tabcar="tabcar":groupindex="groupindex" :type='type' v-bind="$attrs" v-on="$listeners"></mechanism>
            </a-row>
          </a-tab-pane>
          <a-tab-pane tab="金融产品" key="FP">
            <a-row>
              <financePro :partyCode="partyCode" :optType="optType" :id="id":tabcar="tabcar" :groupindex="groupindex":type='type' v-bind="$attrs" v-on="$listeners"></financePro>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>
  </div>
</template>

<script>
  import NaturalPerson from "./NaturalPerson"
  import Mechanism from "./Mechanism"
  import FinancePro from "./FinancePro"

  export default {
    name: "GdxxModal",
    components: {
      NaturalPerson,Mechanism,FinancePro
    },
    data() {
      return {
        editType:'add',
        center: null,
        partyCode:'',
        clientType:'',
        optType:'add',
        tabcar:'NP',

      }
    },
    created() {
    /*  this.partyCode=this.$route.query.partyCode
      this.clientType=this.$route.query.clientType
      this.editType=this.$route.query.editType
      this.optType=this.$route.query.optType*/
    },
    props: {
      id: {
        default: ''
      },
      groupindex: {
        default: ''
      },
      orgType: {
        default: 'jydsfile'
      },

      // 新增，编辑，查看 edite,view
      type: {
        default: 'add'
      },
      gdgroup:{
        default: function(){
          return []
        }
      },
    },

    methods: {
    },

    mounted() {
    },

    created() {

      if(this.type=='edite') {//修改页选项卡区分是哪个选项卡添加的
        if(this.gdgroup[this.groupindex].dsmc=='ME'){
          this.tabcar='ME'
        }
        if(this.gdgroup[this.groupindex].dsmc=='FP'){
          this.tabcar='FP'
        }

      }


    }


  }
</script>

<style lang="scss" scoped>
  /deep/ .ant-card-body{
    padding: 3px 24px 0 !important;
  }

</style>