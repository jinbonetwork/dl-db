import React, {Component} from 'react';
import axios from 'axios';

class TestSomething extends Component {
	componentWillMount(){
		this.setState({
			file1: undefined,
			file2: undefined
		});
	}
	handleSubmit(event){
		event.preventDefault();

		let data = new FormData();
		data.append('document', JSON.stringify({
			name: 'hodoug',
			job: 'coding'
		}));
		data.append('files[]', this.state.file1);
		data.append('files[]', this.state.file2);

		axios.post('/api/__test_upload', data)
		.then(({data}) => {
			console.log(data);
		})
		.catch((error) => {
			console.error(error);
		});
	}
	handleChange(prop, event){
		let file = event.target.files[0];
		this.setState({[prop]: file});
	}
	render(){
		return(
			<form onSubmit={this.handleSubmit.bind(this)}>
				<input type="file" onChange={this.handleChange.bind(this, 'file1')}/>
				<input type="file" onChange={this.handleChange.bind(this, 'file2')}/>
				<button type="submit">Submit</button>
			</form>
		);
	}
}

export default TestSomething;
