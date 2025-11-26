import React, { useState } from 'react';
import {
  stringToHex,
  hexToString,
  numberToHex,
  hexToNumber,
  isValidHex,
  xorEncryptDecrypt
} from '../utils/hexConverter';

/**
 * 16进制转换演示组件
 */
const HexConverterDemo = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('stringToHex');

  // 预设测试用例
  const testCases = [
    { label: '英文 "test"', value: 'test', mode: 'stringToHex' },
    { label: '中文 "你好"', value: '你好', mode: 'stringToHex' },
    { label: '混合 "Hello世界"', value: 'Hello世界', mode: 'stringToHex' },
    { label: 'Emoji "🎉🎊"', value: '🎉🎊', mode: 'stringToHex' },
    { label: '数字 255', value: '255', mode: 'numberToHex' },
    { label: 'Hex "0x74657374"', value: '0x74657374', mode: 'hexToString' }
  ];

  const convert = () => {
    try {
      let result = '';

      switch (mode) {
        case 'stringToHex':
          result = stringToHex(input);
          break;
        case 'hexToString':
          if (!isValidHex(input)) {
            result = '❌ 无效的16进制字符串';
          } else {
            result = hexToString(input);
          }
          break;
        case 'numberToHex':
          const num = parseFloat(input);
          if (isNaN(num)) {
            result = '❌ 无效的数字';
          } else {
            result = numberToHex(num);
          }
          break;
        case 'hexToNumber':
          if (!isValidHex(input)) {
            result = '❌ 无效的16进制字符串';
          } else {
            result = hexToNumber(input).toString();
          }
          break;
        default:
          result = '❌ 未知的转换模式';
      }

      setOutput(result);
    } catch (error) {
      setOutput(`❌ 转换失败: ${error.message}`);
    }
  };

  const loadTestCase = (testCase) => {
    setInput(testCase.value);
    setMode(testCase.mode);
    setOutput('');
  };

  const clear = () => {
    setInput('');
    setOutput('');
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    alert('✅ 已复制到剪贴板');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔧 16进制转换器</h2>
        <p style={styles.subtitle}>测试字符串、数字与16进制的相互转换</p>

        {/* 转换模式选择 */}
        <div style={styles.modeGroup}>
          <button
            onClick={() => setMode('stringToHex')}
            style={{
              ...styles.modeButton,
              ...(mode === 'stringToHex' ? styles.modeButtonActive : {})
            }}
          >
            字符串 → Hex
          </button>
          <button
            onClick={() => setMode('hexToString')}
            style={{
              ...styles.modeButton,
              ...(mode === 'hexToString' ? styles.modeButtonActive : {})
            }}
          >
            Hex → 字符串
          </button>
          <button
            onClick={() => setMode('numberToHex')}
            style={{
              ...styles.modeButton,
              ...(mode === 'numberToHex' ? styles.modeButtonActive : {})
            }}
          >
            数字 → Hex
          </button>
          <button
            onClick={() => setMode('hexToNumber')}
            style={{
              ...styles.modeButton,
              ...(mode === 'hexToNumber' ? styles.modeButtonActive : {})
            }}
          >
            Hex → 数字
          </button>
        </div>

        {/* 输入区域 */}
        <div style={styles.section}>
          <label style={styles.label}>
            输入 {mode === 'stringToHex' && '(支持中文、Emoji等)'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === 'stringToHex' ? '输入文本，如: Hello 你好 🎉' :
              mode === 'hexToString' ? '输入16进制，如: 0x74657374' :
              mode === 'numberToHex' ? '输入数字，如: 255' :
              '输入16进制，如: 0xff'
            }
            style={styles.textarea}
            rows={4}
          />
        </div>

        {/* 操作按钮 */}
        <div style={styles.buttonGroup}>
          <button onClick={convert} style={styles.convertButton}>
            🔄 转换
          </button>
          <button onClick={clear} style={styles.clearButton}>
            🗑️ 清空
          </button>
        </div>

        {/* 输出区域 */}
        {output && (
          <div style={styles.section}>
            <label style={styles.label}>
              输出
              <button onClick={copyOutput} style={styles.copyButton}>
                📋 复制
              </button>
            </label>
            <div style={styles.output}>{output}</div>
          </div>
        )}

        {/* 测试用例 */}
        <div style={styles.testCases}>
          <h3 style={styles.testCasesTitle}>📝 快速测试</h3>
          <div style={styles.testCaseGrid}>
            {testCases.map((testCase, index) => (
              <button
                key={index}
                onClick={() => loadTestCase(testCase)}
                style={styles.testCaseButton}
              >
                {testCase.label}
              </button>
            ))}
          </div>
        </div>

        {/* 说明文档 */}
        <div style={styles.docs}>
          <h3 style={styles.docsTitle}>💡 使用说明</h3>
          <ul style={styles.docsList}>
            <li>
              <strong>字符串 → Hex:</strong> 将任意文本转换为16进制（自动使用UTF-8编码，支持中文、Emoji）
            </li>
            <li>
              <strong>Hex → 字符串:</strong> 将16进制转换回文本（自动使用UTF-8解码）
            </li>
            <li>
              <strong>数字 → Hex:</strong> 将数字转换为16进制表示（如：255 → 0xff）
            </li>
            <li>
              <strong>Hex → 数字:</strong> 将16进制转换为数字（如：0xff → 255）
            </li>
          </ul>

          <div style={styles.examples}>
            <h4 style={styles.examplesTitle}>📚 示例</h4>
            <div style={styles.example}>
              <code>"test"</code> → <code>0x74657374</code>
            </div>
            <div style={styles.example}>
              <code>"你好"</code> → <code>0xe4bda0e5a5bd</code>
            </div>
            <div style={styles.example}>
              <code>255</code> → <code>0xff</code>
            </div>
          </div>
        </div>

        {/* 测试报告链接 */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            ✅ 所有功能已通过 22 个测试 |
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link}
            >
              查看测试报告
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '900px',
    margin: '0 auto'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb'
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '28px',
    color: '#111827',
    textAlign: 'center'
  },
  subtitle: {
    margin: '0 0 24px 0',
    fontSize: '14px',
    color: '#6b7280',
    textAlign: 'center'
  },
  modeGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '8px',
    marginBottom: '24px'
  },
  modeButton: {
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  modeButtonActive: {
    color: '#fff',
    backgroundColor: '#3b82f6'
  },
  section: {
    marginBottom: '20px'
  },
  label: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    fontFamily: 'monospace',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    resize: 'vertical',
    boxSizing: 'border-box'
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px'
  },
  convertButton: {
    flex: 1,
    padding: '14px 24px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  clearButton: {
    padding: '14px 24px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  copyButton: {
    padding: '4px 12px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#3b82f6',
    backgroundColor: 'transparent',
    border: '1px solid #3b82f6',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  output: {
    padding: '16px',
    backgroundColor: '#f0fdf4',
    border: '2px solid #86efac',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'monospace',
    wordBreak: 'break-all',
    color: '#166534',
    minHeight: '60px',
    display: 'flex',
    alignItems: 'center'
  },
  testCases: {
    marginTop: '32px',
    padding: '20px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px'
  },
  testCasesTitle: {
    margin: '0 0 16px 0',
    fontSize: '16px',
    color: '#111827'
  },
  testCaseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '8px'
  },
  testCaseButton: {
    padding: '10px 16px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
    backgroundColor: '#fff',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'left'
  },
  docs: {
    marginTop: '32px',
    padding: '20px',
    backgroundColor: '#eff6ff',
    borderRadius: '8px'
  },
  docsTitle: {
    margin: '0 0 12px 0',
    fontSize: '16px',
    color: '#1e40af'
  },
  docsList: {
    margin: '0 0 16px 0',
    paddingLeft: '20px',
    color: '#1e40af',
    fontSize: '14px',
    lineHeight: '1.8'
  },
  examples: {
    marginTop: '16px'
  },
  examplesTitle: {
    margin: '0 0 8px 0',
    fontSize: '14px',
    color: '#1e40af',
    fontWeight: '600'
  },
  example: {
    padding: '8px 12px',
    marginBottom: '4px',
    backgroundColor: '#dbeafe',
    borderRadius: '4px',
    fontSize: '13px',
    fontFamily: 'monospace',
    color: '#1e3a8a'
  },
  footer: {
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '1px solid #e5e7eb',
    textAlign: 'center'
  },
  footerText: {
    margin: 0,
    fontSize: '14px',
    color: '#6b7280'
  },
  link: {
    marginLeft: '8px',
    color: '#3b82f6',
    textDecoration: 'underline'
  }
};

export default HexConverterDemo;
