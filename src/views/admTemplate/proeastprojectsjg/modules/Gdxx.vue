<template>
  <div>
    <a-table :columns="columns" :dataSource="gdgroup" rowKey="key" row :scroll="{ x: 1200 }">
      <template slot="kgfs" slot-scope="text, record, index">
        <BiFormItemSelect :options="dicts.EAST_KGFS"  name="kgfs"
                          :value="text" @change="kgChange($event,'kgfs',index)"  showSearch
                          :isForm="false" v-if="record.editable" placeholder="请选择"/>
        <template v-else>{{ getDictNameByCode(dicts.EAST_KGFS,text) }}</template>
      </template>
      <template v-for="(col, i) in ['rowIndex','gdmc', 'gdlx','zjlx','czjr','bzlb','cgbl','cgsl','action']" :slot="col"  slot-scope="text, record, index">
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
            <a :disabled="editingId !== ''" @click="() => handleEdit(index,'edite')">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm title="确定删除吗?" @confirm="() => handleDel(index)">
              <a :disabled="editingId !== ''">删除</a>
            </a-popconfirm>
          </span>
        </div>
      </template>
    </a-table>
    <a-button v-if='!disabled' style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus" :disabled="editingId !== ''" @click="infoDisAdd('add')">新增股东信息</a-button>


    <BiModal
      :visible.sync="modal.visible"
      :width="800"
      :title="modal.title"
      :fullscreen.sync="modal.fullscreen"
      :switchFullscreen="modal.switchFullscreen"
      :destroyOnClose='true'
      :footer="null"
    >
      <GdxxModal ref='GdxxModal' :orgType='orgType' :id='id' :type='type' :groupindex='groupindex' :gdgroup='gdgroup' @getReply="getReply"></GdxxModal>
    </BiModal>
  </div>



</template>
<script>


  import dictMixin from '@mixins/dictMixin'
  import GdxxModal from './GdxxModal'
  import {deleteAction} from '@/api/manage'
  export default {
    name: "Gdxx",
    mixins: [dictMixin],
    components: {
      dictMixin,GdxxModal
    },
    data() {
      return {
        //所有key的列
        columns: [
          {
            title: '序号',
            dataIndex: 'rowIndex',
            key:'rowIndex',
            width:70,
            align:"center",
            customRender: (t,r,index)=> {
              return parseInt(index)+1;
            }
          },
          {
            title:'姓名/名称',
            dataIndex: 'gdmc',
            align: "center",
            scopedSlots: { customRender: 'gdmc' },
            customRender: (text,r)=>{
              return  r.gdmc
            }
          },{
            title:'股东类型',
            dataIndex: 'gdlx',
            align: "center",
            scopedSlots: { customRender: 'gdlx' },
            customRender: (text,r)=>{
              return  this.getDictNameByCode(this.dicts.GQ_GDLX,text)
            }
          }, {
            title: '证件类型 ｜ 证件号码',
            dataIndex: 'zjlx',
            align: "center",
            scopedSlots: { customRender: 'zjlx'},
            customRender: (text,r)=>{
              if(r.dsmc=='NP'){//用于区分是哪个table添加进来的
                return  this.getDictNameByCode(this.dicts.IDNTYPES,text)+' ｜ '+r.gdzjhm
              }else{
                return  this.getDictNameByCode(this.dicts.ORGIDNTYPES,text)+' ｜ '+r.gdzjhm
              }

            }

          },{
            title:'控股方式',
            dataIndex: 'kgfs',
            align: "center",
            scopedSlots: { customRender: 'kgfs' }
          },{
            title:'出资金额(元)',
            dataIndex: 'czjr',
            align: "center",
            scopedSlots: { customRender: 'czjr' }
          },{
            title:'币别',
            dataIndex: 'bzlb',
            align: "center",
            scopedSlots: { customRender: 'bzlb' }
          },{
            title:'持股比例（%）',
            dataIndex: 'cgbl',
            align: "center",
            scopedSlots: { customRender: 'cgbl' }
          },
          {
            title:'持股数量（股）',
            dataIndex: 'cgsl',
            align: "center",
            scopedSlots: { customRender: 'cgsl' }
          },
          {
            title: '操作',
            dataIndex: 'action',
            fixed: 'right',
            scopedSlots: { customRender: 'contactorOpt' }
          }
        ],
        editingId:'',
        modal: {
          info:'股东信息',
          title: '新增',
          visible: false,
          fullscreen: true,
          switchFullscreen: false,
        },
        type: 'add',
        id: '',
        orgType: '',
        groupindex:'',
        url: {
          delete: "/proEastProjectsJydsjggdxx/delete"
        },


      }
    },
    computed: {
    },
    props: {

      disabled:{
        default: false
      },
      gdgroup:{
        default: function(){
          return []
        }
      },
    },
    watch:{

    },
    methods: {
      getReply (param,index) {
        this.group =param
        this.groupindex=index

        if(this.groupindex>-1){
          if(this.type=='add'){//修改页的新增股东信息
            this.gdgroup.push({ ...this.group})
          }
          else{
            this.gdgroup.splice(this.groupindex, 1, this.group)
            console.log(JSON.stringify(this.gdgroup))
          }
        }
        else{
          this.gdgroup.push({ ...this.group})
        }
      },
      add(){

      /*  this.contactors.push({ ...this.contactorItem,key: new Date().getTime()})
        this.editingId = this.contactors.length;*/
      },
      infoDisAdd(type,id){
        const types = {
          add:  '新增',
          copy:  '复制新增',
          edite:  '编辑',
          view:  '查看',
        }
        this.type = type
        this.id = id
        this.modal.title = this.modal.info+types[type]
        this.modal.visible = true
      },
      handleEdit(index,type) {
        //处理表单回显
        const types = {
          add:  '新增',
          copy:  '复制新增',
          edite:  '编辑',
          view:  '查看',
        }
        this.type = type
        this.id = this.gdgroup[index].id//每条股东信息独立的id
        this.modal.title = this.modal.info+types[type]
        this.modal.visible = true
        //处理详情添加完的保存
        let target = this.gdgroup[index]
        target.editable = !target.editable
        this.editingId = index;
        this.groupindex=index;//向下转递索引，进行操作不会影响页面状态




      },
      handleSave(index) {
        let target = this.gdgroup[index]
        if( !target.kgfs ){
          this.$message.warn('请填写控股方式')
          return
        }
        if( !target.cgbl ){
          this.$message.warn('请填写持股比例')
          return
        }

        target.editable = false
        target.isNew = false
        this.editingId = '';
      },
    /*  handleCancel(index) {
        let target = this.gdgroup[index]
        target.editable = false
        this.editingId = '';
        this.handleDel(index)
      },*/
      handleDel(index){

        let param = {
          id:this.gdgroup[index].id
        }
        console.log("huoqudeid=="+this.gdgroup[index].id)

        var that = this;
        deleteAction(that.url.delete, param).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.gdgroup.splice(index,1)
            that.editingId = '';
          } else {
            that.$message.warning(res.message);
          }
        });

        //发起删除
    /*    this.$confirm({
          title: "确认删除",
          content: "是否删除选中数据?",
          onOk: function () {
            deleteAction(that.url.delete, id).then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                this.gdgroup.splice(index,1)
                this.editingId = '';
              } else {
                that.$message.warning(res.message);
              }
            });
          }
        });*/

      },
      handleChange(e,index,col){
        this.$set(this.gdgroup[index],col,e.target.value)
        console.log(this.gdgroup)
      },
      kgChange (value,column,index) {

       /* const newData = [...this.gdgroup]
        const target = newData[index]*/
        const target = this.gdgroup[index]
        if (target) {
          target[column] = value
        }
      },

    /*  gdhandleOk(){
        this.$refs.GdxxModal.onSubmit()
      },*/
    },
    created(){
      this.getDict('IDNTYPES,GQ_GDLX,ORGIDNTYPES,EAST_KGFS')
    },


  }
</script>
