const crypto = require('crypto');

const genKey = (data = null) => {
  return crypto
    .createHash('sha256')
    .update(data ? data : String(process.env.SERVER_SECRET))
    .digest('base64')
    .substr(0, 32);
};

module.exports.encrypt = (data) => {
  const BLOCK_SIZE = Number.parseInt(process.env.CIPHER_BLOCK_SIZE);
  const iv = crypto.randomBytes(BLOCK_SIZE);
  const key = genKey(data.key ? data.key : null);

  const cipher = crypto.createCipheriv(process.env.CIPHER_ALGORITHM, key, iv);
  let cipherText;
  try {
    cipherText = cipher.update(data.plain, 'utf8', 'hex');
    cipherText += cipher.final('hex');
    cipherText = iv.toString('hex') + cipherText;
    cipherText = new Buffer.from(cipherText);
    cipherText = cipherText.toString('base64');
  } catch (err) {
    return { success: false };
  }

  return { success: true, data: cipherText };
};

module.exports.decrypt = (data) => {
  try {
    const key = genKey(data.key ? data.key : null);
    data = new Buffer.from(data.cipher, 'base64');
    data = data.toString('utf8');
    const BLOCK_SIZE = Number.parseInt(process.env.CIPHER_BLOCK_SIZE);
    const content = Buffer.from(data, 'hex');
    const iv = content.slice(0, BLOCK_SIZE);
    const textBytes = content.slice(BLOCK_SIZE);

    const decipher = crypto.createDecipheriv(
      process.env.CIPHER_ALGORITHM,
      key,
      iv
    );
    let decrypted = decipher.update(textBytes, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return { success: true, data: decrypted };
  } catch (err) {
    return { success: false };
  }
};
