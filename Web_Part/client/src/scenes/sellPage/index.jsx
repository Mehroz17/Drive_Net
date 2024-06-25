import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";
import Navbar from "scenes/navbarMarket";
//import StepForm from "./StepForm";
import { useParams } from "react-router-dom";
import VehicleAdUpdateForm from "./FormUpdate";
import Footer from "scenes/footer/Footer";

const SellPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const {vehicleAdId} = useParams();
  return (
    <Box>
      <Navbar />
      <Box>
        <Box
          width={isNonMobileScreens ? "95%" : "93%"}
          p="3rem"
          m="2rem auto"
          borderRadius="2rem"
          backgroundColor={theme.palette.background.alt}
        >
          <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
            Sell your vehicle
          </Typography>
          {vehicleAdId? <VehicleAdUpdateForm vehicleAdId={vehicleAdId}/> :  <Form /> }
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default SellPage;