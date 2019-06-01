//@flow
import React		from 'react'
import THREE		from '../three.js'
import '../style.css'
import Twitter		from '../component/Twitter.js'
import Facebook		from '../component/Facebook.js'
import Mouse		from '../component/Mouse.js'
import * as d3		from 'd3'
import Sector		from '../model/Sector.js'
import i18n		from '../i18n.js'
import { Translation } from 'react-i18next'
import Me		from '../model/Me.js'
import SkillConstellationObject		from '../model/SkillConstellationObject.js'
import * as log		from 'loglevel'
import Box		from '../model/Box.js'
import Arrow		from '../component/Arrow.js'
import Language		from '../component/Language.js'
import Location		from '../component/Location.js'

//$FlowFixMe
console.trace		= console.debug
log.setDefaultLevel('debug')
const isAnimated		= true
const isSlowDown		= false
const isHelperShown		= false
const colors		= d3.scaleOrdinal(d3.schemeCategory10)

const sectors		= [
	{
		id		: 'sectorA',
		range		: [-30, 30],
		opacity		: 0,
		isShown		: false,
	},{
		id		: 'sectorB',
		range		: [60, 120],
		opacity		: 0,
		isShown		: false,
	},{
		id		: 'sectorC',
		range		: [150, 210],
		opacity		: 0,
		isShown		: false,
	},{
		id		: 'sectorD',
		range		: [240, 300],
		opacity		: 0,
		isShown		: false,
	}
]

const sector		= new Sector(sectors)

type Props		= {
}
type State		= {
	isLanguageOpened		: boolean,
	language		: 'zh' | 'en',
}
class Index extends React.Component<Props,State>{
	showSkill		: Function
	clickLeft		: Function
	clickRight		: Function
	handleBoxDetail		: Function

	constructor(props : any){
		super(props)
		//bind
		////$FlowFixMe
		this.refresh		= this.refresh.bind(this)
		//$FlowFixMe
		this.handleClickSkill		= this.handleClickSkill.bind(this)
		//$FlowFixMe
		this.handleClickRight		= this.handleClickRight.bind(this)
		//$FlowFixMe
		this.handleClickLeft		= this.handleClickLeft.bind(this)
		//$FlowFixMe
		this.toggleLanguage		= this.toggleLanguage.bind(this)
		//$FlowFixMe
		this.handleLanguageChange		= this.handleLanguageChange.bind(this)
		//$FlowFixMe
		this.handleBoxClick		= this.handleBoxClick.bind(this)

		const language		= props.url.query.ln || 'en'
		this.state		= {
			isLanguageOpened		: false,
			language,
		}
		i18n.changeLanguage(language)
	}

	componentDidMount(){
		d3.select('.all')
			.style('display', 'block')
		this.refresh()
	}

	componentDidUpdate(){
		//this.refresh()
	}

	async refresh(){
		const handleClickSkill		= this.handleClickSkill
		let me
		let box
		let skillConstellationObject
		let controls
		let isWatchingSill		= false
		let isBoxOpened		= false
		var thisRef		= this
		var isShown
		var boxMesh
		var camera, scene, renderer, sceneDOM, rendererDOM;
		let material
		var isUserInteracting = false,
			onMouseDownMouseX = 0, onMouseDownMouseY = 0,
			//the degree from front to right, from 0 to 360
			lon = 0, 
			onMouseDownLon = 0,
			lat = 0, 
			onMouseDownLat = 0,
			phi = 0, 
			theta = 0;
		await init();
		if(isAnimated){
			animate();
		}else{
			setTimeout(() => {
				requestAnimationFrame(update)
			}, 500)
		}
		async function init() {
			var container, mesh;
			container = document.getElementById( 'container' );
			camera = new THREE.PerspectiveCamera( 
				75, 
				window.innerWidth / window.innerHeight, 
				1, 
				1100 );
			camera.target = new THREE.Vector3( 0, 0, 0 );
			scene = new THREE.Scene();
			var texture = new THREE.TextureLoader().load('/static/space.png');
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.RepeatWrapping;
			texture.repeat.set( 1, 1 );
			scene.background		= texture
			/*
			 * the panorama sphere
			 */
			var geometry = new THREE.SphereBufferGeometry( 800, 60, 40 );
			// invert the geometry on the x-axis so that all of the faces point inward
			geometry.scale( - 1, 1, 1 );
			var texture = new THREE.TextureLoader().load( '/static/pic1.jpg' );
			material = new THREE.MeshBasicMaterial( { map: texture } );
			material.transparent		= true
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

			//helper
			if(isHelperShown){
				const axesHelper		= new THREE.AxesHelper(500)
				scene.add(axesHelper)
				const cameraHelper		= new THREE.CameraHelper(camera)
				scene.add(cameraHelper)
				const polarGridHelper		= new THREE.PolarGridHelper()
				scene.add(polarGridHelper)
				const boxHelper		= new THREE.VertexNormalsHelper( boxMesh, 2, 0x00ff00, 1 );
				scene.add(boxHelper)
				/*
				 * Polar
				 */
				var radius = 10;
				var radials = 16;
				var circles = 8;
				var divisions = 64;
				var helper = new THREE.PolarGridHelper( radius, radials, circles, divisions );
				scene.add( helper );
				/*
				 * grid
				 */
				var size = 10;
				var divisions = 10;
				var gridHelper = new THREE.GridHelper( size, divisions );
				scene.add( gridHelper );
			}

			renderer = new THREE.WebGLRenderer({
					antialias		: true,
			})
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( window.innerWidth, window.innerHeight );
			//$FlowFixMe
			container.appendChild( renderer.domElement );

			//for DOM
			const containerDOM		= document.getElementById('containerDOM')
			//clear
			////$FlowFixMe
			containerDOM.innerHTML		= ''
			sceneDOM		= new THREE.Scene()
			rendererDOM		= new THREE.CSS3DRenderer()
			rendererDOM.setSize( window.innerWidth, window.innerHeight )
			rendererDOM.domElement.style.position = 'absolute'
			rendererDOM.domElement.style.top = 0
			//$FlowFixMe
			containerDOM.appendChild( rendererDOM.domElement );
			/*
			 * me
			 */
			me		= new Me(
				document.getElementById('me'),
				sceneDOM
			)
			me.object3D.position.copy( new THREE.Vector3(0, -350, 450) );
			//me.object3D.position.copy( new THREE.Vector3(250, 0, 0) );
			me.object3D.rotation.copy( new THREE.Euler(
				0,
				0,//45 * THREE.Math.DEG2RAD, 
				0,
			))
//			me.object3D.lookAt(
//				0,
//				0,
//				0,
//			)
			//me.show()
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

			/*
			 * The skills
			 */
			function handleClick(){
				//{{{
				isWatchingSill		= true
				//hide title
				d3.selectAll('#sectorC')
					.style('opacity', '0')
					.style('visibility', 'hidden')
				//camera.lookAt(skillConstellationObject.groupAllWebGL.position)
				console.log('camera:', camera)
				//record the target of camera
				const cameraTargetOrigin		= new THREE.Vector3(
					camera.target.x,
					camera.target.y,
					camera.target.z,
				)
				/*
				 * hide me & box
				 */
				me.hide()
				/*
				 * box
				 */
				box.hide()
				log.info(
					'the origin camera \ntarget:%o, \nposition:%o, \nrotation:%o, \nthe skill object position:%o',
					JSON.stringify(cameraTargetOrigin),
					JSON.stringify(camera.position),
					JSON.stringify(camera.rotation),
					JSON.stringify(skillConstellationObject.groupAllWebGL.position),
				)
				/*
				 * hide background, move camera target to 
				 */
				function tween(){
					return function(){
						const opacity		= d3.interpolateNumber(1, 0)
						const targetX		= d3.interpolateNumber(
							camera.target.x,
							skillConstellationObject.groupAllWebGL.position.x
						)
						const targetY		= d3.interpolateNumber(
							camera.target.y,
							skillConstellationObject.groupAllWebGL.position.y
						)
						const targetZ		= d3.interpolateNumber(
							camera.target.z,
							skillConstellationObject.groupAllWebGL.position.z
						)
						const scale		= d3.interpolateNumber(
							1,
							1.3
						)
						return function(t){
							material.opacity		= opacity(t)
							camera.target		= new THREE.Vector3(
								targetX(t),
								targetY(t),
								targetZ(t),
							)
							camera.lookAt(camera.target)
							skillConstellationObject.groupAllCSS.scale.set(
								scale(t),
								scale(t),
								scale(t),
							)
							skillConstellationObject.groupAllWebGL.scale.set(
								scale(t),
								scale(t),
								scale(t),
							)
						}
					}
				}
				//controls.update() must be called after any manual changes to the camera's transform
				//camera.position.set( 0, 20, 100 );
				d3.transition()
					.duration(1000)
					.tween('intoSkill', tween())
					.on('end', function(){
						log.info(
							'enter skill finished! camera \nposition:%o\ntarget:%o\nrotation:%o,\nskill object position:%o',
							JSON.stringify(camera.position),
							JSON.stringify(camera.target),
							JSON.stringify(camera.rotation),
							JSON.stringify(skillConstellationObject.groupAllWebGL.position),
						)
					})
				d3.select('.close-icon')
					.transition()
					.duration(1000)
					.style('opacity', '1')
					.style('visibility', 'visible')
					.on('end', function(){
						controls = new THREE.OrbitControls( 
							camera,
							container
						);
						controls.enableDamping		= true
						controls.target		= new THREE.Vector3(
							skillConstellationObject.groupAllWebGL.position.x,
							skillConstellationObject.groupAllWebGL.position.y,
							skillConstellationObject.groupAllWebGL.position.z,
						)
						controls.autoRotate		= true
						console.log('camera target:x:%d,y:%d,z:%d', camera.target.x, camera.target.y, camera.target.z, )
						console.log('camera rotation:', camera.rotation)
						d3.select('.close-icon')
							.on('click', function(){
								console.log('click close')
								//show title
								d3.selectAll('#sectorC')
									.style('opacity', '1')
									.style('visibility', 'visible')
								/*
								 * disable controls
								 */
								//$FlowFixMe
								controls.dispose()
								//$FlowFixMe
								controls.autoRotate		= false
								//$FlowFixMe
								controls.enabled		= false
								controls		= undefined
								log.info(
									'to quit skill, move camera target from:%o to %o',
									skillConstellationObject.groupAllWebGL.position,
									cameraTargetOrigin
								)
								/* 
								 * move camera back 
								*/
								function tween(){
									return function(){
										/*
										 * show the background
										 * move camera back to 0
										 * move camera target to origin position
										 */
										const opacity		= d3.interpolateNumber(0, 1)
										const cameraX		= d3.interpolateNumber(camera.position.x, 0)
										const cameraY		= d3.interpolateNumber(camera.position.y, 0)
										const cameraZ		= d3.interpolateNumber(camera.position.z, 0)
										const targetX		= d3.interpolateNumber(
											skillConstellationObject.groupAllWebGL.position.x,
											cameraTargetOrigin.x
										)
										const targetY		= d3.interpolateNumber(
											skillConstellationObject.groupAllWebGL.position.y,
											cameraTargetOrigin.y
										)
										const targetZ		= d3.interpolateNumber(
											skillConstellationObject.groupAllWebGL.position.z,
											cameraTargetOrigin.z
										)
										const scale		= d3.interpolateNumber(1.3, 1)
										return function(t){
											material.opacity		= opacity(t)
											camera.position.set(
												cameraX(t),
												cameraY(t),
												cameraZ(t),
											)
											camera.target		= new THREE.Vector3(
												targetX(t),
												targetY(t),
												targetZ(t),
											)
											camera.lookAt(camera.target)
											skillConstellationObject.groupAllCSS.scale.set(
												scale(t),
												scale(t),
												scale(t),
											)
											skillConstellationObject.groupAllWebGL.scale.set(
												scale(t),
												scale(t),
												scale(t),
											)
										}
									}
								}
								d3.transition()
									.duration(1000)
									.tween('outSkill', tween())
									.on('end', function(){
										console.log('bind event')
										bindEvent()
										isWatchingSill		= false
										log.info(
											'quit finished! camera \ntarget:%o, \nposition:%o, \nrotation:%o;\nskill object position:%o',
											JSON.stringify(camera.target),
											JSON.stringify(camera.position),
											JSON.stringify(camera.rotation),
											JSON.stringify(skillConstellationObject.groupAllWebGL.position),
										)
										//me
										me.unHide()
										//box
										box.unHide()
									})
								d3.select('.close-icon')
									.transition()
									.duration(1000)
									.style('opacity', '0')
									.style('visibility', 'none')
							})
					})
				//}}}
			}
			//$FlowFixMe
			thisRef.showSkill		= handleClick
			const setting		= {
				isAnimated		: true,
				lineColor		: 0xffffff,
				lineDistance		: 100,
				textType		: 'CSS',
				strengthPushAllAway		: -657,
				strengthPullToX		: 0.1,
				strengthPullToY		: 0.1,
				strengthPullToZ		: 0.1,
				strengthToBounceOtherAway		: 0.78,
				onClick		: undefined,
				textCSS		: (node) => {
					return (
						<div
							className='ball'
							style={{
								background		: `radial-gradient(circle at ${32 * (node.weight/10)}px ${32 * (node.weight/10)}px, ${colors(node.name)}, #fff)`,
								//background		: `radial-gradient(circle at ${32 * (node.weight/10)}px ${32 * (node.weight/10)}px, rgb(253, 51, 51), #fff)`,
								width		: 32 * (node.weight/10) + 'px',
								height		: 32 * (node.weight/10) + 'px',
							}}
						>
							<div
								className='skill'
								style={{
									position		: 'absolute',
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
			skillConstellationObject		= new SkillConstellationObject(setting)
			await skillConstellationObject.init()
			sceneDOM.add(skillConstellationObject.groupAllCSS)
			scene.add(skillConstellationObject.groupAllWebGL)
			const awayVector3		= new THREE.Vector3(
				-450,
				100,
				0,
			)
			const awayEuler		= new THREE.Euler(
				0 * THREE.Math.DEG2RAD, 
				-90 * THREE.Math.DEG2RAD, 
				0 * THREE.Math.DEG2RAD, 
			)
			skillConstellationObject.groupAllCSS.position.copy(awayVector3)
			skillConstellationObject.groupAllWebGL.position.copy(awayVector3)
			skillConstellationObject.groupAllCSS.rotation.copy(awayEuler)
			skillConstellationObject.groupAllWebGL.rotation.copy(awayEuler)
			/*
			 * box
			 */
			const boxWidth		= 480
			const boxHeight		= 240
			function handleBoxSideClick(i : number){
				//{{{
				log.info('click side:%d', i)
				isBoxOpened		= true
				//show the arrow
				d3.selectAll('.arrow')
					.style('opacity', '0.6')
				//hide title
				d3.select('#sectorD')
					.style('opacity', '0')
					.style('visibility', 'hidden')
				const cameraTargetOrigin		= new THREE.Vector3(
					camera.target.x,
					camera.target.y,
					camera.target.z,
				)
				log.info('before show box, backup the camera target:%s',
					JSON.stringify(camera.target)
				)
				/*
				 * move camera.y  = box.y
				 */
				function tween(){
					return function(){
						const cameraY		= d3.interpolateNumber(0, box.group.position.y)
						const cameraTargetX		= d3.interpolateNumber(
							camera.target.x,
							box.group.position.x
						)
						const cameraTargetY		= d3.interpolateNumber(
							camera.target.y,
							box.group.position.y
						)
						const cameraTargetZ		= d3.interpolateNumber(
							camera.target.z,
							box.group.position.z
						)
						let angle		= 
							Math.atan(
								Math.abs(box.group.position.x) / 
								Math.abs(box.group.position.z)
							)
						log.info('anle of atan = %s', angle)
						angle		= 
							angle + Math.floor(box.group.rotation.y / (Math.PI/2)) * (Math.PI/2)
						log.info('angle of atan + n*(PI/2)', angle)
//						if(i === 1 || i === 3){
//							angle		-= Math.PI / 2
//							log.info('angle for 1,3 side:', angle)
//						}
						log.info(
							'click on side:%d, box position:%s, rotation:%s, angle is %s, ',
							i,
							JSON.stringify(box.group.position),
							JSON.stringify(box.group.rotation),
							angle,
						)
						log.info(
							'box.position :%s, tan(x/z) = %o = %odeg', 
							JSON.stringify(box.group.position),
							angle,
							THREE.Math.radToDeg(angle)
						)
						const boxRotationY		= d3.interpolateNumber(
							box.group.rotation.y,
							angle
						)
						const scale		= d3.interpolateNumber(
							1,
							1.6
						)
						const opacity		= d3.interpolateNumber(1, 0)
						return function(t){
							material.opacity		= opacity(t)
							camera.position.y		= cameraY(t)
							camera.target.x		= cameraTargetX(t)
							camera.target.y		= cameraTargetY(t)
							camera.target.z		= cameraTargetZ(t)
							camera.lookAt(camera.target)
							box.group.rotation.y		= boxRotationY(t)
							box.group.scale.set(
								scale(t),
								scale(t),
								scale(t),
							)
						}
					}
				}
				d3.transition()
					.duration(1000)
					.tween('move', tween())
					.on('end', () => {
						d3.select('.close-icon')
							.style('opacity', '1')
							.on('click', () => {
								log.info('quit box show')
								function tween(){
									return function(){
										const scale		= d3.interpolateNumber(1.6, 1)
										const opacity		= d3.interpolateNumber(0, 1)
										const cameraY		= d3.interpolateNumber(
											box.group.position.y,
											0
										)
										const cameraTargetX		= d3.interpolateNumber(
											camera.target.x,
											cameraTargetOrigin.x
										)
										const cameraTargetY		= d3.interpolateNumber(
											camera.target.y,
											cameraTargetOrigin.y
										)
										const cameraTargetZ		= d3.interpolateNumber(
											camera.target.z,
											cameraTargetOrigin.z
										)
										return function(t){
											box.group.scale.set(
												scale(t),
												scale(t),
												scale(t),
											)
											material.opacity		= opacity(t)
											camera.position.y		= cameraY(t)
											camera.target.x		= cameraTargetX(t)
											camera.target.y		= cameraTargetY(t)
											camera.target.z		= cameraTargetZ(t)
											camera.lookAt(camera.target)
										}
									}
								}
								d3.transition()
									.duration(1000)
									.tween('quitBoxShow', tween())
									.on('end', () => {
										isBoxOpened		= false
										d3.selectAll('.arrow')
											.style('opacity', '0')
										log.info('after quit box show, camera position:%s',
											JSON.stringify(camera.position)
										)
										d3.select('.close-icon')
											.style('opacity', '0')
										//hide title
										d3.select('#sectorD')
											.style('opacity', '1')
											.style('visibility', 'visible')
									})
							})
					})
				//}}}
			}
			thisRef.handleBoxDetail		= () => handleBoxSideClick(0)
			let isRatating		= false
			function handleNext(direction : 'left'|'right'){
				//{{{
				if(isRatating){
					log.warn('is ratating, cancel')
				}else{
					isRatating		= true
					function tween(){
						return function(){
							const rotate		= d3.interpolateNumber(
								box.group.rotation.y,
								box.group.rotation.y + (direction === 'left' ? 1:-1) * Math.PI / 2
							)
							return function(t){
								box.group.rotation.y		= rotate(t)
							}
						}
					}
					d3.transition()
						.duration(1000)
						.tween('rotating', tween())
					isRatating		= false
				}
				//}}}
			}
			//$FlowFixMe
			thisRef.clickLeft		= () => handleNext('left')
			//$FlowFixMe
			thisRef.clickRight		= () => handleNext('right')
			box		= new Box(
				[
					'/static/demo1.png',
					'/static/demo2.png',
					'/static/demo3.png',
					'/static/demo4.png'
				],
				boxWidth,
				boxHeight,
				handleBoxSideClick,
			)
			box.group.position.set(
				0,
				100,
				-800,
			)
			sceneDOM.add(box.group)
			/*
			 * selector manager
			 */
			for(let i = 0 ; i < sectors.length; i++){
				const sector		= sectors[i]
				switch(i){
					case 0:{
						//$FlowFixMe
						sector.show		= () => {
							d3.select('#sectorA')
								.style('visibility', 'visible')
								.style('opacity', '1')
						}
						//$FlowFixMe
						sector.hide		= () => {
							d3.select('#sectorA')
								.style('visibility', 'hidden')
								.style('opacity', '0')
						}
						break
					}
					case 1:{
						//$FlowFixMe
						sector.show		= () => {
							d3.select('#sectorB')
								.style('visibility', 'visible')
								.style('opacity', '1')
							me.show()
						}
						//$FlowFixMe
						sector.hide		= () => {
							d3.select('#sectorB')
								.style('visibility', 'hidden')
								.style('opacity', '0')
						}
						break
					}
					case 2:{
						//$FlowFixMe
						sector.show		= () => {
							d3.select('#sectorC')
								.style('visibility', 'visible')
								.style('opacity', '1')
							skillConstellationObject.explode()
						}
						//$FlowFixMe
						sector.hide		= () => {
							d3.select('#sectorC')
								.style('visibility', 'hidden')
								.style('opacity', '0')
						}
						break
					}
					case 3:{
						//$FlowFixMe
						sector.show		= () => {
							d3.select('#sectorD')
								.style('visibility', 'visible')
								.style('opacity', '1')
							box.explode()
						}
						//$FlowFixMe
						sector.hide		= () => {
							d3.select('#sectorD')
								.style('visibility', 'hidden')
								.style('opacity', '0')
						}
						break
					}
				}
			}
			//auto update sectors
			/*
			 * control the sectors
			 */
			setInterval(() => {
				log.debug('lon:', lon)
				sector.move(lon)
			}, 500)

			/*
			 * event
			 */
			bindEvent()
			function bindEvent(){
				console.log('bind event...')
				//first remove previous ones
//				//$FlowFixMe
//				document.removeEventListener( 'mousedown', onPointerStart, false );
//				//$FlowFixMe
//				document.removeEventListener( 'mousemove', onPointerMove, false );
//				//$FlowFixMe
//				document.removeEventListener( 'mouseup', onPointerUp, false );
//				//$FlowFixMe
//				document.removeEventListener( 'wheel', onDocumentMouseWheel, false );
//				//$FlowFixMe
//				document.removeEventListener( 'touchstart', onPointerStart, false );
//				//$FlowFixMe
//				document.removeEventListener( 'touchmove', onPointerMove, false );
//				//$FlowFixMe
//				document.removeEventListener( 'touchend', onPointerUp, false );
//				//$FlowFixMe
//				document.removeEventListener( 'mousedown', onPointerStart, false );
//				////$FlowFixMe
//				document.removeEventListener( 'dragover', onDragover, false );
//				//$FlowFixMe
//				document.removeEventListener( 'dragenter', onDragenter, false );
//
//				document.removeEventListener( 'dragleave', onDragleave, false );
//				//$FlowFixMe
//				document.removeEventListener( 'drop', onDrag, false );
//				//
//				window.removeEventListener( 'resize', onWindowResize, false );
				/*
				 * add
				 */
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
				////$FlowFixMe
				document.addEventListener( 'dragover', onDragover, false );
				//$FlowFixMe
				document.addEventListener( 'dragenter', onDragenter, false );

				document.addEventListener( 'dragleave', onDragleave, false );
				//$FlowFixMe
				document.addEventListener( 'drop', onDrag, false );
				//
				window.addEventListener( 'resize', onWindowResize, false );
			}
		}
		function onDrag ( event ) {
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
				}
		function onDragleave() {
					//$FlowFixMe
					document.body.style.opacity = 1;
				}
		function onDragenter() {
			//$FlowFixMe
			document.body.style.opacity = 0.5;
		}
		function onDragover( event ) {
					event.preventDefault();
					event.dataTransfer.dropEffect = 'copy';
				}
		function onWindowResize() {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize( window.innerWidth, window.innerHeight );
		}
		function onPointerStart( event ) {
			console.log('drag start')
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
//			var fov = camera.fov + event.deltaY * 0.05;
//			camera.fov = THREE.Math.clamp( fov, 10, 75 );
//			camera.updateProjectionMatrix();
			lon		+= event.deltaY * 0.05
		}
		function animate() {
			//slow down
			if(isSlowDown){
				setTimeout(() => {
					requestAnimationFrame( animate );
				}, 1000)
			}else{
				requestAnimationFrame( animate );
			}
			update();
		}
		function update() {
			if(!isWatchingSill && !isBoxOpened){
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
				log.trace('update camera target:', camera.target)
				if(!isShown){
					console.log('the camera:', camera.toJSON())
					console.log('the camera position:', camera.position)
					console.log('the camera rotation:', camera.rotation)
					isShown		= true
					console.log('the box:', boxMesh)
				}
				//me.object3D.rotateOnAxis(new THREE.Vector3(1, 0, 0), 0.1)
				/*
				 * skill
				 */
				skillConstellationObject.groupAllWebGL.rotation.y		+= 0.01
				skillConstellationObject.groupAllCSS.rotation.y		+= 0.01
				skillConstellationObject.update()
				/*
				 * box
				 */
				box.autoRotate()
			}else{
				if(controls){
					log.trace('update control')
					controls.update()
				}
			}

			/*
			 * rotate the text to towards the camera
			 */
			skillConstellationObject.nodes.forEach((node :any)=> {
				if(node.object){
					node.object.lookAt(
							camera.position.x,
							camera.position.y,
							camera.position.z,
						)
				}
			})
			/*
				// distortion
				camera.position.copy( camera.target ).negate();
				*/
			renderer.render( scene, camera );
			rendererDOM.render( sceneDOM, camera );
		}
	}

	handleClickSkill(){
		log.info('click skill button')
		this.showSkill()
	}

	handleClickRight(){
		log.info('click right')
		this.clickRight()
	}

	handleClickLeft(){
		log.info('click left')
		this.clickLeft()
	}

	toggleLanguage(e : any){
		e.stopPropagation()
		e.preventDefault()
		this.setState({
			isLanguageOpened		: !this.state.isLanguageOpened,
		})
	}

	handleLanguageChange(e : any){
		e.stopPropagation()
		e.preventDefault()
		window.location.href		= '?ln=' + e.target.value
//		this.setState({
//			language		: e.target.value,
//			isLanguageOpened		: false,
//		})
	}

	handleBoxClick(){
		this.handleBoxDetail()
	}

	render(){
		return (
				<Translation>
					{
						t =>
							<div
								className='all'
								style={{
									userSelect		: 'none',
									display		: 'none',
								}}
							>
								<div 
									style={{
										display		: 'none',
									}}
									className='materials' >
									<img
										 id='me'
										draggable='false'
										 style={{
													position                : 'absolute',
												 height          : 350,
										 }}
										 src='/static/me.png'
										 />
								</div>
								<div id='container' >
									<div id='containerDOM' />
								</div>
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
											<div
												onClick={this.toggleLanguage}
											>
												<Language/>
											</div>
											{this.state.isLanguageOpened &&
												<select 
													className='select-language'
													value={this.state.language}
													onChange={this.handleLanguageChange}
												>
													<option value='en' >English</option>
													<option value='zh' >中文</option>
												</select>
											}
										</div>

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
								<div className='footer' >
									Bohol, Philippine, I have been there for my holiday.
									<a target='_blank' href='https://www.google.com/maps/@9.7337335,124.1204287,3a,75y,214.8h,92.33t/data=!3m6!1e1!3m4!1sLak1KJmVZNJBrgcMNpIzIg!2e0!7i13312!8i6656'>
										<Location/>
									</a>
								</div>
								<div className='sector' id='sectorA' >
									<p 
										style={{
											width		: 330,
										}}
										className='h1 bottom-right' >{t('slogon').split(' ').map(c => <span>{c}</span>)}</p>
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
										className='h1 top-left' >
										{t('intro').split(' ').map(c => <span>{c}</span>)}
									</p>
								</div>
								<div className='sector' id='sectorC' >
									<div className='center' >
									<p 
										onClick={this.handleClickSkill}
										className='h1 bottom' >
										{t('skill').split(' ').map(c => <span>{c}</span>)}
										<a className='button' >
											{t('skill.button').split(' ').map(c => <span>{c}</span>)}
										</a>
									</p>
									</div>
								</div>
								<div className='sector' id='sectorD' >
									<div className='center' >
										<p 
											className='h1 bottom' >
											{t('work').split(' ').map(c => <span>{c}</span>)}
											<a
												className='link'
												target='_blank'
												href='https://www.midinote.me'
											>
												{t('work.link')}
											</a>
											<a 
												onClick={this.handleBoxClick}
												className='button' 
											>
											{t('skill.button').split(' ').map(c => <span>{c}</span>)}
											</a>
										</p>
									</div>
								</div>
								<div className='close-icon' >
									 <svg id='closeIcon' version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' x='0px' y='0px'
										 viewBox='0 0 512 512' style={{enableBackground:'new 0 0 512 512',}} xmlSpace='preserve'>
										 <g>
											 <g>
												 <path d='M505.943,6.058c-8.077-8.077-21.172-8.077-29.249,0L6.058,476.693c-8.077,8.077-8.077,21.172,0,29.249
													 C10.096,509.982,15.39,512,20.683,512c5.293,0,10.586-2.019,14.625-6.059L505.943,35.306
													 C514.019,27.23,514.019,14.135,505.943,6.058z'/>
											 </g>
										 </g>
										 <g>
											 <g>
												 <path d='M505.942,476.694L35.306,6.059c-8.076-8.077-21.172-8.077-29.248,0c-8.077,8.076-8.077,21.171,0,29.248l470.636,470.636
													 c4.038,4.039,9.332,6.058,14.625,6.058c5.293,0,10.587-2.019,14.624-6.057C514.018,497.866,514.018,484.771,505.942,476.694z'/>
											 </g>
										 </g>
									 </svg>
								</div>
								<div 
									onClick={this.handleClickLeft}
									className='left arrow' >
									<Arrow direction='left'/>
								</div>
								<div 
									onClick={this.handleClickRight}
									className='right arrow' >
									<Arrow direction='right'/>
								</div>
								{/*
								<div className='slider' >
									<div className='slider-inner'>
										<div className='left arrow' >
											<Arrow direction='left'/>
										</div>
										<div className='picture'>
											<img src='/static/space.png'/>
										</div>
										<div className='right arrow' >
											<Arrow direction='right'/>
										</div>
									</div>
								</div>
								*/}
							</div>
					}
				</Translation>
		)
	}
}

export default Index
