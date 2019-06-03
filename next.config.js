const withCSS = require('@zeit/next-css')
module.exports = withCSS({
  exportPathMap: async function(defaultPathMap) {
    return {
      '/': { page: '/' },
      '/cn': { page: '/', query : { ln : 'zh'}},
    };
  }
})
