//@flow
import SkillConstellation from './SkillConstellation.js'
import React		from 'react'
import THREE		from '../three.js'

/*
 * to mock three.js to let it run on Node/Jest env
 */
THREE.WebGLRenderer		= () => ({
	setPixelRatio		: jest.fn(),
	setSize		: jest.fn(),
	domElement		: document.createElement('div'),
	render		: jest.fn(),
})

describe('?', () => {
	it('?', () => {
		/*
		 * A fake DOM element
		 */
		const elementDOM		= document.createElement('div')
		/*
		 * create
		 */
		const skillConstellation		= new SkillConstellation({
			container		: elementDOM,
			textCSS		: (text) => {
				return (
					<div
						style={{
							color		: 'red',
						}}
					>
						{text}
					</div>
				)
			},
		})
		/*
		 * to render the first tick
		 */
		skillConstellation.render()
		/*
		 * after render, the nodes should have been placed somewhere in the 3D
		 * space
		 */
		//console.log(skillConstellation.nodes)
		expect(skillConstellation.nodes[0].object).toBeDefined()
	})
})

