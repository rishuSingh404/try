import requests

def get_esp32_data():
    """
    In a real scenario, fetch data from ESP32's WiFi endpoint or BLE.
    Example using requests to GET from the ESP32 IP:
    """
    try:
        # Replace with your actual ESP32 IP address
        # e.g. "http://192.168.4.1/sensor-data"
        # For now, let's mock:
        # response = requests.get("http://192.168.4.1/sensor-data")
        # data = response.json()
        
        # Return mock data for demonstration
        data = {
            "moisture": 45,
            "temp": 28,
            "pH": 6.5,
            "npk": "N:20 P:10 K:30"
        }
        return data
    except Exception as e:
        print("Error fetching data from ESP32:", e)
        return {
            "moisture": 0,
            "temp": 0,
            "pH": 0,
            "npk": "N:0 P:0 K:0"
        }
