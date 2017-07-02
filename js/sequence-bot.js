const Bot = require('./bot')

function SequenceBot(){
    Bot.call(this, arguments)
}
Object.assign(SequenceBot.prototype, Bot.prototype)

SequenceBot.prototype.setSequence = function(seq){
    this.sequence = seq
    this.sequenceIndex = 0
}

SequenceBot.prototype.nextMoveInSequence = function(){
    this.sequenceIndex++
    if(!this.sequence[this.sequenceIndex]){
        this.sequenceIndex = 0
    }
    return this.sequence[this.sequenceIndex]
}

SequenceBot.prototype.move = function(){
    return new Promise(resolve => {
        this.emit('action', this.nextMoveInSequence())
        resolve()
    })
}

module.exports = SequenceBot
