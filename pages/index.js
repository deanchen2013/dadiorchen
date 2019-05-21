//@flow
import React		from 'react'
import THREE		from '../three.js'

class Index extends React.Component<{},{}>{
	constructor(props : any){
		super(props)
	}

	componentDidMount(){
		this.refresh()
	}

	componentDidUpdate(){
		this.refresh()
	}

	refresh(){
		var camera, scene, renderer;
		var isUserInteracting = false,
			onMouseDownMouseX = 0, onMouseDownMouseY = 0,
			lon = 0, onMouseDownLon = 0,
			lat = 0, onMouseDownLat = 0,
			phi = 0, theta = 0;
		init();
		animate();
		function init() {
			var container, mesh;
			container = document.getElementById( 'container' );
			camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
			camera.target = new THREE.Vector3( 0, 0, 0 );
			scene = new THREE.Scene();
			var geometry = new THREE.SphereBufferGeometry( 500, 60, 40 );
			// invert the geometry on the x-axis so that all of the faces point inward
			geometry.scale( - 1, 1, 1 );
			var texture = new THREE.TextureLoader().load( '/static/bg3.jpg' );
			var material = new THREE.MeshBasicMaterial( { map: texture } );
			mesh = new THREE.Mesh( geometry, material );
			scene.add( mesh );
			renderer = new THREE.WebGLRenderer();
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( window.innerWidth, window.innerHeight );
			//$FlowFixMe
			container.appendChild( renderer.domElement );
			//$FlowFixMe
			document.addEventListener( 'mousedown', onPointerStart, false );
			//$FlowFixMe
			document.addEventListener( 'mousemove', onPointerMove, false );
			//$FlowFixMe
			document.addEventListener( 'mouseup', onPointerUp, false );
			//$FlowFixMe
			document.addEventListener( 'wheel', onDocumentMouseWheel, false );
			//$FlowFixMe
			document.addEventListener( 'touchstart', onPointerStart, false );
			//$FlowFixMe
			document.addEventListener( 'touchmove', onPointerMove, false );
			//$FlowFixMe
			document.addEventListener( 'touchend', onPointerUp, false );
			//
			////$FlowFixMe
			document.addEventListener( 'dragover', function ( event ) {
				event.preventDefault();
				event.dataTransfer.dropEffect = 'copy';
			}, false );
			//$FlowFixMe
			document.addEventListener( 'dragenter', function () {
				//$FlowFixMe
				document.body.style.opacity = 0.5;
			}, false );

			document.addEventListener( 'dragleave', function () {
				//$FlowFixMe
				document.body.style.opacity = 1;
			}, false );
			//$FlowFixMe
			document.addEventListener( 'drop', function ( event ) {
				event.preventDefault();
				var reader = new FileReader();
				//$FlowFixMe
				reader.addEventListener( 'load', function ( event ) {
					material.map.image.src = event.target.result;
					material.map.needsUpdate = true;
				}, false );
				reader.readAsDataURL( event.dataTransfer.files[ 0 ] );
				//$FlowFixMe
				document.body.style.opacity = 1;
			}, false );
			//
			window.addEventListener( 'resize', onWindowResize, false );
		}
		function onWindowResize() {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize( window.innerWidth, window.innerHeight );
		}
		function onPointerStart( event ) {
			isUserInteracting = true;
			var clientX = event.clientX || event.touches[ 0 ].clientX;
			var clientY = event.clientY || event.touches[ 0 ].clientY;
			onMouseDownMouseX = clientX;
			onMouseDownMouseY = clientY;
			onMouseDownLon = lon;
			onMouseDownLat = lat;
		}
		function onPointerMove( event ) {
			if ( isUserInteracting === true ) {
				var clientX = event.clientX || event.touches[ 0 ].clientX;
				var clientY = event.clientY || event.touches[ 0 ].clientY;
				lon = ( onMouseDownMouseX - clientX ) * 0.1 + onMouseDownLon;
				lat = ( clientY - onMouseDownMouseY ) * 0.1 + onMouseDownLat;
			}
		}
		function onPointerUp() {
			isUserInteracting = false;
		}
		function onDocumentMouseWheel( event ) {
			var fov = camera.fov + event.deltaY * 0.05;
			camera.fov = THREE.Math.clamp( fov, 10, 75 );
			camera.updateProjectionMatrix();
		}
		function animate() {
			requestAnimationFrame( animate );
			update();
		}
		function update() {
			if ( isUserInteracting === false ) {
				//lon += 0.1;
			}
			lat = Math.max( - 85, Math.min( 85, lat ) );
			phi = THREE.Math.degToRad( 90 - lat );
			theta = THREE.Math.degToRad( lon );
			camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
			camera.target.y = 500 * Math.cos( phi );
			camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );
			camera.lookAt( camera.target );
			/*
				// distortion
				camera.position.copy( camera.target ).negate();
				*/
			renderer.render( scene, camera );
		}
	}

	render(){
		return (
			<div id='container' >
				<style global jsx>{`
						body {
							margin		: 0;
						}
					  `}</style>
			</div>
		)
	}
}

export default Index
