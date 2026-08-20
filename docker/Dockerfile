FROM node:20-alpine AS build-stage

WORKDIR /app

RUN npm config set registry https://registry.npmmirror.com \
 && npm install -g pnpm@10.34.5

COPY .npmrc package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm config set registry https://registry.npmmirror.com \
    && pnpm install --frozen-lockfile

COPY . .
RUN npm run build

FROM nginx:stable-alpine AS production-stage

# Alpine 需 tzdata，nginx 日志等才按 TZ 显示
RUN apk add --no-cache tzdata
ENV TZ=Asia/Shanghai \
    GATEWAY_HOST=auth-gateway

# 官方镜像会对 /etc/nginx/templates/*.template 做 envsubst（替换 GATEWAY_HOST）
COPY docker/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
