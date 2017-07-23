const keys = [0,1,2,3],
    _ = require('underscore')

module.exports = function(Bot){
    return {
        initializeSubject: bot => {
            const seq = []
            _.times(
                _.random(4, 100),
                () => seq.push(_.sample(keys))
            )
            bot.setSequence(seq)
            const dna = {
                sequence: seq,
                mutationRate: Math.random(),
                mutationScale: _.random(1, 10)
            }
            bot.dna = dna
            return {subject:bot, dna}
        },
        rawFitness: bot => {
            var scores = bot.result.history
                .map(h => h.score)

            const sum = scores.reduce(function(a, b) { return a + b })
            const avg = sum / scores.length
            return avg
        },
        maxFitness: 20000,
        reproduce: pool => {
            const parent = _.sample(pool)

            const childSequence = parent.sequence.slice(0)

            if(Math.random() <= parent.dna.mutationRate){
                // mutation !
                _.times(parent.dna.mutationScale, ()=>{
                    childSequence[_.random(0, childSequence.length)] = _.sample(keys)
                })

            }

            if(Math.random() <= parent.dna.mutationRate){
                // mutation !
                if(Math.random() > 0.5){
                    childSequence.push(_.sample(keys))
                }else{
                    childSequence.pop()
                }
            }

            const childBot = new Bot()
            childBot.setSequence(childSequence)
            const dna = {
                sequence: childSequence,
                mutationRate: parent.dna.mutationRate,
                mutationScale: parent.dna.mutationScale
            }
            childBot.dna = dna
            return {
                subject: childBot,
                dna: dna
            }
        }
    }
}
