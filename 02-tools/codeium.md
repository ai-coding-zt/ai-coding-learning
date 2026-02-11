# Codeium

> 免费的 AI 编程助手，支持自托管

## 🎯 概述

Codeium 是一款免费的 AI 编程助手，提供类似 GitHub Copilot 的代码补全功能，但完全免费。它还提供企业级的自托管方案，让团队可以在私有环境中部署。

**发布日期**: 2022年

**开发商**: Codeium (Exafunction)

**定位**: 免费的 Copilot 替代品

## ⭐ 核心功能

### 1. 智能代码补全

```javascript
// Codeium 提供上下文感知的代码建议

// 示例：React 组件开发
import React, { useState, useEffect } from 'react';

const UserProfile = ({ userId }) => {
    // Codeium 自动建议：
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/users/${userId}`);
                const data = await response.json();
                setUser(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchUser();
    }, [userId]);
    
    // ... 渲染逻辑
};
```

### 2. Chat 功能 (Codeium Chat)

```markdown
用户: "如何优化这个函数的性能？"

Codeium: "这个函数的时间复杂度是 O(n²)，建议：
1. 使用哈希表将复杂度降为 O(n)
2. 考虑缓存重复计算结果
3. 使用生成器处理大数据集

优化后的代码：
[展示优化后的代码]"
```

### 3. 代码解释

```python
# 选中代码后，Codeium 可以：
# 1. 解释代码功能
# 2. 识别潜在 bug
# 3. 建议改进方案
# 4. 生成单元测试
```

### 4. 自然语言搜索

```markdown
搜索: "查找所有处理用户认证的函数"

Codeium 会在整个代码库中：
- 理解自然语言查询
- 搜索相关代码
- 返回最匹配的结果
```

## 💰 定价

| 版本 | 价格 | 功能 |
|------|------|------|
| **个人版** | 免费 | 无限代码补全 |
| **团队版** | $12/用户/月 | + 团队管理 |
| **企业版** | 定制价格 | + 自托管 + SSO |
| **个人自托管** | 免费 | 本地部署 |

## 🛠️ 支持的平台

### IDE 支持
- ✅ Visual Studio Code
- ✅ JetBrains 全家桶
- ✅ Vim/Neovim
- ✅ Sublime Text
- ✅ Emacs
- ✅ Xcode
- ✅ Jupyter Notebook

### 支持的语言
Python, JavaScript, TypeScript, Go, Rust, Java, C/C++, C#, PHP, Ruby, Swift, Kotlin, Scala 等 70+ 种语言。

## 🚀 使用技巧

### 快捷键

| 快捷键 | 功能 |
|--------|------|
| Tab | 接受建议 |
| Alt + [ | 上一个建议 |
| Alt + ] | 下一个建议 |
| Esc | 拒绝建议 |
| Ctrl+I | 打开 Chat |

### 最佳实践

```markdown
1. 保持注释清晰
   Codeium 会根据注释理解你的意图

2. 使用类型注解
   类型信息帮助生成更准确的代码

3. 逐步接受建议
   不要一次性接受大块代码

4. 利用 Chat 功能
   复杂问题使用 Chat 而不是补全
```

## ✅ 优势

- **完全免费**: 个人版无任何限制
- **自托管**: 可完全本地部署
- **多语言**: 支持 70+ 种语言
- **隐私友好**: 自托管版本代码不上云
- **轻量**: 资源占用小
- **速度快**: 延迟低，体验流畅

## ❌ 劣势

- **模型能力**: 不如 GPT-4/Claude 强大
- **上下文长度**: 大项目理解有限
- **代码生成**: 复杂场景表现一般
- **生态系统**: 不如 Copilot 成熟
- **更新频率**: 新功能推出较慢

## 🔧 自托管部署

```bash
# 使用 Docker 部署
docker run -d \
  --name codeium \
  -p 3000:3000 \
  -v /path/to/models:/models \
  codeium/self-hosted:latest

# 配置 IDE 插件指向本地服务
# 在插件设置中修改 endpoint 为 http://localhost:3000
```

## 📊 与其他工具对比

| 特性 | Codeium | GitHub Copilot | Cursor |
|------|---------|----------------|--------|
| 价格 | 免费 | $10/月 | $20/月 |
| 自托管 | ✅ | ❌ | ❌ |
| 语言支持 | 70+ | 30+ | 主流语言 |
| 速度 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 代码质量 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

## 🎓 学习资源

- [官网](https://codeium.com)
- [文档](https://docs.codeium.com)
- [GitHub](https://github.com/Exafunction)

---

**相关对比**: [查看与其他工具的对比](../03-comparison/README.md)
