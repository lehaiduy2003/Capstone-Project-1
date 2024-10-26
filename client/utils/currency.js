const parsedCurrency = (style, currency, amount) => {
  return new Intl.NumberFormat("vi-VI", {
    style: style,
    currency: currency,
  }).format(amount);
};

export default parsedCurrency;
