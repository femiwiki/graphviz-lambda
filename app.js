const ApiBuilder = require('claudia-api-builder')
const fetch = require('node-fetch')
const child = require('child_process')

function parseGraph(graph, contentType) {
  if (contentType !== 'mw') { return graph }

  const obj = JSON.parse(graph).query.pages
  for (var key in obj) {
    return obj[key].revisions[0]['*']
  }
}

function dot(input) {
  return child.spawnSync("./dot_static", ["-Tsvg"], { input })
    .stdout
    .toString()
}

function handler(request) {
  const qs = request.queryString

  if (qs.url != null) {
    return fetch(qs.url)
      .then(res => res.text())
      .then(body => dot(parseGraph(body, qs.contentType || 'plain')))
  }

  if (qs.dot != null) {
    return dot(qs.dot)
  }

  if (qs.dots != null) {
    return dot(qs.dots.replace('{', `{
graph [nodesep=0.2, margin=0.3, ranksep=0.3];
edge [penwidth=0.5, arrowsize=0.5, color="#444444", fontsize="9", fontname="sans-serif"];
node [shape="rect", fillcolor="#EEEEEE", color="#444444", fontsize="9", fontname="sans-serif", style="rounded,filled", penwidth=0.5, width="0.2" height="0.2"];
`))
  }
}

const api = new ApiBuilder()
api.get('svg', handler, { success: { contentType: 'image/svg+xml' } })
module.exports = api
