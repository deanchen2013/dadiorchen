//@flow
import React		from 'react'
import SkillConstellation		from '../../model/SkillConstellation.js'
import {layout, build}		from '../../model/layout.js'
import THREE		from '../../three.js'

class Index extends React.Component<{},{}>{
	skillConstellation		: any

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
		this.skillConstellation		= new SkillConstellation({
			container		: document.getElementById('container'),
			isAnimated		: true,
			backgroundPicture		: '/static/space.png',
			lineColor		: 0xffffff,
			lineDistance		: 100,
			textType		: 'CSS',
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
				}
				//}}}
			]
		})
		this.skillConstellation.init()
			.then(() => {
				this.skillConstellation.animate()
			})
	}

	render(){
		return (
			<div id='container' >
				<style global jsx>{`
						body {
							margin		: 0;
						}
						.dot {
							width		: 2px;
							height		: 2px;
							background		: red;
							border-radius		: 50%;
						}
						.text		{
							color		: white;
							background		: black;
							opacity		: 0.5;
						}
					  `}
				</style>
				<div id='container' />
				<div id='test' />
			</div>
		)
	}
}

export default Index
