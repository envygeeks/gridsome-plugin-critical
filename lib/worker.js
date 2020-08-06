const critical = require('critical')
const { inlineCriticalCSS } = require('./inline')
const fs = require('fs-extra')

exports.generate = async function (htmlOutput, options = {}) {
  const sourceHTML = await fs.readFile(htmlOutput, 'utf-8')
  let { css, } = await critical.generate({
    html: sourceHTML,
    height: options.height,
    ignore: options.ignore,
    width: options.width,
    base: options.base,
    inline: false,
    minify: true,
  })

  // remove path prefix from hashed urls
  css = css.replace(/="url\([/\w]+%23(\w+)\)"/g, '="url(%23$1)"')
  const resultHTML = await inlineCriticalCSS(htmlOutput, { css })
  await fs.outputFile(htmlOutput, resultHTML)
}
