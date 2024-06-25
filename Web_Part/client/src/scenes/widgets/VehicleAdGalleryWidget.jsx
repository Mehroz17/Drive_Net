import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setVehicleAds, setVehicleAdsAll } from "state";

import { useMediaQuery, Typography, Box, useTheme, Select, MenuItem, InputBase, FormControl, Button } from "@mui/material";
import Center from "components/Center";
import VehicleAdWidget from "./VehicleAdWidget";
import { useNavigate } from "react-router-dom";

const VehicleAdWidgetGallery = ({ heading, isProfile = false, isAdmin = false, limit }) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const posts = useSelector((state) => state.vehicleAds);
  //const vehicleAdsAll = useSelector(state => state.vehicleAdsAll);
  const token = useSelector((state) => state.token);
  const isFilterApplied = useSelector(state => state.isFilterApplied);
  const search = useSelector(state => state.search);

  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const url = "http://localhost:3001/market" + (isAdmin ? "/all" : "");
  const getVehicleAds = async () => {
    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setVehicleAds({ vehicleAds: data }));
    dispatch(setVehicleAdsAll({ vehicleAdsAll: data }));
  };

  const sortOptions = [
    "Date: Recent First",
    "Date: Oldest First",
    "Model Year: Latest First",
    "Model Year: Oldest First",
    "Price: Low to High",
    "Price: High to Low",
    "Mileage: Low to High",
    "Mileage: High to Low",
  ]

/*   const filterOptions = [
    "All",
    "New",
    "Approved",
    "Rejected",
  ] */

  const [sortBy, setSortBy] = useState(sortOptions[0]);
 // const [filterBy, setFilterBy] = useState(filterOptions[0]);

  const sort = (selectedOption) => {
    //alert(selectedOption);
    let i = 0;
    for (let option of sortOptions) {
      if (option === selectedOption)
        break;
      i++;
    }

    var sorted = []
    const zero = i % 2;
    //sort by Date
    if (i === 0 || i === 1) {
      sorted = [...vehicleAds].sort((v1, v2) => { return new Date((zero ? v2 : v1).updatedAt) - new Date((zero ? v1 : v2).updatedAt) });
    }
    //sort by year
    else if (i === 2 || i === 3) {
      sorted = [...vehicleAds].sort((v1, v2) => { return (zero ? v1 : v2).year - (zero ? v2 : v1).year });
    }
    //sort by price
    else if (i === 4 || i === 5) {
      sorted = [...vehicleAds].sort((v1, v2) => { return (zero ? v2 : v1).price - (zero ? v1 : v2).price });
    }
    //sort by mileage
    else if (i === 6 || i === 7) {
      sorted = [...vehicleAds].sort((v1, v2) => { return (zero ? v2 : v1).mileage - (zero ? v1 : v2).mileage });
    }

    dispatch(setVehicleAds({ vehicleAds: sorted }));

  }
  useEffect(() => {
    getVehicleAds();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

/*   const filter = () => {

  } */

  // Reverse the order of posts array
  const vehicleAds = posts;

  return (
    <>
      {!vehicleAds || vehicleAds.length === 0 ? (
        <Center>


          <Typography variant="h3" color="textSecondary">
            {
              isFilterApplied ?
                "No Vehicles based on current filters!" :
                search ? `No results found for '${search}'` : "No Vehicles Listed for sale yet!"
            }
          </Typography>
        </Center>
      ) : (
        <Box
          width="100%"
          padding="1rem 2%">
          <Box display={'flex'} justifyContent={'space-between'}>
            <Box>
              <Typography variant="h4" fontWeight={500}
                mb={1}
              >
                {heading}
              </Typography>
              {/* <Link href={"http://localhost:3000/market"} target="_blank">View All Vehicles</Link> */}
            </Box>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="button" style={{ marginRight: '8px' }}>Sort By</Typography>
              <FormControl>
                <Select
                  onChange={(event) => {
                    const value = event.target.value;
                    setSortBy(value);
                    sort(value);
                  }}
                  value={sortBy}
                  sx={{
                    backgroundColor: neutralLight,
                    width: "15rem",
                    borderRadius: "0.25rem",
                    p: "0.25rem 0.5rem",
                    "& .MuiSvgIcon-root": {
                      pr: "0.1rem",
                      width: "2rem",
                    },
                    "& .MuiSelect-select:focus": {
                      backgroundColor: neutralLight, // Adjust as needed
                    },
                  }}
                  input={<InputBase />}
                >
                  {sortOptions.map(item => (
                    <MenuItem value={item}>
                      <Typography>{item}</Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </Box>

          <Box
            display="grid"
            style={{
              gridTemplateColumns: `repeat(auto-fill, minmax(${isNonMobileScreens ? "30%" : "100%"}, 1fr))`,
              gap: '0.5rem'
            }}
          >
            {(limit ? vehicleAds.slice(0, limit) : vehicleAds).map((item) => (
              <VehicleAdWidget
                isAdmin={isAdmin}
                key={item.title} // Add a unique key for each item in the map function
                vehicle={item}
                redirectTo={'/market/' + item._id}
              />
            ))}

          </Box>
          {
            limit &&
            <Box display={'flex'} justifyContent='center'>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ marginTop: isNonMobileScreens ? '1.5rem' : '0.2rem' }}
                onClick={() => { navigate('/market') }}
              >
                Go to Market
              </Button>
            </Box>
          }
        </Box>

      )}
    </>
  );
};

export default VehicleAdWidgetGallery;
