from flask import Flask, render_template, jsonify, request, make_response
import paho.mqtt.client as mqtt
from threading import Thread
import json
from datetime import datetime, timedelta
from collections import deque
import time
import csv
import io
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)

# Configuration
MQTT_BROKER = os.getenv('MQTT_BROKER')
MQTT_PORT =  int(os.getenv('MQTT_PORT'))
MQTT_USER = os.getenv('MQTT_USER')
MQTT_PASSWORD = os.getenv('MQTT_PASSWORD')
TOPICS = ["dustrak/data", "dustrak/status", "dustrak/control"]

# Data storage
latest_data = {
    "sensor": {},
    "status": {
        "mode": "auto",
        "relay_state": "OFF",
        "thresholds": {
            "pm1": 50.0,
            "pm2.5": 75.0,
            "pm4": 100.0,
            "pm10": 150.0,
            "tsp": 200.0
        }
    }
}

# Store last 500 readings for charts (5 days at 1 reading per minute)
history = {
    "timestamps": deque(maxlen=500),
    "pm1": deque(maxlen=500),
    "pm2_5": deque(maxlen=500),
    "pm4": deque(maxlen=500),
    "pm10": deque(maxlen=500),
    "tsp": deque(maxlen=500),
    "full_records": deque(maxlen=500)  # Stores complete records for CSV export
}

# MQTT Client
mqtt_client = None

def on_connect(client, userdata, flags, rc, properties=None):
    print(f"Connected to MQTT broker with result code {rc}")
    for topic in TOPICS:
        client.subscribe(topic)

def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())
        
        if msg.topic == "dustrak/data":
            # Store complete record for CSV export
            full_record = {
                "timestamp": datetime.now().isoformat(),
                "PM1": payload.get("PM1", 0),
                "PM2.5": payload.get("PM2.5", 0),
                "PM4": payload.get("PM4", 0),
                "PM10": payload.get("PM10", 0),
                "TSP": payload.get("TSP", 0)
            }
            history["full_records"].append(full_record)
            
            # Update sensor data
            latest_data["sensor"] = payload
            record_history(payload)
            
        elif msg.topic == "dustrak/status":
            # Update system status
            latest_data["status"].update(payload)
            if "thresholds" in payload:
                latest_data["status"]["thresholds"].update(payload["thresholds"])
                
        elif msg.topic == "dustrak/control":
            print(f"Control message received: {payload}")

    except Exception as e:
        print(f"Error processing MQTT message: {e}")

def record_history(data):
    """Store historical data for charts"""
    now = datetime.now()
    history["timestamps"].append(now.strftime("%m-%d %H:%M"))
    history["pm1"].append(data.get("PM1", 0))
    history["pm2_5"].append(data.get("PM2.5", 0))
    history["pm4"].append(data.get("PM4", 0))
    history["pm10"].append(data.get("PM10", 0))
    history["tsp"].append(data.get("TSP", 0))

def publish_thresholds(thresholds):
    if mqtt_client:
        mqtt_client.publish(
            "dustrak/control",
            json.dumps({"thresholds": thresholds}),
            qos=1
        )

def start_mqtt_client():
    global mqtt_client
    while True:
        try:
            mqtt_client = mqtt.Client()
            mqtt_client.username_pw_set(MQTT_USER, MQTT_PASSWORD)
            mqtt_client.tls_set()
            mqtt_client.on_connect = on_connect
            mqtt_client.on_message = on_message
            
            mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 60)
            mqtt_client.loop_forever()
            
        except Exception as e:
            print(f"MQTT connection error: {e}")
            print("Retrying in 5 seconds...")
            time.sleep(5)

@app.route('/')
def dashboard():
    return render_template('dashboard.html')

@app.route('/api/data')
def get_data():
    return jsonify({
        "sensor": latest_data["sensor"],
        "status": latest_data["status"],
        "history": {
            "timestamps": list(history["timestamps"]),
            "pm1": list(history["pm1"]),
            "pm2_5": list(history["pm2_5"]),
            "pm4": list(history["pm4"]),
            "pm10": list(history["pm10"]),
            "tsp": list(history["tsp"])
        }
    })

@app.route('/api/update_thresholds', methods=['POST'])
def update_thresholds():
    try:
        thresholds = request.json
        # Validate thresholds are numbers
        for key, value in thresholds.items():
            if not isinstance(value, (int, float)) or value < 0:
                return jsonify({"status": "error", "message": f"Invalid value for {key}"}), 400
        
        # Update local storage
        latest_data["status"]["thresholds"].update(thresholds)
        
        # Publish to MQTT
        publish_thresholds(thresholds)
        
        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/export_csv')
def export_csv():
    start_date = request.args.get("start")
    end_date = request.args.get("end")
    
    if not start_date or not end_date:
        return "Start and end dates are required.", 400
    
    try:
        start_dt = datetime.fromisoformat(start_date)
        end_dt = datetime.fromisoformat(end_date)
    except ValueError:
        return "Invalid date format. Use YYYY-MM-DD", 400

    si = io.StringIO()
    cw = csv.writer(si)
    cw.writerow(["Timestamp", "PM1", "PM2.5", "PM4", "PM10", "TSP"])

    for record in history["full_records"]:
        ts = datetime.fromisoformat(record["timestamp"])
        if start_dt <= ts <= end_dt:
            cw.writerow([
                record["timestamp"],
                record["PM1"],
                record["PM2.5"],
                record["PM4"],
                record["PM10"],
                record["TSP"]
            ])
    
    output = make_response(si.getvalue())
    output.headers["Content-Disposition"] = "attachment; filename=dust_data_export.csv"
    output.headers["Content-type"] = "text/csv"
    return output

    

if __name__ == '__main__':
    mqtt_thread = Thread(target=start_mqtt_client)
    mqtt_thread.daemon = True
    mqtt_thread.start()
    app.run(host='0.0.0.0', port=5000, debug=True)