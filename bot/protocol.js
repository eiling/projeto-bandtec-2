'use strict';

const HEADER_ = 0;
const PAYLOAD_ = 1;

function Protocol(socket, handler) {
  this.socket = socket;
  this.packet_ = {};

  this.process_ = false;
  this.state_ = HEADER_;
  this.payloadLength_ = 0;
  this.bufferedBytes_ = 0;
  this.queue = [];

  this.handler = handler;
}

Protocol.prototype.init = function() {
  this.socket.on('data', data => {
    this.bufferedBytes_ += data.length;
    this.queue.push(data);

    this.process_ = true;
    this.onData_();
  });

  this.socket.on('served', data => {
    this.handler(JSON.parse(data.toString()));  // toString default encoding is utf-8
  });

  return this;
};

Protocol.prototype.hasEnough_ = function(size) {
  if (this.bufferedBytes_ >= size) {
    return true;
  }
  this.process_ = false;
  return false;
};

Protocol.prototype.readBytes_ = function(size) {
  let result;
  this.bufferedBytes_ -= size;

  if (size === this.queue[0].length) {
    return this.queue.shift();
  }

  if (size < this.queue[0].length) {
    result = this.queue[0].slice(0, size);
    this.queue[0] = this.queue[0].slice(size);
    return result;
  }

  result = Buffer.allocUnsafe(size);
  let offset = 0;
  let length;

  while (size > 0) {
    length = this.queue[0].length;

    if (size >= length) {
      this.queue[0].copy(result, offset);
      offset += length;
      this.queue.shift();
    } else {
      this.queue[0].copy(result, offset, 0, size);
      this.queue[0] = this.queue[0].slice(size);
    }

    size -= length;
  }

  return result;
};

Protocol.prototype.getHeader_ = function() {
  if (this.hasEnough_(2)) {
    this.payloadLength_ = this.readBytes_(2).readUInt16BE(0, true);
    this.state_ = PAYLOAD_;
  }
};

Protocol.prototype.getPayload_ = function() {
  if (this.hasEnough_(this.payloadLength_)) {
    let received = this.readBytes_(this.payloadLength_);
    this.socket.emit('served', received);
    this.state_ = HEADER_;
  }
};

Protocol.prototype.onData_ = function() {
  while (this.process_) {
    switch (this.state_) {
      case HEADER_:
        this.getHeader_();
        break;
      case PAYLOAD_:
        this.getPayload_();
        break;
    }
  }
};

Protocol.prototype.send = function(message) {
  let buffer = Buffer.from(JSON.stringify(message), 'utf-8');

  this.header_(buffer.length);
  this.packet_.message = buffer;
  this.send_();
};

Protocol.prototype.header_ = function(messageLength) {
  this.packet_.header = {length: messageLength};
};

Protocol.prototype.send_ = function() {
  let contentLength = Buffer.allocUnsafe(2);
  contentLength.writeUInt16BE(this.packet_.header.length, 0, true);
  this.socket.write(contentLength);
  this.socket.write(this.packet_.message);
  this.packet_ = {};
};

module.exports = Protocol;
