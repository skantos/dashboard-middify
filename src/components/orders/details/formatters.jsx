export const formatDateTime = (value) => {
  if (!value) {
    return "Sin datos";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Sin datos";
  }
  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export const formatNumber = (value) => {
  if (value === null || value === undefined) {
    return "Sin datos";
  }
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) {
    return "Sin datos";
  }
  return new Intl.NumberFormat("es-CL").format(numberValue);
};

export const formatText = (value) => {
  if (value === null || value === undefined) {
    return "Sin datos";
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? trimmed : "Sin datos";
  }
  if (typeof value === "number") {
    return formatNumber(value);
  }
  return "Sin datos";
};

export const formatMoney = (money) => {
  if (!money || money.amount === null || money.amount === undefined) {
    return "Sin datos";
  }
  const amount = Number(money.amount);
  if (!Number.isFinite(amount)) {
    return "Sin datos";
  }
  const currencyCode = money.currencyCode || "CLP";
  try {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch (_error) {
    return `${amount} ${currencyCode}`;
  }
};

export const safeArray = (value) => (Array.isArray(value) ? value : []);



