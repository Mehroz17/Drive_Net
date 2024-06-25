import React, { useState } from 'react';
import { Button, Box } from '@mui/material';
import { styled } from '@mui/system';

const StyledButton = styled(Button)(({ theme, selected }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: selected ? theme.palette.primary.main : theme.palette.action.selected,
  color: selected ? theme.palette.primary.contrastText : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: selected ? theme.palette.primary.dark : theme.palette.action.hover,
  },
}));

const CarFeaturesSelector = ({onChange, prevFeatures}) => {
  const [selectedFeatures, setSelectedFeatures] = useState(prevFeatures?prevFeatures:[]);

  const carFeatures = [
    'Cruise Control',
    'Keyless Entry',
    'Bluetooth',
    'Backup Camera',
    'Remote Start',
    'Blind Spot Monitoring',
    'Navigation System',
    'Heated Seats',
    'Leather Seats',
    'Sunroof',
    'Alloy Wheels',
    'Adaptive Cruise Control',
    'Lane Departure Warning'
  ];

  const handleFeatureClick = (feature) => {
    const newFeatures = 
        selectedFeatures.includes(feature)
          ? selectedFeatures.filter((f) => f !== feature)
          : [...selectedFeatures, feature]
    setSelectedFeatures(newFeatures);
    onChange(newFeatures);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h3>Select Vehicle Features</h3>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {carFeatures.map((feature) => (
          <StyledButton
            key={feature}
            selected={selectedFeatures.includes(feature)}
            onClick={() => handleFeatureClick(feature)}
          >
            {feature}
          </StyledButton>
        ))}
      </Box>
    </Box>
  );
};

export default CarFeaturesSelector;
