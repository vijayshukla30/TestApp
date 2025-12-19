import { AgentsApiResponse } from "../types/agent";
import { RequestOptions } from "../types/request";

const API_BASE_URL = "https://api.heygennie.com/api/v1"; // change later

async function request<T>(url: string, options: RequestOptions): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    method: options.method,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "API request failed");
  }

  return res.json() as Promise<T>;
}

export const api = {
  login: (email: string, password: string) =>
    request("/user/login", { method: "POST", body: { email, password } }),

  register: (payload: {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    roles: string;
  }) => request("/user/register", { method: "POST", body: payload }),

  verifyOtp: (payload: { email: string; otp: string }) =>
    request("/verify-otp", { method: "POST", body: payload }),

  resendOtp: (email: string) =>
    request("/resend-otp", { method: "POST", body: { email } }),

  getAgentsByConsumer: (consumerUuid: string, token: string) =>
    request<AgentsApiResponse>(`/organization/${consumerUuid}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};
