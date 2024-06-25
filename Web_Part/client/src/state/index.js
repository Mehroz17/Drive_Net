import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
  vehicleAds: [],
  vehicleAdsAll: [],
  cities: [],
  search: '',
  isFilterApplied: false,
  userImages: {}, // New state for user images
  unreadMessages: {}, // State for unread messages
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setVehicleAds: (state, action) => {
      state.vehicleAds = action.payload.vehicleAds;
    },
    setVehicleAdsAll: (state, action) => {
      state.vehicleAdsAll = action.payload.vehicleAdsAll;
    },
    setEvents: (state, action) => {
      state.events = action.payload.events;
    },
    setSearch: (state, action) => {
      state.search = action.payload.search;
    },
    setCities: (state, action) => {
      state.cities = action.payload.cities;
    },
    setFilterApplied: (state, action) => {
      state.isFilterApplied = action.payload.isFilterApplied;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
    // New reducer to update user images
    setUserImage: (state, action) => {
      state.userImages[action.payload.userId] = action.payload.image;
    },
    incrementUnread: (state, action) => {
      const { chatId } = action.payload;
      if (state.unreadMessages[chatId]) {
        state.unreadMessages[chatId] += 1;
      } else {
        state.unreadMessages[chatId] = 1;
      }
    },
    resetUnread: (state, action) => {
      const { chatId } = action.payload;
      state.unreadMessages[chatId] = 0;
    }
  },
});

export const {
  setSearch, setFilterApplied,
  setCities,
  setMode,
  setLogin,
  setLogout,
  setFriends,
  setEvents,
  setPosts,
  setPost,
  setVehicleAds,
  setVehicleAdsAll,
  setUserImage,
  incrementUnread,
  resetUnread
} = authSlice.actions;
export default authSlice.reducer;
