//@flow
import Me		from './Me.js'
import * as d3		from 'd3'
import THREE		from '../three.js'

//jest.mock('../three.js')


describe('?', () => {
	let me
	beforeAll( () => {
//		const THREE		= require('../three.js').default
//		THREE.CSS3DObject.mockImplementation(() => ({
//			rotation		: {
//				copy		: jest.fn(),
//			},
//			translateY		: jest.fn(),
//			position		: {
//				copy		: jest.fn(),
//			},
//		}))
		const domElement		= document.createElement('div')
		const scene		= {
			add		: jest.fn(),
		}
		me		= new Me(
			domElement,
			scene,
		)
	})

	it('before rotate, object3DInner rotation.z is == -90', () => {
		expect(me.object3DInner.rotation.z).toBe(
			-90 * THREE.Math.DEG2RAD, 
		)
	})
//
//	it('rotateX(1), then rotation.x should be 1', () => {
//		me.object3D.rotateX(1)
//		expect(me.object3D.rotation.x).toBe(1)
//	})

	it('dom element opacity should be 0 (before shown, it is invisible)', () => {
		expect(d3.select(me.objectDOM).style('opacity')).toBe('0')
	})

	describe('show()', () => {
		beforeAll(async () => {
			await me.show()
		})

		it('object 3d inner rotation z should be 0', () => {
			expect(me.object3DInner.rotation.z).toBe(
				0
			)
		})
		
		it('dom element opacity should be 1', () => {
			expect(d3.select(me.objectDOM).style('opacity')).toBe('1')
		})
	})
})

describe('?', () => {
	
	it('?', done => {
		function tween(){
			return function(){
				const i		= d3.interpolateNumber(0, 90)
				return function(t){
					console.log('tween:', i(t))
				}
			}
		}
		d3.transition()
			.duration(1000)
			.ease(d3.easeElastic)
			.tween('test', tween())
			.on('end', () => {
				console.log('finished')
				done()
			})
	})
})
