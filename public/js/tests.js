import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
// import {BasicCharacterControls} from '/js/playerControler.js'
import {BasicCharacterControls} from '/js/testPlayerControler.js'

import {io} from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const socket = io('http://localhost:3000');


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(0, 15, -30);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({alpha:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// arena
const arena = new THREE.Group();
scene.add(arena);

const floorWidth = 200;
const floorHeight = 200;

const floorGeometry = new THREE.PlaneGeometry(floorWidth, floorHeight);
const floorMaterial = new THREE.MeshBasicMaterial({color: 0x38773f, side: THREE.DoubleSide});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = Math.PI * -0.5;
arena.add(floor);

const floorBottom = new THREE.Mesh(floorGeometry, floorMaterial);
floorBottom.rotation.x = Math.PI * -0.5;
floorBottom.position.y = -0.01;
arena.add(floorBottom);

// const towerGeometry = new THREE.CylinderGeometry(1, 1, (floorHeight + floorWidth), 5);
// const towermaterial = new THREE.MeshBasicMaterial({color:0x000000});
// const tower = new THREE.Mesh(towerGeometry, towermaterial);
// arena.add(tower);

for(let x = -floorWidth/2 + 0.45; x < floorWidth / 2 + 0.45; x += 1){
	const h = random(2, 6);;
	const geo = new THREE.BoxGeometry(0.5, h, 0.5);
	const mat = new THREE.MeshBasicMaterial({color:0x828282});
	const wall = new THREE.Mesh(geo, mat);
	wall.position.set(x, 0.45, floorHeight / 2  + 0.45);
	arena.add(wall);

	const wall2 = new THREE.Mesh(geo, mat);
	wall2.position.set(x, 0.45, -floorHeight / 2  - 0.45);
	arena.add(wall2);
}
for(let z = -floorHeight/2 + 0.45; z < floorHeight / 2 + 0.45; z += 1){
	const h = random(2, 6);;
	const geo = new THREE.BoxGeometry(0.5, h, 0.5);
	const mat = new THREE.MeshBasicMaterial({color:0x828282});
	const wall = new THREE.Mesh(geo, mat);
	wall.position.set(floorWidth/2  + 0.45, 0.45, z);
	arena.add(wall);

	const wall2 = new THREE.Mesh(geo, mat);
	wall2.position.set(-floorWidth/2  - 0.45, 0.45, z);
	arena.add(wall2);
}

const numTree = random(floorWidth / 3, floorHeight);
for(let i = 0; i < numTree; i++){
	const tree = new THREE.Group();

	const h = random(8, 13);
	const x = random(-floorWidth/2 +1 , floorWidth/2 -1);
	const z = random(-floorHeight/2 +1, floorHeight/2 -1);

	const geo = new THREE.CylinderGeometry(0.1, 0.5, h, 5);
	const mat = new THREE.MeshBasicMaterial({color:0x656565});
	const trunk = new THREE.Mesh(geo, mat);
	tree.add(trunk);

	const numOrbs = random(10, 15);
	for(let j = 0; j < numOrbs; j++){
		const orbGeo = new THREE.IcosahedronGeometry(random(0.4, 0.6), 0);
		const orbMat = new THREE.MeshBasicMaterial({color: 0xfffff});
		const orb = new THREE.Mesh(orbGeo, orbMat);
		orb.position.set(random(-3, 3),random(h/2 - 1, h/2 + 1), random(-3, 3))
		tree.add(orb);
	}
	
	tree.position.set(x, h/2, z);
	arena.add(tree);
}

function random(min, max){
	return Math.random() * (max - min) + min;
}



// player
const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
const playerMaterial = new THREE.MeshBasicMaterial({color: 0x232323});
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.set(0, 0.5, 0);
player.rotation.set(0,0,0);

const cameraPivot = new THREE.Object3D();
cameraPivot.add(camera);
player.add(cameraPivot);
scene.add(player);

const playerControler = new BasicCharacterControls({target: player, camera: cameraPivot});



let playerIndex = null;
let playersList = [];
let playerInfo = {};
let registered = false;
let playersInstanceList = [];
let playersTagList = [];

let target = null;

socket.on("connect", () => {
	socket.emit("registerPlayer", new THREE.Vector3(0,0,0), new THREE.Euler(0,0,0));
	console.log('connected');
});
socket.on("playerRegistered", (_playerInfo) => {
	playerInfo = _playerInfo;
	registered = true;
	console.log('registered');
});
socket.on("updatePlayers", (_list) => {
	playersList = _list;
	updatePlayers();
});


const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const mouseOrigin = new THREE.Vector2();
let rotating = false;

function select(){
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	raycaster.setFromCamera( mouse, camera );
	const intersects = raycaster.intersectObjects( scene.children );
	for ( let i = 0; i < intersects.length; i ++ ) {
		const objectIndex = intersects[ i ].object.index;
		console.log("click index : " + objectIndex);
		if (objectIndex != null) {
			document.querySelector("#selectedObjectName").innerHTML = playersList[objectIndex].name;
		}else{
			document.querySelector("#selectedObjectName").innerHTML = playerInfo.name;
		}
		

	}
}


function onClick( event ) {
	select()
	
}
window.addEventListener('mousedown', onClick, false);


function screenXY(obj){

	var vector = obj.clone();
	var windowWidth = window.innerWidth;

	var widthHalf = (windowWidth/2);
	var heightHalf = (window.innerHeight/2);

	vector.project(camera);

	vector.x = ( vector.x * widthHalf ) + widthHalf;
	vector.y = - ( vector.y * heightHalf ) + heightHalf;
	vector.z = 0;

	return vector;

};


function updatePlayers(){
	for (var i = 0; i < playersList.length; i++) {
		if (i != playerInfo.index) {
			if ( playersInstanceList[i]) {
				if (playersList[i].position && playersList[i].rotation) {
					playersInstanceList[i].position.set(playersList[i].position.x, playersList[i].position.y, playersList[i].position.z);
					playersInstanceList[i].rotation.copy(playersList[i].rotation);
					const tagPos = screenXY(playersInstanceList[i].position);
					// if (0 < tagPos.x && tagPos.x < window.innerWidth && 0 < tagPos.y && tagPos.y < window.innerHeight) {
					// 	playersTagList[i].style.display = 'block';
					// 	playersTagList[i].style.top = `${tagPos.y}px`;
					// 	playersTagList[i].style.left = `${tagPos.x}px`;
					// }else{
					// 	playersTagList[i].style.display = 'none';
					// }
					camera.updateMatrix();
					camera.updateMatrixWorld();
					var frustum = new THREE.Frustum();
					frustum.setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));  

					if (frustum.containsPoint(playersInstanceList[i].position)) {
					    playersTagList[i].style.display = 'block';
						playersTagList[i].style.top = `${tagPos.y}px`;
						playersTagList[i].style.left = `${tagPos.x}px`;
					}else{
						playersTagList[i].style.display = 'none';
					}
				}
				
			}else{
				const playerInstance = new THREE.Mesh(playerGeometry, playerMaterial);
				playerInstance.index = i;
				playersInstanceList[i] = playerInstance;
				scene.add(playersInstanceList[i]);

				const playerTag = document.createElement('p');
				playerTag.innerHTML = playersList[i].name;
				document.querySelector("#overscreen").appendChild(playerTag);
				playersTagList[i] = playerTag;
			}
		}
		
	}
}

let previousRAF = null;

function step(timeElapsed){
	const timeElapsedS = timeElapsed * 0.001;
	if (playerControler) {
		playerControler.Update(timeElapsedS);
		if (registered) {
			socket.emit('updatePosition', playerInfo.index, playerInfo.name, player.position, player.rotation);
		}

	}
}

function animate(){
	requestAnimationFrame((t) => {
		if (previousRAF === null) {
			previousRAF = t;
		}
		animate();

		renderer.render(scene, camera);
		step(t - previousRAF);
	})
}
animate();