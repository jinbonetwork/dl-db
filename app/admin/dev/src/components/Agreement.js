import React, {Component, PropTypes} from 'react';
import RichTextEditor from 'react-rte';

class Agreement extends Component {
	componentDidMount(){
		if(!this.props.openAgreement){
			this.props.fetchAgreement(() => {
				this.props.onChange(this.props.openAgreement);
			});
		} else {
			this.props.onChange(this.props.openAgreement);
		}
	}
	handleClick(which){
		if(which == 'submit'){
			let formData = new FormData();
			formData.append('content', this.props.agreement.toString('html'));
			this.props.onSubmit(this.props.agreement, formData);
		}
	}
	render(){
		const toolbarConfig = {
			display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'HISTORY_BUTTONS'],
			INLINE_STYLE_BUTTONS: [
				{label: 'Bold', style: 'BOLD'}
			],
			BLOCK_TYPE_BUTTONS: [
				{label: 'Normal', style: 'unstyled'},
				{label: 'H1', style: 'header-one'},
				{label: 'H2', style: 'header-two'},
				{label: 'H3', style: 'header-three'},
				{label: 'UL', style: 'unordered-list-item'},
				{label: 'OL', style: 'ordered-list-item'}
			]
		};
		const submitButton = (!this.props.isSaving ?
			<a className="agreement__submit" onClick={this.handleClick.bind(this, 'submit')}>수정</a> :
			<span className="agreement__saving"><span>저장중</span><i className="pe-7f-config pe-va pe-spin"></i></span>
		);
		return (
			<div className="agreement">
				<div className="agreement__header">
					<span className="agreement__title">이용약관</span>
					{submitButton}
				</div>
				<RichTextEditor className="agreement__editor"
					toolbarConfig={toolbarConfig}
					value={this.props.agreement}
					onChange={this.props.onChange}
				/>
			</div>
		);
	}
}
Agreement.propTypes = {
	openAgreement: PropTypes.object,
	agreement: PropTypes.object.isRequired,
	isSaving: PropTypes.bool,
	fetchAgreement: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired
};

export default Agreement;
