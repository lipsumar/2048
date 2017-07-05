const EventEmitter = require('events')
const util = require('util')
const _ = require('underscore')

const keys = [
    'up',
    'right',
    'down',
    'left'
]

function Bot(){
    EventEmitter.call(this)
    this.scoreStuck = 0
}
util.inherits(Bot, EventEmitter)

Bot.prototype.play = function(game){
    if(game){
        this.game = game
        this.lastScore = game.score
        this.scoreStuck = 0
    }

    if(this.lastScore === this.game.score){
        this.scoreStuck++
    }
    this.lastScore = this.game.score
    if(this.scoreStuck>100){
        this.emit('stuck')
        return
    }

    if(!this.game.over){
        this.move().then(() => {
            this.emit('moved')
            return new Promise(resolve => {
                setTimeout(resolve, 1)
            })
        }).then(this.play.bind(this))
        .catch(err => {
            console.log(err)
        })
    }else{
        this.emit('end')
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
