//@flow
import React		from 'react'
import THREE		from '../../three.js'
import * as d3		from 'd3'
import Box		from '../../model/Box.js'


class Index extends React.Component<{},{}>{

	constructor(props : any){
		super(props)
		//$FlowFixMe
		this.init		= this.init.bind(this)
	}

	componentDidMount(){
		this.init()
	}

	componentDidUpdate(){
		this.init()
	}

	init(){
		var camera, scene, renderer;
		var controls;
		var container = document.getElementById( 'container' );
		camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 5000 );
		camera.position.set( 500, 350, 750 );
		scene = new THREE.Scene();
		renderer = new THREE.CSS3DRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );
		const box		= new Box(
			new Array(4).fill('/static/bg.jpg'), 
			200,
			100
		)
		scene.add(box.group)
		/*
		 * help
		 */
		const helper		= new THREE.AxesHelper(500)
		scene.add(helper)
		/*
		 * controls
		 */
		//$FlowFixMe
		container.appendChild( renderer.domElement );
		controls		= new THREE.OrbitControls(camera)
		setTimeout(() => {
			box.explode()
		}, 2000)
		/*
		 * animate
		 */
		function animate() {
			requestAnimationFrame( animate );
			controls.update();
			renderer.render( scene, camera );
		}
		/*
		 * run
		 */
		animate()
	}

	componentWillUnmount(){
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
