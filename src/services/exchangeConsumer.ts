import { getExchangeInstance } from "./exchange";

export const exchangeConsumerApi = {
  getConsumerDetails: async (
    agentId: string,
    seoName: string,
    token: string
  ) => {
    const exchange = getExchangeInstance(seoName);
    console.log("Loading consumer api");
    const res = await exchange.get("/api/v1/consumer/userId", {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-assistant-id": agentId,
      },
    });
    console.log("res data:>>", res.data);
    return res.data;
  },

  upsertConsumer: async (
    agentId: string,
    seoName: string,
    token: string,
    data: any
  ) => {
    const exchange = getExchangeInstance(seoName);
    console.log("upsertConsumer :>> ", { agentId, seoName, token });
    console.log("upsertConsumer :>> ", data);

    const res = await exchange.post(`/api/v1/consumer/upsert`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-agent-id": agentId,
      },
    });
    return res.data;
  },

  deleteConsumer: async (agentId: string, seoName: string, token: string) => {
    const exchange = getExchangeInstance(seoName);

    const res = await exchange.delete(`/api/v1/consumer/userId`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-agent-id": agentId,
      },
    });
    return res.data;
  },
};
