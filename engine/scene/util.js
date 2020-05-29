jQuery.loadHTML = function (url, sync=true, callback) {
    let returnValue;
    if (sync == false) {
        jQuery.ajax({
            url: url,
            dataType: 'html',
            success: function(data) {
                returnValue = data 
            },
            async: false
        });
    } else {
        jQuery.ajax({
            url: url,
            dataType: 'html',
            success: callback,
            async: true
        })
    }
    return returnValue
}
THREE.create = function(size={x: 0.5, y: 1, z: 1}, color=0xa3a3a3, shadow=true) {
    let mat;
    if (shadow) {
        mat = new THREE.MeshLambertMaterial({color: color})
    } else {
        mat = new THREE.MeshBasicMaterial({color: color})
    }
    let object = new THREE.Mesh(new THREE.BoxGeometry(size.x, size.y, size.z), mat)
    object.receiveShadow = shadow
    object.castShadow = shadow
    object.move = {
        abosolute: function(x, y, z) {
            object.position.set(x, y, z)
            return object
        },
        relative: function(x, y, depth=-0.17, boxSize) {
            let size = object.geometry.parameters
            let localVector = board.element.localToWorld(new THREE.Vector3(depth, Math.convert(y), Math.convert(x)))
            let posX = Math.fixConvert(x)
            let posY = Math.fixConvert(y)
            let newVector = new THREE.Vector3(localVector.x, localVector.y - ((boxSize || size.height)/2)*posY, localVector.z - ((boxSize || size.depth)/2)*posX)
            object.position.set(newVector.x, newVector.y, newVector.z)
            return object
        }
    }
    return object
}
Math["fixConvert"] = function(number) {
    if (number > 0.5) {
        return 0
    } else {
        return 1
    }
}
Math["isNegative"] = function(number) {
    return (number/Math.abs(number)) || 1
}
Math["convert"] = function(input) {
    return 0.5 - input
}
Object.defineProperty(Array.prototype, 'last', {
    value: function() {
        return this[this.length-1]
    }
});
Object.defineProperty(Number.prototype, 'fix', {
    value: function(decimals) {
        return parseFloat(this.toFixed(decimals))
    }
});
Object.defineProperty(THREE.PerspectiveCamera.prototype, 'calculateSize', {
    value: function(size, fixTo=15) {
        let depth = this.position.x
        const cameraOffset = this.position.z
        if ( depth < cameraOffset ) {
            depth -= cameraOffset
        } else {
            depth += cameraOffset
        }
      
        const vFOV = this.fov * Math.PI / 180
        const relativeHeight = Math.tan( vFOV / 2 ) * Math.abs( depth )
        const relativeWidth = relativeHeight * this.aspect
        let xScale = 1, yScale = 1
        if (relativeWidth.fix(fixTo) < size.boardWidth.fix(fixTo)) {
            xScale = relativeWidth.fix(fixTo)/size.boardWidth.fix(fixTo)
        }
        if (relativeHeight.fix(fixTo) < size.boardHeight.fix(fixTo)) {
            yScale = relativeHeight.fix(fixTo)/size.boardHeight.fix(fixTo)
        }
        return {
            width: (xScale*1.5).fix(fixTo),
            height: (yScale*1.5).fix(fixTo)
        }
    }
});
Object.defineProperty(Array.prototype, 'removeIndex', {
    value: function(index) {
        if (index > -1) { 
            let tempArray = this.splice(index, 1000)
            tempArray.shift()
            return this.concat(tempArray)
        } else {
            return this
        }
    }
});
Object.defineProperty(Array.prototype, 'random', {
    value: function() {
        return this[Math.floor(Math.random() * this.length)]
    }
});
function tryReturn(func, returnValue) {
    try {
        return func()    
    } catch(e) {
        return returnValue
    }
}
function keybindFix(event) {
    let output = "";
    if (event.shiftKey && event.key != "Shift") {
        output+= "Shift + "
    }
    if (event.ctrlKey && event.key != "Control") {
        output+= "Control + "
    }
    if (event.altKey && event.key != "Alt") {
        output+= "Alt + "  
    }
    let lookUp = {
        ArrowUp: "Up Arrow",
        ArrowDown: "Down Arrow",
        ArrowRight: "Right Arrow",
        ArrowLeft: "Left Arrow",
        " ": "Space"
    }
    output+= lookUp[event.key] || event.key.charAt(0).toUpperCase() + event.key.slice(1)
    return output
} 