import { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  Button,
  Modal,
} from "@mui/material";
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
} from "@mui/icons-material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout, setCities, setSearch } from "state";
import { useNavigate, Link, useLocation } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";

import { useGetData } from "hooks/apiHook";

import { setVehicleAds } from "state";
import CustomModal from "components/CustomModal";
import Login from "scenes/loginPage/Login";
import LoginPage from "scenes/loginPage";

const SearchAndCity = ({ onSearch = () => { } }) => {

  const [isModalOpen, setModalOpen] = useState(false);
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const cities = useSelector(state => state.cities);
  const vehicleAds = useSelector((state) => state.vehicleAds);
  const vehicleAdsAll = useSelector(state => state.vehicleAdsAll);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const search = useSelector(state => state.search);


  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;

  const query = new URLSearchParams(useLocation().search)
  const queryLocation = query.get('location');
  const [currentLocation, setCurrentLocation] = useState(queryLocation ?? "Pakistan");

  const [inputValue, setInputValue] = useState('');

  useGetData('location', '', {
    onSuccess: (data) => {
      dispatch(setCities({ cities: data }));
    }
  });




  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      const inValue = inputValue.toLowerCase()
      const results = vehicleAdsAll.filter(item =>
        item.make.toLowerCase() == inValue ||
        item.model.toLowerCase() == inValue
      );
      dispatch(setVehicleAds({ vehicleAds: results }));
      dispatch(setSearch({ search: inputValue }))
    }
  };

  const handleSubmit = () => {
    setInputValue('');
  };

  return (
    <Box>
      <FlexBetween gap="0.25rem">
        {(
          <FlexBetween
            backgroundColor={neutralLight}
            borderRadius="9px"
            gap="1rem"
            padding="0.1rem 1.5rem"
          >
            <InputBase placeholder="Search..."
              sx={{width: '30vw'}}
              value={inputValue}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
            />
            <Box display={'flex'}>
              {
                search &&
                <IconButton onClick={() => {
                  dispatch(setVehicleAds({ vehicleAds: vehicleAdsAll }));
                  dispatch(setSearch({ search: '' }));
                  setInputValue('');
                }}>
                  <Close />
                </IconButton>
              }
              <IconButton>
                <Search />
              </IconButton>
            </Box>
          </FlexBetween>
        )}

        {isNonMobileScreens && (
          <FlexBetween
            backgroundColor={neutralLight}
            borderRadius="9px"
            padding="0.1rem 0.1rem"
            maxWidth={"15rem"}
          >
            <IconButton>
              <LocationOnIcon />
            </IconButton>

            <Select
              value={currentLocation}
              onChange={(event) => {
                const val = event.target.value;
                setCurrentLocation(val);
                if (val == "Pakistan")
                  dispatch(setVehicleAds({ vehicleAds: vehicleAdsAll }))
                else
                  dispatch(setVehicleAds({ vehicleAds: vehicleAdsAll.filter(item => item.location.city == val) }))
              }}
              sx={{
                backgroundColor: neutralLight,

                borderRadius: "0.25rem",
                p: "0.25rem 1rem",
                "& .MuiSvgIcon-root": {
                  pr: "0.25rem",
                  width: "2rem",
                },
                "& .MuiSelect-select:focus": {
                  backgroundColor: neutralLight,
                },
              }}
              input={<InputBase />}
            >
              {
                ["Pakistan", ...cities].map(city =>
                  <MenuItem value={city}>
                    <Typography>{city}</Typography>
                  </MenuItem>)
              }

            </Select>

          </FlexBetween>
        )}

      </FlexBetween>

    </Box>
  );
};

export default SearchAndCity;