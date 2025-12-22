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

export type LoginResponse =
  | {
      message: "Invalid credentials";
    }
  | {
      message: "Account not verified. OTP resent to email.";
      email: string;
    }
  | {
      token: string;
      uuid: string;
      email: string;
      name: string;
      role: string;
      phoneNumber: string[];
    };

export type RegisterResponse =
  | {
      message: "OTP sent to email. Please verify.";
      uuid: string;
      email: string;
    }
  | {
      message: string;
    };
