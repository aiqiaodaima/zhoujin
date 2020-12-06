/** 
  国家省市区级联
  needCountry:true 从国家开始选，false： 省市区
*/

<template>
  <div>
    <a-form-model-item :label="label" :prop="name" :ref="name" :rules="rules">
      <a-cascader v-if="decorator" :options="options"  v-decorator="decorator" :disabled="disabled"
                  :placeholder="placeholder"
                  :loadData="loadData" @change="onChange"
                  :fieldNames="{ label: fieldLabel, value: fieldValue, children: children }"/>
      <a-cascader v-else :options="options"  v-model="val" :disabled="disabled"
        :placeholder="placeholder" 
        :load-data="loadData" 
        change-on-select
        @change="onChange"
        :fieldNames="{ label: fieldLabel, value: fieldValue, children: children }"/>
    </a-form-model-item>
  </div>
</template>
<script>
  import { getCusAreaList,getDict } from '@/api/BiApi'
  import dictMixin from '@mixins/dictMixin'

  export default {
    name: 'BiFormItemCascader',
      components: {
      },
      mixins:[dictMixin],
      props: {
        label: {
          type: String,
          default: '投资区域'
        },
        name: {
          type: String,
          default: 'name'
        },
        placeholder: {
          type: String,
          default: '请选择省市区'
        },
        value:{

        },
        rules:{

        },
        fieldLabel: {
          default: 'areaName'
        },
        fieldValue: {
          default: 'areaCode'
        },
        children: {
          default: 'children'
        },
        decorator: {
          type: Array,
          default: ()=>{}
        },
        // 是否需要国家
        needCountry: {
          default: true
        },
        disabled: {
          default: false
        }

      },
      computed:{
        val: {
          get: function(){
            return this.value
          },
          set: function(newVal){
            // this.$emit(event, ${[…args]})
            // this.$emit('input', newVal);
            this.$emit('change', newVal);
          }
        },
        randName: ()=>{
          return String.fromCharCode(65+Math.ceil(Math.random() * 25))+new Date().getTime();
        }
      },
      data(){
        return {
          options: []
        }
      },
      watch:{
        value(newVal,oldVal ){
          if( newVal && newVal.length == 3 && !oldVal.length ){
            if(!this.needCountry ){
              // 省市区3级
              this.getInitData(newVal)
            } else {
              // 国家省市区
              this.getInitCountry(newVal)
            }
          }
        }
      },
      methods:{
        // 获取中国的省市区
        async getCusAreaList (areaLv,parentAreaCode) {
          let param = {
            pageSize: 100
          }
          if(parentAreaCode) {
            param.parentAreaCode = parentAreaCode
          }
          if(areaLv) {
            param.areaLv = areaLv
          }
          const res = await getCusAreaList(param)
          if (parentAreaCode) {
            return res 
          }
          if (res.success){
            const items = res.result.records 
            items.forEach( item => {
              item.isLeaf = false
            })
            this.options = [...items]
          }
        },
        onChange(value,selectedOptions) {
          this.loadData(selectedOptions)
          
          this.$emit('change', value);
          // let c = {};
          // c[this.decorator[0][0]] = value[0];
          // c[this.decorator[0][1]] = value[1];
          // c[this.decorator[0][2]] = value[2];
          // this.form.setFieldsValue(c);
        },
        async loadData (selectedOptions) {
          
          const targetOption = selectedOptions[selectedOptions.length - 1];
          
          if( this.needCountry ){
            if(selectedOptions[0].areaCode !== '001'){
              return 
            } 
            if(targetOption.areaLv == 2){
              return
            }
          }
          targetOption.loading = true;
          let param = {
            pageSize: 100
          }
          if(targetOption.areaCode == '001') {
            param.areaLv = 1
          } else {
            param.parentAreaCode = targetOption.areaCode
          }
          const res = await getCusAreaList(param)
          if (res.success) {
            targetOption.loading = false;
            const items = res.result.records 
            let step = this.needCountry ? 1 : 2 
            if (targetOption.areaLv < step) {
              items.forEach( item => {
                item.isLeaf = false
              })
            }
            targetOption[this.children]= items;
            this.options = [...this.options];
          }
        },
        // 省市区3级回显
        async getInitData(areas) {
          // areas = ['11','1101','110101']
          const res1 = await getCusAreaList({pageSize: 100,areaLv:1})
          const res2 = await getCusAreaList({pageSize: 100,parentAreaCode:areas[0]})
          const res3 = await getCusAreaList({pageSize: 100,parentAreaCode:areas[1]})
          if( res1.success && res2.success && res3.success ){
            let items1 = res1.result.records
            let items2 = res2.result.records
            let items3 = res3.result.records
            let options = [...items1]
            options.forEach(op1=>{
              op1.isLeaf = false
              if(op1.areaCode == areas[0]){
                op1[this.children] = [...items2]
                op1[this.children].forEach(op2=>{
                  if(op2.areaCode == areas[1]){
                    op2[this.children] = [...items3]
                    // op1.isLeaf = false
                  }
                })
              }
            })
            this.options = [...options];
          } 
        },
        // 国家省市3级回显
        async getInitCountry(areas) {
          // areas = ['001','11','1101']
          // const res1 = await this.getDict('AREA_CODE')
          
          const res1 = await getDict({dictCodes:'AREA_CODE'})
          const res2 = await getCusAreaList({pageSize: 100,areaLv:1})
          const res3 = await getCusAreaList({pageSize: 100,parentAreaCode:areas[1]})
          
          if( res1.success && res2.success && res3.success ){
            let items1 = res1.result.AREA_CODE
            // let items1 = res1.result.records
            let items2 = res2.result.records
            let items3 = res3.result.records
            let options = [...items1]
            options.forEach(op1=>{
              // op1.isLeaf = false
              op1.areaName = op1.text
              op1.areaCode = op1.value
              op1.areaLv = 0
              op1.value == '001' ? (op1.isLeaf = false) :(op1.isLeaf = true)
              if(op1.areaCode == areas[0]){
                op1[this.children] = [...items2]
                op1[this.children].forEach(op2=>{
                  op2[this.children] = []
                  op2.isLeaf = false
                  if(op2.areaCode == areas[1]){
                    op2[this.children] = [...items3]
                  }
                })
              }
            })
            this.options = [...options];
          } 
        },

      },
      async mounted() {
        //是否有国家
        if(this.needCountry) {
          //默认回显
          if( this.value && this.value.length == 3 ){
            this.getInitCountry(this.value)
          } else {
            const res = await this.getDict('AREA_CODE')
            this.options = this.dicts.AREA_CODE
          }
        } else {
          //默认回显
          if( this.value && this.value.length == 3 ){
            this.getInitData(this.value)
          } else {
            this.getCusAreaList(1)
          }
        }
      },
      model: {
        prop: 'value',
        event: 'change'
      }
  }

  
</script>