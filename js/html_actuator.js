function HTMLActuator() {
    this.score = 0
}
let iterations = 1
const {table} = require('table')

HTMLActuator.prototype.actuate = function (grid, metadata) {
    //this.drawGrid(grid)

}

HTMLActuator.prototype.drawGrid = function(grid){
    let row
    const data = []

    for (var x = 0; x < grid.size; x++) {
        row = []
        data.push(row)
        for (var y = 0; y < grid.size; y++) {
            row.push(grid.cells[y][x] ? grid.cells[y][x].value : ' ')
        }

    }

    console.log(data)
    console.log(table(data))
}


HTMLActuator.prototype.addTile = function () {

}



module.exports = HTMLActuator
