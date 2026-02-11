# 快速入门指南

> 从零开始你的 AI 编程之旅

## 🎯 选择你的第一个工具

根据你的情况选择：

| 你的情况 | 推荐工具 | 理由 |
|----------|----------|------|
| 完全新手，预算有限 | **Trae** | 免费 + 中文优化 + Builder模式 |
| 已有 VS Code 使用习惯 | **通义灵码** | 免费插件 + 即装即用 |
| 追求最佳体验，预算充足 | **Cursor** | 功能最强 + AI原生 |
| 终端重度用户 | **Claude Code** | 命令行集成 |

## 📦 安装指南

### 方案 A: Trae (推荐新手)

#### 步骤 1: 下载安装

```bash
# macOS
brew install --cask trae

# Windows
# 访问 https://trae.ai 下载安装包

# Linux
# 访问 https://trae.ai 下载 AppImage
```

#### 步骤 2: 初始设置

1. 打开 Trae
2. 选择主题（推荐 Dark+）
3. 导入 VS Code 设置（可选）
4. 登录账号（手机号/邮箱）

#### 步骤 3: 验证安装

```python
# 新建一个 Python 文件，输入：
# 计算斐波那契数列

def fibonacci(n):
    # 按 Tab 键，看 Trae 是否生成代码
```

### 方案 B: 通义灵码 (VS Code 用户)

#### 步骤 1: 安装插件

1. 打开 VS Code
2. 点击左侧扩展图标（或按 `Ctrl+Shift+X`）
3. 搜索 "通义灵码"
4. 点击安装

#### 步骤 2: 登录激活

1. 安装完成后，点击左侧通义灵码图标
2. 使用阿里云账号登录
3. 授权插件访问

#### 步骤 3: 验证安装

```python
# 在 VS Code 中新建文件，输入：
def calculate_area(radius):
    # 等待通义灵码的代码建议
```

### 方案 C: Cursor (追求体验)

#### 步骤 1: 下载安装

```bash
# macOS
brew install --cask cursor

# Windows/Linux
# 访问 https://cursor.com 下载
```

#### 步骤 2: 初始设置

1. 打开 Cursor
2. 导入 VS Code 配置（可选）
3. 选择默认模型（推荐 Claude 3.5 Sonnet）
4. 登录账号

#### 步骤 3: 体验核心功能

```markdown
1. 代码补全: 输入代码，按 Tab 接受建议
2. Chat: 按 ⌘+L 打开侧边栏对话
3. Composer: 按 ⌘+I 打开多文件编辑器
```

## 🚀 第一次使用

### 任务 1: Hello AI

**目标**: 让 AI 帮你写第一个程序

```python
# 在编辑器中输入：
# 创建一个函数，计算圆的面积和周长

# AI 应该生成类似：
import math

def circle_properties(radius):
    """计算圆的面积和周长"""
    area = math.pi * radius ** 2
    circumference = 2 * math.pi * radius
    return {
        'area': round(area, 2),
        'circumference': round(circumference, 2)
    }

# 测试
print(circle_properties(5))
```

### 任务 2: 代码解释

**目标**: 让 AI 解释一段代码

1. 复制以下代码到编辑器：
```python
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)
```

2. 选中代码，右键 → "解释代码" (或使用 Chat)
3. 观察 AI 的解释

### 任务 3: 生成测试

**目标**: 让 AI 为函数生成单元测试

```python
# 输入函数
def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

# 然后问 AI: "为这个函数生成单元测试"
```

## 💡 基本操作技巧

### 1. 接受/拒绝建议

| 操作 | 快捷键 | 说明 |
|------|--------|------|
| 接受建议 | `Tab` | 接受全部建议 |
| 逐词接受 | `Ctrl + →` | 只接受一部分 |
| 拒绝建议 | `Esc` | 忽略建议 |
| 查看备选 | `Alt + ]` / `Alt + [` | 切换不同建议 |

### 2. 与 AI 对话

```markdown
有效的提问方式：
✓ "解释这段代码的作用"
✓ "如何优化这个函数的性能"
✓ "给这个类添加文档字符串"
✓ "找出这段代码的 bug"

避免：
✗ "帮我写代码" (太模糊)
✗ "这个怎么做" (没有上下文)
```

### 3. 提供上下文

```python
# 好的提示：包含足够信息
# 函数：验证中国大陆手机号
# 规则：11位数字，以1开头，第二位是3-9
# 返回：bool，有效返回 True
def validate_phone(phone):
    # AI 能理解并生成正确代码
    import re
    pattern = r'^1[3-9]\d{9}$'
    return bool(re.match(pattern, phone))

# 差的提示：信息不足
# 验证手机号
def check_phone(p):
    # AI 不知道具体规则
```

## 🎓 第一周学习计划

### Day 1-2: 熟悉基础
- [ ] 安装并配置工具
- [ ] 完成 "Hello AI" 任务
- [ ] 体验代码补全功能
- [ ] 尝试代码解释功能

### Day 3-4: 提高效率
- [ ] 学习快捷键
- [ ] 练习接受/拒绝建议
- [ ] 尝试生成测试代码
- [ ] 使用 AI 修复 bug

### Day 5-6: 进阶功能
- [ ] 使用 Chat 功能提问
- [ ] 让 AI 帮助重构代码
- [ ] 生成文档和注释
- [ ] 探索多文件编辑（Cursor/Trae）

### Day 7: 实战项目
- [ ] 用小项目练习
- [ ] 记录使用心得
- [ ] 整理常用提示词
- [ ] 规划下周学习目标

## ⚠️ 常见问题和解决

### 问题 1: AI 建议不准确

**解决:**
- 提供更详细的注释
- 使用类型注解
- 给 AI 更多上下文
- 尝试不同表达方式

### 问题 2: 代码生成太慢

**解决:**
- 检查网络连接
- 关闭不必要的插件
- 缩短提示词
- 考虑升级到付费版

### 问题 3: 隐私担忧

**解决:**
- 使用 CodeGeeX 本地部署
- 关闭代码上传选项
- 使用企业版私有化方案
- 避免在 AI 中处理敏感代码

### 问题 4: 生成的代码有 bug

**解决:**
- 永远审查 AI 生成的代码
- 运行测试验证
- 向 AI 反馈错误让它修复
- 理解代码逻辑再使用

## 📚 下一步学习

完成入门后，继续学习：

1. **[最佳实践](../05-best-practices/README.md)** - 高效使用技巧
2. **[实战案例](../06-examples/README.md)** - 动手练习
3. **高级功能** - 探索工具的进阶特性

---

**恭喜！** 你已经迈出了 AI 编程的第一步 🎉
