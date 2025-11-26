import React from 'react';
import { useMetaMask } from '../hooks/useMetaMask';

/**
 * 钱包连接组件
 */
const WalletConnect = () => {
  const {
    account,
    chainId,
    balance,
    isConnecting,
    error,
    isConnected,
    isMetaMaskInstalled,
    connect,
    disconnect,
    refreshBalance
  } = useMetaMask();

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const formatBalance = (bal) => {
    if (!bal) return '0';
    return parseFloat(bal).toFixed(4);
  };

  const getNetworkName = (id) => {
    const networks = {
      '1': 'Ethereum 主网',
      '5': 'Goerli 测试网',
      '11155111': 'Sepolia 测试网',
      '137': 'Polygon 主网',
      '80001': 'Mumbai 测试网'
    };
    return networks[id] || `Chain ID: ${id}`;
  };

  if (!isMetaMaskInstalled) {
    return (
      <div style={styles.container}>
        <div style={styles.warning}>
          <h3>❌ MetaMask 未安装</h3>
          <p>请先安装 MetaMask 浏览器插件</p>
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.link}
          >
            点击下载 MetaMask
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>💼 MetaMask 钱包</h2>

        {error && (
          <div style={styles.error}>
            <strong>错误:</strong> {error}
          </div>
        )}

        {!isConnected ? (
          <button
            onClick={connect}
            disabled={isConnecting}
            style={styles.button}
          >
            {isConnecting ? '连接中...' : '连接钱包'}
          </button>
        ) : (
          <div style={styles.walletInfo}>
            <div style={styles.infoRow}>
              <span style={styles.label}>地址:</span>
              <span style={styles.value}>{formatAddress(account)}</span>
              <button
                onClick={() => navigator.clipboard.writeText(account)}
                style={styles.copyButton}
              >
                📋
              </button>
            </div>

            <div style={styles.infoRow}>
              <span style={styles.label}>完整地址:</span>
              <span style={styles.valueSmall}>{account}</span>
            </div>

            <div style={styles.infoRow}>
              <span style={styles.label}>网络:</span>
              <span style={styles.value}>{getNetworkName(chainId)}</span>
            </div>

            <div style={styles.infoRow}>
              <span style={styles.label}>余额:</span>
              <span style={styles.value}>{formatBalance(balance)} ETH</span>
              <button
                onClick={refreshBalance}
                style={styles.refreshButton}
              >
                🔄
              </button>
            </div>

            <button
              onClick={disconnect}
              style={{ ...styles.button, ...styles.disconnectButton }}
            >
              断开连接
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb'
  },
  title: {
    margin: '0 0 20px 0',
    fontSize: '24px',
    color: '#111827'
  },
  button: {
    width: '100%',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  disconnectButton: {
    backgroundColor: '#ef4444',
    marginTop: '16px'
  },
  walletInfo: {
    marginTop: '16px'
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
    padding: '8px',
    backgroundColor: '#f9fafb',
    borderRadius: '6px'
  },
  label: {
    fontWeight: '600',
    color: '#374151',
    minWidth: '80px'
  },
  value: {
    flex: 1,
    color: '#111827',
    wordBreak: 'break-all'
  },
  valueSmall: {
    flex: 1,
    color: '#6b7280',
    fontSize: '12px',
    wordBreak: 'break-all'
  },
  copyButton: {
    marginLeft: '8px',
    padding: '4px 8px',
    fontSize: '14px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer'
  },
  refreshButton: {
    marginLeft: '8px',
    padding: '4px 8px',
    fontSize: '14px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer'
  },
  error: {
    padding: '12px',
    marginBottom: '16px',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    borderRadius: '6px',
    border: '1px solid #fecaca'
  },
  warning: {
    padding: '24px',
    backgroundColor: '#fef3c7',
    borderRadius: '12px',
    border: '1px solid #fde68a',
    textAlign: 'center'
  },
  link: {
    display: 'inline-block',
    marginTop: '12px',
    padding: '8px 16px',
    color: '#fff',
    backgroundColor: '#f59e0b',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: '600'
  }
};

export default WalletConnect;
