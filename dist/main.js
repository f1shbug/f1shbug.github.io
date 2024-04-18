// Import necessary modules from Three.js
import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import { OrbitControls } from 'https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js';

// Setup the scene, camera, and renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 2);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
light.castShadow = true;
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.2));

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.autoRotate = true;
controls.autoRotateSpeed = 2.0;
controls.update();

// Textures
const textureLoader = new THREE.TextureLoader();
const cubeTextures = {
    funky: textureLoader.load('fishbug.jpg'),
    inch: textureLoader.load('inchworm.jpg'),
    bish: textureLoader.load('bishfug.jpg'),
    up: textureLoader.load('up&out.jpg')
};

// Cubes
const geometry = new THREE.BoxGeometry(1, 1, 1);
const cubes = {
    up: new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ map: cubeTextures.up })),
    funky: new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ map: cubeTextures.funky })),
    inch: new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ map: cubeTextures.inch })),
    bish: new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ map: cubeTextures.bish }))
};

cubes.up.position.set(-2, 2, 0);
cubes.funky.position.set(2, 2, 0);
cubes.inch.position.set(0, -2, 0);
cubes.bish.position.set(0, 0, 2);

Object.values(cubes).forEach(cube => {
    scene.add(cube);
});

const clickableObjects = Object.values(cubes);

// Ground plane
const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xCCCCCC, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -10;
scene.add(plane);

// Grid helper
const gridHelper = new THREE.GridHelper(1000, 100);
gridHelper.position.y = -10;
scene.add(gridHelper);

// Animation
let color1 = new THREE.Color(0xE2A4C6); // Start color: black
let color2 = new THREE.Color(0xE7B4C6); // End color: red
let step = 0;
let rotationSpeed = 0.01;
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    Object.values(cubes).forEach(cube => {
        cube.rotation.x += rotationSpeed;
        cube.rotation.y += rotationSpeed;
    });
    step += 0.005;
    if (step >= 1) {
        step = 0;
        // Swap colors
        let tempColor = color1;
        color1 = color2;
        color2 = tempColor;
    }
    scene.background.lerpColors(color1, color2, step);

    renderer.render(scene, camera);
}
animate();

// Event listeners
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
window.addEventListener('click', onMouseClick, false);
function onMouseClick(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(clickableObjects);
    if (intersects.length > 0) {
        console.log('Object clicked:', intersects[0].object);
        scene.remove(intersects[0].object);
    }
}

// GUI Controls
// needs to be after mouseclick event listener
document.getElementById('toggleOrbit').addEventListener('click', () => {
    controls.autoRotate = !controls.autoRotate;
});
document.getElementById('speedControl').addEventListener('input', event => {
    rotationSpeed = parseFloat(event.target.value);
});
