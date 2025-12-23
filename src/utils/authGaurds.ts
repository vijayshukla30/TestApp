export function isAuthSuccess<T extends { token: string }>(res: any): res is T {
  return res && typeof res === "object" && "token" in res;
}

export function isMessageResponse(res: any): res is { message: string } {
  return res && typeof res === "object" && "message" in res;
}
