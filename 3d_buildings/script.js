// Three JS Template
// import * as THREE from 'https://raw.githubusercontent.com/mrdoob/three.js/dev/src/Three.js';
//----------------------------------------------------------------- BASIC parameters
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

if (window.innerWidth > 800) {
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  // renderer.toneMapping = THREE.ReinhardToneMapping;
};

document.body.appendChild(renderer.domElement);

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 2, 14);

const scene = new THREE.Scene();
const city = new THREE.Object3D();
const smoke = new THREE.Object3D();
const town = new THREE.Object3D();

let createCarPos = true;
const uSpeed = 0.001;

//----------------------------------------------------------------- FOG background
const setcolor = 0x7070FF;
scene.background = new THREE.Color(setcolor);
scene.fog = new THREE.Fog(setcolor, 10, 40);

//----------------------------------------------------------------- RANDOM Function
function mathRandom(num = 8) {
  return -Math.random() * num + Math.random() * num;
}

//----------------------------------------------------------------- CHANGE building colors
let setTintNum = true;
function setTintColor() {
  setTintNum = !setTintNum;
  return 0x0A0A0A;
}

//----------------------------------------------------------------- CREATE City
let buildings = [];
function init() {
  var segments = 2;
  for (var i = 1; i<100; i++) {
    var geometry = new THREE.BoxGeometry(1,1,1,segments,segments,segments);
    var material = new THREE.MeshStandardMaterial({
      color:setTintColor(),
      wireframe:false,
      // opacity:0.9,
      transparent:true,
      roughness: 0.5,
      metalness: 1,
      flatShading: THREE.SmoothShading,
      fog: true,
      side:THREE.DoubleSide});
    var wmaterial = new THREE.MeshLambertMaterial({
      color:0xFFFFFF,
      wireframe:true,
      transparent:true,
      opacity: 0.03,
      side:THREE.DoubleSide/*,
      shading:THREE.FlatShading*/});

    var cube = new THREE.Mesh(geometry, material);
    var wire = new THREE.Mesh(geometry, wmaterial);
    var floor = new THREE.Mesh(geometry, material);
    var wfloor = new THREE.Mesh(geometry, wmaterial);
    
    cube.add(wfloor);
    cube.castShadow = true;
    cube.receiveShadow = true;
    cube.rotationValue = 0.1+Math.abs(mathRandom(8));
    
    //floor.scale.x = floor.scale.z = 1+mathRandom(0.33);
    floor.scale.y = 0.05;//+mathRandom(0.5);
    cube.scale.y = 0.1+Math.abs(mathRandom(8));
    //TweenMax.to(cube.scale, 1, {y:cube.rotationValue, repeat:-1, yoyo:true, delay:i*0.005, ease:Power1.easeInOut});
    /*cube.setScale = 0.1+Math.abs(mathRandom());
    
    TweenMax.to(cube.scale, 4, {y:cube.setScale, ease:Elastic.easeInOut, delay:0.2*i, yoyo:true, repeat:-1});
    TweenMax.to(cube.position, 4, {y:cube.setScale / 2, ease:Elastic.easeInOut, delay:0.2*i, yoyo:true, repeat:-1});*/
    
    var cubeWidth = 0.9;
    cube.scale.x = cube.scale.z = cubeWidth+mathRandom(1-cubeWidth);
    //cube.position.y = cube.scale.y / 2;
    cube.position.x = Math.round(mathRandom());
    cube.position.z = Math.round(mathRandom());
    
    floor.position.set(cube.position.x, 0/*floor.scale.y / 2*/, cube.position.z)
    
    town.add(floor);
    town.add(cube);
    buildings.push(cube);
  };
  //----------------------------------------------------------------- Particular
  
  var gmaterial = new THREE.MeshToonMaterial({color:0xFFFF00, side:THREE.DoubleSide});
  var gparticular = new THREE.CircleGeometry(0.01, 3);
  var aparticular = 5;
  
  for (var h = 1; h<300; h++) {
    var particular = new THREE.Mesh(gparticular, gmaterial);
    particular.position.set(mathRandom(aparticular), mathRandom(aparticular),mathRandom(aparticular));
    particular.rotation.set(mathRandom(),mathRandom(),mathRandom());
    smoke.add(particular);
  };
  
  var pmaterial = new THREE.MeshPhongMaterial({
    color:0x000000,
    side:THREE.DoubleSide,
    reflectivity: 1,
    refractionRatio: 1,
    shininess: 0.5,
    // roughness: 10,
    // metalness: 0.6,
    // opacity:0.9,
    transparent:true});
  var pgeometry = new THREE.PlaneGeometry(60,60);
  var pelement = new THREE.Mesh(pgeometry, pmaterial);
  pelement.rotation.x = -90 * Math.PI / 180;
  pelement.position.y = -0.001;
  pelement.receiveShadow = true;
  //pelement.material.emissive.setHex(0xFFFFFF + Math.random() * 100000);

  city.add(pelement);
};

//----------------------------------------------------------------- MOUSE function
const mouse = new THREE.Vector2();
function onMouseMove(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
function onDocumentTouchStart(event) {
  if (event.touches.length == 1) {
    event.preventDefault();
    mouse.x = event.touches[0].pageX - window.innerWidth / 2;
    mouse.y = event.touches[0].pageY - window.innerHeight / 2;
  }
}
function onDocumentTouchMove(event) {
  if (event.touches.length == 1) {
    event.preventDefault();
    mouse.x = event.touches[0].pageX - window.innerWidth / 2;
    mouse.y = event.touches[0].pageY - window.innerHeight / 2;
  }
}
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('touchstart', onDocumentTouchStart, false);
window.addEventListener('touchmove', onDocumentTouchMove, false);
const onMouseWheel = function (event) {
  const delta = event.deltaY;

  // Adjust the camera position based on the mouse wheel delta
  camera.position.z += delta * 0.01; // You can adjust the zoom speed

  // Limit the camera's zoom range
  camera.position.z = Math.max(5, Math.min(30, camera.position.z));
};

// Add event listener for mouse wheel events
window.addEventListener('wheel', onMouseWheel);

//----------------------------------------------------------------- Lights
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 4);
const lightFront = new THREE.SpotLight(0xFFFFFF, 20, 10);
const lightBack = new THREE.PointLight(0xFFFFFF, 0.5);

lightFront.rotation.x = 45 * Math.PI / 180;
lightFront.rotation.z = -45 * Math.PI / 180;
lightFront.position.set(5, 5, 5);
lightFront.castShadow = true;
lightFront.shadow.mapSize.width = 6000;
lightFront.shadow.mapSize.height = lightFront.shadow.mapSize.width;
lightFront.penumbra = 0.2;
lightBack.position.set(0, 6, 0);

smoke.position.y = 2;

scene.add(ambientLight);
city.add(lightFront);
scene.add(lightBack);
scene.add(city);
city.add(smoke);
city.add(town);

//----------------------------------------------------------------- GRID Helper
const gridHelper = new THREE.GridHelper(60, 120, 0xFF0000, 0x000000);
city.add(gridHelper);

//----------------------------------------------------------------- LINES world
const createCars = function (cScale = 2, cPos = 20, cColor = 0xFFFF00) {
  const cMat = new THREE.MeshToonMaterial({ color: cColor, side: THREE.DoubleSide });
  const cGeo = new THREE.BoxGeometry(1, cScale / 40, cScale / 40);
  const cElem = new THREE.Mesh(cGeo, cMat);
  const cAmp = 3;

  if (createCarPos) {
    createCarPos = false;
    cElem.position.x = -cPos;
    cElem.position.z = mathRandom(cAmp);

    TweenMax.to(cElem.position, 3, { x: cPos, repeat: -1, yoyo: true, delay: mathRandom(3) });
  } else {
    createCarPos = true;
    cElem.position.x = mathRandom(cAmp);
    cElem.position.z = -cPos;
    cElem.rotation.y = 90 * Math.PI / 180;

    TweenMax.to(cElem.position, 5, { z: cPos, repeat: -1, yoyo: true, delay: mathRandom(3), ease: Power1.easeInOut });
  }
  cElem.receiveShadow = true;
  cElem.castShadow = true;
  cElem.position.y = Math.abs(mathRandom(5));
  city.add(cElem);
}

const generateLines = function () {
  for (let i = 0; i < 60; i++) {
    createCars(0.1, 20);
  }
}

//----------------------------------------------------------------- CAMERA position
const cameraSet = function () {
  createCars(0.1, 20, 0xFFFFFF);
}

//----------------------------------------------------------------- ANIMATE
const animate = function () {
  const time = Date.now() * 0.00005;
  requestAnimationFrame(animate);

  city.rotation.y -= ((mouse.x * 8) - camera.rotation.y) * uSpeed;
  city.rotation.x -= (-(mouse.y * 2) - camera.rotation.x) * uSpeed;
  if (city.rotation.x < -0.05) city.rotation.x = -0.05;
  else if (city.rotation.x > 1) city.rotation.x = 1;
  const cityRotation = Math.sin(Date.now() / 5000) * 13;

  smoke.rotation.y += 0.01;
  smoke.rotation.x += 0.01;

  camera.lookAt(city.position);
  renderer.render(scene, camera);
}

//----------------------------------------------------------------- START functions
generateLines();
init();
animate();

