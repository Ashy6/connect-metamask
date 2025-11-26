import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

/**
 * MetaMask 钱包连接 Hook
 * @returns {Object} 钱包状态和操作方法
 */
export const useMetaMask = () => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [balance, setBalance] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // 检查 MetaMask 是否安装
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  };

  // 获取账户余额
  const getBalance = useCallback(async (address, providerInstance) => {
    try {
      const balanceWei = await providerInstance.getBalance(address);
      const balanceEth = ethers.formatEther(balanceWei);
      setBalance(balanceEth);
      return balanceEth;
    } catch (err) {
      console.error('获取余额失败:', err);
      return null;
    }
  }, []);

  // 连接钱包
  const connect = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      const errorMsg = '请先安装 MetaMask 钱包插件';
      setError(errorMsg);
      alert(errorMsg);
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // 请求账户访问权限
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      // 创建 Provider 和 Signer
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const web3Signer = await web3Provider.getSigner();

      // 获取链ID
      const network = await web3Provider.getNetwork();
      const currentChainId = network.chainId.toString();

      // 设置状态
      setAccount(accounts[0]);
      setChainId(currentChainId);
      setProvider(web3Provider);
      setSigner(web3Signer);

      // 获取余额
      await getBalance(accounts[0], web3Provider);

      console.log('钱包连接成功:', {
        account: accounts[0],
        chainId: currentChainId
      });
    } catch (err) {
      console.error('连接钱包失败:', err);
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  }, [getBalance]);

  // 断开连接
  const disconnect = useCallback(() => {
    setAccount(null);
    setChainId(null);
    setBalance(null);
    setProvider(null);
    setSigner(null);
    setError(null);
  }, []);

  // 切换网络
  const switchNetwork = useCallback(async (targetChainId) => {
    if (!isMetaMaskInstalled()) {
      setError('MetaMask 未安装');
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ethers.toQuantity(targetChainId) }]
      });
    } catch (err) {
      // 如果网络不存在，尝试添加网络
      if (err.code === 4902) {
        console.error('该网络未添加到 MetaMask');
        setError('该网络未添加到 MetaMask，请手动添加');
      } else {
        console.error('切换网络失败:', err);
        setError(err.message);
      }
    }
  }, []);

  // 添加自定义网络
  const addNetwork = useCallback(async (networkConfig) => {
    if (!isMetaMaskInstalled()) {
      setError('MetaMask 未安装');
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkConfig]
      });
    } catch (err) {
      console.error('添加网络失败:', err);
      setError(err.message);
    }
  }, []);

  // 监听账户变化
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        // 用户断开了所有账户
        disconnect();
      } else if (accounts[0] !== account) {
        // 切换了账户
        setAccount(accounts[0]);
        if (provider) {
          getBalance(accounts[0], provider);
        }
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [account, provider, disconnect, getBalance]);

  // 监听链变化
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleChainChanged = (newChainId) => {
      // 链变化时重新加载页面（MetaMask 推荐的做法）
      window.location.reload();
    };

    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  // 自动连接（如果之前已授权）
  useEffect(() => {
    const autoConnect = async () => {
      if (!isMetaMaskInstalled()) return;

      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts'
        });

        if (accounts.length > 0) {
          // 之前已授权，自动连接
          await connect();
        }
      } catch (err) {
        console.error('自动连接失败:', err);
      }
    };

    autoConnect();
  }, []);

  return {
    account,
    chainId,
    balance,
    provider,
    signer,
    isConnecting,
    error,
    isConnected: !!account,
    isMetaMaskInstalled: isMetaMaskInstalled(),
    connect,
    disconnect,
    switchNetwork,
    addNetwork,
    refreshBalance: () => account && provider && getBalance(account, provider)
  };
};
