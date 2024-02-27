const data = null;

const xhr = new XMLHttpRequest();
xhr.withCredentials = false;

xhr.addEventListener('readystatechange', function () {
	if (this.readyState === this.DONE) {
		console.log(this.responseText);
	}
});

xhr.open('GET', 'https://twelve-data1.p.rapidapi.com/stocks?exchange=NASDAQ&format=json');
xhr.setRequestHeader('X-RapidAPI-Key', '11f7a923e1msh3c8c61e1bef42dcp1a3bf6jsn7810d3eb53c7');
xhr.setRequestHeader('X-RapidAPI-Host', 'twelve-data1.p.rapidapi.com');

xhr.send(data);

