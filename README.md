# 9isuper-tools

## Docker 构建说明

### 自动构建
项目配置了两种 GitHub Actions 工作流：

1. **自动构建** (触发于代码推送)
- 当代码推送到 `main` 分支时自动触发
- 当创建新的 tag（格式：`v*`）时自动触发
- 构建完成后自动推送到 Docker Hub

2. **手动构建** (手动触发)
可以通过 GitHub Actions 页面手动触发构建，支持以下参数：
- `image_tag`: Docker 镜像标签（默认：latest）
- `docker_hub_repo`: Docker Hub 仓库地址
- `build_in_action`: 是否在 GitHub Actions 中构建项目（true/false）

### 本地构建
1. 构建 Docker 镜像
```bash
docker build -t your-username/9isuper-tools:latest .
```

2. 运行容器
```bash
docker run -d -p 8080:80 your-username/9isuper-tools:latest
```

### 配置说明
1. GitHub Secrets 配置
需要在 GitHub 仓库设置中配置以下 secrets：
- `DOCKER_HUB_USERNAME`: Docker Hub 用户名
- `DOCKER_HUB_TOKEN`: Docker Hub 访问令牌

2. 目录结构
```
.
├── .github/workflows/    # GitHub Actions 配置
├── dist/                # 构建输出目录
├── Dockerfile          # Docker 构建文件
└── nginx.conf         # Nginx 配置文件
```

### 健康检查
Docker 镜像已配置健康检查，每30秒检查一次服务状态。

### 注意事项
- 推送到 Docker Hub 前请确保已正确配置 GitHub Secrets
- 手动构建时可以选择是否在 GitHub Actions 中构建项目
- 本地构建时会自动使用本地的 dist 目录（如果存在）