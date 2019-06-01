//@flow
import SkillConstellationObject		from './SkillConstellationObject.js'
import React		from 'react'

describe('?', () => {
	beforeAll(async () => {
		const elementDOM		= document.createElement('div')
		const setting		= {
			container		: elementDOM,
			textType		: 'CSS',
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
			data		: [
				{
					name		: 'Javascript',
					weight		: 8,
				}
			]
		}
		const skillConstellationObject		= new SkillConstellationObject(setting)
		await skillConstellationObject.init()
	})

	it('?', () => {
	})
})
