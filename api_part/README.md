# 🚗 Drive Net API

## Introduction

Welcome to the Car Price Prediction API! This API is built using Flask and is designed to predict the price and body condition of a car based on various input features. The model leverages machine learning to provide accurate and reliable predictions.

## Features

- **💰 Car Price Prediction**: Predicts the price of a car based on various attributes.
- **🛠️ Condition Estimation**: Estimates the body condition of the car.
- **📷 Image Processing**: Analyzes images of the car to detect and crop relevant areas.
- **🌐 Flexible Input**: Accepts multiple images and various car attributes for prediction.

### Built With

- 🐍 Python 3.10.13
- 🌐 Flask
- 🖼️ PIL (Python Imaging Library)
- 🌍 Flask-CORS
- 🦾 Ultralytics
- 📦 Pickle

## Files Explanation

### `main.py`


This file contains the main logic for the Car Price Prediction API. It connects with the front end, handles incoming requests, processes input data, and calls functions from the `support.py` file to predict the car price and estimate the body condition.

#### Key Functions

1. **predict_price(images, model_year, milage, city_r, color, engine_c, car_brand, car_name, trans, fuel, cate)**:
   - **Description**: Processes car images and attributes to predict the price and estimate the body condition.
   - **Input**: Various car attributes and a list of images.
   - **Output**: Predicted price and body condition.

2. **predict()**:
   - **Description**: Flask route to handle POST requests for price prediction.
   - **Input**: Form data including car attributes and images.
   - **Output**: JSON response with predicted price, body condition, and price range.
     
### `Support2.py`

The `Support2.py` file contains essential functions that power the Car Price Prediction API. This script includes methods for image processing, condition estimation using a custom YOLO model, and price prediction using a custom-built machine learning model. Below is an overview of its key functionalities:

## Key Functionalities

1. **🚗 Car Detection and Cropping**:
   - Utilizes a custom YOLO model (`yolov8m.pt`) to detect and crop images of cars.
   - Ensures that only relevant parts of the car are analyzed for condition estimation and price prediction.
   - Handles multiple images, aggregating detected features for a comprehensive analysis.

2. **🔍 Damage Detection**:
   - Uses a custom YOLO model (`best.pt`) to detect specific types of damages (e.g., scratches, dents, rust).
   - Identifies the type and number of damages present in the car images.
   - Returns a dictionary of detected damages and their counts.

3. **🔧 Condition Estimation**:
   - Analyzes detected damages to estimate the overall body condition of the car.
   - Aggregates damage data to classify the car's condition into categories like Excellent, Good, Fair, Poor, or Very Poor based on the detected damages.
   - Uses a scoring system to quantify the severity of damages and normalize the condition score.

4. **💵 Price Prediction**:
   - Loads a pre-trained machine learning model (`Price_prediction_decision_tree.pkl`) to predict the price of the car.
   - Takes into account various features such as model year, mileage, city of registration, color, engine capacity, brand, model name, transmission type, fuel type, condition, and category.
   - Returns an estimated price, considering adjustments based on the car's condition and specific model characteristics.

## Functions

### `number_object_detected(image)`
- **Description**: Detects specific types of damages in the provided image using a custom YOLO model.
- **Input**: `image` - An image file.
- **Output**: A dictionary containing the types of damages and their counts.

### `car_detection_and_Cropping(image_path)`
- **Description**: Detects and crops relevant parts of the car from the given image, then detects damages in the cropped image.
- **Input**: `image_path` - Path to the image file.
- **Output**: A dictionary containing the detected damages and their counts.

### `calculate_condition_score(detections)`
- **Description**: Calculates the total condition score based on detected damages.
- **Input**: `detections` - A dictionary of detected damages and their counts.
- **Output**: An integer representing the total condition score.

### `normalize_score(score, max_score)`
- **Description**: Normalizes the condition score to a 10-point scale.
- **Input**: `score` - The total condition score, `max_score` - The maximum possible condition score.
- **Output**: A float representing the normalized condition score.

### `estimate_condition(detections)`
- **Description**: Estimates the overall condition of the car based on the normalized condition score.
- **Input**: `detections` - A dictionary of detected damages and their counts.
- **Output**: A string indicating the estimated condition (e.g., 'Excellent', 'Good', 'Fair', 'Poor', 'Very Poor').

### `loaded_pipe_lr.predict(features)`
- **Description**: Predicts the price of the car based on various input features.
- **Input**: `features` - A list of car attributes including model year, mileage, city, color, engine capacity, brand, model name, transmission type, fuel type, condition, and category.
- **Output**: A float representing the predicted price of the car.

## Index.html
The `index.html` file serves as a testing interface for the Car Price Prediction API. It contains a form that mimics the input fields expected by the API, allowing users to simulate requests and receive responses directly from the API.

