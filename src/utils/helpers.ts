export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};

export const formatTime = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleTimeString("en-US", options);
};

export const formatPrice = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

export const calculateCommission = (
  amount: number,
  percent: number = 10
): number => {
  return (amount * percent) / 100;
};

export const generateId = (prefix: string): string => {
  const randomString = Math.random().toString(36).substring(2, 9);
  return `${prefix}_${randomString}`;
};
