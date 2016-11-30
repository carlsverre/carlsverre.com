import "./styles.css";

import * as THREE from "three";
import "./vendor/OrbitControls";
import { noise } from "./vendor/perlin";

import Audio from "./audio";

var audio;
var scene, camera, renderer, controls, globalLight;

var bars = [];

function setup() {
    scene = new THREE.Scene();
    scene.fog = THREE.Fog(0xffffff, 0, 500);

    noise.seed(Math.random());

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.05;

    globalLight = new THREE.HemisphereLight(0x404040);
    scene.add(globalLight);

    // create random "rays" through the scene
    for (var i = 0; i < 128; ++i) {
        var geometry = new THREE.BoxGeometry(50, 5000, 50);
        var color = new THREE.Color();
        color.setHSL((noise.perlin3(i, 0, 0) + 1) / 2, 0.5, 0.5);
        var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
            color: "#" + color.getHexString(),
            specular: 0x009900,
            shininess: 30,
            shading: THREE.FlatShading,
            side: THREE.DoubleSide
        }));
        mesh.position.x = -1000 + (Math.random() * 2000);
        mesh.position.y = -1000 + (Math.random() * 2000);
        mesh.position.z = -1000 + (Math.random() * 2000);
        mesh.rotateX(Math.random() * Math.PI * 2);
        mesh.rotateY(Math.random() * Math.PI * 2);
        mesh.rotateZ(Math.random() * Math.PI * 2);
        bars.push(mesh);
        scene.add(mesh);
    }

    //debugaxis(1000);

    audio = new Audio(document.querySelector("audio"));
    audio.play();

    draw();
}

var debugaxis = function(axisLength){
    //Shorten the vertex function
    function v(x,y,z){
        return new THREE.Vector3(x,y,z);
    }

    //Create axis (point1, point2, colour)
    function createAxis(p1, p2, color){
        var line,
            lineGeometry = new THREE.Geometry(),
            lineMat = new THREE.LineBasicMaterial({color: color, linewidth: 1});
        lineGeometry.vertices.push(p1, p2);
        line = new THREE.Line(lineGeometry, lineMat);
        scene.add(line);
    }

    // x axis
    createAxis(v(-axisLength, 0, 0), v(axisLength, 0, 0), 0xFF0000);
    // y axis
    createAxis(v(0, -axisLength, 0), v(0, axisLength, 0), 0x00FF00);
    // z axis
    createAxis(v(0, 0, -axisLength), v(0, 0, axisLength), 0x0000FF);
};

var levels = [];
var colors = [];
for (var i = 0; i < 128; i++) {
    levels[i] = 0;
    colors[i] = 0;
}

var colorShift = 0;

function draw() {
    requestAnimationFrame(draw);

    var t = audio.timestamp();
    var fft = audio.fft();
    var waveform = audio.waveform();

    var topSum = 0;
    var medSum = 0;
    var botSum = 0;
    for(var i = 0; i < fft.length; i++) {
        if (i < 16) { botSum += fft[i]; }
        if (i >= 16 && i < 32) { medSum += fft[i]; }
        if (i >= 32 && i < 64) { topSum += fft[i]; }
    }
    var sensitivity = 2;
    var topAvg = (((topSum / 16) / 256) * sensitivity);
    var medAvg = (((medSum / 16) / 256) * sensitivity);
    var botAvg = (((botSum / 16) / 256) * sensitivity);
    levels.push(
        Math.min(0.3, botAvg) +
        Math.min(0.3, medAvg) +
        Math.min(0.3, topAvg));
    levels.shift(1);

    colorShift += 0.05;
    colors.push(Math.abs(noise.perlin2(colorShift, 0)));
    colors.shift();

    // Lowest frequency controls the global light
    globalLight.intensity = botAvg / 5;

    for (var i = 0; i < Math.min(bars.length, fft.length); ++i) {
        var bar = bars[i];
        var level = levels[i];
        bar.material.color.setHSL(colors[i], 1, level);
    }

    controls.update();
    renderer.render(scene, camera);
}

document.addEventListener("DOMContentLoaded", setup);
