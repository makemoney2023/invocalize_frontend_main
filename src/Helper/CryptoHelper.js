const crypto = require('crypto');

class CryptoHelper {
   static secret = "aiisthefuture";
   static key = crypto.createHash('sha256').update(String(CryptoHelper.secret)).digest('base64').substr(0, 32);
   static algorithm = 'aes-256-cbc';
   static ivLength = 16;

   static encrypt(text) {
      const iv = crypto.randomBytes(CryptoHelper.ivLength);
      const cipher = crypto.createCipheriv(CryptoHelper.algorithm, Buffer.from(CryptoHelper.key), iv);
      let encrypted = cipher.update(text);
      encrypted = Buffer.concat([encrypted, cipher.final()]);
      return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
   }

   static decrypt(text) {
      const [ivHex, encryptedHex] = text.split(':');
      const iv = Buffer.from(ivHex, 'hex');
      const encryptedText = Buffer.from(encryptedHex, 'hex');
      const decipher = crypto.createDecipheriv(CryptoHelper.algorithm, Buffer.from(CryptoHelper.key), iv);
      let decrypted = decipher.update(encryptedText);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return decrypted.toString();
   }
}

export default CryptoHelper;