// code copied from  https://codepen.io/tembling/pen/reZjEw?editors=1010
export function checkpointerlock(controls) {
    // Check if the browser supports pointer lock
    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

    if ( havePointerLock ) {
        console.log('Browser supports pointer lock');
        // If the browser supports pointer lock, we do the following things:
	    var requestedElement = document.body;

	    var moveCallback = function ( event ) {
            var movementX = e.movementX ||
                e.mozMovementX          ||
                e.webkitMovementX       ||
                0,
                movementY = e.movementY ||
                e.mozMovementY      ||
                e.webkitMovementY   ||
                0;
        }

	    var pointerlockchange = function ( event ) {
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

        requestedElement.requestPointerLock();

    } else {
	    console.log( 'Your browser doesn\'t seem to support Pointer Lock API');
    }

}
