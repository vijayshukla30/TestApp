import { router } from "expo-router";
import { AgentsApiResponse } from "../types/agent";
import { RequestOptions } from "../types/request";
import {
  LoginResponse,
  RegisterResponse,
  VerifyOtpResponse,
} from "../types/auth";
import { store } from "../store";
import { logoutSuccess } from "../features/auth/authSlice";
import { showGlobalMessage } from "../context/UIContext";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

async function request<T>(url: string, options: RequestOptions): Promise<T> {
  console.log("API_BASE_URL :>> ", API_BASE_URL);
  console.log("url :>> ", url);
  const res = await fetch(`${API_BASE_URL}${url}`, {
    method: options.method,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (res.status === 401) {
    showGlobalMessage("Session expired. Please login again.");
    store.dispatch(logoutSuccess());
    setTimeout(() => {
      router.replace("/(auth)/login");
    });
    throw new Error("Session Expired.");
  }

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "API request failed");
  }

  console.log("res :>> ", res);
  const data = await res.json();
  return data as T;
}

export const api = {
  login: (email: string, password: string) =>
    request<LoginResponse>("/user/login", {
      method: "POST",
      body: { email, password },
    }),

  register: (payload: {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    roles: string;
  }) =>
    request<RegisterResponse>("/user/register", {
      method: "POST",
      body: payload,
    }),

  verifyOtp: (payload: { email: string; otp: string }) =>
    request<VerifyOtpResponse>("/verify-otp", {
      method: "POST",
      body: payload,
    }),

  resendOtp: (email: string) =>
    request("/resend-otp", { method: "POST", body: { email } }),

  getAgentsByConsumer: (consumerUuid: string, token: string) =>
    request<AgentsApiResponse>(`/organization/${consumerUuid}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  fetchAuthProfile: (state: string) =>
    request<{ profile?: any }>(
      `/general-auth/profile?state=${encodeURIComponent(state)}`,
      { method: "GET" }
    ),
  getUserActivity: (token: string) =>
    request<{ activities: any[] }>("/user/activity", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  createUserActivity: (
    data: { assistantUuid: string; isInstalled: boolean },
    token: string
  ) =>
    request(`/user/create-activity`, {
      method: "POST",
      body: data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};
