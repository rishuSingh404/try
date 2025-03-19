#include <WiFi.h>
#include <WiFiClient.h>
#include <WebServer.h>

// Replace with your network credentials
const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";

// Setup a web server on port 80
WebServer server(80);

// Mock sensor data or read from actual sensors
int soilMoisture = 45;
float temperature = 28.0;
float pH = 6.5;
String npk = "N:20 P:10 K:30";

void handleSensorData() {
  // Build a JSON response
  String jsonResponse = "{";
  jsonResponse += "\"moisture\":" + String(soilMoisture) + ",";
  jsonResponse += "\"temp\":" + String(temperature) + ",";
  jsonResponse += "\"pH\":" + String(pH) + ",";
  jsonResponse += "\"npk\":\"" + npk + "\"";
  jsonResponse += "}";

  server.send(200, "application/json", jsonResponse);
}

void setup() {
  Serial.begin(115200);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi..");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected.");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  // Route for /sensor-data
  server.on("/sensor-data", handleSensorData);

  // Start server
  server.begin();
  Serial.println("HTTP server started");
}

void loop() {
  // Handle client requests
  server.handleClient();
}
