import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";

type ConsumerState = {
  byAgentId: Record<
    string,
    {
      data: any | null;
      loading: boolean;
      error?: string;
    }
  >;
};

const initialState: ConsumerState = {
  byAgentId: {},
};

/**
 * Fetch consumer for agent (lazy)
 */
export const fetchConsumerByAgent = createAsyncThunk(
  "consumer/fetchByAgent",
  async (
    {
      agentId,
      token,
    }: {
      agentId: string;
      token: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.getConsumerDetails(agentId, token);
      return { agentId, consumer: res };
    } catch (err: any) {
      return rejectWithValue({
        agentId,
        error: err.message || "Failed to fetch consumer",
      });
    }
  }
);

const consumerSlice = createSlice({
  name: "consumer",
  initialState,
  reducers: {
    clearConsumerByAgent(state, action) {
      delete state.byAgentId[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConsumerByAgent.pending, (state, action) => {
        const agentId = action.meta.arg.agentId;
        state.byAgentId[agentId] = {
          data: null,
          loading: true,
        };
      })
      .addCase(fetchConsumerByAgent.fulfilled, (state, action) => {
        const { agentId, consumer } = action.payload;
        state.byAgentId[agentId] = {
          data: consumer,
          loading: false,
        };
      })
      .addCase(fetchConsumerByAgent.rejected, (state, action: any) => {
        const { agentId, error } = action.payload;
        state.byAgentId[agentId] = {
          data: null,
          loading: false,
          error,
        };
      });
  },
});

export const selectConsumerByAgent = (agentId: string) => (state: any) =>
  state.consumer.byAgentId[agentId];

export const { clearConsumerByAgent } = consumerSlice.actions;
export default consumerSlice.reducer;
