import React from 'react';
import { Box, Typography, Grid, useTheme } from "@mui/material";
import Button from '@mui/material/Button';
import { AdjustOutlined } from '@mui/icons-material';
import { useGetData } from 'hooks/apiHook';

const DetailsGrid = ({
    mainUrl="http://localhost:3000/icons",
    vehicle,
    size=22
}) => {
    const {data:vehicleData} = useGetData(`vehicles/${vehicle.make}/${vehicle.model}`, '', {defValue: null});
    const data = { year: vehicle.year, kms: vehicle.mileage, fuelAvg: vehicleData?.engineC, fuel: vehicleData?.fuelType }
    const units = {
        kms: 'kms',
        fuelAvg: 'cc',
    }

    const { palette } = useTheme();
    return (
        <Grid container spacing={2}>
            {
                Object.keys(data).map((item) => (
                    <Grid item xs={6}>
                        <Box display="flex" flexDirection="row" alignItems={'center'} gap={'0.5rem'}>
                            <img
                                width={`${size}px`}
                                height={`${size}px`}
                                src={`${mainUrl}/${item}.png`} />
                            <Typography
                                color={palette.mode == 'dark'? 'white': undefined}
                            >
                                {data[item]?? 'N/A'} {units[item]}
                            </Typography>
                        </Box>
                    </Grid>
                ))
            }

        </Grid>
    );
};

export default DetailsGrid;
