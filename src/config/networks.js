/**
 * 支持的网络配置
 */

export const NETWORKS = {
  // 以太坊主网
  ETHEREUM_MAINNET: {
    chainId: '0x1',
    chainIdDecimal: '1',
    chainName: 'Ethereum 主网',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://eth.llamarpc.com'],
    blockExplorerUrls: ['https://etherscan.io'],
    icon: '🔷',
    isTestnet: false
  },

  // Sepolia 测试网
  SEPOLIA_TESTNET: {
    chainId: '0xaa36a7',
    chainIdDecimal: '11155111',
    chainName: 'Sepolia 测试网',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'SepoliaETH',
      decimals: 18
    },
    rpcUrls: ['https://rpc.sepolia.org'],
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
    icon: '🧪',
    isTestnet: true,
    faucet: 'https://sepoliafaucet.com'
  },

  // Goerli 测试网
  GOERLI_TESTNET: {
    chainId: '0x5',
    chainIdDecimal: '5',
    chainName: 'Goerli 测试网',
    nativeCurrency: {
      name: 'Goerli Ether',
      symbol: 'GoerliETH',
      decimals: 18
    },
    rpcUrls: ['https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
    blockExplorerUrls: ['https://goerli.etherscan.io'],
    icon: '🧪',
    isTestnet: true,
    faucet: 'https://goerlifaucet.com'
  },

  // Polygon 主网
  POLYGON_MAINNET: {
    chainId: '0x89',
    chainIdDecimal: '137',
    chainName: 'Polygon 主网',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorerUrls: ['https://polygonscan.com'],
    icon: '🟣',
    isTestnet: false
  },

  // Mumbai 测试网
  MUMBAI_TESTNET: {
    chainId: '0x13881',
    chainIdDecimal: '80001',
    chainName: 'Mumbai 测试网',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com'],
    icon: '🧪',
    isTestnet: true,
    faucet: 'https://faucet.polygon.technology'
  },

  // Arbitrum 主网
  ARBITRUM_MAINNET: {
    chainId: '0xa4b1',
    chainIdDecimal: '42161',
    chainName: 'Arbitrum One',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://arbiscan.io'],
    icon: '🔵',
    isTestnet: false
  },

  // Arbitrum Sepolia 测试网
  ARBITRUM_SEPOLIA: {
    chainId: '0x66eee',
    chainIdDecimal: '421614',
    chainName: 'Arbitrum Sepolia',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://sepolia-rollup.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://sepolia.arbiscan.io'],
    icon: '🧪',
    isTestnet: true,
    faucet: 'https://faucet.quicknode.com/arbitrum/sepolia'
  },

  // Optimism 主网
  OPTIMISM_MAINNET: {
    chainId: '0xa',
    chainIdDecimal: '10',
    chainName: 'Optimism',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://mainnet.optimism.io'],
    blockExplorerUrls: ['https://optimistic.etherscan.io'],
    icon: '🔴',
    isTestnet: false
  },

  // Base 主网
  BASE_MAINNET: {
    chainId: '0x2105',
    chainIdDecimal: '8453',
    chainName: 'Base',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://mainnet.base.org'],
    blockExplorerUrls: ['https://basescan.org'],
    icon: '🔵',
    isTestnet: false
  },

  // Base Sepolia 测试网
  BASE_SEPOLIA: {
    chainId: '0x14a34',
    chainIdDecimal: '84532',
    chainName: 'Base Sepolia',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://sepolia.base.org'],
    blockExplorerUrls: ['https://sepolia.basescan.org'],
    icon: '🧪',
    isTestnet: true,
    faucet: 'https://www.coinbase.com/faucets/base-ethereum-goerli-faucet'
  }
};

/**
 * 根据 chainId 获取网络信息
 */
export const getNetworkByChainId = (chainId) => {
  return Object.values(NETWORKS).find(
    network => network.chainIdDecimal === chainId || network.chainId === chainId
  );
};

/**
 * 获取所有测试网
 */
export const getTestnets = () => {
  return Object.values(NETWORKS).filter(network => network.isTestnet);
};

/**
 * 获取所有主网
 */
export const getMainnets = () => {
  return Object.values(NETWORKS).filter(network => !network.isTestnet);
};

/**
 * 获取网络显示名称
 */
export const getNetworkDisplayName = (chainId) => {
  const network = getNetworkByChainId(chainId);
  return network ? `${network.icon} ${network.chainName}` : `Chain ID: ${chainId}`;
};
