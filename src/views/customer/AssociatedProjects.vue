<template>
  <a-card :bordered="false" title="项目查询">
    <div>
      <a-table 
        ref="table"
        bordered
        size="middle"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :scroll="{ x: 1250, y: 400 }"
        @change="handleTableChange">
        <template slot="action" slot-scope="text, record">
          <div class="editable-row-operations">
            <span>
              <a  @click="infoDisAdd(record)">查看</a>
            </span>
          </div>
        </template>
      </a-table>
    </div>
  </a-card>
</template>

<script>
import biTableMixin from '@mixins/biTableMixin'
import { getDict } from '@/api/BiApi'
import {deleteAction} from '@/api/manage'
import dictMixin from '@mixins/dictMixin'
import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'
import { initDictOptionsBatch } from '../../components/dict/JDictSelectUtil'
export default {
  name: 'AssociatedProjects',
  components: {
  },
  mixins:[biTableMixin,dictMixin],
  props: {
    partyCode:{
      default:''
    }
  },
  data () {
      return {
        // 表头
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',
            width: 70,
            align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '项目名称',
            align: "center",
            width:130,
            dataIndex: 'TRUST_PRJ_NAME'
          },
          {
            title: '项目编号',
            align: "center",
            width:130,
            dataIndex: 'TRUST_PRJ_CODE'
          },
          {
            title: '是否估值',
            align: "center",
            dataIndex: 'VOA_TYPE',
            width: 130,
            customRender: (text) => {
              //字典值替换通用方法
              return filterDictText(this.dictOptionsData["VOA_TYPE"], text);
            }
          },
          {
            title: '项目类型',
            align: "center",
            dataIndex: 'CONTRACT_TYPE',
            width: 130,
            customRender: (text) => {
              //字典值替换通用方法
              return filterDictText(this.dictOptionsData["CONTRACT_TYPE"], text);
            }
          },
          {
            title: '合同系列',
            align: "center",
            dataIndex: 'CONTRACT_SERIE',
            width: 100,
            customRender: (text) => {
              //字典值替换通用方法
              return filterDictText(this.dictOptionsData["CONTRACT_SERIE"], text);
            }
          },
          {
            title: '信托终止日',
            align: "center",
            width: 130,
            dataIndex: 'TRUST_EXPR_DT'
          },
          {
            title: '信托经理',
            align: "center",
            width: 130,
            dataIndex: 'TM_NAME'
          },
          {
            title: '项目状态',
            align: "center",
            width: 130,
            dataIndex: 'PRJ_STATUS',
            customRender: (text) => {
              //字典值替换通用方法
              return filterDictText(this.dictOptionsData["PRJ_STATUS"], text);
            }
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: 120,
            fixed: 'right',
            align: "center",
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/prj/cusInfo/listProjectInfo",
        },
        type: 'add',
        dictOptionsData:[],
        id: '',
      }
    },
  created() {
    this.initDictConfig()
    this.queryParam.partyCode=this.partyCode
  },
  mounted() {
    //mounted here
  },
  methods: {
    infoDisAdd(record){
      this.$router.push({name: 'projectView',query:{title:'项目视图',prjCode:record.PRJ_CODE,prjName:record.TRUST_PRJ_NAME}})
    },
    initDictConfig() {
      //初始化字典 - 是否估值
      let that = this;
      initDictOptionsBatch("VOA_TYPE,CONTRACT_TYPE,CONTRACT_SERIE,CUSTOMER_SOURCE,PRJ_STATUS,CONTRACT_SERIE,CUSTOMER_SOURCE").then((res) => {
        if (res.success) {
          that.dictOptionsData = res.result;
        }
      });
    },
    updateList() {
      this.modal.visible = false
      this.loadData()
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '~@assets/less/common.less';
</style>