export type RequestOptions = {
  method: "GET" | "POST" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};
