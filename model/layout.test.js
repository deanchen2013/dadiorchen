//@flow
import {layout, build}		from './layout.js'

describe('?', () => {
	it('?', () => {
		const nodes		= [
			{
				index		: 0,
				name		: 'a',
			},{
				index		: 1,
				name		: 'b',
			},{
				index		: 2,
				name		: 'c',
			}
		]
		const links		= [
			{
				source		: 0,
				target		: 1,
				index		: 0
			}
		]
		layout(nodes, links, false, 30)
		console.log('nodes:', nodes)
		console.log('links:', links)
	})

})

describe('build data', () => {
	it('build data', () => {
		const data		= [
			{
				name		: 'a',
				children		: [
					{
						name		: 'b',
					}
				],
			},{
				name		: 'c',
			}
		]
		const {nodes, links}		= build(data)
		console.log('nodes:', nodes)
		console.log('links:', links)
	})
})
