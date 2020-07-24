const jwt = require('jsonwebtoken');

const payload = {
  user_id: '425b4e9a-262e-4548-a3f8-b3e50a98db7a',
  email: 'adila@adila.com',
};

const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2m' });

module.exports = token;
