import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import WidgetWrapper from './WidgetWrapper';

const RoundProgressBar = ({ value, valueText, title="x", size = 75, thickness = 5, color = 'primary', isValue=false}) => {
    console.log(value)
    return (
    <Box display={"inline-flex"} margin={1}>
        <WidgetWrapper>
        <Box position="relative" display="inline-flex">

      <CircularProgress
        variant={'determinate'}
        value={isValue?Math.max(value, 1): 100} /* at least show some progress if value is 0 */
        size={size}
        thickness={thickness}
        color={color}
        style={{position: 'absolute'}}
      />

      <CircularProgress
        style={{ color: 'rgba(0, 0, 0, 0.1)' }}
        variant="determinate"
        value={100}
        size={size}
        thickness={thickness}
      />

      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          {/* Display progress value */}
          {/* You can customize this text */}
          <Box component="span" fontSize="small">{valueText}</Box>
        </Box>
        
      </Box>
      
    </Box>

        {/* <h6 style={{maxWidth: 50, backgroundColor: 'red', textAlign: 'center'}}>
            {title}
        </h6> */}
        <Typography
            width={'100%'}
            maxWidth={size}
            fontSize={11}
            textAlign='center'
          >
            {title}
        </Typography>
        </WidgetWrapper>
    </Box>
  );
};

export default RoundProgressBar;
