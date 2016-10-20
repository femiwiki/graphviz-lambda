var ApiBuilder = require('claudia-api-builder'),
      api = new ApiBuilder();
module.exports = api;

const rp = require('request-promise-native');
const request = require("request");
const child = require('child_process');
const exec = require('child_process').exec;

api.get('svg', (request) =>
  rp(request.queryString.url)
    .then((graph) => child.spawnSync("./dot_static", ["-Tsvg"], {input: graph}).stdout.toString()),
    {success: {contentType: 'image/svg+xml'}}
);

