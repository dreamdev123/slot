export function formatDate(date: Date | string) {
  if (typeof date === "string") {
    date = new Date(date);
  }

  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new TypeError("Invalid date object");
  }

  let formattedDate = date.toLocaleDateString();
  let formattedTime = date.toLocaleTimeString();
  const options = {
    year: "numeric" as const,
    month: "long" as const,
    day: "numeric" as const,
  };
  formattedDate = date.toLocaleDateString("en-US", options);
  const fullDate = formattedDate + " " + formattedTime;
  return fullDate;
}
