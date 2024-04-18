import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import { OrbitControls } from 'https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js';
let clickableObjects = [];

const imageUrl_Funky = 'textures/fishbug.jpg'; 
const imageUrl_inch = 'textures/inchworm.jpg'; 
const imageUrl_bish = 'textures/bishfug.jpg'; 
const imageUrl_up =  'textures/up&out.jpg';
const textureloader = new THREE.TextureLoader();
const funky_cubetexture = textureloader.load(imageUrl_Funky);
const inch_cubetexture = textureloader.load(imageUrl_inch);
const bish_cubetexture = textureloader.load(imageUrl_bish);
const up_cubetexture = textureloader.load(imageUrl_up);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);


let color1 = new THREE.Color(0xE2A4C6); // Start color: black
let color2 = new THREE.Color(0xE7B4C6); // End color: red
let step = 0;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Positioning the camera
camera.position.set(0, 0, 2);  // X, Y, Z positions
camera.lookAt(0, 0, 0);  // Pointing the camera towards the center of the scene

const light = new THREE.DirectionalLight(0xffffff, 1);  // White light
light.position.set(5, 5, 5);  // Position the light
light.target.position.set(0, 0, 0);
//const light_2 = new THREE.PointLight(0xffffff, 1);  // White light  // Position the light
light.castShadow = true;
renderer.shadowMap.enabled = true;
scene.add(light);
const ambientLight = new THREE.AmbientLight(0xffffff, .2);
scene.add(ambientLight);


const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0); // Set the position the camera looks at
controls.update();
controls.autoRotate = true;  // Enable auto-rotation
controls.autoRotateSpeed = 2.0;  // Adjust the rotation speed, default is 2.0

// Add your 3D objects and animation logic here

const geometry = new THREE.BoxGeometry(1, 1, 1);  // A cube of 1x1x1 units
const funky_material = new THREE.MeshStandardMaterial({map: funky_cubetexture});  // Red color for visibility
const funky_cube = new THREE.Mesh(geometry, funky_material);
const inch_material = new THREE.MeshStandardMaterial({map: inch_cubetexture});  // Red color for visibility
const inch_cube = new THREE.Mesh(geometry, inch_material);
const bish_material = new THREE.MeshStandardMaterial({map: bish_cubetexture});  // Red color for visibility
const bish_cube = new THREE.Mesh(geometry, bish_material);
const up_material = new THREE.MeshStandardMaterial({map: up_cubetexture});  // Red color for visibility
const up_cube = new THREE.Mesh(geometry, up_material);

up_cube.position.x = -2;
up_cube.position.y = 2;
funky_cube.position.x = 2;
funky_cube.position.y = 2;
inch_cube.position.y = -2;
bish_cube.position.z = 2;

up_cube.userData = { id: "zoomable", targetScene: "up" };
funky_cube.userData = { id: "zoomable", targetScene: "funky" };
inch_cube.userData = { id: "zoomable", targetScene: "inch" };
bish_cube.userData = { id: "zoomable", targetScene: "bish" };
scene.add(up_cube);  // Adding the cube to the scene
scene.add(funky_cube);
scene.add(bish_cube);
scene.add(inch_cube);
clickableObjects.push(up_cube);
clickableObjects.push(funky_cube);
clickableObjects.push(inch_cube);
clickableObjects.push(bish_cube);

const planeGeometry = new THREE.PlaneGeometry(1000, 1000); // You can adjust size as needed
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xCCCCCC, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2; // Rotate the plane to be horizontal
plane.position.y = -10; // Position the plane below your objects
plane.userData.clickable = false;
scene.add(plane);

const size = 1000;  // The size of the grid
const divisions = 100;  // Number of divisions in the grid
const gridHelper = new THREE.GridHelper(size, divisions);
gridHelper.position.y = -10;  // Align with the plane's position
gridHelper.userData.clickable = false;
scene.add(gridHelper);

// const outlineMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.BackSide, wireframe: true });
// const outlineMesh = new THREE.Mesh(geometry, outlineMaterial);
// outlineMesh.scale.multiplyScalar(1.05);
// scene.add(outlineMesh);


let rotationSpeed = 0.01;
animate(); 
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    // Update your scene and camera
    up_cube.rotation.x += rotationSpeed;  // Rotates the cube around its x-axis
    up_cube.rotation.y += rotationSpeed;  // Rotates the cube around its y-axis
    funky_cube.rotation.x += rotationSpeed;
    funky_cube.rotation.y -= rotationSpeed;
    inch_cube.rotation.y -= rotationSpeed;
    bish_cube.rotation.z += rotationSpeed;
    // outlineMesh.rotation.x -= 4 * rotationSpeed;
    // outlineMesh.rotation.y += 10 * rotationSpeed;
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

const toggleOrbitButton = document.getElementById('toggleOrbit');
toggleOrbitButton.addEventListener('click', function(event) {
    event.preventDefault()
    controls.autoRotate = !controls.autoRotate; // Toggle the autoRotate property
    controls.update(); // Optional, depending on your control settings
});
document.getElementById('speedControl').addEventListener('input', function(event) {
    rotationSpeed = parseFloat(event.target.value);
});
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
//window.addEventListener('click', onMouseClick);
function onMouseClick(event) {
    event.preventDefault()
    if (event.target === toggleOrbitButton) {
       return;
    }
    // Calculate mouse position in normalized device coordinates (-1 to +1) for both components
    
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(clickableObjects);
    print(clickableObjects)
    if (intersects.length > 0) {
        console.log('Object clicked:', intersects[0].object);
        // For example, change the color of the first intersected object
        //scene.remove(intersects[0].object);
    }
}
//window.addEventListener('click', onMouseClick);
// const loader = new THREE.GLTFLoader();
// loader.load(
//     staticBaseUrl + 'assets/Stratocaster.glb',  // Make sure to provide the correct path to your .glb file
//     function (gltf) {
//         gltf.scene.position.x = 2; // Position the model to the right
//         scene.add(gltf.scene);
//        // Start the animation loop once the model is loaded
//     },
//     undefined,
//     function (error) {
//         console.error('An error occurred while loading the model:', error);
//     }
// );