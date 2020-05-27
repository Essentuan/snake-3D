let board = {
    gridY: [],
    gridX: [],
    gridSize: 0.2,
    allPositions: [],
    scale: localStorage.getItem("boardScale")/100,
    getSize: function() {
        let maxW, maxH
        let screenScale = JSON.parse(localStorage.getItem("screenScale")) || {
            width: 1, 
            height: 1
        }
        let windowHeight = (window.innerHeight*(board.scale || 1))*screenScale.width, windowWidth = (window.innerWidth*(board.scale || 1))*screenScale.height
        for (let i = 0; i <= windowWidth; i++) {
			if (i * 24 <= windowWidth) {
				maxW = i
			}
		} 
		for (let i = 0; i <= windowHeight; i++) {
			if (i * 24 <= windowHeight) {
				maxH = i
			}
        }
        let bigWidth = new BigNumber((maxW*24 * 0.9)/118.45)
        let bigHeight = new BigNumber((maxH*24 * 0.8)/102)
        let unitWidth = bigWidth.minus(bigWidth.modulo(board.gridSize)).dividedBy(board.gridSize).toNumber()
        unitWidth+= unitWidth % 2
        let unitHeight = bigHeight.minus(bigHeight.modulo(board.gridSize)).dividedBy(board.gridSize).toNumber()
        unitHeight+= unitHeight % 2
        return({
            maxWidth: unitWidth,
            maxHeight: unitHeight,
            boardWidth: unitWidth*board.gridSize,
            boardHeight: unitHeight*board.gridSize,
        })
    },      
    resize: function() {
        localStorage.setItem("screenScale", null)
        localStorage.setItem("screenScale", JSON.stringify(camera.calculateSize(board.getSize(), 2)))
        let size = board.getSize()
        board.width = size.boardWidth
        board.height = size.boardHeight
        board.element.scale.set(1, board.height, board.width)
    },
    element: THREE.create(new THREE.Vector3(0.5, 1, 1), settings.colors.board.background),
    grid: {
        row: [],
        col: [],
    },
    edge: {
        north: undefined,
        east: undefined,
        south: undefined,
        west: undefined
    }
}

board.element.rotation.z = 0.2
board.element.receiveShadow = true
board.element.castShadow = true
light.directional.target = board.element
board.resize()

scene.add(board.element)
camera.lookAt(board.element.position)
updateScene()

let gridOffset
for (let i = 0; i < board.getSize().maxHeight+1; i++) {
    let tempObject = THREE.create(new THREE.Vector3(1, 0.012, board.width+0.02), settings.colors.board.grid)
    tempObject.rotation.z = 0.2
    tempObject.move.relative(0, 0, -0.22)
    tempObject.position.y-= board.gridSize*i
    let worldVector = board.element.worldToLocal(tempObject.position)
    let localVector = board.element.localToWorld(new THREE.Vector3(-0.22, worldVector.y, worldVector.z))
    tempObject.position.set(localVector.x, localVector.y, localVector.z)
    board.grid.row.push(tempObject)
    scene.add(board.grid.row[i])
    gridOffset = board.height/2+board.grid.row[i].position.y
}
for (let i = 0; i < board.getSize().maxWidth+1; i++) {
    let tempObject = THREE.create(new THREE.Vector3(1, board.height-gridOffset-0.01, 0.012), settings.colors.board.grid)
    tempObject.rotation.z = 0.2
    tempObject.move.relative(0, 0.5, -0.22)
    tempObject.position.y = -0.05+gridOffset/2
    tempObject.position.z-= board.gridSize*i
    board.grid.col.push(tempObject)
    scene.add(board.grid.col[i])
}

Math["fixConvert"] = function(number) {
    if (number > 0.5) {
        return 0
    } else {
        return -1
    }
}

board.edge.north = THREE.create(new THREE.Vector3(1, 0.2, board.width+0.412), settings.colors.board.outline)
board.edge.north.rotation.z = 0.2
board.edge.north.move.relative(0, 0)
board.edge.north.position.y+=0.024
board.edge.north.position.x = board.element.localToWorld(new THREE.Vector3(-0.17, board.element.worldToLocal(new THREE.Vector3(0, board.edge.north.position.y, 0)).y, 0)).x
board.edge.north.position.z = -0.006
scene.add(board.edge.north)

board.edge.south = THREE.create(new THREE.Vector3(1, 0.2, board.width+0.412), settings.colors.board.outline)
board.edge.south.rotation.z = 0.2
board.edge.south.move.relative(0, 1)
board.edge.south.position.z = -0.006
board.edge.south.position.x = board.element.localToWorld(new THREE.Vector3(-0.17, board.element.worldToLocal(new THREE.Vector3(0, board.edge.south.position.y, 0)).y, 0)).x
scene.add(board.edge.south)

Math["fixConvert"] = function(number) {
    if (number <= 0.5) {
        return 0
    } else {
        return 1
    }
}

board.edge.east = THREE.create(new THREE.Vector3(1, board.height+0.15, 0.2), settings.colors.board.outline)
board.edge.east.rotation.z = 0.192
board.edge.east.move.relative(1, 0.5)
board.edge.east.position.z-=0.012
board.edge.east.position.x = board.element.localToWorld(new THREE.Vector3(-0.17, board.element.worldToLocal(new THREE.Vector3(0, board.edge.east.position.y, 0)).y, 0)).x
scene.add(board.edge.east)

Math["fixConvert"] = function(number) {
    if (number < 0.5) {
        return -1
    } else {
        return 0
    }
}

board.edge.west = THREE.create(new THREE.Vector3(1, board.height+0.15, 0.2), settings.colors.board.outline)
board.edge.west.rotation.z = 0.192
board.edge.west.move.relative(0, 0.5)
board.edge.west.position.x = board.element.localToWorld(new THREE.Vector3(-0.17, board.element.worldToLocal(new THREE.Vector3(0, board.edge.west.position.y, 0)).y, 0)).x
scene.add(board.edge.west)

board.element.scale.y-=gridOffset
board.element.position.y+=gridOffset/2

for (i in board.grid.col) {
    board.gridX[i] = new BigNumber(board.grid.col[i].position.z).minus(0.1).toNumber()
}
for (i in board.grid.row) {
    board.gridY[i] = new BigNumber(board.grid.row[i].position.y).minus(0.088).toNumber()
}