import React, {Component, PropTypes} from 'react';
import {withRouter} from 'react-router';
import axios from 'axios';

import DocumentForm from './DocumentForm';

class DigitalLibraryContainer extends Component {
	constructor(){
		super();
		this.state = {
			user: undefined,
			documentFormData: undefined
		};
	}
	fetchData(path, prop){
		axios.get('/api')
		.then((response) => {
			if(response.statusText == 'OK'){
				return response.data;
			} else {
				throw new Error('Server response was not OK');
			}
		})
		.then((data) => {
			if(prop == 'user'){
				this.setState({
					user: data.user,
					role: data.role
				});
			} else {
				this.setState({ [prop]: data });
			}
		})
		.catch((error) => {
			console.error(error);
			this.props.router.push('/error');
		});

	}
	componentDidMount(){
		this.fetchData('/', 'user');
		this.fetchData('/fields', 'documentFormData');
	}
	render(){
		let digitalLibrary = this.props.children && React.cloneElement(this.props.children, {
			user: this.state.user,
			role: this.state.role,
			documentFormData: this.state.documentFormData
		});
		return digitalLibrary;
	}
}
DigitalLibraryContainer.propTypes = {
	router: PropTypes.shape({
		push: PropTypes.func.isRequired
	}).isRequired
};

export default withRouter(DigitalLibraryContainer);
