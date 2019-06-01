//@flow
/*
 * the box to show pic/video of my product
 */
import THREE		from '../three.js'
import * as d3		from 'd3'

const log		= require('loglevel')
log.setLevel('debug')

export default class Box {
	group		: any
	isOpened		: boolean

	constructor(
		imageURLs		: Array<any>,
		width		: number,
		height		: number,
		onClick		: Function,
	){
		if(imageURLs.length !== 4) throw new Error('must give 4 images')
		this.group		= new THREE.Group()
		//hide
		this.group.scale.set(0, 0, 0)
		for(let i = 0; i < imageURLs.length; i++){
			const url		= imageURLs[i]
			const image		= document.createElement('img')
			d3.select(image)
				.classed('box-side', true)
				.style('width', width + 'px')
				.style('height', height + 'px')
				.style('background-color', '#000')
				.attr('src', url)
				.attr('draggable', 'false')
				.on('click', () => {
					onClick && onClick(i)
				})
			log.debug('create image element:', image)
			const object		= new THREE.CSS3DObject(image)
			let x, y, z, ry
			switch(i){
				case 0:{
					x		= 0
					y		= 0
					z		= width /2
					ry		= 0
					break
				}
				case 1:{
					x		= width / 2
					y		= 0
					z		= 0
					ry		= Math.PI / 2
					break
				}
				case 2:{
					x		= 0
					y		= 0
					z		= -width / 2
					ry		= Math.PI 
					break
				}
				case 3:{
					x		= - width / 2
					y		= 0
					z		= 0
					ry		= -Math.PI / 2
				}
			}
			object.position.set(
				x,
				y,
				z
			)
			object.rotation.y		= ry
			this.group.add(object)
		}
		this.isOpened		= false
	}

	explode(){
		if(!this.isOpened){
			this.isOpened		= true
			const thisRef		= this
			function tween(){
				return function(){
					const scale		= d3.interpolateNumber(0, 1)
					return function(t){
						thisRef.group.scale.set(
							scale(t),
							scale(t),
							scale(t),
						)
					}
				}
			}
			d3.transition()
				.duration(800)
				.ease(d3.easeElastic)
				.tween('explodeBox', tween())
				.on('end', () => {
				})
		}
	}

	autoRotate(){
		if(this.isOpened){
			this.group.rotation.y		+= 0.01
		}
	}
}

