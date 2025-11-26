import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

/**
 * The Graph 客户端配置
 * 这里以 Uniswap V3 子图为例
 */

// Uniswap V3 主网子图 URL
const UNISWAP_V3_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3';

// 创建 Apollo 客户端
export const createGraphClient = (subgraphUrl = UNISWAP_V3_SUBGRAPH_URL) => {
  return new ApolloClient({
    uri: subgraphUrl,
    cache: new InMemoryCache()
  });
};

// 默认客户端（Uniswap V3）
export const defaultClient = createGraphClient();

/**
 * GraphQL 查询定义
 */

// 查询交易记录
export const GET_TRANSACTIONS = gql`
  query GetTransactions($first: Int!, $skip: Int!, $orderBy: String!, $orderDirection: String!) {
    transactions(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      blockNumber
      timestamp
      gasUsed
      gasPrice
      mints {
        id
        amount0
        amount1
        amountUSD
      }
      swaps {
        id
        amount0
        amount1
        amountUSD
        token0 {
          symbol
        }
        token1 {
          symbol
        }
      }
      burns {
        id
        amount0
        amount1
        amountUSD
      }
    }
  }
`;

// 查询代币信息
export const GET_TOKENS = gql`
  query GetTokens($first: Int!, $orderBy: String!, $orderDirection: String!) {
    tokens(
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      symbol
      name
      decimals
      totalSupply
      volume
      volumeUSD
      txCount
      totalValueLocked
      totalValueLockedUSD
      derivedETH
    }
  }
`;

// 查询池子信息
export const GET_POOLS = gql`
  query GetPools($first: Int!, $orderBy: String!, $orderDirection: String!) {
    pools(
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      token0 {
        id
        symbol
        name
      }
      token1 {
        id
        symbol
        name
      }
      feeTier
      liquidity
      sqrtPrice
      tick
      volumeUSD
      txCount
      totalValueLockedUSD
      totalValueLockedToken0
      totalValueLockedToken1
    }
  }
`;

// 查询 Swap 事件
export const GET_SWAPS = gql`
  query GetSwaps($first: Int!, $skip: Int!, $orderBy: String!, $orderDirection: String!) {
    swaps(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      transaction {
        id
        blockNumber
        timestamp
      }
      pool {
        id
        token0 {
          symbol
        }
        token1 {
          symbol
        }
      }
      sender
      recipient
      amount0
      amount1
      amountUSD
      sqrtPriceX96
      tick
    }
  }
`;

// 查询特定地址的交易
export const GET_USER_TRANSACTIONS = gql`
  query GetUserTransactions($userAddress: String!, $first: Int!) {
    swaps(
      first: $first
      orderBy: timestamp
      orderDirection: desc
      where: {
        or: [
          { sender: $userAddress }
          { recipient: $userAddress }
        ]
      }
    ) {
      id
      transaction {
        id
        blockNumber
        timestamp
      }
      pool {
        token0 {
          symbol
          id
        }
        token1 {
          symbol
          id
        }
      }
      sender
      recipient
      amount0
      amount1
      amountUSD
    }
  }
`;

// 查询特定代币的交易
export const GET_TOKEN_TRANSACTIONS = gql`
  query GetTokenTransactions($tokenAddress: String!, $first: Int!) {
    swaps(
      first: $first
      orderBy: timestamp
      orderDirection: desc
      where: {
        or: [
          { token0: $tokenAddress }
          { token1: $tokenAddress }
        ]
      }
    ) {
      id
      transaction {
        id
        blockNumber
        timestamp
      }
      pool {
        id
      }
      token0 {
        symbol
        id
      }
      token1 {
        symbol
        id
      }
      amount0
      amount1
      amountUSD
    }
  }
`;

// 查询流动性池的历史数据
export const GET_POOL_DAY_DATA = gql`
  query GetPoolDayData($poolAddress: String!, $first: Int!) {
    poolDayDatas(
      first: $first
      orderBy: date
      orderDirection: desc
      where: { pool: $poolAddress }
    ) {
      id
      date
      volumeUSD
      tvlUSD
      feesUSD
      txCount
      high
      low
      open
      close
    }
  }
`;

/**
 * The Graph 服务类
 */
class GraphService {
  constructor(client = defaultClient) {
    this.client = client;
  }

  /**
   * 设置自定义客户端
   */
  setClient(subgraphUrl) {
    this.client = createGraphClient(subgraphUrl);
  }

  /**
   * 查询交易记录
   */
  async getTransactions(params = {}) {
    const {
      first = 10,
      skip = 0,
      orderBy = 'timestamp',
      orderDirection = 'desc'
    } = params;

    try {
      const { data } = await this.client.query({
        query: GET_TRANSACTIONS,
        variables: { first, skip, orderBy, orderDirection }
      });
      return data.transactions;
    } catch (error) {
      console.error('查询交易记录失败:', error);
      throw error;
    }
  }

  /**
   * 查询代币信息
   */
  async getTokens(params = {}) {
    const {
      first = 10,
      orderBy = 'volumeUSD',
      orderDirection = 'desc'
    } = params;

    try {
      const { data } = await this.client.query({
        query: GET_TOKENS,
        variables: { first, orderBy, orderDirection }
      });
      return data.tokens;
    } catch (error) {
      console.error('查询代币信息失败:', error);
      throw error;
    }
  }

  /**
   * 查询池子信息
   */
  async getPools(params = {}) {
    const {
      first = 10,
      orderBy = 'totalValueLockedUSD',
      orderDirection = 'desc'
    } = params;

    try {
      const { data } = await this.client.query({
        query: GET_POOLS,
        variables: { first, orderBy, orderDirection }
      });
      return data.pools;
    } catch (error) {
      console.error('查询池子信息失败:', error);
      throw error;
    }
  }

  /**
   * 查询 Swap 事件
   */
  async getSwaps(params = {}) {
    const {
      first = 10,
      skip = 0,
      orderBy = 'timestamp',
      orderDirection = 'desc'
    } = params;

    try {
      const { data } = await this.client.query({
        query: GET_SWAPS,
        variables: { first, skip, orderBy, orderDirection }
      });
      return data.swaps;
    } catch (error) {
      console.error('查询 Swap 事件失败:', error);
      throw error;
    }
  }

  /**
   * 查询用户交易记录
   */
  async getUserTransactions(userAddress, first = 10) {
    try {
      const { data } = await this.client.query({
        query: GET_USER_TRANSACTIONS,
        variables: { userAddress: userAddress.toLowerCase(), first }
      });
      return data.swaps;
    } catch (error) {
      console.error('查询用户交易记录失败:', error);
      throw error;
    }
  }

  /**
   * 查询代币交易记录
   */
  async getTokenTransactions(tokenAddress, first = 10) {
    try {
      const { data } = await this.client.query({
        query: GET_TOKEN_TRANSACTIONS,
        variables: { tokenAddress: tokenAddress.toLowerCase(), first }
      });
      return data.swaps;
    } catch (error) {
      console.error('查询代币交易记录失败:', error);
      throw error;
    }
  }

  /**
   * 查询池子历史数据
   */
  async getPoolDayData(poolAddress, first = 30) {
    try {
      const { data } = await this.client.query({
        query: GET_POOL_DAY_DATA,
        variables: { poolAddress: poolAddress.toLowerCase(), first }
      });
      return data.poolDayDatas;
    } catch (error) {
      console.error('查询池子历史数据失败:', error);
      throw error;
    }
  }

  /**
   * 执行自定义查询
   */
  async customQuery(query, variables = {}) {
    try {
      const { data } = await this.client.query({
        query,
        variables
      });
      return data;
    } catch (error) {
      console.error('执行自定义查询失败:', error);
      throw error;
    }
  }
}

export default new GraphService();
