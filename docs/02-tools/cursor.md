# Cursor

> 为 AI 时代重新设计的代码编辑器

## 🎯 概述

Cursor 是基于 VS Code 构建的 AI 原生编辑器，将 AI 能力深度集成到编辑器的每一个操作中。它不只是一个带 AI 插件的编辑器，而是从底层为 AI 协作设计的开发环境。

**发布日期**: 2023年3月

**开发商**: Anysphere Inc.

**用户规模**: 月活超 100 万开发者

## ⭐ 核心功能

### 1. Tab 自动补全

Cursor 的 Tab 补全比传统代码补全更智能：

```python
# 输入
users = User.objects.filter(

# 按 Tab 后（Cursor 理解上下文）
users = User.objects.filter(
    is_active=True,
    created_at__gte=timezone.now() - timedelta(days=30)
).select_related('profile').order_by('-last_login')
```

### 2. Chat 模式 (⌘+L)

侧边栏 AI 助手，支持：
- 代码问答
- 文件分析
- 项目理解
- 多轮对话

### 3. Composer 模式 (⌘+I)

最强大的功能 - 多文件编辑：

```
用户: "给所有 API 接口添加 JWT 认证中间件"
Cursor: 自动修改多个文件，包括：
- middleware/auth.py (新增)
- settings.py (配置)
- urls.py (更新)
- views.py (装饰器)
```

### 4. Agent 模式

Cursor 可以：
- 自主规划任务
- 搜索和读取相关文件
- 执行终端命令
- 运行测试验证结果

## 💰 定价方案

| 版本 | 价格 | 功能 |
|------|------|------|
| **Hobby** | 免费 | 基础功能，有限配额 |
| **Pro** | $20/月 | 无限快速请求 + GPT-4/Claude |
| **Business** | $40/用户/月 | 团队管理 + 集中计费 |

## 🛠️ 技术特点

### 底层架构
```
┌─────────────────────────────────────┐
│           Cursor 编辑器              │
├─────────────────────────────────────┤
│  VS Code 内核 + Cursor AI 层         │
│                                     │
│  - 代码索引引擎 (Codebase Index)    │
│  - 多模型支持 (GPT-4, Claude, o1)   │
│  - 上下文感知系统                   │
│  - 智能文件操作                     │
└─────────────────────────────────────┘
```

### 代码库索引
Cursor 会自动索引整个项目：
- 支持百万行代码的项目
- 模糊搜索相关代码
- 跨文件引用理解
- 智能上下文窗口管理

## 🚀 使用技巧

### Composer 最佳实践

```markdown
1. 明确描述需求
   "添加用户认证功能，包括登录、注册和 JWT 验证"

2. 指定技术栈
   "使用 Django REST Framework 和 SimpleJWT"

3. 说明约束条件
   "保持现有代码风格，遵循 PEP 8"

4. 分步骤验证
   - 先生成模型
   - 再生成序列化器
   - 最后生成视图
```

### 快捷键

| 快捷键 | 功能 |
|--------|------|
| Tab | 接受 AI 建议 |
| ⌘+K | 内联编辑 |
| ⌘+L | 打开 Chat |
| ⌘+I | 打开 Composer |
| ⌘+Enter | 提交 Composer 请求 |

## ✅ 优势

- **深度集成**: AI 内置于编辑器核心
- **多模型支持**: GPT-4, Claude, o1 可选
- **Composer**: 最强大的多文件编辑能力
- **代码库理解**: 大型项目也能精准定位
- **VS Code 兼容**: 插件和主题无缝迁移
- **中文支持**: 比 Copilot 更好的中文场景

## ❌ 劣势

- **价格较高**: $20/月对个体不便宜
- **资源消耗**: 大型项目索引占用内存
- **依赖网络**: 需要稳定连接
- **学习曲线**: 新工作流需要时间适应
- **隐私顾虑**: 代码会上传到 Cursor 服务器

## 🎓 学习资源

- [官方文档](https://docs.cursor.com)
- [Cursor 提示工程指南](https://docs.cursor.com/guides/prompting)
- [YouTube 教程](https://www.youtube.com/cursor)

## 💡 适用场景

1. **新项目启动**: 快速搭建项目骨架
2. **功能开发**: 端到端功能实现
3. **代码重构**: 大规模代码迁移
4. **学习探索**: 理解不熟悉的代码库
5. **Bug 修复**: 智能诊断和修复

---

**相关对比**: [查看与其他工具的对比](../03-comparison/README.md)
