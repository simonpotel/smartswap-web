async function getTableNames() {
    try {
        const response = await fetch('../src/data.php');
        const data = await response.json();
        return data.tables;
    } catch (error) {
        console.error('Error fetching table names:', error);
        throw error;
    }
}

// Function to create tabs and charts
async function createTabsAndCharts() {
    try {
        const tableNames = await getTableNames();

        const tabsContainer = document.getElementById('tabs-container');
        const chartContainer = document.getElementById('chart-container');

        tableNames.forEach(tableName => {
            // Create a tab button
            const tabButton = document.createElement('button');
            tabButton.innerHTML = tableName;
            tabButton.className = 'tablinks';
            tabButton.onclick = () => openTab(event, tableName);
            tabsContainer.appendChild(tabButton);

            // Create a container for each chart
            const chartDiv = document.createElement('div');
            chartDiv.id = tableName;
            chartDiv.className = 'tabcontent';
            chartDiv.innerHTML = `<h2>${tableName}</h2><div id="lastPrice${tableName}" class="last-price"></div><canvas id="chart${tableName}" class="chart-canvas"></canvas>`;
            chartContainer.appendChild(chartDiv);

            // Fetch data for the table and create the chart
            fetchDataAndCreateChart(tableName);
        });

        // Add fade-in animation to the tabs and chart-container
        tabsContainer.style.opacity = '0';
        chartContainer.style.opacity = '0';
        tabsContainer.style.transition = 'opacity 1s';
        chartContainer.style.transition = 'opacity 1s';
        setTimeout(() => {
            tabsContainer.style.opacity = '1';
            chartContainer.style.opacity = '1';
        }, 500); // Adjust the delay as needed
    } catch (error) {
        console.error('Error creating tabs and charts:', error);
    }
}


async function fetchDataAndCreateChart(tableName) {
    try {
        const response = await fetch(`../src/data.php?table=${tableName}`);
        if (!response.ok) {
            throw new Error(`Error fetching data for table ${tableName}`);
        }

        const data = await response.json();

        const lastPriceElement = document.getElementById(`lastPrice${tableName}`);
        const lastDate = data.data[tableName][data.data[tableName].length - 1].date;
        const lastPrice = data.data[tableName][data.data[tableName].length - 1].price;

        // Display the last recorded price
        lastPriceElement.innerHTML = `<p>Last price: ${lastPrice} at ${lastDate}</p>`;

        const ctx = document.getElementById(`chart${tableName}`).getContext('2d');
        
        const backcolor = '#007fff'; // Light blue color
        const graphcolor = '#00308f'; // Blue color

        const chartData = {
            labels: data.data[tableName].map(entry => entry.date),
            datasets: [{
                label: 'Price',
                data: data.data[tableName].map(entry => entry.price),
                backgroundColor: backcolor,
                borderColor: graphcolor,
                borderWidth: 3,
                pointBackgroundColor: backcolor,
                pointBorderColor: graphcolor,
                pointRadius: 0
            }]
        };

        const chart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                animation: {
                    duration: 1000 
                },
                scales: {
                    x: [{
                        type: 'time',
                        time: {
                            unit: 'minute',
                            displayFormats: {
                                minute: 'HH:mm',
                                tooltipFormat: 'HH:mm',
                            },
                            minUnit: 'minute'
                        },
                        ticks: {
                            maxRotation: 45,
                            autoSkip: true,
                            fontSize: 12
                        }
                    }],
                    y: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                elements: {
                    point: {
                        radius: 3,
                        hitRadius: 5,
                        hoverRadius: 5,
                        backgroundColor: backcolor,
                        borderColor: graphcolor,
                        borderWidth: 2
                    }
                },
                plugins: {
                    legend: {
                        display: true
                    },
                    crosshair: {
                        line: {
                            color: 'rgba(255, 255, 255, 0.5)',
                            width: 1,
                            dashPattern: [5, 5],
                        },
                        sync: {
                            enabled: false
                        }
                    }
                }
            }
        });

    } catch (error) {
        console.error(`Error creating chart for table ${tableName}:`, error);
    }
}



// Function to open a tab
function openTab(evt, tableName) {
    try {
        var i, tabcontent, tablinks;

        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        document.getElementById(tableName).style.display = "block";
        evt.currentTarget.className += " active";
    } catch (error) {
        console.error('Error opening tab:', error);
    }
}

// Function to reset the chart zoom
function resetZoom(chart) {
    try {
        // Reset chart zoom
        chart.resetZoom();
    } catch (error) {
        console.error('Error resetting chart zoom:', error);
    }
}

// Call the function to create tabs and charts when the page loads
createTabsAndCharts();
