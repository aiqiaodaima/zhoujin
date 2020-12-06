<template>
  <div>
<!--    <a-layout>-->
<!--      <a-layout-header class="header" :style="{backgroundColor:'rgba(242,242,242,.08)',border: 0}">-->
<!--        家族信托-->
<!--      </a-layout-header>-->
      <a-layout>
        <a-layout-sider theme="light" :style="{width: '200px'}">
          <a-menu ref="iMenu" :defaultSelectedKeys="['/prj/setup/element']" mode="inline" @select="menuSelected">
            <template v-for="item in menuList">
              <a-menu-item :data-comp="item.component" v-if="!item.children" :key="item.key">
                <span :data-comp="item.component">{{item.title}}</span>
              </a-menu-item>
              <sub-menu v-else :menu-info="item" :key="item.key" />
            </template>
          </a-menu>
        </a-layout-sider>
        <a-layout :style="{padding: '0 0 0 5px', overflow: 'initial'}">
          <a-layout-content :style="contentStyle" >
            <component :is="comp" @updateState="refreshPage" :comParam="comParam"></component>
          </a-layout-content>
        </a-layout>
      </a-layout>
<!--    </a-layout>-->
  </div>
</template>

<script>
  import { Menu } from 'ant-design-vue';
  import RouteView from '../../components/layouts/RouteView'
  import IframePageContent from '../../components/layouts/IframePageView'
  import { getPermissionList, getPermissionListByToken } from '@/api/api'
  import Vue from 'vue'
  import { ACCESS_TOKEN } from "@/store/mutation-types"

  const SubMenu = {
    template: `
      <a-sub-menu :key="menuInfo.key" v-bind="$props" v-on="$listeners">
        <span slot="title">
          <span :data-comp="menuInfo.component">{{ menuInfo.title }}</span>
        </span>
        <template v-for="item in menuInfo.children">
          <a-menu-item v-if="!item.children" :key="item.key" :data-comp="item.component">
            <span :data-comp="item.component">{{ item.title }}</span>
          </a-menu-item>
          <sub-menu v-else :key="item.key" :menu-info="item" />
        </template>
      </a-sub-menu>
    `,
    name: 'SubMenu',
    // must add isSubMenu: true
    isSubMenu: true,
    props: {
      ...Menu.SubMenu.props,
      // Cannot overlap with properties within Menu.SubMenu.props
      menuInfo: {
        type: Object,
        default: () => ({})
      }
    },
  };
  export default {
    name: 'ProjectSetUp',
    inject: [ "remove" ],
    components: {
      IframePageContent,
      RouteView,
      'sub-menu': SubMenu
    },
    computed: {
      contentStyle() {
        let x = { background: '#fff', padding: 0, margin: 0, minHeight: '280px'};
        x.maxWidth=(document.body.clientWidth-425)+'px';
        return x;
      },
      initParam(){
        return this.$route.query.prjCode+","+this.$route.query.optType;
      }
    },
    watch:{
      initParam(){
        this.optType = this.$route.query.optType;
        this.prjCode = this.$route.query.prjCode;
        this.initPage();
      }
    },
    data() {
      return {
        optType:'',
        menuList:[],
        comp:'',
        comps:[],
        comParam:{}
      }
    },
    created() {
      this.optType = this.$route.query.optType;
      this.prjCode = this.$route.query.prjCode;
    },
    mounted() {
      this.initPage();
    },
    provide(){
      return{
        psToPage:this.toPage,
      }
    },
    methods: {
      async initPage(){
        let p2r = function(p){
          p.path = p.url;
          p.key = p.url;
          if(p.children && p.children.length>0){
            for(let p_ of p.children){
              p2r(p_);
            }
          }
        }
        let ps = [];
        let that = this;
        let ca = function(m){
          if(m.path === "/prj/setup"){
            if(that.optType === "ADD"){
              that.menuList = [m.children[0]];
            }else{
              that.menuList = m.children;
            }
            that.$nextTick(() => {
              if(m.children && m.children.length>0){
                console.log('that.$refs====',that.$refs);
                if(that.$refs.iMenu){
                  that.$refs.iMenu.$emit("select",{domEvent:{target:{dataset:{comp:m.children[0].component}}},key:""});
                }
              }
            });
          }else if(m.children && m.children.length>0){
            for(let m_ of m.children){
              ca(m_);
            }
          }
        }
        let v_token = Vue.ls.get(ACCESS_TOKEN);
        let params = {token:v_token};
        await getPermissionListByToken(params).then((res) =>{
          if (res.success) {
            if(res.result && res.result.length>0){
              ps = res.result;
              for(let p of ps){
                p2r(p);
              }
              ca({path:"sfsf",children:ps});
            }
          }
        });

        /*await getPermissionList().then((res) => {
          if (res.success) {
            if(res.result && res.result.length>0){
              ps = res.result;
              for(let p of ps){
                p2r(p);
              }
              ca({path:"sfsf",children:ps});
            }
          }
        });*/
        console.log(that.menuList)
      },
      parseQuery(query){
        let reg = /([^=&\s]+)[=\s]*([^&\s]*)/g;
        let obj = {}
        while (reg.exec(query)) {
          obj[RegExp.$1] = RegExp.$2;
        }
        return obj;
      },
      menuSelected(item) {
        let compStr = item.domEvent.target.dataset.comp;
        if(compStr !== "layouts/RouteView"){
          if(item.key.indexOf("?")>0){
            this.comParam = this.parseQuery(item.key.split("?")[1]);
          }
          // this.comParam = Object.assign(this.comParam,{prjCode:this.$route.query.prjCode})
          this.loadComp(compStr);
        }
      },
      loadComp(compStr){
        if(this.comps[compStr]){
          this.comp = this.comps[compStr];
        }else{
          let compImp = () => import('@/views/'+compStr+'.vue');
          this.comps[compStr] = compImp;
          this.comp = compImp;
        }
      },
      refreshPage(prjCode){
        this.remove('/prj/setup?optType=ADD');
        let that = this;
        this.$nextTick(() => {
          that.$router.push({name:"prj-setup", query: {optType:'EDIT',prjCode:prjCode}});
        });
      },
      toPage(compStr, param){
        this.comParam = param;
        if(compStr){
          this.loadComp(compStr);
        }
      }
    }
  }
</script>

<style scoped>
  @import '~@assets/less/common.less'
  .ant-menu-item span{
    height: 40px;
  }
</style>