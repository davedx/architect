let Fabricate = require("fabricant");
let THREE = require("three");

class Mesh extends THREE.Mesh {
	constructor() {
    	const geometry = new THREE.BoxGeometry( 200, 200, 200 );
    	const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    	super(geometry, material);
	}

	updateRotation(x, y) {
		this.rotation.x += x;
		this.rotation.y += y;
	}
}

class Mover {
	update(dt) {
    	this.host.components.get(Mesh).updateRotation(0.01, 0.02);
	}
}

class SceneNode extends THREE.Object3D {
	// start() {
	// 	console.log("Attaching renderables to scene node for ", this.host);
	// 	if(this.host) {
	// 		this.addChild(this.host);
	// 	}
	// }

	addChild(child) {
		child.components.forEach((component) => {
			if(component.constructor.name === "Mesh" ||
				component.constructor.name === "SceneNode") {
				this.add(component);
			}
		});
	}
}

const Cube = {
	name: "Cube",
	components: [Mesh, SceneNode, Mover]
};

const SmallCube = {
	name: "Small Cube",
	components: [Mesh, SceneNode]
};

class Scene {
	constructor() {
		this.scene = new THREE.Scene();
		this.rootNode = new SceneNode();
		this.scene.add(this.rootNode);

  	this.renderer = new THREE.WebGLRenderer();
  	this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
	}

	add(host) {
		//console.log("Adding ", host, " to scene root node");
		this.rootNode.addChild(host);
	}

	render(camera) {
    	this.renderer.render(this.scene, camera);
	}

	start() {
		//console.log("Starting scene.. ", this.scene.children);
		this.scene.children.forEach(node => {
			if(node.start) {
				node.start();
			}
			if(node.components) {
				node.components.forEach(component => {
					if(component.start) {
						component.start();
					}
				});
			}
		});		
	}
}

const cube1 = Fabricate(Cube);
cube1.components.get(SceneNode).position.x = -400;

//TODO: get scene graph working - we should be able to add Cube2 to Cube1, and
//have its position be relative to its parent.
const cube2 = Fabricate(SmallCube);
cube2.components.get(Mesh).position.x = 100;
cube1.components.get(SceneNode).addChild(cube2);

const scene = new Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
camera.position.z = 1000;
scene.add(cube1);
//scene.add(cube2);

scene.start();

console.log(scene);

animate();

function animate() {
    requestAnimationFrame(animate);
    cube1.components.get(Mover).update(0.1);
    scene.render(camera);
}