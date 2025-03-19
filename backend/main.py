import uvicorn
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from PIL import Image
import numpy as np
import tflite_runtime.interpreter as tflite
from esp32_service import get_esp32_data

app = FastAPI()

# Load TFLite model
interpreter = tflite.Interpreter(model_path="model/plant_disease_model.tflite")
interpreter.allocate_tensors()

# Helper to preprocess image into model input shape
def preprocess_image(image: Image.Image, input_shape):
    image = image.resize((input_shape[1], input_shape[2]))
    img_array = np.array(image).astype("float32")
    # Normalize or scale as your model requires
    img_array = img_array / 255.0
    # Expand dims to match model input
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

@app.get("/sensor-data")
def sensor_data():
    """
    Returns sensor data from ESP32 or mock data.
    Example: { "moisture": 45, "temp": 28, "pH": 6.5, "npk": "N:20 P:10 K:30" }
    """
    data = get_esp32_data()
    return data

@app.post("/predict")
async def predict_disease(file: UploadFile = File(...)):
    """
    Receives an image, runs TFLite inference, and returns disease + solution.
    """
    # Read file into Pillow Image
    contents = await file.read()
    image = Image.open(bytearray(contents))

    # Preprocess
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    input_data = preprocess_image(image, input_details[0]['shape'])

    # Set input tensor
    interpreter.set_tensor(input_details[0]['index'], input_data)
    interpreter.invoke()

    # Get output
    output_data = interpreter.get_tensor(output_details[0]['index'])
    # Suppose your model outputs a probability vector of classes
    predicted_class_idx = np.argmax(output_data)
    
    # Example: let's define a mock mapping of class index to disease + solution
    # You must adapt this to your actual classes
    classes = [
        {"name": "Tomato Early Blight", "solution": "Apply Mancozeb fungicide"},
        {"name": "Tomato Late Blight", "solution": "Use copper-based fungicide"},
        {"name": "Healthy", "solution": "No treatment needed"}
    ]
    
    if predicted_class_idx < len(classes):
        disease_name = classes[predicted_class_idx]["name"]
        solution = classes[predicted_class_idx]["solution"]
    else:
        disease_name = "Unknown"
        solution = "No known solution"

    return JSONResponse({
        "prediction": disease_name,
        "solution": solution
    })

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
