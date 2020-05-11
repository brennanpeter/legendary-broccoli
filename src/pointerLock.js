// code copied from  https://codepen.io/tembling/pen/reZjEw?editors=1010
export function checkpointerlock(controls) {
    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
    if ( havePointerLock ) {
        console.log('Browser supports pointer lock');
	    var element = document.body;
	    var pointerlockchange = function ( event ) {
            console.log('pointer lock change called ');
		    if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
			    controls.enabled = true;
		    } else {
			    controls.enabled = false;
		    }
	    };
	    var pointerlockerror = function ( event ) {
            console.log('Pointer Lock Error');
	    };
	    // Hook pointer lock state change events
	    document.addEventListener( 'pointerlockchange', pointerlockchange, false );
	    document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
	    document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );
	    document.addEventListener( 'pointerlockerror', pointerlockerror, false );
	    document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
	    document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

		// Ask the browser to lock the pointer
		element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
		if ( /Firefox/i.test( navigator.userAgent ) ) {
			var fullscreenchange = function ( event ) {
				if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {
					document.removeEventListener( 'fullscreenchange', fullscreenchange );
					document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
					element.requestPointerLock();
				}
			};
			document.addEventListener( 'fullscreenchange', fullscreenchange, false );
			document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );
			element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
			element.requestFullscreen();
		} else {
			element.requestPointerLock();
		}
    } else {
	    console.log( 'Your browser doesn\'t seem to support Pointer Lock API');
    }

}
