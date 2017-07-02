function KeyboardInputManager(emitter) {
    this.events = {}
    this.eventTouchstart    = 'touchstart'
    this.eventTouchmove     = 'touchmove'
    this.eventTouchend      = 'touchend'
    this.emitter = emitter
    this.listen()
}

KeyboardInputManager.prototype.on = function (event, callback) {
    if (!this.events[event]) {
        this.events[event] = []
    }
    this.events[event].push(callback)
}

KeyboardInputManager.prototype.emit = function (event, data) {
    var callbacks = this.events[event]
    if (callbacks) {
        callbacks.forEach(function (callback) {
            callback(data)
        })
    }
}

KeyboardInputManager.prototype.listen = function () {

    const self = this
    /*var map = {
        38: 0, // Up
        39: 1, // Right
        40: 2, // Down
        37: 3, // Left
        75: 0, // Vim up
        76: 1, // Vim right
        74: 2, // Vim down
        72: 3, // Vim left
        87: 0, // W
        68: 1, // D
        83: 2, // S
        65: 3  // A
    }*/

    // listen to bot
    this.emitter.on('action', e => {
        self.emit('move', e)
    })
}

KeyboardInputManager.prototype.restart = function (event) {
    event.preventDefault()
    this.emit('restart')
}

KeyboardInputManager.prototype.keepPlaying = function (event) {
    event.preventDefault()
    this.emit('keepPlaying')
}

module.exports = KeyboardInputManager
