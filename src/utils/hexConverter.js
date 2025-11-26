/**
 * 16进制转换工具类
 * 用于加密和解密相关的16进制数据转换
 */

/**
 * 字符串转16进制 (自动使用UTF-8编码，支持中文等多字节字符)
 * @param {string} str - 要转换的字符串
 * @returns {string} 16进制字符串
 */
export const stringToHex = (str) => {
  if (!str) return '';

  // 使用 UTF-8 编码以支持所有字符
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);

  const hexArray = Array.from(bytes)
    .map(byte => byte.toString(16).padStart(2, '0'));

  return '0x' + hexArray.join('');
};

/**
 * 16进制转字符串 (自动使用UTF-8解码，支持中文等多字节字符)
 * @param {string} hex - 16进制字符串 (可以带0x前缀)
 * @returns {string} 解码后的字符串
 */
export const hexToString = (hex) => {
  if (!hex) return '';

  // 移除0x前缀
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;

  // 转换为字节数组
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);
  }

  // 使用 UTF-8 解码
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
};

/**
 * 数字转16进制
 * @param {number} num - 要转换的数字
 * @returns {string} 16进制字符串
 */
export const numberToHex = (num) => {
  if (typeof num !== 'number') {
    throw new Error('Input must be a number');
  }
  return '0x' + num.toString(16);
};

/**
 * 16进制转数字
 * @param {string} hex - 16进制字符串
 * @returns {number} 数字
 */
export const hexToNumber = (hex) => {
  if (!hex) return 0;

  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  return parseInt(cleanHex, 16);
};

/**
 * Buffer转16进制
 * @param {Uint8Array|Buffer} buffer - Buffer数据
 * @returns {string} 16进制字符串
 */
export const bufferToHex = (buffer) => {
  if (!buffer) return '';

  const hexArray = Array.from(new Uint8Array(buffer))
    .map(byte => byte.toString(16).padStart(2, '0'));

  return '0x' + hexArray.join('');
};

/**
 * 16进制转Buffer
 * @param {string} hex - 16进制字符串
 * @returns {Uint8Array} Buffer数据
 */
export const hexToBuffer = (hex) => {
  if (!hex) return new Uint8Array(0);

  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  const bytes = new Uint8Array(cleanHex.length / 2);

  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);
  }

  return bytes;
};

/**
 * UTF-8字符串转16进制 (支持中文等多字节字符)
 * @param {string} str - UTF-8字符串
 * @returns {string} 16进制字符串
 */
export const utf8ToHex = (str) => {
  if (!str) return '';

  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  return bufferToHex(bytes);
};

/**
 * 16进制转UTF-8字符串 (支持中文等多字节字符)
 * @param {string} hex - 16进制字符串
 * @returns {string} UTF-8字符串
 */
export const hexToUtf8 = (hex) => {
  if (!hex) return '';

  const bytes = hexToBuffer(hex);
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
};

/**
 * 验证是否为有效的16进制字符串
 * @param {string} hex - 要验证的字符串
 * @returns {boolean} 是否有效
 */
export const isValidHex = (hex) => {
  if (!hex) return false;

  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  return /^[0-9A-Fa-f]+$/.test(cleanHex);
};

/**
 * 补齐16进制字符串到指定长度
 * @param {string} hex - 16进制字符串
 * @param {number} length - 目标长度（字节数）
 * @returns {string} 补齐后的16进制字符串
 */
export const padHex = (hex, length) => {
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  const targetLength = length * 2; // 每个字节2个16进制字符
  return '0x' + cleanHex.padStart(targetLength, '0');
};

/**
 * 简单的XOR加密/解密 (使用16进制密钥)
 * @param {string} data - 要加密/解密的16进制数据
 * @param {string} key - 16进制密钥
 * @returns {string} 加密/解密后的16进制数据
 */
export const xorEncryptDecrypt = (data, key) => {
  if (!isValidHex(data) || !isValidHex(key)) {
    throw new Error('Data and key must be valid hex strings');
  }

  const dataBytes = hexToBuffer(data);
  const keyBytes = hexToBuffer(key);

  const result = new Uint8Array(dataBytes.length);

  for (let i = 0; i < dataBytes.length; i++) {
    result[i] = dataBytes[i] ^ keyBytes[i % keyBytes.length];
  }

  return bufferToHex(result);
};

export default {
  stringToHex,
  hexToString,
  numberToHex,
  hexToNumber,
  bufferToHex,
  hexToBuffer,
  utf8ToHex,
  hexToUtf8,
  isValidHex,
  padHex,
  xorEncryptDecrypt
};
