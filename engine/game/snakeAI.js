let hamiltonian = {
    estimateTime: function(w, h) {
        return ((w*h)*0.0015).fix(2)
    },
    storedPath: undefined,
    storeCycle: function(w, h) {
        hamiltonian.storedPath = new hamiltonianCircuit(w, h)
        for (i in hamiltonian.storedPath.path) {
            hamiltonian.storedPath.path[i] = JSON.stringify(new game.position(hamiltonian.storedPath.path[i]))
        }     
        hamiltonian.storedPath.path.push(hamiltonian.storedPath.path[0])   
        return hamiltonian.storedPath
    }, 
    getCell: function(cell) {
        if (isNaN(cell)) {
            return {
                id: hamiltonian.storedPath.path.indexOf(JSON.stringify(cell)),
                position: cell
            }
        } else {
            return {
                id: cell,
                position: JSON.parse(hamiltonian.storedPath.path[cell])
            }
        }
    },
    calcDistance: function(c1, c2) {
        if (c1 < c2) {
            return c2 - c1 - 1
        } else {
            return c2 - c1 - 1 + board.getSize().maxHeight * board.getSize(0).maxWidth
        }
    }
}

let bot = {
    type: "simple",
    findPath: function() {
        let snakeCell = hamiltonian.getCell(snake.position())
        let foodDist = hamiltonian.calcDistance(snakeCell.id, hamiltonian.getCell(food.position()).id)
        let tailDist
        if (snake.tail.length > 0) {
            tailDist = hamiltonian.calcDistance(snakeCell.id, hamiltonian.getCell(snake.tail.last().position()).id)
        } else {
            tailDist = hamiltonian.calcDistance(snakeCell.id, snakeCell.id)
        }
        let cutAmount = tailDist - 10
        let emptyPositions = game.availablePositions().length-2
        if (foodDist < tailDist) {
            cutAmount-=1
        }
        if (foodDist < cutAmount) {
            cutAmount = foodDist
        }
        cutAmount = Math.max(cutAmount, 0)
        let dir = {
            up: !game.isTaken(new game.position(snakeCell.position.x, snakeCell.position.y-1)),
            left: !game.isTaken(new game.position(snakeCell.position.x-1, snakeCell.position.y)),
            down: !game.isTaken(new game.position(snakeCell.position.x, snakeCell.position.y+1)),
            right: !game.isTaken(new game.position(snakeCell.position.x+1, snakeCell.position.y-1))
        }
        let optDir = -1
        let optDist = -1
        let dist = 0
        if (dir.up) {
            dist = hamiltonian.calcDistance(snakeCell.id, hamiltonian.getCell(new game.position(snakeCell.position.x, snakeCell.position.y-1)).id)
            if (dist <= cutAmount && dist > optDist && snake.facing != "s") {
                optDir = "w"
                optDist = dist
            }
        }
        if (dir.left) {
            dist = hamiltonian.calcDistance(snakeCell.id, hamiltonian.getCell(new game.position(snakeCell.position.x-1, snakeCell.position.y)).id)
            if (dist <= cutAmount && dist > optDist && snake.facing != "d") {
                optDir = "a"
                optDist = dist
            }
        }
        if (dir.down) {
            dist = hamiltonian.calcDistance(snakeCell.id, hamiltonian.getCell(new game.position(snakeCell.position.x, snakeCell.position.y+1)).id)
            if (dist <= cutAmount && dist > optDist && snake.facing != "w") {
                optDir = "s"
                optDist = dist
            }
        }
        if (dir.right) {
            dist = hamiltonian.calcDistance(snakeCell.id, hamiltonian.getCell(new game.position(snakeCell.position.x+1, snakeCell.position.y)).id)
            if (dist <= cutAmount && dist > optDist && snake.facing != "a") {
                optDir = "d"
                optDist = dist
            }
        }
        if (optDist >=0) {return optDir}
        if (dir.right && snake.facing != "a") {return "d"}
        if (dir.down && snake.facing != "w") {return "s"}
        if (dir.left && snake.facing != "d") {return "a"}
        if (dir.up && snake.facing != "s") {return "w"}
    },
    getDirection: function(pos1, pos2) {
        if (pos1.x < pos2.x ) {
            return "d"
        } else if (pos1.x > pos2.x) {
            return "a"
        } else if (pos1.y < pos2.y) {
            return "s"
        } else if (pos1.y > pos2.y) {
            return "w"
        }
    },
    move: function() {
        let snakeCell = hamiltonian.getCell(snake.position())
        return bot.getDirection(snakeCell.position, hamiltonian.getCell(snakeCell.id+1).position)
    }
}
game.update()