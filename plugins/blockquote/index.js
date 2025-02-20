/**
 * @description 组件被创建时将实例化插件
 * @param {Component} vm 组件实例
 */
function Plugin (vm) {
  this.vm = vm // 保存实例在其他周期使用
}

/**
 * @description 解析到一个标签时触发
 * @param {object} node 标签
 * @param {object} parser 解析器实例
 * @returns {boolean|void} 如果返回 false 将移除该标签
 */
Plugin.prototype.onParse = function (node, parser) {
  // 处理文本标签
  if (node.name === 'blockquote') {
    node.attrs.style += (node.attrs.style || '') + ';border-left:10rpx solid #C0C0C0;margin-left:10rpx;padding-left:10rpx;padding-right:10rpx;'
  }
}
module.exports = Plugin
