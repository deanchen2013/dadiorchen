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
log.setDefaultLevel('trace')
log.info('version 0.1')
const isAnimated		= true
const isSlowDown		= false
const isHelperShown		= false
let isUpdating		= true
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
	isLoading		: boolean,
	isMobile		: boolean,
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

		log.info('props of index:', props)
		const language		= props.url.query.ln || 'en'
		this.state		= {
			isLanguageOpened		: false,
			language,
			isLoading		: true,
			isMobile		: false,
		}

		//$FlowFixMe
//		if(process.browser){
//			log.info('change language...')
//			setTimeout(() => {
//				i18n.changeLanguage(
//					language,
//					() => {
//						log.info('change language finished')
//						this.forceUpdate()
//					}
//				)
//			}, 1000)
//		}
	}

	componentDidMount(){
		/*
		 * check mobile
		 */
		const isMobile		= function(){
			var check = false;
			(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
			return check;
		}()
		if(isMobile){
			log.info('this is mobile, disable')
			this.setState({
				isMobile		: true,
			})
		}else{
			/*
			 * check language
			 */
			//$FlowFixMe
			if(/zh/.test(navigator.language || navigator.userLanguage) &&
				this.state.language !== 'zh'
			){
				log.info('not zh')
				if(process.env.NODE_ENV !== 'production'){
					if(/ln=en/.test(window.location.href)){
						log.info('language was set, ignore')
					}else{
						window.location.href		= '?ln=zh'
					}
				}else{
					if(/ln=en/.test(window.location.href)){
						log.info('language was set, ignore')
					}else{
						window.location.href		= '/cn/index.html'
					}
				}
			}
			this.refresh()
		}
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
//			var texture = new THREE.TextureLoader().load('/static/space.png');
//			texture.wrapS = THREE.RepeatWrapping;
//			texture.wrapT = THREE.RepeatWrapping;
//			texture.repeat.set( 1, 1 );
//			scene.background		= texture
			scene.background		= new THREE.Color(0x001e44)
			/*
			 * the panorama sphere
			 */
			var geometry = new THREE.SphereBufferGeometry( 800, 60, 40 );
			// invert the geometry on the x-axis so that all of the faces point inward
			geometry.scale( - 1, 1, 1 );
			var texture = new THREE.TextureLoader().load(
				'/static/pic1small.jpg',
				async () => {
					//{{{
					log.warn('loaded!!!')
					material = new THREE.MeshBasicMaterial( { map: texture } );
					material.transparent		= true
					mesh = new THREE.Mesh( geometry, material );
					scene.add( mesh );
					/*
					 * after small pic was shown, load big pic
					 */
					var textureBig		= new THREE.TextureLoader().load(
						'static/pic2.jpg',
						async () => {
							log.info('big pic loaded')
							material.map		= textureBig
							material.needsUpdate		= true
						}
					)
					//a box
//					const boxGeometry		= new THREE.BoxGeometry(20, 80, 20)
//					const boxMaterial		= new THREE.MeshBasicMaterial({color:'0x0000ff'})
//					boxMesh		= new THREE.Mesh(boxGeometry, boxMaterial)
//					boxMesh.position.x		= 100
//					boxMesh.position.z		= -50
//					boxMesh.position.y		= -20
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
								weight		: 10,
								children		: [
									{
										name		: 'React',
										weight		: 9,
										children		: [
											{
												name		: 'Redux',
												weight		: 3,
											},{
												name		: 'Flow',
												weight		: 4,
											},{
												name		: 'Jest',
												weight		: 8,
												children		: [
													{
														name		: 'Enzyme',
														weight		: 3,
													},{
														name		: 'Storybook',
														weight		: 2,
													}
												],
											},{
												name		: 'Next.js',
												weight		: 3,
											},{
												name		: 'Draft.js',
												weight		: 3,
											}
										],
									},{
										name		: 'D3',
										weight		: 5,
									},{
										name		: 'Three.js',
										weight		: 3,
									},{
										name		: 'Node.js',
										weight		: 6,
										children		: [
											{
												name		: 'Express',
												weight		: 4,
											}
										]
									}
								],
							},{
								name		: 'Java',
								weight		: 8,
								children		: [
									{
										name		: 'spring',
										weight		: 8,
									},{
										name		: 'Lucene',
										weight		: 3,
									},{
										name		: 'Hibernate',
										weight		: 3,
									},
								]
							},{
								name		: 'Git',
								weight		: 4,
								children	: [
									{
										name		: 'Github',
										weight		: 4,
									}
								],
							},{
								name		: i18n.t('Agility', {lng : thisRef.state.language}),
								weight		: 6,
								children		: [
									{
										name		: 'Trello',
										weight		: 2,
									},{
										name		: i18n.t('Pomodoro Technique', {lng : thisRef.state.language}),
										weight		: 4,
									}
								],
							},{
								name		: 'CouchDB',
								weight		: 6,
								children		: [
									{
										name		: 'MySQL',
										weight		: 3,
									},{
										name		: 'Redis',
										weight		: 4,
									},{
										name		: 'MongoDB',
										weight		: 5,
									},{
										name		: 'Oracle',
										weight		: 3,
									}
								],
							},{
								name		: i18n.t('TDD', {lng : thisRef.state.language}),
								weight		: 9,
								children		: [
									{
										name		: i18n.t('Object Oriented Programing', {lng : thisRef.state.language}),
										weight		: 6,
									},
								],
							},{
								name		: 'Linux',
								weight		: 6,
								children		: [
									{
										name		: 'Windows',
										weight		: 3,
									},{
										name		: 'shell programing',
										weight		: 4,
									},{
										name		: 'VIM',
										weight		: 7,
									},{
										name		: 'Nginx',
										weight		: 5,
									}
								]
							},{
								name		: 'AWS',
								weight		: 4,
								children		: [
									{
										name		: 'ec2',
										weight		: 4,
									},{
										name		: 's3',
										weight		: 2,
									},{
										name		: 'Lambda',
										weight		: 2,
									}
								]
							},{
								name		: i18n.t('Chinese', {lng : thisRef.state.language}),
								weight		: 3,
								children		: [
									{
										name		: i18n.t('English', {lng : thisRef.state.language}),
										weight		: 3,
									}
								]
							}
							//}}}
						]
					}
					skillConstellationObject		= new SkillConstellationObject(setting)
					await skillConstellationObject.init()
					sceneDOM.add(skillConstellationObject.groupAllCSS)
					scene.add(skillConstellationObject.groupAllWebGL)
					const awayVector3		= new THREE.Vector3(
						-500,
						50,
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
								log.info('transition into box finished, set isUpdating to false')
								isUpdating		= false
								d3.select('.close-icon')
									.style('opacity', '1')
									.on('click', () => {
										log.info('quit box show, set isUpdating to true')
										isUpdating		= true
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
						isUpdating		= true
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
								.on('end', () => {
									log.info('switch to next image, set isUpdating false')
									isUpdating		= false
								})
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
							thisRef.state.language === 'en' ? 
								'https://www.youtube.com/embed/jBJRAwwcjZY'
								:
								'http://player.youku.com/embed/XNDIyMjYxNTMzNg==',
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
									me.visible(true)
									me.show()
								}
								//$FlowFixMe
								sector.hide		= () => {
									me.visible(false)
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
									skillConstellationObject.visible(true)
									skillConstellationObject.explode()
								}
								//$FlowFixMe
								sector.hide		= () => {
									skillConstellationObject.visible(false)
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
									box.visible(true)
									box.explode()
								}
								//$FlowFixMe
								sector.hide		= () => {
									box.visible(false)
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
						//log.debug('lon:', lon)
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
					if(isAnimated){
						animate();
					}else{
						setTimeout(() => {
							requestAnimationFrame(update)
						}, 500)
					}
					thisRef.setState({
						isLoading		: false
					})
					//}}}

				}
			);
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
			if(isUpdating){
				if(isSlowDown){
					setTimeout(() => {
						requestAnimationFrame( animate );
					}, 1000)
				}else{
					requestAnimationFrame( animate );
				}
			}else{
				/*
				 * jump update
				 */
				setTimeout(() => {
					log.debug('jump animate')
					animate()
				}, 500)
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
				phi = THREE.Math.degToRad( 90 - lat );
				theta = THREE.Math.degToRad( lon );
				camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
				camera.target.y = 500 * Math.cos( phi );
				camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );
				camera.lookAt( camera.target );
				if(!isShown){
					isShown		= true
				}
				//me.object3D.rotateOnAxis(new THREE.Vector3(1, 0, 0), 0.1)
				/*
				 * skill
				 */
				if(skillConstellationObject.groupAllWebGL.visible === true){
					skillConstellationObject.groupAllWebGL.rotation.y		+= 0.01
					skillConstellationObject.groupAllCSS.rotation.y		+= 0.01
					skillConstellationObject.update()
				}
				/*
				 * box
				 */
				if(box.group.visible === true){
					box.autoRotate()
				}
			}else{
				if(controls){
					controls.update()
				}
			}

			if(skillConstellationObject.groupAllWebGL.visible === true){
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
			}
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
		log.info('change language')
		e.stopPropagation()
		e.preventDefault()
		if(process.env.NODE_ENV !== 'production'){
			window.location.href		= '?ln=' + e.target.value
		}else{
			if(e.target.value === 'zh'){
				window.location.href		= '/cn/index.html'
			}else{
				window.location.href		= '/?ln=en'
			}
		}
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
							<div>
								{this.state.isMobile &&
									<div className='mobile'>
										Mobile devices are not yet supported.
									</div>
								}
								{this.state.isLoading && !this.state.isMobile &&
									<div className="loading">
										<div className="spinner-wrapper">
											<span className="spinner-text">LOADING...</span>
											<span className="spinner"></span>
										</div>
									</div>
								}
								<div
									className='all'
									style={{
										userSelect		: 'none',
										display		: this.state.isLoading ? 'none': 'block',
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
									<div id='container' />
									<div id='containerDOM' />
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
												<a target='_blank' href='https://facebook.com/dadiorchen'>
													<Facebook/>
												</a>
											</div>
																				</div>
									</div>
									<div className='sector' id='sectorA' >
										<p 
											style={{
												width		: 330,
											}}
											className='h1 bottom-right' >{t('slogon', {lng : this.state.language}).split(' ').map(c => <span>{c}</span>)}</p>
										<div className='tip' >
												<div>
													<span>{t('tip', {lng : this.state.language})}</span><span><Mouse/></span>
												</div>
										</div>
										<div className='footer' >
											{t('tip4picture', {lng : this.state.language})}
											<a target='_blank' href='https://www.google.com/maps/@9.7337335,124.1204287,3a,75y,214.8h,92.33t/data=!3m6!1e1!3m4!1sLak1KJmVZNJBrgcMNpIzIg!2e0!7i13312!8i6656'>
												<Location/>
											</a>
										</div>
									</div>
									<div className='sector' id='sectorB' >
										<p 
											style={{
												width		: 400,
											}}
											className='h1 top-left' >
											{t('intro', {lng : this.state.language}).split(' ').map(c => <span>{c}</span>)}
										</p>
									</div>
									<div className='sector' id='sectorC' >
										<div className='center' >
										<p 
											onClick={this.handleClickSkill}
											className='h1 bottom' >
											{t('skill', {lng : this.state.language}).split(' ').map(c => <span>{c}</span>)}
											<a className='button' >
												{t('skill.button', {lng : this.state.language}).split(' ').map(c => <span>{c}</span>)}
											</a>
										</p>
										</div>
										<div className='footer' >
											{t('tip4skill', {lng : this.state.language})}
											<a target='_blank' href='https://github.com/dadiorchen/constellation-3d'>
												Github
											</a>
										</div>
									</div>
									<div className='sector' id='sectorD' >
										<div className='center' >
											<p 
												className='h1 bottom' >
												{t('work', {lng : this.state.language}).split(' ').map(c => <span>{c}</span>)}
												<a
													className='link'
													target='_blank'
													href='https://www.midinote.me'
												>
													{t('work.link', {lng : this.state.language})}
												</a>
												<a 
													onClick={this.handleBoxClick}
													className='button' 
												>
												{t('skill.button', {lng : this.state.language}).split(' ').map(c => <span>{c}</span>)}
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
							</div>
					}
				</Translation>
		)
	}
}

export default Index
