# 项目实战

> 综合运用 AI 辅助完成完整项目

## 🎯 学习目标

掌握 AI 辅助完整项目开发：
1. 项目需求分析
2. 架构设计
3. 模块开发
4. 测试和部署

---

## 实战项目 1: 个人博客系统

### 项目需求

创建一个功能完整的个人博客系统。

### 技术栈
- 后端: Python Flask + SQLAlchemy
- 前端: HTML + Tailwind CSS + JavaScript
- 数据库: SQLite
- 部署: Gunicorn

### 功能需求

```markdown
1. 文章管理
   - 创建、编辑、删除文章
   - 支持 Markdown 格式
   - 文章分类和标签
   - 文章搜索

2. 用户系统
   - 管理员登录
   - 文章评论（可选）

3. 前端展示
   - 文章列表页
   - 文章详情页
   - 分类/标签筛选
   - 响应式设计

4. 其他功能
   - 文章浏览统计
   - RSS 订阅
   - SEO 优化
```

### 使用 AI 开发的工作流

```markdown
Phase 1: 项目初始化
提示词: "使用 Flask 创建博客项目结构，包含：
- 项目目录结构
- 配置文件管理
- 应用工厂模式
- 蓝图注册
- 数据库模型设计"

Phase 2: 数据库设计
提示词: "设计博客系统的数据库模型：
- User 模型（管理员）
- Post 模型（文章）
- Category 模型（分类）
- Tag 模型（标签）
- Comment 模型（评论）
包含关系和约束"

Phase 3: API 开发
提示词: "实现博客系统的 RESTful API：
- 文章 CRUD
- 分类管理
- 标签管理
- 搜索功能
- 分页功能"

Phase 4: 前端开发
提示词: "创建博客前端页面：
- 基础模板（导航、页脚）
- 文章列表页（卡片布局）
- 文章详情页（Markdown 渲染）
- 管理后台（文章编辑）
使用 Tailwind CSS 美化"

Phase 5: 功能完善
提示词: "添加博客高级功能：
- Markdown 编辑器集成
- 代码高亮
- RSS 生成
- 浏览统计
- SEO meta 标签"

Phase 6: 测试和部署
提示词: "为博客系统添加：
- 单元测试
- 集成测试
- Docker 配置
- 部署文档"
```

### 项目结构

```
blog/
├── app/
│   ├── __init__.py
│   ├── models.py
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── auth.py
│   │   └── api.py
│   ├── templates/
│   │   ├── base.html
│   │   ├── index.html
│   │   ├── post.html
│   │   └── admin/
│   ├── static/
│   │   ├── css/
│   │   ├── js/
│   │   └── images/
│   └── utils/
│       ├── __init__.py
│       └── helpers.py
├── migrations/
├── tests/
├── config.py
├── requirements.txt
├── Dockerfile
└── README.md
```

### 核心代码示例

#### 1. 项目初始化 (app/__init__.py)

```python
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from config import config

db = SQLAlchemy()
login_manager = LoginManager()


def create_app(config_name='default'):
    """应用工厂函数"""
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # 初始化扩展
    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'
    
    # 注册蓝图
    from .routes import main, auth, api
    app.register_blueprint(main.bp)
    app.register_blueprint(auth.bp, url_prefix='/auth')
    app.register_blueprint(api.bp, url_prefix='/api')
    
    # 创建数据库表
    with app.app_context():
        db.create_all()
    
    return app
```

#### 2. 数据模型 (app/models.py)

```python
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from . import db


class User(UserMixin, db.Model):
    """用户模型"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    posts = db.relationship('Post', backref='author', lazy='dynamic')


post_tags = db.Table('post_tags',
    db.Column('post_id', db.Integer, db.ForeignKey('posts.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tags.id'), primary_key=True)
)


class Post(db.Model):
    """文章模型"""
    __tablename__ = 'posts'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(200), unique=True, nullable=False)
    summary = db.Column(db.Text)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    published = db.Column(db.Boolean, default=False)
    view_count = db.Column(db.Integer, default=0)
    
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    
    tags = db.relationship('Tag', secondary=post_tags, backref=db.backref('posts', lazy='dynamic'))
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'slug': self.slug,
            'summary': self.summary,
            'content': self.content,
            'created_at': self.created_at.isoformat(),
            'published': self.published,
            'view_count': self.view_count,
            'author': self.author.username if self.author else None,
            'category': self.category.name if self.category else None,
            'tags': [tag.name for tag in self.tags]
        }


class Category(db.Model):
    """分类模型"""
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    slug = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.String(200))
    
    posts = db.relationship('Post', backref='category', lazy='dynamic')


class Tag(db.Model):
    """标签模型"""
    __tablename__ = 'tags'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), unique=True, nullable=False)
    slug = db.Column(db.String(30), unique=True, nullable=False)
```

#### 3. 前端模板 (app/templates/base.html)

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}我的博客{% endblock %}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script>
    {% block extra_css %}{% endblock %}
</head>
<body class="bg-gray-50">
    <!-- 导航栏 -->
    <nav class="bg-white shadow-md">
        <div class="container mx-auto px-4 py-3">
            <div class="flex justify-between items-center">
                <a href="{{ url_for('main.index') }}" class="text-2xl font-bold text-gray-800">
                    我的博客
                </a>
                <div class="space-x-4">
                    <a href="{{ url_for('main.index') }}" class="text-gray-600 hover:text-gray-900">首页</a>
                    <a href="{{ url_for('main.categories') }}" class="text-gray-600 hover:text-gray-900">分类</a>
                    <a href="{{ url_for('main.tags') }}" class="text-gray-600 hover:text-gray-900">标签</a>
                    <a href="{{ url_for('main.about') }}" class="text-gray-600 hover:text-gray-900">关于</a>
                </div>
            </div>
        </div>
    </nav>
    
    <!-- 主内容区 -->
    <main class="container mx-auto px-4 py-8">
        {% block content %}{% endblock %}
    </main>
    
    <!-- 页脚 -->
    <footer class="bg-gray-800 text-white py-6 mt-12">
        <div class="container mx-auto px-4 text-center">
            <p>&copy; 2024 我的博客. Powered by Flask.</p>
        </div>
    </footer>
    
    <script>hljs.highlightAll();</script>
    {% block extra_js %}{% endblock %}
</body>
</html>
```

---

## 实战项目 2: 任务管理系统

### 项目需求

创建一个支持团队协作的任务管理系统。

### 技术栈
- 后端: Python FastAPI + SQLAlchemy + PostgreSQL
- 前端: React + TypeScript + Tailwind CSS
- 认证: JWT
- 实时: WebSocket

### 功能需求

```markdown
1. 用户管理
   - 注册/登录
   - 个人资料
   - 团队管理

2. 项目管理
   - 创建项目
   - 项目成员管理
   - 项目设置

3. 任务管理
   - 创建/编辑/删除任务
   - 任务状态流转（待办/进行中/已完成）
   - 任务优先级
   - 任务分配
   - 截止日期
   - 任务标签

4. 看板视图
   - 拖拽排序
   - 状态列
   - 过滤和搜索

5. 实时协作
   - 任务更新实时同步
   - 评论通知
   - 活动日志
```

### 项目结构

```
task-manager/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── routers/
│   │   ├── services/
│   │   └── utils/
│   ├── tests/
│   ├── alembic/
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   └── types/
│   ├── package.json
│   └── Dockerfile
└── docker-compose.yml
```

---

## 🎯 项目开发最佳实践

### 使用 AI 的阶段性策略

```markdown
第一阶段：需求分析
- 让 AI 帮助梳理功能点
- 生成需求文档
- 设计数据库 schema

第二阶段：架构设计
- 生成项目结构
- 选择技术栈
- 设计 API 接口

第三阶段：开发实现
- 分模块开发
- 逐个功能实现
- 持续测试

第四阶段：优化完善
- 代码重构
- 性能优化
- 添加测试

第五阶段：部署上线
- 生成 Dockerfile
- 编写部署文档
- CI/CD 配置
```

### 提示词模板

```markdown
项目初始化：
"创建一个 [技术栈] 项目，实现 [功能描述]。
要求：
1. 项目目录结构
2. 配置文件管理
3. 数据库模型
4. 基本路由结构
5. 错误处理机制"

功能开发：
"实现 [功能名称] 功能：
1. 接口设计
2. 数据库操作
3. 业务逻辑
4. 输入验证
5. 单元测试"

代码审查：
"审查以下代码：
1. 代码质量问题
2. 安全隐患
3. 性能优化建议
4. 最佳实践改进"
```

---

## 📝 学习总结

完成项目实战后，你应该掌握：

1. ✓ 完整的项目开发流程
2. ✓ 多模块协作开发
3. ✓ AI 辅助架构设计
4. ✓ 测试驱动开发

**下一步**: 
- 选择感兴趣的项目开始动手
- 参考案例代码，但不要照搬
- 尝试用 AI 解决遇到的问题
- 分享你的项目和经验

**恭喜你完成了所有学习案例！** 🎉

现在你已经具备了使用 AI 辅助编程的核心能力。继续实践、探索，并分享你的经验！
