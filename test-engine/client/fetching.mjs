import * as config from './config.mjs'
import { fixupHeader } from '../lib/header-fixup.mjs'

import http from 'node:http';
import https from 'node:https';

import nfetch from "node-fetch";

const lookup = (_hostname, options, callback) => {
  if (options.all) {
    callback(null, [{ address: config.destination, family: 4 }])
  } else {
    callback(null, config.destination, 4)
  }
}

const httpAgent = new http.Agent({
  keepAlive: true,
  lookup
});
const httpsAgent = new https.Agent({
  keepAlive: true,
  lookup 
});

const agent = function (_parsedURL) {
  if (_parsedURL.protocol == 'http:') {
    return httpAgent;
  } else {
    return httpsAgent;
  }
}

export function fetch(url, init) {
  if (config.destination) {
    if (init) {
      init.agent = agent
    } else {
      init = {
        agent: agent
      }
    }
  }
  return nfetch(url, init)
}

export function init(idx, reqConfig, prevResp) {
  const init = {
    headers: []
  }
  if (!config.useBrowserCache) {
    init.cache = 'no-store'
    init.headers.push(['Pragma', 'foo']) // dirty hack for Fetch
    init.headers.push(['Cache-Control', 'nothing-to-see-here']) // ditto
  }
  if (config.destination) {
    init.agent = agent;
  }
  if ('request_method' in reqConfig) init.method = reqConfig.request_method
  if ('request_headers' in reqConfig) init.headers = init.headers.concat(reqConfig.request_headers)
  if ('magic_ims' in reqConfig && reqConfig.magic_ims === true) {
    for (let i = 0; i < init.headers.length; i++) {
      const header = init.headers[i]
      if (header[0].toLowerCase() === 'if-modified-since') {
        init.headers[i] = fixupHeader(header, prevResp, reqConfig)
      }
    }
  }
  if ('name' in reqConfig) init.headers.push(['Test-Name', reqConfig.name])
  if ('request_body' in reqConfig) init.body = reqConfig.request_body
  if ('mode' in reqConfig) init.mode = reqConfig.mode
  if ('credentials' in reqConfig) init.mode = reqConfig.credentials
  if ('cache' in reqConfig) init.cache = reqConfig.cache
  if ('redirect' in reqConfig) init.redirect = reqConfig.redirect
  init.headers.push(['Test-ID', reqConfig.id])
  init.headers.push(['Req-Num', (idx + 1).toString()])
  return init
}

export function inflateRequests(test) {
  const rawRequests = test.requests
  const requests = []
  for (let i = 0; i < rawRequests.length; i++) {
    const reqConfig = rawRequests[i]
    reqConfig.name = test.name
    reqConfig.id = test.id
    reqConfig.dump = test.dump
    requests.push(reqConfig)
  }
  return requests
}
