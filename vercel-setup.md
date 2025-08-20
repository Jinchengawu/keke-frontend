# Vercel 部署配置指南

## 环境变量配置

在 Vercel 控制台中，你需要设置以下环境变量：

### 必需的环境变量

```bash
# 数据库配置 (MongoDB)
DATABASE_URL="mongodb://username:password@hostname:port/database"

# Web3 合约配置
POSEIDON_PAY_CONTRACT="0x0000000000000000000000000000000000000000"

# 认证消息配置
AUTH_MSG="Sign this message to authenticate with Poseidon Pay: <timestamp>"

# 后端服务 URL
BACKEND_URL="https://your-backend-api.com"
```

### 可选的环境变量

```bash
# JWT Secret (用于Token验证)
JWT_SECRET="your-jwt-secret-key"

# 邮件服务配置 (如果使用 nodemailer)
SMTP_HOST="smtp.example.com"
SMTP_PORT="587" 
SMTP_USER="your-email@example.com"
SMTP_PASS="your-email-password"

# Next.js 认证配置
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="https://your-domain.vercel.app"
```

## 部署步骤

### 1. 准备数据库
- 设置 MongoDB 数据库（推荐使用 MongoDB Atlas）
- 获取数据库连接字符串

### 2. 在 Vercel 上创建项目
1. 登录 [Vercel](https://vercel.com)
2. 点击 "New Project"
3. 导入你的 GitHub 仓库

### 3. 配置环境变量
在 Vercel 项目设置中：
1. 进入 "Settings" → "Environment Variables"
2. 添加上述所有必需的环境变量

### 4. 部署设置
Vercel 会自动检测到这是一个 Next.js 项目，并使用 `vercel.json` 中的配置：
- Build Command: `prisma generate && yarn build`
- Install Command: `yarn install`
- Output Directory: `.next` (自动检测)

### 5. 数据库迁移
首次部署后，你可能需要运行数据库迁移：
```bash
npx prisma db push
```

## 重要注意事项

1. **数据库连接**: 确保 MongoDB 数据库允许来自 Vercel 的连接
2. **环境变量**: 敏感信息（如密钥）不要提交到代码库
3. **构建时间**: 项目包含 Prisma 生成，可能需要较长构建时间
4. **函数超时**: API 路由设置了30秒超时
5. **域名配置**: 部署后记得更新 `NEXTAUTH_URL` 为实际域名

## 常见问题

### 构建失败
- 检查环境变量是否正确设置
- 确保数据库连接字符串有效
- 查看构建日志中的具体错误信息

### 运行时错误
- 检查 API 路由是否能正常访问数据库
- 确认所有必需的环境变量都已设置
- 查看 Vercel Functions 日志

## 下一步

部署成功后，你可以：
1. 配置自定义域名
2. 设置 GitHub 自动部署
3. 配置分析和监控
4. 设置预览部署环境
