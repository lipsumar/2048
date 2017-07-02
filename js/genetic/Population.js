const mapRange = require('map-range')
const _ = require('underscore')

function Population(opts){
    this.opts = opts
    this.size = opts.size
    this.Subject = opts.subject
    this.initializeSubject = opts.initializeSubject
    this.subjects = []
    this.runFunction = opts.run
    this.fitnessFunc = opts.rawFitness
    this.reproduceFunc = opts.reproduce
}

Population.prototype.fillRandom = function(){
    for(let i=0; i<this.size; i++){
        this.subjects.push(
            this.createSubject()
        )
    }
}

Population.prototype.createSubject = function(){
    const subject = new this.Subject()
    if(typeof this.initializeSubject === 'function'){
        this.initializeSubject.call(null, subject)
    }
    return subject
}

Population.prototype.run = function(){
    return Promise.all(
        this.subjects.map(this.runSubject.bind(this))
    )
}

Population.prototype.runSubject = function(subject){
    return this.runFunction(subject)
}

Population.prototype.calculateFitness = function(){
    let maxFitness = this.subjects.map(this.fitnessFunc)
        .sort((a, b) => a - b)
        .reverse()[0]

    return this.subjects.map(this.calculateNormalizedFitness.bind(this, maxFitness))
}

Population.prototype.calculateNormalizedFitness = function(maxFitness, subject){
    return mapRange(x => Math.pow(x, 2), 0, maxFitness, 0, 1)(this.fitnessFunc(subject))
}

Population.prototype.makeMatingPool = function(){
    const fitness = this.calculateFitness()
    const pool = []

    fitness.forEach((fit, i) => {
        _.times(
            Math.floor(fit*100),
            () => pool.push(this.subjects[i])
        )
    })

    return pool
}

Population.prototype.reproduce = function(){
    //@todo implement a lighter way 
    const pool = this.makeMatingPool()
    const newPopulation = new Population(this.opts)
    for(let i=0; i<this.size; i++){
        newPopulation.add(
            this.reproduceFunc(pool)
        )
    }
    return newPopulation
}

Population.prototype.add = function(subject){
    if(this.subjects.length === this.size){
        throw new Error('tried to add to a full population')
    }
    this.subjects.push(subject)

}

module.exports = Population
