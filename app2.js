import axios from 'axios';

const options = {
  method: 'GET',
  url: 'https://twelve-data1.p.rapidapi.com/symbol_search',
  params: {
    symbol: 'AA',
    outputsize: '30'
  },
  headers: {
    'X-RapidAPI-Key': '11f7a923e1msh3c8c61e1bef42dcp1a3bf6jsn7810d3eb53c7',
    'X-RapidAPI-Host': 'twelve-data1.p.rapidapi.com'
  }
};

try {
	const response = await axios.request(options);
	console.log(response.data);
} catch (error) {
	console.error(error);
}