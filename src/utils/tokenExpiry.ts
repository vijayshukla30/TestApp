export const isTokenExpired = (exp: number) => {
  return Date.now() >= exp * 1000;
};

export const getMsUntilExpiry = (exp: number) => {
  return exp * 1000 - Date.now();
};
