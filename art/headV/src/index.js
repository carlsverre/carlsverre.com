import "./styles.css";

import * as THREE from "three";
import "./vendor/OrbitControls";

import Audio from "./audio";

var audio;
var scene, camera, renderer, controls;

var bars = [];

function setup() {
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = false;

    var material = new THREE.MeshNormalMaterial();
    for (var i = 0; i < 32; ++i) {
        var geometry = new THREE.BoxGeometry(100, 100, 100);
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = -500 + (150 * i);
        bars.push(mesh);
        scene.add(mesh);
    }

    audio = new Audio(document.querySelector("audio"));
    audio.play();

    draw();
}

function draw() {
    requestAnimationFrame(draw);

    var t = audio.timestamp();
    var fft = audio.fft();
    var waveform = audio.waveform();

    for (var i = 0; i < bars.length; ++i) {
        var bar = bars[i];
        bar.scale.y = (fft[i] / 128.0) * (waveform[i] / 128);
    }

    renderer.render(scene, camera);
}

document.addEventListener("DOMContentLoaded", setup);
