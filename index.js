const serviceroot = 'https://restcountries.com/v3.1';

const NUMBER_OF_TESTS = 5;   // random postitive tests 

window.pending_count=0;

$(document).ready(async function () {

	//set up click handlers
	$("#searchByName").on("click", () => {
		$("#output").text('');
		searchBy('name', $("#countryName").val());
	});

	$("#searchByCode").on("click", () => {
		$("#output").text('');
		searchBy('code', $("#countryCode").val());
	});

	$("#positiveRandom").on("click", async () => {
		$(".loading").show();
		await positiveRandomTests();
		$(".loading").hide();
	});

	$("#positiveComplete").on("click", async () => {
		$(".loading").show();
		await positiveCompleteTests();
	});

	$("#negative").on("click", async () => {
		$(".loading").show();
		await negativeTests();
		$(".loading").hide();
	});

	//preload entire data set for random generation of positive testing ONLY
	$.ajax({
		url: `${serviceroot}/all?fields=name,capital,cca2,cca3,ccn3,cioc`,
		success: function (data, status) {
			console.log(status, data);
			window.countries = data;
		}
	}).catch(error => {
		console.error("getdata error", error);
		$("#output").append('Failed to load all countries');
	});
});

async function searchBy(pname,pvalue) {		
	let nameOrAlpha = pname == "code" ? "alpha" : pname; //pname is either 'name' or 'alpha'

	pending_count++;
	let data = await $.ajax({
		url: `${serviceroot}/${nameOrAlpha}/${pvalue}?fields=name,capital`,
	}).catch(error => {
		console.error("getdata error", error);
		$("#output").append(`<div>Search by ${pname}:<strong>'${pvalue}'</strong> Unknown Country</div>`);
	});
	pending_count--;

	if (!data) return;

	console.log ("data", data);

	if (!_.isArray(data)) data = [data];		// for 'name' data is an array, otjherwise it is a single object.  make it an array for consistency

	_.each(data, c => {
		let info = `Search by ${pname}:<strong>'${pvalue}'</strong> - Official Name:<strong>${c.name.official}</strong> Capital:<strong>${c.capital.join(',')}</strong>`;
		$("#output").append(`<div>${info}</div>`);
	});

	return data;
}

async function positiveRandomTests() {   // positive means expecting successful search returning a country
	let tests_done = [];   // to hold indexes of countires randomly used in testing to avoid duplication
	$("#output").text('');
	window.failures = [];   // to display failuires only

	while(true) {
		if (tests_done.length == NUMBER_OF_TESTS) break;
		let index = Math.floor(Math.random()*countries.length);   // random country
		if (_.find(tests_done, i => index === i)) continue;   // already used this country. try another one
		tests_done.push(index);

		testdata = countries[index];
		
		await singleTest('name', testdata.name.official,true);
		await singleTest('name', testdata.name.common, true); 
		await singleTest('code', testdata.cca2,true);
		await singleTest('code', testdata.cca3,true);
		await singleTest('code', testdata.ccn3,true);
		await singleTest('code', testdata.cioc,true);

	}

	if (failures.length > 0) 
		$("#output").prepend(`<div style="color:red">Failures</div><div>${JSON.stringify(failures,null, 4)}</div><p><p>`);
	else 
		$("#output").prepend(`<div style="font-weight:700; color:green">Done. No Failures</div><p><p>`);

}	


async function positiveCompleteTests() {   // positive means expecting successful search returning a country
	$("#output").text('');
	window.failures = [];   // to display failuires only

	for (testdata of countries) {

		singleTest('name', testdata.name.official,true);
		singleTest('name', testdata.name.common, true); 
		singleTest('code', testdata.cca2,true);
		singleTest('code', testdata.cca3,true);
		singleTest('code', testdata.ccn3,true);
		singleTest('code', testdata.cioc,true);

	}

	let interval = setInterval( function() {
		if (pending_count == 0) { // all requests completed
			clearInterval(interval);
			$(".loading").hide();
			if (failures.length > 0) 
				$("#output").prepend(`<div style="color:red">Failures</div><div>${JSON.stringify(failures,null, 4)}</div><p><p>`);
		}
	},1000);

}	


async function negativeTests() {   // negative means expecting search to not find a country
	$("#output").text('');
	window.failures = [];   // to display failuires only

	let values = ['', 'aaaa', 'brn', 'zzzz'];

	for (v of values) {

		await singleTest('name', v,false);
		await singleTest('code', v,false);

	}

	if (failures.length > 0) 
		$("#output").prepend(`<div><strong>Failures</strong></div><div>${JSON.stringify(failures,null, 4)}</div><p>`);

}	

async function singleTest(pname,pvalue,expected) {   // expected: true=PASS, false=FAIL
	if (!pvalue) return; // some contries have missing codes

	let result = await searchBy(pname, pvalue);

	let verdict = result && expected ? 'PASS' :   // positive tests
				  !result && !expected ? 'PASS' : // negative tests
				  'FAIL';
	let verdictdisplayed = `<span style="font-weight:700; color:${verdict == 'PASS' ? 'green' : 'red'}">${verdict}</span>`;
	$("#output").append(`${ verdictdisplayed}</div><p>`);
	
	if (verdict == "FAIL") failures.push({pname : pname, pvalue : pvalue});
}
