<template> 
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form-model layout="inline">
        <a-row :gutter="16">
          <BiCol>
            <BiFormItemInput label="资产名称" placeholder="请输入资产名称" v-model="queryParam.proName" @pressEnter="enterKeySearch"/>
          </BiCol>
          <BiCol>
            <BiRangeDatePicker  label="时间区间" :dateEnd="queryParam.priceDtEnd" :dateStart="queryParam.priceDtStart" @change="changeFlowDate"  />
          </BiCol>
          <BiCol>
            <BiTableSearchBtns @searchReset='searchReset' @searchQuery='searchQuery' :isAdvanced='false'/>
          </BiCol>
        </a-row>
      </a-form-model>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="()=>{modal.visible=true}">新增</a-button>
        <a-button type="primary" icon="delete" @click="batchDel1('id')">删除</a-button>
      <!-- <a-button type="primary" icon="upload" @click="uploadBatch">批量上传</a-button>
      <a-button type="primary"  @click="uploadBatch">下载模版</a-button> -->
      <a-button type="primary" icon="download" @click="handleExportXls('净值管理')">下载模板</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
          <a-button type="primary" icon="import">批量上传</a-button>
      </a-upload>
    </div>
    <a-table class="table-min-height"
        ref="table"
        size="middle"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource1"
        :pagination="ipagination1"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange1">
        <template slot="operation" slot-scope="text, record">
          <div class="editable-row-operations">
            <span>
              <a @click="edit(record)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm
                title="确认删除吗?" @confirm="()=>handleDelete1({ id:(+record.id)})"
              >
                <a href="#">删除</a>
              </a-popconfirm>
            </span>
          </div>
        </template>
      </a-table>
    <BiModal
      :visible.sync="modal.visible"
      :width="600"
      :title="modal.title"
      :fullscreen.sync="modal.fullscreen"
      :switchFullscreen="modal.switchFullscreen"
      @handleOk='handleOk'
      :confirmLoading='modal.confirmLoading'
    >
      <a-form-model :labelCol='labelCol' :wrapperCol='wrapperCol' ref="form" :model="form" :rules="rules">
        <BiFormItemSelect label="资产名称" :options="pros" v-model="form.proCode" name='proCode' :showSearch='true'/>
        <BiFormItemNumPercent label="单位净值" v-model="form.aprice" name='aprice' :min="0" :precision="4"/>
        <BiFormItemDatePicker label="净值日期" name="priceDt" dateFormat='YYYY-MM-DD' v-model="form.priceDt"/>
      </a-form-model>
    </BiModal>
  </a-card>
</template>

<script>
  import { filterObj } from '@/utils/util';
  import biTableMixin from '@mixins/biTableMixin'
  import { addPrice,editPrice,getProducts } from '@/api/BiApi'
  import dictMixin from '@mixins/dictMixin'
  import {getAction, postAction, deleteActionByPostMethod,downFile} from '@/api/manage'
  export default {
    name: "NetValueList",
    components: {
    },
    mixins: [dictMixin,biTableMixin],
    data () {
      return {
        queryParam:{},
        dataSource1:[],
        ipagination1:{
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        /* table加载状态 */
        loading:false,
        /* table选中keys*/
        selectedRowKeys: [],
        /* table选中records*/
        selectionRows: [],
        net:{},
        // 表头
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',
            width: 90,
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '资产名称',
            width: '150',
            dataIndex: 'proName',
          },
          {
            title: '收益率类型',
            dataIndex: 'incomeType',
            width: '100',
            customRender: (text) => this.getDictNameByCode(this.dicts.INCOME_TYPE,text)
          },
          {
            title: '单位净值',
            dataIndex: 'aprice',
            width: '100',
          },
          {
            title: '单位净值日期',
            dataIndex: 'priceDt',
            width: '150',
          },
          {
            title: '操作',
            width: '150',
            scopedSlots: { customRender: 'operation' }
          }
          
        ],
        url: {
          list: "/proPrices/list",
          delete: "/proPrices/delete",
          deleteBatch: "/proPrices/deleteBatch",
          exportXlsUrl: "proPrices/exportXlsTemplate",
          importExcelUrl: "proPrices/importExcelTemplate",
        },
        modal: {
          title: '维护价格-手动新增/编辑',
          visible: false,
          fullscreen: false,
          switchFullscreen: false,
          confirmLoading: false,
        },
        form: {
          proCode: '',
          aprice: '',
          priceDt: '',
        },
        rules: {
          proCode: [
            { required: true, message: '请选择资产名称', trigger: 'change' },
          ],
          aprice: [
            { required: true, message: '请输入单位净值', trigger: 'input' },
          ],
          priceDt: [
            { required: true, message: '请选择净值日期', trigger: 'change' },
          ],
        },
        labelCol: { span: 5 },
        wrapperCol: { span: 14 },
        pros: [],
      }
    },
    methods: {
      searchQuery() {
        this.loadNetData(1);
      },

      // 重置
      searchReset() {
        this.queryParam = {}
        this.loadNetData(1);
      },

      loadNetData(arg) {
        if(!this.url.list){
          this.$message.error("请设置url.list属性!")
          return
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination1.current = 1;
        }
        var params = this.getQueryParams();//查询条件
        this.loading = true;
        getAction(this.url.list, params).then((res) => {
          if (res.success && res.result) {
            this.dataSource1 = res.result.records;
            this.ipagination1.total = res.result.total;
          }
          if(res.code===510){
            this.$message.warning(res.message)
          }
        })
        this.loading = false;
      },
      getQueryParams() {
        //获取查询条件
        let sqp = {}
        if(this.superQueryParams){
          sqp['superQueryParams']=encodeURI(this.superQueryParams)
        }
        var param = Object.assign(sqp, this.queryParam, this.isorter ,this.filters);
        param.removeYn='N';
        param.pageNo = this.ipagination1.current;
        param.pageSize = this.ipagination1.pageSize;
        return filterObj(param);
      },

      handleTableChange1(pagination, filters, sorter) {
        //分页、排序、筛选变化时触发
        //TODO 筛选
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field;
          this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
        }
        this.ipagination1 = pagination;
        this.loadNetData();
      },
      async handleDelete1(param) {
        const res = await deleteActionByPostMethod(this.url.delete, param)
        if (res.success) {
          this.$message.success('删除成功');
          this.loadNetData();
        } else {
          this.$message.warning(res.message);
        }
      },
      /* 导入 */
      handleImportExcel(info){
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          if (info.file.response.success) {
            // this.$message.success(`${info.file.name} 文件上传成功`);
            if (info.file.response.code === 201) {
              let { message, result: { msg, fileUrl, fileName } } = info.file.response
              let href = window._CONFIG['domianURL'] + fileUrl
              this.$warning({
                  title: message,
                  content: (
                  <div>
                  <span>{msg}</span><br/>
                  <span>具体详情请 <a href={href} target="_blank" download={fileName}>点击下载</a> </span>
                </div>
              )
            })
            } else {
              this.$message.success(info.file.response.message || `${info.file.name} 文件上传成功`)
            }
            this.loadNetData()
          } else {
            this.$message.error(`${info.file.name} ${info.file.response.message}.`);
          }
        } else if (info.file.status === 'error') {
          this.$message.error(`文件上传失败: ${info.file.msg} `);
        }
      },
      handleExportXls(fileName){
        if(!fileName || typeof fileName != "string"){
          fileName = "导出文件"
        }
        let param = {...this.queryParam};
        console.log("导出参数",param)
        downFile(this.url.exportXlsUrl,param).then((data)=>{
          if (!data) {
            this.$message.warning("文件下载失败")
            return
          }
          if (typeof window.navigator.msSaveBlob !== 'undefined') {
            window.navigator.msSaveBlob(new Blob([data],{type: 'application/vnd.ms-excel'}), fileName+'.xls')
          }else{
            let url = window.URL.createObjectURL(new Blob([data],{type: 'application/vnd.ms-excel'}))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', fileName+'.xls')
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link); //下载完成移除元素
            window.URL.revokeObjectURL(url); //释放掉blob对象
          }
        })
      },
      batchDel1: function (key) {
        if(!this.url.deleteBatch){
          this.$message.error("请设置url.deleteBatch属性!")
          return
        }
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！');
          return;
        } else {
          var ids = "";
          let param = {}
          for (var a = 0; a < this.selectedRowKeys.length; a++) {
            ids += this.selectedRowKeys[a] + ",";
          }
          key = key || 'ids'
          param[key] = ids
          var that = this;
          this.$confirm({
            title: "确认删除",
            content: "是否删除选中数据?",
            onOk: function () {
              that.loading = true;
              deleteActionByPostMethod(that.url.deleteBatch, param).then((res) => {
                if (res.success) {
                  that.$message.success(res.message);
                  that.loadNetData();
                  that.onClearSelected();
                } else {
                  that.$message.warning(res.message);
                }
              }).finally(() => {
                that.loading = false;
              });
            }
          });
        }
      },
      async handleOk() {
        this.$refs.form.validate( async(valid) => {
          if (valid) {
            this.modal.confirmLoading = true
            if (this.form.id) {
              this.net.proCode=this.form.proCode;
              this.net.aprice=this.form.aprice;
              this.net.priceDt=this.form.priceDt;
            }
            const res = this.form.id ? await editPrice(this.net) : await addPrice(this.form)
             if (res.success) {
              this.modal.confirmLoading = false
              this.modal.visible = false
              this.form = {
                proCode: '',
                aprice: '',
                priceDt: '',
              }
               this.net = Object.assign({},{});
               this.$message.success('操作成功');
               this.loadNetData()
             }else {
               this.$message.error(res.message);
             }
          }
        });
      },
      edit(item) {
        this.net = Object.assign({}, item);
        this.modal.visible = true
        this.form = {
          id: +item.id,
          proCode: item.proCode,
          aprice: item.aprice,
          priceDt: item.priceDt,
        }
      },
      async getProducts() {
        const res = await getProducts({ pageSize:999,channel:'O',incomeType:'3'})
        if (res.success) {
          this.pros = res.result.records.map(pro=>{
            return {
              name: pro.proName,
              value: pro.proCode
            }
          })
        }
      },
      uploadBatch() {
        this.$message.warning('此功能待开发')
      },
      changeFlowDate (val) {
        this.$set(this.queryParam,'priceDtStart',val[0]|| '')
        this.$set(this.queryParam,'priceDtEnd',val[1]|| '')
      },
    },
    created(){
      this.loadNetData()
    },
    watch: {

    },
    mounted(){
      this.getDict('INCOME_TYPE')
      this.getProducts()
    }
  }
</script>

<style lang="stylus" scoped>
@import '~@assets/less/common.less'
</style>