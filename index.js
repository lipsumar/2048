const GameManager = require('./js/game_manager'),
    KeyboardInputManager = require('./js/keyboard_input_manager'),
    HTMLActuator = require('./js/html_actuator'),
    LocalStorageManager = require('./js/local_storage_manager'),
    Bot = require('./js/bot')


const bot = new Bot()

const inputManager = new KeyboardInputManager(bot)

const game = new GameManager(4, inputManager, HTMLActuator, LocalStorageManager)

bot.play(game)
