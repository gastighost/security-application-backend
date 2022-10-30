const convertToDateTime = (date) => {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};

const parseDate = (date) => {
  return Date.parse(new Date(date));
};

module.exports = {
  convertToDateTime,
  parseDate,
};
