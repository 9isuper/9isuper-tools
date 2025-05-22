# 多阶段构建
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:h5

# 运行阶段
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist/ /usr/share/nginx/html/

# 复制Nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 添加健康检查
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q -O - http://localhost/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]