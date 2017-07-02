const GameManager = require('./game_manager'),
    KeyboardInputManager = require('./keyboard_input_manager'),
    HTMLActuator = require('./html_actuator'),
    LocalStorageManager = require('./local_storage_manager')

function BotGame(bot, maxIterations){
    this.bot = bot
    this.maxIterations = maxIterations
}

BotGame.prototype.run = function(){
    return new Promise(resolve => {
        let iterations = 1
        let max = this.maxIterations
        const bot = this.bot
        const inputManager = new KeyboardInputManager(bot)

        const game = new GameManager(4, inputManager, HTMLActuator, LocalStorageManager)
        const history = []
        bot.play(game, 1)


        bot.on('end', handleEnd)
        bot.on('stuck', handleEnd.bind(null, true))


        function handleEnd (stuck) {

            let highest = 0
            game.grid.eachCell((x,y,cell) => {
                if(cell && cell.value > highest){
                    highest = cell.value
                }
            })

            if(stuck){
                //process.stdout.write(' - Stuck\n')
            }else{
                if(game.over){
                    //process.stdout.write(' - You lose\n')
                }else if(game.won){
                    //process.stdout.write(' - You win!\n')
                }
            }

            let entry = game.serialize()
            entry.highestTile = highest
            history.push(entry)

            iterations++
            if(iterations <= max){
                game.restart()
                bot.play(game)
            }else{
                const bestTile = history.map(h => h.highestTile)
                    .sort((a, b) => a - b)
                    .reverse()[0]
                const bestScore = history.map(h => h.score)
                        .sort((a, b) => a - b)
                        .reverse()[0]
                
                resolve({
                    history,
                    stats:{
                        bestTile, bestScore
                    }
                })
            }


        }
    })
}





module.exports = BotGame
