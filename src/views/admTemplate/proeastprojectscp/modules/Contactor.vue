/**
 多个联系人表格模块
 */
<template>
  <div>
    <a-table :columns="columns" :dataSource="contactors" rowKey="key" row :scroll="{ x: 1200 }">
      <template v-for="(col, i) in ['contName', 'address','ctelNo','ftelNo','email','memo']" :slot="col"  slot-scope="text, record, index">
        <a-input style="width:120px" :key='col'  v-if="record.editable"
          :value="text" @change="handleChange($event,index,col)" placeholder="请输入"/>
        <template v-else>{{ text }}</template>
      </template>
      <template v-if="!disabled" slot="contactorOpt" slot-scope="text, record, index">
        <div class="editable-row-operations">
            <span v-if="record.editable">
              <a @click="() => handleSave(index)">添加</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确定删除吗?" @confirm="() => handleDel(index)">
                <a>删除</a>
              </a-popconfirm>
            </span>
          <span v-else>
            <a :disabled="editingId !== ''" @click="() => handleEdit(index)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm title="确定删除吗?" @confirm="() => handleDel(index)">
              <a :disabled="editingId !== ''">删除</a>
            </a-popconfirm>
          </span>
        </div>
      </template>
    </a-table>
    <a-button v-if='!disabled' style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus" :disabled="editingId !== ''" @click="add">新增联系人</a-button>
  </div>

</template>
<script>

export default {
  name: "Contactor",
  data() {
    return {
    //所有key的列
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key:'rowIndex',
          width:70,
          align:"center",
          customRender: (t,r,index)=> {
            return parseInt(index)+1;
          }
        },
       {
          title:'姓名',
          dataIndex: 'contName',
          scopedSlots: { customRender: 'contName' }
        },{
          title:'联系地址',
          dataIndex: 'address',
          scopedSlots: { customRender: 'address' }
        },{
          title:'手机号码',
          dataIndex: 'ctelNo',
          scopedSlots: { customRender: 'ctelNo' }
        },{
          title:'固定电话',
          dataIndex: 'ftelNo',
          scopedSlots: { customRender: 'ftelNo' }
        },{
          title:'邮箱',
          dataIndex: 'email',
          scopedSlots: { customRender: 'email' }
        },{
          title:'备注',
          dataIndex: 'memo',
          scopedSlots: { customRender: 'memo' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 120,
          fixed: 'right',
          scopedSlots: { customRender: 'contactorOpt' },
        }
      ],
      editingId:'',
      contactorItem: {
        "addrCityCode": "",
        "addrCountyCode": "",
        "addrProvCode": "",
        "address": "",
        "contName": "",
        "createBy": "",
        "createDt": "",
        "ctelNo": "",
        "email": "",
        "fax": "",
        "ftelNo": "",
        "id": 0,
        "modifyBy": "",
        "modifyDt": "",
        "removeYn": "",
        "zipCode": "",
        editable: true,
        isNew: true
      }
    }
  },
  components: {
  
  },
  computed: {
  },
  props: {
    disabled:{
      default: false
    },
    contactors:{
      default: function(){
        return []
      }
    },
  },
  watch:{
 
  },
  methods: {
    add(){
      this.contactors.push({ ...this.contactorItem,key: new Date().getTime()})
      this.editingId = this.contactors.length;
    },
    handleEdit(index) {
      let target = this.contactors[index]
      target.editable = !target.editable
      this.editingId = index;
    },
    handleSave(index) {
      let target = this.contactors[index]
      if( !target.contName ){
        this.$message.warn('请填写联系人姓名')
        return
      }
      target.editable = false
      target.isNew = false
      this.editingId = '';
    },
    handleCancel(index) {
      let target = this.contactors[index]
      target.editable = false
      this.editingId = '';
      this.handleDel(index)
    },
    handleDel(index){
      this.contactors.splice(index,1)
      this.editingId = '';
    },
    handleChange(e,index,col){
      this.$set(this.contactors[index],col,e.target.value)
    },
  },
  created(){
   
  }
}
</script>
<style lang="stylus" scoped>

</style>