import { useState, useCallback } from 'react';
import graphService from '../services/graphClient';

/**
 * The Graph 数据查询 Hook
 */
export const useGraphData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [pools, setPools] = useState([]);
  const [swaps, setSwaps] = useState([]);

  // 查询交易记录
  const fetchTransactions = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await graphService.getTransactions(params);
      setTransactions(data);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('获取交易记录失败:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 查询代币信息
  const fetchTokens = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await graphService.getTokens(params);
      setTokens(data);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('获取代币信息失败:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 查询流动性池
  const fetchPools = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await graphService.getPools(params);
      setPools(data);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('获取池子信息失败:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 查询 Swap 事件
  const fetchSwaps = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await graphService.getSwaps(params);
      setSwaps(data);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('获取 Swap 事件失败:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 查询用户交易记录
  const fetchUserTransactions = useCallback(async (userAddress, first = 10) => {
    setLoading(true);
    setError(null);
    try {
      const data = await graphService.getUserTransactions(userAddress, first);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('获取用户交易记录失败:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 查询代币交易记录
  const fetchTokenTransactions = useCallback(async (tokenAddress, first = 10) => {
    setLoading(true);
    setError(null);
    try {
      const data = await graphService.getTokenTransactions(tokenAddress, first);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('获取代币交易记录失败:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 查询池子历史数据
  const fetchPoolDayData = useCallback(async (poolAddress, first = 30) => {
    setLoading(true);
    setError(null);
    try {
      const data = await graphService.getPoolDayData(poolAddress, first);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('获取池子历史数据失败:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 执行自定义查询
  const executeCustomQuery = useCallback(async (query, variables = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await graphService.customQuery(query, variables);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('执行自定义查询失败:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    transactions,
    tokens,
    pools,
    swaps,
    fetchTransactions,
    fetchTokens,
    fetchPools,
    fetchSwaps,
    fetchUserTransactions,
    fetchTokenTransactions,
    fetchPoolDayData,
    executeCustomQuery
  };
};
