function HTMLActuator() {
    this.score = 0
}
let iterations = 1
const {table} = require('table')

HTMLActuator.prototype.actuate = function (grid, metadata) {
    let highest = 0
    //this.drawGrid(grid)
    grid.eachCell((x,y,cell) => {
        if(cell && cell.value > highest){
            highest = cell.value
        }
    })
    process.stdout.write(`\r#${iterations}: score: `+ metadata.score + ' ['+ highest+']')
    if(metadata.terminated){
        if(metadata.over){
            process.stdout.write(' - You lose')
        }else if(metadata.won){
            process.stdout.write(' - You win!')
        }
        console.log('')
        iterations++
    }

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
