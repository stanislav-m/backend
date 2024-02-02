const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const jsonPlaceholderProxy = createProxyMiddleware({
//  target: 'https://napi.voyo.bg/', // target host with the same base path
  target: 'https://napi.voyo.bg/', // target host with the same base path
  //target: 'https://swapi.dev/', 
  changeOrigin: true, // for vhosted sites, changes host header to match to target's host
  onError: (err, req, res, target)  => {
    res.writeHead(500, {
      'Content-Type': 'text/plain',
    });
    res.end('Something went wrong. And we are reporting a custom error message.');
  },
  onProxyRes: (proxyRes, req, res) => {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    console.log(Date.now(), proxyRes.statusCode);
  },
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader('Access-Control-Allow-Origin', '*');
    console.log(Date.now(), proxyReq.method, proxyReq.host, proxyReq.path);
  }
});

const app = express();

app.use('/', jsonPlaceholderProxy);

const server = app.listen(5000);

console.log('[DEMO] Server: listening on port 5000');
console.log('[DEMO] Opening: http://localhost:5000');

//require('open')('http://localhost:5000/');

process.on('SIGINT', () => server.close());
process.on('SIGTERM', () => server.close());

/*
const express = require('express');
const request = require('request');

const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/', (req, res) => {
  console.log('Time:', Date.now(), req.method);
  request(
    { url: 'https://xkcd.com/' },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: 'error', message: err.message });
      }

      res.json(JSON.parse(body));
    }
  )
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
*/