import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import agentsReducer from "../features/agent/agentsSlice";
import activityReducer from "../features/activity/activitySlice";

export default combineReducers({
  auth: authReducer,
  agents: agentsReducer,
  activity: activityReducer,
});
