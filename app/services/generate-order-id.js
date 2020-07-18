const generateOrderId = () => {
  const dateObj = new Date();
  const date =
    dateObj.getDate().toString().length !== 2
      ? '0' + dateObj.getDate()
      : dateObj.getDate();

  const time = dateObj.getTime().toString();
  const result = date + time;

  return result;
};

module.exports = generateOrderId;
