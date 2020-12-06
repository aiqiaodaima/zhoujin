/**
 * by sunkebao
 * 个性化配置项
 * logoImg: - logo名称
 * primaryColor - 默认主题色
 * linkColor - 激活active颜色
 * headerTitle - 系统头名称
 * iconColor - redIcon purpleIcon blueIcon
 * domianURL -服务器地址
 * sso - 是否开启单点登录，默认为false，正常登录
 * casPrefixUrl -  单点登录服务器地址
 */

module.exports  = {
  customizeEnv: 'bi', //个性化环境bi-商智 cct-中诚 zrt-中融 utrust-粤财 sdic-国投  
  bi: {
    logoImg: 'bi-logo',
    primaryColor: '#7e4d86',
    linkColor: '#7e4d86',
    headerTitle: '欢迎进入家族信托平台',
    domianURL: 'http://47.114.189.155/ftsp',
    // domianURL: 'http://jzxt.one2rich.cn/ftsp',
    // domianURL:'http://localhost:8080/fts',
    // sso: true,
  },
  // 测试环境
  testenv: {
    logoImg: 'bi-logo',
    primaryColor: '#7e4d86',
    linkColor: '#7e4d86',
    headerTitle: '欢迎进入家族信托平台',
    domianURL: 'http://10.26.201.103:8082/fts',
  },
  // 中诚信托
  cct: {
    logoImg: 'cct-logo',
    primaryColor: '#7e4d86',
    linkColor: '#7e4d86',
    iconColor: 'purpleIcon',
    domianURL: 'http://10.18.99.13:8080/fts',
    casPrefixUrl: 'http://10.18.97.2:7002/cas',
    sso: true
  },
  // 中融
  zrt: {
    logoImg: 'zrt-logo',
    primaryColor: '#1890FF',
    linkColor: '#1890FF',
    headerTitle: ' ',
    // domianURL: 'http://47.114.189.155/ftsp',
    domianURL: 'http://172.30.196.188/fts',
  },
  // 粤财
  utrust: {
    logoImg: 'utrust-logo',
    primaryColor: '#303352',
    linkColor: '#303352',
    headerTitle: '欢迎进入家族信托平台',
    domianURL: 'http://10.198.251.80/fts',
  },
  // 国投test 
  sdic: {
    logoImg: 'sdic-logo',
    primaryColor: '#D5021D',
    linkColor: '#D5021D',
    headerTitle: '欢迎进入家族信托平台',
    domianURL: 'http://10.0.1.125:8080/fts',
	  casPrefixUrl: 'http://192.168.100.41:7002/cas',
	  sso: true
  },
  // 国投prod 
  sdic_prod: {
    logoImg: 'sdic-logo',
    primaryColor: '#D5021D',
    linkColor: '#D5021D',
    headerTitle: '欢迎进入家族信托平台',
    domianURL: 'http://10.0.1.123:8080/fts',
	  casPrefixUrl: 'http://10.0.1.68:7002/cas',
	  sso: true
  },
}
