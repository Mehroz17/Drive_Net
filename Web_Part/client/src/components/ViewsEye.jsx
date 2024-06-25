import React from 'react';
import Button from '@mui/material/Button';
import { Box, Typography } from '@mui/material';
import { Visibility } from '@mui/icons-material';

const ViewsEye = ({views = 0}) => {
  return (
    <Box 
    display={'flex'} 
    flexDirection={'row'}
    alignItems={'center'}
    bgcolor={'rgba(0,0,0,0.7)'}
      sx={{position:'absolute', bottom: '0.35rem', borderRadius: "0.75rem", padding: '0.15rem', margin: '0.2rem'}}
    > 
      <Typography variant='subtitle1' color={'white'}>{views}</Typography>     
      <Visibility style={{color: 'white', marginLeft: '0.25rem'}}/>
    </Box>
  );
};

export default ViewsEye;
