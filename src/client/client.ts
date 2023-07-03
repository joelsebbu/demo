import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import Stats from "three/examples/jsm/libs/stats.module";

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(25));

// const light = new THREE.SpotLight();
// light.position.set(20, 20, 20);
// scene.add(light);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 40;

const renderer = new THREE.WebGLRenderer();
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
const transformControls = new TransformControls(camera, renderer.domElement);
transformControls.setMode('rotate')
scene.add(transformControls)

transformControls.addEventListener('dragging-changed', function (event) {
  controls.enabled = !event.value
  //dragControls.enabled = !event.value
})

window.addEventListener('keydown', function (event) {
  switch (event.key) {
      case 'g':
          transformControls.setMode('translate')
          break
      case 'r':
          transformControls.setMode('rotate')
          break
      case 's':
          transformControls.setMode('scale')
          break
  }
})

const material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });
const material2 = new THREE.MeshBasicMaterial({ color: 0xffffff });

const loader = new PLYLoader();

const loadPLY  = (fileName: string, material: THREE.MeshBasicMaterial, loader: PLYLoader, transformControl: boolean) => {
  const geometry1 = (geometry: THREE.BufferGeometry) => {
    const mesh = new THREE.Mesh(geometry, material);
    const boundingBox = new THREE.Box3().setFromObject(mesh);
    const center = boundingBox.getCenter(new THREE.Vector3());
    
    transformControl && transformControls.position.copy(center);
    transformControl && transformControls.attach(mesh);
    scene.add(mesh);
  };
  const progress1 = (xhr: ProgressEvent) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  };
  const error1 = (error: ErrorEvent) => {
    console.log(error);
  };
  loader.load(fileName, geometry1, progress1, error1);
}


loadPLY( 'models/premolar-2-right.ply',material, loader, true);
loadPLY('models/gum.ply', material2, loader, false);

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

const stats = new Stats();
document.body.appendChild(stats.dom);

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  render();

  stats.update();
}

function render() {
  renderer.render(scene, camera);
}

animate();
