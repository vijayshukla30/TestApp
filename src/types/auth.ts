export type VerifyOtpResponse = {
  token: string;
  uuid: string;
  email: string;
  name: string;
  role: string;
  phoneNumber: string[];
  message: string;
};

export type User = {
  uuid: string;
  email: string;
  name: string;
  role: "CONSUMER" | "ADMIN" | string;
  phoneNumber: string[];
};

export type JwtPayload = {
  uuid: string;
  email: string;
  name: string;
  role: string;
  phoneNumber?: string[];
  iat: number;
  exp: number;
};
