import { fetchConsumerByAgent } from "../features/consumer/consumerSlice";

export async function ensureConsumer({
  agentId,
  token,
  dispatch,
}: {
  agentId: string;
  token: string;
  dispatch: any;
}) {
  const result = await dispatch(
    fetchConsumerByAgent({ agentId, token })
  ).unwrap();

  return result.consumer;
}
