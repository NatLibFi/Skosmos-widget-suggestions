//import axios from 'axios';
const axios = require('axios');
const express = require('express');
const morgan = require("morgan");
const urlencode = require('urlencode');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Express Server
const app = express();

// Some settings
const PORT = 3301;
const HOST = "localhost";
const API_SERVICE_URL = "https://google.fi";
const gh_secret = require('./secrets.json')

// Some info for status and logging is needed
app.use(morgan('dev'));

// Test type of endpoint
app.get('/test/:id/:data', (req, res, next) => {
   	res.send(req.params.id + ' If you get this message you know the proxy service propably is up and running properly\n' + req.params.package + '\n');

	console.log("Something between")
	console.log(urlencode.decode(req.params.data))
	console.log("And it ends")
      axios.post('https://api.github.com/repos/miguelahonen/c/issues', {
        "title": "Testi6",
        "body": "asia4, asia5, asia6",
        "state": "open",
        "labels": ["uusi"]
      }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3.raw',
          'Authorization':  gh_secret.gh_Token
        }
      })
	.then(function (response) {
	      console.log(response);
  	})
	.catch(function (error) {
	    console.log(error);
  	});


});

// Authorization
app.use('', (req, res, next) => {
   if (req.headers.authorization) {
       next();
   } else {

   }
});

// Proxy endpoints
 app.use('/send_to_gh', createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        [`^/send_to_gh`]: '',
    },
 }));

// Proxy endpoints
app.use('/send_to_gh_test', createProxyMiddleware({
   target: API_SERVICE_URL,
   changeOrigin: true,
   pathRewrite: {
       [`^/send_to_gh`]: '',
   },
}));

// Start
app.listen(PORT, HOST, () => {
   console.log(`Starting Service at ${HOST}:${PORT}`);
});
