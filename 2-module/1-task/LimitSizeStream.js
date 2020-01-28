const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.totalChunkSize = 0;
  }

  _transform(chunk, encoding, callback) {
    const chunkSize = chunk.length;
    this.totalChunkSize += chunkSize;

    if (this.totalChunkSize > this.limit) {
      console.log('IT WORKS ======>');
      callback(new LimitExceededError());
    } else {
      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;
