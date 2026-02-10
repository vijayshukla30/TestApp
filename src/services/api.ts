import { router } from "expo-router";
import { store } from "../store";
import { logoutSuccess } from "../features/auth/authSlice";
import { showGlobalMessage } from "../context/UIContext";

import { AgentsApiResponse } from "../types/agent";
import {
  LoginResponse,
  RegisterResponse,
  VerifyOtpResponse,
} from "../types/auth";
import { RequestOptions } from "../types/request";
import { InitUploadResponse } from "../types/recording";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export type SignedPlaybackUrlResponse = {
  url: string;
  expiresAt?: string;
};

/* ------------------------------------------------------------------ */
/* Core request helper */
/* ------------------------------------------------------------------ */
async function request<T>(url: string, options: RequestOptions): Promise<T> {
  console.log("url :>> ", url);
  const res = await fetch(`${API_BASE_URL}/api/v1${url}`, {
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
    throw new Error("Session expired");
  }

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "API request failed");
  }

  return (await res.json()) as T;
}

/* ------------------------------------------------------------------ */
/* API */
/* ------------------------------------------------------------------ */
export const api = {
  /* ---------------- Auth ---------------- */
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
    request("/resend-otp", {
      method: "POST",
      body: { email },
    }),

  /* ---------------- Agents ---------------- */
  getAgentsByConsumer: (consumerUuid: string, token: string) =>
    request<AgentsApiResponse>(`/organization/?role=CONSUMER`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  /* ---------------- Recordings ---------------- */

  /** List recordings (remote source of truth) */
  getAllRecordings: (token: string) =>
    request<{ recordings: any[] }>("/recordings", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  /** Get single recording */
  getRecordingById: (recordingUuid: string, token: string) =>
    request<{ recording: any }>(`/recordings/${recordingUuid}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  /** Create recording after upload completes */
  createRecording: (
    token: string | null,
    payload: {
      name: string;
      seoName: string;
      duration: number;
      resource: string; // resourceUuid
    },
  ) =>
    request(`/recordings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: payload,
    }),

  /** Delete recording */
  deleteRecording: (recordingUuid: string, token: string | null) =>
    request(`/recordings/${recordingUuid}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  /* ---------------- Resource / Upload ---------------- */

  /** Init S3 upload (returns presigned PUT url) */
  initResourceUpload: (
    token: string | null,
    mimeType: string,
    originalName: string,
  ) =>
    request<InitUploadResponse>("/resources", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        mimeType,
        originalName,
      },
    }),

  /** Mark upload completed */
  completeResourceUpload: (
    token: string | null,
    resourceId: string,
    size: number,
  ) =>
    request("/resources/upload-complete", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        resourceId,
        size,
      },
    }),

  /** (Optional / future) Retry failed upload */
  retryResourceUpload: (token: string, resourceId: string) =>
    request<InitUploadResponse>(`/resources/${resourceId}/retry`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  getSignedPlaybackUrl: (token: string | null, resourceId: string) =>
    request<{ url: string }>(`/resources/${resourceId}/playback-url`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  createRecordingAndInitUpload: (
    token: string | null,
    payload: {
      name: string;
      seoName: string;
      duration: number;
      mimeType: string;
    },
  ) =>
    request<{
      recording: { uuid: string; resource: string };
      resource: { uuid: string };
      uploadUrl: string;
    }>("/recordings/init-upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: payload,
    }),
};
