import React, {Component, PropTypes} from 'react';

class ImageWrap extends Component {
	componentWillMount(){
		let display = this.props.paths.map((p, i) => {
			if(i != 0) return 'none';
		});
		this.setState({
			display: display
		});
	}
	render(){
		let images = this.props.paths.map((p, i) => (
			<img key={i} style={{display: this.state.display[i]}} src={p} />
		));
		return (
			<div className="imagewrap">
				{images}
			</div>
		);
	}
}
ImageWrap.propTypes = {
	paths: PropTypes.array.isRequired
}

export default ImageWrap;
