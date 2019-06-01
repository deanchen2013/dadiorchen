//@flow
import React		from 'react'



const Arrow		= (props:any) => {
	const transform		= props.direction === 'left' ? 'rotateY(180deg)':''
	console.warn('props:', props, 'transform:', transform)
	return (
			<div
					style={{
						transform,
					}}
			>
				<svg 
					version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' x='0px' y='0px'
					 width='306px' height='306px' viewBox='0 0 306 306' style={{enableBackground:'new 0 0 306 306',}} xmlSpace='preserve'>
				<g>
					<g id='chevron-right'>
						<polygon points='94.35,0 58.65,35.7 175.95,153 58.65,270.3 94.35,306 247.35,153 		'/>
					</g>
				</g>
				</svg>
		</div>
	)
}

export default Arrow
