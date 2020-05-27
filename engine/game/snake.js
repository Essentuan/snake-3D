let snake = {
    element: THREE.create(new THREE.Vector3(1, 0.125, 0.125), settings.colors.snake.head),
    position: function(pos) {
        if (pos != undefined) {
            snake.element.position.z = board.gridX[pos.x]
            snake.element.position.y = board.gridY[pos.y]
            let worldVector = board.element.worldToLocal(new THREE.Vector3(0, snake.element.position.y, 0))
            let localVector = board.element.localToWorld(new THREE.Vector3(-0.17, worldVector.y, worldVector.z))
            snake.element.position.x = localVector.x
        } else {
            return({
                x: board.gridX.indexOf(snake.element.position.z),
                y: board.gridY.indexOf(snake.element.position.y)
            })
        }
    },
    tail: [],
    addTail: function(tailPos={x: 0, y: 0}) {
        let tempTail = {
            element: THREE.create(new THREE.Vector3(1, 0.125, 0.125), settings.colors.snake.tail),
            position: function(pos) {
                if (pos != undefined) {
                    tempTail.element.position.z = board.gridX[pos.x]
                    tempTail.element.position.y = board.gridY[pos.y]
                    let worldVector = board.element.worldToLocal(new THREE.Vector3(0, tempTail.element.position.y, 0))
                    let localVector = board.element.localToWorld(new THREE.Vector3(-0.17, worldVector.y, worldVector.z))
                    tempTail.element.position.x = localVector.x
                } else {
                    return({
                        x: board.gridX.indexOf(tempTail.element.position.z),
                        y: board.gridY.indexOf(tempTail.element.position.y)
                    })
                }
            }
        }
        tempTail.element.rotation.z = 0.2
        tempTail.position(tailPos)
        snake.tail.push(tempTail)
        scene.add(snake.tail.last().element)
        if (snake.positionHistory.length > 1) {
            snake.tail.last().position(JSON.parse(snake.positionHistory[snake.tail.length]))
        }
    },
    outOfBounds: function() {
        let currentPosition = snake.position()
        let boardSize = board.getSize()
        return (currentPosition.x < 0 || currentPosition.x >= boardSize.maxWidth) || (currentPosition.y < 0 || currentPosition.y >= boardSize.maxHeight)
    },
    facing: "w",
    positionHistory: []
}
snake.element.rotation.z = 0.2




scene.add(snake.element)

