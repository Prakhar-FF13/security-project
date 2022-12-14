const crypto = require("crypto"),
  sha256 = crypto.createHash("sha256"),
  fs = require("fs");

/**************************************
 * Key pair generation functions below.
 **************************************/

function genKeyPair() {
  // Generates an object where the keys are stored in properties `privateKey` and `publicKey`
  const keyPair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096, // bits - standard for RSA keys
    publicKeyEncoding: {
      type: "pkcs1", // "Public Key Cryptography Standards 1"
      format: "pem", // Most common formatting choice
    },
    privateKeyEncoding: {
      type: "pkcs1", // "Public Key Cryptography Standards 1"
      format: "pem", // Most common formatting choice
    },
  });

  return { publicKey: keyPair.publicKey, privateKey: keyPair.privateKey };
}

function genAndSaveKeyPair() {
  const keyPair = genKeyPair();
  fs.writeFileSync(__dirname + "/id_rsa_pub.pem", keyPair.publicKey);

  // Create the private key file
  fs.writeFileSync(__dirname + "/id_rsa_priv.pem", keyPair.privateKey);
}

/*********************************************
 * Data Encryption/Decryption functions below.
 *********************************************/

/**
 * Every function accepts message as a string, pubKey, privKey as string as well.
 * Every function returns buffer (bytes), must be converted to string.
 */

function encryptWithPublicKey(pubKey, message) {
  const bufferMessage = Buffer.from(message, "utf-8");
  return crypto.publicEncrypt(pubKey, bufferMessage);
}

function encryptWithPrivateKey(privateKey, message) {
  const bufferMessage = Buffer.from(message, "utf-8");
  return crypto.privateEncrypt(privateKey, bufferMessage);
}

function decryptWithPublicKey(pubKey, message) {
  const bufferMessage = Buffer.from(message, "utf-8");
  return crypto.publicDecrypt(pubKey, bufferMessage);
}

function decryptWithPrivateKey(privateKey, message) {
  const bufferMessage = Buffer.from(message, "utf-8");
  return crypto.privateDecrypt(privateKey, bufferMessage);
}

/************************************
 * Digital Signature functions below.
 ************************************/

/**
 * message in JSON format, private key in string format.
 * return json data to be sent.
 */
function signMessage(privateKey, jsonMessage) {
  const message = JSON.stringify(jsonMessage);

  sha256.update(message);
  const hashedData = sha256.digest("hex");

  const encryptedMessage = encryptWithPrivateKey(privateKey, hashedData);

  const signedPacket = {
    algorithm: "sha256",
    payload: jsonMessage,
    signature: encryptedMessage,
  };

  return signedPacket;
}

/**
 * pubkey - string, jsonMessage - JSON
 * returns boolean - if sender sent the signed message.
 */
function verifyMessage(pubKey, jsonMessage) {
  const hashFn = crypto.createHash(jsonMessage.algorithm);

  const message = JSON.stringify(jsonMessage.payload);

  hashFn.update(message);
  const hashedData = hashFn.digest("hex");

  const decryptedHashedData = decryptWithPublicKey(
    pubKey,
    jsonMessage.signature
  ).toString();

  return hashedData === decryptedHashedData;
}

// module.exports.genKeyPair = genKeyPair;
module.exports.encryptWithPrivateKey = encryptWithPrivateKey;
module.exports.encryptWithPublicKey = encryptWithPublicKey;
module.exports.decryptWithPrivateKey = decryptWithPrivateKey;
module.exports.decryptWithPublicKey = decryptWithPublicKey;
module.exports.signMessage = signMessage;
module.exports.verifyMessage = verifyMessage;

genAndSaveKeyPair();

// const keyPair = genKeyPair();
// console.log(
//   decryptWithPrivateKey(
//     keyPair.privateKey,
//     encryptWithPublicKey(keyPair.publicKey, "HelloThere")
//   ).toString()
// );

// const packet = signMessage(keyPair.privateKey, {
//   name: "Hello",
// });

// console.log(verifyMessage(keyPair.publicKey, packet));
