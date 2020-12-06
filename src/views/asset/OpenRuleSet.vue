<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="modal.visible=true">新增开放期规则</a-button>
    </div>
    <div>
      
      <a-table class="table-min-height"
        ref="table"
        size="middle"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">
        <template slot="index" slot-scope="text, record, index">{{index+1}}</template>
        <template slot="operation" slot-scope="text, record">
          <div class="editable-row-operations">
            <span>
              <a  @click="() => $router.push({name: 'assetDetail',query:{id:record.id}})">查看</a>
              <a-divider type="vertical" />
              <a  @click="modal.visible=true">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm
                title="确认删除吗?"
                @confirm="()=>handleDelete({ id:record.id })"
              >
                <a href="#">删除</a>
              </a-popconfirm>
            </span>
          </div>
        </template> 
      </a-table>
    </div>
    
    <BiModal
      :visible.sync="modal.visible"
      :width="600"
      :title="modal.title"
      :fullscreen.sync="modal.fullscreen"
      :switchFullscreen="modal.switchFullscreen"
      @ok="save"
    >
      <div id="openmodal">
        <a-form-model ref="openForm" :labelCol='labelCol' :wrapperCol='wrapperCol' :rules="rules" :model="form">
          <BiFormItemSelect v-model="form.proName" name="proName"
              label="资产名称" :options="alls" />
          <BiFormItemSelect v-model="form.openType" name="openType"
              label="开放类型" :options="alls" />
          <BiFormItemSelect v-model="form.calendarType" name="calendarType"
              label="参考日历" :options="alls" />
          <BiFormItemDatePicker label="开始日" name="startTday" v-model="form.startTday" />
          <BiFormItemDatePicker label="结束日" name="endTday" v-model="form.endTday" />
          <BiFormItemSelect v-model="form.holidayAdjustType" name="holidayAdjustType" 
              label="遇节假日调整方式" :options="alls" />
          <BiFormItemSelect v-model="form.openStartRule" name="openStartRule"
            label="开放日" :options="alls" />
          <BiFormItemTextarea label="开放期规则描述" v-model="form.memo"/>
        </a-form-model>
      </div>
    </BiModal>
  </a-card>
  
</template>

<script>
import { BiRow, BiFormItemInput, BiFormItemRadio, BiFormItemSelect, BiInputNumUnit, BiModal,BiFormItemDatePicker,
  BiFormItemTextarea
} from "@bi"
import { addOpenRule,editOpenRule } from '@/api/BiApi'
import mock from './mock'
import biTableMixin from '@mixins/biTableMixin'

export default {
    name: "OpenRuleSet",
    components: { 
      BiRow, BiFormItemInput, BiFormItemRadio, BiFormItemSelect, BiInputNumUnit, BiModal,
      BiFormItemDatePicker,BiFormItemTextarea
    },
    mixins: [mock,biTableMixin],
    props: {
      showSubmit: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        labelCol: { span: 6 },
        wrapperCol: { span: 14,offset:1 },
        columns: [
          {
            title: '序号',
            key: 'index',
            width: '10',
            scopedSlots: { customRender: 'index' }
          },
          {
            title: '开放类型',
            dataIndex: 'openType',
            width: '15',
            // customRender: 'openType' 
          },
          {
            title: '开始日',
            dataIndex: 'startTday',
            width: '20',
          },
          {
            title: '结束日',
            dataIndex: 'endTday',
            width: '20',
          },
          {
            title: '参考日历',
            dataIndex: 'calendarType',
            width: '20',
          },
          {
            title: '遇节假日调整方式',
            dataIndex: 'holidayAdjustType',
            width: '15',
          },
          {
            title: '开放日',
            dataIndex: 'openDate',
            width: '20',
          },
          {
            title: '开放期规则描述',
            dataIndex: 'memo',
            width: '10',
          },
          {
            title: '操作',
            width: '30',
            fixed: 'right',
            scopedSlots: { customRender: 'operation' }
          }
        ],
        url: {
          list: "/proOpenParam/list",
          delete: "/proOpenParam/delete",
          deleteBatch: "/proOpenParam/deleteBatch",
        },
        modal: {
          title: '开放期规则新增/编辑',
          visible: false,
          fullscreen: false,
          switchFullscreen: false,
        },
        form:{
          proName: '',
          openType: '',
          calendarType: '',
          startTday: '',
          endTday: '',
          holidayAdjustType: '',
          openStartRule: '',
          memo: '',
        },
        rules:{
          proName: [
            { required: true, message: '请选择资产名称', trigger: 'change' },
          ],
          openType: [
            { required: true, message: '请选择开放类型', trigger: 'change' },
          ],
          calendarType: [
            { required: true, message: '请选择参考日历', trigger: 'change' },
          ],
          startTday: [
            { required: true, message: '请选择开始日', trigger: 'change' },
          ],
          endTday: [
            { required: true, message: '请选择结束日', trigger: 'change' },
          ],
          holidayAdjustType: [
            { required: true, message: '请选择遇节假日调整方式', trigger: 'change' },
          ],
          openStartRule: [
            { required: true, message: '请选择开放日', trigger: 'change' },
          ],
        }
        
      }
    },
    methods: {
      async save () {
        this.$refs.openForm.validate( async(valid) => {
          if (valid) {
            const res = await addOpenRule(this.form)
          }
        });
      }
    }
  }
</script>

<style lang="stylus" scoped>
@import '~@assets/less/common.less'
#openmodal{
  .btn{
    margin-left: 8px;
  }
  .ant-form-horizontal{
    .ant-form-item {
      margin-bottom: 5px !important;
    }
  }
}

</style>