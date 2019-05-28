//@flow
import React		from 'react'
import THREE		from '../three.js'
import '../style.css'
import Twitter		from '../component/Twitter.js'
import Facebook		from '../component/Facebook.js'
import Mouse		from '../component/Mouse.js'
import * as d3		from 'd3'
import Sector		from '../model/Sector.js'
import '../i18n.js'
import { Translation } from 'react-i18next'

const isAnimated		= true

const sectors		= [
	{
		id		: 'sectorA',
		range		: [-30, 30],
		opacity		: 0,
	},{
		id		: 'sectorB',
		range		: [45, 75],
		opacity		: 0,
	}
]

const sector		= new Sector(sectors)

class Index extends React.Component<{},{}>{
	constructor(props : any){
		super(props)
		//bind
		////$FlowFixMe
		this.refresh		= this.refresh.bind(this)
	}

	componentDidMount(){
		this.refresh()
	}

	componentDidUpdate(){
		this.refresh()
	}

	refresh(){
		var thisRef		= this
		var isShown
		var boxMesh
		var camera, scene, renderer, sceneDOM, rendererDOM;
		var isUserInteracting = false,
			onMouseDownMouseX = 0, onMouseDownMouseY = 0,
			//the degree from front to right, from 0 to 360
			lon = 0, 
			onMouseDownLon = 0,
			lat = 0, 
			onMouseDownLat = 0,
			phi = 0, 
			theta = 0;
		init();
		if(isAnimated){
			animate();
		}else{
			setTimeout(() => {
				requestAnimationFrame(update)
			}, 500)
		}
		function init() {
			var container, mesh;
			container = document.getElementById( 'container' );
			camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
			camera.target = new THREE.Vector3( 0, 0, 0 );
			scene = new THREE.Scene();
			var geometry = new THREE.SphereBufferGeometry( 500, 60, 40 );
			// invert the geometry on the x-axis so that all of the faces point inward
			geometry.scale( - 1, 1, 1 );
			var texture = new THREE.TextureLoader().load( '/static/panglao2.jpg' );
			var material = new THREE.MeshBasicMaterial( { map: texture } );
			mesh = new THREE.Mesh( geometry, material );
			scene.add( mesh );

			//a box
			const boxGeometry		= new THREE.BoxGeometry(20, 80, 20)
			const boxMaterial		= new THREE.MeshBasicMaterial({color:'0x0000ff'})
			boxMesh		= new THREE.Mesh(boxGeometry, boxMaterial)
			boxMesh.position.x		= 100
			boxMesh.position.z		= -50
			boxMesh.position.y		= -20
			//boxMesh.rotation.y		= (Math.PI / 180) * 25
			//scene.add(boxMesh)

//			//helper
//			const axesHelper		= new THREE.AxesHelper(500)
//			scene.add(axesHelper)
//			const cameraHelper		= new THREE.CameraHelper(camera)
//			scene.add(cameraHelper)
//			const polarGridHelper		= new THREE.PolarGridHelper()
//			scene.add(polarGridHelper)
//			const boxHelper		= new THREE.VertexNormalsHelper( boxMesh, 2, 0x00ff00, 1 );
//			//scene.add(boxHelper)

			renderer = new THREE.WebGLRenderer();
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( window.innerWidth, window.innerHeight );
			//$FlowFixMe
			container.appendChild( renderer.domElement );

//			//for DOM
//			const containerDOM		= document.getElementById('containerDOM')
//			//clear
//			////$FlowFixMe
//			containerDOM.innerHTML		= ''
//			sceneDOM		= new THREE.Scene()
//			rendererDOM		= new THREE.CSS3DRenderer()
//			rendererDOM.setSize( window.innerWidth, window.innerHeight )
//			rendererDOM.domElement.style.position = 'absolute'
//			rendererDOM.domElement.style.top = 0
//			//$FlowFixMe
//			containerDOM.appendChild( rendererDOM.domElement );
//			//me
//			const meElement		= document.getElementById('me')
//			var object = new THREE.CSS3DObject(meElement);
//			object.position.copy( new THREE.Vector3(450, -50, -100) );
//			object.rotation.copy( new THREE.Euler(
//				0,
//				-90 * THREE.Math.DEG2RAD, 
//				0,
//			))
//			sceneDOM.add( object );
//			//slogon
//			const slogonElement		= document.getElementById('slogon')
//			const slogonObject		= new THREE.CSS3DObject(slogonElement)
//			slogonObject.position.copy( new THREE.Vector3(450, -50, 100) );
//			slogonObject.rotation.copy( new THREE.Euler(
//				0,
//				-90 * THREE.Math.DEG2RAD, 
//				0,
//			))
//			sceneDOM.add( slogonObject );

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
			//slow down
			//setTimeout(() => {
				requestAnimationFrame( animate );
			//}, 1000)
			update();
		}
		function update() {
			//console.log('update')
			if ( isUserInteracting === false ) {
				//lon += 0.1;
			}
			lat = Math.max( - 85, Math.min( 85, lat ) );
//			console.warn('lat:', lat)
//			console.warn('lon:', lon)
			phi = THREE.Math.degToRad( 90 - lat );
			theta = THREE.Math.degToRad( lon );
			camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
			camera.target.y = 500 * Math.cos( phi );
			camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );
			camera.lookAt( camera.target );
			if(!isShown){
				console.log('the camera:', camera.toJSON())
				console.log('the camera position:', camera.position)
				console.log('the camera rotation:', camera.rotation)
				isShown		= true
				console.log('the box:', boxMesh)
			}
			/*
				// distortion
				camera.position.copy( camera.target ).negate();
				*/
			renderer.render( scene, camera );
			//rendererDOM.render( sceneDOM, camera );
			/*
			 * control the sectors
			 */
			sector.move(lon)
			sectors.forEach(sector => {
				d3.select(`#${sector.id}`)
					.style('opacity', sector.opacity)
			})
		}
	}

	render(){
		return (
				<Translation>
					{
						t =>
							<div>
								<div className='nav' >
									<div className='logo' >
										<span>Dadior</span>
										<span
											style={{
												color		: 'rgb(253, 51, 51)',
											}}
										>chen</span>
									</div>
									<div className='nav-right' >
										<div className='nav-item' >
											<a target="_blank" href="https://twitter.com/dadiorchen">
												<Twitter/>
											</a>
										</div>
										<div className='nav-item' >
											<a target='_blank' href='https://facebook.com/dadirochen'>
												<Facebook/>
											</a>
										</div>
									</div>
								</div>
								<div className='sector' id='sectorA' >
									<p className='h1' >{t('slogon').split(' ').map(c => <span>{c}</span>)}</p>
									<div className='tip' >
											<div>
												<span>scroll or drag your mouse to look around</span><span><Mouse/></span>
											</div>
									</div>
								</div>
								<div className='sector' id='sectorB' >
									<p 
										style={{
											width		: 400,
										}}
										className='h1 top-right' >
										{t('intro').split(' ').map(c => <span>{c}</span>)}
									</p>
								</div>
								<div id='container' >
									<div id='containerDOM' />
								</div>
							</div>
					}
				</Translation>
		)
	}
}

export default Index
