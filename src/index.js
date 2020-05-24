import * as THREE from '../node_modules/three/build/three.module.js';
import { GLTFLoader } from '../three.js/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from '../three.js/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from '../three.js/examples/jsm/controls/PointerLockControls.js';
 
var camera, scene, renderer;
var geometry, material, mesh;
var loader = new GLTFLoader();

// control states 
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var prevTime = performance.now();
var velocity = new THREE.Vector3();

var helper;

init();

function load_alert() {
    console.log("Page Loaded");
}
 
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
    //var ambientLight = new THREE.AmbientLight( 0xcccccc );
    //scene.add( ambientLight );

    // Add a directional light to point at the paintings
    var spotLight = new THREE.SpotLight( 0xffffff, 0.5);
    spotLight.position.set( 5, 5, 5 );
    // point the light 
    spotLight.target.position.set(0.5, 4, -8);
    spotLight.angle = Math.PI / 10;
    spotLight.decay = 2;
    scene.add( spotLight.target );
    scene.add( spotLight );				

    helper = new THREE.SpotLightHelper( spotLight, 1 );
    scene.add( helper );

    
    var intensity = 1;

    var pointLight = new THREE.PointLight( 0xcccccc, intensity, 20 );
	pointLight.castShadow = true;
	pointLight.shadow.camera.near = 1;
	pointLight.shadow.camera.far = 60;
	pointLight.shadow.bias = - 0.005;

    pointLight.position.set( 0, 5, 0 );
    scene.add( pointLight );				

    document.addEventListener("load", load_alert);

    loader.load( '../resources/testworld.gltf', function ( gltf ) {
        var object = gltf.scene;
	    gltf.scene.scale.set( 1, 1, 1 );
	    gltf.scene.position.x = 0;				    //Position (x = right+ left-)
        gltf.scene.position.y = 0;				    //Position (y = up+, down-)
	    gltf.scene.position.z = 0;				    //Position (z = front +, back-)

	    scene.add( gltf.scene );
        console.log("Loaded Model");

    }, undefined, function ( error ) {

	    console.error( error );

    } );

    // Set up auto resizing 
    window.addEventListener( 'resize', onWindowResize, false );
    function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}

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
            if( event.type === "keydown" && moveLeft === false ){
                // start moving left
                moveLeft = true
                moveRight = false
            }
            else if ( event.type === "keyup" && moveLeft === true ){
                // stop moving left
                moveLeft = false
            }
        }
        else if (event.keyCode === 83) {
            if( event.type === "keydown" && moveBackward === false ){
                // start moving backwards
                moveBackward = true
                moveForward = false
            }
            else if ( event.type === "keyup" && moveBackward === true ){
                // stop moving backwards
                moveBackward = false
            }
        }
        else if (event.keyCode === 68) {
            if( event.type === "keydown" && moveRight === false ){
                // start moving right
                moveRight = true
                moveLeft = false
            }
            else if ( event.type === "keyup" && moveRight === true ){
                // stop moving right
                moveRight = false
            }
        }
        else if (event.keyCode === 87) {
            if( event.type === "keydown" && moveForward === false ){
                // start moving forwards
                moveForward = true
                moveBackward = false
            }
            else if ( event.type === "keyup" && moveForward === true ){
                // stop moving forwards
                moveForward = false
            }
        }
    }

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
	requestAnimationFrame( animate );

    // Velocity code yoinked from https://codepen.io/tembling/pen/reZjEw?editors=1000
    var time = performance.now();
	var delta = ( time - prevTime ) / 1000;
	velocity.x = 0;
	velocity.z = 0;
	velocity.y = 0;

    if (moveBackward || moveForward) {
        if ( moveForward ) {
            velocity.z -= 100.0 * delta;
        }

	    else if ( moveBackward ) {
            velocity.z += 100.0 * delta;
        }

	    scene.controls.getObject().translateZ( velocity.z * delta );
    }

    if (moveRight || moveLeft) {
	    if ( moveLeft ) {
            velocity.x -= 100.0 * delta;
        }

	    else if ( moveRight ) {
            velocity.x += 100.0 * delta;
        }
        scene.controls.getObject().translateX( velocity.x * delta );
    }

	//scene.controls.getObject().translateY( velocity.y * delta );
    //scene.controls.getObject().position.y = 2

    prevTime = time

    helper.update()
	render();
}

function render() {
	renderer.render( scene, camera );
}

render();
animate();
 