//@flow
/*
 * My own skill constellation, using SkillConstellation component
 */
import THREE		from '../three.js'
import * as d3		from 'd3'

export default class Me{
	object3D		: any
	objectDOM		: any
	isShown		: boolean
	setting		: any

	constructor(
		domElement		: any,
		scene		: any,
	){
		this.isShown		= false
		this.objectDOM		= domElement
		scene.add( this.object3D );
	}

	init(){
		this.setting		= {
			/*
			 * the DOM div element to mount all the component/canvas and so on
			 */
			container		: document.getElementById('container'),
			/*
			 * isAnimated = true	: there is an animation when it show up
			 */
			isAnimated		: false,
			/*
			 * the path to background picture of the component, need copy the 
			 * picture to [project root dir]/static/  
			 */
			backgroundPicture		: '/static/space.png',
			/*
			 * the line between two skill nodes
			 */
			lineColor		: 0xffffff,
			/*
			 * the line distance between two skill nodes
			 */
			lineDistance		: 100,
			/*
			 * text type = 'CSS', use CSS+HTML to show text skill node, with setting:textCSS
			 * text type = 'THREE', use 3D model to show text skill node, with setting: textMesh
			 */
			textType		: 'CSS',
			/*
			 * the width of the component
			 */
			width		: window.innerWidth,
			/*
			 * the height of the component
			 */
			height		: window.innerHeight,
			/*
			 * if true, the text will always keep facing to the camera
			 */
			isTextDirectionFixed		: true,
			/*
			 * if true, the camera will rotate automatically
			 */
			isAutoRotated		: false,
			/*
			 * the speed of camera rotation
			 */
			autoRotationSpeed		: 1,
			/*
			 * cameraType	= 'perspective' : the camera is first person view
			 * cameraType	= 'orbit'		: the camera is third person view
			 */
			cameraType		: 'perspective',
			/*
			 * in perspective mode, the position of camera, for X,Y,Z coordination
			 */
			cameraPerspectivePositionX		: 300,
			cameraPerspectivePositionY		: 0,
			cameraPerspectivePositionZ		: 0,
			/*
			 * in perspective mode, the angle of camera, for X,Y,Z coordination
			 */
			cameraPerspectiveAngleX		: 0,
			cameraPerspectiveAngleY		: -90,
			cameraPerspectiveAngleZ		: 0,
			/*
			 * in orbit mode, the position of camera, for X,Y,Z coordination
			 */
			cameraObitPositionX		: 0,
			cameraObitPositionY		: 0,
			cameraObitPositionZ		: 200,
			/*
			 * in orbit mode, the distance to camera, the bigger the number, the far
			 * away to the camera
			 */
			cameraObitFrustmSize		: 600,
			/*
			 * strength to push all skill nodes away
			 */
			strengthPushAllAway		: -657,
			/*
			 * strength to pull all skill nodes to X coordination
			 */
			strengthPullToX		: 0.1,
			/*
			 * strength to pull all skill nodes to y coordination
			 */
			strengthPullToY		: 0.1,
			/*
			 * strength to pull all skill nodes to z coordination
			 */
			strengthPullToZ		: 0.1,
			/*
			 * strength to bounce all nodes away
			 */
			strengthToBounceOtherAway		: 0.78,
			/*
			 * this is the setting for show a skill node in CSS/HTML way
			 */
			textCSS		: (node) => {
				return (
					<div
						style={{
							backgroundColor		: colors(node.name),
							width		: 32 * (node.weight/10) + 'px',
							height		: 32 * (node.weight/10) + 'px',
							borderRadius		: '50%',
						}}
					>
						<div
							style={{
								position		: 'absolute',
								color		: 'white',
								left		: 32 * (node.weight/10) + 5 + 'px' ,
								fontSize		: 14,
							}}
						>
							{node.name}
						</div>
					</div>
				)
			},
			/*
			 * this is the setting for show a skill node in three.js d3 way
			 */
			textMesh		: (node, font) =>{
				//WebGL text
				const textGeometry = new THREE.TextGeometry( node.name, {
					font: font,
					size: 28 * (node.weight/10),
					height: 5 * (node.weight/10),
	//					curveSegments: 12,
	//					bevelEnabled: true,
	//					bevelThickness: 8,
	//					bevelSize: 8,
	//					bevelOffset: 0,
	//					bevelSegments: 5
				} );
				const textMaterial		= new THREE.MeshNormalMaterial({
					color		: 0x00ffff,
				})
				return new THREE.Mesh(textGeometry, textMaterial)
			},
			/*
			 * the skill data
			 * 	name		:		the skill name
			 * 	weight		: the weight for skill, range from 1 to 10
			 */
			data		: [
				//{{{
				{
					name		: 'Javascript',
					weight		: 8,
					children		: [
						{
							name		: 'React',
							weight		: 8,
							children		: [
								{
									name		: 'Redux',
									weight		: 3,
								},{
									name		: 'Flow',
									weight		: 3,
								},{
									name		: 'Jest',
									weight		: 5,
								},{
									name		: 'Next.js',
									weight		: 3,
								}
							],
						},{
							name		: 'D3',
							weight		: 6,
						},{
							name		: 'Three.js',
							weight		: 3,
						},{
							name		: 'Node.js',
							weight		: 6,
						}
					],
				},{
					name		: 'Java',
					weight		: 6,
					children		: [
						{
							name		: 'spring',
							weight		: 5,
						}
					]
				},{
					name		: 'git',
					weight		: 4,
				},{
					name		: 'TDD',
					weight		: 8,
					children		: [
						{
							name		: 'Trello',
							weight		: 3,
						},{
							name		: 'Agile programming',
							weight		: 5,
						},{
							name		: 'Pomodoro Technique',
							weight		: 3,
						}
					],
				}
				//}}}
			]
		}
		this.refresh()
		/*
		 * the GUI
		 */
//		//remove old one
//		const element		= document.querySelector('.dg.ac')
//		if(element){
//			//$FlowFixMe
//			element.parentNode.removeChild(element)
//		}
//		debugger
//		if(this.gui){
//			console.log('destroy...')
//			this.gui.destroy()
//
//		}
		const dat		= require('dat.gui')	
		this.gui		= new dat.GUI()
		this.gui.add(this.setting, 'isAnimated').onFinishChange(this.refresh)
		this.gui.add(this.setting, 'textType', ['CSS', 'THREE']).onFinishChange(this.refresh)
		this.gui.add(this.setting, 'cameraType', ['orbit', 'perspective']).onFinishChange(this.refresh)
		const folder		= this.gui.addFolder('adjust camera positon/angle')
		folder.add(this.setting, 'cameraPerspectivePositionX', 0, 500).onFinishChange(this.refresh)
		folder.add(this.setting, 'cameraPerspectivePositionY', 0, 500).onFinishChange(this.refresh)
		folder.add(this.setting, 'cameraPerspectivePositionZ', 0, 500).onFinishChange(this.refresh)
		folder.add(this.setting, 'cameraPerspectiveAngleX', -90, 90).onFinishChange(this.refresh)
		folder.add(this.setting, 'cameraPerspectiveAngleY', -90, 90).onFinishChange(this.refresh)
		folder.add(this.setting, 'cameraPerspectiveAngleZ', -90, 90).onFinishChange(this.refresh)
		folder.add(this.setting, 'cameraObitPositionX', -500, 500).onFinishChange(this.refresh)
		folder.add(this.setting, 'cameraObitPositionY', -500, 500).onFinishChange(this.refresh)
		folder.add(this.setting, 'cameraObitPositionZ', -500, 500).onFinishChange(this.refresh)
		folder.add(this.setting, 'cameraObitFrustmSize', 0, 1000).onFinishChange(this.refresh)
		const folderB		= this.gui.addFolder('adjust bounce strength')
		folderB.add(this.setting, 'strengthPushAllAway', -1000, 1000).onFinishChange(this.refresh)
		folderB.add(this.setting, 'strengthPullToX', 0, 1).onFinishChange(this.refresh)
		folderB.add(this.setting, 'strengthPullToY', 0, 1).onFinishChange(this.refresh)
		folderB.add(this.setting, 'strengthPullToZ', 0, 1).onFinishChange(this.refresh)
		folderB.add(this.setting, 'strengthToBounceOtherAway', 0, 1).onFinishChange(this.refresh)
		this.gui.addColor(this.setting, 'lineColor').onFinishChange(this.refresh)
		this.gui.add(this.setting, 'lineDistance', 1, 500).onFinishChange(this.refresh)
		this.gui.add(this.setting, 'width', 1, 5000).onFinishChange(this.refresh)
		this.gui.add(this.setting, 'height', 1, 5000).onFinishChange(this.refresh)
		this.gui.add(this.setting, 'isTextDirectionFixed').onFinishChange(this.refresh)
		this.gui.add(this.setting, 'isAutoRotated').onFinishChange(this.refresh)
		this.gui.add(this.setting, 'autoRotationSpeed', 1, 10).onFinishChange(this.refresh)
	}

	async show(){
		if(this.isShown){
		}else{
			this.isShown = true
			await new Promise(resolve => {
				let object3DInner		= this.object3DInner
				let objectDOM		= this.objectDOM
				function tween(){
					return function(){
						const i		= d3.interpolateNumber(
							-90 * THREE.Math.DEG2RAD, 
							0,
						)
						const opacity		= d3.interpolateNumber(0, 1)
						return function(t){
							console.log('tween:', i(t))
							object3DInner.rotation.x		= i(t)
							d3.select(objectDOM).style('opacity', opacity(t))
						}
					}
				}
				d3.transition()
					.duration(1000)
					.ease(d3.easeElastic)
					.tween('test', tween())
					.on('end', () => {
						console.log('finished')
						resolve()
					})
			})
		}
	}
}
