import React, { useState } from 'react';
import { useChainData } from '../hooks/useChainData';
import { useMetaMask } from '../hooks/useMetaMask';
import hexConverter from '../utils/hexConverter';

/**
 * 链上数据展示组件 (使用 Ethers.js)
 */
const ChainDataDisplay = () => {
  const { account } = useMetaMask();
  const {
    loading,
    error,
    blockNumber,
    blockInfo,
    transactionInfo,
    gasPrice,
    fetchBlockNumber,
    fetchBlockInfo,
    fetchBalance,
    fetchTransaction,
    fetchGasPrice,
    fetchERC20Balance
  } = useChainData();

  const [queryAddress, setQueryAddress] = useState('');
  const [queryTxHash, setQueryTxHash] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [balanceResult, setBalanceResult] = useState(null);
  const [tokenBalanceResult, setTokenBalanceResult] = useState(null);
  const [hexInput, setHexInput] = useState('');
  const [hexOutput, setHexOutput] = useState('');

  const handleQueryBalance = async () => {
    const address = queryAddress || account;
    if (!address) {
      alert('请先连接钱包或输入地址');
      return;
    }
    const result = await fetchBalance(address);
    setBalanceResult(result);
  };

  const handleQueryTransaction = async () => {
    if (!queryTxHash) {
      alert('请输入交易哈希');
      return;
    }
    await fetchTransaction(queryTxHash);
  };

  const handleQueryTokenBalance = async () => {
    const address = queryAddress || account;
    if (!tokenAddress || !address) {
      alert('请输入代币地址和账户地址');
      return;
    }
    const result = await fetchERC20Balance(tokenAddress, address);
    setTokenBalanceResult(result);
  };

  const handleHexConvert = (type) => {
    try {
      let result = '';
      switch (type) {
        case 'stringToHex':
          result = hexConverter.stringToHex(hexInput);
          break;
        case 'hexToString':
          result = hexConverter.hexToString(hexInput);
          break;
        case 'utf8ToHex':
          result = hexConverter.utf8ToHex(hexInput);
          break;
        case 'hexToUtf8':
          result = hexConverter.hexToUtf8(hexInput);
          break;
        case 'numberToHex':
          result = hexConverter.numberToHex(Number(hexInput));
          break;
        case 'hexToNumber':
          result = hexConverter.hexToNumber(hexInput).toString();
          break;
        default:
          result = '不支持的转换类型';
      }
      setHexOutput(result);
    } catch (err) {
      setHexOutput('转换失败: ' + err.message);
    }
  };

  return (
    <div style={styles.container}>
      {/* 区块信息 */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>📦 区块信息</h3>
        <button onClick={fetchBlockNumber} disabled={loading} style={styles.button}>
          获取当前区块号
        </button>
        {blockNumber && (
          <div style={styles.result}>
            <strong>当前区块:</strong> {blockNumber.toString()}
          </div>
        )}

        <div style={styles.inputGroup}>
          <button onClick={() => fetchBlockInfo('latest')} disabled={loading} style={styles.button}>
            获取最新区块详情
          </button>
        </div>
        {blockInfo && (
          <div style={styles.resultBox}>
            <pre style={styles.pre}>
              {JSON.stringify({
                number: blockInfo.number,
                hash: blockInfo.hash,
                timestamp: new Date(blockInfo.timestamp * 1000).toLocaleString(),
                transactions: blockInfo.transactions?.length || 0
              }, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Gas 价格 */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>⛽ Gas 价格</h3>
        <button onClick={fetchGasPrice} disabled={loading} style={styles.button}>
          获取当前 Gas 价格
        </button>
        {gasPrice && (
          <div style={styles.resultBox}>
            <div><strong>Gas Price:</strong> {gasPrice.gasPrice} Gwei</div>
            {gasPrice.maxFeePerGas && (
              <>
                <div><strong>Max Fee:</strong> {gasPrice.maxFeePerGas} Gwei</div>
                <div><strong>Priority Fee:</strong> {gasPrice.maxPriorityFeePerGas} Gwei</div>
              </>
            )}
          </div>
        )}
      </div>

      {/* 余额查询 */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>💰 余额查询</h3>
        <div style={styles.inputGroup}>
          <input
            type="text"
            placeholder="输入地址 (留空使用当前连接地址)"
            value={queryAddress}
            onChange={(e) => setQueryAddress(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleQueryBalance} disabled={loading} style={styles.button}>
            查询余额
          </button>
        </div>
        {balanceResult && (
          <div style={styles.result}>
            <div><strong>余额:</strong> {balanceResult.eth} ETH</div>
            <div style={styles.smallText}>Wei: {balanceResult.wei}</div>
          </div>
        )}
      </div>

      {/* ERC20 代币余额 */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>🪙 ERC20 代币余额</h3>
        <div style={styles.inputGroup}>
          <input
            type="text"
            placeholder="代币合约地址"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleQueryTokenBalance} disabled={loading} style={styles.button}>
            查询代币余额
          </button>
        </div>
        {tokenBalanceResult && (
          <div style={styles.result}>
            <div><strong>代币:</strong> {tokenBalanceResult.symbol}</div>
            <div><strong>余额:</strong> {tokenBalanceResult.formatted}</div>
            <div style={styles.smallText}>原始值: {tokenBalanceResult.raw}</div>
          </div>
        )}
      </div>

      {/* 交易查询 */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>🔍 交易查询</h3>
        <div style={styles.inputGroup}>
          <input
            type="text"
            placeholder="交易哈希"
            value={queryTxHash}
            onChange={(e) => setQueryTxHash(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleQueryTransaction} disabled={loading} style={styles.button}>
            查询交易
          </button>
        </div>
        {transactionInfo && (
          <div style={styles.resultBox}>
            <h4>交易信息:</h4>
            <pre style={styles.pre}>
              {JSON.stringify({
                hash: transactionInfo.transaction?.hash,
                from: transactionInfo.transaction?.from,
                to: transactionInfo.transaction?.to,
                value: transactionInfo.transaction?.value?.toString(),
                status: transactionInfo.receipt?.status === 1 ? '成功' : '失败',
                blockNumber: transactionInfo.receipt?.blockNumber
              }, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* 16进制转换工具 */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>🔧 16进制转换工具</h3>
        <div style={styles.inputGroup}>
          <input
            type="text"
            placeholder="输入要转换的内容"
            value={hexInput}
            onChange={(e) => setHexInput(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.buttonGroup}>
          <button onClick={() => handleHexConvert('stringToHex')} style={styles.smallButton}>
            字符串→Hex
          </button>
          <button onClick={() => handleHexConvert('hexToString')} style={styles.smallButton}>
            Hex→字符串
          </button>
          <button onClick={() => handleHexConvert('utf8ToHex')} style={styles.smallButton}>
            UTF8→Hex
          </button>
          <button onClick={() => handleHexConvert('hexToUtf8')} style={styles.smallButton}>
            Hex→UTF8
          </button>
          <button onClick={() => handleHexConvert('numberToHex')} style={styles.smallButton}>
            数字→Hex
          </button>
          <button onClick={() => handleHexConvert('hexToNumber')} style={styles.smallButton}>
            Hex→数字
          </button>
        </div>
        {hexOutput && (
          <div style={styles.result}>
            <strong>转换结果:</strong>
            <div style={styles.hexOutput}>{hexOutput}</div>
          </div>
        )}
      </div>

      {loading && <div style={styles.loading}>加载中...</div>}
      {error && <div style={styles.error}>{error}</div>}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb'
  },
  cardTitle: {
    margin: '0 0 16px 0',
    fontSize: '18px',
    color: '#111827'
  },
  inputGroup: {
    marginBottom: '12px'
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    marginBottom: '8px',
    boxSizing: 'border-box'
  },
  button: {
    marginTop: '12px',
    marginBottom: '12px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    width: '100%'
  },
  buttonGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
    marginTop: '8px'
  },
  smallButton: {
    padding: '8px 12px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#fff',
    backgroundColor: '#6366f1',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  result: {
    marginTop: '12px',
    marginBottom: '12px',
    padding: '12px',
    backgroundColor: '#f0fdf4',
    borderRadius: '6px',
    border: '1px solid #86efac'
  },
  resultBox: {
    marginTop: '12px',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
    border: '1px solid #e5e7eb'
  },
  pre: {
    margin: 0,
    fontSize: '12px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all'
  },
  smallText: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '4px'
  },
  hexOutput: {
    marginTop: '8px',
    padding: '8px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '12px',
    wordBreak: 'break-all'
  },
  loading: {
    textAlign: 'center',
    padding: '20px',
    color: '#3b82f6',
    fontWeight: '600'
  },
  error: {
    padding: '12px',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    borderRadius: '6px',
    marginTop: '12px'
  }
};

export default ChainDataDisplay;
