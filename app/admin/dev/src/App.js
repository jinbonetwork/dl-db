import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';
import aircheapStore from './store/aircheapStore';
import Select from 'react-select';
import AirportActionCreators from './actions/AirportActionCreators';
import './style/style.css';

class App extends Component {
	componentDidMount(){
		this.props.fetchAirports();
	}
	render() {
		return (
			<div>
				<header>
					<div className="header-brand">
						<img src="logo.png" height="35"/>
						<p>Check discount ticket prices and pay using your AirCheap points</p>
					</div>
					<div className="header-route">
						<Select
							name="origin" value={this.props.origin} options={this.props.airports} onChange={this.props.onChooseAirport.bind(this,'origin')}
						/>
						<Select
							name="destination" value={this.props.destination} options={this.props.airports} onChange={this.props.onChooseAirport.bind(this,'destination')}
						/>
					</div>
				</header>
			</div>
		);
	}
}
App.propTypes = {
	airports: PropTypes.array.isRequired, origin: PropTypes.string, destination: PropTypes.string, fetchAirports: PropTypes.func.isRequired, onChooseAirport: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => (
	{
		airports: state.airports.map(airport => ({ value: airport.code, label: `${airport.city} - ${airport.country} (${airport.code})`})),
		origin: state.route.origin,
		destination: state.route.destination,
	}
);
const mapDispatchToProps = (dispatch) => (
	{
		fetchAirports: () => dispatch(AirportActionCreators.fetchAirports()),
		onChooseAirport: (target, airport) => dispatch( AirportActionCreators.chooseAirport(target, airport)),
	}
);
const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

render(
	<Provider store={aircheapStore}>
		<AppContainer />
	</Provider>,
	document.getElementById('root')
);
