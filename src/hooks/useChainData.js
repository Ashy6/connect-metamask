import { useState, useCallback } from 'react';
import ethersService from '../services/ethersService';

/**
 * 链上数据读取 Hook
 */
export const useChainData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [blockNumber, setBlockNumber] = useState(null);
  const [blockInfo, setBlockInfo] = useState(null);
  const [transactionInfo, setTransactionInfo] = useState(null);
  const [gasPrice, setGasPrice] = useState(null);

  // 获取当前区块号
  const fetchBlockNumber = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const number = await ethersService.getBlockNumber();
      setBlockNumber(number);
      return number;
    } catch (err) {
      setError(err.message);
      console.error('获取区块号失败:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 获取区块信息
  const fetchBlockInfo = useCallback(async (blockNumber = 'latest') => {
    setLoading(true);
    setError(null);
    try {
      const info = await ethersService.getBlock(blockNumber);
      setBlockInfo(info);
      return info;
    } catch (err) {
      setError(err.message);
      console.error('获取区块信息失败:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 获取账户余额
  const fetchBalance = useCallback(async (address) => {
    setLoading(true);
    setError(null);
    try {
      const balance = await ethersService.getBalance(address);
      return balance;
    } catch (err) {
      setError(err.message);
      console.error('获取余额失败:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 获取交易信息
  const fetchTransaction = useCallback(async (txHash) => {
    setLoading(true);
    setError(null);
    try {
      const tx = await ethersService.getTransaction(txHash);
      const receipt = await ethersService.getTransactionReceipt(txHash);
      const info = {
        transaction: tx,
        receipt: receipt
      };
      setTransactionInfo(info);
      return info;
    } catch (err) {
      setError(err.message);
      console.error('获取交易信息失败:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 获取 Gas 价格
  const fetchGasPrice = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const price = await ethersService.getGasPrice();
      setGasPrice(price);
      return price;
    } catch (err) {
      setError(err.message);
      console.error('获取 Gas 价格失败:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 获取 ERC20 代币余额
  const fetchERC20Balance = useCallback(async (tokenAddress, accountAddress) => {
    setLoading(true);
    setError(null);
    try {
      const balance = await ethersService.getERC20Balance(tokenAddress, accountAddress);
      return balance;
    } catch (err) {
      setError(err.message);
      console.error('获取代币余额失败:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 获取 NFT 信息
  const fetchNFTInfo = useCallback(async (nftAddress, tokenId) => {
    setLoading(true);
    setError(null);
    try {
      const info = await ethersService.getERC721Info(nftAddress, tokenId);
      return info;
    } catch (err) {
      setError(err.message);
      console.error('获取 NFT 信息失败:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
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
    fetchERC20Balance,
    fetchNFTInfo
  };
};
