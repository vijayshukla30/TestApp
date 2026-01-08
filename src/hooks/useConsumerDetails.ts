import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  fetchConsumerByAgent,
  // clearConsumerByAgent,
  upsertConsumer,
  deleteConsumer,
} from "../features/consumer/consumerSlice";
import useAuth from "./useAuth";
import { Agent } from "../types/agent";
import type { RootState } from "../store";
import useAppDispatch from "./useAppDispatch";
import { createUserActivity } from "../features/activity/activitySlice";

export const useConsumerDetails = (agent: Agent | null) => {
  const dispatch = useAppDispatch();
  const { token, user } = useAuth();

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

  const connect = async () => {
    if (!agent || !token || !user) return;
    const payload = {
      agentId,
      seoName,
      token,
      data: {
        name: user.name,
        email: user.email,
        accountId: user.org,
        userId: user.uuid,
        phoneNumber: user.phoneNumber,
        assistantId: agentId,
      },
    };
    console.log("inside hooks payload :>> ", payload);
    await dispatch(upsertConsumer(payload)).unwrap();
    await dispatch(
      createUserActivity({
        assistantUuid: agentId,
        isInstalled: true,
        token,
      })
    ).unwrap();
  };

  const disconnect = async () => {
    if (!agentId || !seoName || !token) return;

    await dispatch(
      deleteConsumer({
        agentId,
        seoName,
        token,
      })
    ).unwrap();
    await dispatch(
      createUserActivity({
        assistantUuid: agentId,
        isInstalled: false,
        token,
      })
    ).unwrap();
  };

  return {
    consumer: state?.data ?? null,
    loading: state?.loading ?? false,
    error: state?.error,
    isInstalled: Boolean(state?.data),
    connect,
    disconnect,
  };
};
