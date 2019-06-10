//@flow
/*
 * Me model
 */
import THREE		from '../three.js'
import * as d3		from 'd3'

export default class Me{
	object3D		: any
	//put in object3D, this is for show up rotation, because if I use object3D
	//to show animation of show up, then, if I translate something else, it will
	//affect the animation
	object3DInner		: any
	objectDOM		: any
	isShown		: boolean

	constructor(
		domElement		: any,
		scene		: any,
	){
		this.isShown		= false
		this.objectDOM		= domElement
		//hide it
		d3.select(this.objectDOM).style('opacity', '0')
		//me
		const object = new THREE.CSS3DObject(domElement);
		//this.object3D.translateY(200)
		//this.object3D		= object
		object.translateY(350/2)
		this.object3DInner		= new THREE.Group()
		this.object3DInner.add(object)
		//this.object3DInner.rotation.y		= -90 * THREE.Math.DEG2RAD, 
		this.object3DInner.rotation.x		= -90 * THREE.Math.DEG2RAD, 
		this.object3D		= new THREE.Group()
		this.object3D.add(this.object3DInner)
		this.object3D.visible		= false
		scene.add( this.object3D );
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

	hide(){
		d3.select(this.objectDOM).style('opacity', '0')
	}

	unHide(){
		d3.select(this.objectDOM).style('opacity', '1')
	}

	visible(visible	: boolean){
		this.object3D.visible		= visible
		d3.select(this.objectDOM).style('display', visible? 'block':'none')
	}
}
