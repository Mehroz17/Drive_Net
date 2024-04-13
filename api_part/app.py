from flask import Flask , request , jsonify
import support as st
import io
from PIL import  Image
from flask_cors import CORS




## for calculating the tolerence i am using the Mean Absolute Error of my model
mean_absolute_error = 2.57


def predict_price(images,model_year,milage,city_r,color,engine_c,car_brand,car_name,trans,fuel,cate):
    for i , image in enumerate(images):
        img_bytes = image.read()
        img_data = io.BytesIO(img_bytes)
        img = Image.open(img_data)

        damage_dic = {}
        data = st.car_detection_and_Cropping(img)
        print(data)
        for key in data.keys():
            if key in damage_dic:
                damage_dic[key] += data[key]
            else:
                damage_dic[key] = data[key]
    condition = st.estimate_condition(damage_dic)
    print(model_year,milage,city_r,color,engine_c,car_brand,car_name,trans,fuel,condition,cate)
    price = st.loaded_pipe_lr.predict([[model_year,milage,city_r,color,engine_c,car_brand,car_name,trans,fuel,condition.lower(),cate]])
    return  price


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
@app.route('/',methods  = ['POST'])
def predict():
    # getting all the texts
    model_year = int(request.form.get("model_year"))
    milage = int(request.form.get("milage"))
    city_r = request.form.get("city_registered").lower()
    color = request.form.get("color").lower()
    engine_c = int(request.form.get("engine_c"))
    car_brand = request.form.get("car_brand").lower()
    car_name = request.form.get("car_name").lower()
    trans = request.form.get("trans").lower()
    fuel = request.form.get("fuel_type").lower()
    cate = request.form.get("cate").lower()

    # getting the images
    images = request.files.getlist('images')

    # passing all the data to price_predict Function

    price = predict_price(images,model_year,milage,city_r,color,engine_c,car_brand,car_name
                          ,trans,fuel,cate)

    if price[0] > 100:
        lower_limit = str(price[0] - (mean_absolute_error+5)) + 'crore'
        upper_limit = str(price[0] + mean_absolute_error) + 'crore'
        price = str(price[0]) + 'crore'
    else:
        lower_limit = str(price[0] - mean_absolute_error) + 'lacs'
        upper_limit = str(price[0] + mean_absolute_error )+ 'lacs'
        price = str(price[0] )+ 'lacs'

    print("predicted" ,price)
    return jsonify({'result': 'Price is Predicted','predicted_price':price,'lower_limit':lower_limit,'upper_limit':upper_limit})
