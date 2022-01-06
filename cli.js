
const _ = require('lodash');
const axios = require("axios");
const prompt = require('prompt');

console.log("If name is enterd, the search will be by name, otherwise by code");
prompt.start();
searchCountries();


async function searchCountries() {
	while(true) {
		const {name,code} = await prompt.get(['name','code']);
		console.log("searching for:", name,code);

		if (!name  && !code) break;
		if (name) await findCountries('name',name);
		if (code) await findCountries('code',code);
	}
}

const serviceroot = 'https://restcountries.com/v3.1';

async function findCountries(pname, pvalue) {
	let nameOrAlpha = pname == "code" ? "alpha" : pname; //pname is either 'name' or 'alpha'
	try {
		const response = await axios.get(`${serviceroot}/${nameOrAlpha}/${pvalue}?fields=name,capital`);
		//console.log(response.data);
		let data = response.data;

		if (!_.isArray(data)) data = [data];		// for 'name' data is an array, otjherwise it is a single object.  make it an array for consistency

		_.each(data, c => {
			console.log(`Search by ${pname}:'${pvalue}' - Official Name:${c.name.official},    Capital:${c.capital.join(',')}`);
		});

		return data;

	} catch (error) {
		console.error(error.response?.data);
		return undefined;
	}
}

module.exports = findCountries;

