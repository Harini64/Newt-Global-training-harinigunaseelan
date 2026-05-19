from flask import Flask, render_template, jsonify
import pandas as pd
import os

app = Flask(__name__)

# Load stations data with error handling
try:
    stations = pd.read_csv("C:\\Users\\harin\\Desktop\\Newt Global\\weather_API\\data\\stations.txt", skiprows=17)
    stations = stations[["STAID", "STANAME                                 "]]
except FileNotFoundError:
    stations = pd.DataFrame(columns=["STAID", "STANAME                                 "])

@app.route("/")
def home():
    return render_template("home.html", stations=stations.to_html())

@app.route("/weather/<station>/<date>")
def get_weather(station, date):
    try:
        # Validate station ID
        station_id = str(int(station)).zfill(6)
        filename = f"data/TG_STAID{station_id}.txt"
        
        # Check if file exists
        if not os.path.exists(filename):
            return jsonify({"error": f"Weather data for station {station} not found."})
        
        # Read weather data
        df = pd.read_csv(filename, skiprows=20)
        df['    DATE'] = pd.to_datetime(df['    DATE'], format='%Y%m%d')
        
        # Find temperature for specific date
        temp_data = df.loc[df['    DATE'] == date]["   TG"]
        temperature = float(temp_data.iloc[0])/10 if len(temp_data) > 0 else None
        
        return jsonify({
            "station": station,
            "date": date,
            "temperature": temperature,
            "status": "success" if temperature is not None else "no_data"
        })
        
    except ValueError:
        return jsonify({"error": "Invalid station ID. Please provide a numeric station ID."})
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"})

@app.route("/weather/v1/<station>")
def all_data(station):
    try:
        # Validate station ID
        station_id = str(int(station)).zfill(6)
        filename = f"data/TG_STAID{station_id}.txt"
        
        # Check if file exists
        if not os.path.exists(filename):
            return jsonify({"error": f"Weather data for station {station} not found."})
        
        # Read weather data
        df = pd.read_csv(filename, skiprows=20)
        df['    DATE'] = pd.to_datetime(df['    DATE'], format='%Y%m%d')
        
        # Convert to JSON-friendly format
        result = df.to_dict('records')
        return jsonify({
            "station": station,
            "data": result,
            "total_records": len(result),
            "status": "success"
        })
        
    except ValueError:
        return jsonify({"error": "Invalid station ID. Please provide a numeric station ID."})
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"})

@app.route("/api/stations")
def get_stations():
    """API endpoint to get list of all available stations"""
    try:
        station_list = stations.to_dict('records')
        return jsonify({
            "stations": station_list,
            "total": len(station_list),
            "status": "success"
        })
    except Exception as e:
        return jsonify({"error": f"Failed to load stations: {str(e)}"})

@app.route("/api/health")
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "Weather API",
        "version": "1.0.0"
    })

if __name__ == "__main__":
    app.run(debug=True, port=5001)
