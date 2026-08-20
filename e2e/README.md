## Ubuntu 26.04 安装

```bash  
# 升级到带 Ubuntu 26.04 支持的版本  
pnpm add -D @playwright/test@1.62.1  
# 安装浏览器  
pnpm exec playwright install chromium  
# 若提示缺系统库，再装依赖（26.04 下新版才完整支持）  
pnpm exec playwright install-deps chromium  

# 然后跑测试
pnpm test:e2e
```
