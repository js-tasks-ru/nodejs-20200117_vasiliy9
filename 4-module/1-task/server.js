const url = require('url');
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);
  // to check if file exists in an asynchronous way
  fs.access(filepath, fs.F_OK, (err) => {
    if (err) {
      res.statusCode = pathname.split('/').length > 1 ? 400 : 404;
      res.end(`File ${pathname} not found!`);
    }
  });

  switch (req.method) {
    case 'GET':
      const readStream = fs.createReadStream(filepath);

      readStream.on('error', function(err) {
        res.statusCode = 500;
        res.end(err);
      });

      readStream.pipe(res);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
