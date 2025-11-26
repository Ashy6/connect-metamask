# MetaMask 连接与链上数据读取 DApp

一个完整的 Web3 前端应用示例，展示了如何连接 MetaMask 钱包、使用 Ethers.js 读取链上数据以及使用 The Graph 查询区块链数据。

## 功能特性

### 1. MetaMask 钱包连接 💼
- ✅ 连接/断开 MetaMask 钱包
- ✅ 显示账户地址和余额
- ✅ 自动检测网络切换
- ✅ 监听账户变化
- ✅ 支持多网络（以太坊主网、测试网等）

### 2. Ethers.js 链上数据读取 ⛓️
- ✅ 获取当前区块号和区块详情
- ✅ 查询账户余额
- ✅ 获取交易信息和回执
- ✅ 查询 Gas 价格
- ✅ ERC20 代币余额查询
- ✅ ERC721 NFT 信息查询
- ✅ 合约方法调用（只读）

### 3. The Graph 数据查询 📊
- ✅ 查询最近交易记录
- ✅ 获取热门代币信息
- ✅ Swap 事件监听
- ✅ 用户交易历史查询
- ✅ 流动性池数据
- ✅ 支持自定义 GraphQL 查询

### 4. 16进制转换工具 🔧
- ✅ 字符串与16进制互转
- ✅ UTF-8 与16进制互转
- ✅ 数字与16进制互转
- ✅ Buffer 与16进制互转
- ✅ XOR 加密/解密
- ✅ 16进制验证和补齐

## 技术栈

- **React 18** - 前端框架
- **Vite** - 构建工具
- **Ethers.js v6** - 以太坊交互库
- **Apollo Client** - GraphQL 客户端
- **The Graph** - 去中心化数据索引

## 项目结构

```
connect-metamask/
├── src/
│   ├── components/          # React 组件
│   │   ├── WalletConnect.jsx          # 钱包连接组件
│   │   ├── ChainDataDisplay.jsx       # 链上数据展示
│   │   └── GraphDataDisplay.jsx       # The Graph 数据展示
│   ├── hooks/               # 自定义 Hooks
│   │   ├── useMetaMask.js             # MetaMask 钱包 Hook
│   │   ├── useChainData.js            # 链上数据 Hook
│   │   └── useGraphData.js            # The Graph Hook
│   ├── services/            # 服务层
│   │   ├── ethersService.js           # Ethers.js 服务
│   │   └── graphClient.js             # The Graph 客户端
│   ├── utils/               # 工具函数
│   │   └── hexConverter.js            # 16进制转换工具
│   ├── App.jsx              # 主应用组件
│   ├── main.jsx             # 入口文件
│   └── index.css            # 全局样式
├── index.html               # HTML 模板
├── package.json             # 依赖配置
├── vite.config.js           # Vite 配置
└── README.md                # 项目文档
```

## 安装和运行

### 前置要求

- Node.js >= 16
- npm 或 yarn
- MetaMask 浏览器插件

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000

### 生产构建

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 使用指南

### 1. 连接钱包

1. 确保已安装 MetaMask 浏览器插件
2. 点击"连接钱包"按钮
3. 在 MetaMask 弹窗中授权连接
4. 连接成功后会显示账户地址、网络和余额

### 2. 查询链上数据

**区块信息：**
- 点击"获取当前区块号"查看最新区块
- 点击"获取最新区块详情"查看区块详细信息

**余额查询：**
- 输入以太坊地址（或使用当前连接地址）
- 点击"查询余额"获取 ETH 余额

**ERC20 代币：**
- 输入代币合约地址
- 点击"查询代币余额"获取代币余额和信息

**交易查询：**
- 输入交易哈希（txHash）
- 点击"查询交易"获取交易详情和状态

**16进制转换：**
- 输入要转换的内容
- 选择转换类型（字符串↔Hex、UTF8↔Hex、数字↔Hex）
- 查看转换结果

### 3. The Graph 数据查询

**最近交易：**
- 点击"获取最近交易"查看区块链上最近的交易记录

**热门代币：**
- 点击"获取热门代币"查看交易量最高的代币

**Swap 事件：**
- 点击"获取 Swap 事件"查看最近的交易所交换事件

**用户交易：**
- 输入用户地址（或使用当前连接地址）
- 点击"查询用户交易"查看该用户的交易历史

## 核心代码说明

### MetaMask 连接

```javascript
import { useMetaMask } from './hooks/useMetaMask';

function Component() {
  const { account, balance, connect, disconnect } = useMetaMask();

  return (
    <button onClick={connect}>连接钱包</button>
  );
}
```

### Ethers.js 数据读取

```javascript
import { useChainData } from './hooks/useChainData';

function Component() {
  const { fetchBalance, fetchTransaction } = useChainData();

  const queryBalance = async (address) => {
    const balance = await fetchBalance(address);
    console.log(balance.eth); // ETH 余额
  };
}
```

### The Graph 查询

```javascript
import { useGraphData } from './hooks/useGraphData';

function Component() {
  const { fetchTokens, tokens } = useGraphData();

  const getTokens = async () => {
    await fetchTokens({ first: 10 });
    console.log(tokens); // 代币列表
  };
}
```

### 16进制转换

```javascript
import hexConverter from './utils/hexConverter';

// 字符串转16进制
const hex = hexConverter.stringToHex('Hello');
// 结果: 0x48656c6c6f

// 16进制转字符串
const str = hexConverter.hexToString('0x48656c6c6f');
// 结果: Hello

// UTF-8 转16进制（支持中文）
const hexUtf8 = hexConverter.utf8ToHex('你好');

// XOR 加密
const encrypted = hexConverter.xorEncryptDecrypt(data, key);
```

## 自定义配置

### 更换 The Graph 子图

在 `src/services/graphClient.js` 中修改子图 URL：

```javascript
const CUSTOM_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/your-subgraph';
export const customClient = createGraphClient(CUSTOM_SUBGRAPH_URL);
```

### 添加自定义网络

```javascript
const networkConfig = {
  chainId: '0x89', // Polygon 主网
  chainName: 'Polygon Mainnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18
  },
  rpcUrls: ['https://polygon-rpc.com'],
  blockExplorerUrls: ['https://polygonscan.com']
};

await addNetwork(networkConfig);
```

## 常见问题

### Q: MetaMask 无法连接？
A: 确保已安装 MetaMask 插件，并且允许网站访问。

### Q: The Graph 查询失败？
A: 检查网络连接，确保子图 URL 正确且可访问。

### Q: 如何查询其他网络的数据？
A: 在 MetaMask 中切换到目标网络，或在 `ethersService.js` 中配置 RPC 节点。

### Q: 16进制转换工具支持哪些格式？
A: 支持字符串、UTF-8、数字、Buffer 与16进制的互相转换，以及 XOR 加密。

## 开发建议

1. **安全性**：永远不要在前端存储私钥或助记词
2. **错误处理**：所有链上操作都应该有完善的错误处理
3. **Gas 优化**：使用 `estimateGas` 预估 Gas 消耗
4. **测试网**：开发时优先使用测试网（Goerli、Sepolia）
5. **缓存**：合理使用缓存减少 RPC 调用次数

## 扩展功能建议

- [ ] 添加交易发送功能（需要签名）
- [ ] 实现代币转账
- [ ] 添加 NFT 展示界面
- [ ] 集成 ENS 域名解析
- [ ] 添加交易历史记录
- [ ] 支持多链切换
- [ ] 添加价格行情图表
- [ ] 实现钱包资产统计

## 相关资源

- [Ethers.js 文档](https://docs.ethers.org/)
- [The Graph 文档](https://thegraph.com/docs/)
- [MetaMask 文档](https://docs.metamask.io/)
- [Uniswap V3 子图](https://thegraph.com/explorer/subgraphs/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV)

## License

MIT
