const Population = require('./js/genetic/Population'),
    EvolutionManager = require('./js/genetic/EvolutionManager'),
    Bot = require('./js/sequence-bot'),
    BotGame = require('./js/BotGame'),
    _ = require('underscore')



const keys = [0,1,2,3]

const population = new Population({
    size: 100,
    subject: Bot,
    initializeSubject: bot => {
        const seq = []
        _.times(
            _.random(4, 100),
            () => seq.push(_.sample(keys))
        )
        bot.setSequence(seq)
        bot._dna = {
            crossoverAmount: _.random(1, seq.length/2)
        }
    },
    run: bot => {
        const game = new BotGame(bot, 80)
        return game.run().then(meta => {
            bot.result = meta
            console.log(`Done running ${meta.history.length} games: ${bot.sequence} 🏆 ${meta.stats.bestScore} [${meta.stats.bestTile}]`)
        })
    },
    rawFitness: bot => {
        var scores = bot.result.history
            .map(h => h.score)

        const sum = scores.reduce(function(a, b) { return a + b })
        const avg = sum / scores.length
        return avg
    },
    reproduce: pool => {
        const parentA = _.sample(pool),
            parentB = _.sample(pool),
            // half A + half B
            childSequence = parentA.sequence.slice(0, Math.floor(parentA.sequence.length/2))
                .concat(parentB.sequence.slice(Math.floor(parentB.sequence.length/2)))

        //    childSequence = []

        /*const swapIndexes = _.sample(, parentA._dna.crossoverAmount)
        for(let i=0,j=Math.max(parentA.sequence.length, parentB.sequence.length); i<j; i++){
            childSequence.push()
        }*/

        if(Math.random() <= 0.01){
            // mutation !
            childSequence[_.random(0, childSequence.length)] = _.sample(keys)
        }

        if(Math.random() <= 0.015){
            // mutation !
            if(Math.random() > 0.5){
                childSequence.push(_.sample(keys))
            }else{
                childSequence.pop()
            }
        }

        const childBot = new Bot()
        childBot.setSequence(childSequence)
        return childBot
    }
})
population.fillRandom()

const evolutionManager = new EvolutionManager({
    population,
    generations: 1000
})
evolutionManager.run().then(()=>{
    console.log('all done')
})
