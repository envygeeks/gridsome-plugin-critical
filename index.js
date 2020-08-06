const Worker = require('jest-worker').default
const normalize = p => p.replace(/\/+$/, '') || '/'
const micromatch = require('micromatch')

module.exports = function (api, options) {
  api.afterBuild(async ({ queue, config }) => {
    const { outputDir: base, pathPrefix, publicPath } = config
    const patterns = options.paths.map(p => normalize(p))
    const pages = queue.filter(page => {
      return micromatch(page.path, patterns).length
    })

    const worker = new Worker(require.resolve('./lib/worker'))
    console.log(`Extract critical CSS (${pages.length} pages)`)
    await Promise.all(pages.map(async ({ htmlOutput }) => {
      try {
        await worker.generate(htmlOutput, {
          ignore: options.ignore,
          height: options.height,
          width: options.width,
          base
        })
      } catch (err) {
        worker.end()
        throw err
      }
    }))

    worker.end()
  })
}

module.exports.defaultOptions = () => ({
  width: 1024,
  ignore: undefined,
  height: 768,
  paths: [
    '/'
  ],
})
