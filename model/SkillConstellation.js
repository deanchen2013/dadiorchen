//@flow
/*
 * The class for skill constellation
 */
import ReactDOM		from 'react-dom'
import {build, layout}		from './layout.js'
import THREE		from '../three.js'

const settingDefault		= {
	isAnimated		: false,
	data		: [
	],
	textType		: 'CSS',
	backgroundColor		: 0xf0f0f0,
	lineColor		: 0x000000,
	lineDistance		: 80,
	cameraType		: 'orbit'
}

export default class SkillConstellation{
	//setting
	setting		: any

	//the nodes of every skill 
	nodes		: any

	//the links between two skill nodes
	links		: any

	//the d3 force for layout the nodes/links
	force		: any

	sceneCSS		: any

	sceneWebGL		: any

	rendererCSS		: any
	
	rendererWebGL		: any

	camera		: any

	isUserInteracting		: boolean

	onMouseDownMouseX		= 0

	onMouseDownMouseY		= 0

	lon		= 0

	onMouseDownLon		= 0

	lat		= 0

	onMouseDownLat		= 0

	phi		= 0

	theta		= 0

	constructor(
		setting		: any,
	){
		//bind
		////$FlowFixMe
		this.animate		= this.animate.bind(this)
		//$FlowFixMe
		this.update		= this.update.bind(this)
		//$FlowFixMe
		this.render		= this.render.bind(this)
		//$FlowFixMe
		this.onWindowResize		= this.onWindowResize.bind(this)
		//$FlowFixMe
		this.onPointerStart		= this.onPointerStart.bind(this)
		//$FlowFixMe
		this.onPointerMove		= this.onPointerMove.bind(this)
		//$FlowFixMe
		this.onPointerUp		= this.onPointerUp.bind(this)
		//$FlowFixMe
		this.onDocumentMouseWheel		= this.onDocumentMouseWheel.bind(this)
		//$FlowFixMe
		this.onPointerMove		= this.onPointerMove.bind(this)
		//combine user setting with the default setting
		setting		= Object.assign(
			settingDefault,
			setting
		)
		this.setting		= setting
		this.isUserInteracting		= false
	}

	/*
	 * Just one round of render
	 */
	render(){
			//need to call update to try to move the nodes
			this.update()
			this.rendererCSS.render(this.sceneCSS, this.camera)
			this.rendererWebGL.render(this.sceneWebGL, this.camera)
	}

	/*
	 * create DOM element & three geometry and mount them
	 * this is an async fn
	 */
	async init(){
		//to build data
		const {nodes, links}		= build(this.setting.data)
		this.nodes		= nodes
		this.links		= links
		let orbitNodes		= 0
		this.nodes.forEach(node => {
			if(node.level === 0){
				orbitNodes++
				if(orbitNodes === 1){
					//$FlowFixMe
					node.fz		= 0
				}else if(orbitNodes > 1 && orbitNodes <= 8){
					//$FlowFixMe
					node.fz		= - this.setting.lineDistance
				}else if(orbitNodes > 8 && orbitNodes <= 27){
					//$FlowFixMe
					node.fz		= - this.setting.lineDistance * 2
				}else if(orbitNodes > 27 && orbitNodes <= 64){
					//$FlowFixMe
					node.fz		= - this.setting.lineDistance * 3
				}else if(orbitNodes > 64 ){
					//$FlowFixMe
					node.fz		= - this.setting.lineDistance * 4
				}
			}
		})
		//fix the 0 node
		////$FlowFixMe
//		nodes[0].fx		= 0
//		//$FlowFixMe
//		nodes[0].fy		= 0
		//$FlowFixMe
		this.force		= layout(
			nodes, 
			links, 
			this.setting.isAnimated,
			this.setting.lineDistance,
		)
		/*
		 * camera
		 */
		this.initCamera()
		this.sceneCSS		= new THREE.Scene()
		this.rendererCSS		= new THREE.CSS3DRenderer()
		this.rendererCSS.setSize(window.innerWidth, window.innerHeight)
		this.rendererCSS.domElement.style.position		= 'absolute'
		this.setting.container.appendChild(this.rendererCSS.domElement)
		/*
		 * the scene 2
		 */
		this.sceneWebGL		= new THREE.Scene()
		this.sceneWebGL.background = new THREE.Color( 0xf0f0f0 );
		this.rendererWebGL		= new THREE.WebGLRenderer()
		this.rendererWebGL.setPixelRatio( window.devicePixelRatio );
		this.rendererWebGL.setSize( window.innerWidth, window.innerHeight );
		this.setting.container.appendChild( this.rendererWebGL.domElement );
		if(this.setting.backgroundPicture){
			console.log('to load background picture')
			var texture = new THREE.TextureLoader().load( this.setting.backgroundPicture );
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.RepeatWrapping;
			texture.repeat.set( 1, 1 );
			this.sceneWebGL.background		= texture
		}else{
			this.sceneWebGL.background		= new THREE.Color(this.setting.backgroundColor)
		}
		/*
		 * Group All, to put all the stuff in it, because, maybe I will translate
		 * all the node to some place
		 */
		const groupAllCSS		= new THREE.Group()
		const groupAllWebGL		= new THREE.Group()
		this.sceneCSS.add(groupAllCSS)
		this.sceneWebGL.add(groupAllWebGL)
		/*
		 * for perspective camera, should move it away from camera
		 */
		if(this.setting.cameraType === 'perspective'){
			const awayVector3		= new THREE.Vector3(300, 0, 0,)
			const awayEuler		= new THREE.Euler(
				0,
				-90 * THREE.Math.DEG2RAD, 
				0,
			)
			groupAllCSS.position.copy(awayVector3)
			groupAllWebGL.position.copy(awayVector3)
			groupAllCSS.rotation.copy(awayEuler)
			groupAllWebGL.rotation.copy(awayEuler)
		}

		//helper
		const axesHelper		= new THREE.AxesHelper(500)
		this.sceneWebGL.add(axesHelper)
		const cameraHelper		= new THREE.CameraHelper(this.camera)
		this.sceneWebGL.add(cameraHelper)
		var gridHelper = new THREE.GridHelper( 100, 10 );
		this.sceneWebGL.add( gridHelper );
		var radius = 100;
		var radials = 160;
		var circles = 8;
		var divisions = 64;
		var helper = new THREE.PolarGridHelper( radius, radials, circles, divisions );
		this.sceneWebGL.add( helper );

		//console.log('nodes:', nodes)
		for(let node of this.nodes){
			//this is the first time
			if(this.setting.textType === 'CSS'){
	//						const elementDOM		= document.createElement('div')
	//						elementDOM.className		= 'dot'
	//						const object3D		= new THREE.CSS3DObject(elementDOM)
	//						object3D.position.set(
	//							node.x,
	//							node.y,
	//							node.z
	//						)
				//the text label
				const elementDOM		= document.createElement('div')
				const textElement		= this.setting.textCSS(node)
				await new Promise(resolve => {
					ReactDOM.render(
						textElement,
						elementDOM,
						resolve(true)
					)
				})
				console.log('textElement:', textElement)
				console.log('elementDOM:', elementDOM)
				const textObject3D		= new THREE.CSS3DObject(elementDOM)
				textObject3D.position.set(
					node.x,
					node.y,
					node.z
				)
	//						scene.add(object3D)
				groupAllCSS.add(textObject3D)
				//add ref to node
				node.object		= textObject3D
			}else{
				//load font
				var loader = new THREE.FontLoader();
				console.log('begin load...')
				const font		= await new Promise(resolve => {
					loader.load( '/static/fonts/helvetiker_regular.typeface.json', function ( font ) {
						console.log('load finish!')
						resolve( font );
					} );
				})
				//set the position of textMesh to center of itself
				const textMesh		= this.setting.textMesh(node, font)
				const box3		= new THREE.Box3().setFromObject(textMesh)	
				const target		= new THREE.Vector3()
				box3.getSize(target)
				//console.log('text size:', target)
				textMesh.position.set(
					-target.x / 2,
					-target.y / 2,
					0
				)
				const group		= new THREE.Group()
				group.add(textMesh)
				group.position.set(
					node.x,
					node.y,
					node.z
				)
				groupAllWebGL.add(group)
				//add ref to node
				node.object		= group
				//console.log('textMesh:', textMesh)
	//				//help
	//				var box = new THREE.BoxHelper( textMesh, 0x000000 );
	//				sceneWebGL.add( box );
			}
		}

		for(let link of this.links){
				//line/link
				const lineMaterial		= new THREE.LineBasicMaterial(
					{
						color		: this.setting.lineColor,
						linewidth		: 5,
					}
				)
				const lineGeometry		= new THREE.Geometry()
				lineGeometry.vertices.push(new THREE.Vector3(
					link.source.x,
					link.source.y,
					link.source.z
				))
				lineGeometry.vertices.push(new THREE.Vector3(
					link.target.x,
					link.target.y,
					link.target.z
				))
				const line		= new THREE.Line(lineGeometry, lineMaterial)
				groupAllWebGL.add(line)
				link.object		= line
		}
	}

	initCamera(){
		if(this.setting.cameraType === 'orbit'){
			//the camera & controller
			var frustumSize = 800;
			//use this to make the coordination is a square 
			var aspect = window.innerWidth / window.innerHeight;
			this.camera = new THREE.OrthographicCamera( 
				frustumSize * aspect / - 2, 
				frustumSize * aspect / 2, 
				frustumSize / 2, 
				frustumSize / - 2, 
				1, 
				1000 
			);
			this.camera.position.set(0, 0, 200)
			const controls		= new THREE.OrbitControls(this.camera)
		}else{
			this.camera = new THREE.PerspectiveCamera( 
				75, 
				window.innerWidth / window.innerHeight, 
				1, 
				1100 
			);
			this.camera.target = new THREE.Vector3( 0, 0, 0 );
			//$FlowFixMe
			document.addEventListener( 'mousedown', this.onPointerStart, false );
			//$FlowFixMe
			document.addEventListener( 'mousemove', this.onPointerMove, false );
			//$FlowFixMe
			document.addEventListener( 'mouseup', this.onPointerUp, false );
			//$FlowFixMe
			document.addEventListener( 'wheel', this.onDocumentMouseWheel, false );
			//$FlowFixMe
			document.addEventListener( 'touchstart', this.onPointerStart, false );
			//$FlowFixMe
			document.addEventListener( 'touchmove', this.onPointerMove, false );
			//$FlowFixMe
			document.addEventListener( 'touchend', this.onPointerUp, false );
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
//				event.preventDefault();
//				var reader = new FileReader();
//				//$FlowFixMe
//				reader.addEventListener( 'load', function ( event ) {
//					material.map.image.src = event.target.result;
//					material.map.needsUpdate = true;
//				}, false );
//				reader.readAsDataURL( event.dataTransfer.files[ 0 ] );
//				//$FlowFixMe
//				document.body.style.opacity = 1;
			}, false );
			//
			window.addEventListener( 'resize', this.onWindowResize, false );
		}
	}

	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.rendererCSS.setSize( window.innerWidth, window.innerHeight );
		this.rendererWebGL.setSize( window.innerWidth, window.innerHeight );
	}

	onPointerStart( event : any ) {
		this.isUserInteracting = true;
		var clientX = event.clientX || event.touches[ 0 ].clientX;
		var clientY = event.clientY || event.touches[ 0 ].clientY;
		this.onMouseDownMouseX = clientX;
		this.onMouseDownMouseY = clientY;
		this.onMouseDownLon = this.lon;
		this.onMouseDownLat = this.lat;
	}

	onPointerMove( event : any) {
		if ( this.isUserInteracting === true ) {
			var clientX = event.clientX || event.touches[ 0 ].clientX;
			var clientY = event.clientY || event.touches[ 0 ].clientY;
			this.lon = ( this.onMouseDownMouseX - clientX ) * 0.1 + this.onMouseDownLon;
			this.lat = ( clientY - this.onMouseDownMouseY ) * 0.1 + this.onMouseDownLat;
		}
	}

	onPointerUp() {
		this.isUserInteracting = false;
	}

	onDocumentMouseWheel( event : any ) {
		var fov = this.camera.fov + event.deltaY * 0.05;
		this.camera.fov = THREE.Math.clamp( fov, 10, 75 );
		this.camera.updateProjectionMatrix();
	}

	/*
	 * update the nodes & links, if it is the first time, create object
	 * for nodes & links, if not, update the position of them
	 */
	update(){
		//to create DOM, and amount to scene
		this.nodes.forEach((node :any)=> {
			if(node.object){
				//existed, just update position
				node.object.position.set(
					node.x,
					node.y,
					node.z
				)
			}else{
			}
		})
		//console.log('links:', links)
		this.links.forEach((link : any) => {
			if(link.object){
				//important! Need to inform engine to update the line
				link.object.geometry.verticesNeedUpdate		= true
				link.object.geometry.vertices[0].set(
					link.source.x,
					link.source.y,
					link.source.z
				)
				link.object.geometry.vertices[1].set(
					link.target.x,
					link.target.y,
					link.target.z
				)
			}else{
			}
		})

		if(this.setting.cameraType === 'perspective'){
			if ( this.isUserInteracting === false ) {
				//this.lon += 0.1;
			}
			this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
			this.phi = THREE.Math.degToRad( 90 - this.lat );
			this.theta = THREE.Math.degToRad( this.lon );
			this.camera.target.x = 500 * Math.sin( this.phi ) * Math.cos( this.theta );
			this.camera.target.y = 500 * Math.cos( this.phi );
			this.camera.target.z = 500 * Math.sin( this.phi ) * Math.sin( this.theta );
			this.camera.lookAt( this.camera.target );
		}
	}

	/*
	 * loop for every tick of render
	 */
	animate(){
		try{
			//slow down
			//setTimeout(() => {
				requestAnimationFrame(this.animate)
			//}, 2000)
			this.render()
		}catch(e){
			console.error('get error in animate:', e)
		}
	}

}
