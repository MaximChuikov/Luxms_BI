import { daysShortNamesDict, months } from "./constants";

export const getYear = (date: Date & number) => {
  return date.getFullYear ? date.getFullYear() : new Date(date).getFullYear();
};

export const getMonthName = (date: Date & number) => {
  const month = date.getMonth ? date.getMonth() : new Date(date).getMonth();
  return months[month];
};

export const getDayShortName = (day: string) => {
  return daysShortNamesDict[day] || day.slice(0, 2);
};
