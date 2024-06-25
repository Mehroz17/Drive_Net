import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'inline-block',
  padding: theme.spacing(0.5, 1),
  margin: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  borderWidth: 2,
  borderStyle: 'solid',
  borderColor: 'orange',
//   color: theme.palette.primary.main,
}));

const SelectedFeaturesDisplay = ({ selectedFeatures }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {selectedFeatures.length > 0 ? (
          selectedFeatures.map((feature, index) => (
            <StyledBox key={index}>
              {feature}
            </StyledBox>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            No features selected.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default SelectedFeaturesDisplay;
