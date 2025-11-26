# 快速开始指南

## 一分钟启动项目

### 1. 启动开发服务器

```bash
npm run dev
```

访问：http://localhost:3000

### 2. 连接 MetaMask

- 点击"💼 钱包连接"标签
- 点击"连接钱包"按钮
- 在 MetaMask 弹窗中授权

### 3. 测试功能

#### 查询链上数据（Ethers.js）
1. 切换到"⛓️ Ethers.js 数据"标签
2. 点击"获取当前区块号"
3. 点击"获取当前 Gas 价格"
4. 输入地址查询余额（或留空使用当前钱包地址）

#### 查询 The Graph 数据
1. 切换到"📊 The Graph 数据"标签
2. 点击"获取最近交易"查看 Uniswap V3 的交易
3. 点击"获取热门代币"查看交易量最高的代币
4. 在"用户交易"标签输入地址查询该用户的 Swap 记录

#### 使用16进制转换工具
1. 在"⛓️ Ethers.js 数据"标签滚动到底部
2. 输入文本（如 "Hello World"）
3. 点击"字符串→Hex"查看转换结果
4. 尝试"UTF8→Hex"转换中文（如 "你好"）

## 功能测试示例

### 测试 ERC20 代币查询

使用 USDC 代币合约（以太坊主网）：
```
代币地址: 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
账户地址: 使用你的钱包地址或任意地址
```

### 测试交易查询

使用任意以太坊主网交易哈希，例如：
```
0x... (从 Etherscan 复制一个交易哈希)
```

### 测试用户交易历史

使用 Vitalik 的地址：
```
0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
```

## 常用命令

```bash
# 开发模式
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview
```

## 网络切换

在 MetaMask 中可以切换以下网络测试：
- ✅ Ethereum Mainnet（主网）
- ✅ Goerli Testnet（测试网）
- ✅ Sepolia Testnet（测试网）
- ✅ Polygon Mainnet（需要手动添加）

## 故障排查

### 问题：MetaMask 未安装
**解决**：访问 https://metamask.io/download/ 安装插件

### 问题：The Graph 查询失败
**解决**：确保网络连接正常，The Graph API 可能有访问限制

### 问题：余额显示为 0
**解决**：确保钱包中有测试币（测试网可以从水龙头获取）

### 问题：交易查询失败
**解决**：确保交易哈希格式正确且存在于当前网络

## 进阶使用

### 自定义子图查询

编辑 [src/services/graphClient.js](src/services/graphClient.js):

```javascript
// 更换为你的子图 URL
const CUSTOM_SUBGRAPH = 'https://api.thegraph.com/subgraphs/name/your-name/your-subgraph';
graphService.setClient(CUSTOM_SUBGRAPH);
```

### 添加自定义合约调用

编辑 [src/services/ethersService.js](src/services/ethersService.js)，参考 `callContractMethod` 方法。

### 扩展16进制转换功能

编辑 [src/utils/hexConverter.js](src/utils/hexConverter.js)，添加自定义转换函数。

## 下一步

- 🔐 添加交易签名功能
- 💸 实现代币转账
- 🖼️ 集成 NFT 展示
- 📈 添加价格图表
- 🔔 实现事件监听和通知

享受开发！🚀
