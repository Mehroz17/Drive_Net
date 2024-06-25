import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Badge,
  useTheme,
  useMediaQuery,
  Button,
} from "@mui/material";
import { DarkMode, LightMode, Menu, Close } from "@mui/icons-material";
import MessageIcon from "@mui/icons-material/Message";
import UserImage from "components/UserImage";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import MsgIcon from "components/MsgIcon";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  const fullName = user ? `${user.firstName} ${user.lastName}` : "No User";

  return (
    <FlexBetween padding="0.3rem 2%" backgroundColor={alt}>
      <FlexBetween gap="1.75rem">
        <Box display={"flex"} width={"auto"} gap={"0.2rem"}>
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
            alt="Drivenet Media"
            onClick={() => navigate("/home")}
            onMouseOver={(e) => (e.currentTarget.style.opacity = 0.5)}
            onMouseOut={(e) => (e.currentTarget.style.opacity = 1)}
          />

          <Typography
            fontWeight="bold"
            fontSize="clamp(1rem, 2rem, 2.25rem)"
            color="primary"
            onClick={() => navigate("/home")}
            sx={{
              "&:hover": {
                color: primaryLight,
                cursor: "pointer",
              },
            }}
          >
            Community
          </Typography>
        </Box>
      </FlexBetween>

      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>
          <MsgIcon />
          <UserImage
            size="35px"
            image={user?.picturePath ? user.picturePath : "defuser.jpg"}
          />
          <FormControl variant="standard" value={fullName}>
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
              <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
            </Select>
          </FormControl>
          <Link to="/market" style={{ textDecoration: "none" }}>
            <Button variant="contained" color="primary">
              Market
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
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

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
              <Link
                to="/market"
                style={{ textDecoration: "none", width: "150px", marginTop: 5 }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ width: "100%" }}
                >
                  Market
                </Button>
              </Link>
              <Box
                mt={5}
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                {
                  <UserImage
                    size="35px"
                    image={user?.picturePath ? user.picturePath : "defuser.jpg"}
                  />
                }
                {user ? (
                  <FormControl variant="standard" value={fullName}>
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
                      <MenuItem
                        onClick={() => navigate("/market/profile/" + user._id)}
                      >
                        My Ads
                      </MenuItem>
                      <MenuItem onClick={() => dispatch(setLogout())}>
                        Log Out
                      </MenuItem>
                    </Select>
                  </FormControl>
                ) : (
                  <Typography
                    component="a"
                    href="/your-link-path"
                    variant="body1"
                    onClick={(event) => {
                      event.preventDefault();
                    }}
                  >
                    login
                  </Typography>
                )}
              </Box>
            </FormControl>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;
