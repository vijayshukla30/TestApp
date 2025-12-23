import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import agentsReducer from "../features/agent/agentsSlice";

export default combineReducers({
  auth: authReducer,
  agents: agentsReducer,
});
