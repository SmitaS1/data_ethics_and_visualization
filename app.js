const settings = {
	async: true,
	crossDomain: true,
	url: 'https://twelve-data1.p.rapidapi.com/stocks?exchange=NASDAQ&format=json',
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '11f7a923e1msh3c8c61e1bef42dcp1a3bf6jsn7810d3eb53c7',
		'X-RapidAPI-Host': 'twelve-data1.p.rapidapi.com'
	}
};

$.ajax(settings).done(function (response) {
	console.log(response);
});
