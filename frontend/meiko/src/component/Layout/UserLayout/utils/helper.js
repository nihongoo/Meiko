export const currencyFormat = (amount, currencyCode = "VND") => {
  if (isNaN(amount) || amount < 0) {
    return "Invalid amount";
  }
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
};