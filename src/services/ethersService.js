import { ethers } from 'ethers';

/**
 * Ethers.js 链上数据读取服务
 */
class EthersService {
  constructor() {
    this.provider = null;
  }

  /**
   * 初始化 Provider
   * @param {string} rpcUrl - RPC 节点 URL (可选，默认使用 MetaMask)
   */
  initProvider(rpcUrl = null) {
    if (rpcUrl) {
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
    } else if (window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
    } else {
      throw new Error('未找到以太坊提供者');
    }
    return this.provider;
  }

  /**
   * 获取当前区块号
   */
  async getBlockNumber() {
    if (!this.provider) this.initProvider();
    return await this.provider.getBlockNumber();
  }

  /**
   * 获取区块信息
   * @param {number|string} blockNumber - 区块号或 'latest'
   */
  async getBlock(blockNumber = 'latest') {
    if (!this.provider) this.initProvider();
    return await this.provider.getBlock(blockNumber);
  }

  /**
   * 获取账户余额
   * @param {string} address - 账户地址
   */
  async getBalance(address) {
    if (!this.provider) this.initProvider();
    const balanceWei = await this.provider.getBalance(address);
    return {
      wei: balanceWei.toString(),
      eth: ethers.formatEther(balanceWei)
    };
  }

  /**
   * 获取交易数量（nonce）
   * @param {string} address - 账户地址
   */
  async getTransactionCount(address) {
    if (!this.provider) this.initProvider();
    return await this.provider.getTransactionCount(address);
  }

  /**
   * 获取交易详情
   * @param {string} txHash - 交易哈希
   */
  async getTransaction(txHash) {
    if (!this.provider) this.initProvider();
    return await this.provider.getTransaction(txHash);
  }

  /**
   * 获取交易回执
   * @param {string} txHash - 交易哈希
   */
  async getTransactionReceipt(txHash) {
    if (!this.provider) this.initProvider();
    return await this.provider.getTransactionReceipt(txHash);
  }

  /**
   * 获取 Gas 价格
   */
  async getGasPrice() {
    if (!this.provider) this.initProvider();
    const feeData = await this.provider.getFeeData();
    return {
      gasPrice: feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, 'gwei') : null,
      maxFeePerGas: feeData.maxFeePerGas ? ethers.formatUnits(feeData.maxFeePerGas, 'gwei') : null,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ? ethers.formatUnits(feeData.maxPriorityFeePerGas, 'gwei') : null
    };
  }

  /**
   * 获取网络信息
   */
  async getNetwork() {
    if (!this.provider) this.initProvider();
    const network = await this.provider.getNetwork();
    return {
      chainId: network.chainId.toString(),
      name: network.name,
      ensAddress: network.ensAddress
    };
  }

  /**
   * 估算 Gas 消耗
   * @param {Object} transaction - 交易对象
   */
  async estimateGas(transaction) {
    if (!this.provider) this.initProvider();
    const gasLimit = await this.provider.estimateGas(transaction);
    return gasLimit.toString();
  }

  /**
   * 调用合约方法（只读）
   * @param {string} contractAddress - 合约地址
   * @param {Array} abi - 合约 ABI
   * @param {string} methodName - 方法名
   * @param {Array} params - 方法参数
   */
  async callContractMethod(contractAddress, abi, methodName, params = []) {
    if (!this.provider) this.initProvider();
    const contract = new ethers.Contract(contractAddress, abi, this.provider);
    return await contract[methodName](...params);
  }

  /**
   * 获取 ERC20 代币余额
   * @param {string} tokenAddress - 代币合约地址
   * @param {string} accountAddress - 账户地址
   */
  async getERC20Balance(tokenAddress, accountAddress) {
    const erc20Abi = [
      'function balanceOf(address owner) view returns (uint256)',
      'function decimals() view returns (uint8)',
      'function symbol() view returns (string)'
    ];

    const balance = await this.callContractMethod(
      tokenAddress,
      erc20Abi,
      'balanceOf',
      [accountAddress]
    );

    const decimals = await this.callContractMethod(
      tokenAddress,
      erc20Abi,
      'decimals'
    );

    const symbol = await this.callContractMethod(
      tokenAddress,
      erc20Abi,
      'symbol'
    );

    return {
      raw: balance.toString(),
      formatted: ethers.formatUnits(balance, decimals),
      symbol,
      decimals
    };
  }

  /**
   * 获取 ERC721 NFT 信息
   * @param {string} nftAddress - NFT 合约地址
   * @param {string} tokenId - Token ID
   */
  async getERC721Info(nftAddress, tokenId) {
    const erc721Abi = [
      'function ownerOf(uint256 tokenId) view returns (address)',
      'function tokenURI(uint256 tokenId) view returns (string)',
      'function name() view returns (string)',
      'function symbol() view returns (string)'
    ];

    try {
      const owner = await this.callContractMethod(
        nftAddress,
        erc721Abi,
        'ownerOf',
        [tokenId]
      );

      const tokenURI = await this.callContractMethod(
        nftAddress,
        erc721Abi,
        'tokenURI',
        [tokenId]
      );

      const name = await this.callContractMethod(
        nftAddress,
        erc721Abi,
        'name'
      );

      const symbol = await this.callContractMethod(
        nftAddress,
        erc721Abi,
        'symbol'
      );

      return {
        owner,
        tokenURI,
        name,
        symbol,
        tokenId: tokenId.toString()
      };
    } catch (error) {
      console.error('获取 NFT 信息失败:', error);
      throw error;
    }
  }

  /**
   * 监听区块
   * @param {Function} callback - 回调函数
   */
  onBlock(callback) {
    if (!this.provider) this.initProvider();
    this.provider.on('block', callback);
    return () => this.provider.off('block', callback);
  }

  /**
   * 监听指定地址的交易
   * @param {string} address - 地址
   * @param {Function} callback - 回调函数
   */
  onAddressTransaction(address, callback) {
    if (!this.provider) this.initProvider();

    const filter = {
      address: null,
      topics: [
        null,
        ethers.zeroPadValue(address, 32)
      ]
    };

    this.provider.on(filter, callback);
    return () => this.provider.off(filter, callback);
  }

  /**
   * 解析交易输入数据
   * @param {string} data - 交易数据
   * @param {Array} abi - 合约 ABI
   */
  parseTransactionData(data, abi) {
    const iface = new ethers.Interface(abi);
    return iface.parseTransaction({ data });
  }

  /**
   * 格式化单位
   * @param {string|BigInt} value - 值
   * @param {string|number} unit - 单位 (如 'ether', 'gwei', 18)
   */
  formatUnits(value, unit = 'ether') {
    return ethers.formatUnits(value, unit);
  }

  /**
   * 解析单位
   * @param {string} value - 值
   * @param {string|number} unit - 单位 (如 'ether', 'gwei', 18)
   */
  parseUnits(value, unit = 'ether') {
    return ethers.parseUnits(value, unit);
  }
}

export default new EthersService();
