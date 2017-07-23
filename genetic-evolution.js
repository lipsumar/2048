const argv = require('minimist')(process.argv.slice(2))

if(!argv.name){
    console.log('--name required (db name, must not exist yet)')
    process.exit()
}

const Population = require('./js/genetic/Population'),
    EvolutionManager = require('./js/genetic/EvolutionManager'),
    Bot = require('./js/sequence-bot'),
    BotGame = require('./js/BotGame'),
    _ = require('underscore'),
    Cloudant = require('cloudant'),
    cloudant = Cloudant({
        account: 'lipsumar',
        password: process.env.CLOUDANT_PW
    }),
    storage = cloudant.db.use(argv.name),
    createDatabase = require('./js/create-database'),
    pad = require('pad-left')


const keys = [0,1,2,3]

const population = new Population({
    size: 10,
    subject: Bot,
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
    run: bot => {
        const game = new BotGame(bot, 8)
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
    maxFitness: 20000,
    reproduce: pool => {
        const parentA = _.sample(pool),
            parentB = _.sample(pool),
            // half A + half B
            childSequence = parentA.sequence.slice(0, Math.floor(parentA.sequence.length/2))
                .concat(parentB.sequence.slice(Math.floor(parentB.sequence.length/2)))

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
})
population.fillRandom()

const evolutionManager = new EvolutionManager({
    population,
    generations: Number.POSITIVE_INFINITY
})

evolutionManager.on('generation:end', generation => {
    console.log('=> end of generation '+generation.count)

    const allDnaSeqLength = generation.dna.reduce((memo, dna) => memo + dna.sequence.length, 0)
    const dnaLengthAvg = allDnaSeqLength / generation.dna.length

    storage.insert({
        fitness: generation.fitness,
        fitnessAvg: generation.fitnessAvg,
        count: generation.count,
        dna: generation.dna.map(dna => {
            return {sequence: dna.sequence.join('')}
        }),
        dnaLengthAvg
    }, 'generation-'+pad(generation.count, 5, '0'), (err, body) => {
        if(err){
            console.log(err)
            return
        }

        if(!body.ok){
            console.log('Error while storing generation')
        }
    })
})

process.stdout.write('Creating database.')
cloudant.db.list((err, dbs) => {
    if(err) throw err

    process.stdout.write('.')

    if(dbs.includes(argv.name)){
        console.log(` error\nDB "${argv.name}" already exists, can't continue.`)
        process.exit()
    }

    createDatabase(cloudant, argv.name, require('./db-seed/design-documents.json'))
        .then(() => {
            process.stdout.write('. done\n')
            evolutionManager.run().then(()=>{
                console.log('all done')
            })
        })
        .catch(err => console.log(err))
})
