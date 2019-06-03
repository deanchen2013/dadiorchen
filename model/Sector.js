//@flow
/*
 * The model for display the HTML content in different part of the panorama 
 */
const log		= require('loglevel')

export default class Sector {
	sectors		: any

	constructor(sectors		: any){
		this.sectors		= sectors
	}

	move(angle : number){
		//mod the angle
		angle		= angle % 360
		/*
		 * reverse to positive
		 */
		if(angle < 0){
			angle		= 360 + angle
		}
		//log.debug('angle:', angle)
		this.sectors.forEach(sector => {
			const inRanges		= []
			if(sector.range[0] < 0){
				inRanges.push([0, sector.range[1]])
				inRanges.push([360 + sector.range[0],360])
			}else{
				inRanges.push([sector.range[0], sector.range[1]])
			}
			//console.log('inRanges:', inRanges)
			let isIn		= false
			for(let inRange of inRanges){
				//$FlowFixMe
				if(angle >= inRange[0] && angle <= inRange[1]){
					isIn		= true
				}
			}
			if(isIn === false && sector.isShown === true){
				sector.hide()
			}else if(isIn === true && sector.isShown === false){
				sector.show()
			}
			sector.isShown		= isIn
		})
		//console.log('sectors:', this.sectors)
	}
}
