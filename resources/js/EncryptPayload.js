import CryptoJS from 'crypto-js';

export function EncryptPayload(data, secretKey) {
  const jsonData = typeof data === 'string' ? data : JSON.stringify(data);

  const hash = CryptoJS.SHA256(secretKey).toString(CryptoJS.enc.Hex);

  const key = hash.substr(0, 64); // 32 bytes
  const iv  = hash.substr(0, 32); // 16 bytes

  const encrypted = CryptoJS.AES.encrypt(jsonData, CryptoJS.enc.Hex.parse(key), {
    iv: CryptoJS.enc.Hex.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString(); // Base64 string

  const signature = CryptoJS.HmacSHA256(encrypted, secretKey).toString(CryptoJS.enc.Hex);

  return {
    payload: encrypted,
    signature: signature
  };
}

// --- Decrypt server response ---
export function DecryptResponse(data, secretKey) {
  const hash = CryptoJS.SHA256(secretKey).toString(CryptoJS.enc.Hex);
  const key = hash.substr(0, 64);  // 32 bytes
  const iv = hash.substr(0, 32);   // 16 bytes

  try {
    // Decrypt the response payload
    const bytes = CryptoJS.AES.decrypt(data.payload, CryptoJS.enc.Hex.parse(key), {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    // Clean up headers if they exist and ensure we're working with only JSON
    const jsonStartIndex = decrypted.indexOf('{');
    const jsonString = decrypted.substring(jsonStartIndex);  // Extract only the JSON part

    // Try parsing the cleaned JSON string
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Decryption or JSON parsing failed:", error);
    return null; // Or handle the error as needed
  }
}

