const Koa = require('koa')
const router = require('koa-router')()
const sampleSize = require('lodash.samplesize')
const axios = require('axios')
const app = new Koa()

const peers = new Set()

const bootstrap = JSON.parse(process.env.BOOTSTRAP_PEERS)
for (const peer of bootstrap) {
  peers.add(peer)
}

async function run () {
  try {
    const queryPeers = sampleSize(Array.from(peers), Math.max(5, Math.floor(peers.size / 4)))

    for (const peer of queryPeers) {
      const res = await axios.get(peer + '/peers')
      for (const resPeer of res.data.peers) {
        peers.add(resPeer)
        console.log('added peer. peers=' + peers.size)
      }
    }
  } catch (err) {
    console.error(err)
  }

  setTimeout(run, 1000)
}

router.get('/', ctx => {
  ctx.set('Content-Type', 'text/html')
  ctx.body = '<body>' +
    '<h1>' + peers.size + ' Codius Nodes</h1>' +
    '<ul>' +
    Array.from(peers).map(p => '<li>' + p + '</li>').join('') +
    '</ul></body>'
})

app
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(8080)

run()
