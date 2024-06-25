import { Box } from "@mui/material";
import { styled } from "@mui/system";

const WidgetWrapper2 = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.alt,
  borderRadius: "0.75rem",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Add drop shadow
}));

export default WidgetWrapper2;
