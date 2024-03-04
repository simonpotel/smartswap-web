// get the data from the api python
async function fetchData(currency) {
    const response = await fetch(`http://127.0.0.1:5000/monthly_analyze/${currency}`);
    return await response.json();
}

// update the graphic with the data selected (currency)
async function setCurrency(currency) {
    try {
        const data = await fetchData(currency);
        console.log(data)
        const labels = data.data.map(entry => new Date(entry[0]));
        const prices = data.data.map(entry => entry[1]);
        const colors = data.colors;
        const positions = data.positions;
        const trades = data.trades;

        // positions widget
        const positionsElement = document.getElementById('positions');
        positionsElement.innerHTML = '<h2>Positions</h2>';
        const positionsTable = document.createElement('table');
        positionsTable.classList.add('table');
        positionsTable.innerHTML = '<tr><th>Date d\'achat</th><th>Prix d\'achat</th></tr>';
        for (const key in positions) {
            if (positions.hasOwnProperty(key)) {
                const position = positions[key];
                const row = document.createElement('tr');
                row.innerHTML = `<td>${position.buy_date}</td><td>${position.buy_price}</td>`;
                positionsTable.appendChild(row);
            }
        }
        positionsElement.appendChild(positionsTable);

        // trade widget
        const tradesElement = document.getElementById('trades');
        tradesElement.innerHTML = '<h2>Trades</h2>';
        const tradesTable = document.createElement('table');
        tradesTable.classList.add('table');
        tradesTable.innerHTML = '<tr><th>Date d\'achat</th><th>Prix d\'achat</th><th>Date de vente</th><th>Prix de vente</th></tr>';
        trades.forEach(trade => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${trade.buy.buy_date}</td><td>${trade.buy.buy_price}</td><td>${trade.sell.sell_date}</td><td>${trade.sell.sell_price}</td>`;
            tradesTable.appendChild(row);
        });
        tradesElement.appendChild(tradesTable);

        // create the graphic
        const ctx = document.getElementById('monthlyChart').getContext('2d');
        if (window.monthlyChart && window.monthlyChart instanceof Chart) {
            window.monthlyChart.destroy();
        }
        window.monthlyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels.map(date => formatDate(new Date(date))),
                datasets: [{
                    label: 'Prix',
                    data: prices,
                    borderColor: 'rgba(255, 255, 255, 1)',
                    backgroundColor: colors 
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'month',
                            displayFormats: {
                                month: 'MMM YYYY'
                            }
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Date'
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Prix'
                        }
                    }]
                }
            }
        });

    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des données:', error);
    }
}

function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function loadGraph(currency) {
    setCurrency(currency);
}
