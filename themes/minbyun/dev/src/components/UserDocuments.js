import React, {Component, PropTypes} from 'react';
import {withRouter} from 'react-router';
import DocListItem from './DocListItem';
import Pagination from '../accessories/Pagination';
import {_displayDate} from '../accessories/functions';
import update from 'react-addons-update';

class UserDocuments extends Component {
	componentDidMount(){
		this.props.fetchUserDocs(this.props.params.page);
	}
	componentDidUpdate(prevProps){
		if(prevProps.params.page != this.props.params.page){
			this.props.fetchUserDocs(this.props.params.page);
		}
	}
	handleClick(which, arg1st){
		if(which == 'title'){
			let {index} = arg1st;
			this.props.addDocToOpenDocs(this.props.documents[index]);
			this.props.router.push('/document/'+this.props.documents[index].id);
		}
	}
	refineUserDoc(doc){
		const fData = this.props.fData;
		const fProps = fData.fProps;
		const slugs = ['doctype', 'date', 'committee'];
		const propsToMerge = {};
		slugs.forEach((fs) => {if(fProps[fs] && doc[fs]){
			if(fProps[fs].type == 'taxonomy'){
				if(fProps[fs].multiple){
					 let fv = doc[fs].map((t) => {
						let term = fData.terms[t]; if(term) return term.name;
					}).join(', ');
					if(fv) propsToMerge[fs] = fv;
				} else {
					let term = fData.terms[doc[fs]];
					if(term) propsToMerge[fs] = term.name;
				}
			}
			else if(fProps[fs].type == 'date' && fProps[fs].form == 'Ym'){
				if(!fProps[fs].multiple){
					propsToMerge[fs] = _displayDate(doc[fs]);
				} else {
					propsToMerge[fs] = doc[fs].map((d) => _displayDate(d));
				}
			}
		}});
		return update(doc, {$merge: propsToMerge});
	}
	render(){
		const documents =  this.props.documents.map((doc) => this.refineUserDoc(doc));
		const page = parseInt(this.props.params.page ? this.props.params.page : 1);
		const documentList = documents.map((doc, index) => (
			<DocListItem key={doc.id} document={doc} fData={this.props.fData} role={this.props.role}
				onClickTitle={this.handleClick.bind(this, 'title', {index})} showMessage={this.props.showMessage}
			/>
		));
		return (
			<div className="userdocs">
				<div className="userdocs__doclist">
					{documentList}
				</div>
				<Pagination url="/user/documents/page/" page={page} lastPage={this.props.lastPage} />
			</div>
		);
	}
}
UserDocuments.propTypes = {
	role: PropTypes.arrayOf(PropTypes.string).isRequired,
	fData: PropTypes.object.isRequired,
	documents: PropTypes.arrayOf(PropTypes.object).isRequired,
	lastPage: PropTypes.number.isRequired,
	fetchUserDocs: PropTypes.func.isRequired,
	addDocToOpenDocs: PropTypes.func.isRequired,
	showMessage: PropTypes.func.isRequired,
	router: PropTypes.shape({
		push: PropTypes.func.isRequired,
		goBack: PropTypes.func.isRequired
	}).isRequired
};

export default withRouter(UserDocuments);
