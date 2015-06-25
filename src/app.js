let Fabricate = require("fabricant");
let THREE = require("three");

class Mesh {
	constructor() {
    	this.geometry = new THREE.BoxGeometry( 200, 200, 200 );
    	this.material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );

    	this.mesh = new THREE.Mesh( geometry, material );

    	this.sceneNode = this.mesh;
	}

	updateRotation(x, y) {
		this.mesh.rotation.x += x;
		this.mesh.rotation.y += y;
	}
}

class Mover {
	update(dt) {
    	this.host.components.get(Mesh).updateRotation(0.01, 0.02);
	}
}

const Cube = {
	name: "Cube",
	components: [Mesh, Mover]
};

class Scene {
	constructor() {
		this.scene = new THREE.Scene();

    	this.renderer = new THREE.WebGLRenderer();
    	this.renderer.setSize( window.innerWidth, window.innerHeight );

	    document.body.appendChild( this.renderer.domElement );
	}

	add(host) {
		// to be added to the scene the host object must have one and only one Object3D
		host.components.forEach((component) => {
			if(component.sceneNode) {
				this.scene.add(component.sceneNode);
			}
		});
	}

	render(camera) {
    	this.renderer.render(this.scene, camera);
	}
}

var camera;
var geometry, material, mesh;
console.info(window.innerWidth,window.innerHeight);
camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
camera.position.z = 1000;

const scene = new Scene();
const cube1 = Fabricate(Cube);

init();
animate();

function init() {


    //scene = new THREE.Scene();

    scene.add(cube1);

    // geometry = new THREE.BoxGeometry( 200, 200, 200 );
    // material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );

    // mesh = new THREE.Mesh( geometry, material );

    // scene.add( mesh );

    // renderer = new THREE.WebGLRenderer();
    // renderer.setSize( window.innerWidth, window.innerHeight );

    // document.body.appendChild( renderer.domElement );
}

function animate() {
    requestAnimationFrame(animate);

    // cube1.components.get(Mover).update(0.1);
    // mesh.rotation.x += 0.01;
    // mesh.rotation.y += 0.02;
    scene.render(camera);
//    renderer.render( scene, camera );
}