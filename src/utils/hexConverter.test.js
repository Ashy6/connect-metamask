/**
 * 16进制转换工具测试
 * 运行测试：node src/utils/hexConverter.test.js
 */

import {
  stringToHex,
  hexToString,
  utf8ToHex,
  hexToUtf8,
  numberToHex,
  hexToNumber,
  bufferToHex,
  hexToBuffer,
  isValidHex,
  padHex,
  xorEncryptDecrypt
} from './hexConverter.js';

// 测试计数器
let passed = 0;
let failed = 0;

// 测试辅助函数
function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.log(`❌ ${name}`);
    console.error(`   错误: ${error.message}`);
    failed++;
  }
}

function assertEquals(actual, expected, message = '') {
  if (actual !== expected) {
    throw new Error(`${message}\n   期望: ${expected}\n   实际: ${actual}`);
  }
}

function assertTrue(value, message = '') {
  if (!value) {
    throw new Error(`${message}\n   期望: true\n   实际: ${value}`);
  }
}

console.log('\n🧪 开始测试 16进制转换工具\n');
console.log('='.repeat(60));

// ==================== 字符串 ↔ 16进制 ====================
console.log('\n📝 测试 1: 字符串 ↔ 16进制 (stringToHex / hexToString)');
console.log('-'.repeat(60));

test('英文字符串 "test"', () => {
  const original = 'test';
  const hex = stringToHex(original);
  const decoded = hexToString(hex);

  console.log(`   原始: "${original}"`);
  console.log(`   16进制: ${hex}`);
  console.log(`   解码: "${decoded}"`);

  assertEquals(hex, '0x74657374', '16进制结果不正确');
  assertEquals(decoded, original, '解码结果不正确');
});

test('中文字符串 "你好"', () => {
  const original = '你好';
  const hex = stringToHex(original);
  const decoded = hexToString(hex);

  console.log(`   原始: "${original}"`);
  console.log(`   16进制: ${hex}`);
  console.log(`   解码: "${decoded}"`);

  assertEquals(decoded, original, '中文解码不正确');
});

test('混合字符串 "Hello世界123"', () => {
  const original = 'Hello世界123';
  const hex = stringToHex(original);
  const decoded = hexToString(hex);

  console.log(`   原始: "${original}"`);
  console.log(`   16进制: ${hex}`);
  console.log(`   解码: "${decoded}"`);

  assertEquals(decoded, original, '混合字符解码不正确');
});

test('带特殊字符 "Hello, 世界! 🎉"', () => {
  const original = 'Hello, 世界! 🎉';
  const hex = stringToHex(original);
  const decoded = hexToString(hex);

  console.log(`   原始: "${original}"`);
  console.log(`   16进制: ${hex}`);
  console.log(`   解码: "${decoded}"`);

  assertEquals(decoded, original, 'Emoji解码不正确');
});

test('空字符串', () => {
  const hex = stringToHex('');
  assertEquals(hex, '', '空字符串应返回空字符串');
});

// ==================== UTF-8 ↔ 16进制 ====================
console.log('\n📝 测试 2: UTF-8 ↔ 16进制 (utf8ToHex / hexToUtf8)');
console.log('-'.repeat(60));

test('UTF-8: "test"', () => {
  const original = 'test';
  const hex = utf8ToHex(original);
  const decoded = hexToUtf8(hex);

  console.log(`   原始: "${original}"`);
  console.log(`   16进制: ${hex}`);
  console.log(`   解码: "${decoded}"`);

  assertEquals(decoded, original, 'UTF-8解码不正确');
});

test('UTF-8: "你好"', () => {
  const original = '你好';
  const hex = utf8ToHex(original);
  const decoded = hexToUtf8(hex);

  console.log(`   原始: "${original}"`);
  console.log(`   16进制: ${hex}`);
  console.log(`   解码: "${decoded}"`);

  assertEquals(decoded, original, 'UTF-8中文解码不正确');
});

test('stringToHex 和 utf8ToHex 结果一致', () => {
  const testCases = ['test', '你好', 'Hello世界', '🎉'];

  testCases.forEach(str => {
    const hex1 = stringToHex(str);
    const hex2 = utf8ToHex(str);
    console.log(`   "${str}": ${hex1 === hex2 ? '一致' : '不一致'}`);
    assertEquals(hex1, hex2, `"${str}" 的结果应该一致`);
  });
});

// ==================== 数字 ↔ 16进制 ====================
console.log('\n📝 测试 3: 数字 ↔ 16进制 (numberToHex / hexToNumber)');
console.log('-'.repeat(60));

test('数字 255', () => {
  const num = 255;
  const hex = numberToHex(num);
  const decoded = hexToNumber(hex);

  console.log(`   原始: ${num}`);
  console.log(`   16进制: ${hex}`);
  console.log(`   解码: ${decoded}`);

  assertEquals(hex, '0xff', '255的16进制应为0xff');
  assertEquals(decoded, num, '解码结果不正确');
});

test('数字 1234567890', () => {
  const num = 1234567890;
  const hex = numberToHex(num);
  const decoded = hexToNumber(hex);

  console.log(`   原始: ${num}`);
  console.log(`   16进制: ${hex}`);
  console.log(`   解码: ${decoded}`);

  assertEquals(decoded, num, '大数字解码不正确');
});

test('数字 0', () => {
  const hex = numberToHex(0);
  const decoded = hexToNumber(hex);

  assertEquals(hex, '0x0', '0的16进制应为0x0');
  assertEquals(decoded, 0, '0解码不正确');
});

// ==================== Buffer ↔ 16进制 ====================
console.log('\n📝 测试 4: Buffer ↔ 16进制 (bufferToHex / hexToBuffer)');
console.log('-'.repeat(60));

test('Buffer 转换', () => {
  const buffer = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]); // "Hello"
  const hex = bufferToHex(buffer);
  const decoded = hexToBuffer(hex);

  console.log(`   原始 Buffer: [${Array.from(buffer).join(', ')}]`);
  console.log(`   16进制: ${hex}`);
  console.log(`   解码 Buffer: [${Array.from(decoded).join(', ')}]`);

  assertEquals(hex, '0x48656c6c6f', 'Buffer转16进制不正确');
  assertEquals(decoded.length, buffer.length, 'Buffer长度不一致');

  for (let i = 0; i < buffer.length; i++) {
    assertEquals(decoded[i], buffer[i], `Buffer第${i}位不一致`);
  }
});

// ==================== 16进制验证 ====================
console.log('\n📝 测试 5: 16进制验证 (isValidHex)');
console.log('-'.repeat(60));

test('有效的16进制字符串', () => {
  assertTrue(isValidHex('0x1234abcd'), '应该是有效的16进制');
  assertTrue(isValidHex('1234ABCD'), '应该是有效的16进制');
  assertTrue(isValidHex('0xABCDEF'), '应该是有效的16进制');
  console.log('   ✓ 所有有效16进制字符串测试通过');
});

test('无效的16进制字符串', () => {
  assertEquals(isValidHex('0xGHIJ'), false, '包含非16进制字符');
  assertEquals(isValidHex('hello'), false, '纯文本不是16进制');
  assertEquals(isValidHex(''), false, '空字符串不是有效16进制');
  console.log('   ✓ 所有无效16进制字符串测试通过');
});

// ==================== 16进制补齐 ====================
console.log('\n📝 测试 6: 16进制补齐 (padHex)');
console.log('-'.repeat(60));

test('补齐到32字节', () => {
  const hex = '0x1234';
  const padded = padHex(hex, 32);

  console.log(`   原始: ${hex}`);
  console.log(`   补齐: ${padded}`);
  console.log(`   长度: ${(padded.length - 2) / 2} 字节`);

  assertEquals(padded.length, 66, '补齐后应为66个字符 (0x + 64位)');
  assertTrue(padded.startsWith('0x00000000000000'), '应该用0补齐');
});

// ==================== XOR 加密/解密 ====================
console.log('\n📝 测试 7: XOR 加密/解密 (xorEncryptDecrypt)');
console.log('-'.repeat(60));

test('XOR 加密和解密', () => {
  const original = stringToHex('Hello World');
  const key = stringToHex('secret');

  console.log(`   原始数据: ${original}`);
  console.log(`   密钥: ${key}`);

  // 加密
  const encrypted = xorEncryptDecrypt(original, key);
  console.log(`   加密后: ${encrypted}`);

  // 解密
  const decrypted = xorEncryptDecrypt(encrypted, key);
  console.log(`   解密后: ${decrypted}`);

  assertEquals(decrypted, original, 'XOR解密后应该恢复原始数据');

  // 验证解密的文本
  const decryptedText = hexToString(decrypted);
  console.log(`   解密文本: "${decryptedText}"`);
  assertEquals(decryptedText, 'Hello World', '解密文本应该是 "Hello World"');
});

// ==================== 实际应用场景 ====================
console.log('\n📝 测试 8: 实际应用场景');
console.log('-'.repeat(60));

test('场景: 编码钱包地址信息', () => {
  const walletInfo = {
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    balance: '1.5 ETH'
  };

  const infoString = JSON.stringify(walletInfo);
  const encoded = stringToHex(infoString);
  const decoded = hexToString(encoded);
  const parsedInfo = JSON.parse(decoded);

  console.log(`   原始信息: ${infoString}`);
  console.log(`   编码长度: ${encoded.length} 字符`);
  console.log(`   解码信息: ${decoded}`);

  assertEquals(parsedInfo.address, walletInfo.address, '地址应该一致');
  assertEquals(parsedInfo.balance, walletInfo.balance, '余额应该一致');
});

test('场景: 多语言文本处理', () => {
  const texts = [
    '你好',           // 中文
    'Hello',          // 英文
    'こんにちは',     // 日文
    '안녕하세요',     // 韩文
    'Привет',         // 俄文
    '🎉🎊🎈'          // Emoji
  ];

  console.log('   多语言文本编码测试:');

  texts.forEach(text => {
    const hex = stringToHex(text);
    const decoded = hexToString(hex);
    console.log(`   "${text}" -> ${hex.substring(0, 20)}... -> "${decoded}"`);
    assertEquals(decoded, text, `"${text}" 编解码应该一致`);
  });
});

test('场景: 区块链交易数据', () => {
  // 模拟一个简单的交易数据
  const txData = 'transfer(address,uint256)';
  const hex = stringToHex(txData);
  const decoded = hexToString(hex);

  console.log(`   交易数据: ${txData}`);
  console.log(`   编码: ${hex}`);
  console.log(`   解码: ${decoded}`);

  assertEquals(decoded, txData, '交易数据编解码应该一致');
});

// ==================== 边界测试 ====================
console.log('\n📝 测试 9: 边界情况');
console.log('-'.repeat(60));

test('非常长的字符串', () => {
  const longString = 'A'.repeat(1000);
  const hex = stringToHex(longString);
  const decoded = hexToString(hex);

  console.log(`   原始长度: ${longString.length}`);
  console.log(`   16进制长度: ${hex.length}`);
  console.log(`   解码长度: ${decoded.length}`);

  assertEquals(decoded, longString, '长字符串编解码应该一致');
});

test('包含换行和特殊字符', () => {
  const text = 'Line 1\nLine 2\tTabbed\r\nWindows Line';
  const hex = stringToHex(text);
  const decoded = hexToString(hex);

  console.log(`   原始: ${text.replace(/\n/g, '\\n').replace(/\t/g, '\\t').replace(/\r/g, '\\r')}`);
  console.log(`   解码: ${decoded.replace(/\n/g, '\\n').replace(/\t/g, '\\t').replace(/\r/g, '\\r')}`);

  assertEquals(decoded, text, '特殊字符应该保持不变');
});

test('Unicode 特殊字符', () => {
  const symbols = '©®™€£¥§¶†‡';
  const hex = stringToHex(symbols);
  const decoded = hexToString(hex);

  console.log(`   原始: ${symbols}`);
  console.log(`   16进制: ${hex}`);
  console.log(`   解码: ${decoded}`);

  assertEquals(decoded, symbols, 'Unicode符号应该正确编解码');
});

// ==================== 测试结果汇总 ====================
console.log('\n' + '='.repeat(60));
console.log('🎯 测试结果汇总\n');
console.log(`   ✅ 通过: ${passed} 个测试`);
console.log(`   ❌ 失败: ${failed} 个测试`);
console.log(`   📊 总计: ${passed + failed} 个测试`);
console.log(`   🎖️  成功率: ${((passed / (passed + failed)) * 100).toFixed(2)}%`);

if (failed === 0) {
  console.log('\n🎉 所有测试通过！16进制转换工具运行正常！\n');
} else {
  console.log('\n⚠️  部分测试失败，请检查代码！\n');
  process.exit(1);
}

console.log('='.repeat(60) + '\n');
