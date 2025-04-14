# Dust Monitoring Dashboard 💨


## Overview

The Dust Monitoring Dashboard is a powerful web-based application designed to monitor, visualize, and analyze particulate matter (PM) levels in real-time. It connects to DUSTRAK™ air quality sensors via MQTT protocol to provide comprehensive air quality monitoring capabilities with automatic threshold alerts.

## ✨ Features

- **Real-time Monitoring**: Track PM1, PM2.5, PM4, PM10, and TSP levels instantly
- **Interactive Dashboards**: Visualize air quality data with beautiful, responsive charts
- **Threshold Alerts**: Get notified when particulate levels exceed configured thresholds
- **Historical Data Analysis**: View trends over time with configurable date ranges
- **Data Export**: Download CSV reports for further analysis
- **Smart Relay Control**: Automatic control of ventilation systems based on air quality
- **Light/Dark Mode**: Comfortable viewing in any environment
- **Mobile Responsive**: Monitor your air quality from any device

## 📊 Dashboard Preview

![image](https://github.com/user-attachments/assets/576865ca-92e0-4135-923f-0c1a0d4a1f8a)


The dashboard provides an intuitive interface with:

- **Status Cards**: Quick view of system and relay status
- **Current PM Levels**: Large, easy-to-read displays of current particulate matter concentrations
- **Threshold Alerts**: Visual warnings when levels exceed configured thresholds
- **Time Series Charts**: Track PM levels over customizable time periods
- **Threshold Comparison**: Visual comparison of current values vs thresholds
- **Exceedance Analysis**: Frequency analysis of threshold violations

## 🔌 System Architecture

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   DUSTRAK   │       │    MQTT     │       │    Flask    │
│   Sensor    │──────▶│    Broker   │──────▶│   Server    │
└─────────────┘       └─────────────┘       └─────────────┘
                                                   │
                                                   ▼
                                            ┌─────────────┐
                                            │  Web-based  │
                                            │  Dashboard  │
                                            └─────────────┘
```

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Flask
- Paho-MQTT client
- Modern web browser
- MQTT broker (default: HiveMQ Cloud)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dust-monitoring-dashboard.git
   cd dust-monitoring-dashboard
   ```

2. Create and activate virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install flask paho-mqtt python-dotenv
   ```

4. Configure MQTT connection:
   Create a `.env` file with your MQTT credentials (see `.env.example`)

5. Run the application:
   ```bash
   python app.py
   ```

6. Access the dashboard at `http://localhost:5000`

## 🔧 Configuration

### Threshold Settings

Configure PM thresholds through the dashboard interface to trigger alerts and automated responses.

## 📈 Data Visualization

The dashboard features three primary visualization types:

- **Time Series Chart**: Historical data visualization over configurable time periods
- **Threshold Comparison Chart**: Bar chart comparing current values against thresholds
- **Exceedance Frequency Chart**: Analysis of how often thresholds are exceeded

## 🛠️ Technical Details

### Backend
- **Flask**: Powers the web server and API endpoints
- **Paho-MQTT**: Handles MQTT communication with sensors
- **Threading**: Enables concurrent processing of MQTT messages

### Frontend
- **Bootstrap 5**: Responsive UI framework
- **Chart.js**: Interactive data visualization
- **JavaScript**: Dynamic dashboard updates and user interactions

## 🔄 Data Flow

1. DUSTRAK sensors collect particulate matter readings
2. Data is published to MQTT broker on `dustrak/data` topic
3. Flask server subscribes to MQTT topics and processes incoming data
4. Processed data is stored in memory for historical analysis
5. Web dashboard fetches data via API endpoints
6. User interface updates in real-time with new readings

## 🔒 Security

- TLS-encrypted MQTT connection
- Authentication required for MQTT broker access
- Environment variable configuration for sensitive credentials

## 📋 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributors

- Your Name - Initial work - [YourGitHub](https://github.com/yourusername)

## 📞 Support

For support or questions, please open an issue on the GitHub repository or contact the maintainers directly.

---

*Breathe easier with real-time air quality monitoring*
