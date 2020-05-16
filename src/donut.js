import * as THREE from '../node_modules/three/build/three.module.js';
import { GLTFLoader } from '../three.js/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from '../three.js/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from '../three.js/examples/jsm/controls/PointerLockControls.js';
import { checkpointerlock } from './pointerLock.js'
 
var camera, scene, renderer;
var geometry, material, mesh;
var loader = new GLTFLoader();

// control states 
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;

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

    // Load Light
    var ambientLight = new THREE.AmbientLight( 0xcccccc );
    scene.add( ambientLight );

    var directionalLight = new THREE.DirectionalLight( 0xffffff );
    directionalLight.position.set( 0, 1, 1 ).normalize();
    scene.add( directionalLight );				

    loader.load( '../resources/donut.gltf', function ( gltf ) {
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
    var instructions = document.getElementById( 'instructions' );

	instructions.addEventListener( 'click', function () {
        var instructions = document.getElementById( 'instructions' );
		scene.controls.lock();
        instructions.style.display = 'none';
	}, false );

    // Set up key toggle controls
    
    document.addEventListener('keyup', logKey);
    document.addEventListener('keydown', logKey);

    function logKey(e) {
        // Break if composing in a IME helper
        if (event.isComposing || event.keyCode === 229) {
            return;
        }

        // else only check for WASD and other useful chars
        if (event.keyCode === 65) {
           console.log("A"); 
        }
        else if (event.keyCode === 83) {
            console.log("S"); 
            scene.controls.moveForward("-0.1");
        }
        else if (event.keyCode === 68) {
           console.log("D"); 
        }
        else if (event.keyCode === 87) {
            console.log("W"); 
            scene.controls.moveForward("0.1");
        }
    }

    var velocity = new THREE.Vector3();


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
    var time = performance.now();
	var delta = ( time - prevTime ) / 1000;
	velocity.x -= velocity.x * 10.0 * delta;
	velocity.z -= velocity.z * 10.0 * delta;

    if ( moveForward ) velocity.z -= 400.0 * delta;
	if ( moveBackward ) velocity.z += 400.0 * delta;
	if ( moveLeft ) velocity.x -= 400.0 * delta;
	if ( moveRight ) velocity.x += 400.0 * delta;

    scene.controls.getObject().translateX( velocity.x * delta );
	scene.controls.getObject().translateY( velocity.y * delta );

	render();
	requestAnimationFrame( animate );
}

function render() {
	renderer.render( scene, camera );
}

render();
animate();
 
