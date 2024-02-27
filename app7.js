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

            quarterlyEarnings.forEach(entry => {
                reportedDateQuarterly.push(entry.reportedDate);
                reportedEPSQuarterly.push(entry.reportedEPS);
                if (entry.estimatedEPS !== null && entry.estimatedEPS !== undefined) {
                    estimatedEPSQ.push(entry.estimatedEPSQ);
                }

                if (entry.reportedEPS !== null && entry.reportedEPS !== undefined) {
                    reportedEPSQ.push(entry.reportedEPSQ);
                }
            });

            console.log(estimatedEPSQ);
            console.log(reportedEPSQ);

            const traceQuarterly = {
                x: reportedDateQuarterly.map(date => date.substring(0, 4)), // Extracting only the year from the fiscal date ending
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
                    title: 'Year'
                },
                yaxis: {
                    title: 'Earnings (USD)'
                }
            };

            const chartDataQuarterly = [traceQuarterly];
            Plotly.newPlot('quarterlyEarningsChart', chartDataQuarterly, layoutQuarterly);

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
                    color: 'rgb(35, 98, 161)',
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

            // Perform Regression Analysis
            performRegressionAnalysis(estimatedEPSQ, reportedEPSQ);
        })
        .catch(error => {
            console.error('There was a problem with fetching quarterly earnings:', error);
        });
}
