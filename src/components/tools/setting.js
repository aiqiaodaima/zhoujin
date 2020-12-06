import { message } from 'ant-design-vue/es';
// import defaultSettings from '../defaultSettings';

let lessNodesAppended;

const colorList = [
  {
    key: '蓝紫（默认）', color: '#7e4d86',iconColor: 'purpleIcon'
  },
  {
    key: '薄暮', color: '#e60012',iconColor: 'redIcon'
  },
  {
    key: '拂晓蓝', color: '#1890FF',iconColor: 'blueIcon'
  },
  {
    key: '深紫', color: '#303352',iconColor: 'darkIcon'
  },
  {
    key: '深红', color: '#D5021D',iconColor: 'darkRedIcon'
  },
];

const updateTheme = primaryColor => {
  // Don't compile less in production!
  /* if (process.env.NODE_ENV === 'production') {
    return;
  } */
  // Determine if the component is remounted
  if (!primaryColor) {
    return;
  }
  
  // const hideMessage = message.loading('正在编译主题！', 0);
  console.info(`正在编译主题!`)
  function buildIt() {
    // 正确的判定less是否已经加载less.modifyVars可用
    if (!window.less || !window.less.modifyVars) {
      return;
    }
  
    // less.modifyVars可用
    window.less.modifyVars({
        '@primary-color': primaryColor,
      })
      .then(() => {
        // hideMessage();
      })
      .catch(() => {
        message.error('Failed to update theme');
        // hideMessage();
      });
  }
  if (!lessNodesAppended) {
    // insert less.js and color.less
    const lessStyleNode = document.createElement('link');
    const lessConfigNode = document.createElement('script');
    const lessScriptNode = document.createElement('script');
    lessStyleNode.setAttribute('rel', 'stylesheet/less');
    lessStyleNode.setAttribute('href', '/color.less');
    lessConfigNode.innerHTML = `
      window.less = {
        async: true,
        env: 'production',
        javascriptEnabled: true
      };
    `;
    
    lessScriptNode.src = '/less.min.js';
    // lessScriptNode.src = 'https://gw.alipayobjects.com/os/lib/less.js/3.8.1/less.min.js';
    
    lessScriptNode.async = true;
    lessScriptNode.onload = () => {
      buildIt();
      lessScriptNode.onload = null;
    };
    document.body.appendChild(lessStyleNode);
    document.body.appendChild(lessConfigNode);
    document.body.appendChild(lessScriptNode);
    lessNodesAppended = true;
  } else {
    buildIt();
  }
};

const updateColorWeak = colorWeak => {
  // document.body.className = colorWeak ? 'colorWeak' : '';
  colorWeak ? document.body.classList.add('colorWeak') : document.body.classList.remove('colorWeak')
};

export { updateTheme, colorList, updateColorWeak }