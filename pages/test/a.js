import ReactDOM		from 'react-dom'

export default class Index extends React.Component{

	componentDidMount(){
		const elementReact		= <div>OOKK</div>
		ReactDOM.render(elementReact, document.getElementById('x'),
			() => {
				console.warn(
					'xxxx:',
					document.getElementById('x').innerHTML
				)
			}
		)
		console.warn(
			'here:',
			document.getElementById('x').innerHTML
		)
		setTimeout(() => {
		console.warn(
			'here:',
			document.getElementById('x').innerHTML
		)
		}, 1000)
	}

	render(){
		return (
			<div>OK
				<div id='x' >
				</div>
			</div>
		)
	}
}
