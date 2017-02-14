import React, {Component, PropTypes} from 'react';
import {withRouter} from 'react-router';
import View from '../accessories/docManager/View';
import {Link} from 'react-router';

class Document extends Component {
	componentDidMount(){
		if(!this.props.openDocs[this.props.params.id]){
			this.props.fetchDoc(this.props.params.id);
		}
	}
	customize(){ return {/*
		renderValueBySlug: {
			something: (slug, value) => {}
		},
		renderValueByType: {
			something: (slug, value) => {}
		},
		checkHiddenBySlug: {
			something: (slug, value) => {}
		}
		*/
	}}
	getDoc(){
		return (this.props.openDocs[this.props.params.id] ?
			this.props.openDocs[this.props.params.id] : this.props.fData.empty
		);
	}
	render(){
		const document = this.getDoc();
		return (
			<div className="document">
				<View doc={document} fieldData={this.props.fData} />
			</div>
		);

	}
}
Document.propTypes = {
	fData: PropTypes.object.isRequired,
	openDocs: PropTypes.object.isRequired,
	window: PropTypes.object.isRequired,
	router: PropTypes.shape({
		push: PropTypes.func.isRequired
	}).isRequired
};
export default withRouter(Document);
