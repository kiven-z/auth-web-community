# auth-web-community

Auth 管理后台 **Community Edition** 前端仓库。基于 Vue 3、Vite、Element Plus、Tailwind CSS，TypeScript 。

配套后端：[auth-server-community](https://github.com/kiven-z/auth-server-community)

配套文档：https://github.com/kiven-z/auth-docs

## 环境要求

- Node.js `^20.19.0` 或 `>=22.13.0`
- pnpm `>=9`

## 快速开始

```bash
pnpm install
pnpm dev            # 开发
pnpm dev:test       # test 模式
pnpm build          # 生产构建
pnpm preview        # 预览构建产物
```

## 常用脚本

| 命令                                                      | 用途                            |
|---------------------------------------------------------|-------------------------------|
| `pnpm typecheck`                                        | `tsc` + `vue-tsc` 类型检查        |
| `pnpm lint`                                             | ESLint + Prettier + Stylelint |
| `pnpm lint:eslint` / `lint:prettier` / `lint:stylelint` | 单独执行                          |
| `pnpm test` / `test:watch`                              | Vitest 单测                     |
| `pnpm test:e2e`                                         | Playwright E2E                |
| `pnpm test:e2e:local`                                   | 使用本机 Chrome 跑 E2E             |
| `pnpm test:e2e:install`                                 | 安装 Playwright 浏览器             |
| `pnpm clean:cache`                                      | 清 ESLint 缓存并重装依赖              |

## 目录结构

```
auth-web-community
├── src/
│   ├── api/            # 接口封装
│   ├── app/            # 应用级初始化
│   ├── auth/           # 鉴权相关
│   ├── components/     # 通用组件
│   ├── core/           # 核心运行时
│   ├── features/       # 业务功能域
│   ├── layout/         # 布局
│   ├── router/         # 路由
│   ├── services/       # 服务层
│   ├── shared/         # 跨模块复用
│   ├── store/          # Pinia store
│   └── style/          # 全局样式
├── locales/            # i18n 文案
├── mock/               # 本地 mock
├── e2e/                # Playwright 用例
├── build/              # 构建脚本
└── docker/             # 容器化
```

## 代码规范

- ESLint + Prettier + Stylelint，提交前执行 `pnpm lint`。

## 赞助

如果这个项目对你有帮助，欢迎打赏支持。

<table>
  <tr>
    <td align="center">
      <img src="./donate/WeChatPay.jpg" width="220" alt="微信" /><br/>
      微信
    </td>
    <td align="center">
      <img src="./donate/AliPay.jpg" width="220" alt="支付宝" /><br/>
      支付宝
    </td>
  </tr>
</table>

## 许可证

Copyright 2024-2026 Bunny。

本仓库基于 [Apache License 2.0](./LICENSE) 发布。
