<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form-model layout="inline">
        <a-row :gutter="16">
          <BiCol>
            <BiFormItemSelect :options="dicts.WOB_TD_ITEMS" label="事件类别" v-model="queryParam.eventType" />
          </BiCol>
          <BiCol>
            <BiFormItemSelect :options="dicts.EV_DEAL_STATUS" label="处理状态" v-model="queryParam.proStatus" />
          </BiCol>
          <template v-if="advanced">
            <BiCol>
              <BiFormItemInput label="项目名称" v-model="queryParam.trustPrjName" @pressEnter="enterKeySearch" placeholder="请输入项目名称"/>
            </BiCol>
            <BiCol>
              <BiFormItemInput label="资产名称" v-model="queryParam.astName" @pressEnter="enterKeySearch" placeholder="请输入资产名称"/>
            </BiCol>
            <BiCol>
              <BiRangeDatePicker  label="提醒日期" :dateEnd="queryParam.remindEndte" :dateStart="queryParam.remindState" @change="changeDate($event,'remindState','remindEndte')"  />
            </BiCol>
            <BiCol>
              <BiRangeDatePicker  label="到期日" :dateEnd="queryParam.expireEndte" :dateStart="queryParam.expireState" @change="changeDate($event,'expireState','expireEndte')"  />
            </BiCol>
            <BiCol>
              <BiRangeDatePicker  label="处理日期" :dateEnd="queryParam.dealwhEndte" :dateStart="queryParam.dealwhState" @change="changeDate($event,'dealwhState','dealwhEndte')"  />
            </BiCol>
            <BiCol>
              <BiFormItemInput label="处理人" v-model="queryParam.dealUser" @pressEnter="enterKeySearch" placeholder="请输入处理人"/>
            </BiCol>
            
          </template>
          <BiCol>
            <BiTableSearchBtns @searchReset='searchReset' @searchQuery='searchQuery' v-model='advanced'/>
          </BiCol>
        </a-row>
      </a-form-model>
    </div>
    <div>
      <a-table class="table-min-height"
        bordered
        ref="table"
        size="middle"
        :scroll="{x:1500, y: 300 }"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange">
        <template slot="proStatus" slot-scope="text, record, index">
          <span :style="{color: (text==1?'#f5ca1c':text==2?'#009688':'#da283a')}">{{ getDictNameByCode(dicts.EV_DEAL_STATUS,text) }}</span>
        </template>
      </a-table>
    </div>
  </a-card>
</template>

<script>
  import biTableMixin from '@mixins/biTableMixin'
  import dictMixin from '@mixins/dictMixin'
  
  export default {
    name: "schedule",
    components: {
    },
    mixins:[biTableMixin,dictMixin],
    data () {
      return {
        advanced: false,
        // 表头
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',
            align: 'center',
            width: 90,
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '事件类别',
            dataIndex: 'eventType',
            width: 150,
            customRender: (text) => this.getDictNameByCode(this.dicts.WOB_TD_ITEMS,text)
          },
          {
            title: '提醒日期',
            width: 150,
            dataIndex: 'remindDt',
          }, 
          {
            title: '项目名称',
            width: 150,
            dataIndex: 'trustPrjName',
          }, 
          {
            title: '资产名称',
            width: 150,
            dataIndex: 'astName',
          }, 
          {
            title: '说明',
            width: 300,
            dataIndex: 'expContent',
          }, 
          {
            title: '到期日',
            width: 150,
            dataIndex: 'expireDt',
          }, 
          {
            title: '处理日',
            width: 150,
            dataIndex: 'dealwhDt',
          }, 
          {
            title: '处理人',
            width: 150,
            dataIndex: 'dealUser',
          }, 
          {
            title: '处理状态',
            width: 120,
            align: 'center',
            dataIndex: 'proStatus',
            fixed: 'right',
            scopedSlots: { customRender: 'proStatus' },
            // customRender: (text) => this.getDictNameByCode(this.dicts.EV_DEAL_STATUS,text)
          }, 
          // {
          //   title: '操作',
          //   dataIndex: 'action',
          //   width:100,
          //   fixed: 'right',
          //   scopedSlots: { customRender: 'action' },
          // }
        ],
        url: {
          list: "/wobTdLists/list",
        },
      }
    },
    methods: {
      toggleAdvanced () {
        this.advanced = !this.advanced
      },
      changeDate (val,startKey,endKey) {
        this.$set(this.queryParam,startKey,val[0]|| '')
        this.$set(this.queryParam,endKey,val[1]|| '')
      },
    },
    watch: {
    },
    created () {
       this.getDict('WOB_TD_ITEMS,EV_DEAL_STATUS')
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@assets/less/common.less'

</style>