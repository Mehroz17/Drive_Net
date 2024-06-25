import React, { useEffect, useRef, useState } from 'react';
import { IconButton, Box, Button, TextField, Typography, Slider, InputLabel } from '@mui/material';
import { Formik } from 'formik';
import { useGetData } from 'hooks/apiHook';
import { setVehicleAds, setFilterApplied, setSearch } from 'state';
import { numberWithCommas } from 'utils/math';
//import * as yup from 'yup';
import WidgetWrapper from 'components/WidgetWrapper';


import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

//import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";

import { useDispatch, useSelector } from "react-redux";
//import useAlertBox from 'components/AlertBox';
import { useLocation } from 'react-router-dom';
import { AryIncludes, Includes, ToLacOrCrore } from 'utils/extra';

// Define Yup validation schema
// const vehicleAdSchema = yup.object().shape({
//   title: yup.string().required('Title is required'),
//   description: yup.string().required('Description is required'),
//   price: yup.number().required('Price is required').positive('Price must be a positive number'),
//   mileage: yup.number().required('Mileage is required').positive('Mileage must be a positive number'),
//   year: yup.number().required('Year is required').positive('Year must be a positive number').integer('Year must be an integer'),
//   make: yup.string().required('Make is required'),
//   model: yup.string().required('Model is required'),
//   city: yup.string().required('Location is required'),
//   area: yup.string().required('Location is required'),
//   cityReg: yup.string().required('Registration city is required'),
//   Color: yup.string().required('Color is required'),
//   images: yup.array().of(yup.string()).min(1, 'At least one image is required'),
// });



const FiltersWidget = ({ isNonMobileScreen = false }) => {
  const { data: vehicleMakes } = useGetData("vehicles", '', { defValue: [] });
  const { data: vehicleModels, getData: getVehicleModels } = useGetData(undefined, '', { defValue: [] });
  const [isOpen, setOpen] = useState(true);

  const query = new URLSearchParams(useLocation().search)
  const queryMake = query.get('make');
  const querySearch = query.get('search');

  const dispatch = useDispatch();

  const vehicleAdsAll = useSelector((state) => state.vehicleAdsAll)
  const isFilterApplied = useSelector(state => state.isFilterApplied)
  const search = useSelector(state => state.search);

  const prices = vehicleAdsAll.map(item => item.price);
  const mileages = vehicleAdsAll.map(item => item.mileage);
  const years = vehicleAdsAll.map(item => item.year);

  const [priceRange, setPriceRange] = useState([Math.min(...prices), Math.max(...prices)])
  const [mileageRange, setMileageRange] = useState([Math.min(...mileages), Math.max(...mileages)])
  const [yearRange, setYearRange] = useState([Math.min(...years), Math.max(...years)])

  const isCalled = useRef(false);

        

  const initialValues = {
    priceRange: priceRange,
    mileageRange: mileageRange,
    yearRange: yearRange,
    make: queryMake?? '',
    model: '',
    variant: '',
  };


  const openFilters = () => {
    setOpen(true);
  }

  const closeFilters = () => {
    setOpen(false);
  }

  const applyFilters = (values) => {
    //check if there is any value entered
    var isValue = false;
    for (const key in values) {
      if (values[key] && String(values[key]).length !== 0) {
        isValue = true;
        break;
      }
    }
    var filteredResults = [...vehicleAdsAll];
    const inValue = search.toLowerCase();
    filteredResults.forEach(item=>
      console.log(item.description, Includes(item.description, inValue))
    )
    if (inValue)
      filteredResults = filteredResults.filter(item =>
        item.make.toLowerCase() === inValue ||
        item.model.toLowerCase() === inValue
      );

    console.log(values.priceRange[0], values.priceRange[1]);
    filteredResults = filteredResults.filter(item => (item.price >= values.priceRange[0] && item.price <= values.priceRange[1]))
    filteredResults = filteredResults.filter(item => (item.mileage >= values.mileageRange[0] && item.mileage <= values.mileageRange[1]))
    filteredResults = filteredResults.filter(item => (item.year >= values.yearRange[0] && item.year <= values.yearRange[1]))

    filteredResults = filterResults(filteredResults, values, ['priceRange', 'mileageRange', 'yearRange'])

    if (isValue) {
      dispatch(setFilterApplied({ isFilterApplied: true }));
      dispatch(setVehicleAds({ vehicleAds: filteredResults }))
    }
  }

  

  function filterResults(data, params, omitKeys) {
    return data.filter(item => {
      for (const key in params) {
        if (omitKeys.includes(key))
          continue;
        if (params[key] !== '' && params[key] !== undefined) {
          if (item[key] !== params[key]) {
            return false;
          }
        }
      }
      return true;
    });
  }

  useEffect(() => {
    setOpen(isNonMobileScreen);
  }, [isNonMobileScreen]);

  if (queryMake && !isCalled.current){
    setTimeout(()=>{
      applyFilters(initialValues);
      isCalled.current = true;
    }, 500)
  }

  if (querySearch && !isCalled.current){
    setTimeout(()=>{
      const results = vehicleAdsAll.filter(item =>
        item.make.toLowerCase() === querySearch ||
        item.model.toLowerCase() === querySearch
      );
      dispatch(setVehicleAds({ vehicleAds: results }));
      dispatch(setSearch({ search: querySearch }))
    }, 500)
  }

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography variant="h4" fontWeight={500}
          mt={1} mb={1}
          ml={1}
        >
          Filters
        </Typography>

        <Typography variant="body2" >
          {isFilterApplied ? "(applied)" : ""}
        </Typography>

        {
          isOpen ?
            <IconButton onClick={closeFilters}>
              <KeyboardArrowUp />
            </IconButton>
            :
            <IconButton onClick={openFilters}>
              <KeyboardArrowDown />
            </IconButton>
        }
      </FlexBetween>
      {
        ((isOpen && isNonMobileScreen) || (isOpen && !isNonMobileScreen)) &&
        <Formik
          initialValues={initialValues}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit, // <-- Ensure handleSubmit is included
            isSubmitting,
            setFieldValue,
            resetForm
          }) => (
            <form onSubmit={handleSubmit}> {/* Use handleSubmit here */}

              <TextField
                fullWidth
                select
                label="Make"
                name="make"
                value={values.make}
                onChange={(event) => {
                  const selectedValue = event.target.value === '' ? undefined : event.target.value;
                  if (selectedValue)
                    getVehicleModels("vehicles/" + selectedValue);
                  handleChange({ target: { name: 'make', value: selectedValue } });
                }}
                onBlur={handleBlur}
                error={touched.make && Boolean(errors.make)}
                helperText={touched.make && errors.make}
                SelectProps={{
                  native: true,
                }}
                margin="normal"
              >
                <option value=""></option>
                {
                  vehicleMakes.map(make => (<option value={make}>{make}</option>))
                }
              </TextField>
              <TextField
                fullWidth
                select
                label="Model"
                name="model"
                value={values.model}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.model && Boolean(errors.model)}
                helperText={touched.model && errors.model}
                SelectProps={{
                  native: true,
                }}
                margin="normal"
              >
                <option value=""></option>
                {
                  vehicleModels.sort().map(model => (<option value={model}>{model}</option>))
                }
              </TextField>
              <TextField
                fullWidth
                label="Variant (Optional)"
                name="variant"
                value={values.variant}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.variant && Boolean(errors.variant)}
                helperText={touched.variant && errors.variant}
                margin="normal"
              />

              <InputLabel>Price Range</InputLabel>
              <Slider
                value={priceRange}
                onChange={(e, value) => {
                  setPriceRange(value);
                  values.priceRange = value;
                }}
                min={Math.min(...prices)}
                max={Math.max(...prices)}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
              />
              <Box display={'flex'} justifyContent={'space-between'}>
                <Typography>{ToLacOrCrore(priceRange[0])}</Typography>
                <Typography>{ToLacOrCrore(priceRange[1])}</Typography>
              </Box>

              <InputLabel>Mileage Range</InputLabel>
              <Slider
                value={mileageRange}
                onChange={(e, value) => {
                  setMileageRange(value);
                  values.mileageRange = value;
                }}
                min={Math.min(...mileages)}
                max={Math.max(...mileages)}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
              />

              <Box display={'flex'} justifyContent={'space-between'}>
                <Typography>{numberWithCommas(mileageRange[0])}</Typography>
                <Typography>{numberWithCommas(mileageRange[1])}</Typography>
              </Box>

              <InputLabel>Model Year Range</InputLabel>
              <Slider
                value={yearRange}
                onChange={(e, value) => {
                  setYearRange(value);
                  values.yearRange = value;
                }}
                min={Math.min(...years)}
                max={Math.max(...years)}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
              />

              <Box display={'flex'} justifyContent={'space-between'}>
                <Typography>{yearRange[0]}</Typography>
                <Typography>{yearRange[1]}</Typography>
              </Box>

              {
              /* <TextField
                fullWidth
                select
                label="Year"
                name="year"
                type='number'
                value={values.year}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.year && Boolean(errors.year)}
                helperText={touched.year && errors.year}
                SelectProps={{
                  native: true,
                }}
                margin="normal"
              >
                <option value=""></option>
                {
                  [...Array(2025 - 1900).keys()].reverse().map(x => <option value={(""+(x + 1900))}>{x + 1900}</option>)
                }
              </TextField> */
              }

              <Button onClick={() => { applyFilters(values); }}>
                apply
              </Button>
              <Button onClick={() => {
                resetForm();
                
                setPriceRange([Math.min(...prices), Math.max(...prices)]);
                setMileageRange([Math.min(...mileages), Math.max(...mileages)]);
                setYearRange([Math.min(...years), Math.max(...years)]);

                const inValue = search.toLowerCase();
                var filteredResults = vehicleAdsAll;

                if (inValue)
                  filteredResults = filteredResults.filter(item =>
                    item.make.toLowerCase() === inValue ||
                    item.model.toLowerCase() === inValue
                  )
                dispatch(setVehicleAds({ vehicleAds: filteredResults }));
                dispatch(setFilterApplied({ isFilterApplied: false }));
              }}>
                clear
              </Button>
            </form>
          )}
        </Formik>
      }
    </WidgetWrapper>
  );
};

export default FiltersWidget;
