# 🚀 部署指南

> 将 AI Coding Learning 网站部署到线上

## 📋 前提条件

- Python 3.8+
- pip 包管理器
- Git（可选，用于版本控制）

## 🛠️ 本地开发

### 1. 安装依赖

```bash
# 创建虚拟环境（推荐）
python -m venv venv

# 激活虚拟环境
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt
```

### 2. 启动开发服务器

```bash
mkdocs serve
```

访问 http://127.0.0.1:8000 查看网站

### 3. 实时预览

修改 Markdown 文件后，网站会自动刷新

## 🌐 构建静态网站

```bash
mkdocs build
```

生成的静态文件位于 `site/` 目录

## 📤 部署选项

### 方案 1: GitHub Pages（推荐）

#### 步骤 1: 创建 GitHub 仓库

```bash
# 初始化 Git 仓库
git init

# 添加远程仓库
git remote add origin https://github.com/yourusername/ai-coding-learning.git

# 提交代码
git add .
git commit -m "Initial commit"
git push -u origin main
```

#### 步骤 2: 配置 GitHub Actions

创建 `.github/workflows/ci.yml`:

```yaml
name: ci

on:
  push:
    branches:
      - main

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v4
        with:
          python-version: 3.x
      - run: pip install -r requirements.txt
      - run: mkdocs gh-deploy --force
```

#### 步骤 3: 启用 GitHub Pages

1. 进入仓库 Settings → Pages
2. Source 选择 "Deploy from a branch"
3. Branch 选择 "gh-pages"
4. 点击 Save

网站将在几分钟后上线：`https://yourusername.github.io/ai-coding-learning`

### 方案 2: Vercel

#### 步骤 1: 安装 Vercel CLI

```bash
npm i -g vercel
```

#### 步骤 2: 配置构建脚本

创建 `vercel.json`:

```json
{
  "builds": [
    {
      "src": "requirements.txt",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/site/$1"
    }
  ]
}
```

#### 步骤 3: 部署

```bash
vercel
```

### 方案 3: Netlify

#### 步骤 1: 本地构建

```bash
mkdocs build
```

#### 步骤 2: 部署到 Netlify

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 部署
netlify deploy --prod --dir=site
```

或者使用 Git 集成自动部署

### 方案 4: 自有服务器

#### 使用 Nginx

```nginx
server {
    listen 80;
    server_name ai-coding.yourdomain.com;
    root /var/www/ai-coding-learning/site;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    # 开启 gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

#### 使用 Docker

创建 `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
RUN mkdocs build

FROM nginx:alpine
COPY --from=0 /app/site /usr/share/nginx/html

EXPOSE 80
```

构建和运行:

```bash
docker build -t ai-coding-learning .
docker run -p 8080:80 ai-coding-learning
```

## 🔄 自动化部署

### 使用 GitHub Actions + GitHub Pages

已包含在 `.github/workflows/ci.yml` 中，每次推送到 main 分支会自动部署

### 使用 GitLab CI/CD

创建 `.gitlab-ci.yml`:

```yaml
image: python:3.11

pages:
  script:
    - pip install -r requirements.txt
    - mkdocs build --site-dir public
  artifacts:
    paths:
      - public
  only:
    - main
```

## 📝 添加新文章

### 方法 1: 直接添加 Markdown 文件

1. 在 `docs/` 目录下创建 `.md` 文件
2. 在 `mkdocs.yml` 的 `nav` 部分添加导航
3. 提交并推送，自动部署

### 方法 2: 使用命令行

```bash
# 创建新页面
mkdir docs/new-section
echo "# 新章节" > docs/new-section/index.md

# 更新导航后构建
mkdocs build
```

## 🔧 配置说明

### 修改网站信息

编辑 `mkdocs.yml`:

```yaml
site_name: 你的网站名称
site_description: 网站描述
site_author: 作者名
site_url: https://yourdomain.com
```

### 修改主题颜色

编辑 `docs/stylesheets/extra.css`:

```css
:root {
  --md-primary-fg-color: #你的主色;
  --md-accent-fg-color: #你的强调色;
}
```

### 添加 Google Analytics

编辑 `mkdocs.yml`:

```yaml
extra:
  analytics:
    provider: google
    property: G-XXXXXXXXXX
```

## 🐛 常见问题

### 问题 1: 构建失败

**解决:**
```bash
# 清理缓存
rm -rf site/

# 重新安装依赖
pip install -r requirements.txt --force-reinstall

# 重新构建
mkdocs build
```

### 问题 2: 页面 404

**检查:**
1. `mkdocs.yml` 中的 `nav` 配置是否正确
2. Markdown 文件路径是否正确
3. 文件是否已提交到 Git

### 问题 3: 样式未生效

**解决:**
```bash
# 强制刷新浏览器缓存
# 或添加版本号
extra_css:
  - stylesheets/extra.css?v=2
```

### 问题 4: 搜索不工作

**解决:**
确保 `mkdocs.yml` 中启用了搜索插件:
```yaml
plugins:
  - search
```

## 🎯 最佳实践

1. **本地测试后再部署**
   ```bash
   mkdocs serve
   ```

2. **使用版本控制**
   - 所有更改提交到 Git
   - 使用有意义的提交信息

3. **定期备份**
   - 使用 Git 进行版本控制
   - 定期推送到远程仓库

4. **监控网站状态**
   - 使用 Google Search Console
   - 设置 Google Analytics

## 📞 获取帮助

- [MkDocs 官方文档](https://www.mkdocs.org/)
- [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)
- [GitHub Issues](https://github.com/yourusername/ai-coding-learning/issues)

---

**Happy Coding! 🚀**
