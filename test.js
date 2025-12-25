import crypto from 'crypto';

function generateSecret(length = 32) {
  return crypto.randomBytes(length).toString('base64');
}

const secret = generateSecret(); // default 32 bytes → 64 hex chars
console.log(secret);
