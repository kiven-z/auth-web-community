# auth-web-community

Auth 管理后台 **Community Edition** 前端仓库。基于 Vue 3、Vite、Element Plus、Tailwind CSS，TypeScript 全量接入。

配套后端：[auth-server-community](https://github.com/kiven-z/auth-server-community)。

## Community Edition 说明

本仓库为开源社区版，与闭源完整版共享核心代码结构，便于问题修复双向合并。部分高级能力的页面与入口将在后续版本中裁剪；现阶段与完整版前端结构保持一致。

## 技术栈

| 类别     | 选型                                       |
|--------|------------------------------------------|
| 框架     | Vue 3.5、Vue Router 4、Pinia 3             |
| 构建     | Vite 7、pnpm ≥ 9                          |
| UI     | Element Plus 2.11、Tailwind CSS 4、Iconify |
| 语言     | TypeScript 5.9                           |
| 国际化    | Vue I18n 11                              |
| HTTP   | Axios                                    |
| 图表/编辑器 | ECharts 6、Monaco Editor、Mermaid          |
| 测试     | Vitest（单测）、Playwright（E2E）               |
| 质量     | ESLint 9、Prettier、Stylelint、SonarQube    |

## 环境要求

- Node.js `^20.19.0` 或 `>=22.13.0`
- pnpm `>=9`（`preinstall` 强制 pnpm，npm/yarn 会被拒绝）

## 快速开始

```bash
pnpm install
pnpm dev            # 开发
pnpm dev:test       # test 模式
pnpm build          # 生产构建
pnpm preview        # 预览构建产物
```

开发模式默认通过 Vite 代理访问后端网关，请确保 [auth-server-community](https://github.com/kiven-z/auth-server-community)
已启动。

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

## 容器化部署

详见 `docker/Dockerfile` 与 `docker/compose.yml`。

```bash
cd docker
./dockerctl.sh <env> up
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
