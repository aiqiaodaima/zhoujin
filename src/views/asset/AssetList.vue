<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form-model layout="inline">
        <a-row :gutter="16">
          <BiCol>
            <BiFormItemInput label="资产名称" v-model="queryParam.proName" @pressEnter="enterKeySearch" placeholder="请输入资产名称"/>
          </BiCol>
          <BiCol>
            <BiFormItemSelect :options="proAssetcats" label="资产类别" name="assetcatCode" v-model="queryParam.assetcatCode" />
          </BiCol>
          <template v-if="advanced">
            <BiCol>
              <BiFormItemSelect :options="admOrgnaiztions" label="发行机构"  v-model="queryParam.issuerCode" />
            </BiCol>
            <BiCol>
              <BiFormItemSelect :options="dicts.PRO_CHANNEL" label="资产归属" v-model="queryParam.channel" />
            </BiCol>
          </template>
          <BiCol>
            <BiTableSearchBtns @searchReset='searchReset' @searchQuery='searchQuery' v-model='advanced'/>
          </BiCol>
        </a-row>
      </a-form-model>
    </div>

    <div class="table-operator">
      <a-button type="primary" v-has="'asset:add'" icon="plus" @click="() => $router.push({name: 'assetNew',query:{title:'新增资产'}})">新增资产</a-button>
      <a-button type="primary" v-has="'asset:del'" icon="delete" @click="batchDelPro('proCodes')">删除资产</a-button>
      <a-button type="primary" v-has="'asset:netValue'"  @click="matchNet()">维护净值</a-button>
      <a-button type="primary" v-has="'asset:openRule'" @click="matchOpenRule()">维护开放期</a-button>
      <a-button type="primary" v-has="'asset:bonusRule'" @click="matchBonusRule()">维护分红</a-button>
      <a-button type="primary" v-has="'asset:add'" icon="plus" @click="handleAdd('GQ')">新增非上市公司股权</a-button>
      <a-button type="primary" v-has="'asset:add'" icon="plus" @click="handleAdd('JJ')">新增非私募基金类有限合伙公司</a-button>
    </div>
    <div>
      <a-table class="table-min-height"
        ref="table"
        size="middle"
        :scroll="{ x: 1500,y: 400 }"
        rowKey="proCode"
        bordered
        :columns="columns"
        :dataSource="dataSource1"
        :pagination="ipagination1"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, selectionRows:selectionRows, onChange: onSelectChange}"
        @change="handleTableChange1">
        <template slot="action" slot-scope="text, record">
          <div class="editable-row-operations">
            <span>
              <a  @click="viewPro(record)">查看</a>
              <a-divider v-has="'assetList:edit'" v-if="record.status!=='A'" type="vertical" />
              <a v-if="record.status!=='A'"  v-has="'assetList:edit'"  @click="editPro(record)">编辑</a>
              <a-divider v-has="'assetList:del'" v-if="record.status!=='A'" type="vertical" />
              <a-popconfirm v-if="record.status!=='A'"
                title="确认删除吗?"
                @confirm="()=>handleDeletePro(record)"
              >
                <a v-has="'assetList:del'" href="#">删除</a>
              </a-popconfirm>
              <!-- <a class="delete" @click="() => handleDelete({proCode:record.proCode})">删除</a> -->
            </span>
            <br/>
            <span v-if="record.status==='N'">未提交
            </span>
            <a-divider v-has="'assetList:commit'" v-if="record.status!=='A'" type="vertical" />
            <span v-if="record.status==='N'">
              <a-popconfirm
                title="确认提交投资经理复核吗?"
                @confirm="()=>proChange(record)"
              >
                <a v-has="'assetList:commit'" href="#">提交复核</a>
              </a-popconfirm>
            </span>
            <span v-else-if="record.status==='U'">未录入完整
              <a @click="check(record)">?</a>
            </span>
            <span v-else-if="record.status==='A'">审核中
            </span>
            <span v-else-if="record.status==='R'">审核退回
            </span>
            <span v-else="record.status==='C'">录入完整
            </span>
          </div>
        </template> 
      </a-table>
    </div>
    <WkfNextUserModal ref="wkfUserForm" @complete="wkfUserComplete"/>

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
        <BiFormItemInput  label="资产名称" name="proName" v-model="form.proName" disabled="disabled"/>
        <BiFormItemNumPercent label="单位净值" v-model="form.aprice" name='aprice' :min="0" :precision="4"/>
        <BiFormItemDatePicker label="净值日期" name="priceDt" dateFormat='YYYY-MM-DD' v-model="form.priceDt"/>
      </a-form-model>
    </BiModal>

    <stock-new ref="modalForm"    @ok="modalFormOk" @addShowChild="addShowChild" @addChild="addChild"  @editChild="editChild" @viewChild="viewChild" ></stock-new>
  </a-card>
</template>

<script>
  import { filterObj } from '@/utils/util';
  import biTableMixin from '@mixins/biTableMixin'
  import { getDict } from '@/api/BiApi'
  import dictMixin from '@mixins/dictMixin'
  import {getAction, postAction, deleteActionByPostMethod} from '@/api/manage'
  import {proChange,addPrice,checkContent} from '@/api/BiApi'
  import WkfNextUserModal from '@views/activiti/modules/WkfNextUserModal';
  import StockNew from './StockNew'
  export default {
    name: "AssetList",
    components: {
      StockNew,
      WkfNextUserModal,
    },
    mixins:[biTableMixin,dictMixin],
    inject:['closeCurrent'],
    props:{
      comParam:{
        type:Object,
        default:()=>{}
      }
    },
    watch: {
      comParam: {
        immediate: true,
        deep: true,
        handler() {
          console.log("回调。。。。。"+this.comParam)
          this.loadAssetData(1);
        }
      }
    },
    data () {
      return {
        sonRefresh:true,
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
        // 高级搜索 展开/关闭
        advanced: false,
        // 表头
        columns: [
          {
            title: '资产性质',
            dataIndex: 'productNature',
            width: '150px',
            customRender: (text) => this.getDictNameByCode(this.dicts.ASSET_ZCXZ,text)
          },
          {
            title: '资产代码',
            dataIndex: 'bankProCode',
            width: 150
          },
          {
            title: '资产名称',
            width: '150px',
            dataIndex: 'proName',
          },
          {
            title: '发行机构',
            dataIndex: 'issuerCode',
            width: '150px',
            customRender: (text) => this.getDictNameByCode(this.admOrgnaiztions,text)
          },
          {
            title: '资产类别',
            dataIndex: 'assetcatCode',
            width: '100px',
            customRender: (text) => this.getDictNameByCode(this.proAssetcats,text)
          },
          {
            title: '币种',
            dataIndex: 'curCode',
            width: '100px',
            customRender: (text) => this.getDictNameByCode(this.dicts.CUR_CODE,text)
          },
          {
            title: '风险等级',
            dataIndex: 'riskCode',
            width: '100px',
            customRender: (text) => this.getDictNameByCode(this.dicts.PRO_RISK_CODE,text)
          },
          {
            title: '成立日',
            dataIndex: 'proStdDt',
            width: '150px',
          },
          {
            title: '终止日',
            dataIndex: 'proEndDt',
            width: '150px',
          },
          {
            title: '预期收益率（%）',
            dataIndex: 'expReturnRate',
            width: '200px',
          },
          {
            title: '最新单位净值（净值日）',
            dataIndex: 'aprice',
            width: '200px',
          },
          {
            title: '资产归属',
            dataIndex: 'channel',
            width: '100px',
            customRender: (text) => this.getDictNameByCode(this.dicts.PRO_CHANNEL,text)
          },
          {
            title: '创建人',
            dataIndex: 'createBy',
            width: '100px',
          },
          {
            title: '创建时间',
            dataIndex: 'createDt',
            width: '200px',
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: '150px',
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/products/list",
          delete: "/products/delete",
          deleteBatch: "/products/deleteBatch",
          exportXlsUrl: "proPrices/exportXlsTemplate",
          importExcelUrl: "proPrices/importExcelTemplate",
        },
        modal: {
          title: '维护净值',
          visible: false,
          fullscreen: false,
          switchFullscreen: false,
          confirmLoading: false,
        },
        form: {
          proCode: '',
          proName:'',
          aprice: '',
          priceDt: '',
        },
        rules: {
          aprice: [
            { required: true, message: '请输入单位净值', trigger: 'input' },
          ],
          priceDt: [
            { required: true, message: '请选择净值日期', trigger: 'change' },
          ],
        },
        labelCol: { span: 5 },
        wrapperCol: { span: 14 },
      }
    },
    methods: {
      handleAdd(type){
        this.$refs.modalForm.add(type);
      },
      addChild:function(proCode,type){
        this.$refs.modalForm.addChild(proCode,type);
          },
      editChild:function(proCode,type){
        this.$refs.modalForm.editChild(proCode,type);
      },
      addShowChild:function(proCode,type){
        this.$refs.modalForm.addShowChild(proCode,type);
      },
      viewChild:function(proCode,type){
        this.$refs.modalForm.viewChild(proCode,type);
      },
      editPro(record){
        if (record.productNature=='GQ'){
          this.$refs.modalForm.edit(record);
        }else if (record.productNature=='JJ'){
          this.$refs.modalForm.edit(record);
        }
        else{
          this.$router.push({name: 'assetNew',query:{proCode:record.proCode,title:'编辑资产'}})
        }
      },
      viewPro(record){
        if (record.productNature=='GQ'){
          this.$refs.modalForm.view(record);
        }
        else if (record.productNature=='JJ'){
          this.$refs.modalForm.view(record);
        }
        else{
          this.$router.push({name: 'assetDetail',query:{proCode:record.proCode,title:'查看资产'}})
        }
      },
      searchQuery() {
        this.loadAssetData(1);
      },

      // 重置
      searchReset() {
        this.queryParam = {}
        this.loadAssetData(1);
      },
      loadAssetData(arg) {
        if(!this.url.list){
          this.$message.error("请设置url.list属性!")
          return
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination1.current = 1;
        }
         var params = this.getQueryParams();//查询条件
        // var params = this.queryParam;
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
        this.loadAssetData();
      },
      //提交复核
      async proChange(record){
        const { result } = await proChange({proCode:record.proCode})
        this.$message.success('提交成功')
        //审核单选择审核人
        if(result.processId){
          this.$refs.wkfUserForm.edit(result.processId);
          this.$refs.wkfUserForm.disableSubmit = false;
        }
      },


      initDictConfig () {
        let promises = [this.getProAssetcats(),
          
          this.getDict('PRO_CHANNEL,CUR_CODE,PRO_RISK_CODE,ASSET_ZCXZ')
        ]
        Promise.all(promises).then(()=>{
          // this.loadData()
        })
      },
      async matchOpenRule () {
        if( !this.selectedRowKeys.length ){
          this.$message.warn('请选择一条记录')
          return
        }else if (this.selectedRowKeys.length>1) {
          this.$message.warn('只能选择一条记录')
          return
        }
        if (this.selectionRows[0].channel =='I' || this.selectionRows[0].redeemType =='1' ||this.selectionRows[0].redeemType =='2' ||this.selectionRows[0].redeemType =='3'){
          this.$message.warn('只维护资产归属为外部、且赎回方式为定期开放赎回或封闭期满定期开放赎回的资产')
          return
        }

        this.$router.push({name:'addOpenRule', query: {asset_proName:this.selectionRows[0].proName, asset_proCode:this.selectionRows[0].proCode ,asset_bankProCode: this.selectionRows[0].bankProCode,title:'维护开放期'}});
      },

      async matchNet(){
        if( !this.selectedRowKeys.length ){
          this.$message.warn('请选择一条记录')
          return
        }else if (this.selectedRowKeys.length>1) {
          this.$message.warn('只能选择一条记录')
          return
        }
        if (this.selectionRows[0].channel !='O' || this.selectionRows[0].incomeType !='3'){
          this.$message.warn('只维护资产归属为外部且净值型产品价格')
          return
        }
        this.form.proCode=this.selectionRows[0].proCode;
        this.form.proName=this.selectionRows[0].proName;
        this.modal.visible=true

      },
      async handleOk() {
        this.$refs.form.validate( async(valid) => {
          if (valid) {
            this.modal.confirmLoading = true
            const res = await addPrice(this.form)
            if (res.success) {
              this.modal.confirmLoading = false
              this.modal.visible = false
              this.form = {
                proCode: '',
                aprice: '',
                priceDt: '',
                proName:'',
              }
              this.$message.success('操作成功');
              this.closeCurrent()
              this.$router.replace({ name:'netValueList' })
            }else {
              this.$message.error(res.message);
            }
          }
        });
      },


      async matchBonusRule () {
        if( !this.selectedRowKeys.length ){
          this.$message.warn('请选择一条记录')
          return
        }else if (this.selectedRowKeys.length>1) {
          this.$message.warn('只能选择一条记录')
          return
        }
        if (this.selectionRows[0].intType !='P'){
          this.$message.warn('只维护付息方式为固定期间付息的资产')
          return
        }
        this.$router.push({name:'bonusRuleNew', query: {asset_proName:this.selectionRows[0].proName, asset_proCode:this.selectionRows[0].proCode ,asset_bankProCode: this.selectionRows[0].bankProCode, asset_headAndTailProcessing:this.selectionRows[0].headAndTailProcessing,title:'维护分红'}});
      },
      wkfUserComplete () {
        this.$nextTick(() => {
          this.$router.push({path:"/wkf/dashbord"});
        });
      },
     async check(record){
        const res = await checkContent({ proCode:record.proCode})
        if (res.success){
          if (res.message=='openRule') {
            this.$message.warn("未录入开放期规则");
          }
        else  if (res.message=='bonusRule') {
            this.$message.warn("未录入分红规则");
          }
       else if (res.message=='all') {
            this.$message.warn("未录入开放期规则和分红规则");
          }
          else{
            this.$message.warn("必填字段未录入完整");
          }
        }
      },
      handleDeletePro(record){
        let that = this;
        //如果资产归属为内部的不能删除
        if (record.channel=='I'){
          that.$message.warn("内部资产不能删除");
          return
        }
        let p={proCode:record.proCode};
        that.loading = true;
        deleteActionByPostMethod(that.url.delete, p).then((res)=>{
          if(res.success){
            that.$message.success("删除成功");
            that.loadAssetData();
          }else{
            //返回状态为500时已经作统一拦截处理  此处不再处理
            // that.$message.error(res.message);
          }
        }).finally(()=>{
          that.loading = false;
        });
      },



      modalFormOk(){
        this.loadAssetData();
      },
      batchDelPro: function (key) {
        if(!this.url.deleteBatch){
          this.$message.error("请设置url.deleteBatch属性!")
          return
        }
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！');
          return;
        } else {

          //如果选中的数据中包含内部资产 则不能删除
          for (var i = 0; i < this.selectionRows.length; i++) {
            if (this.selectionRows[i].channel=='I'){
              this.$message.warn("内部资产不能删除");
              return
            }
          }


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
                  that.loadAssetData();
                  that.onClearSelected();
                } else {
                  //返回状态为500时已经作统一拦截处理  此处不再处理
                  // that.$message.warning(res.message);
                }
              }).finally(() => {
                that.loading = false;
              });
            }
          });
        }
      },
    },
    watch: {
    },
    mounted () {
      this.getAdmOrgnaiztionInfo({pageSize:999,orgType:'PS'})
    },
    created () {
      this.loadAssetData()
      this.initDictConfig()
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@assets/less/common.less'

</style>