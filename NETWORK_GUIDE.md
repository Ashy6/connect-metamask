# 网络切换功能指南

## 功能概述

项目现已支持完整的网络切换功能，可以在多个主网和测试网之间自由切换，方便开发和测试。

## 支持的网络

### 主网 🔷
1. **Ethereum 主网** - Chain ID: 1
2. **Polygon 主网** - Chain ID: 137
3. **Arbitrum One** - Chain ID: 42161
4. **Optimism** - Chain ID: 10
5. **Base** - Chain ID: 8453

### 测试网 🧪
1. **Sepolia 测试网** - Chain ID: 11155111 (推荐)
2. **Goerli 测试网** - Chain ID: 5
3. **Mumbai 测试网** (Polygon) - Chain ID: 80001
4. **Arbitrum Sepolia** - Chain ID: 421614
5. **Base Sepolia** - Chain ID: 84532

## 如何使用

### 1. 连接钱包
首先在"💼 钱包连接"页面连接你的 MetaMask 钱包。

### 2. 查看当前网络
连接成功后，可以看到当前网络信息：
- 网络图标和名称
- 如果是测试网，会显示"测试网"标签
- 当前余额（以对应网络的原生代币显示）

### 3. 切换网络

#### 方法一：使用网络切换按钮
1. 在"网络"一栏右侧，点击 🔄 按钮
2. 在弹出的模态框中选择目标网络
3. MetaMask 会弹出确认窗口，点击"切换网络"

#### 方法二：使用过滤器
在网络切换模态框中：
- 点击"全部"查看所有网络
- 点击"主网"只显示主网
- 点击"测试网"只显示测试网

### 4. 自动添加网络
如果你的 MetaMask 中没有某个网络：
1. 选择该网络时，系统会自动尝试添加
2. MetaMask 会弹出"添加网络"确认窗口
3. 确认后即可使用该网络

## 测试网使用指南

### 获取测试币 💧

每个测试网都配置了水龙头（Faucet）链接：

**Sepolia 测试网**
- 水龙头：https://sepoliafaucet.com
- 需要 Alchemy 账户
- 每天可领取 0.5 SepoliaETH

**Goerli 测试网**
- 水龙头：https://goerlifaucet.com
- 社交账户验证
- 每天可领取一定数量 GoerliETH

**Mumbai 测试网**
- 水龙头：https://faucet.polygon.technology
- Polygon 官方水龙头
- 可领取 MATIC 测试币

**Arbitrum Sepolia**
- 水龙头：https://faucet.quicknode.com/arbitrum/sepolia
- QuickNode 提供
- 需要主网资产证明

**Base Sepolia**
- 水龙头：https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
- Coinbase 官方
- 需要 Coinbase 账户

### 查看测试网数据

1. **切换到测试网**
   - 在网络切换模态框选择任意测试网

2. **使用 Ethers.js 查询**
   - 切换到"⛓️ Ethers.js 数据"标签
   - 所有查询将自动使用当前测试网
   - 可以查询测试网的区块、交易、余额等

3. **区块浏览器**
   - 在钱包页面点击"查看地址"链接
   - 自动跳转到对应测试网的区块浏览器
   - 例如：Sepolia → sepolia.etherscan.io

## 特色功能

### 1. 智能网络识别
- 自动识别当前连接的网络
- 显示网络图标和名称
- 标注主网/测试网

### 2. 测试网助手
连接测试网时自动显示：
- 💧 测试币水龙头链接
- 🔍 测试网区块浏览器
- 🧪 测试网标识

### 3. 余额自动更新
- 切换网络后自动刷新余额
- 显示正确的代币符号（ETH/MATIC/等）
- 支持手动刷新

### 4. 网络配置管理
所有网络配置集中在 [src/config/networks.js](src/config/networks.js)：
- 易于添加新网络
- 统一的配置格式
- 支持自定义 RPC 节点

## 开发和测试建议

### 测试流程
1. **本地开发**
   - 使用 Sepolia 测试网（最新，支持最好）
   - 从水龙头获取测试币

2. **合约交互测试**
   - 在测试网部署合约
   - 使用测试网查询和交互
   - 避免消耗真实资产

3. **跨链测试**
   - 测试不同网络的兼容性
   - 验证多链支持

4. **上线前验证**
   - 在主网测试所有功能
   - 确保网络切换正常
   - 验证余额和交易查询

### 添加自定义网络

编辑 [src/config/networks.js](src/config/networks.js)：

```javascript
CUSTOM_NETWORK: {
  chainId: '0x...', // 16进制 Chain ID
  chainIdDecimal: '...', // 十进制 Chain ID
  chainName: '网络名称',
  nativeCurrency: {
    name: '代币名称',
    symbol: '符号',
    decimals: 18
  },
  rpcUrls: ['https://rpc-url.com'],
  blockExplorerUrls: ['https://explorer.com'],
  icon: '🔷', // 网络图标
  isTestnet: false, // 是否为测试网
  faucet: 'https://faucet.com' // 水龙头链接（测试网可选）
}
```

## 常见问题

### Q: 为什么无法切换到某个网络？
A: 可能是该网络的 RPC 节点不可用，尝试更新 RPC URL。

### Q: 测试币领取失败？
A:
- 检查是否满足水龙头要求（如账户验证）
- 尝试其他水龙头
- 24小时后重试

### Q: 如何查看测试网交易？
A: 在钱包页面点击"查看地址"，或直接访问对应网络的区块浏览器。

### Q: The Graph 支持测试网吗？
A: 项目默认使用主网的 Uniswap V3 子图。要查询测试网数据，需要：
1. 找到对应测试网的子图
2. 修改 [src/services/graphClient.js](src/services/graphClient.js) 中的 URL

### Q: 切换网络后余额不更新？
A: 点击余额右侧的 🔄 按钮手动刷新。

## 网络性能对比

| 网络 | 区块时间 | Gas 费用 | 最终确认 | 推荐用途 |
|------|----------|----------|----------|----------|
| Ethereum | ~12s | 高 | ~15分钟 | 主要应用 |
| Sepolia | ~12s | 免费 | ~15分钟 | 测试开发 |
| Polygon | ~2s | 低 | ~30s | 高频交易 |
| Arbitrum | ~0.25s | 很低 | ~15分钟 | Layer2 应用 |
| Base | ~2s | 低 | ~2分钟 | Coinbase 生态 |

## 最佳实践

1. **开发阶段**：使用 Sepolia 测试网
2. **集成测试**：测试所有支持的网络
3. **性能测试**：使用 Polygon 或 Arbitrum
4. **生产环境**：主网 + 主要 Layer2
5. **备份方案**：配置多个 RPC 节点

## 相关资源

- [Chainlist](https://chainlist.org/) - 完整的网络列表和 RPC
- [Sepolia Faucet](https://sepoliafaucet.com) - Sepolia 测试币
- [Ethereum Testnets](https://ethereum.org/en/developers/docs/networks/) - 以太坊测试网文档
- [Layer2 Networks](https://l2beat.com/) - Layer2 网络对比

---

**提示**: 始终在测试网上进行开发和测试，避免在主网上浪费 Gas 费用！
