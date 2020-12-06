import * as api from '@/api/api'
import { isURL } from '@/utils/validate'

export function timeFix() {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : (hour <= 11 ? '上午好' : (hour <= 13 ? '中午好' : (hour < 20 ? '下午好' : '晚上好')))
}

export function welcome() {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了']
  let index = Math.floor((Math.random()*arr.length))
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent() {
  let event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

/**
 * 过滤对象中为空的属性
 * @param obj
 * @returns {*}
 */
export function filterObj(obj) {
  if (!(typeof obj == 'object')) {
    return;
  }

  for ( var key in obj) {
    if (obj.hasOwnProperty(key)
      && (obj[key] == null || obj[key] == undefined || obj[key] === '')) {
      delete obj[key];
    }
  }
  return obj;
}

/**
 * 时间格式化
 * @param value
 * @param fmt
 * @returns {*}
 */
export function formatDate(value, fmt) {
  var regPos = /^\d+(\.\d+)?$/;
  if(regPos.test(value)){
    //如果是数字
    let getDate = new Date(value);
    let o = {
      'M+': getDate.getMonth() + 1,
      'd+': getDate.getDate(),
      'h+': getDate.getHours(),
      'm+': getDate.getMinutes(),
      's+': getDate.getSeconds(),
      'q+': Math.floor((getDate.getMonth() + 3) / 3),
      'S': getDate.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt;
  }else{
    //TODO
    value = value.trim();
    return value.substr(0,fmt.length);
  }
}

/**
 * 金额格式化 适用乘法，除法有bug
 * @param number 要格式化的数字
 * @param decimals 保留几位小数
 * decPoint：小数点符号 默认.
 * thousandsSep：千分位符号 默认为,
 * @returns {*}
 */
export function formatNumber(number, decimals){
  number = (number + '').replace(/[^0-9+-Ee.]/g, '');
  let n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 2 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      var m = 0, s1 = n.toString()
      try { m += s1.split(".")[1].length } catch (e) { }
       n = Number(s1.replace(".", ""))
      let k = Math.pow(10, prec);
      return '' + Math.ceil(n*k) / (k*Math.pow(10, m));
    };

  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  let re = /(-?\d+)(\d{3})/;
  while(re.test(s[0])) {
    s[0] = s[0].replace(re, "$1" + sep + "$2");
  }

  if((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}
/*
  * 参数说明：
  * number：要格式化的数字
  * decimals：保留几位小数
  * dec_point：小数点符号
  * thousands_sep：千分位符号
  * roundtag:舍入参数，默认 "ceil" 向上取,"floor"向下取,"round" 四舍五入
  * */
export function formatAmt(number, decimals, dec_point, thousands_sep,roundtag) {
  number = (number + '').replace(/[^0-9+-Ee.]/g, '');
  roundtag = roundtag || "round"; //"ceil","floor","round"
  var n = !isFinite(+number) ? 0 : +number,
      prec = !isFinite(+decimals) ? 2 : Math.abs(decimals),
      sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
      dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
      s = '',
      toFixedFix = function (n, prec) {

          var k = Math.pow(10, prec);

          return '' + parseFloat(Math[roundtag](parseFloat((n * k).toFixed(prec*2))).toFixed(prec*2)) / k;
      };
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  var re = /(-?\d+)(\d{3})/;
  while (re.test(s[0])) {
      s[0] = s[0].replace(re, "$1" + sep + "$2");
  }

  if ((s[1] || '').length < prec) {
      s[1] = s[1] || '';
      s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

/**
 * 金额格式化成中文金额
 
 * @returns {*}
 */
export function capitalAmount(n){
  if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)){
      return ''
  }
  
  var unit="仟佰拾亿仟佰拾万仟佰拾点",str="";
  // var unit="仟佰拾亿仟佰拾万仟佰拾元角分",str="";
        n += "00";
  var p= n.indexOf('.');
  if(p >=0)
      n=n.substring(0,p)+n.substr(p+1,2);

      unit=unit.substr(unit.length-n.length+2);
      
      for(var i=0; i<n.length; i++)
      str +='零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i))+unit.charAt(i);
     // return str.replace(/零(仟|佰|拾|角)/g,"零").replace(/(零)+/g,"零").replace(/零(万|亿|圆)/g,"$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^圆零?|零分/g,"").replace(/圆$/g,"圆整");
      // return str.replace(/零(仟|佰|拾|角)/g,"零").replace(/(零)+/g,"零").replace(/零(万|亿|元)/g,"$1").replace(/(亿)万|壹(拾)/g, "$1$2")
      return str.replace(/零(仟|佰|拾|角)/g,"零").replace(/(零)+/g,"零").replace(/零(万|亿)/g,"$1").replace(/(亿)万|壹(拾)/g, "$1$2")

}


// 生成首页路由
export function generateIndexRouter(data) {
let indexRouter = [{
      path: '/',
      name: 'home',
      // component: () => import('@/components/layouts/BasicLayout'),
      component: resolve => require(['@/components/layouts/TabLayout'], resolve),
      meta: { title: '首页' },
      redirect: '/home',
      children: [
        ...generateChildRouters(data)
      ]
    },{
      "path": "*", "redirect": "/404", "hidden": true
    }]
  return indexRouter;
}

// 生成嵌套路由（子路由）

function  generateChildRouters (data) {
  const routers = [];
  for (var item of data) {
    let component = "";
    if(item.component.indexOf("layouts")>=0){
       component = "components/"+item.component;
    }else{
       component = "views/"+item.component;
    }

    // eslint-disable-next-line
    let URL = (item.meta.url|| '').replace(/{{([^}}]+)?}}/g, (s1, s2) => eval(s2)) // URL支持{{ window.xxx }}占位符变量
    if (isURL(URL)) {
      item.meta.url = URL;
    }

    let menu =  {
      path: item.path,
      name: item.name,
      redirect:item.redirect,
      component: resolve => require(['@/' + component+'.vue'], resolve),
      hidden:item.hidden,
      //component:()=> import(`@/views/${item.component}.vue`),
      meta: {
        title:item.meta.title ,
        icon: item.meta.icon,
        url:item.meta.url ,
        permissionList:item.meta.permissionList,
        keepAlive:item.meta.keepAlive,
        /*update_begin   for:赋值 */
        internalOrExternal:item.meta.internalOrExternal
        /*update_end for:赋值 */
      }
    }
    if(item.alwaysShow){
      menu.alwaysShow = true;
      menu.redirect = menu.path;
    }
    if (item.children && item.children.length > 0) {
      menu.children = [...generateChildRouters( item.children)];
    }
    //根据后台菜单配置，判断是否路由菜单字段，动态选择是否生成路由（为了支持参数URL菜单）------
    //判断是否生成路由
    // if(item.route && item.route === '0'){
    //   //console.log(' 不生成路由 item.route：  '+item.route);
    //   //console.log(' 不生成路由 item.path：  '+item.path);
    // }else{
    //   routers.push(menu);
    // }
    //配置的路径全部加入路由
    routers.push(menu);
  }
  return routers
}

/**
 * 深度克隆对象、数组
 * @param obj 被克隆的对象
 * @return 克隆后的对象
 */
export function cloneObject(obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * 随机生成数字
 *
 * 示例：生成长度为 12 的随机数：randomNumber(12)
 * 示例：生成 3~23 之间的随机数：randomNumber(3, 23)
 *
 * @param1 最小值 | 长度
 * @param2 最大值
 * @return int 生成后的数字
 */
export function randomNumber() {
  // 生成 最小值 到 最大值 区间的随机数
  const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  if (arguments.length === 1) {
    let [length] = arguments
  // 生成指定长度的随机数字，首位一定不是 0
    let nums = [...Array(length).keys()].map((i) => (i > 0 ? random(0, 9) : random(1, 9)))
    return parseInt(nums.join(''))
  } else if (arguments.length >= 2) {
    let [min, max] = arguments
    return random(min, max)
  } else {
    return Number.NaN
  }
}

/**
 * 随机生成字符串
 * @param length 字符串的长度
 * @param chats 可选字符串区间（只会生成传入的字符串中的字符）
 * @return string 生成的字符串
 */
export function randomString(length, chats) {
  if (!length) length = 1
  if (!chats) chats = '0123456789qwertyuioplkjhgfdsazxcvbnm'
  let str = ''
  for (let i = 0; i < length; i++) {
    let num = randomNumber(0, chats.length - 1)
    str += chats[num]
  }
  return str
}

/**
 * 随机生成uuid
 * @return string 生成的uuid
 */
export function randomUUID() {
  let chats = '0123456789abcdef'
  return randomString(32, chats)
}

/**
 * 下划线转驼峰
 * @param string
 * @returns {*}
 */
export function underLine2CamelCase(string){
  return string.replace( /_([a-z])/g, function( all, letter ) {
    return letter.toUpperCase();
  });
}

/**
 * 判断是否显示办理按钮
 * @param bpmStatus
 * @returns {*}
 */
export function showDealBtn(bpmStatus){
  if(bpmStatus!="1"&&bpmStatus!="3"&&bpmStatus!="4"){
    return true;
  }
  return false;
}

/**
 * 增强CSS，可以在页面上输出全局css
 * @param css 要增强的css
 * @param id style标签的id，可以用来清除旧样式
 */
export function cssExpand(css, id) {
  let style = document.createElement('style')
  style.type = "text/css"
  style.innerHTML = `@charset "UTF-8"; ${css}`
  // 清除旧样式
  if (id) {
    let $style = document.getElementById(id)
    if ($style != null) $style.outerHTML = ''
    style.id = id
  }
  // 应用新样式
  document.head.appendChild(style)
}


/** 用于js增强事件，运行JS代码，可以传参 */
// options 所需参数：
//    参数名         类型            说明
//    vm             VueComponent    vue实例
//    event          Object          event对象
//    jsCode         String          待执行的js代码
//    errorMessage   String          执行出错后的提示（控制台）
export function jsExpand(options = {}) {

  // 绑定到window上的keyName
  let windowKeyName = 'J_CLICK_EVENT_OPTIONS'
  if (typeof window[windowKeyName] != 'object') {
    window[windowKeyName] = {}
  }

  // 随机生成JS增强的执行id，防止冲突
  let id = randomString(16, 'qwertyuioplkjhgfdsazxcvbnm'.toUpperCase())
  // 封装按钮点击事件
  let code = `
    (function (o_${id}) {
      try {
        (function (globalEvent, vm) {
          ${options.jsCode}
        })(o_${id}.event, o_${id}.vm)
      } catch (e) {
        o_${id}.error(e)
      }
      o_${id}.done()
    })(window['${windowKeyName}']['EVENT_${id}'])
  `
  // 创建script标签
  const script = document.createElement('script')
  // 将需要传递的参数挂载到window对象上
  window[windowKeyName]['EVENT_' + id] = {
    vm: options.vm,
    event: options.event,
    // 当执行完成时，无论如何都会调用的回调事件
    done() {
      // 执行完后删除新增的 script 标签不会撤销执行结果（已产生的结果不会被撤销）
      script.outerHTML = ''
      delete window[windowKeyName]['EVENT_' + id]
    },
    // 当js运行出错的时候调用的事件
    error(e) {
      console.group(`${options.errorMessage || '用户自定义JS增强代码运行出错'}（${new Date()}）`)
      console.error(e)
      console.groupEnd()
    }
  }
  // 将事件挂载到document中
  script.innerHTML = code
  document.body.appendChild(script)
}


/**
 * 重复值验证工具方法
 *
 * 使用示例：
 * { validator: (rule, value, callback) => validateDuplicateValue('sys_fill_rule', 'rule_code', value, this.model.id, callback) }
 *
 * @param tableName 被验证的表名
 * @param fieldName 被验证的字段名
 * @param fieldVal 被验证的值
 * @param dataId 数据ID，可空
 * @param callback
 */
export function validateDuplicateValue(tableName, fieldName, fieldVal, dataId, callback) {
  if (fieldVal) {
    let params = { tableName, fieldName, fieldVal, dataId }
    api.duplicateCheck(params).then(res => {
      res['success'] ? callback() : callback(res['message'])
    }).catch(err => {
      callback(err.message || err)
    })
  } else {
    callback()
  }
}

/**
 * 根据编码校验规则code，校验传入的值是否合法
 *
 * 使用示例：
 * { validator: (rule, value, callback) => validateCheckRule('common', value, callback) }
 *
 * @param ruleCode 编码校验规则 code
 * @param value 被验证的值
 * @param callback
 */
export function validateCheckRule(ruleCode, value, callback) {
  if (ruleCode && value) {
    value = encodeURIComponent(value)
    api.checkRuleByCode({ ruleCode, value }).then(res => {
      res['success'] ? callback() : callback(res['message'])
    }).catch(err => {
      callback(err.message || err)
    })
  } else {
    callback()
  }
}

/**
 * 如果值不存在就 push 进数组，反之不处理
 * @param array 要操作的数据
 * @param value 要添加的值
 * @param key 可空，如果比较的是对象，可能存在地址不一样但值实际上是一样的情况，可以传此字段判断对象中唯一的字段，例如 id。不传则直接比较实际值
 * @returns {boolean} 成功 push 返回 true，不处理返回 false
 */
export function pushIfNotExist(array, value, key) {
  for (let item of array) {
    if (key && (item[key] === value[key])) {
      return false
    } else if (item === value) {
      return false
    }
  }
  array.push(value)
  return true
}

/**
 * 可用于判断是否成功
 * @type {symbol}
 */
export const succeedSymbol = Symbol()
/**
 * 可用于判断是否失败
 * @type {symbol}
 */
export const failedSymbol = Symbol()

/**
 * 使 promise 无论如何都会 resolve，除非传入的参数不是一个Promise对象或返回Promise对象的方法
 * 一般用在 Promise.all 中
 *
 * @param promise 可传Promise对象或返回Promise对象的方法
 * @returns {Promise<any>}
 */
export function alwaysResolve(promise) {
  return new Promise((resolve, reject) => {
    let p = promise
    if (typeof promise === 'function') {
      p = promise()
    }
    if (p instanceof Promise) {
      p.then(data => {
        resolve({ type: succeedSymbol, data })
      }).catch(error => {
        resolve({ type: failedSymbol, error })
      })
    } else {
      reject('alwaysResolve: 传入的参数不是一个Promise对象或返回Promise对象的方法')
    }
  })
}

export function isEmpty(obj){
  return (typeof obj === 'undefined') || (typeof obj == 'undefined') || obj == null || obj === '';
}

export function convertToCamelCase(obj){
  if(obj){
    Object.keys(obj).forEach(key=>{
      let keyStrArr = key.toLowerCase().split("_");
      // 如果第一个为空，则去掉
      if(keyStrArr[0] === '') {
        keyStrArr.shift();
      }
      let newKey='';
      keyStrArr.forEach((keyWord,index)=>{
        newKey+=((index===0?keyWord[0]:keyWord[0].toUpperCase())+keyWord.substring(1));
      });
      obj[newKey]=obj[key];
    });
  }
}

export function genInitVal(f, data){
  let initValues = {};
  Object.keys(f).forEach(key => {
    if (typeof(f[key]) === 'object') {
      Object.keys(f[key]).forEach(key1 => {
        initValues[key + "." + key1] = data[key][key1];
      });
    } else if (typeof(f[key]) === 'string') {
      initValues[key] = data[key]?data[key]:'';
    }
  });
  return initValues;
}

export function contains(arr, obj){
  let contains = false;
  if(arr && arr.length>0){
    arr.forEach(o=>{
      if(o === obj){
        contains = true;
      }
    })
  }
  return contains;
}

export function setKeyProp(arr){
  if(arr&&arr.length>0){
    arr.forEach((item, index)=>{
      if(!item.key){
        item.key = index;
      }
    });
  }
}