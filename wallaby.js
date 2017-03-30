const wallabyWebpack = require('wallaby-webpack')
const webpackPostprocessor = wallabyWebpack({})

module.exports = wallaby => {
  return {
    files: [
      { pattern: 'index.ts', load: false }
    ],
    tests: [
      { pattern: 'test.ts', load: false }
    ],
    postprocessor: webpackPostprocessor,
    env: {
      kind: 'electron',
      type: 'browser'
    },
    setup: () => window.__moduleBundler.loadTests()
  }
}
