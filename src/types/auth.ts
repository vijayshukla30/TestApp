export type VerifyOtpResponse = {
  token: string;
  uuid: string;
  email: string;
  name: string;
  role: string;
  phoneNumber: string[];
  message: string;
};
