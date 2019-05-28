//@flow
import Sector from './Sector.js'

describe('build a sectors', () => {
	let sectors
	let sector

	beforeAll(() => {
		sectors		= [
			{
				id		: 'a',
				range		: [-30, 30],
				opacity		: 0,
			},{
				id		: 'b',
				range		: [25, 60],
				opacity		: 0,
			}
		]
		sector		= new Sector(sectors)
	})

	describe('range is [-30, 30], [25, 60]', () => {

		beforeAll(() => {
			sectors[0].range		= [-30, 30]
		})

		describe('move to 30 ', () => {
			
			beforeAll(() => {
				sector.move(30)
			})

			it('opacity should be 1', () => {
				expect(sectors[0].opacity).toBeCloseTo(1)
			})

			it('opacity 2 should be 1', () => {
				expect(sectors[1].opacity).toBeCloseTo(1)
			})
		})

		describe('move to 31 ', () => {
			
			beforeAll(() => {
				sector.move(31)
			})

			it('opacity should be 0', () => {
				expect(sectors[0].opacity).toBeCloseTo(0)
			})
		})

		describe('move to 300 ', () => {
			
			beforeAll(() => {
				sector.move(300)
			})

			it('opacity should be 0', () => {
				expect(sectors[0].opacity).toBeCloseTo(0)
			})
		})

		describe('move to 350 ', () => {
			
			beforeAll(() => {
				sector.move(350)
			})

			it('opacity should be 1', () => {
				expect(sectors[0].opacity).toBeCloseTo(1)
			})
		})

	})

})
