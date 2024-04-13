import numpy as np
from ultralytics import  YOLO
import cv2
import  pickle as pkl
import  matplotlib.pyplot as plt
# function which is returning the number of object detected
def number_object_detected(image):
    custom_model = YOLO(
        'best.pt')  # custom yolo model path
    results = custom_model(image, verbose=False)

    dic = results[0].names
    classes = results[0].boxes.cls.cpu().numpy()
    probability = results[0].boxes.conf

    class_count = {}
    unique_elements, counts = np.unique(classes, return_counts=True)
    for e, count in zip(unique_elements, counts):
        a = dic[e]
        class_count[a] = count

    """for r in results:
        im_array = r.plot(pil = True)  # plot a BGR numpy array of predictions
        array = im_array[..., ::-1]  # Convert BGR to RGB PIL image
        plt.axis("off")
        plt.imshow(array)
        plt.show()"""


    return class_count


def car_detection_and_Cropping(image_path):

    simple_yolo = YOLO('yolov8m.pt')
    r = simple_yolo(image_path, verbose=False)
    """
    for i in r:
        im_array = i.plot(pil=True)  # plot a BGR numpy array of predictions
        array = im_array[..., ::-1]  # Convert BGR to RGB PIL image
        plt.axis("off")
        plt.imshow(array)
        plt.show()
        """

    names = r[0].names
    boxes = r[0].boxes.xyxy.cpu().numpy().astype(int)
    classes = set(r[0].boxes.cls.cpu().numpy())
    classes2 = [names[i] for i in classes]

    # checking if the detected object is the car or not
    # if it is car then crop if not then pass the image as it is
    if boxes.size != 0 and 'car' in classes2:

        area = []
        for x1, y1, x2, y2 in boxes:
            area.append((x2 - x1) * (y2 - y1))
        max_index, max_a = max(enumerate(area), key=lambda x: x[1])

        # Load the image using OpenCV
        # image = cv2.imread(image_path)
        #
        # # Crop the image
        # crop_image = image[boxes[max_index][1]:boxes[max_index][3], boxes[max_index][0]:boxes[max_index][2]]
        opencv_image = cv2.cvtColor(np.array(image_path), cv2.COLOR_RGB2BGR)

        # Crop the image using OpenCV
        cropped_image = opencv_image[boxes[max_index][1]:boxes[max_index][3], boxes[max_index][0]:boxes[max_index][2]]
        # passing the crop image to the detection model

        class_c = number_object_detected(cropped_image)
    else:

        class_c = number_object_detected(image_path)
    return class_c


severity_points = {
    'scratch': 1,
    'dent': 2,
    'rust': 2,
    'paint-damage': 2,
    'crack':2
}

def calculate_condition_score(detections):
    total_score = 0
    for detection, count in detections.items():
        if detection in severity_points:
            total_score += severity_points[detection] * count
    return total_score

def normalize_score(score, max_score):
    return (score / max_score) * 10


## this function will take the image url and call all the related functions
def estimate_condition(detections):
    print("Detedtion list", detections)
    max_possible_score = sum(severity_points.values())  # Assuming all types of damage detected
    score = calculate_condition_score(detections)
    normalized_score = normalize_score(score, max_possible_score)

    # Assign condition rating
    if normalized_score <= 10:  # If score is low, condition is Excellent
        return "Excellent"
    elif normalized_score <= 16:  # If score is moderately low, condition is Good
        return "Good"
    elif normalized_score <= 20:  # If score is moderate, condition is Fair
        return "Fair"
    elif normalized_score <= 258:  # If score is moderately high, condition is Poor
        return "Poor"
    else:  # If score is high, condition is Very Poor
        return "Very Poor"


## loading the model
with open('Price_prediction_decision_tree.pkl', 'rb') as file:
    loaded_pipe_lr = pkl.load(file)

