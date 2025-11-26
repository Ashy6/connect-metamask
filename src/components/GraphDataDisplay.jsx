import React, { useState } from 'react';
import { useGraphData } from '../hooks/useGraphData';
import { useMetaMask } from '../hooks/useMetaMask';

/**
 * The Graph 数据展示组件
 */
const GraphDataDisplay = () => {
  const { account } = useMetaMask();
  const {
    loading,
    error,
    transactions,
    tokens,
    swaps,
    fetchTransactions,
    fetchTokens,
    fetchSwaps,
    fetchUserTransactions
  } = useGraphData();

  const [activeTab, setActiveTab] = useState('transactions');
  const [userAddress, setUserAddress] = useState('');

  const handleFetchUserTransactions = async () => {
    const address = userAddress || account;
    if (!address) {
      alert('请先连接钱包或输入地址');
      return;
    }
    await fetchUserTransactions(address, 10);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleString();
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    const value = parseFloat(num);
    if (value > 1000000) return (value / 1000000).toFixed(2) + 'M';
    if (value > 1000) return (value / 1000).toFixed(2) + 'K';
    return value.toFixed(4);
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>📊 The Graph 链上数据查询</h2>
        <p style={styles.subtitle}>基于 Uniswap V3 子图的数据查询示例</p>

        {/* Tab 导航 */}
        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab('transactions')}
            style={{
              ...styles.tab,
              ...(activeTab === 'transactions' ? styles.activeTab : {})
            }}
          >
            最近交易
          </button>
          <button
            onClick={() => setActiveTab('tokens')}
            style={{
              ...styles.tab,
              ...(activeTab === 'tokens' ? styles.activeTab : {})
            }}
          >
            热门代币
          </button>
          <button
            onClick={() => setActiveTab('swaps')}
            style={{
              ...styles.tab,
              ...(activeTab === 'swaps' ? styles.activeTab : {})
            }}
          >
            Swap 事件
          </button>
          <button
            onClick={() => setActiveTab('user')}
            style={{
              ...styles.tab,
              ...(activeTab === 'user' ? styles.activeTab : {})
            }}
          >
            用户交易
          </button>
        </div>

        {/* 内容区域 */}
        <div style={styles.content}>
          {/* 最近交易 */}
          {activeTab === 'transactions' && (
            <div>
              <button
                onClick={() => fetchTransactions({ first: 10 })}
                disabled={loading}
                style={styles.button}
              >
                获取最近交易
              </button>
              {transactions.length > 0 && (
                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>区块</th>
                        <th style={styles.th}>时间</th>
                        <th style={styles.th}>Gas Used</th>
                        <th style={styles.th}>Swaps</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx, index) => (
                        <tr key={index} style={styles.tr}>
                          <td style={styles.td}>{tx.blockNumber}</td>
                          <td style={styles.td}>{formatTimestamp(tx.timestamp)}</td>
                          <td style={styles.td}>{tx.gasUsed}</td>
                          <td style={styles.td}>{tx.swaps?.length || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 热门代币 */}
          {activeTab === 'tokens' && (
            <div>
              <button
                onClick={() => fetchTokens({ first: 10 })}
                disabled={loading}
                style={styles.button}
              >
                获取热门代币
              </button>
              {tokens.length > 0 && (
                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>代币</th>
                        <th style={styles.th}>符号</th>
                        <th style={styles.th}>交易量 (USD)</th>
                        <th style={styles.th}>TVL (USD)</th>
                        <th style={styles.th}>交易次数</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tokens.map((token, index) => (
                        <tr key={index} style={styles.tr}>
                          <td style={styles.td}>{token.name}</td>
                          <td style={styles.td}>{token.symbol}</td>
                          <td style={styles.td}>${formatNumber(token.volumeUSD)}</td>
                          <td style={styles.td}>${formatNumber(token.totalValueLockedUSD)}</td>
                          <td style={styles.td}>{token.txCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Swap 事件 */}
          {activeTab === 'swaps' && (
            <div>
              <button
                onClick={() => fetchSwaps({ first: 10 })}
                disabled={loading}
                style={styles.button}
              >
                获取 Swap 事件
              </button>
              {swaps.length > 0 && (
                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>时间</th>
                        <th style={styles.th}>交易对</th>
                        <th style={styles.th}>发送者</th>
                        <th style={styles.th}>金额 (USD)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {swaps.map((swap, index) => (
                        <tr key={index} style={styles.tr}>
                          <td style={styles.td}>
                            {formatTimestamp(swap.transaction.timestamp)}
                          </td>
                          <td style={styles.td}>
                            {swap.pool.token0.symbol}/{swap.pool.token1.symbol}
                          </td>
                          <td style={styles.td}>{formatAddress(swap.sender)}</td>
                          <td style={styles.td}>${formatNumber(swap.amountUSD)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 用户交易 */}
          {activeTab === 'user' && (
            <div>
              <div style={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="输入用户地址 (留空使用当前连接地址)"
                  value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                  style={styles.input}
                />
                <button
                  onClick={handleFetchUserTransactions}
                  disabled={loading}
                  style={styles.button}
                >
                  查询用户交易
                </button>
              </div>
              {swaps.length > 0 && (
                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>时间</th>
                        <th style={styles.th}>交易对</th>
                        <th style={styles.th}>类型</th>
                        <th style={styles.th}>金额 (USD)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {swaps.map((swap, index) => (
                        <tr key={index} style={styles.tr}>
                          <td style={styles.td}>
                            {formatTimestamp(swap.transaction.timestamp)}
                          </td>
                          <td style={styles.td}>
                            {swap.pool.token0.symbol}/{swap.pool.token1.symbol}
                          </td>
                          <td style={styles.td}>
                            {swap.sender.toLowerCase() === (userAddress || account || '').toLowerCase()
                              ? '发送'
                              : '接收'}
                          </td>
                          <td style={styles.td}>${formatNumber(swap.amountUSD)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {loading && <div style={styles.loading}>加载中...</div>}
        {error && <div style={styles.error}>{error}</div>}
      </div>

      {/* 说明文档 */}
      <div style={styles.infoCard}>
        <h3 style={styles.infoTitle}>💡 使用说明</h3>
        <ul style={styles.list}>
          <li>本示例使用 Uniswap V3 主网子图作为数据源</li>
          <li>可以查询最近的交易、热门代币、Swap 事件等链上数据</li>
          <li>支持查询特定用户的交易历史</li>
          <li>所有数据都是从 The Graph 去中心化索引网络获取</li>
          <li>你可以修改 graphClient.js 中的 URL 来查询其他子图</li>
        </ul>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb'
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '24px',
    color: '#111827'
  },
  subtitle: {
    margin: '0 0 20px 0',
    color: '#6b7280',
    fontSize: '14px'
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    borderBottom: '2px solid #e5e7eb',
    paddingBottom: '8px'
  },
  tab: {
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#6b7280',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '6px 6px 0 0',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  activeTab: {
    color: '#3b82f6',
    backgroundColor: '#eff6ff'
  },
  content: {
    minHeight: '300px'
  },
  inputGroup: {
    marginBottom: '16px'
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
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginBottom: '16px'
  },
  tableContainer: {
    overflowX: 'auto',
    marginTop: '16px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px'
  },
  th: {
    padding: '12px',
    textAlign: 'left',
    backgroundColor: '#f9fafb',
    borderBottom: '2px solid #e5e7eb',
    fontWeight: '600',
    color: '#374151'
  },
  tr: {
    borderBottom: '1px solid #e5e7eb'
  },
  td: {
    padding: '12px',
    color: '#111827'
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
  },
  infoCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #bfdbfe'
  },
  infoTitle: {
    margin: '0 0 12px 0',
    fontSize: '18px',
    color: '#1e40af'
  },
  list: {
    margin: 0,
    paddingLeft: '20px',
    color: '#1e40af',
    fontSize: '14px',
    lineHeight: '1.8'
  }
};

export default GraphDataDisplay;
