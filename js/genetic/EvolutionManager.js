const EventEmitter = require('events')
const util = require('util')

function EvolutionManager(opts){
    EventEmitter.call(this)
    this.population = opts.population
    this.maxGenerations = opts.generations
    this.generationCount = 1
}
util.inherits(EvolutionManager, EventEmitter)

EvolutionManager.prototype.run = function(){
    console.log('######### Generation '+this.generationCount)

    return new Promise(resolve => {
        if(!this.runResolver){ // that's not good...
            this.runResolver = resolve
        }
        this.population.run()
            .then(this.onGenerationEnd.bind(this))
            .then(() => {
                this.generationCount++
                if(this.generationCount <= this.maxGenerations){
                    this.population = this.createNextGeneration()
                    setTimeout(this.run.bind(this), 1)
                }else{
                    this.runResolver()
                }
            })
            .catch(err => console.log(err))
    })
}

EvolutionManager.prototype.onGenerationEnd = function(){
    const fitness = this.population.calculateFitness(this.population.maxFitness)
    let total = fitness.reduce((total, f) => total + f, 0)
    this.emit('generation:end', {
        fitness,
        fitnessAvg: total / fitness.length,
        count: this.generationCount,
        dna: this.population.dnas
    })
    return true
}


EvolutionManager.prototype.createNextGeneration = function(){
    const next = this.population.reproduce()
    return next
}


module.exports = EvolutionManager
