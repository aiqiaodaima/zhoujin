<template>
  <div>
    <a-layout id="ProjectElement">
      <a-layout-header class="header">
        家族信托
      </a-layout-header>
      <a-layout>
        <a-layout-sider style="width: 200px">
          <a-menu
            :defaultSelectedKeys="['/prj/setup/element']"
            mode="inline"
            @select="menuSelected"
          >
            <template v-for="item in menus">
              <a-menu-item v-if="!item.children" :key="item.key">
                <span>{{item.title}}</span>
              </a-menu-item>
              <sub-menu v-else :menu-info="item" :key="item.key"></sub-menu>
            </template>
          </a-menu>
        </a-layout-sider>
        <a-layout style="padding: 5px 0 0 5px;">
          <a-layout-content :style="contentStyle">
            <component :is="comp"></component>
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
  import { triggerWindowResizeEvent } from '@/utils/util'
  import { getPermissionList } from '@/api/api'
  import RouteView from '../../components/layouts/RouteView'
  import { mixin, mixinDevice } from '@/utils/mixin.js'
  import { Menu } from 'ant-design-vue';

  const SubMenu = {
    template: `
      <a-sub-menu :key="menuInfo.key" v-bind="$props" v-on="$listeners">
        <span slot="title">
          <span>{{ menuInfo.title }}</span>
        </span>
        <template v-for="item in menuInfo.children">
          <a-menu-item v-if="!item.children" :key="item.key">
            <span>{{ item.title }}</span>
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
      },
    },
  };

  export default {
    name: '',
    components: {
      RouteView
    },
    mixins: [mixin, mixinDevice],
    data() {
      return {
        collapsible: false,
        collapsed: false,
        activeMenu:{},
        menus: [],
        comp:'',
        comps:[]
      }
    },
    computed: {
      smenuStyle() {
        let style = { 'padding': '0' }
        if (this.fixSiderbar) {
          style['height'] = 'calc(100% - 59px)'
          style['overflow'] = 'auto'
          style['overflow-x'] = 'hidden'
        }
        return style
      },
      contentStyle() {
        let x = { background: '#fff', padding: '24px', margin: 0, minHeight: '280px'};
        x.maxWidth=(document.body.clientWidth-450)+'px';
        return x;
      }
    },
    watch: {
      sidebarOpened(val) {
        this.collapsed = !val
      }
    },
    created() {
      let p2r = function(p){
        p.path = p.url;
        p.key = p.component;
        // if(p.url){
        //   p.name = p.url.replace(/\//g,"-");
        // }
        // if(p.name && p.name.indexOf("-") === 0){
        //   p.name=p.name.substr(1,p.name.length);
        // }
        // p.meta = {keepAlive:p.keepAlive,internalOrExternal:p.internalOrExternal,title:p.title};
        // if(p.icon){
        //   p.meta.icon = p.icon;
        // }
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
          console.dir(m.children);
          that.menus = m.children;
        }else if(m.children && m.children.length>0){
          for(let m_ of m.children){
            ca(m_);
          }
        }
      }
      getPermissionList().then((res) => {
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
      // this.menus = this.permissionMenuList;
    },
    mounted() {
      //mounted here
    },
    methods: {
      toggle() {
        this.collapsed = !this.collapsed
        this.setSidebar(!this.collapsed)
        triggerWindowResizeEvent()
      },
      handleSelected(item){
        console.dir(item);
      },
      menuSelected(item) {
        console.dir(item);
        if(item.key !== "layouts/RouteView"){
          if(this.comps[item.key]){

          }else{
            let comp = () => import('@/views/'+item.key+'.vue');
            console.dir(comp);
            this.comps[item.key] = comp;
            let n = item.key.split("/");
            this.comp = comp;
          }
        }
        // this.$router.replace({path:item.key,query:{optType:this.$route.query.optType}});
      }
    }
  }
</script>

<style scoped>
  @import '~@assets/less/common.less'
</style>