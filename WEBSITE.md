# 🌐 AI Coding 学习网站

基于 MkDocs Material 构建的现代化文档网站。

## ✨ 功能特性

- 🎨 **Material Design** - 现代化的设计风格
- 🌓 **深色/浅色模式** - 自动切换和手动选择
- 🔍 **全文搜索** - 快速搜索所有内容
- 📱 **响应式设计** - 完美适配移动端
- 🚀 **快速加载** - 静态页面，极速访问
- ✏️ **在线编辑** - 一键跳转到 GitHub 编辑
- 📊 **Mermaid 图表** - 支持流程图等图表
- 💻 **代码高亮** - 支持多种编程语言

## 📁 项目结构

```
ai-coding-learning/
├── docs/                      # 文档源文件
│   ├── index.md              # 首页
│   ├── 01-history/           # 历史演进
│   ├── 02-tools/             # 工具介绍
│   ├── 03-comparison/        # 对比分析
│   ├── 04-getting-started/   # 入门指南
│   ├── 05-best-practices/    # 最佳实践
│   ├── 06-examples/          # 实战案例
│   ├── stylesheets/          # 自定义样式
│   └── javascripts/          # 自定义脚本
├── .github/workflows/        # CI/CD 配置
├── mkdocs.yml               # MkDocs 配置
├── requirements.txt         # Python 依赖
└── DEPLOY.md               # 部署指南
```

## 🚀 快速开始

### 本地开发

```bash
# 1. 安装依赖
pip install -r requirements.txt

# 2. 启动开发服务器
mkdocs serve

# 3. 访问 http://127.0.0.1:8000
```

### 构建网站

```bash
mkdocs build
```

生成的静态文件在 `site/` 目录。

## 📝 添加新文章

### 方法 1: 直接创建文件

1. 在 `docs/` 目录下创建 Markdown 文件
2. 在 `mkdocs.yml` 的 `nav` 部分添加导航
3. 提交并推送，自动部署

### 方法 2: 使用命令行

```bash
# 创建新章节
mkdir docs/new-section
echo "# 新章节标题" > docs/new-section/index.md

# 更新导航后构建
mkdocs serve
```

## 🎨 自定义主题

### 修改颜色

编辑 `docs/stylesheets/extra.css`:

```css
:root {
  --md-primary-fg-color: #你的主色;
  --md-accent-fg-color: #你的强调色;
}
```

### 修改字体

编辑 `mkdocs.yml`:

```yaml
theme:
  font:
    text: 字体名称
    code: 等宽字体名称
```

## 📤 部署

### GitHub Pages（推荐）

已配置 GitHub Actions，推送到 main 分支自动部署。

### 其他平台

查看 [DEPLOY.md](DEPLOY.md) 了解 Vercel、Netlify、自有服务器等部署方式。

## 🔧 配置说明

### 网站信息

编辑 `mkdocs.yml`:

```yaml
site_name: 网站名称
site_description: 网站描述
site_author: 作者
site_url: https://yourdomain.com
```

### 社交链接

```yaml
extra:
  social:
    - icon: fontawesome/brands/github
      link: https://github.com/username
```

### Google Analytics

```yaml
extra:
  analytics:
    provider: google
    property: G-XXXXXXXXXX
```

## 🐛 常见问题

### 搜索不工作？

确保已安装搜索插件：
```bash
pip install mkdocs-material
```

### 样式未生效？

清除浏览器缓存或强制刷新：`Ctrl + Shift + R`

### 构建失败？

```bash
rm -rf site/
pip install -r requirements.txt --force-reinstall
mkdocs build
```

## 📚 相关链接

- [MkDocs 官方文档](https://www.mkdocs.org/)
- [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)
- [Markdown 语法指南](https://www.markdownguide.org/)

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/new-feature`
3. 提交更改：`git commit -am 'Add new feature'`
4. 推送分支：`git push origin feature/new-feature`
5. 创建 Pull Request

## 📄 许可证

MIT License - 自由使用、修改和分享

---

**Happy Coding! 🚀**
