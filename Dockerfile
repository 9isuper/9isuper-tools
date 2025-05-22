# 多阶段构建
# 构建阶段 - 如果需要在容器中构建
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:h5

# 运行阶段
FROM nginx:alpine

# 复制构建产物 - 优先使用本地已构建的dist目录
COPY dist/ /usr/share/nginx/html/
# 如果本地dist为空，则使用容器中构建的文件
COPY --from=builder /app/dist/ /usr/share/nginx/html/

# 复制Nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 添加健康检查
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q -O - http://localhost/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]