import * as THREE from "three";
import './index.css';
import "./OrbitControls";
import { noise } from "./perlin";

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 1;
camera.position.z = 4;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

var lights = [];
var light = new THREE.PointLight(0x664444, 2, 50);
light.position.y = 2;
light.position.z = 2;
scene.add(light);
lights.push(light);

light = new THREE.PointLight(0x446644, 2, 50);
light.position.y = -2;
light.position.z = 4;
scene.add(light);
lights.push(light);

light = new THREE.PointLight(0x443366, 2, 50);
light.position.x = -2;
light.position.z = -2;
scene.add(light);
lights.push(light);

light = new THREE.PointLight(0x665522, 2, 50);
light.position.x = 2;
light.position.z = -2;
scene.add(light);
lights.push(light);

var panelsG = new THREE.PlaneGeometry(1000, 1000, 10, 10);
var panelsMat = new THREE.MeshPhongMaterial({
    color: 0x43b4de,
    transparent: true,
    opacity: 0.6,
    specular: 0x111111,
    shininess: 80,
    shading: THREE.SmoothShading,
});
var panelsMesh = new THREE.Mesh(panelsG, panelsMat);
scene.add(panelsMesh);

(function render() {
    requestAnimationFrame(render);

    renderer.render(scene, camera);
}());
