module.exports = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let charactersLength = characters.length;
  for (let i = 0; i <= length; i++) {
    result = result + characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return {
    success: true,
    string: result,
  };
};
