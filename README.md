# 🚀 Keke Frontend - Web3 DeFi Platform

一个基于 Next.js 构建的 Web3 去中心化金融平台，提供 RWA（Real World Assets）代币化、质押、交易和流动性管理等功能。

## ✨ 主要功能

- 🔐 **钱包连接与认证** - MetaMask 等钱包集成
- 📋 **KYC 认证系统** - 用户身份验证和文档审核
- 💰 **RWA 代币质押** - 实物资产代币化质押获得收益
- 🔄 **代币交换** - 支持多种代币之间的兑换
- 💧 **流动性管理** - 流动性池添加和管理
- 🎯 **代币赎回** - 灵活的代币赎回机制
- 📊 **数据看板** - 实时数据图表和统计
- ⚙️ **管理后台** - 完整的管理员功能

## 🛠️ 技术栈

### 前端框架
- **Next.js 14.2.1** - React 全栈框架
- **React 18** - 用户界面库
- **TypeScript** - 类型安全的 JavaScript

### UI 组件库
- **Ant Design 5.27** - 企业级 UI 设计语言
- **Material-UI 5.15** - React UI 框架
- **Tailwind CSS 3.4** - 实用优先的 CSS 框架

### Web3 集成
- **Ethers.js 6.12** - 以太坊 JavaScript 库
- **MetaMask** - 钱包连接

### 数据管理
- **Prisma 6.14** - 现代化数据库 ORM
- **MongoDB** - NoSQL 数据库
- **Axios** - HTTP 客户端

### 其他工具
- **Chart.js 4.4** - 数据可视化
- **JWT** - 身份验证
- **Zod** - 数据验证

## 📦 快速开始

### 环境要求

- Node.js 18+ 
- npm 或 yarn
- MongoDB 数据库
- Git

### 1. 克隆项目

```bash
git clone https://github.com/Jinchengawu/keke-frontend.git
cd keke-frontend
```

### 2. 安装依赖

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install
```

### 3. 环境配置

创建 `.env.local` 文件并配置以下环境变量：

```env
# 数据库配置
DATABASE_URL="mongodb://localhost:27017/keke_db"

# 认证配置
AUTH_MSG="Sign this message to authenticate with Poseidon Pay: <timestamp>"
JWT_SECRET="your-jwt-secret-key"

# 智能合约地址
POSEIDON_PAY_CONTRACT="0x0000000000000000000000000000000000000000"

# 后端 API 地址
BACKEND_URL="http://localhost:3001"

# 邮件服务配置（可选）
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-email-password"
```

### 4. 数据库初始化

```bash
# 生成 Prisma 客户端
npx prisma generate

# 推送数据库模式（首次运行）
npx prisma db push
```

### 5. 启动开发服务器

```bash
# 开发模式
npm run dev

# 或
yarn dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📁 项目结构

```
keke-frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (admin)/           # 管理员页面
│   │   │   ├── dashboard/     # 仪表盘
│   │   │   ├── mint/          # 代币铸造
│   │   │   ├── redeem/        # 代币赎回
│   │   │   ├── swap/          # 代币交换
│   │   │   ├── kyc/           # KYC 管理
│   │   │   └── settings/      # 设置
│   │   ├── (auth)/            # 认证页面
│   │   │   ├── login/         # 登录
│   │   │   ├── register/      # 注册
│   │   │   └── pay/           # 支付
│   │   └── api/               # API 路由
│   │       ├── auth/          # 认证 API
│   │       ├── kyc/           # KYC API
│   │       ├── mint/          # 铸造 API
│   │       ├── redeem/        # 赎回 API
│   │       └── swap/          # 交换 API
│   ├── components/            # 可复用组件
│   │   ├── Auth/              # 认证组件
│   │   ├── Dashboard/         # 仪表盘组件
│   │   ├── RWA/               # RWA 相关组件
│   │   └── Sidebar/           # 侧边栏组件
│   ├── lib/                   # 工具库
│   │   ├── auth.ts            # 认证逻辑
│   │   ├── db.ts              # 数据库连接
│   │   └── antd-theme.ts      # UI 主题
│   ├── services/              # 服务层
│   │   ├── auth-service.ts    # 认证服务
│   │   ├── base-service.ts    # 基础服务
│   │   ├── config-service.ts  # 配置服务
│   │   ├── user-service.ts    # 用户服务
│   │   └── web3service.ts     # Web3 服务
│   └── styles/                # 样式文件
├── prisma/                    # 数据库模式
│   └── schema.prisma          # Prisma 模式定义
├── public/                    # 静态资源
└── _commons_/                 # 共享模块
```

## 🔧 开发指南

### 可用脚本

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 代码检查
npm run lint

# 数据库相关
npx prisma studio          # 打开数据库管理界面
npx prisma generate         # 生成 Prisma 客户端
npx prisma db push          # 推送模式变更
npx prisma db pull          # 从数据库拉取模式
```

### 开发规范

1. **组件开发**
   - 使用 TypeScript 编写所有组件
   - 遵循 React Hooks 最佳实践
   - 使用 Ant Design 组件库

2. **API 开发**
   - 使用 Next.js API Routes
   - 实现统一的错误处理
   - 使用 Zod 进行数据验证

3. **样式规范**
   - 优先使用 Tailwind CSS 类
   - 自定义样式放在 `styles/` 目录
   - 保持设计系统一致性

4. **数据库操作**
   - 使用 Prisma ORM
   - 遵循数据库最佳实践
   - 注意性能优化

## 🌐 部署

### 构建生产版本

```bash
npm run build
```

### 环境变量

确保在生产环境中设置所有必要的环境变量：

- `DATABASE_URL` - 生产数据库连接串
- `JWT_SECRET` - JWT 密钥
- `POSEIDON_PAY_CONTRACT` - 智能合约地址
- `BACKEND_URL` - 后端服务地址

### 部署平台

项目可以部署到：
- **Vercel** (推荐) - Next.js 原生支持
- **Netlify** - 静态网站托管
- **AWS/阿里云** - 云服务器部署
- **Docker** - 容器化部署

## 🔐 安全注意事项

1. **环境变量安全**
   - 敏感信息不要提交到代码库
   - 使用 `.env.local` 存储本地配置

2. **钱包安全**
   - 验证用户钱包签名
   - 实施适当的授权检查

3. **API 安全**
   - 实施速率限制
   - 验证所有输入数据
   - 使用 HTTPS

## 🤝 贡献指南

1. Fork 此仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📝 许可证

此项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🆘 获得帮助

如果您遇到问题或有疑问：

1. 查看 [Issues](https://github.com/Jinchengawu/keke-frontend/issues)
2. 创建新的 Issue 描述问题
3. 参考项目文档和代码注释

## 📚 相关链接

- [Next.js 文档](https://nextjs.org/docs)
- [Ant Design 文档](https://ant.design/docs/react/introduce-cn)
- [Prisma 文档](https://www.prisma.io/docs)
- [Ethers.js 文档](https://docs.ethers.io/v6/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

---

🎯 **开始构建下一代 Web3 DeFi 应用！**
