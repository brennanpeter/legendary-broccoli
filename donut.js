import * as THREE from './node_modules/three/build/three.module.js';
import { GLTFLoader } from './three.js/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from './three.js/examples/jsm/controls/OrbitControls.js';
 
var camera, scene, renderer;
var geometry, material, mesh;
var loader = new GLTFLoader();

init();
 
function init() {
 
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20000 );
    camera.position.set( 1, 1, 20 );

    // load a renderer
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
 
    scene = new THREE.Scene();

    // Load the Orbitcontroller
    var controls = new OrbitControls( camera, renderer.domElement ); 

    // Load Light
    var ambientLight = new THREE.AmbientLight( 0xcccccc );
    scene.add( ambientLight );

    var directionalLight = new THREE.DirectionalLight( 0xffffff );
    directionalLight.position.set( 0, 1, 1 ).normalize();
    scene.add( directionalLight );				

    loader.load( './donut.gltf', function ( gltf ) {
        var object = gltf.scene;
	    gltf.scene.scale.set( 2, 2, 2 );
	    gltf.scene.position.x = 0;				    //Position (x = right+ left-)
        gltf.scene.position.y = 0;				    //Position (y = up+, down-)
	    gltf.scene.position.z = 0;				    //Position (z = front +, back-)

	    scene.add( gltf.scene );

    }, undefined, function ( error ) {

	    console.error( error );

    } );
 
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
 
