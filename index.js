
var sockets = require('NativeModules').SocketIO;

class Socket {
  constructor (host, config) {

    if(typeof host === 'undefined')
      throw 'Hello there! Could you please give socket a host, please.';
    if(typeof config === 'undefined')
      config = {};

    this.sockets = sockets;
    this.isConnected = false;
    this.handlers = {};
    this.onAnyHandler = null;

    this.deviceEventSubscription = DeviceEventEmitter.addListener(
      'socketEvent', this._handleEvent.bind(this)
    );

    // Set default handlers
    this.defaultHandlers = {
      connect: () => {
        this.isConnected = true;
      },

      disconnect: () => {
        this.isConnected = false;
      }
    };

    // Set initial configuration
    this.sockets.initialise(host, config);
  }

  _handleEvent (event) {
    if(this.handlers.hasOwnProperty(event.name))
      this.handlers[event.name](
        (event.hasOwnProperty('items')) ? event.items : null
      );

    if(this.defaultHandlers.hasOwnProperty(event.name))
      this.defaultHandlers[event.name]();

    if(this.onAnyHandler) this.onAnyHandler(event);
  }

  connect () {
    this.sockets.connect();
  }

  on (event, handler) {
    this.handlers[event] = handler;
  }

  onAny (handler) {
    this.onAnyHandler = handler;
  }

  emit (event, data) {
    this.sockets.emit(event, data);
  }

  close (fast) {
    if(typeof fast === 'undefined') fast = false;
    this.sockets.close(fast);
  }

  reconnect () {
    this.sockets.reconnect();
  }
}

module.exports = Socket;
