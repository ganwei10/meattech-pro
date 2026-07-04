# MeatTech Pro — 工业化肉制品研发与智能中试平台

Next.js 14 全栈项目，包含动态内容管理、中试预约系统和管理后台。

## 技术栈

- **前端**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **数据库**: PostgreSQL (Vercel Postgres) + Prisma ORM
- **认证**: JWT (jose) + iron-session

## 本地开发

```bash
npm install
npx prisma generate
npx prisma db push
node prisma/seed.js
npm run dev
```

## Vercel 部署

1. 在 Vercel Dashboard 创建 Postgres 数据库
2. 将连接串设置为环境变量 `DATABASE_URL`
3. 部署即可自动构建

## 环境变量

| 变量名 | 说明 |
|--------|------|
| `DATABASE_URL` | PostgreSQL 连接串 (Vercel Postgres) |

## 管理后台

- 访问 `/admin` 进入管理后台
- 默认账号: `admin@meattech.pro` / 密码: `admin123`
