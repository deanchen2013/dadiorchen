//@flow
import Box		from './Box.js'

describe('?', () => {
	it('?', () => {
		const images		= ['1', '2', '3', '4']
		const box		= new Box(
			images,
			100,
			50,
		)
		expect(box.group.children).toHaveLength(4)
	})
})
