# 🚀 Web3 DeFi Platform - Swap & Token Launch

一个基于 Next.js 和 Web3 技术栈构建的去中心化金融平台，支持代币交换（Swap）和代币发射功能。

## 📋 项目概述

本项目是一个现代化的 Web3 DeFi 应用，提供用户友好的界面来进行代币交换、代币发射以及相关的 DeFi 操作。项目采用最新的 Web3 技术栈，确保安全性、性能和用户体验。

## ✨ 核心功能

### 🔄 代币交换 (Swap)
- **多链支持**: 支持多个区块链网络的代币交换
- **实时价格**: 集成实时价格数据，确保交换汇率准确
- **滑点保护**: 智能滑点控制，保护用户免受价格波动影响
- **流动性池**: 支持多种流动性池，提供最优交换路径

### 🚀 代币发射 (Token Launch)
- **一键发币**: 简化的代币创建流程
- **智能合约部署**: 自动化智能合约部署和验证
- **代币管理**: 完整的代币生命周期管理
- **发射池配置**: 灵活的代币发射池参数设置

### 👤 用户管理
- **钱包连接**: 支持 MetaMask、WalletConnect 等主流钱包
- **用户仪表盘**: 个性化的用户数据面板
- **交易历史**: 完整的交易记录和分析

### 📊 数据分析
- **实时图表**: 基于 Chart.js 的交互式数据可视化
- **投资组合**: 用户资产组合跟踪和分析
- **市场数据**: 实时市场数据和趋势分析

## 🛠 技术栈

### 前端框架
- **Next.js 14.2.1**: React 全栈框架，支持 App Router
- **React 18**: 现代化的用户界面库
- **TypeScript**: 类型安全的 JavaScript 超集

### Web3 集成
- **Wagmi 2.5.7**: React Hooks for Ethereum
- **Viem 2.7.15**: TypeScript 接口的以太坊库
- **@wagmi/connectors**: 多钱包连接器支持

### UI 组件库
- **Ant Design 5.27.0**: 企业级 UI 设计语言
- **Material-UI 5.15.15**: Google Material Design 组件
- **Tailwind CSS 3.4.1**: 实用优先的 CSS 框架

### 数据管理
- **Prisma 6.14.0**: 现代化数据库 ORM
- **@tanstack/react-query 5.28.6**: 强大的数据获取库
- **Axios 1.6.8**: HTTP 客户端

### 数据可视化
- **Chart.js 4.4.2**: 灵活的图表库
- **react-chartjs-2 5.2.0**: Chart.js 的 React 封装

### 开发工具
- **ESLint**: 代码质量检查
- **PostCSS**: CSS 后处理器
- **Zod 4.0.17**: TypeScript 优先的模式验证

## 📁 项目结构

```
keke-frontend/
├── 📁 src/                          # 源代码目录
│   ├── 📁 app/                      # Next.js App Router
│   │   ├── 📁 (web)/               # Web 应用路由组
│   │   │   ├── 📁 mint/           # 代币铸造页面
│   │   │   ├── 📁 redeem/         # 代币赎回页面
│   │   │   ├── 📁 swap/           # 代币交换页面
│   │   │   └── 📁 wallet-demo/    # 钱包演示页面
│   │   └── 📁 api/                 # API 路由
│   │       ├── 📁 mint/           # 铸造 API
│   │       ├── 📁 redeem/         # 赎回 API
│   │       └── 📁 swap/           # 交换 API
│   ├── 📁 components/              # React 组件
│   │   ├── 📁 Alert/              # 警告组件
│   │   ├── 📁 Dashboard/          # 仪表盘组件
│   │   ├── 📁 Sidebar/            # 侧边栏组件
│   │   └── 📁 WalletConnect/      # 钱包连接组件
│   ├── 📁 hooks/                   # 自定义 React Hooks
│   ├── 📁 lib/                     # 工具库和配置
│   ├── 📁 services/                # 业务逻辑服务
│   └── 📁 styles/                  # 样式文件
├── 📁 _commons_/                   # 共享代码模块
│   ├── 📁 models/                 # 数据模型
│   ├── 📁 services/               # 共享服务
│   └── 📁 prisma/                 # 数据库模式
├── 📁 prisma/                      # Prisma 配置
├── 📁 public/                      # 静态资源
└── 📄 配置文件                     # 各种配置文件
```

## 🚀 快速开始

### 环境要求
- Node.js 18.0.0 或更高版本
- npm 或 yarn 包管理器
- Git

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd keke-frontend
```

2. **安装依赖**
```bash
npm install
# 或
yarn install
```

3. **环境配置**
```bash
cp .env.example .env.local
# 编辑 .env.local 文件，配置必要的环境变量
```

4. **数据库设置**
```bash
npx prisma generate
npx prisma db push
```

5. **启动开发服务器**
```bash
npm run dev
# 或
yarn dev
```

6. **访问应用**
打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 📝 开发规范

### 代码规范
- **TypeScript**: 所有新代码必须使用 TypeScript
- **ESLint**: 遵循项目的 ESLint 配置
- **Prettier**: 使用 Prettier 进行代码格式化
- **命名约定**: 使用 camelCase 命名变量和函数，PascalCase 命名组件

### 组件开发
- **函数组件**: 优先使用函数组件和 React Hooks
- **组件分离**: 保持组件单一职责，便于测试和维护
- **Props 类型**: 为所有组件定义明确的 Props 类型
- **默认导出**: 每个组件文件使用默认导出

### 文件组织
- **目录结构**: 遵循既定的目录结构
- **文件命名**: 使用 kebab-case 命名文件和目录
- **导入顺序**: 按照第三方库、内部模块、相对路径的顺序导入

### Git 工作流
- **分支命名**: `feature/功能名称`、`bugfix/问题描述`、`hotfix/紧急修复`
- **提交信息**: 使用清晰的提交信息，遵循 Conventional Commits 规范
- **代码审查**: 所有代码变更必须经过 Pull Request 审查

### Web3 开发规范
- **钱包连接**: 使用 Wagmi 进行钱包连接和状态管理
- **合约交互**: 通过 Viem 进行类型安全的合约交互
- **错误处理**: 妥善处理区块链交易错误和网络问题
- **用户体验**: 提供清晰的交易状态反馈

## 🔧 可用脚本

```bash
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run start    # 启动生产服务器
npm run lint     # 运行代码检查
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系我们

如有问题或建议，请通过以下方式联系我们：
- 项目 Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 邮箱: your-email@example.com

---

⭐ 如果这个项目对你有帮助，请给我们一个 Star！