let food = {
    element: THREE.create(new THREE.Vector3(1, 0.125, 0.125), settings.colors.apple),
    position: function(pos) {
        if (pos != undefined) {
            food.element.position.z = board.gridX[pos.x]
            food.element.position.y = board.gridY[pos.y]
            let worldVector = board.element.worldToLocal(new THREE.Vector3(0, food.element.position.y, 0))
            let localVector = board.element.localToWorld(new THREE.Vector3(-0.20, worldVector.y, worldVector.z))
            food.element.position.x = localVector.x
        } else {
            return({
                x: board.gridX.indexOf(food.element.position.z),
                y: board.gridY.indexOf(food.element.position.y)
            })
        }
    },
    spawn: function() {
        let availablePositions = game.availablePositions()
        food.position(JSON.parse(availablePositions.random()))
    }
}
food.element.rotation.z = 0.2




scene.add(food.element)