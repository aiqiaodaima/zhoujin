/**
 * BI组件注册为全局sunkebao
 */

function changeStr(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
const requireComponent = require.context("./BI", false, /\.vue$/);
// console.log(requireComponent.keys());
const install = (Vue) => {
  requireComponent.keys().forEach((fileName) => {
    let config = requireComponent(fileName);
    let componentName = changeStr(
      fileName.replace(/^\.\//, "").replace(/\.\w+$/, "")
    );
    // console.log(config);
    Vue.component(componentName, config.default || config);
  });
};
export default {
  install,
};
