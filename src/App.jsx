import React, { useState } from 'react';
import WalletConnect from './components/WalletConnect';
import ChainDataDisplay from './components/ChainDataDisplay';
import GraphDataDisplay from './components/GraphDataDisplay';

/**
 * 主应用组件
 */
function App() {
  const [activeView, setActiveView] = useState('wallet');

  return (
    <div style={styles.app}>
      {/* 头部 */}
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>🔗 Web3 DApp 示例</h1>
        <p style={styles.headerSubtitle}>
          MetaMask 连接 + Ethers.js + The Graph
        </p>
      </header>

      {/* 导航栏 */}
      <nav style={styles.nav}>
        <button
          onClick={() => setActiveView('wallet')}
          style={{
            ...styles.navButton,
            ...(activeView === 'wallet' ? styles.navButtonActive : {})
          }}
        >
          💼 钱包连接
        </button>
        <button
          onClick={() => setActiveView('ethers')}
          style={{
            ...styles.navButton,
            ...(activeView === 'ethers' ? styles.navButtonActive : {})
          }}
        >
          ⛓️ Ethers.js 数据
        </button>
        <button
          onClick={() => setActiveView('graph')}
          style={{
            ...styles.navButton,
            ...(activeView === 'graph' ? styles.navButtonActive : {})
          }}
        >
          📊 The Graph 数据
        </button>
      </nav>

      {/* 主内容区 */}
      <main style={styles.main}>
        {activeView === 'wallet' && <WalletConnect />}
        {activeView === 'ethers' && <ChainDataDisplay />}
        {activeView === 'graph' && <GraphDataDisplay />}
      </main>

      {/* 底部 */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          Built with React + Ethers.js + The Graph
        </p>
        <div style={styles.features}>
          <span style={styles.feature}>✅ MetaMask 集成</span>
          <span style={styles.feature}>✅ 链上数据读取</span>
          <span style={styles.feature}>✅ The Graph 查询</span>
          <span style={styles.feature}>✅ 16进制转换工具</span>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  header: {
    backgroundColor: '#1f2937',
    color: '#fff',
    padding: '32px 20px',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  headerTitle: {
    margin: '0 0 8px 0',
    fontSize: '36px',
    fontWeight: '700'
  },
  headerSubtitle: {
    margin: 0,
    fontSize: '16px',
    color: '#9ca3af',
    fontWeight: '400'
  },
  nav: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    padding: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    flexWrap: 'wrap'
  },
  navButton: {
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#4b5563',
    backgroundColor: '#f9fafb',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  navButtonActive: {
    color: '#fff',
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6'
  },
  main: {
    padding: '20px',
    minHeight: 'calc(100vh - 300px)'
  },
  footer: {
    backgroundColor: '#1f2937',
    color: '#9ca3af',
    padding: '24px 20px',
    textAlign: 'center',
    marginTop: '40px'
  },
  footerText: {
    margin: '0 0 12px 0',
    fontSize: '14px'
  },
  features: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    flexWrap: 'wrap'
  },
  feature: {
    fontSize: '12px',
    padding: '4px 12px',
    backgroundColor: '#374151',
    borderRadius: '12px',
    color: '#d1d5db'
  }
};

export default App;
