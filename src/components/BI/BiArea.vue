<template>
  <div>
    <a-row v-if="showType === 'select'" :gutter="24">
      <div v-if="decorator">
        <a-col :span="8">
          <a-form-item>
          <a-select @change="handleProvinceChange" v-decorator="[decorator[0][0],decorator[1]]">
            <a-select-option key="">请选择</a-select-option>
            <a-select-option v-for="province in provinceData" :key="province.areaCode">{{province.areaName}}</a-select-option>
          </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="8" v-if="showLv>1">
          <a-form-item>
          <a-select @change="handleCityChange" v-decorator="[decorator[0][1],decorator[1]]">
            <a-select-option key="">请选择</a-select-option>
            <a-select-option v-for="city in cityData" :key="city.areaCode">{{city.areaName}}</a-select-option>
          </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="8" v-if="showLv>2">
          <a-form-item>
          <a-select @change="handleDistrictChange" v-decorator="[decorator[0][2],decorator[1]]">
            <a-select-option key="">请选择</a-select-option>
            <a-select-option v-for="district in districtData" :key="district.areaCode">{{district.areaName}}</a-select-option>
          </a-select>
          </a-form-item>
        </a-col>
      </div>
      <div v-else>
        <a-col :span="5">
          <a-select @change="handleProvinceChange" v-model="pVal" >
            <a-select-option key="">请选择</a-select-option>
            <a-select-option v-for="province in provinceData" :key="province.areaCode">{{province.areaName}}</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="6" v-if="showLv>1">
          <a-select @change="handleCityChange" v-model="cVal" >
            <a-select-option key="">请选择</a-select-option>
            <a-select-option v-for="city in cityData" :key="city.areaCode">{{city.areaName}}</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="6" v-if="showLv>2">
          <a-select @change="handleDistrictChange" v-model="dVal">
            <a-select-option key="">请选择</a-select-option>
            <a-select-option v-for="district in districtData" :key="district.areaCode">{{district.areaName}}</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="6" v-if="showLv>3">
         <a-input placeholder="请输入详细地址" v-model="address" @change="handleAddressChange"/>
        </a-col>
      </div>
    </a-row>
    <div v-else>
      {{ textVal + additionalText }}
    </div>
  </div>
</template>

<script>
  import { getAction } from '@/api/manage'
  export default {
    name: 'BiArea',
    components: {
      //components here
    },
    props: {
      value:String,
      showType:{
        type:String,
        default:'select'
      },
      showLv:{
        type: Number,
        default:1
      },
      models:{
        type: Array,
        default: ()=>[]
      },
      decorator: {
        type: Array,
      },
      additionalText: {
        type:String,
        default:''
      },
      aginway:{
        default:false
      },
    },
    computed: {

      getValueStr(){
        return this.pVal+(this.showLv>1?","+this.cVal:"")+(this.showLv>2?","+this.dVal:"")+(this.showLv>3?","+this.address:"");
      },


    },
    watch:{
      models:{
        immediate:true,
        handler(v) {
          this.pVal = v[0];
          this.cVal = v[1];
          this.dVal = v[2];
          this.address = v[3];
        },
      },
      aginway: {//勿删 处理带入信息地址翻译失败的问题
        handler(newName, oldName) {
          if(newName)
          this.initAreaOptions();
          newName=false
        },
        immediate: true,
      }


    },
    data() {
      return {
        provinceData:[],
        cityData:[],
        districtData:[],
        cities:[],
        districts:[],
        pVal:"",
        cVal:"",
        dVal:"",
        address:"",
        textVal:"",
      }
    },
    created() {
      this.initAreaOptions();
    },
    mounted() {
      //mounted here
    },
    methods: {
      initAreaOptions(){
        let that = this;
        that.provinceData = [];
        that.cities = [];
        that.districts = [];
        getAction('/cusArea/listAll').then((res) => {
          if (res.success) {
            let pText='';
            let cText='';
            let dText='';
            for(let area of res.result){
              if(area.areaLv === "1"){
                that.provinceData.push(area);
              }else if(area.areaLv === "2"){
                if(!that.cities[area.parentAreaCode]){
                  that.cities[area.parentAreaCode] = [];
                }
                that.cities[area.parentAreaCode].push(area);
              }else if(area.areaLv === "3"){
                if(!that.districts[area.parentAreaCode]){
                  that.districts[area.parentAreaCode] = [];
                }
                that.districts[area.parentAreaCode].push(area);
              }
              if(that.pVal === area.areaCode){
                pText = area.areaName;
              }
              if(that.cVal === area.areaCode){
                cText = area.areaName;
              }
              if(that.dVal === area.areaCode){
                dText = area.areaName;
              }
            }
           //let textTemp=pText||''+cText||''+dText||'' //影响查看页的数据回显
            let textTemp=pText+cText+dText
            if(this.getValueStr){
              textTemp+=this.getValueStr.split(',')[3]||''
            }
            that.textVal = textTemp;
            that.provinceData.sort((a,b)=>{
              return a.id<b.id;
            });
            if(that.pVal){
              that.cityData = that.cities[that.pVal];
            }
            if(that.cVal){
              that.districtData = that.districts[that.cVal];
            }
          }
        }).catch(error => {
          console.log("系统获取省市区数据异常",error);//这行打印permissionName is undefined
        });
      },
      handleProvinceChange(pv) {
        this.pVal = pv;
        this.cityData = this.cities[this.pVal];
        this.districtData = [];
        this.cVal = "";
        this.dVal = "";
        this.address = "";
        this.setMod();
      },
      handleCityChange(cv) {
        this.cVal = cv;
        this.districtData = this.districts[this.cVal];
        this.dVal = "";
        this.setMod();
      },
      handleDistrictChange(dv){
        this.dVal = dv;
        this.setMod();
      },
      handleAddressChange(dv){
        this.setMod();
      },
      setMod(){
        this.$emit('change', this.getValueStr);
        // this.models = [this.pVal, this.cVal, this.dVal];
      },
    }
  }
</script>

<style scoped>
  @import '~@assets/less/common.less'
</style>