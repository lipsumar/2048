const EventEmitter = require('events')
const _ = require('underscore')

const keys = [
    'up',
    'right',
    'down',
    'left'
]




function Bot(){
    EventEmitter.call(this)
}
Object.assign(Bot.prototype, EventEmitter.prototype)
Bot.prototype.constructor = Bot

Bot.prototype.play = function(game){
    if(game) this.game = game

    if(!this.game.over){
        this.move().then(() => {
            return new Promise(resolve => {
                setTimeout(resolve, 50)
            })
        }).then(this.play.bind(this))
    }else{
        this.game.restart()
        this.play()
    }
}


Bot.prototype.move = function(){
    return new Promise(resolve => {
        // Behold the power of Machine Learning !!
        // this is where an action is chosen
        // this.game is the current game
        const action = _.sample(keys)

        //console.log('BOT:', action)
        this.emit('action', keys.indexOf(action))
        resolve()
    })
}

module.exports = Bot
