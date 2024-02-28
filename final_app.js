document.addEventListener('DOMContentLoaded', function () {
  fetchCSVData();
});

function fetchCSVData() {
  // Fetch the CSV file
  fetch('Ticker.csv')
      .then(response => response.text())
      .then(csvData => processData(csvData));
}

function processData(csvData) {
  // Parse CSV data
  const rows = csvData.split('\n').slice(1); // Remove header row
  const stocks = rows.map(row => {
      const [symbol, name] = row.split(',');
      return { symbol, name };
  });

  // Populate dropdown
  const dropdown = document.getElementById('selDataset2');
  stocks.forEach(stock => {
      const option = document.createElement('option');
      option.value = stock.symbol;
      option.textContent = `${stock.name} (${stock.symbol})`;
      dropdown.appendChild(option);
  });
}

function fetchEarningsData() {
  const selectedOption = document.getElementById('selDataset2').value;
  const parts = selectedOption.split(' ');
  const symbolPart = parts[parts.length - 1]; // Extract the last part
  const symbol = symbolPart.substring(1, symbolPart.length - 1);
  console.log(symbol);
  if (!symbol) return; // If no symbol is selected, return

  const apiKey = 'YIVV78G5N35Z9YN0';
  const annualUrl = `https://www.alphavantage.co/query?function=EARNINGS&symbol=${symbol}&apikey=${apiKey}`;
  const quarterlyUrl = `https://www.alphavantage.co/query?function=EARNINGS&symbol=${symbol}&apikey=${apiKey}`;

  fetch(annualUrl)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          console.log(data);

          const annualEarnings = data.annualEarnings;
          const quarterlyEarnings = data.quarterlyEarnings;

          // Process annual earnings data
          const fiscalDateEndingsAnnual = [];
          const earningsValuesAnnual = [];

          annualEarnings.forEach(entry => {
              fiscalDateEndingsAnnual.push(entry.fiscalDateEnding);
              earningsValuesAnnual.push(entry.reportedEPS);
          });

          const traceAnnual = {
              x: fiscalDateEndingsAnnual.map(date => date.substring(0, 4)), // Extracting only the year from the fiscal date ending
              y: earningsValuesAnnual,
              type: 'bar',
              marker: {
                  color: 'blue'
              },
              text: earningsValuesAnnual.map(eps => `Reported EPS: ${eps}`)
          };

          const layoutAnnual = {
              title: 'Annual Earnings',
              xaxis: {
                  title: 'Year'
              },
              yaxis: {
                  title: 'Earnings (USD)'
              }
          };

          const chartDataAnnual = [traceAnnual];
          Plotly.newPlot('annualEarningsChart', chartDataAnnual, layoutAnnual);

          // Process quarterly earnings data
          const reportedDateQuarterly = [];
          const reportedEPSQuarterly = [];
          const estimatedEPSQ = [];
          const reportedEPSQ = [];
          const data1 = []; // Array to store data in the format required for regression analysis

          quarterlyEarnings.forEach(entry => {
              reportedDateQuarterly.push(entry.reportedDate);
              reportedEPSQuarterly.push(entry.reportedEPS);

              // Check if estimatedEPS and reportedEPS are not "None"
              if (entry.estimatedEPS !== "None" && entry.reportedEPS !== "None") {
                  // Push [x, y] pair into the data array
                  data1.push([parseFloat(entry.estimatedEPS), parseFloat(entry.reportedEPS)]);

                  // Also push reportedEPS to reportedEPSQ array
                  reportedEPSQ.push(parseFloat(entry.reportedEPS));
              }
          });

          // Call the polynomial regression function with the constructed data array and options
          const result = regression.polynomial(data1, { order: 3 });

          // Handle the results
          const coefficients = result.equation; // This will give you the coefficients of the polynomial
          console.log('Coefficients:', coefficients);

          console.log(estimatedEPSQ);
          console.log(reportedEPSQ);

          const traceQuarterly = {
              x: reportedDateQuarterly, // Extracting only the year from the fiscal date ending
              y: reportedEPSQuarterly,
              type: 'bar',
              marker: {
                  color: 'green'
              },
              text: reportedEPSQuarterly.map(eps => `Reported EPS: ${eps}`)
          };

          const layoutQuarterly = {
              title: 'Quarterly Earnings',
              xaxis: {
                  title: 'Reported Date'
              },
              yaxis: {
                  title: 'Earnings (USD)'
              }
          };

          const chartDataQuarterly = [traceQuarterly];
          Plotly.newPlot('quarterlyEarningsChart', chartDataQuarterly, layoutQuarterly);

          // Process combined data for line chart
          const traceAE = {
              type: 'scatter',
              x: fiscalDateEndingsAnnual.map(date => date.substring(0, 4)),
              y: earningsValuesAnnual,
              mode: 'lines',
              name: 'Annual Earnings',
              line: {
                  color: 'rgb(219,64,82)',
                  width: 3
              }
          };

          const traceQE = {
              type: 'scatter',
              x: reportedDateQuarterly.map(date => date.substring(0, 4)),
              y: reportedEPSQuarterly,
              mode: 'lines',
              name: 'Quarterly Earnings',
              line: {
                  color: 'rgb(55,128,191)',
                  width: 1
              }
          };

          const layoutCombined = {
              title: 'Combined Earnings',
              xaxis: {
                  title: 'Year'
              },
              yaxis: {
                  title: 'Earnings (USD)'
              }
              
          };

          const chartDataCombined = [traceAE, traceQE];
          Plotly.newPlot('myDiv', chartDataCombined, layoutCombined);

          // Create a new div for the polynomial regression curve
const polynomialDiv = document.createElement('div');
polynomialDiv.id = 'polynomialCurve';
document.body.appendChild(polynomialDiv);

// Plot the polynomial regression curve
const xValues = data1.map(point => point[0]);
const yValues = xValues.map(x => {
    return coefficients[0] * Math.pow(x, 3) +
        coefficients[1] * Math.pow(x, 2) +
        coefficients[2] * x +
        coefficients[3];
});

const tracePolynomial = {
    x: xValues,
    y: yValues,
    type: 'scatter',
    mode: 'lines',
    name: 'Polynomial Curve',
    line: {
        color: 'red'
    }
};

const layoutPolynomial = {
    title: 'Polynomial Regression Curve',
    xaxis: {
        title: 'Estimated EPS (USD)'
    },
    yaxis: {
        title: 'Reported EPS (USD)'
    }
};

const chartDataPolynomial = [tracePolynomial];
Plotly.newPlot('polynomialCurve', chartDataPolynomial, layoutPolynomial);

// Format the regression results for display
          const formattedResults = formatRegressionResults(coefficients); // Call formatRegressionResults with the result

          // Select the target element
          const regressionResultsDiv = document.getElementById('regressionResults');

          // Update the content
          regressionResultsDiv.innerHTML = formattedResults;
        })

      .catch(error => {
          console.error('There was a problem with the earnings fetch operation:', error);
      });
}

function formatRegressionResults(coefficients) {
  let formattedHTML = '<h4>Regression Analysis Results:</h4>';
  formattedHTML += '<ul>';

  // Add coefficients with explanations
  formattedHTML += `<li>Bending Strength: ${coefficients[0]}</li>`; // How much the curve bends vertically
  formattedHTML += `<li>Bending Direction: ${coefficients[1]}</li>`; // How much the curve bends horizontally
  formattedHTML += `<li>Steepness: ${coefficients[2]}</li>`; // Steepness of the curve
  formattedHTML += `<li>Starting Point: ${coefficients[3]}</li>`; // Starting point of the curve

  //equation
  formattedHTML += `<li>Equation: y = ${coefficients[0]}x^3 + ${coefficients[1]}x^2 + ${coefficients[2]}x + ${coefficients[3]}</li>`;

  formattedHTML += '</ul>';
  return formattedHTML;
}

