//@flow
import React		from 'react'
import THREE		from '../../three.js'

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
		//the camera & controller
		var frustumSize = 500;
		//use this to make the coordination is a square 
		var aspect = window.innerWidth / window.innerHeight;
		const camera = new THREE.OrthographicCamera( 
			frustumSize * aspect / - 2, 
			frustumSize * aspect / 2, 
			frustumSize / 2, 
			frustumSize / - 2, 
			1, 
			1000 
		);
		camera.position.set(-200, 200, 200)
		const controls		= new THREE.OrbitControls(camera)
		const scene		= new THREE.Scene()
		const renderer		= new THREE.CSS3DRenderer()
		renderer.setSize(window.innerWidth, window.innerHeight)
		renderer.domElement.style.position		= 'absolute'
		renderer.domElement.style.top		= 0
		//$FlowFixMe
		document.getElementById('containerDOM').appendChild(renderer.domElement)
		//mount
		const DOMObject		= new THREE.CSS3DObject(
			document.getElementById('a')
		)
		DOMObject.position.set(0, 0, 0)
		scene.add(DOMObject)
		/*
		 * the scene 2
		 */
		const sceneWebGL		= new THREE.Scene()
		sceneWebGL.background = new THREE.Color( 0xf0f0f0 );
		const rendererWebGL		= new THREE.WebGLRenderer()
		rendererWebGL.setPixelRatio( window.devicePixelRatio );
		rendererWebGL.setSize( window.innerWidth, window.innerHeight );
		document.getElementById('containerWebGL')
			//$FlowFixMe
			.appendChild( rendererWebGL.domElement );

		function animate(){
			requestAnimationFrame(animate)
			renderer.render(scene, camera)
			rendererWebGL.render(sceneWebGL, camera)
		}
		//helper
		const axesHelper		= new THREE.AxesHelper(500)
		sceneWebGL.add(axesHelper)
		const cameraHelper		= new THREE.CameraHelper(camera)
		sceneWebGL.add(cameraHelper)
		var gridHelper = new THREE.GridHelper( 100, 10 );
		sceneWebGL.add( gridHelper );
//		var radius = 100;
//		var radials = 160;
//		var circles = 8;
//		var divisions = 64;
//		var helper = new THREE.PolarGridHelper( radius, radials, circles, divisions );
//		sceneWebGL.add( helper );

		animate()
	}

	render(){
		return (
			<div id='container' >
				<style global jsx>{`
						body {
							margin		: 0;
						}
					  `}
				</style>
				<div
					id='a'
				>
					A thing
				</div>
				<div id='containerDOM' />
				<div id='containerWebGL' />
			</div>
		)
	}
}

export default Index
