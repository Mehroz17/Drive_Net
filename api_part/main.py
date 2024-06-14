from flask import Flask , request , jsonify
import support as st
import io
from PIL import Image
from flask_cors import CORS


def predict_price(images,model_year,milage,city_r,color,engine_c,car_brand,car_name,trans,fuel,cate):
    damage_dic = {}
    for i, image in enumerate(images):
        img_bytes = image.read()
        img_data = io.BytesIO(img_bytes)
        img = Image.open(img_data)

        data = st.car_detection_and_Cropping(img)

        for key in data.keys():

            if key in damage_dic:
                damage_dic[key] += data[key]
            else:
                damage_dic[key] = data[key]

    condition = st.estimate_condition(damage_dic)
    print(model_year,milage,city_r,color,engine_c,car_brand,car_name,trans,fuel,condition,cate)
    price = st.loaded_pipe_lr.predict([[model_year,milage,city_r,color,engine_c,car_brand,car_name,trans,fuel,condition.lower(),cate]])
    price = round(price[0],2)
    print('Original Price is -->',price)

    if car_name in ['Civic','Corolla','Fortuner','Vitz','Tucson','Sonta']:
        if condition == 'Good':
            price -= 2
        elif condition == 'Fair':
            price -= 3
        elif condition == 'Poor':
            price -= 4
        elif condition == 'Very Poor':
            price -= 5
    return  price,condition

## for calculating the tolerence i am using the Mean Absolute Error of my model
mean_absolute_error = 2.57

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
@app.route('/predict',methods  = ['POST'])
def predict():
    print(request.form)
    print("Images",request.files.getlist('images'))
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

    price,body_condition = predict_price(images,model_year,milage,city_r,color,engine_c,car_brand,car_name
                          ,trans,fuel,cate)
    print('price 2',price)
    if price > 100:
        lower_limit = f'{round((price - (mean_absolute_error+5))/100,2)} crore'
        upper_limit = f'{round((price + mean_absolute_error)/100,2)} crore'
        #p = round(price/100,2)
        price = f"{round(price / 100, 2)} crore"
    else:
        lower_limit = f'{round(price[0] - mean_absolute_error,2)}  lacs'
        upper_limit = f'{round(price[0] + mean_absolute_error ,2)} lacs'
        #p = round(price / 100, 2)
        price = f"{round(price , 2)} lacs"

    print("predicted" ,price)
    return jsonify({'result': 'Predicted Price is ','body_condition':body_condition,'predicted_price':price,'lower_limit':lower_limit,'upper_limit':upper_limit})


if __name__ == '__main__':
    #app.run(debug=True,port=3000)
    app.run(host='192.168.10.20', port=4000, debug=True)