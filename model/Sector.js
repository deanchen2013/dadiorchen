//@flow
/*
 * The model for display the HTML content in different part of the panorama 
 */

export default class Sector {
	sectors		: any

	constructor(sectors		: any){
		this.sectors		= sectors
	}

	move(angle : number){
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
			if(isIn){
				sector.opacity		= 1
			}else{
				sector.opacity		= 0
			}
		})
		//console.log('sectors:', this.sectors)
	}
}
