//@flow
/*
 * the box to show pic/video of my product
 * for Youtube
 *<iframe width="560" height="315" src="https://www.youtube.com/embed/jBJRAwwcjZY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
 */
import THREE		from '../three.js'
import * as d3		from 'd3'

const log		= require('loglevel')
log.setLevel('debug')

export default class Box {
	group		: any
	isOpened		: boolean
	delayLoad		: Function

	constructor(
		imageURLs		: Array<any>,
		width		: number,
		height		: number,
		onClick		: Function,
	){
		if(imageURLs.length !== 4) throw new Error('must give 4 images')
		this.group		= new THREE.Group()
		this.group.visible		= false
		//hide
		this.group.scale.set(0, 0, 0)
		let domElement
		for(let i = 0; i < imageURLs.length; i++){
			const url		= imageURLs[i]
			if(/^https?:\/\/www.youtube.com.*$/.test(url)){
				log.info('mount a video')
				domElement = document.createElement( 'div' );
				d3.select(domElement)
					.classed('box-side', true)
					.style('width', width + 'px')
					.style('height', height + 'px')
					.style('background-color', '#000')
					.attr('draggable', 'false')
					.on('click', () => {
						onClick && onClick(i)
					})
//				var iframe = document.createElement( 'iframe' );
//				iframe.style.width = width + 'px';
//				iframe.style.height = height	+ 'px';
//				iframe.style.border = '0px';
//				iframe.src = url
//				domElement.appendChild( iframe );
				this.delayLoad		= () => {
					domElement.innerHTML		= `<iframe width="${width}px" height="${height}px" src="${url}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
				}
			}else if(/^https?:\/\/player.youku.com.*$/.test(url)){
				log.info('mount a video')
				domElement = document.createElement( 'div' );
				d3.select(domElement)
					.classed('box-side', true)
					.style('width', width + 'px')
					.style('height', height + 'px')
					.style('background-color', '#000')
					.attr('draggable', 'false')
					.on('click', () => {
						onClick && onClick(i)
					})
//				var iframe = document.createElement( 'iframe' );
//				iframe.style.width = width + 'px';
//				iframe.style.height = height	+ 'px';
//				iframe.style.border = '0px';
//				iframe.src = url
//				domElement.appendChild( iframe );
				this.delayLoad		= () => {
					//youku need a delay
						setTimeout(() => {
						domElement.innerHTML		= `<iframe height=${height} width=${width} src='${url}' frameborder=0 'allowfullscreen'></iframe>`
					}, 5000)
				}
			}else{
				domElement		= document.createElement('img')
				d3.select(domElement)
					.classed('box-side', true)
					.style('width', width + 'px')
					.style('height', height + 'px')
					.style('background-color', '#000')
					.attr('src', url)
					.attr('draggable', 'false')
					.on('click', () => {
						onClick && onClick(i)
					})
				log.debug('create image element:', domElement)
			}
			const object		= new THREE.CSS3DObject(domElement)
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
					log.info('explode box over, load video')
					this.delayLoad()
				})
		}
	}

	autoRotate(){
		if(this.isOpened){
			this.group.rotation.y		-= 0.01
		}
	}

	hide(){
		d3.selectAll('.box-side').style('opacity', '0')
	}

	unHide(){
		d3.selectAll('.box-side').style('opacity', '1')
	}

	visible(visible	: boolean){
		this.group.visible		= visible
		d3.selectAll('.box-side').style('display', visible? 'block':'none')
	}
}

