/**
 * data中url定义 list为查询列表  delete为删除单条记录  deleteBatch为批量删除,
 *    reovkeDataUrl为撤销，exportXlsUrl导出， importExcelUrl导入
 */
import { filterOb,formatAmt } from '@/utils/util';

import { deleteActionByPostMethod, getAction,downFile } from '@/api/manage'
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"

export default {
  data(){
    return {
      //token header
      tokenHeader: {'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)},
      /* 查询条件-请不要在queryParam中声明非字符串值的属性 */
      queryParam: {},
      /* 数据源 */
      dataSource:[],
      /* 分页参数 */
      ipagination:{
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
      /* 排序参数 */
      isorter:{
        column: 'createTime',
        order: 'desc',
      },
      /* 筛选参数 */
      filters: {},
      /* table加载状态 */
      loading:false,
      /* table选中keys*/
      selectedRowKeys: [],
      /* table选中records*/
      selectionRows: [],
      /* 查询折叠 */
      toggleSearchStatus:false,
      /* 高级查询条件生效状态 */
      superQueryFlag:false,
      /* 高级查询条件 */
      superQueryParams:""
    }
  },
  created() {
    if(!this.disableMixinCreated){
      this.loadData();
      //初始化字典配置 
      // this.initDictConfig();
    }
  },
  methods:{
    // 格式话金额
    formatAmt(amt,decimals=2){
      return formatAmt(amt,decimals)
    },
    async loadData(arg) {
      if(!this.url.list){
        this.$message.error("请设置url.list属性!")
        return
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1;
      }
      // var params = this.getQueryParams();//查询条件
      var params = this.queryParam
      params.pageNo = this.ipagination.current;
      params.pageSize = this.ipagination.pageSize;
      this.loading = true;
      const res = await getAction(this.url.list, params)
      if (res.success) {
        this.dataSource = res.result.records;
        this.ipagination.total = res.result.total;
      }
      if(res.code===510){
        this.$message.warning(res.message)
      }
      this.loading = false;
    },
    // initDictConfig(){
    //   // console.log("初始化字典")
    // },
    //高级查询方法
    handleSuperQuery(arg) {
      if(!arg){
        this.superQueryParams=''
        this.superQueryFlag = false
      }else{
        this.superQueryFlag = true
        this.superQueryParams=JSON.stringify(arg)
      }
      this.loadData()
    },
    getQueryParams() {
      //获取查询条件
      let sqp = {}
      if(this.superQueryParams){
        sqp['superQueryParams']=encodeURI(this.superQueryParams)
      }
      var param = Object.assign(sqp, this.queryParam, this.isorter ,this.filters);
      param.field = this.getQueryField();
      param.pageNo = this.ipagination.current;
      param.pageSize = this.ipagination.pageSize;
      return filterObj(param);
    },
    getQueryField() {
      //TODO 字段权限控制
      var str = "id,";
      this.columns.forEach(function (value) {
        str += "," + value.dataIndex;
      });
      return str;
    },
    // 选择
    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectionRows = selectionRows;
    },
    // 清楚已选
    onClearSelected() {
      this.selectedRowKeys = [];
      this.selectionRows = [];
    },
    // 搜索
    searchQuery() {
      this.loadData(1);
    },
    // enter键搜索
    enterKeySearch(e) {
      if (e.keyCode == 13) {
        this.searchQuery()
      }
    },
    // 高级搜索弹窗
    superQuery() {
      this.$refs.superQueryModal.show();
    },
    // 重置
    searchReset() {
      this.queryParam = {}
      this.loadData(1);
    },
    // 批量删除
    batchDel(key) {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！');
        return;
      } else {
        let ids = "";
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
          onOk: async function () {
            that.loading = true;
            const res = await deleteActionByPostMethod(that.url.deleteBatch, param)
              if (res.success) {
                that.$message.success(res.message);
                that.loadData();
                that.onClearSelected();
              } else {
                //this.$message.warning(res.message); 异常由后端统一处理
              }
              that.loading = false;
          }
        });
      }
    },
    // 删除
    async handleDelete(param) {
      const res = await deleteActionByPostMethod(this.url.delete, param)
        if (res.success) {
          this.$message.success('删除成功');
          this.loadData();
        } else {
          //this.$message.warning(res.message); 异常由后端统一处理
        }
    },
    // 编辑弹窗
    handleEdit: function (record) {
      this.$refs.modalForm.edit(record);
      this.$refs.modalForm.title = "编辑";
      this.$refs.modalForm.disableSubmit = false;
    },
    // 增加弹窗
    handleAdd: function () {
      this.$refs.modalForm.add();
      
      this.$refs.modalForm.title = "新增";
      this.$refs.modalForm.visible = true;
      
      this.$refs.modalForm.disableSubmit = false;
    },
    handleTableChange(pagination, filters, sorter) {
      //分页、排序、筛选变化时触发
      //TODO 筛选
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field;
        this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
      }
      this.ipagination = pagination;
      this.loadData();
    },
    handleToggleSearch(){
      this.toggleSearchStatus = !this.toggleSearchStatus;
    },
    // 新增/修改 成功时，重载列表
    modalFormOk() {
      this.loadData();
    },
    // 弹窗详情
    handleDetail:function(record){
      this.$refs.modalForm.edit(record);
      this.$refs.modalForm.title="详情";
      this.$refs.modalForm.disableSubmit = true;
    },
    /* 导出 */
    handleExportXls2(){
      let paramsStr = encodeURI(JSON.stringify(this.getQueryParams()));
      let url = `${window._CONFIG['domianURL']}/${this.url.exportXlsUrl}?paramsStr=${paramsStr}`;
      window.location.href = url;
    },
    handleExportXls(fileName){
      if(!fileName || typeof fileName != "string"){
        fileName = "导出文件"
      }
      let param = {...this.queryParam};
      if(this.selectedRowKeys && this.selectedRowKeys.length>0){
        param['selections'] = this.selectedRowKeys.join(",")
      } else {
        this.$message.warning('请选择导出项')
        return
      }
      // console.log("导出参数",param)
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
    /* 导入 */
    handleImportExcel(info){
      if(typeof this.beforeImport === 'function'){
        this.beforeImport(info)
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
          this.loadData()
        } else {
          this.$message.error(`${info.file.name} ${info.file.response.message}.`);
        }
        if(typeof this.afterImport === 'function'){
          this.afterImport(info)
        }
      } else if (info.file.status === 'error') {
        this.$message.error(`文件上传失败: ${info.file.msg} `);
      }
    },
    /* 图片预览 */
    getImgView(text){
      if(text && text.indexOf(",")>0){
        text = text.substring(0,text.indexOf(","))
      }
      return window._CONFIG['staticDomainURL']+"/"+text
    },
    /* 文件下载 */
    uploadFile(text){
      if(!text){
        this.$message.warning("未知的文件")
        return;
      }
      if(text.indexOf(",")>0){
        text = text.substring(0,text.indexOf(","))
      }
      window.open(window._CONFIG['staticDomainURL']+ "/"+text);
    },
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
}