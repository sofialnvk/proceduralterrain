if (WEBGL.isWebGLAvailable() === false) {
  document.body.appendChild(WEBGL.getWebGLErrorMessage());
}

var stats, camera, scene, renderer, controls, sunSphere;

init();
var startTime = Date.now();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x010101);

  camera = new THREE.PerspectiveCamera(
    50, //Field of view, in degrees
    window.innerWidth / window.innerHeight, //aspect ratio
    1, //near clipping plane
    10000 //far clipping plane
  );
  camera.position.y = 400;
  camera.position.z = 400;
  camera.rotation.x = (-15 * Math.PI) / 180;
  camera.lookAt(0, 0, 0);
  controls = new THREE.OrbitControls(camera);
  controls.update();

  uniforms = {
    time: { type: "f", value: 1.0 },
    position_x: { type: "f", value: 1020.0 },
    position_y: { type: "f", value: 310.0 },
    position_z: { type: "f", value: 187.0 }
  };

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  var material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: document.getElementById("vertexShader").textContent,
    fragmentShader: document.getElementById("fragmentShader").textContent,
    side: THREE.DoubleSide,
    wireframe: false
  });

  var meshTerrain = new THREE.Mesh(
    new THREE.PlaneGeometry(400, 400, 400, 400),
    material
  );
  meshTerrain.rotation.x -= Math.PI / 2;
  scene.add(meshTerrain);

  var axesHelper = new THREE.AxesHelper(50);
  axesHelper.position.set(0, -100, 0);
  scene.add(axesHelper);

  var sunGeometry = new THREE.SphereGeometry(20, 32, 32);
  var sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  sunSphere = new THREE.Mesh(sunGeometry, sunMaterial);
  sunSphere.position.x = 1020;
  sunSphere.position.y = 310;
  sunSphere.position.z = 187;
  scene.add(sunSphere);

  stats = new Stats();
  document.body.appendChild(stats.dom);
  window.addEventListener("resize", onWindowResize, false);

  GUI();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function GUI() {
  lightSourceController = {
    pos_x: 1020.0,
    pos_y: 310.0,
    pos_z: 187.0
  };

  var myWindow;
  var gui = new dat.GUI();
  myWindow = gui.addFolder("Light direction");
  myWindow
    .add(lightSourceController, "pos_x", -2000.0, 2000.0, 1.0)
    .name("x")
    .onChange(render);
  myWindow
    .add(lightSourceController, "pos_y", -2000.0, 2000.0, 1.0)
    .name("y")
    .onChange(render);
  myWindow
    .add(lightSourceController, "pos_z", -100.0, 2000.0, 1.0)
    .name("z")
    .onChange(render);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  render();
  stats.update();
}
function render() {
  var elapsedMilliseconds = Date.now() - startTime;
  var elapsedSeconds = elapsedMilliseconds / 1000;
  uniforms.time.value = elapsedSeconds;
  uniforms.position_x.value = lightSourceController.pos_x;
  uniforms.position_y.value = -lightSourceController.pos_y;
  uniforms.position_z.value = lightSourceController.pos_z;

  sunSphere.position.x = lightSourceController.pos_x;
  sunSphere.position.y = lightSourceController.pos_z;
  sunSphere.position.z = lightSourceController.pos_y;

  renderer.render(scene, camera);
}
