let apiBase="/teksystems/";

$(document).ready(async function () {

	let data = await $.ajax({
		url:`${apiBase}getdata`,
		//headers: {  },
	}).catch(error => {
		console.error("getdata error", error);
	});
	console.log (data);

	load_chart_catalog(chartCatalog, data);   // data containes lotto dates (ordered and winning numbers history)

});
