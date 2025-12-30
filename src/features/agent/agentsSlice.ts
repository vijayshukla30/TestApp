import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";
import { Agent } from "../../types/agent";

type AgentsState = {
  list: Agent[];
  loading: boolean;
  error?: string;
};

const initialState: AgentsState = {
  list: [],
  loading: false,
};

export const fetchAgents = createAsyncThunk(
  "agents/fetchAgents",
  async (
    { consumerUuid, token }: { consumerUuid: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      if (!token) {
        return rejectWithValue("Token is expired. Login again");
      }
      const res = await api.getAgentsByConsumer(consumerUuid, token);

      const agents: Agent[] = res.organizations.flatMap(
        (org) => org.assistants || []
      );

      return agents;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to load agents");
    }
  }
);

const agentsSlice = createSlice({
  name: "agents",
  initialState,
  reducers: {
    clearAgents(state) {
      state.list = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAgents.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchAgents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAgents } = agentsSlice.actions;
export default agentsSlice.reducer;
