<template>
  <div>
    <a-row :gutter="16">
      <a-col :span="12">
        <a-card title="快捷方式" :bordered="false">
          <a-row :gutter="16">
            <a-col :span="6">
              <div class="shortcut" @click="() => $router.replace({path: '/customer/customer'})">
                <div class="item-icon"
                     :style="{backgroundImage: `url(${require('../assets/'+iconColor+'/inspect.png')})`}"></div>
                <div class="item-name">尽职调查</div>
              </div>
            </a-col>
            <a-col :span="6">
              <div
                class="shortcut"
                @click="() => $router.replace({path: '/prj/setup?optType=ADD'})"
              >
                <div class="item-icon project"
                     :style="{backgroundImage: `url(${require('../assets/'+iconColor+'/project.png')})`}"></div>
                <div class="item-name">项目设立</div>
              </div>
            </a-col>	
            <a-col :span="6" @click="() => $router.replace({path: '/order/prj/add'})">
              <div class="shortcut">
                <div class="item-icon entrust"
                     :style="{backgroundImage: `url(${require('../assets/'+iconColor+'/entrust.png')})`}"></div>
                <div class="item-name">追加委托</div>
              </div>
            </a-col>
            <a-col :span="6">
              <div
                class="shortcut"
                @click="() => $router.replace({path: '/order/distributeManage'})"
              >
                <div class="item-icon distribute"
                     :style="{backgroundImage: `url(${require('../assets/'+iconColor+'/distribute.png')})`}"></div>
                <div class="item-name">分配处理</div>
              </div>
            </a-col>
            <a-col :span="6">
              <div class="shortcut" @click="() => $router.replace({path: '/assetNew'})">
                <div class="item-icon decision"
                     :style="{backgroundImage: `url(${require('../assets/'+iconColor+'/decision.png')})`}"></div>
                <div class="item-name">资产维护</div>
              </div>
            </a-col>
            <a-col :span="6">
              <div class="shortcut" @click="() => $router.replace({path: '/order/createOrder'})">
                <div class="item-icon subscribe"
                     :style="{backgroundImage: `url(${require('../assets/'+iconColor+'/subscribe.png')})`}"></div>
                <div class="item-name">认购</div>
              </div>
            </a-col>
            <a-col :span="6">
              <div class="shortcut" @click="() => $router.replace({path: '/order/createRedeem'})">
                <div class="item-icon redeem"
                     :style="{backgroundImage: `url(${require('../assets/'+iconColor+'/redeem.png')})`}"></div>
                <div class="item-name">赎回</div>
              </div>
            </a-col>
            <a-col :span="6">
              <div class="shortcut" @click="() => $router.replace({path: '/letter/makeLetter'})">
                <div class="item-icon report"
                     :style="{backgroundImage: `url(${require('../assets/'+iconColor+'/report.png')})`}"></div>
                <div class="item-name">报告制作</div>
              </div>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="待办事项" :bordered="false">
          <a-row :gutter="16">
            <a-col :span="6">
              <div class="schedule" @click="handleWkf">
                <div class="item-title">待审核</div>
                <div class="item-num">{{toBeReviewed}}</div>
              </div>
            </a-col>
            <a-col :span="6">
              <div class="schedule">
                <div class="item-title">待处理</div>
                <div class="item-num">{{pending}}</div>
              </div>
            </a-col>
            <a-col :span="6">
              <div class="schedule">
                <div class="item-title">进行中</div>
                <div class="item-num black">{{haveInHand}}</div>
              </div>
            </a-col>
            <a-col :span="6">
              <div class="schedule">
                <div class="item-title">通知</div>
                <div class="item-num black">{{notice}}</div>
              </div>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
    <a-card title="经营数据概况" :bordered="false" style="margin-top:15px">
      <div slot="extra" class="extra">
        <span class="active">规模走势</span>
        <!-- <span></span> -->
      </div>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-table
            ref="table"
            size="small"
            bordered
            rowKey="YM"
            :columns="columns"
            :dataSource="tableDataSource"
            :scroll="{ y:254 }"
            :height="280"
            :pagination="false"
          >
          </a-table>
        </a-col>
        <a-col :span="12">
          <home-chart :columns="lineChartDataColumns" :rows="lineChartDataRow"/>
        </a-col>
      </a-row>


    </a-card>
  </div>
</template>

<script>
  import HomeChart from '@/components/chart/HomeChart'
  import { getAction } from '@/api/manage'
  import { mixin } from '@/utils/mixin.js'
  import { colorList } from '@/components/tools/setting'
  import { postAction } from '../api/manage'

  export default {
    name: 'Home',
    components: {
      HomeChart
    },
    mixins: [mixin],
    data() {
      return {
        // 待审核
        toBeReviewed: '0',
        // 待处理
        pending: '0',
        // 进行中
        haveInHand: '0',
        // 通知
        notice: '0',
        tableDataSource: [],
        lineChartDataRow: [],
        columns: [
          {
            key:'YM',
            title: '时间',
            dataIndex: 'YM',
            width: 50,
            sorter: (a, b) => a.YM > b.YM ? 1 : -1,
            sortDirections: ['descend'],
            defaultSortOrder : 'descend',
          },
          {
            key:'SCALEAMT',
            title: '累计规模',
            dataIndex: 'SCALEAMT',
            width: 100,
            customRender: function (t) {
              //str 字符类型的数字
              let thousandsReg = /(\d)(?=(\d{3})+$)/g;
              const numArr = t.toString().split(".");
              numArr[0] = numArr[0].replace(thousandsReg, "$1,");
              return numArr.join(".");
            }
          },
          {
            key:'NOW_SCALEAMT',
            title: '当月增加规模',
            dataIndex: 'NOW_SCALEAMT',
            width: 100,
            customRender: function (t) {
              //str 字符类型的数字
              let thousandsReg = /(\d)(?=(\d{3})+$)/g;
              const numArr = t.toString().split(".");
              numArr[0] = numArr[0].replace(thousandsReg, "$1,");
              return numArr.join(".");
            }
          },
          {
            key: 'ZSS',
            title: '累计单数',
            dataIndex: 'ZSS',
            width: 60,
            customRender: function (t) {
              //str 字符类型的数字
              let thousandsReg = /(\d)(?=(\d{3})+$)/g;
              const numArr = t.toString().split(".");
              numArr[0] = numArr[0].replace(thousandsReg, "$1,");
              return numArr.join(".");
            }
          },
          {
            key: 'NOW_ZSS',
            title: '当月新增单数',
            dataIndex: 'NOW_ZSS',
            width: 75,
            customRender: function (t) {
              //str 字符类型的数字
              let thousandsReg = /(\d)(?=(\d{3})+$)/g;
              const numArr = t.toString().split(".");
              numArr[0] = numArr[0].replace(thousandsReg, "$1,");
              return numArr.join(".");
            }
          }

        ],
        lineChartDataColumns: ['时间', '累计规模', '当月增加规模', '累计单数', '当月新增单数']
        // iconColor: CUSTOMIZE_CONFIG.iconColor || 'blueIcon'
      }
    },
    computed: {
      iconColor() {
        const c = colorList.filter(o => o.color === this.primaryColor)[0]
        return c.iconColor
      }
    },
    created() {
      this.todolist()
      this.getLeader()
    },
    methods: {
      handleWkf() {
        this.$router.push({ path: '/wkf/dashbord' })
      },
      todo() {
        this.$message.warning('此功能待开发')
      },
      //table 数据
      getLeader() {
        let that = this
        let p = { sta_dt: '', till_dts: '' }
        postAction('/Leader/getLeader', p).then((res) => {
          if (res.success) {
            this.tableDataSource = res.result.loaList
            that.setLineChartDataSource()
          } else {
            that.$message.error(res.message)
          }
        }).finally(() => {
          that.loading = false
        })
      },

      //折线图数据源初始化
      setLineChartDataSource() {
        let that = this
        let loaList = that.tableDataSource
        loaList.forEach((item, index) => {
          that.lineChartDataRow.push({
            '时间': item.YM,
            '累计规模': (item.SCALEAMT/100000000).toFixed(2),
            '当月增加规模': (item.NOW_SCALEAMT/100000000).toFixed(2),
            '累计单数': item.ZSS,
            '当月新增单数': item.NOW_ZSS
          })
        })
      },
      // 代办事项
      todolist() {
        getAction('/schedule/count').then((res) => {
          this.toBeReviewed = res.result.toBeReviewed
          this.pending = res.result.pending
          this.haveInHand = res.result.haveInHand
          this.notice = res.result.notice
        })
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .shortcut {
    width: 100%;
    margin-bottom: 24px;

    &:hover {
      cursor: pointer;

      .item-icon {
        // background-color: #999;
      }
    }

    .item-icon {
      // background-color: #F8F8F8;
      width: 100%;
      height: 48px;
      4
      line-height: 48px;
      text-align: center;
      // border-radius: 2px;
      // font-size: 30px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }

    // .inspect {
    //   background-image: url('../assets/inspect.png');
    // }

    // .project {
    //   background-image: url('../assets/project.png');
    // }

    // .entrust {
    //   background-image: url('../assets/entrust.png');
    // }

    // .distribute {
    //   background-image: url('../assets/distribute.png');
    // }

    // .decision {
    //   background-image: url('../assets/decision.png');
    // }

    // .subscribe {
    //   background-image: url('../assets/subscribe.png');
    // }

    // .redeem {
    //   background-image: url('../assets/redeem.png');
    // }

    // .report {
    //   background-image: url('../assets/report.png');
    // }

    .item-name {
      text-align: center;
      margin-top: 2px;
      font-size: 12px;
      color: #666666;
      font-family: PingFangSC-Medium;
    }
  }

  .schedule {
    width: 100%;
    margin-bottom: 16px;
    padding: 40px 0px 16px;
    border-radius: 2px;
    background-color: #FAFAFA;
    text-align: center;
    pointer-events: auto;

    &:hover {
      cursor: pointer;
      background-color: #999;
    }

    .item-title {
      padding-bottom: 16px;
      font-size: 16px;
      line-height: 24px;
      color: rgba(0, 0, 0, 0.85);
      font-family: PingFangSC-Medium;
      pointer-events: none;
    }

    .item-num {
      font-style: normal;
      font-size: 48px;
      font-family: DINAlternate-Bold;
      // font-weight: 300;
      color: #FEA93A;
      pointer-events: none;
    }

    .black {
      color: #333;
    }
  }

  .extra {
    span {
      // width: 10px;
      // height: 10px;
      margin: 0 16px;
      // background-color: #e2e2e2;
      // border-radius: 50%;
      cursor: pointer;
      display: inline-block;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #999999;
      line-height: 25.9px;

      &.active {
        // background-color: #999;
        color: @primary-color!important;
      }
    }
  }
</style>