import { useRef, useState } from "react";
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
} from "@mui/material";
import {
  Search,
  DarkMode,
  LightMode,
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
//import Login from "scenes/loginPage/Login";
import LoginPage from "scenes/loginPage";
import MsgIcon from "components/MsgIcon";

const Navbar = ({ onSearch = () => { } }) => {

  const [isModalOpen, setModalOpen] = useState(false);
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const cities = useSelector(state => state.cities);
  //const mode = useSelector(state => state.mode);
  //const vehicleAds = useSelector((state) => state.vehicleAds);
  const vehicleAdsAll = useSelector(state => state.vehicleAdsAll);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const search = useSelector(state => state.search);

  const query = new URLSearchParams(useLocation().search)
  const queryLocation = query.get('location');
  const querySearch = query.get('search');
  const [currentLocation, setCurrentLocation] = useState("Pakistan");

  useGetData('location', '', {
    onSuccess: (data) => {
      dispatch(setCities({ cities: data }));
    }
  });

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  /* const fullName = `${user.firstName} ${user.lastName}`; */
  const fullName = user ? `${user.firstName}` : "user";


  const [inputValue, setInputValue] = useState(querySearch??'');
  const isCalled = useRef(false);
  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = (event) => {
    
    if (event.key === 'Enter') {
      
      const inValue = inputValue.toLowerCase()
      navigate(`/market?search=${inValue}`);
    }
  };

/*   const handleSubmit = () => {
    setInputValue('');
  };
 */
  const filterByLocation = (val)=>{
    if (val !== currentLocation){
      setTimeout(()=>{
        //alert('filtering by location')
        setCurrentLocation(val);
        if (val === "Pakistan")
          dispatch(setVehicleAds({ vehicleAds: vehicleAdsAll }))
        else
          dispatch(setVehicleAds({ vehicleAds: vehicleAdsAll.filter(item => item.location.city === val) }))
        isCalled.current = true
      }, isCalled.current ? 0 : 500)
    }
  }

  if (queryLocation && !isCalled.current){
    filterByLocation(queryLocation);}
  
  return (
    <FlexBetween padding="0.3rem 1%" backgroundColor={alt}>
      <CustomModal open={isModalOpen} setOpen={setModalOpen}>
        <LoginPage isModal={true} onLogin={() => { setModalOpen(false) }} />
      </CustomModal>
      <FlexBetween gap="1rem">
        <Box display={'flex'} width={'auto'} gap={"0.2rem"} >
        <img
            height="auto"
            width="200vw"
            style={{
              alignSelf: "center",
              borderRadius: "0.5rem",
              cursor: "pointer",
              transition: "opacity 0.3s",
            }}
            src="http://localhost:3000/assets/drivenet2.png"
            alt="Drivenet Market"
            onClick={() => navigate("/")}
            onMouseOver={(e) => (e.currentTarget.style.opacity = 0.5)}
            onMouseOut={(e) => (e.currentTarget.style.opacity = 1)}
          />

          <Typography
            fontWeight="bold"
            fontSize="clamp(1rem, 2rem, 2.25rem)"
            color="primary"
            onClick={() => navigate("/market")}
            sx={{
              "&:hover": {
                color: primaryLight,
                cursor: "pointer",
              },
            }}
          >
            Market
          </Typography>
        </Box>
        {isNonMobileScreens && (
          <FlexBetween
            backgroundColor={neutralLight}
            borderRadius="9px"
            gap="1rem"
            padding="0.1rem 1.5rem"
          >
            <InputBase placeholder="Search..."
              value={inputValue}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
            />
            <Box>
              {
                search &&
                <IconButton onClick={() => {
                  navigate(`/market`);
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
                filterByLocation(val);
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

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween gap="1rem">

          <MsgIcon />

          <IconButton
            onClick={() => dispatch(setMode())}
            sx={{ fontSize: "25px" }}
          >
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "20px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "20px" }} />
            )}
          </IconButton>

          {
            <UserImage size="35px" image={user?.picturePath ? user.picturePath : "defuser.jpg"} />
          }

          {user ? <FormControl variant="standard" value={fullName}>
            <Select
              value={fullName}
              sx={{
                backgroundColor: neutralLight,
                width: "150px",
                borderRadius: "0.25rem",
                p: "0.25rem 1rem",
                "& .MuiSvgIcon-root": {
                  pr: "0.25rem",
                  width: "3rem",
                },
                "& .MuiSelect-select:focus": {
                  backgroundColor: neutralLight,
                },
              }}
              input={<InputBase />}
            >
              <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
              </MenuItem>
              <MenuItem onClick={() => navigate('/market/profile/' + user._id)}>
                My Ads
              </MenuItem>
              {/* <MenuItem onClick={() => dispatch(setMode())}>
                  {theme.palette.mode === "dark"? "Light Mode": "Dark Mode"}
              </MenuItem> */}

              <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
            </Select>
          </FormControl> :
          <Button 
              variant="contained" 
              color="inherit"
              onClick={(event) => {
                event.preventDefault();
                setModalOpen(true);
              }}
            >
              Login
            </Button>
          }

          <Link to="/home" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary">
              Community
            </Button>
          </Link>
          <Link to="/market/new/sell" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary">
              Sell Now
            </Button>
          </Link>
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Menu />
        </IconButton>
      )}



      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}
        >
          {/* CLOSE ICON */}
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

          {/* MENU ITEMS */}
          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem"
          >


            <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: "25px" }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>
            <MsgIcon />

            <FormControl variant="standard" value={fullName}>
              <Link to="/home" style={{ textDecoration: 'none', width: '150px', marginTop: 5 }}>
                <Button variant="contained" color="primary" sx={{ width: '100%' }}>
                  Community
                </Button>
              </Link>
              <Link to="/home" style={{ textDecoration: 'none', width: '150px', marginTop: 5 }}>
                <Button variant="contained" color="primary" sx={{ width: '100%' }}>
                  Sell Now
                </Button>
              </Link>
              <Box mt={5} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
              {
                <UserImage size="35px" image={user?.picturePath ? user.picturePath : "defuser.jpg"} />
              }
              {user ? <FormControl variant="standard" value={fullName}>
                <Select
                  value={fullName}
                  sx={{
                    backgroundColor: neutralLight,
                    width: "150px",
                    borderRadius: "0.25rem",
                    p: "0.25rem 1rem",
                    "& .MuiSvgIcon-root": {
                      pr: "0.25rem",
                      width: "3rem",
                    },
                    "& .MuiSelect-select:focus": {
                      backgroundColor: neutralLight,
                    },
                  }}
                  input={<InputBase />}
                >
                  <MenuItem value={fullName}>
                    <Typography>{fullName}</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => navigate('/market/profile/' + user._id)}>
                    My Ads
                  </MenuItem>
                  {/* <MenuItem onClick={() => dispatch(setMode())}>
                  {theme.palette.mode === "dark"? "Light Mode": "Dark Mode"}
              </MenuItem> */}

                  <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
                </Select>
              </FormControl> :
              <Button 
              variant="contained" 
              color="info"
              onClick={(event) => {
                event.preventDefault();
                setModalOpen(true);
              }}
              sx={{marginTop: '1rem'}}
            >
              Login
            </Button>
              }
              </Box>
              
            </FormControl>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;