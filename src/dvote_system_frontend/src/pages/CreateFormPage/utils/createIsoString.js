export const createIsoString = (dateString, timeString) => {
  const combinedString = `${dateString}T${timeString}:00`;
  const isoDate = new Date(combinedString);

  // ISO 8601 formatted string
  const isoFormatDate = isoDate.toISOString();

  return isoFormatDate;
};
