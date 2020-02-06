const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  switch (req.method) {
    case 'POST':
      const pathname = url.parse(req.url).pathname.slice(1);
      const filepath = path.join(__dirname, 'files', pathname);
      // does the file have a subpath - 400
      if (pathname.split('/').length > 1) {
        res.statusCode = 400;
        res.end('Internal server error');
        return;
      }
      // creating writeStream
      const writeStream = fs.createWriteStream(filepath, {flags: 'wx'});
      // creating instance of LimitSizeStream
      const limitStream = new LimitSizeStream({limit: 1048576});
      // piping req => limitStream => writeStream
      req.pipe(limitStream).pipe(writeStream);

      // error in case file has more then 1048576
      limitStream.on('error', (err) => {
        fs.unlink(filepath, (err) => {
          if (err) throw err;
          res.statusCode = 413;
          res.end('File limit exceeded');
        });
      });
      // error in case file exists
      writeStream.on('error', (error) => {
        if (error.code === 'EEXIST') {
          res.statusCode = 409;
          res.end('File already exist');
        } else {
          res.statusCode = 500;
          res.end('File already exist');
        }
      });
      // connection failed
      req.on('aborted', () => {
        fs.unlink(filepath, (err) => {
          if (err) throw err;
        });
      });
      // file was added
      writeStream.on('finish', () => {
        res.statusCode = 201;
        res.end();
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
