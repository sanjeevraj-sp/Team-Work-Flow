import { useEffect, useState } from "react";

const formatRelativeTime = (dateString: string): string => {
  const timestamp = new Date(dateString).getTime();

  if (Number.isNaN(timestamp)) return "Unknown";

  const diff = Math.max(0, Date.now() - timestamp);

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Updated now";

  if (minutes < 60) return `${minutes}m ago`;

  if (hours < 24) {
    return `${hours}hr${hours > 1 ? "s" : ""} ago`;
  }

  if (days < 30) {
    return `${days}day${days > 1 ? "s" : ""} ago`;
  }

  return new Date(timestamp).toLocaleDateString();
};

export const useRelativeTime = (dateString: string) => {
  const [relativeTime, setRelativeTime] = useState(() =>
    formatRelativeTime(dateString)
  );

  useEffect(() => {
    const updateTime = () => {
      setRelativeTime(formatRelativeTime(dateString));
    };

    updateTime();

    const interval = setInterval(updateTime, 60_000);

    return () => clearInterval(interval);
  }, [dateString]);

  return relativeTime;
};