const {override, fixBabelImports, addLessLoader} = require('customize-cra');

module.exports = override(
  // 实现对antd组件的按需打包
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),

  // 添加less的loader配置, 并指定自定义的新主体颜色
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {'@primary-color': '#1DA57A'},
  }),
);
