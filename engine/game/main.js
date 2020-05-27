let game = {
    state: undefined,
    score: 0,
    deathLines: [
        "Come on, you can do better than that.",
        "Giving up already?",
        "You died to THAT? Of all things you died to that...",
        "Wow, you gave up that easily?",
        "Try not doing that next time, maybe you'll win then."
    ],
    isTaken: function(position) {
        return !(snake.positionHistory.indexOf(position) > -1 && snake.positionHistory.indexOf(position) <= snake.tail.length)
    },
    availablePositions: function(excludeSnake=true) {
        let unfilted = board.allPositions.slice(0).filter(game.isTaken)
        if (excludeSnake) {
            return unfilted.removeIndex(unfilted.indexOf(JSON.stringify(snake.position())))
        } else {
            return unfilted
        }
    },
    settings: {
        keybinds: {
            up: "w",
            right: "d",
            down: "s",
            left: "a"
        },
        speed: {
            unset: 10,
            current: 10,
            default: 10,
            max: 100,
            min: 0
        }
    },
    position: function(x=0, y=0) {
        this.x = x
        this.y = y
    },
    invalidAxis: "y",
    paused: false,
    pause: function(pauseMenu="pause") {
        if (!game.paused) {
            game.paused = true
            menu.load(pauseMenu)
            setTimeout(function() {
                new TWEEN.Tween(camera.rotation).easing(TWEEN.Easing.Quadratic.InOut).to({y: Math.PI*1.5}, 350).start()
            }, 200)
        }
    },
    unpause: function() {
        if (game.paused) {
            game.paused = false
            setTimeout(function() {
                new TWEEN.Tween(camera.rotation).easing(TWEEN.Easing.Quadratic.InOut).to({y: Math.PI/2}, 350).onComplete(function() {
                    setTimeout(game.update, 100)
                }).start()
            }, 200)
        }
    },
    nextMove: [],
    keyHandler: $(window).keydown(function(e) {
        if (game.invalidAxis != "y" && e.key == game.settings.keybinds.up && game.nextMove.length < 2 && !game.paused) {
            game.invalidAxis = "y"
            game.nextMove.push("w")
        } else if (game.invalidAxis != "y" && e.key == game.settings.keybinds.down && game.nextMove.length < 2 && !game.paused) {
            game.invalidAxis = "y"
            game.nextMove.push("s")
        } else if (game.invalidAxis != "x" && e.key == game.settings.keybinds.right && game.nextMove.length < 2 && !game.paused) {
            game.invalidAxis = "x"
            game.nextMove.push("d")
        } else if (game.invalidAxis != "x" && e.key == game.settings.keybinds.left && game.nextMove.length < 2 && !game.paused) {
            game.invalidAxis = "x"
            game.nextMove.push("a")
        } else if (e.key == "Escape") {
            if (game.paused) {
                game.unpause()
            } else {
                game.pause()
            }
        }
    }),
    detectCollision: function() {
        if (snake.outOfBounds()) {
            return true
        } else if (game.availablePositions(false).indexOf(JSON.stringify(snake.position())) == -1) {
            return true
        }
        return false
    },
    update: function() {
        if (game.nextMove.length > 0) {
            snake.facing = game.nextMove[0]
            game.nextMove.shift()
        }
        let currentPosition = snake.position()
        if (snake.facing == "w") {
            snake.position(new game.position(currentPosition.x, currentPosition.y-1))
        } else if (snake.facing == "s") {
            snake.position(new game.position(currentPosition.x, currentPosition.y+1))
        } else if (snake.facing == "d") {
            snake.position(new game.position(currentPosition.x+1, currentPosition.y))
        } else if (snake.facing == "a") {
            snake.position(new game.position(currentPosition.x-1, currentPosition.y))
        }
        if (!game.detectCollision()) {
            if (snake.tail.length > 0) {
                scene.remove(snake.tail.last().element)
                snake.tail.unshift(snake.tail.last())
                snake.tail.pop()
                scene.add(snake.tail[0].element)
                snake.tail[0].position(JSON.parse(snake.positionHistory[0]))
            }
            snake.positionHistory.unshift(JSON.stringify(snake.position()))
            if (JSON.stringify(snake.position()) == JSON.stringify(food.position())) {
                food.spawn()
                snake.addTail()
                game.score++
            }
        } else {
            snake.position(currentPosition)
            game.pause("retry")
        }
        if (!game.paused) {
            setTimeout(function() {
                requestAnimationFrame(game.update)
            }, game.settings.speed.current * 10)
        }
    },
    restart: function() {
        food.spawn()
        game.score = 0
        snake.tail.forEach(function(tail) {
            scene.remove(tail.element)
        })
        snake.tail = []
        snake.position(new game.position(board.getSize().maxWidth/2, board.getSize().maxHeight/2))
        game.settings.speed.current = game.settings.speed.unset
        game.unpause()
    }
}
snake.position(new game.position(board.getSize().maxWidth/2, board.getSize().maxHeight/2))
for (let x = 0; x < board.getSize().maxWidth; x++) {
    for (let y = 0; y < board.getSize().maxHeight; y++) {
        board.allPositions.push(JSON.stringify(new game.position(x, y)))
    }
}
food.spawn()
game.restart()
game.update()