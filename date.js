//getDate : returns current day and date
exports.getDate = function () {
  const today = new Date();
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  return today.toLocaleDateString("en-US", options);
};

//getDay: returns current day of the week
exports.getDay = function () {
  const today = new Date();
  const options = {
    weekday: "long",
  };
  return today.toLocaleDateString("en-US", options);
};
