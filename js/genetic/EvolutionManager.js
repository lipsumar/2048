

function EvolutionManager(opts){
    this.population = opts.population
    this.maxGenerations = opts.generations
    this.generationCount = 1
}

EvolutionManager.prototype.run = function(){
    console.log('######### Generation '+this.generationCount)

    return new Promise(resolve => {
        if(!this.runResolver){ // that's not good...
            this.runResolver = resolve
        }
        this.population.run()
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



EvolutionManager.prototype.createNextGeneration = function(){
    const next = this.population.reproduce()
    return next
}


module.exports = EvolutionManager
