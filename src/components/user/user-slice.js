import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signIn: false,
  name: "",
  email: "",
  teamIds: [],
  invitedTeamIds: [],
  _id: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loadUserData(state, action) {
      state.signIn = true;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.teamIds = action.payload.teamIds;
      state.invitedTeamIds = action.payload.invitedTeamIds;
      state._id = action.payload._id;
      delete state.password;
    },
    startSignUp(state, action) {
      state.email = action.payload.email;
      state.password = action.payload.password;
    },
    cancelSignUp(state) {
      state.email = "";
      delete state.password;
    },
    signOut(state) {
      state.signIn = false;
      state.name = "";
      state.email = "";
      state.teamIds = [];
      state.invitedTeamIds = [];
      state._id = "";
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
