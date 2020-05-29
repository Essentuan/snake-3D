import {CSS3DRenderer, CSS3DObject} from 'https://essentuan.github.io/snake-3D/libraries/three.js/CSS3DRenderer.js';
menu.components.CSS3DRenderer = CSS3DRenderer
menu.components.CSS3DObject = CSS3DObject
menu.loadedElements.pause = $.loadHTML("./engine/menu/pause.html", false)
menu.loadedElements.retry = $.loadHTML("./engine/menu/retry.html", false)
menu.loadedElements.home = $.loadHTML("./engine/menu/home.html", false)
menu.loadedElements.undefined = "<div></div>"
menu.renderer = new menu.components.CSS3DRenderer()
menu.renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild(menu.renderer.domElement);
menu.renderer.domElement.classList.add("CSSRenderer");
menu.load("pause")
menu.object = new menu.components.CSS3DObject(document.getElementsByTagName("menu")[0])
scene.add(menu.object)
menu.object.rotation._order = "YXZ"
menu.object.rotation.set(-0.1, camera.rotation.y*-1, camera.rotation.z)
menu.object.position.x = 1000
menu.render = true
camera.rotation.y = Math.PI*1.5
game.pause("home")