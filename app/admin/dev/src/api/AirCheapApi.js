import 'whatwg-fetch';

let AirCheapAPI = {
	fetchAirports() {
		return fetch('https://aircheapapi.pro-react.com/airports')
		.then((response) => response.json());
	},
};

export default AirCheapAPI;
