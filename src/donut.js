import * as THREE from '../node_modules/three/build/three.module.js';
import { GLTFLoader } from '../three.js/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from '../three.js/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from '../three.js/examples/jsm/controls/PointerLockControls.js';
 
var camera, scene, renderer;
var geometry, material, mesh;
var loader = new GLTFLoader();

init();
 
function init() {
 
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20000 );
    camera.position.set( 1, 1, 1 );
    // camera.lookAt(new THREE.Vector3(0,0,0));

    // load a renderer
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
 
    scene = new THREE.Scene();

    // Load the Orbitcontroller
    scene.renderer = renderer
    scene.controls = new PointerLockControls( camera, scene.renderer.domElement );
    scene.controls.connect()
    scene.controls.isLocked = true

    // Load Light
    var ambientLight = new THREE.AmbientLight( 0xcccccc );
    scene.add( ambientLight );

    var directionalLight = new THREE.DirectionalLight( 0xffffff );
    directionalLight.position.set( 0, 1, 1 ).normalize();
    scene.add( directionalLight );				

    loader.load( './donut.gltf', function ( gltf ) {
        var object = gltf.scene;
	    gltf.scene.scale.set( 1, 1, 1 );
	    gltf.scene.position.x = 0;				    //Position (x = right+ left-)
        gltf.scene.position.y = 0;				    //Position (y = up+, down-)
	    gltf.scene.position.z = 0;				    //Position (z = front +, back-)

	    scene.add( gltf.scene );

    }, undefined, function ( error ) {

	    console.error( error );

    } );

    // Set up pointer lock for the controls
    // https://codepen.io/tembling/pen/reZjEw?editors=1010
    // https://www.html5rocks.com/en/tutorials/pointerlock/intro/

    // check if the browser even has pointer lock

    checkpointerlock();

    var havePointerLock = 'pointerLockElement' in document ||
    'mozPointerLockElement' in document ||
    'webkitPointerLockElement' in document;

    scene.renderer.domElement.requestPointerLock = element.requestPointerLock ||
			     element.mozRequestPointerLock ||
			     element.webkitRequestPointerLock;
    // Ask the browser to lock the pointer
    scene.renderer.domElement.requestPointerLock();

    // Hook pointer lock state change events
    document.addEventListener('pointerlockchange', changeCallback, false);
    document.addEventListener('mozpointerlockchange', changeCallback, false);
    document.addEventListener('webkitpointerlockchange', changeCallback, false);

    // Hook mouse move events
    document.addEventListener("mousemove", this.moveCallback, false);
 
}

function pointerLockElement( ) {
    if (document.pointerLockElement === requestedElement ||
      document.mozPointerLockElement === requestedElement ||
      document.webkitPointerLockElement === requestedElement) {
      // Pointer was just locked
      // Enable the mousemove listener
      document.addEventListener("mousemove", this.moveCallback, false);
    } else {
      // Pointer was just unlocked
      // Disable the mousemove listener
      document.removeEventListener("mousemove", this.moveCallback, false);
      this.unlockHook(this.element);
    }
}

function animate() {
	render();
	requestAnimationFrame( animate );
}

function render() {
	renderer.render( scene, camera );
}

render();
animate();
 
