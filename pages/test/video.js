//@flow
/*
 * To display a video in 3d scene
 */
import React		from 'react'
import THREE		from '../../three.js'


class Index extends React.Component<{},{}>{

	constructor(props : any){
		super(props)
		//$FlowFixMe
		this.init		= this.init.bind(this)
	}

	componentDidMount(){
		//this.init()
	}

	componentDidUpdate(){
		//this.init()
	}

	init(){
		var camera, scene, renderer;
		var controls;
		var Element = function ( id, x, y, z, ry ) {
			var div = document.createElement( 'div' );
			div.style.width = '480px';
			div.style.height = '360px';
			div.style.backgroundColor = '#000';
			var iframe = document.createElement( 'iframe' );
			iframe.style.width = '480px';
			iframe.style.height = '360px';
			iframe.style.border = '0px';
			//iframe.src = [ 'https://www.youtube.com/embed/', id, '?rel=0' ].join( '' );
			iframe.src		= 'http://player.youku.com/embed/XNDE5Njk5MTE5Ng=='
			iframe.frameborder=0
			div.appendChild( iframe );
			var object = new THREE.CSS3DObject( div );
			object.position.set( x, y, z );
			object.rotation.y = ry;
			return object;
		};
		init();
		animate();
		function init() {
			var container = document.getElementById( 'container' );
			camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 5000 );
			camera.position.set( 500, 350, 750 );
			scene = new THREE.Scene();
			renderer = new THREE.CSS3DRenderer();
			renderer.setSize( window.innerWidth, window.innerHeight );
			//$FlowFixMe
			container.appendChild( renderer.domElement );
			var group = new THREE.Group();
			group.add( new Element( 'SJOz3qjfQXU', 0, 0, 240, 0 ) );
			group.add( new Element( 'Y2-xZ-1HE-Q', 240, 0, 0, Math.PI / 2 ) );
			group.add( new Element( 'IrydklNpcFI', 0, 0, - 240, Math.PI ) );
			group.add( new Element( '9ubytEsCaS0', - 240, 0, 0, - Math.PI / 2 ) );
			scene.add( group );
			controls = new THREE.OrbitControls( camera );
			window.addEventListener( 'resize', onWindowResize, false );
			// Block iframe events when dragging camera
			var blocker = document.getElementById( 'blocker' );
			//$FlowFixMe
			blocker.style.display = 'none';
			document.addEventListener( 'mousedown', function () {
				//$FlowFixMe
				blocker.style.display = '';
			} );
			//$FlowFixMe
			document.addEventListener( 'mouseup', function () {
				//$FlowFixMe
				blocker.style.display = 'none';
			} );
		}
		function onWindowResize() {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize( window.innerWidth, window.innerHeight );
		}
		function animate() {
			requestAnimationFrame( animate );
			controls.update();
			renderer.render( scene, camera );
		}
	}

	componentWillUnmount(){
//		if(this.gui){
//			console.log('destroy...')
//			this.gui.destroy()
//		}
	}

	render(){
		return (
			<div>
				<style global jsx>{`
						body {
							margin		: 0;
						}
				`}</style>
				<div id='container' />
				<div id="blocker"></div>
				<iframe height='498' width='510' src='http://player.youku.com/embed/XNDE5Njk5MTE5Ng==' frameborder='0' ></iframe>
			</div>
		)
	}
}

export default Index
