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
                sequence: seq
            }
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
            const parentA = _.sample(pool),
                parentB = _.sample(pool),
                froms = [parentA, parentB],
                longestParent = parentA.sequence.length > parentB.sequence.length ? parentA : parentB

            const childSequence = []
            longestParent.sequence.forEach((key, i) => {
                const from = _.random(0,1),
                    fromInv = from === 0 ? 1 : 0
                let toAdd
                if(froms[from].sequence[i]){
                    toAdd = froms[from].sequence[i]
                }else if(froms[fromInv].sequence[i]){
                    toAdd = froms[fromInv].sequence[i]
                }

                if(toAdd){
                    childSequence.push(toAdd)
                }
            })

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
            const dna = {sequence: childSequence}
            return {
                subject: childBot,
                dna: dna
            }
        }
    }
}
