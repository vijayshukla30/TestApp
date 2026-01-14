import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { exchangeConsumerApi } from "../../services/exchangeConsumer";

type ConsumerEntry = {
  data: any | null;
  loading: boolean;
  error?: string;
};

type ConsumerState = {
  byAgentId: Record<string, ConsumerEntry>;
};

const initialState: ConsumerState = {
  byAgentId: {},
};

export const fetchConsumerByAgent = createAsyncThunk(
  "consumer/fetchByAgent",
  async (
    {
      agentId,
      seoName,
      token,
    }: {
      agentId: string;
      seoName: string | any;
      token: string | any;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await exchangeConsumerApi.getConsumerDetails(
        agentId,
        seoName,
        token
      );
      return { agentId, consumer: res };
    } catch (err: any) {
      console.log("err :>> ", err);
      return rejectWithValue({
        agentId,
        error: err.message || "Failed to fetch consumer",
      });
    }
  }
);

export const upsertConsumer = createAsyncThunk(
  "consumer/upsert",
  async (
    {
      agentId,
      seoName,
      token,
      data,
    }: {
      agentId: string | any;
      seoName: string | any;
      token: string;
      data: any;
    },
    { rejectWithValue }
  ) => {
    try {
      const consumer = await exchangeConsumerApi.upsertConsumer(
        agentId,
        seoName,
        token,
        data
      );
      return { agentId, consumer };
    } catch (error: any) {
      return rejectWithValue({
        agentId,
        error:
          error?.response?.data ||
          error?.message ||
          "Failed to create consumer",
      });
    }
  }
);

export const deleteConsumer = createAsyncThunk(
  "consumer/delete",
  async (
    {
      agentId,
      seoName,
      token,
    }: {
      agentId: string;
      seoName: string | any;
      token: string;
    },
    { rejectWithValue }
  ) => {
    try {
      await exchangeConsumerApi.deleteConsumer(agentId, seoName, token);
      return { agentId };
    } catch (error: any) {
      return rejectWithValue({
        agentId,
        error:
          error?.response?.data ||
          error?.message ||
          "Failed to delete consumer",
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
      // FETCH
      .addCase(fetchConsumerByAgent.pending, (state, action) => {
        const agentId = action.meta.arg.agentId;
        state.byAgentId[agentId] = { data: null, loading: true };
      })
      .addCase(fetchConsumerByAgent.fulfilled, (state, action) => {
        const { agentId, consumer } = action.payload;
        state.byAgentId[agentId] = { data: consumer, loading: false };
      })
      .addCase(fetchConsumerByAgent.rejected, (state, action: any) => {
        const { agentId, error } = action.payload;
        state.byAgentId[agentId] = {
          data: null,
          loading: false,
          error,
        };
      })

      // UPSERT
      .addCase(upsertConsumer.fulfilled, (state, action) => {
        const { agentId, consumer } = action.payload;
        state.byAgentId[agentId] = { data: consumer, loading: false };
      })

      // DELETE
      .addCase(deleteConsumer.fulfilled, (state, action) => {
        delete state.byAgentId[action.payload.agentId];
      });
  },
});

export const selectConsumerByAgent = (agentId: string) => (state: any) =>
  state.consumer.byAgentId[agentId];

export const { clearConsumerByAgent } = consumerSlice.actions;
export default consumerSlice.reducer;
