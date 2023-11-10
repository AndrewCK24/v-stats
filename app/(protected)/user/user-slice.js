import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signIn: false,
  name: "",
  email: "",
  teams: {
    joined: [],
    inviting: [],
  },
  info: {},
  preferences: {},
  _id: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.signIn = true;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.teams = action.payload.teams;
      state.info = action.payload.info;
      state.preferences = action.payload.preferences;
      state._id = action.payload._id;
    },
    setTeamsDetails: (state, action) => {
      const { joined, inviting } = action.payload;
      if (joined) state.teams.joined = joined;
      if (inviting) state.teams.inviting = inviting;
    },
    signOut: (state) => {
      state.signIn = false;
      state.name = "";
      state.email = "";
      state.teams = {
        joined: [],
        inviting: [],
      };
      state.info = {};
      state.preferences = {};
      state._id = "";
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
