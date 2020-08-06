const htmlParser = require('parse5')
const getStream = require('get-stream')
const replaceStream = require('replacestream')
const fs = require('fs-extra')

exports.inlineCriticalCSS = function (filePath, { css }) {
  const inlineString = `<style id="___critical-css">${css}</style>`
  let isInlined = false, stream = fs.createReadStream(filePath, {
    encoding: 'utf8'
  })

  stream = stream.pipe(replaceStream(/<link[^>]+>/g, match => {
    if (/as="style"/.test(match)) {
      match = ''
    }

    if (/rel="stylesheet"/.test(match)) {
      const fragment = htmlParser.parseFragment(match)
      const onload = `this.onload=null;this.rel='stylesheet'`
      const node = fragment.childNodes[0]
      node.attrs.forEach(attr => {
        if (attr.name === 'rel') attr.value = 'preload'
      })

      node.attrs.push({ name: 'as', value: 'style' })
      node.attrs.push({ name: 'onload', value: onload })
      fragment.childNodes.push(
        createNoScriptNode(
          node
        )
      )

      match = htmlParser.serialize(fragment)
    }

    if (!isInlined) {
      match = `${inlineString}` + match
      isInlined = true
    }

    return match
  }))

  return getStream(stream)
}

function createNoScriptNode (node) {
  return {
    tagName: 'noscript',
    attrs: [],
    childNodes: [
      {
        tagName: 'link',
        attrs: [
          { name: 'rel', value: 'stylesheet' },
          ...node.attrs.filter(({ name }) => {
            return name === 'href'
          })
        ]
      }
    ]
  }
}
