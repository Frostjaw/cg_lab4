let camera, scene, renderer, controls;
let pointLight;
let objects = [];
let materials = [];

window.onload = function(){
	launchScene();
	animateScene();
	launchMaterialChangeSelect();
}

function launchScene() {
	let canvas = document.createElement('div');
	document.body.appendChild(canvas);

	// renderer
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth * 0.9, window.innerHeight * 0.9);
	canvas.appendChild(renderer.domElement);

	// camera
	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight);
	camera.position.set(500, 250, 500);
	scene = new THREE.Scene();

	// controls
	controls = new THREE.OrbitControls(camera, renderer.domElement);

	// materials
	setMaterials(materials);
	
	// objects
	let sphereGeometry = new THREE.SphereBufferGeometry(60, 32, 32);
	for (let i = 0; i < 4; i++) {
		addObject(objects, sphereGeometry, materials[i]);
	}

	// grid
	let grid = new THREE.GridHelper(2000, 30);
	grid.position.y = - 100;
	scene.add(grid);
	
	// light

	// global light
	scene.add(new THREE.AmbientLight(0x404040)); // soft white light

	// point light
	pointLight = new THREE.PointLight(0xFDB813, 1); // sun color
	scene.add(pointLight);

	// light object
	let lightGeometry = new THREE.SphereBufferGeometry(8, 8, 8);
	let lightMaterial = new THREE.MeshBasicMaterial({color: 0xFDB813});
	let lightSphere = new THREE.Mesh(lightGeometry, lightMaterial);
	pointLight.add(lightSphere);
}

function setMaterials(materials) {

	let texture1 = new THREE.TextureLoader().load('https://i.imgur.com/befKz6e.jpg');
	let texture2 = new THREE.TextureLoader().load('https://i.imgur.com/t8YCFtb.jpg'); 	
	materials.push(new THREE.MeshLambertMaterial({ map: texture1 }));
	materials.push(new THREE.MeshLambertMaterial({ map: texture2 }));
	materials.push(new THREE.MeshLambertMaterial({ color: 0x00ff00 })); // green
	materials.push(new THREE.MeshLambertMaterial({ color: 0xff0000 })); // red
	materials.push(new THREE.MeshLambertMaterial());
}

function addObject(objects, geometry, material) {

	let mesh = new THREE.Mesh(geometry, material);
	mesh.position.x = (objects.length % 2) * 300 - 100;
	mesh.position.z = Math.floor(objects.length / 2) * 300 - 100;
	objects.push(mesh);
	scene.add(mesh);
}

function animateScene() {
	requestAnimationFrame(animateScene);
	renderScene();
}

function renderScene() {
	const rotationAngle = 0.005;

	// object rotation
	for (let i = 0; i < objects.length; i++) {
		objects[i].rotation.x += rotationAngle;
		objects[i].rotation.y += rotationAngle;
	}

	// light position
	let utilTimer = Date.now() / 10000;	
	pointLight.position.x = Math.sin(utilTimer * 5) * 300;
	pointLight.position.y = Math.cos(utilTimer * 5) * 300;
	pointLight.position.z = Math.cos(utilTimer * 5) * 300;
	
	renderer.render(scene, camera);
}

function launchMaterialChangeSelect() {

	document.getElementById("changeMaterialButton").addEventListener('click', function(){
		
		// material
		let materialSelect = document.getElementById("materialSelect");
		let materialIndex = materialSelect.selectedIndex;
		
		// object
		let objectSelect = document.getElementById("objectSelect");		
		let objectIndex = objectSelect.selectedIndex;	

		objects[objectIndex].material = materials[materialIndex];
	});
}