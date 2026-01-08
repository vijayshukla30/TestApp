import axios from "axios";

export const getExchangeInstance = (seoName: string) => {
  const template = process.env.EXPO_PUBLIC_EXCHANGE_URL;

  if (!template) {
    throw new Error("EXPO_PUBLIC_EXCHANGE_URL is not defined");
  }

  const baseURL = template.replace("*", seoName);

  return axios.create({
    baseURL,
  });
};
