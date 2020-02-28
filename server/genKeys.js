const NodeRSA = require('node-rsa');
const fs = require('fs');

// Check if key files exist
const isPrivateKey = fs.existsSync('private.key');
const isPublicKey = fs.existsSync('public.key');

if (!isPrivateKey && !isPublicKey) {
  // Generate 512 bit RSA key pair
  const key = new NodeRSA({b: 512});
  const privateKey = key.exportKey('pkcs1-private-pem');
  const publicKey = key.exportKey('pkcs1-public-pem');

  // Create private key file
  fs.writeFileSync('private.key', privateKey);
  // Create public key file
  fs.writeFileSync('public.key', publicKey);
  console.log('Keys generated');
} else {
  console.log('Keys already exist');
}

