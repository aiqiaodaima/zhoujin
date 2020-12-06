<template>
  <div>
    <a-form-item :label="label" :required="required">
      <a-radio-group v-decorator="decorator">
        <a-radio  v-for="(item,index) in options" :key="index" :value="item.value">{{item.name}}</a-radio>
      </a-radio-group>
    </a-form-item>
  </div>
</template>
<script>
export default {
  name: 'BiFormItemRadio',
    components: {
    },
    computed: {
      value: {
        get() {
          return this.checked
        },
        set(val) {
          this.$emit("onChecked", val)
        }
      }
    },
    props: {
      label: {
        type: String,
        default: '名字'
      },
      required: {
        type: Boolean,
        default: false
      },
      options:{
        type: Array,
        required: true
      },
      checked: {
        type: String,
      },
      decorator: {
        type: Array,
      }

    },
    data(){
      return {
      }
    },
    watch:{
    },
    methods:{
      
    },
    model: {
      prop: 'checked',
      event: 'change'
    }
}
</script>