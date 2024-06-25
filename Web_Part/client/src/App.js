import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import EditProfilePage from "scenes/profileEdit";
import MarketPage from "scenes/marketPage";
import SellPage from "scenes/sellPage"
import VehicleDescPage from "scenes/VehicleDescPage"
import ChatPage from "scenes/chatPage/Chat"
import AdminPage from "scenes/AdminPage"

import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import UserAdsPage from "scenes/UserAdsPage";
import LandingPage from "scenes/landingPage";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

  const user = useSelector(state=>state.user);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/home"
              element={isAuth ? <HomePage /> : <Navigate to="/" />}
            />

            <Route
              path="/admin"
              element={isAuth && user.role=='admin' ? <AdminPage /> : <Navigate to="/login" />}
            />

            <Route
              path="/profile/:userId"
              element={isAuth ? <ProfilePage /> : <Navigate to="/login" />}
            />

            <Route
              path="/market/profile/:userId"
              element={isAuth ? <UserAdsPage /> : <Navigate to="/login" />}
            />

            <Route
              path="/editProfile/:userId"
              element={isAuth ? <EditProfilePage /> : <Navigate to="/login" />}
            />

            <Route
              path="/market"
              element={<MarketPage/>}
            />

            <Route
              path="/market/:vehicleAdId"
              element={<VehicleDescPage />}
            />

            <Route
              path="/market/new/sell"
              element={isAuth ? <SellPage /> : <Navigate to="/login" />}
            />

            <Route
              path="/market/edit/:vehicleAdId"
              element={isAuth ? <SellPage /> : <Navigate to="/login" />}
            />

            <Route
              path="/chat"
              element={isAuth ? <ChatPage /> : <Navigate to="/login" />}
            />
          

          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;