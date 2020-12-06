export default {
  data() {
    return {
      // 资产来源
      sources: [
        { name: "内部资产", value: '1' },
        { name: "外部资产", value: '2' },
      ],
      // 通用是否
      alls: [
        { name: "是", value: '1' },
        { name: "否", value: '2' },
      ],
      // 币种
      curs: [
        { name: "人民币", value: '1' },
        { name: "折人民币等价", value: '2' },
        { name: "美元", value: '3' },
        { name: "港币", value: '4' },
        { name: "英镑", value: '5' },
        { name: "法郎", value: '6' },
        { name: "马克", value: '7' },
      ],
      // 收益率类型
      incomes: [
        { name: "净值型", value: '1' },
        { name: "非净值型（预期、浮动、预期+浮动）", value: '2' },
        { name: "货币型", value: '3' },
      ],
      //赎回方式
      redeems: [
        { name: "任意时间", value: '1' },
        { name: "产品到期赎回", value: '2' },
        { name: "投资到期赎回", value: '3' },
        { name: "定期开放赎回（维护开放期规则）", value: '4' },
        { name: "投资封闭期满定期开放赎回", value: '5' },
      ], 
      // 资产期限
      deadlines: [
        { name: "固定期限", value: '1' },
        { name: "永久存续", value: '2' },
      ],
      // 时间单位
      units: [
        { name: "年", value: '1' },
        { name: "月", value: '2' },
        { name: "天", value: '3' },
      ],
      // 风险
      risks: [
        { name: "0", value: '1' },
        { name: "R1", value: '2' },
        { name: "R2", value: '3' },
        { name: "R3", value: '4' },
        { name: "R4", value: '5' },
        { name: "R5", value: '6' },
      ],
      // 付息方式
      ints: [
        { name: "非固定期间付息", value: '1' },
        { name: "固定期间付息", value: '2' },
      ],
      // 认/申费扣收方式
      buys: [
        { name: "内含", value: '1' },
        { name: "外含", value: '2' },
      ],
      // 地址国省市
      options: [
        {
          value: 'zhejiang',
          label: 'Zhejiang',
          children: [
            {
              value: 'hangzhou',
              label: 'Hangzhou',
              children: [
                {
                  value: 'xihu',
                  label: 'West Lake',
                },
              ],
            },
          ],
        },
        {
          value: 'jiangsu',
          label: 'Jiangsu',
          children: [
            {
              value: 'nanjing',
              label: 'Nanjing',
              children: [
                {
                  value: 'zhonghuamen',
                  label: 'Zhong Hua Men',
                },
              ],
            },
          ],
        },
      ],
      //付息频率
      pays: [
        { name: "到期一次性付息", value: '1' },
        { name: "固定频率", value: '2' },
      ],
      //分红方式
      bonus: [
        { name: "现金分红", value: '1' },
        { name: "红利再投", value: '2' },
      ],
      // 计息基数
      paybases: [
        { name: "ACT/365", value: '1' },
        { name: "ACT/360", value: '2' },
        { name: "按实际天数", value: '3' },
      ],
      // 参考日历
      calenders: [
        { name: "自然日历", value: '1' },
        { name: "银行间日历", value: '2' },
        { name: "证券交易日历", value: '3' },
        { name: "银行及证券交易日历", value: '4' },
      ],

       
    }
  }
}