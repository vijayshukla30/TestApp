import { useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchConsumerByAgent } from "../features/consumer/consumerSlice";
import useAuth from "./useAuth";
import { Agent } from "../types/agent";
import type { RootState } from "../store";
import useAppDispatch from "./useAppDispatch";

export const useConsumerDetails = (agent: Agent | null) => {
  const dispatch = useAppDispatch();
  const { token } = useAuth();

  const agentId = agent?.uuid;
  const seoName = agent?.seoName;

  const state = useSelector((state: RootState) =>
    agentId ? state.consumer.byAgentId[agentId] : undefined
  );

  useEffect(() => {
    if (!agentId || !seoName || !token) return;

    // Fetch only if not already loaded
    if (!state || (!state.loading && state.data === null)) {
      dispatch(
        fetchConsumerByAgent({
          agentId,
          seoName,
          token,
        })
      );
    }
  }, [agentId, seoName, token]);

  return {
    consumer: state?.data ?? null,
    loading: state?.loading ?? false,
    error: state?.error,
    isInstalled: Boolean(
      state?.data?.integrationIds &&
        Object.keys(state.data.integrationIds).length > 0
    ),
  };
};
