let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
let webGL = new THREE.WebGLRenderer({antialias: true});
document.body.appendChild(webGL.domElement);
webGL.setSize(window.innerWidth, window.innerHeight );
webGL.setPixelRatio(window.devicePixelRatio);
webGL.shadowMap.enabled = true
webGL.shadowMap.type = THREE.PCFSoftShadowMap
webGL.toneMapping = THREE.ACESFilmicToneMapping
webGL.toneMappingExposure = 0.8
let gameRender = $("canvas")[0]
let light = {
    hemisphere: new THREE.HemisphereLight(0xffffbb, 0x080820, 0.4),
    directional: new THREE.DirectionalLight( 0xffffff, 1)
}
let frame = {
  rate: 60,
  maxDelta: 16.67,
  setDelta: function(rate) {
    frame.maxDelta = (1000/rate).toFixed(2)
    frame.rate = rate
  },
  endTime: 0,
  startTime: 0,
  delta: 0,
}
let menu = {
  components: {},
  loadedElements: {},
  defaultResolution: {
    width: 1920,
    height: 977
  },
  load: function(element) {
    $("menu").html(menu.loadedElements[element])
    menu.onLoad()
  }
}
let settings = {
  colors: {
    board: {
      background: parseInt(localStorage.getItem("backgroundColor"), 16) || 0xededed,
      grid: parseInt(localStorage.getItem("gridColor"), 16) || 0x333333, 
      outline: parseInt(localStorage.getItem("outlineColor"), 16) || 0x202020,
    },
    snake: {
      head: parseInt(localStorage.getItem("headColor"), 16) || 0x218eed,
      tail: parseInt(localStorage.getItem("tailColor"), 16) || 0x42c15b
    },
    apple: parseInt(localStorage.getItem("appleColor"), 16) || 0xcc3232
  },
  shadow: {
    quality: localStorage.getItem("shadowQuality"),
    off: 0,
    low: 256,
    medium: 512,
    high: 1024,
    ultra: 2048,
    nightmare: 4096,
    null: 512, 
  }
}

frame.setDelta(parseInt(localStorage.getItem("framerate")) || 60)

light.directional.castShadow = true
light.directional.position.set(5, 2.5, 4)
light.directional.shadow.mapSize.width = settings.shadow[settings.shadow.quality];
light.directional.shadow.mapSize.height = settings.shadow[settings.shadow.quality];
scene.add(light.directional)
scene.add(light.hemisphere)

camera.rotation.order = 'YXZ'
camera.rotation.x = 0
camera.rotation.y = new BigNumber(Math.PI).dividedBy(2).toNumber()
camera.position.set(5, 0, 0)

gameLoaded = false
gameCallback = function() {}

let endFrame = 0
let updateScene = function () {
    TWEEN.update()
    frame.startTime = performance.now() 
    webGL.render(scene, camera);
    if (menu.render) {
      menu.renderer.render(scene, camera)
    }
    frame.endTime = performance.now()
    frame.delta = new BigNumber(frame.endTime).minus(frame.startTime).toNumber()
    setTimeout(function() {
      requestAnimationFrame(updateScene)
    }, Math.max(0, new BigNumber(frame.maxDelta).minus(frame.delta).toNumber()))
};

$(window).resize(function() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  webGL.setSize(window.innerWidth, window.innerHeight);
  if (menu.render) {
    menu.renderer.setSize(window.innerWidth, window.innerHeight);
  }
})