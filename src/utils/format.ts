export const extractUSLocalNumber = (num: any) => {
  if (!num) return "";
  const cleaned = String(num).replace(/\D/g, "");
  return cleaned.slice(-10);
};

export const formatPhoneNumberUS = (digits: any) => {
  if (!digits) return "";

  const cleaned = String(digits).replace(/\D/g, "");

  if (cleaned.length !== 10) return cleaned;

  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
};
