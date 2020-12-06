<template>
  <div v-if="ss" :class="isShow? 'm-select-wrap1':'m-select-wrap'">
    <div class="title">
      <input type="text" placeholder="输入/勾选" v-model="searchLine" @click.stop="showList" @focus="inputFocus">
      <span class="show-list" @click.stop="toggleList" v-model="isShow">∨</span>
      <!--<span class="select-con">选中了：{{selectCon}}</span>-->
    </div>
    <ul v-if="isShow" @click.stop="showList">
      <li>
        <label><input type="checkbox" v-model="checkAllState" @change="checkAll"> 全选</label>
      </li>
      <li v-for="item in searchLists">
        <label :id="item.dataIndex"><input type="checkbox" v-model="item.lineCheck" @change="checkOne(item)"> {{item.title}}</label>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
    name: "BiMultipleSelect",
    components: { 

    },
    mixins: [],
    props:{
      data:Array
    },
    data () {
      return {
        ss:true,
        //选项的选中状态
        checkAllState: false,
        //选中的数据
        checkedList: [],
        //未选中的列
        unCheckedList:[],
        //文本框的值
        searchLine: '',
        //下拉列表是否显示
        isShow:true,
        //选中的内容
        selectCon:'',
      }
    },
  watch: {
    lineList: {
      handler(newVal, oldVal) {
        //选中数据
        this.checkedData = newVal.filter(function(item) {
          return item.Check == true;
        });
        //在页面打印出的数据
        this.selectCon = ""; //点击的当前项的展示
        for (var i = 0; i < this.checkedData.length; i++) {
          this.selectCon += this.checkedData[i].title + "  ";
        }
        // 给父组件传值
        // this.$emit("change", this.selectCon);
      },
      deep: true
    }
  },
    methods: {
      //全选
      checkAll: function() {
        for (var i = 0; i < this.searchLists.length; i++) {
          this.searchLists[i].lineCheck = this.checkAllState;
        }
        this.getCheckData();
      },
      //选择单个
      checkOne: function(item) {
        this.searchLists.every(function(item) {
          return item.lineCheck == true;
        }) ? this.checkAllState = true : this.checkAllState = false;
        this.getCheckData();
      },
      //获取选中的数据
      getCheckData: function() {
        /* this.checkedList = this.searchLists.filter(function(item) {
           return item.lineCheck == true;
         })*/
        //获取没有被选中的数据
        this.unCheckedList = this.searchLists.filter(function(item) {
          return item.lineCheck !=true;
        })
        // this.columns=this.unCheckedList;
        // 给父组件传值
        this.$emit("change", this.unCheckedList);
      },
      //切换下拉列表
      toggleList:function(){
        this.isShow=!this.isShow;
      },
      //显示下拉列表
      showList:function(){
        this.isShow=true;
      },
      //文本框获得焦点时文字被选中
      inputFocus:function(e){
        e.currentTarget.select();
      },
    },
  created(){
    this.lineList =this.data
    console.log("2222"+this.$parent.$data)
      // this.form.proName=this.$parent.$data.proName;
  },
  mounted() {
    var _this=this;
    //点击页面空白处隐藏下拉列表
    document.addEventListener('click',function(event){
      /*var sp = document.getElementById("butt");

      if(sp) {

        if (!sp.contains(event.target)) {            //这句是说如果我们点击到了id为myPanel以外的区域

          _this.ss = false;

        }
      }*/
      _this.isShow=false;
      _this.selectCol=false;
    });
  },
  computed:{
    //输入框筛选列表
    searchLists: function() {
      var _search = this.searchLine;
      if (_search) {
        return this.lineList.filter(function(item) {
          return Object.keys(item).some(function(key) {
            return String(item.title).toLowerCase().indexOf(_search) > -1
          })
        })
      }
      return this.lineList;
    }
  },
  }
</script>

<style lang="stylus" scoped>
  .btn {
    margin-left: 8px;
  }
  .m-select-wrap{width: 200px;height:200px ;margin-left: 160px;margin-top:-50px;position: absolute;z-index: 111;float: right}
  .m-select-wrap .title{width: 200px;position: relative;}
  .m-select-wrap input[type="text"]{width: 200px;height: 35px;padding: 0 5px;}
  .m-select-wrap .select-con{position: absolute;left: 105%;white-space: nowrap;line-height: 40px;}
  .m-select-wrap .show-list{position: absolute; width: 30px;height: 35px;line-height: 38px;border: 1px solid #aaa;right: 0;text-align: center;cursor: pointer;}
  .m-select-wrap ul{border: 1px solid #ccc;padding:0 30px 10px 10px;height:80%;list-style-type: none; overflow-y: scroll;}
  .m-select-wrap li{margin-top: 10px;}

  .m-select-wrap1{width: 200px;height:200px ;margin-left: 160px;margin-top:-50px;position: absolute;z-index: 111; background-color: white;float: right}
  .m-select-wrap1 .title{width: 200px;position: relative;}
  .m-select-wrap1 input[type="text"]{width: 200px;height: 35px;padding: 0 5px;}
  .m-select-wrap1 .select-con{position: absolute;left: 105%;white-space: nowrap;line-height: 40px;}
  .m-select-wrap1 .show-list{position: absolute; width: 30px;height: 35px;line-height: 38px;border: 1px solid #aaa;right: 0;text-align: center;cursor: pointer;}
  .m-select-wrap1 ul{border: 1px solid #ccc;padding:0 30px 10px 10px;height:80%;list-style-type: none; overflow-y: scroll;}
  .m-select-wrap1 li{margin-top: 10px;}
</style>