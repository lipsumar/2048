const GameManager = require('./js/game_manager'),
    KeyboardInputManager = require('./js/keyboard_input_manager'),
    HTMLActuator = require('./js/html_actuator'),
    LocalStorageManager = require('./js/local_storage_manager'),
    Bot = require('./js/bot')


const bot = new Bot()

const inputManager = new KeyboardInputManager(bot)

const game = new GameManager(4, inputManager, HTMLActuator, LocalStorageManager)
const history = []
bot.play(game, 1)


bot.on('end', handleEnd)
bot.on('stuck', handleEnd.bind(null, true))

function handleEnd (stuck) {

    if(stuck){
        process.stdout.write(' - Stuck\n')
    }

    let highest = 0
    game.grid.eachCell((x,y,cell) => {
        if(cell && cell.value > highest){
            highest = cell.value
        }
    })
    let entry = game.serialize()
    entry.highestTile = highest
    history.push(entry)

    game.restart()
    bot.play(game, history.length + 1)
})


function drawStats(){
    console.log(' - Cancelled by user')
    console.log(history.length + ' games played')
    if(history.length > 0){
        const bestTile = history.map(h => h.highestTile)
            .sort((a, b) => a - b)
            .reverse()[0]
        console.log('Best score: ' + game.storageManager.getBestScore())
        console.log('Best tile: [' + bestTile+']')
    }
}

process.on('SIGINT', function() {
    drawStats()
    process.exit()
})
