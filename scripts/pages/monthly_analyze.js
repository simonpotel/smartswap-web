async function fetchData(currency) {
    const response = await fetch(`../../scripts/pages/request_data.php/${currency}`);
    const data = await response.json();
    return data;
}

async function setCurrency(currency) {
    try {
        const data = await fetchData(currency);

        const labels = data.data.map(entry => new Date(entry[0]));
        const prices = data.data.map(entry => entry[1]);
        const colors = data.colors;
        const positions = data.positions;
        const trades = data.trades;

        const positionsElement = document.getElementById('positions');
        positionsElement.innerHTML = '<h2>Positions</h2>';
        const positionsTable = document.createElement('table');
        positionsTable.classList.add('table', 'table-responsive');
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

        const tradesElement = document.getElementById('trades');
        tradesElement.innerHTML = '<h2>Trades</h2>';
        const tradesTable = document.createElement('table');
        tradesTable.classList.add('table', 'table-responsive');
        tradesTable.innerHTML = '<tr><th>Rapport</th><th>Date d\'achat</th><th>Prix d\'achat</th><th>Date de vente</th><th>Prix de vente</th></tr>';
        trades.forEach(trade => {
            const rapport = trade.sell.sell_price / trade.buy.buy_price;
            const color = rapport > 1 ? 'green' : (rapport === 1 ? 'blue' : 'red');
            const rapportCell = document.createElement('td');
            rapportCell.innerHTML = rapport.toFixed(2);
            rapportCell.style.color = 'white';
            rapportCell.style.backgroundColor = color;
            rapportCell.style.borderRadius = '5px';
            rapportCell.style.padding = '5px';
            const row = document.createElement('tr');
            row.appendChild(rapportCell);
            row.innerHTML += `<td>${trade.buy.buy_date}</td><td>${trade.buy.buy_price}</td><td>${trade.sell.sell_date}</td><td>${trade.sell.sell_price}</td>`;
            tradesTable.appendChild(row);
        });
        tradesElement.appendChild(tradesTable);

        const ctx = document.getElementById('monthlyChart').getContext('2d');
        if (window.monthlyChart && window.monthlyChart instanceof Chart) {
            window.monthlyChart.destroy();
        }

        const initialData = {
            labels: labels.map(date => formatDate(new Date(date))),
            datasets: [{
                label: 'Prix',
                data: prices,
                borderColor: 'rgba(255, 255, 255, 1)',
                backgroundColor: colors,
                pointRadius: 5
            }]
        };

        window.monthlyChart = new Chart(ctx, {
            type: 'line',
            data: initialData,
            options: {
                animation: {
                    duration: 1000,
                    easing: 'linear'
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            fontColor: 'white'
                        }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleFontColor: '#fff',
                        bodyFontColor: '#fff',
                        callbacks: {
                            label: function(tooltipItem, data) {
                                if (tooltipItem && tooltipItem.yLabel !== undefined) {
                                    return 'Prix: ' + tooltipItem.yLabel.toFixed(2);
                                } else {
                                    return '';
                                }
                            }
                        }
                    }
                },
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

        const updateChartData = () => {
            window.monthlyChart.config.data.datasets[0].data = prices;
            window.monthlyChart.update();
        };

        const addData = () => {
            for (let i = 0; i < prices.length; i++) {
                (function(index) {
                    setTimeout(() => {
                        window.monthlyChart.data.datasets[0].data.push(prices[index]);
                        window.monthlyChart.update();
                    }, index * 20);
                })(i);
            }
        };

        setTimeout(addData, 200);

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

loadGraph('qs_matic_usdt'); // charge default graphic on start
