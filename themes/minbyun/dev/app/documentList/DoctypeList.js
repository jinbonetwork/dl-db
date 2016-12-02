import React, {Component, PropTypes} from 'react';

class DoctypeList extends Component {
	doctypeOptions(){
		let options = {};
		this.props.docData.taxonomy.doctype.forEach((value) => {
			options[value] = this.props.docData.terms[value];
		});
		return options;
	}
}
DoctypeList.propTypes = {
	docData: PropTypes.object
};

export default DoctypeList;
