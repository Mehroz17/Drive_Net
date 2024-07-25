# DriveNet - Final Year Project 🚗🔧

Welcome to the DriveNet repository! This is my Final Year Project (FYP), focusing on car selling with AI.

![Leonardo_Diffusion_XL_make_me_an_logo_for_DriveNet_and_logo_ha_1](https://github.com/Mehroz786/DriveNet/assets/72649379/cc45d8d4-4948-45be-89ab-002c96370b6b)

#Project Video 🎥

https://github.com/user-attachments/assets/52c2ce81-04ec-48aa-9222-4f0b8c96b82c


## Overview 🌐

In today's fast-paced digital age, the art of selling vehicles is undergoing a profound transformation. This shift is driven by the fusion of technology and evolving consumer tastes. When someone decides to sell/buy a car, they often face questions like "Which is the best platform for selling or purchasing vehicles “or "What's the right price?" or "How can I connect with fellow car enthusiasts?" or "Is there someone for guiding me?”. Often sellers regret selling their vehicle for a lower price while buyers regret paying a higher price than the actual price of the vehicle. This project, called " DriveNet " aims to provide a solution to all these questions and issues. We're creating a unique website that can estimate a car's value and also lets people chat with others who share their love for cars.
Additionally, it keeps you in the loop about vehicle-related events by integrating the vehicle community. It performs two crucial functions. Firstly, it harnesses the power of advanced technology to estimate a vehicle's worth accurately, empowering sellers with knowledge and confidence. Secondly, it fosters connections among car enthusiasts, offering them a place to engage in vibrant discussions, share their passion, and access information on upcoming automotive events in their local communities. 
The primary objective of this project is to simplify the car-selling process, enriching it not only in terms of financial gain but also by enhancing the enjoyment and knowledge of everyone involved. We invite you to be a part of our mission as we strive to reshape and elevate the experience of selling vehicles in the modern digital era. 
 


## Problem Statement ❓
In today's digital age, the re-selling of old vehicles through online marketplaces has become increasingly popular. However, both sellers and buyers face several challenges in this process. One of the most significant challenges is determining the optimal selling price for used items. Sellers often struggle to set a competitive price that reflects the item's true value, while buyers aim to make informed purchasing decisions based on fair market prices. 
While vehicle owners often seek opportunities to connect with like-minded individuals who share a passion for automobiles. And buyers are looking for people for guidance about the right vehicle and its price of course. However, finding relevant events and establishing connections within the automotive community can be challenging.

## Our Solution
![image](https://github.com/user-attachments/assets/b06b7ffc-6f12-4f49-878b-6fa51ceb83b4)

##  Steps to Build the DriveNet Model 🪜
### Data Collection and Preprocessing 📊
Scrapping Images and all details of cars from different car-selling websites
### Data Annotation 🔧
Labeling of images for computer vision model using Label Studio
### Fine Tuning the YOLO(You Only Look Once) 🧠
Fine-tuning the yolov8 model to get the body condition of the cars, then the body condition will be used along with other features to predict the price of the car.
### Data Cleaning 
Removing the anomalies and irregularities from the descript data. 
### Price Prediction Model 📈
To predict the car price I experimented with the following models
* Linear Regressor
* Decision Tree Regression
* XGBoost
* Random Forest Regressor
And in last the "Decision Tree Regression" with better results was finalized.

## Tools and Technologies
<p align="center">
  <a>
    <img src="https://skillicons.dev/icons?i=js,react,nodejs,express,mongodb,materialui,redux,vscode,py,selenium,tensorflow,sklearn,flask,pycharm," />
    
   </a>
</p>
<p align = 'center'>
 <a href = 'https://docs.ultralytics.com/'>
  <img src='https://github.com/user-attachments/assets/38ef3e92-eeea-44d0-87c7-6cfd4560971d' height='45' width='45' />
 </a>
</p>

## Hugging Face Link of Model 🚀
https://huggingface.co/spaces/AIQuest/Drive-Net/


