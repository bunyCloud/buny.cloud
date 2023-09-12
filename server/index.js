const express = require('express');
const { encrypt } = require('eth-sig-util');
const { bufferToHex } = require('ethereumjs-util');
const path = require('path');
const crypto = require('crypto');
const cors = require('cors');
const EthCrypto = require('eth-crypto');
const sodium = require('libsodium-wrappers');
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json()); // Parse JSON request body



app.post('/generate-identity', (req, res) => {
  const identity = EthCrypto.createIdentity();
  res.json(identity);
});


app.post('/generate-key', (req, res) => {
  const keyArray = new Uint8Array(32); // 256 bits key (32 bytes)
  crypto.randomFillSync(keyArray);
  const keyHex = Array.from(keyArray).map(byte => byte.toString(16).padStart(2, '0')).join('');
  res.json({ symmetricKey: keyHex });
});


app.post('/generate-public-key', async (req, res) => {
  try {
    await sodium.ready;
  
    // Generate a keypair using X25519
    const keypair = sodium.crypto_box_keypair();
  
    // Get the public key as a Base64-encoded string
    const publicKeyBase64 = sodium.to_base64(keypair.publicKey, sodium.base64_variants.ORIGINAL);
  
    res.json({ publicKey: publicKeyBase64 });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.post('/encrypt', (req, res) => {
  const { encryptionKey, cleartext } = req.body;
  try {
    const encryptedMessage = bufferToHex(
      Buffer.from(
        JSON.stringify(
          encrypt(encryptionKey, { data: cleartext }, 'x25519-xsalsa20-poly1305')
        ),
        'utf8'
      )
    );
    return res.status(200).json({ encryptedMessage });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Serve the React app for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});


