import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, LinearProgress } from "@mui/material";
import IconBtn from './IconBtn';
import Button from '@mui/material/Button';
import { AdjustOutlined } from '@mui/icons-material';
import { GetStringsWithDelay, ToLacOrCrore } from 'utils/extra';

const Predictor = ({ vehicle, onPrediction, onGetDetails, isRaw  }) => {
    const [prediction, setPrediction] = useState({
        upper_limit: 0,
        lower_limit: 0,
        predicted_price: 0
    });
    const [isPredicting, setIsPredicting] = useState(false);
    const [loopingText, setLoopingText] = useState("Extracting Car Body's Conditions using Computer Vision");

    const texts = [
        "Extracting Car Body's Conditions using Computer Vision",
        "Identifying Scratches, Dents, Paint Damage, Rustness",
        "Extracting given features of Car for Predicting Car Price",
        "Predicting Car Price"
    ];

    useEffect(() => {
        let currentIndex = 0;
        const intervalId = setInterval(() => {
            currentIndex = (currentIndex + 1) % texts.length;
            setLoopingText(texts[currentIndex]);
        }, 2000); // Change text every 2 seconds

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);

    async function fetchImageAsBlob(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get('Content-Type');
        const extension = contentType.split('/')[1];
        const blob = await response.blob();
        return { blob, extension };
    }

    const getPrediction = async () => {
        if (isRaw)
            console.log('vehicle', vehicle);
        setIsPredicting(true);
        const url = `http://localhost:3001/vehicles/${vehicle.make}/${vehicle.model}${vehicle.variant ? "?" + vehicle.variant : ""}`;
        const res = await fetch(url, { method: "GET" });
        var vehDetails = {};
        try{
          vehDetails = await res.json();
        }catch(e){
          setPrediction({ predicted_price: "No vehicle details exist! Contact Admin" });
          setIsPredicting(false);
          return;
        }

        if (!vehDetails) {
            alert("No Vehicle Details Found!");
            setIsPredicting(false);
            return;
        }

        if (onGetDetails)
            onGetDetails(vehDetails);

        const formData = new FormData();
        formData.append('car_brand', vehicle.make);
        formData.append('car_name', vehicle.model);
        formData.append('milage', vehicle.mileage);
        formData.append('model_year', vehicle.year);
        formData.append('city_registered', vehicle.cityReg);
        formData.append('color', vehicle.color);
        formData.append('engine_c', vehDetails.engineC);
        formData.append('fuel_type', vehDetails.fuelType);
        formData.append('trans', vehDetails.transType);
        formData.append('cate', vehDetails.category);

        if (isRaw){
            vehicle.images.forEach(item=>{
                formData.append('images', item);
            })
            
        }else{
            const imageURLs = vehicle.images.map(item => 'http://localhost:3001/assets/' + item);
            const results = await Promise.all(imageURLs.map(url => fetchImageAsBlob(url)));
            results.forEach(({ blob, extension }, index) => {
                formData.append(`images`, blob, `image${index + 1}.${extension}`);
            });
        }
        

        try {
            const response = await fetch(`http://192.168.1.12:4000/predict`, {
                method: "POST",
                body: formData
            });
            const data = await response.json();
            setPrediction(data);
            setIsPredicting(false);
            if (onPrediction)
                onPrediction(data);
        } catch (e) {
            console.log(e);
            setPrediction({ predicted_price: "Failed to predict!" });
            setIsPredicting(false);
        }
    }

    const { palette } = useTheme();
    return (
        <Box>
            <Typography variant="p" fontWeight={500}>
                Estimate the worth of this vehicle using our AI model
            </Typography>
            <Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '60%',
                        float: 'left',
                        borderRadius: '20px', // Adjust the border radius as needed
                        border: '1px solid #BDBDBD', // Optionally, add a border for outline
                        padding: '8px 12px', // Adjust padding as needed
                        backgroundColor: '#F5F5F5', // Optionally, set background color
                    }}
                >
                    <Typography>
                        {isRaw ? prediction.predicted_price : prediction.predicted_price == 0 && vehicle.estPrice? ToLacOrCrore(vehicle.estPrice) : prediction.predicted_price}
                    </Typography>
                    <Typography>
                        PKR
                    </Typography>
                </Box>
                <img
                    width="50px"
                    height="50px"
                    alt="post"
                    style={{ objectFit: "cover", marginTop: "1rem", marginLeft: "-1.4rem" }}
                    src={`http://localhost:3000/icons/price_tag.png`}
                />
                <IconBtn text="Estimate" isDisabled={vehicle.estPrice} style={{ float: 'right', color: 'white' }}
                    icon="http://localhost:3000/icons/ai.png"
                    onPress={getPrediction}
                    
                />
                {isPredicting && (
                    <>
                        <LinearProgress />
                        <Typography sx={{ marginTop: '0.5rem', fontStyle: 'italic' }}>
                            {loopingText}
                        </Typography>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default Predictor;
