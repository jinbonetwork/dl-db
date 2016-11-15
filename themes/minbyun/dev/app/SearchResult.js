import React, {Component, PropTypes} from 'react';
import axios from 'axios';
import ResultItem from './searchResult/ResultItem';
import func from './functions';

const _propMap = {
	id: 'id',
	subject: 'title',
	f1: 'doctype',
	content: 'content',
	f10: 'date',
	f8: 'commitee',
	f4: 'number',
	f13: 'author'
}
const _tidOfdocTypeCase = 1;

class SearchResult extends Component {
	constructor(){
		super();
		this.state = {items: []};
	}
	componentDidMount(){
		axios.get(this.props.apiUrl+'/document')
		.then((response) => {
			if(response.statusText == 'OK'){
				if(response.data.error == 0){
					this.setDocumets(response.data.documents);
				} else {
					console.error(response.data.message);
				}
			} else {
				console.error('Server response was not OK');
			}
		});
	}
	setDocumets(documents){
		this.setState({items: documents.map((doc) => {
			let item = {}, isDocTypeCase = false, prop;
			for(let p in _propMap){
				prop = _propMap[p];
				if(!func.isEmpty(doc[p])){
					switch(prop){
						case 'doctype': case 'commitee':
							for(let tid in doc[p]){
								item[prop] = doc[p][tid].name;
								if(tid == _tidOfdocTypeCase) isDocTypeCase = true;
							}
							break;
						case 'date':
							item[prop] = func.displayDate(doc[p]);
							break;
						default:
							item[prop] = doc[p];
					}
				}
			}
			if(item.number && isDocTypeCase === false) delete item.number;
			return item;
		})});
	}
	render(){
		console.log(this.props.location.query);
		let userRole = (this.props.userData ? this.props.userData.role : null);
		let items = this.state.items.map((item, index) => (
			<div key={index} className="search-result__item">
				<div className="search-result__number"><span>{index+1}</span></div>
				<ResultItem item={item} userRole={userRole} apiUrl={this.props.apiUrl} />
			</div>
		));
		return (
			<div className="search-result">
				{items}
			</div>
		);
	}
}
SearchResult.propTypes = {
	userData: PropTypes.object,
	apiUrl: PropTypes.string
};

export default SearchResult;
