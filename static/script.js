// Theme switcher functionality
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('change', function() {
    if (this.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
    updateChartsTheme();
});

// Check for saved theme preference
const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        themeToggle.checked = true;
    }
}

// Chart theme variables
let chartGridColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-grid').trim() || 'rgba(0, 0, 0, 0.1)';
let chartTextColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim() || '#212529';

// Initialize charts with improved styling
function initializeCharts() {
    // Time series chart
    const timeCtx = document.getElementById('timeChart').getContext('2d');
    window.timeChart = new Chart(timeCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                { 
                    label: 'PM1', 
                    data: [], 
                    borderColor: 'rgba(255, 99, 132, 0.8)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 2,
                    pointRadius: 1,
                    pointHoverRadius: 5,
                    tension: 0.3,
                    fill: true
                },
                { 
                    label: 'PM2.5', 
                    data: [], 
                    borderColor: 'rgba(54, 162, 235, 0.8)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderWidth: 2,
                    pointRadius: 1,
                    pointHoverRadius: 5,
                    tension: 0.3,
                    fill: true
                },
                { 
                    label: 'PM4', 
                    data: [], 
                    borderColor: 'rgba(75, 192, 192, 0.8)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 2,
                    pointRadius: 1,
                    pointHoverRadius: 5,
                    tension: 0.3,
                    fill: true
                },
                { 
                    label: 'PM10', 
                    data: [], 
                    borderColor: 'rgba(255, 206, 86, 0.8)',
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderWidth: 2,
                    pointRadius: 1,
                    pointHoverRadius: 5,
                    tension: 0.3,
                    fill: true
                },
                { 
                    label: 'TSP', 
                    data: [], 
                    borderColor: 'rgba(153, 102, 255, 0.8)',
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderWidth: 2,
                    pointRadius: 1,
                    pointHoverRadius: 5,
                    tension: 0.3,
                    fill: true,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: chartTextColor,
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    },
                    padding: 10,
                    caretSize: 5,
                    cornerRadius: 4
                }
            },
            scales: {
                y: { 
                    beginAtZero: true,
                    grid: {
                        color: chartGridColor
                    },
                    ticks: {
                        color: chartTextColor,
                        padding: 10
                    },
                    title: { 
                        display: true, 
                        text: 'PM Level (µg/m³)',
                        color: chartTextColor,
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        padding: {top: 10, bottom: 10}
                    }
                },
                x: {
                    grid: {
                        color: chartGridColor
                    },
                    ticks: {
                        color: chartTextColor,
                        maxRotation: 45,
                        minRotation: 45
                    },
                    title: { 
                        display: true, 
                        text: 'Time',
                        color: chartTextColor,
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        padding: {top: 10, bottom: 10}
                    }
                }
            }
        }
    });

    // Threshold comparison chart
    const thresholdCtx = document.getElementById('thresholdChart').getContext('2d');
    window.thresholdChart = new Chart(thresholdCtx, {
        type: 'bar',
        data: {
            labels: ['PM1', 'PM2.5', 'PM4', 'PM10', 'TSP'],
            datasets: [
                { 
                    label: 'Current', 
                    data: [], 
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                },
                { 
                    label: 'Threshold', 
                    data: [], 
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: chartTextColor,
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                }
            },
            scales: {
                y: { 
                    beginAtZero: true,
                    grid: {
                        color: chartGridColor
                    },
                    ticks: {
                        color: chartTextColor,
                        padding: 10
                    },
                    title: { 
                        display: true, 
                        text: 'PM Level (µg/m³)',
                        color: chartTextColor,
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        padding: {top: 10, bottom: 10}
                    }
                },
                x: {
                    grid: {
                        color: chartGridColor
                    },
                    ticks: {
                        color: chartTextColor
                    }
                }
            }
        }
    });

    // Threshold Frequency Chart (new)
    const thresholdFreqCtx = document.getElementById('thresholdFrequencyChart').getContext('2d');
    window.thresholdFrequencyChart = new Chart(thresholdFreqCtx, {
        type: 'bar',
        data: {
            labels: ['PM1', 'PM2.5', 'PM4', 'PM10', 'TSP'],
            datasets: [{
                label: 'Threshold Exceedance Frequency (%)',
                data: [0, 0, 0, 0, 0],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: chartTextColor,
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw.toFixed(1)}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: chartGridColor
                    },
                    ticks: {
                        color: chartTextColor,
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Percentage of Time Exceeding Threshold',
                        color: chartTextColor,
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        padding: {top: 10, bottom: 10}
                    }
                },
                x: {
                    grid: {
                        color: chartGridColor
                    },
                    ticks: {
                        color: chartTextColor
                    }
                }
            }
        }
    });
}

// Update charts theme based on current theme
function updateChartsTheme() {
    chartGridColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-grid').trim() || 'rgba(0, 0, 0, 0.1)';
    chartTextColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim() || '#212529';
    
    const updateChartTheme = (chart) => {
        if (!chart) return;
        
        // Update legend text color
        chart.options.plugins.legend.labels.color = chartTextColor;
        
        // Update scales colors
        chart.options.scales.y.grid.color = chartGridColor;
        chart.options.scales.y.ticks.color = chartTextColor;
        chart.options.scales.y.title.color = chartTextColor;
        
        chart.options.scales.x.grid.color = chartGridColor;
        chart.options.scales.x.ticks.color = chartTextColor;
        if (chart.options.scales.x.title) {
            chart.options.scales.x.title.color = chartTextColor;
        }
        
        chart.update();
    };
    
    updateChartTheme(window.timeChart);
    updateChartTheme(window.thresholdChart);
    updateChartTheme(window.thresholdFrequencyChart);
}

// Tracking threshold exceedances for frequency analysis
let thresholdExceedances = {
    total: 0,
    pm1: 0,
    pm2_5: 0,
    pm4: 0,
    pm10: 0,
    tsp: 0
};

// Fetch data from Flask backend based on selected date range
function fetchData() {
    const dateRange = document.getElementById('date-range').value;
    
    fetch(`/api/data`)

        .then(response => response.json())
        .then(data => {
            updateDashboard(data);
            updateCharts(data);
            checkThresholds(data);
            calculateThresholdFrequency(data);
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Update dashboard elements
function updateDashboard(data) {
    // Sensor data
    if (data.sensor) {
        document.getElementById('pm1-value').textContent = data.sensor.PM1?.toFixed(2) || '-';
        document.getElementById('pm2.5-value').textContent = data.sensor["PM2.5"]?.toFixed(2) || '-';
        document.getElementById('pm4-value').textContent = data.sensor.PM4?.toFixed(2) || '-';
        document.getElementById('pm10-value').textContent = data.sensor.PM10?.toFixed(2) || '-';
        document.getElementById('tsp-value').textContent = data.sensor.TSP?.toFixed(2) || '-';
        document.getElementById('last-update').textContent = data.sensor.timestamp || new Date().toLocaleString();
        
        // Set colors based on threshold comparison
        if (data.status?.thresholds) {
            updateValueColors('pm1-value', data.sensor.PM1, data.status.thresholds.pm1);
            updateValueColors('pm2.5-value', data.sensor["PM2.5"], data.status.thresholds["pm2.5"]);
            updateValueColors('pm4-value', data.sensor.PM4, data.status.thresholds.pm4);
            updateValueColors('pm10-value', data.sensor.PM10, data.status.thresholds.pm10);
            updateValueColors('tsp-value', data.sensor.TSP, data.status.thresholds.tsp);
        }
    }

    // Status data
    if (data.status) {
        // System status
        const systemStatus = document.getElementById('system-status');
        systemStatus.textContent = data.status.system === 'operational' ? 'ONLINE' : 'OFFLINE';
        systemStatus.className = data.status.system === 'operational' ? 'badge bg-success' : 'badge bg-danger';
        
        // Mode
        document.getElementById('system-mode').textContent = data.status.mode || '-';
        
        // Relay status
        const relayStatus = document.getElementById('relay-status');
        relayStatus.textContent = data.status.relay_state || '-';
        relayStatus.className = data.status.relay_state === 'ON' ? 'badge bg-success' : 'badge bg-secondary';
        document.getElementById('relay-change').textContent = data.status.timestamp || '-';
        
        // Thresholds
        if (data.status.thresholds) {
            document.getElementById('pm1-threshold').textContent = data.status.thresholds.pm1 || '-';
            document.getElementById('pm2.5-threshold').textContent = data.status.thresholds["pm2.5"] || '-';
            document.getElementById('pm4-threshold').textContent = data.status.thresholds.pm4 || '-';
            document.getElementById('pm10-threshold').textContent = data.status.thresholds.pm10 || '-';
            document.getElementById('tsp-threshold').textContent = data.status.thresholds.tsp || '-';

            const updateIfNotFocused = (id, value) => {
                const input = document.getElementById(id);
                if (document.activeElement !== input) {
                    input.value = value || '';
                }
            };  
            
            // Update threshold inputs
            updateIfNotFocused('pm1-threshold-input', data.status.thresholds.pm1);
            updateIfNotFocused('pm2.5-threshold-input', data.status.thresholds["pm2.5"]);
            updateIfNotFocused('pm4-threshold-input', data.status.thresholds.pm4);
            updateIfNotFocused('pm10-threshold-input', data.status.thresholds.pm10);
            updateIfNotFocused('tsp-threshold-input', data.status.thresholds.tsp);
        }
    }
}

// Update value colors based on threshold
function updateValueColors(elementId, value, threshold) {
    const element = document.getElementById(elementId);
    if (!element || value === undefined || threshold === undefined) return;
    
    if (value > threshold) {
        element.classList.add('text-danger');
    } else {
        element.classList.remove('text-danger');
    }
}

// Check thresholds and display alerts
// Check thresholds and display alerts
function checkThresholds(data) {
    if (!data.sensor || !data.status?.thresholds) return;
    
    const alertContainer = document.getElementById('alerts-container');
    alertContainer.innerHTML = ''; // Clear existing alerts
    
    let hasExceededThreshold = false;
    
    // Check each PM type against its threshold
    if (data.sensor.PM1 > data.status.thresholds.pm1) {
        createAlert('PM1 levels exceed threshold!', 'warning');
        hasExceededThreshold = true;
    }
    
    if (data.sensor["PM2.5"] > data.status.thresholds["pm2.5"]) {
        createAlert('PM2.5 levels exceed threshold!', 'warning');
        hasExceededThreshold = true;
    }
    
    if (data.sensor.PM4 > data.status.thresholds.pm4) {
        createAlert('PM4 levels exceed threshold!', 'warning');
        hasExceededThreshold = true;
    }
    
    if (data.sensor.PM10 > data.status.thresholds.pm10) {
        createAlert('PM10 levels exceed threshold!', 'warning');
        hasExceededThreshold = true;
    }
    
    if (data.sensor.TSP > data.status.thresholds.tsp) {
        createAlert('TSP levels exceed threshold!', 'warning');
        hasExceededThreshold = true;
    }
    
    // If air quality is good, show positive message
    if (!hasExceededThreshold) {
        createAlert('Air quality is within acceptable parameters.', 'success');
    }
    
    // Update status indicators on dashboard
    document.getElementById('air-quality-status').className = 
        hasExceededThreshold ? 'badge bg-warning' : 'badge bg-success';
    document.getElementById('air-quality-status').textContent = 
        hasExceededThreshold ? 'ALERT' : 'GOOD';
}

// Create alert notification
function createAlert(message, type) {
    const alertContainer = document.getElementById('alerts-container');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.role = 'alert';
    
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    alertContainer.appendChild(alert);
}

// Update charts with new data
function updateCharts(data) {
    if (!data.history || !data.history.timestamps || !data.history.timestamps.length) return;
    
    // Process data for time series chart
    const labels = data.history.timestamps.map(timestamp => {
        // Convert timestamp to readable format
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    });

    if (data.exceedance_percent) {
        window.thresholdFrequencyChart.data.datasets[0].data = [
            data.exceedance_percent.pm1,
            data.exceedance_percent.pm2_5,
            data.exceedance_percent.pm4,
            data.exceedance_percent.pm10,
            data.exceedance_percent.tsp
        ];
        window.thresholdFrequencyChart.update();
    }
    
    // Update time chart
    window.timeChart.data.labels = labels;
    window.timeChart.data.datasets[0].data = data.history.pm1 || [];
    window.timeChart.data.datasets[1].data = data.history.pm2_5 || [];
    window.timeChart.data.datasets[2].data = data.history.pm4 || [];
    window.timeChart.data.datasets[3].data = data.history.pm10 || [];
    window.timeChart.data.datasets[4].data = data.history.tsp || [];
    window.timeChart.update();
    
    // Update threshold comparison chart with latest values
    if (data.status?.thresholds && data.sensor) {
        window.thresholdChart.data.datasets[0].data = [
            data.sensor.PM1 || 0,
            data.sensor["PM2.5"] || 0,
            data.sensor.PM4 || 0,
            data.sensor.PM10 || 0,
            data.sensor.TSP || 0
        ];
        
        window.thresholdChart.data.datasets[1].data = [
            data.status.thresholds.pm1,
            data.status.thresholds["pm2.5"],
            data.status.thresholds.pm4,
            data.status.thresholds.pm10,
            data.status.thresholds.tsp
        ];
        
        window.thresholdChart.update();
    }
}

// Calculate threshold exceedance frequency
function calculateThresholdFrequency(data) {
    if (!data.history || !data.history.timestamps || !data.status?.thresholds) return;
    
    const totalReadings = data.history.timestamps.length;
    if (totalReadings === 0) return;
    
    // Reset counters
    let pm1Exceeded = 0;
    let pm2_5Exceeded = 0;
    let pm4Exceeded = 0;
    let pm10Exceeded = 0;
    let tspExceeded = 0;
    
    // Count exceedances
    for (let i = 0; i < totalReadings; i++) {
        if (data.history.pm1[i] > data.status.thresholds.pm1) pm1Exceeded++;
        if (data.history.pm2_5[i] > data.status.thresholds["pm2.5"]) pm2_5Exceeded++;
        if (data.history.pm4[i] > data.status.thresholds.pm4) pm4Exceeded++;
        if (data.history.pm10[i] > data.status.thresholds.pm10) pm10Exceeded++;
        if (data.history.tsp[i] > data.status.thresholds.tsp) tspExceeded++;
    }
    
    // Calculate percentages
    const pm1Percent = (pm1Exceeded / totalReadings) * 100;
    const pm2_5Percent = (pm2_5Exceeded / totalReadings) * 100;
    const pm4Percent = (pm4Exceeded / totalReadings) * 100;
    const pm10Percent = (pm10Exceeded / totalReadings) * 100;
    const tspPercent = (tspExceeded / totalReadings) * 100;
    
    // Update threshold exceedances tracking
    thresholdExceedances = {
        total: totalReadings,
        pm1: pm1Exceeded,
        pm2_5: pm2_5Exceeded,
        pm4: pm4Exceeded,
        pm10: pm10Exceeded,
        tsp: tspExceeded
    };
    
    // Update threshold frequency chart
    if (window.thresholdFrequencyChart) {
        window.thresholdFrequencyChart.data.datasets[0].data = [
            pm1Percent,
            pm2_5Percent,
            pm4Percent,
            pm10Percent,
            tspPercent
        ];
        window.thresholdFrequencyChart.update();
    }
    
    // Display summary in status panel
    
}

// Save threshold settings
// Update the threshold form submission handler
document.getElementById('threshold-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default form submission
    
    const thresholds = {
        pm1: parseFloat(document.getElementById('pm1-threshold-input').value),
        "pm2.5": parseFloat(document.getElementById('pm2.5-threshold-input').value),
        pm4: parseFloat(document.getElementById('pm4-threshold-input').value),
        pm10: parseFloat(document.getElementById('pm10-threshold-input').value),
        tsp: parseFloat(document.getElementById('tsp-threshold-input').value)
    };

    // Validate values
    for (const key in thresholds) {
        if (isNaN(thresholds[key]) || thresholds[key] < 0) {
            createAlert(`Invalid threshold value for ${key}. Must be a positive number.`, 'danger');
            return;
        }
    }

    // Send to server
    fetch('/api/update_thresholds', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(thresholds)
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        createAlert('Thresholds updated successfully!', 'success');
        fetchData(); // Refresh dashboard
    })
    .catch(error => {
        console.error('Error:', error);
        createAlert('Failed to update thresholds. Please try again.', 'danger');
    });
});

// Set system mode
function setSystemMode(mode) {
    fetch('/api/settings/mode', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mode })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        createAlert(`System mode set to ${mode} successfully!`, 'success');
        fetchData(); // Refresh data
    })
    .catch(error => {
        console.error('Error setting system mode:', error);
        createAlert('Failed to set system mode. Please try again.', 'danger');
    });
}

// Export data to CSV
function exportData() {
    const dateRange = document.getElementById('date-range').value;
    const startDate = prompt("Enter Start Date (YYYY-MM-DD):");
    const endDate = prompt("Enter End Date (YYYY-MM-DD):");
    if (startDate && endDate) {
        window.location.href = `/api/export_csv?start=${startDate}&end=${endDate}`;
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {

    const socket = io();
    socket.on('new_data', data => {
        updateDashboard(data);
        updateCharts(data);
        checkThresholds(data);
        calculateThresholdFrequency(data);
    });
    initializeCharts();
    fetchData();
    
    // Set up event listeners
    document.getElementById('date-range').addEventListener('change', fetchData);
    document.getElementById('save-thresholds-btn').addEventListener('click', saveThresholds);
    document.getElementById('relay-on-btn').addEventListener('click', () => toggleRelay(true));
    document.getElementById('relay-off-btn').addEventListener('click', () => toggleRelay(false));
    document.getElementById('mode-auto-btn').addEventListener('click', () => setSystemMode('auto'));
    document.getElementById('mode-manual-btn').addEventListener('click', () => setSystemMode('manual'));
    document.getElementById('export-btn').addEventListener('click', exportData);
    
});