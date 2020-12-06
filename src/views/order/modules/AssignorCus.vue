
/**
  转让方子账户
 */
<template>
  <a-form-model ref="counterPartyForm" :model="form" :rules="rules">
    <a-card  style="margin-top: 12px" :bordered="false" title="转让方子账户">
      <a-row>
        <BiCol :md='{span:12,offset:1}' :lg='{span:12,offset:1}' :xl='{span:12,offset:1}'>
          <BiFormItemSelect :disabled="disabled" :options="cusAccInfoList" customKey="accNo" customVal="accName"  label="转让方子账户" name="accNo"  v-model="form.accNo" @change="changeAccNo"  showSearch/>
        </BiCol>
        <BiCol :md='{span:12,offset:1}' :lg='{span:12,offset:1}' :xl='{span:12,offset:1}'>
          <BiFormItemSelect :disabled="disabled" :options="bnfPros" customKey="proCode" customVal="proName"  label="转移资产" name="proCode"  v-model="form.proCode" @change="changeProCode"  showSearch/>
        </BiCol>
      </a-row>
      <a-table
        ref="table"
        size="small"
        rowKey="id"
        :columns="prosColumns"
        :dataSource="bnfPros"
        :pagination="true"
      >
        <template slot="action" slot-scope="text, record,index">
          <div class="editable-row-operations">
            <span>
              <a-popconfirm
                title="确认删除吗?"
                @confirm="()=>handleDelete(index)"
              >
                <a href="#">删除</a>
              </a-popconfirm>
            </span>
          </div>
        </template> 
      </a-table>
      <a-table
        ref="table"
        size="small"
        rowKey="id"
        :columns="bnfColumns"
        :dataSource="form.selectedBnf"
        :pagination="true"
      >
        <template slot="tranAmt" slot-scope="text, record,index">
          <a-input-number
            :disabled="disabled"
            style="margin: -5px 0"
            placeholder="请输入"
            :value="text"
            @change="e => handleChange(e,col,index)"
          />
        </template> 
      </a-table>
    </a-card>
  </a-form-model>
</template>
<script>
import { mapState,mapActions } from "vuex";

export default {
  name: "AssignorCus",
  data() {
    return {
      prosColumns: [
        {
          title: '产品购买合同号',
          dataIndex: 'contractNo',
          key: 'contractNo'
        },
        {
          title: '资产代码',
          dataIndex: 'proCode',
          key: 'proCode'
        },
        {
          title: '资产名称',
          dataIndex: 'proName',
          key: 'proName'
        },
        {
          title: '是否计信托份额',
          dataIndex: 'defaultYn',
          key: 'defaultYn',
        },
        {
          title: '价值金额',
          dataIndex: 'invAmt',
          key: 'invAmt'
        },
        {
          title: '交易金额',
          dataIndex: 'tranAmt',
          key: 'tranAmt'
        },
         {
          title: '操作',
          dataIndex: 'action',
          // fixed: 'right',
          scopedSlots: { customRender: 'action' },
        }
      ],
      // bnfPros: [], // 转移的资产
      // bnfs: [], // 转出的受益人
      bnfColumns: [
        {
          title: '受益人',
          dataIndex: 'contractNo',
          key: 'contractNo'
        },
        {
          title: '持有金额',
          dataIndex: 'defaultYn',
          key: 'defaultYn',
        },
        {
          title: '可用金额',
          dataIndex: 'invAmt',
          key: 'invAmt'
        },
        {
          title: '交易金额',
          dataIndex: 'tranAmt',
          key: 'tranAmt',
          scopedSlots: { customRender: 'tranAmt' },
        },
      ],
      form:{
        accNo: '',
        selectedBnf: []
      },
      rules:{
        accNo: [
          { required: true, message: '请选择转让方子账户', trigger: 'change' },
        ],
        selectedBnf: [
          { required: true, message: '请选择转移资产', trigger: 'change' },
        ],
      }
    }
  },
  computed: {
    ...mapState("order", ['cusAccInfoList','bnfs','bnfPros'
    ]),
  },
  components: {
  
  },
  props: {
    disabled: {
      default: false
    }
  },
  methods: {
    ...mapActions("order",["findProByPrjCode","findBnfByPrjCode",]),
    handleDelete(index) {

    },
    handleChange() {

    },
    changeAccNo( accNo) {
      const target = this.cusAccInfoList.filter(item => accNo === item.accNo)[0];
      let param = {prjCode:target.prjCode,accNo}
      // 受益人间份额转让测试数据
      // param.accNo= "0100202019s5MvXACC-0"
      // param.prjCode= "0100202019s5MvX"
      this.findProByPrjCode(param)
      this.findBnfByPrjCode(param)
    },
    changeProCode( selected ){
      let selectedBnf = []
      this.bnfPros.forEach(pro=>{
        selected.forEach(item=>{
          if(pro.proCode == item.proCode){
            selectedBnf.push(pro)
          }
        })
      })
      this.form.selectedBnf = selectedBnf
    }
  },
  created(){
  }
 
}
</script>
<style lang="stylus" scoped>

</style>