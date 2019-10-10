module.exports = file => require('@/module-' + file + '.vue').default // vue-loader at least v13.0.0+

// require是CommonJS模块化导入动作
// require导入的内容，需要通过module.exports导出

// 有的文件例如vue单文件组件内部是 export default xxx方式"导出"的
// 一般通过 import *** from xxx 方式"导入"
// 上述是ES6的模块化导出和导入
// 如果 export default xxx 方式导出的内容需要通过require方式导入，就需要额外调用default
