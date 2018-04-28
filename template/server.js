'use strict'

const path = require('path')
const Koa = require('koa')
const config = require('config')
const favicon = require('koa-favicon')
const compression = require('koa-compress')
const onerror = require('koa-onerror')
const staticCache = require('koa-static-cache')

// create koa instance
const app = module.exports = new Koa()
const logger = require('./middlewares/logger')

onerror(app)

app
  .use(logger)
  .use(compression({
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH
  }))
  .use(favicon('./public/favicon.png'))
  .use(serve('/public', './public'))
  .use(serve('/dist', './dist'))

/* istanbul ignore if */
if (!module.parent) {
  const port = config.get('port')
  const host = config.get('host')
  app.use(require('./middlewares/view').render(app))
  app.listen(port, host)
  console.log(`server started at http://${host}:${port}`)
}

// cache static
function serve(prefix, filePath) {
  return staticCache(path.resolve(__dirname, filePath), {
    prefix: prefix,
    gzip: true,
    dynamic: true,
    maxAge: 60 * 60 * 24 * 30
  })
}

