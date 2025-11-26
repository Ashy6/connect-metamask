import React, { useState } from 'react';
import { useMetaMask } from '../hooks/useMetaMask';
import { NETWORKS, getNetworkByChainId, getTestnets, getMainnets, getNetworkDisplayName } from '../config/networks';

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
    refreshBalance,
    switchNetwork,
    addNetwork
  } = useMetaMask();

  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [networkFilter, setNetworkFilter] = useState('all'); // 'all', 'mainnet', 'testnet'

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const formatBalance = (bal) => {
    if (!bal) return '0';
    return parseFloat(bal).toFixed(4);
  };

  const currentNetwork = getNetworkByChainId(chainId);

  const handleSwitchNetwork = async (network) => {
    try {
      await switchNetwork(network.chainIdDecimal);
      setShowNetworkModal(false);
    } catch (err) {
      // 如果网络不存在，尝试添加
      if (err.code === 4902 || err.message?.includes('未添加')) {
        try {
          await addNetwork({
            chainId: network.chainId,
            chainName: network.chainName,
            nativeCurrency: network.nativeCurrency,
            rpcUrls: network.rpcUrls,
            blockExplorerUrls: network.blockExplorerUrls
          });
          setShowNetworkModal(false);
        } catch (addErr) {
          console.error('添加网络失败:', addErr);
        }
      }
    }
  };

  const getFilteredNetworks = () => {
    const allNetworks = Object.values(NETWORKS);
    if (networkFilter === 'testnet') {
      return getTestnets();
    } else if (networkFilter === 'mainnet') {
      return getMainnets();
    }
    return allNetworks;
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
                title="复制地址"
              >
                📋
              </button>
            </div>

            <div style={styles.infoRow}>
              <span style={styles.label}>完整地址:</span>
              <span style={styles.valueSmall}>{account}</span>
            </div>

            {/* 网络信息和切换按钮 */}
            <div style={styles.infoRow}>
              <span style={styles.label}>网络:</span>
              <span style={styles.value}>
                {currentNetwork ? (
                  <>
                    {currentNetwork.icon} {currentNetwork.chainName}
                    {currentNetwork.isTestnet && (
                      <span style={styles.testnetBadge}>测试网</span>
                    )}
                  </>
                ) : (
                  `Chain ID: ${chainId}`
                )}
              </span>
              <button
                onClick={() => setShowNetworkModal(true)}
                style={styles.switchButton}
                title="切换网络"
              >
                🔄
              </button>
            </div>

            {/* 测试网水龙头链接 */}
            {currentNetwork?.isTestnet && currentNetwork?.faucet && (
              <div style={styles.faucetInfo}>
                💧 需要测试币？
                <a
                  href={currentNetwork.faucet}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.faucetLink}
                >
                  访问水龙头
                </a>
              </div>
            )}

            {/* 区块浏览器链接 */}
            {currentNetwork?.blockExplorerUrls && (
              <div style={styles.explorerInfo}>
                🔍 区块浏览器:
                <a
                  href={`${currentNetwork.blockExplorerUrls[0]}/address/${account}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.explorerLink}
                >
                  查看地址
                </a>
              </div>
            )}

            <div style={styles.infoRow}>
              <span style={styles.label}>余额:</span>
              <span style={styles.value}>
                {formatBalance(balance)} {currentNetwork?.nativeCurrency?.symbol || 'ETH'}
              </span>
              <button
                onClick={refreshBalance}
                style={styles.refreshButton}
                title="刷新余额"
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

      {/* 网络切换模态框 */}
      {showNetworkModal && (
        <div style={styles.modalOverlay} onClick={() => setShowNetworkModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>🌐 选择网络</h3>
              <button
                onClick={() => setShowNetworkModal(false)}
                style={styles.closeButton}
              >
                ✕
              </button>
            </div>

            {/* 网络过滤器 */}
            <div style={styles.filterGroup}>
              <button
                onClick={() => setNetworkFilter('all')}
                style={{
                  ...styles.filterButton,
                  ...(networkFilter === 'all' ? styles.filterButtonActive : {})
                }}
              >
                全部
              </button>
              <button
                onClick={() => setNetworkFilter('mainnet')}
                style={{
                  ...styles.filterButton,
                  ...(networkFilter === 'mainnet' ? styles.filterButtonActive : {})
                }}
              >
                主网
              </button>
              <button
                onClick={() => setNetworkFilter('testnet')}
                style={{
                  ...styles.filterButton,
                  ...(networkFilter === 'testnet' ? styles.filterButtonActive : {})
                }}
              >
                测试网
              </button>
            </div>

            {/* 网络列表 */}
            <div style={styles.networkList}>
              {getFilteredNetworks().map((network) => {
                const isCurrent = chainId === network.chainIdDecimal;
                return (
                  <div
                    key={network.chainId}
                    onClick={() => !isCurrent && handleSwitchNetwork(network)}
                    style={{
                      ...styles.networkItem,
                      ...(isCurrent ? styles.networkItemActive : {}),
                      cursor: isCurrent ? 'default' : 'pointer'
                    }}
                  >
                    <div style={styles.networkIcon}>{network.icon}</div>
                    <div style={styles.networkInfo}>
                      <div style={styles.networkName}>
                        {network.chainName}
                        {isCurrent && (
                          <span style={styles.currentBadge}>当前</span>
                        )}
                      </div>
                      <div style={styles.networkChainId}>
                        Chain ID: {network.chainIdDecimal}
                      </div>
                      {network.isTestnet && (
                        <div style={styles.networkTestnetTag}>
                          🧪 测试网
                          {network.faucet && (
                            <a
                              href={network.faucet}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={styles.faucetLinkInline}
                              onClick={(e) => e.stopPropagation()}
                            >
                              获取测试币
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    {!isCurrent && (
                      <div style={styles.networkArrow}>→</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
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
    wordBreak: 'break-all',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
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
  switchButton: {
    marginLeft: '8px',
    padding: '4px 8px',
    fontSize: '14px',
    border: 'none',
    background: '#3b82f6',
    color: '#fff',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  testnetBadge: {
    marginLeft: '8px',
    padding: '2px 6px',
    fontSize: '10px',
    backgroundColor: '#fbbf24',
    color: '#78350f',
    borderRadius: '4px',
    fontWeight: '600'
  },
  faucetInfo: {
    padding: '8px',
    marginBottom: '12px',
    backgroundColor: '#dbeafe',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#1e40af',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  faucetLink: {
    color: '#2563eb',
    textDecoration: 'underline',
    fontWeight: '600'
  },
  explorerInfo: {
    padding: '8px',
    marginBottom: '12px',
    backgroundColor: '#f3f4f6',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#374151',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  explorerLink: {
    color: '#3b82f6',
    textDecoration: 'underline',
    fontWeight: '600'
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
  },
  // 模态框样式
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  modalTitle: {
    margin: 0,
    fontSize: '20px',
    color: '#111827'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#6b7280',
    padding: '0',
    width: '30px',
    height: '30px'
  },
  filterGroup: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px'
  },
  filterButton: {
    flex: 1,
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  filterButtonActive: {
    color: '#fff',
    backgroundColor: '#3b82f6'
  },
  networkList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  networkItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    borderRadius: '8px',
    border: '2px solid #e5e7eb',
    transition: 'all 0.2s'
  },
  networkItemActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff'
  },
  networkIcon: {
    fontSize: '32px',
    marginRight: '12px'
  },
  networkInfo: {
    flex: 1
  },
  networkName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  networkChainId: {
    fontSize: '12px',
    color: '#6b7280'
  },
  networkTestnetTag: {
    fontSize: '12px',
    color: '#ca8a04',
    marginTop: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  faucetLinkInline: {
    color: '#2563eb',
    textDecoration: 'underline',
    fontSize: '11px'
  },
  networkArrow: {
    fontSize: '20px',
    color: '#9ca3af',
    marginLeft: '12px'
  },
  currentBadge: {
    padding: '2px 8px',
    fontSize: '11px',
    backgroundColor: '#10b981',
    color: '#fff',
    borderRadius: '4px',
    fontWeight: '600'
  }
};

export default WalletConnect;
