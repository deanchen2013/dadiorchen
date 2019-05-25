//@flow
import React		from 'react'
import SkillConstellation		from '../../model/SkillConstellation.js'
import {layout, build}		from '../../model/layout.js'
import THREE		from '../../three.js'

class Index extends React.Component<{},{}>{
	skillConstellation		: any
	setting		: any
	gui		: any

	constructor(props : any){
		super(props)
		//$FlowFixMe
		this.init		= this.init.bind(this)
		//$FlowFixMe
		this.refresh		= this.refresh.bind(this)
	}

	componentDidMount(){
		this.init()
	}

	componentDidUpdate(){
		this.init()
	}

	init(){
		this.setting		= {
			container		: document.getElementById('container'),
			isAnimated		: true,
			backgroundPicture		: '/static/space.png',
			lineColor		: 0xffffff,
			lineDistance		: 100,
			textType		: 'THREE',
			width		: window.innerWidth,
			height		: window.innerHeight,
			cameraType		: 'perspective',
			cameraPerspectivePositionX		: 300,
			cameraPerspectivePositionY		: 0,
			cameraPerspectivePositionZ		: 0,
			cameraPerspectiveAngleX		: 0,
			cameraPerspectiveAngleY		: -90,
			cameraPerspectiveAngleZ		: 0,
			cameraObitPositionX		: 0,
			cameraObitPositionY		: 0,
			cameraObitPositionZ		: 200,
			cameraObitFrustmSize		: 600,
			strengthPushAllAway		: -657,
			strengthPullToX		: 0.1,
			strengthPullToY		: 0.1,
			strengthPullToZ		: 0.1,
			strengthToBounceOtherAway		: 0.78,
			textCSS		: (node) => {
				return (
					<div
						style={{
							color		: 'yellow',
							fontSize		: 32 * (node.weight/10) + 'px'
						}}
					>
						{node.name}
					</div>
				)
			},
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
		this.gui.add(this.setting, 'cameraPerspectivePositionX', 0, 500).onFinishChange(this.refresh)
		this.gui.add(this.setting, 'cameraPerspectivePositionY', 0, 500).onFinishChange(this.refresh)
		this.gui.add(this.setting, 'cameraPerspectivePositionZ', 0, 500).onFinishChange(this.refresh)
		this.gui.add(this.setting, 'cameraPerspectiveAngleX', -90, 90).onFinishChange(this.refresh)
		this.gui.add(this.setting, 'cameraPerspectiveAngleY', -90, 90).onFinishChange(this.refresh)
		this.gui.add(this.setting, 'cameraPerspectiveAngleZ', -90, 90).onFinishChange(this.refresh)
		this.gui.add(this.setting, 'cameraObitPositionX', -500, 500).onFinishChange(this.refresh)
		this.gui.add(this.setting, 'cameraObitPositionY', -500, 500).onFinishChange(this.refresh)
		this.gui.add(this.setting, 'cameraObitPositionZ', -500, 500).onFinishChange(this.refresh)
		this.gui.add(this.setting, 'cameraObitFrustmSize', 0, 1000).onFinishChange(this.refresh)
		this.gui.add(this.setting, 'strengthPushAllAway', -1000, 1000).onFinishChange(this.refresh)
		this.gui.add(this.setting, 'strengthPullToX', 0, 1).onFinishChange(this.refresh)
		this.gui.add(this.setting, 'strengthPullToY', 0, 1).onFinishChange(this.refresh)
		this.gui.add(this.setting, 'strengthPullToZ', 0, 1).onFinishChange(this.refresh)
		this.gui.add(this.setting, 'strengthToBounceOtherAway', 0, 1).onFinishChange(this.refresh)
		this.gui.addColor(this.setting, 'lineColor').onFinishChange(this.refresh)
		this.gui.add(this.setting, 'lineDistance', 1, 500).onFinishChange(this.refresh)

	}

	componentWillUnmount(){
		if(this.gui){
			console.log('destroy...')
			this.gui.destroy()
		}
	}

	refresh(){
		console.log('refresh..., setting:', this.setting)
		//remove old ones
		////$FlowFixMe
		document.getElementById('container').innerHTML		= ''
		this.skillConstellation		= new SkillConstellation(this.setting)
		this.skillConstellation.init()
			.then(() => {
				this.skillConstellation.animate()
			})
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
			</div>
		)
	}
}

export default Index
