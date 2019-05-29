//@flow
import THREE		from '../../three.js'
import React		from 'react'
import * as d3		from 'd3'

export default class Rotation extends React.Component<{},{}>{
	componentDidMount(){
		this.refresh()
	}

	componentDidUpdate(){
		this.refresh()
	}

	refresh(){
		const scene		= new THREE.Scene()
		const camera		= new THREE.PerspectiveCamera(
			75,
			window.innerWidth/window.innerHeight,
			0.1,
			1000
		)
		var controls = new THREE.OrbitControls( camera );
		const renderer		= new THREE.WebGLRenderer()
		renderer.setSize( window.innerWidth, window.innerHeight );
		//$FlowFixMe
		document.body.appendChild( renderer.domElement );

		var geometry = new THREE.PlaneGeometry( 5, 20, 32 )
		//geometry.translate(0, 10, 0)
		var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		var cube = new THREE.Mesh( geometry, material );
		var axesHelper = new THREE.AxesHelper( 500 );
		scene.add(axesHelper)

		camera.position.set( 20, 20, 30 );

		cube.translateY(10)
		const group		= new THREE.Group()
		group.add(cube)
		scene.add( group );

		var animate = function () {
			requestAnimationFrame( animate );

			//cube.rotation.y += 0.01;
			group.rotation.x += 0.01;

			controls.update()
			renderer.render( scene, camera );
		};

		animate();
	}

	render(){
		return (
			<div id='container' ></div>
		)
	}
}
