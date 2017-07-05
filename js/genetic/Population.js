const mapRange = require('map-range')
const _ = require('underscore')

function Population(opts){
    this.opts = opts
    this.size = opts.size
    this.Subject = opts.subject
    this.initializeSubject = opts.initializeSubject
    this.subjects = []
    this.dnas = []
    this.runFunction = opts.run
    this.fitnessFunc = opts.rawFitness
    this.reproduceFunc = opts.reproduce
    this.maxFitness = opts.maxFitness
}

Population.prototype.fillRandom = function(){
    let created
    for(let i=0; i<this.size; i++){
        created = this.createSubject()
        this.subjects.push(created.subject)
        this.dnas.push(created.dna)
    }
}

Population.prototype.createSubject = function(){
    const subject = new this.Subject()
    return this.initializeSubject.call(null, subject)
}

Population.prototype.run = function(){
    return Promise.all(
        this.subjects.map(this.runSubject.bind(this))
    )
}

Population.prototype.runSubject = function(subject){
    return this.runFunction(subject)
}

Population.prototype.calculateFitness = function(maxFitness){

    return this.subjects.map(subject => this.calculateNormalizedFitness(subject, maxFitness))
}

Population.prototype.calculateNormalizedFitness = function(subject, maxFitness){
    return mapRange(x => Math.pow(x, 2), 0, maxFitness, 0, 1)(this.fitnessFunc(subject))
}

Population.prototype.makeMatingPool = function(){
    let maxFitness = this.subjects.map(this.fitnessFunc)
        .sort((a, b) => a - b)
        .reverse()[0]
    const fitness = this.calculateFitness(maxFitness)
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
    let child
    for(let i=0; i<this.size; i++){
        child = this.reproduceFunc(pool)
        newPopulation.add(child.subject, child.dna)
    }
    return newPopulation
}

Population.prototype.add = function(subject, dna){
    if(this.subjects.length === this.size){
        throw new Error('tried to add to a full population')
    }
    this.subjects.push(subject)
    this.dnas.push(dna)
}

module.exports = Population
