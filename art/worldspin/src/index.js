import * as THREE from "three";
import "./index.css";
import "./OrbitControls";
import { noise } from "./perlin";
import Audio from "./audio";

var audio = new Audio(document.querySelector("audio"));

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
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

var waterG = new THREE.SphereGeometry(1, 64, 64);
var waterMat = new THREE.MeshPhongMaterial({
  color: 0x43b4de,
  transparent: true,
  opacity: 0.6,
  specular: 0x111111,
  shininess: 80,
  shading: THREE.SmoothShading,
});
var waterM = new THREE.Mesh(waterG, waterMat);
scene.add(waterM);

for (var i = 0; i < waterG.vertices.length; i++) {
  var v = waterG.vertices[i];
  var r = 5;
  v.multiplyScalar(1 + -0.02 * noise.simplex3(v.x * r, v.y * r, v.z * r));
}

var waterGSave = waterG.clone();

var geometry = new THREE.OctahedronGeometry(1, 6);

for (var i = 0; i < geometry.vertices.length; i++) {
  var v = geometry.vertices[i];
  var x = 1;
  var y = 2;
  var z = 5;
  v.multiplyScalar(
    1 +
      0.1 * noise.simplex3(v.x * x, v.y * x, v.z * x) +
      0.05 * noise.simplex3(v.x * y, v.y * y, v.z * y) +
      0.02 * noise.simplex3(v.x * z, v.y * z, v.z * z)
  );
}

var material = new THREE.MeshPhongMaterial({
  color: "#88cc99",
  specular: 0x111111,
  shininess: 30,
  shading: THREE.FlatShading,
});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

var particles = new THREE.Geometry();
for (var i = 0; i < 2048; i++) {
  var pos = new THREE.Vector3(
    Math.random() * 10 - 5,
    Math.random() * 10 - 5,
    Math.random() * 10 - 5
  );
  particles.vertices.push(pos);
}
var particleField = new THREE.Points(
  particles,
  new THREE.PointsMaterial({
    size: 0.01,
    color: 0xeeccff,
  })
);
scene.add(particleField);

// audio.play();

var waves = [];
var unitSphere = new THREE.SphereGeometry(1, 32, 32);
for (var i = 0; i < 32; ++i) {
  var waveG = new THREE.SphereGeometry(1, 32, 32);
  var waveMat = new THREE.MeshPhongMaterial({
    color: 0xcccccc,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    //wireframe: true,
    //wireframeLinewidth: 3,
  });
  var waveM = new THREE.Mesh(waveG, waveMat);
  waveM.myopacity = 0;
  waveM.idx = i;
  waveM.rotation.x = 0.1 * Math.random();
  waveM.rotation.y = 0.1 * Math.random();
  waveM.rotation.z = 0.1 * Math.random();
  waves.push(waveM);
  scene.add(waveM);
}

var waterI = 0;
var frameI = 0;
var colorShift = 0;
function render() {
  frameI++;

  requestAnimationFrame(render);

  var fft = audio.fft();
  var sum = 0;
  for (var i = 0; i < fft.length; i++) {
    if (i < fft.length / 3) {
      sum += fft[i];
    }
  }
  var sensitivity = 3;
  var level = (sum / fft.length / 2 / 256) * sensitivity;

  if (frameI % 1 === 0) {
    var wf = audio.waveform();
    var wave = waves.pop();
    waves.unshift(wave);

    for (var i = 0; i < wave.geometry.vertices.length; i++) {
      var v = wave.geometry.vertices[i];
      v.copy(unitSphere.vertices[i]).multiplyScalar((wf[i] / 255) * 1 + 1);
    }
    wave.geometry.verticesNeedUpdate = true;
    wave.myopacity = level;
    var hue = noise.simplex2(colorShift, 0);
    colorShift += 0.05;
    wave.material.color.setHSL(hue, 1, level);

    var waveF = 1.02;
    for (var i = 0; i < waves.length; i++) {
      var wave = waves[i];
      wave.renderOrder = i;
      wave.scale.x = 1 * Math.pow(waveF, i);
      wave.scale.y = 1 * Math.pow(waveF, i);
      wave.scale.z = 1 * Math.pow(waveF, i);
      waves[i].material.opacity =
        waves[i].myopacity * (((waves.length - i) / waves.length) * 1.5);
    }
  }

  for (var i = 0; i < waterG.vertices.length; i++) {
    var vs = waterGSave.vertices[i];
    var v = waterG.vertices[i];
    var c = Math.abs(vs.x - 17 * vs.y + vs.z * i * vs.y - vs.x * vs.x);
    v.copy(vs).multiplyScalar(
      1 +
        0.004 * Math.cos(waterI + c) +
        0.004 * Math.cos(waterI * 0.55555 + c) +
        0.004 * Math.cos(waterI * Math.PI + c)
    );
  }
  waterG.verticesNeedUpdate = true;
  waterI += 0.02;

  var t = audio.timestamp();
  cube.rotation.x += (Math.cos(t) * Math.cos(t) * level) / 2;
  cube.rotation.y += (Math.cos(t) * Math.sin(t) * level) / 2;
  cube.rotation.z += (Math.sin(t) * Math.sin(t) * level) / 2;
  cube.scale.x = 0.5 * Math.pow(2, 1 + level);
  cube.scale.y = 0.5 * Math.pow(2, 1 + level);
  cube.scale.z = 0.5 * Math.pow(2, 1 + level);
  var hsl = cube.material.color.getHSL();
  cube.material.color.setHSL(hsl.h, hsl.s, Math.max(0.5, level * 1.5));

  waterM.rotation.x += 0.001;
  waterM.rotation.y += 0.002;
  waterM.rotation.z += 0.003;
  waterM.scale.x = 0.5 * Math.pow(2, 1 + level);
  waterM.scale.y = 0.5 * Math.pow(2, 1 + level);
  waterM.scale.z = 0.5 * Math.pow(2, 1 + level);
  var hsl = waterM.material.color.getHSL();
  waterM.material.color.setHSL(hsl.h, hsl.s, Math.max(0.5, level * 1.5));

  particleField.rotation.x += 0.00004;
  particleField.rotation.y += 0.00003;
  particleField.rotation.z += 0.00002;

  controls.update();
  renderer.render(scene, camera);
}
render();
