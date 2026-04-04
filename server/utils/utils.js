import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export const formatBytes = (bytes) => {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  return `${Number(value.toFixed(2))} ${units[i]}`;
}

export const generateUUID = () => {
    return crypto.randomUUID();
}

//for accordion
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}