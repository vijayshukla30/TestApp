const API_BASE_URL = "https://api.heygennie.com/api/v1/user"; // change later

async function request(url: string, method: "GET" | "POST", body?: any) {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  return data;
}

export const api = {
  login: (email: string, password: string) =>
    request("/login", "POST", { email, password }),

  register: (payload: {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    roles: string;
  }) => request("/register", "POST", payload),

  verifyOtp: (payload: { email: string; otp: string }) =>
    request("/verify-otp", "POST", payload),

  resendOtp: (email: string) => request("/resend-otp", "POST", { email }),
};
