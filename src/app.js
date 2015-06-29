let Fabricate = require("fabricant");
let THREE = require("three");

class Mesh {
	constructor() {
    	this.geometry = new THREE.BoxGeometry( 200, 200, 200 );
    	this.material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    	this.mesh = new THREE.Mesh(this.geometry, this.material);
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

const SmallCube = {
	name: "Small Cube",
	components: [Mesh]
};

class Scene {
	constructor() {
		this.scene = new THREE.Scene();

    	this.renderer = new THREE.WebGLRenderer();
    	this.renderer.setSize(window.innerWidth, window.innerHeight);
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

const cube1 = Fabricate(Cube);
cube1.components.get(Mesh).mesh.position.x = -200;
//TODO: get scene graph working - we should be able to add Cube2 to Cube1, and
//have its position be relative to its parent.
const cube2 = Fabricate(SmallCube);
cube2.components.get(Mesh).mesh.position.x = 200;

const scene = new Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
camera.position.z = 1000;
scene.add(cube1);
scene.add(cube2);

animate();


function animate() {
    requestAnimationFrame(animate);
    cube1.components.get(Mover).update(0.1);
    scene.render(camera);
}