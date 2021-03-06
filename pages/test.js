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
		var scene2, renderer2;
		init();
		animate();
		function init() {
			var frustumSize = 500;
			var aspect = window.innerWidth / window.innerHeight;
			camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000 );
			camera.position.set( - 200, 200, 200 );
			var controls = new THREE.OrbitControls( camera );
			scene = new THREE.Scene();
			scene.background = new THREE.Color( 0xf0f0f0 );
			scene2 = new THREE.Scene();
			var material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, wireframeLinewidth: 1, side: THREE.DoubleSide } );
			// left
			createPlane(
				100, 100,
				'chocolate',
				new THREE.Vector3( - 50, 0, 0 ),
				new THREE.Euler( 0, - 90 * THREE.Math.DEG2RAD, 0 )
			);
			// right
			createPlane(
				100, 100,
				'saddlebrown',
				new THREE.Vector3( 0, 0, 50 ),
				new THREE.Euler( 0, 0, 0 )
			);
			// top
			createPlane(
				100, 100,
				'yellowgreen',
				new THREE.Vector3( 0, 50, 0 ),
				new THREE.Euler( - 90 * THREE.Math.DEG2RAD, 0, 0 )
			);
			// bottom
			createPlane(
				300, 300,
				'seagreen',
				new THREE.Vector3( 0, - 50, 0 ),
				new THREE.Euler( - 90 * THREE.Math.DEG2RAD, 0, 0 )
			);
			//
			renderer = new THREE.WebGLRenderer();
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( window.innerWidth, window.innerHeight );
			//$FlowFixMe
			document.body.appendChild( renderer.domElement );
			renderer2 = new THREE.CSS3DRenderer();
			renderer2.setSize( window.innerWidth, window.innerHeight );
			renderer2.domElement.style.position = 'absolute';
			renderer2.domElement.style.top = 0;
			//$FlowFixMe
			document.body.appendChild( renderer2.domElement );
			function createPlane( width, height, cssColor, pos, rot ) {
				var element = document.createElement( 'div' );
				element.style.width = width + 'px';
				element.style.height = height + 'px';
				element.style.opacity = '0.75';
				element.style.background = cssColor;
				var object = new THREE.CSS3DObject( element );
				object.position.copy( pos );
				object.rotation.copy( rot );
				scene2.add( object );
				var geometry = new THREE.PlaneBufferGeometry( width, height );
				var mesh = new THREE.Mesh( geometry, material );
				mesh.position.copy( object.position );
				mesh.rotation.copy( object.rotation );
				scene.add( mesh );
			}
			//the slogon
			const slogonElement		= document.getElementById('slogon')
			var object = new THREE.CSS3DObject(slogonElement);
			object.position.copy( new THREE.Vector3(0, 0, 0) );
			scene2.add( object );

			//me
			const meElement		= document.getElementById('me')
			var object = new THREE.CSS3DObject(meElement);
			object.position.copy( new THREE.Vector3(0, 0, 0) );
			scene2.add( object );

		}
		function animate() {
			requestAnimationFrame( animate );
			renderer.render( scene, camera );
			renderer2.render( scene2, camera );
		}
	}

	render(){
		return (
			<div id='container' >
				<style global jsx>{`
					body {
						background-color: #ffffff;
						margin: 0;
						overflow: hidden;
					}
					#info {
						position: absolute;
						top: 0px;
						width: 100%;
						color: #000000;
						padding: 5px;
						font-family: Monospace;
						font-size: 13px;
						text-align: center;
						z-index: 1;
					}
					a {
						color: #000000;
					}
					  `}</style>
				<img 
					style={{
						position		: 'absolute',
						height		: 250,
					}}
					id='me' 
					src='/static/me.png' />
				<div
					id='slogon'
					style={{
						position		: 'absolute',
					}}
				>
					HI, I'M CHEN, I JUST DO RIGHT THINGS
				</div>
			</div>
		)
	}
}

export default Index
