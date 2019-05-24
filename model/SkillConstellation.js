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
		//combine user setting with the default setting
		setting		= Object.assign(
			settingDefault,
			setting
		)
		this.setting		= setting
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
		this.force		= layout(
			nodes, 
			links, 
			this.setting.isAnimated,
			this.setting.lineDistance,
		)
		/*
		 * 3D
		 */
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
		this.camera.position.set(-200, 200, 200)
		const controls		= new THREE.OrbitControls(this.camera)
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

		//helper
//		const axesHelper		= new THREE.AxesHelper(500)
//		sceneWebGL.add(axesHelper)
//		const cameraHelper		= new THREE.CameraHelper(camera)
//		sceneWebGL.add(cameraHelper)
//		var gridHelper = new THREE.GridHelper( 100, 10 );
//		sceneWebGL.add( gridHelper );
//		var radius = 100;
//		var radials = 160;
//		var circles = 8;
//		var divisions = 64;
//		var helper = new THREE.PolarGridHelper( radius, radials, circles, divisions );
//		sceneWebGL.add( helper );

//		//fix the 0 node
//		////$FlowFixMe
//		nodes[0].fx		= 0
//		//$FlowFixMe
//		nodes[0].fy		= 0
//		//$FlowFixMe
//		nodes[0].fz		= 0
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
				this.sceneCSS.add(textObject3D)
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
				this.sceneWebGL.add(group)
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
				this.sceneWebGL.add(line)
				link.object		= line
		}
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
