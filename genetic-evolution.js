const argv = require('minimist')(process.argv.slice(2))

if(!argv.name){
    console.log('--name required (db name, must not exist yet)')
    process.exit()
}

if(!argv.config){
    console.log('--config required')
    process.exit()
}

const Population = require('./js/genetic/Population'),
    EvolutionManager = require('./js/genetic/EvolutionManager'),
    Bot = require('./js/sequence-bot'),
    BotGame = require('./js/BotGame'),
    Cloudant = require('cloudant'),
    cloudant = Cloudant({
        account: 'lipsumar',
        password: process.env.CLOUDANT_PW
    }),
    storage = cloudant.db.use(argv.name),
    createDatabase = require('./js/create-database'),
    pad = require('pad-left')


const baseConfig = {
    subject: Bot,
    size: argv.popsize || 10,
    run: bot => {
        const game = new BotGame(bot, argv.games || 10)
        return game.run().then(meta => {
            bot.result = meta
            console.log(`Done running ${meta.history.length} games: ${bot.sequence} 🏆 ${meta.stats.bestScore} [${meta.stats.bestTile}]`)
        })
    },
}
const userConfig = require('./configs/' + argv.config)(Bot, BotGame)

const population = new Population(Object.assign({}, baseConfig, userConfig))
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
