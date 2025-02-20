/**
 * @fileoverview highlight 插件
 * Include prismjs (https://prismjs.com)
 */
const prism = require('./prism.min')
const config = require('./config')
const Parser = require('../parser')

function Highlight (vm) {
  this.vm = vm
}

Highlight.prototype.onParse = function (node, vm) {
  if (node.name === 'pre') {
    if (vm.options.editable) {
      node.attrs.class = (node.attrs.class || '') + ' hl-pre'
      return
    }
    const lang = node.attrs['data-language']
    // 不是代码块
    if(!lang) {
      return
    }
    // 代码内容
    const codeContent = node.children[0]
    node.children = []
    node.children.push({
      name: 'code',
      attrs: {},
      children:[codeContent]
    })
    const code = node.children[0]
    if (code.children.length) {
      const text = this.vm.getText(code.children).replace(/&amp;/g, '&')
      if (!text) return
      if (node.c) {
        node.c = undefined
      }
      if (prism.languages[lang]) {
        code.children = (new Parser(this.vm).parse(
          // 加一层 pre 保留空白符
          '<pre>' + prism.highlight(text, prism.languages[lang], lang).replace(/token /g, 'hl-') + '</pre>'))[0].children
      }
      node.attrs.class = 'hl-pre'
      code.attrs.class = 'hl-code'
      if (config.showLanguageName) {
        node.children.push({
          name: 'div',
          attrs: {
            class: 'hl-language',
            style: 'user-select:none'
          },
          children: [{
            type: 'text',
            text: lang
          }]
        })
      }
      if (config.copyByLongPress) {
        node.attrs.style += (node.attrs.style || '') + ';user-select:none'
        node.attrs['data-content'] = text
        vm.expose()
      }
      if (config.showLineNumber) {
        const line = text.split('\n').length; const children = []
        for (let k = line; k--;) {
          children.push({
            name: 'span',
            attrs: {
              class: 'span'
            }
          })
        }
        node.children.push({
          name: 'span',
          attrs: {
            class: 'line-numbers-rows'
          },
          children
        })
      }
    }
  }
}

module.exports = Highlight
