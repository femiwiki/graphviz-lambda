const ApiBuilder = require('claudia-api-builder')
const rp = require('request-promise-native')
const request = require('request')
const child = require('child_process')

const api = new ApiBuilder()
module.exports = api

function parse(graph, contentType) {
  if (contentType !== 'mw') {
    return graph
  }

  const obj = JSON.parse(graph).query.pages
  for (var key in obj) {
    return obj[key].revisions[0]['*']
  }
}

api.get(
  'svg',
  function (request) {
    if (request.queryString.url) {
      return rp(request.queryString.url)
        .then(function (graph) {
          return child.spawnSync("./dot_static", ["-Tsvg"], {input: parse(graph, request.queryString.contentType || 'plain')}).stdout.toString()
        })
    } else if (request.queryString.dot) {
      return child.spawnSync("./dot_static", ["-Tsvg"], {input: request.queryString.dot}).stdout.toString()
    } else if (request.queryString.dots) {
      var injection = [
        'graph [nodesep=0.2, margin=0.3, ranksep=0.3];',
        'edge [penwidth=0.5, arrowsize=0.5, color="#444444", fontsize="9", fontname="sans-serif"];',
        'node [shape="rect", fillcolor="#EEEEEE", color="#444444", fontsize="9", fontname="sans-serif", style="rounded,filled", penwidth=0.5, width="0.2" height="0.2"];',
        ''
      ].join('\n')
      var injected = request.queryString.dots.replace('{', '{\n' + injection)
      return child.spawnSync("./dot_static", ["-Tsvg"], {input: injected}).stdout.toString()
    }
  },
  {success: {contentType: 'image/svg+xml'}}
)
