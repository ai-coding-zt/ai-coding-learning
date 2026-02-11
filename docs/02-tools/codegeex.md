# CodeGeeX

> 智谱 AI 的开源代码生成模型

## 🎯 概述

CodeGeeX 是智谱 AI (Zhipu AI) 开发的开源代码生成大模型，支持多种编程语言的代码生成、代码翻译、代码注释等功能。它是国内最早开源的代码大模型之一，提供完全免费的编程助手。

**发布日期**: 2022年（开源）

**开发商**: 智谱 AI (Zhipu AI)

**定位**: 开源免费的 AI 编程助手

## ⭐ 核心功能

### 1. 多语言代码生成

```python
# CodeGeeX 支持 20+ 种编程语言

# Python 示例
# 输入：用快速排序算法对列表排序
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)
```

### 2. 代码翻译

CodeGeeX 可以将代码从一种语言翻译成另一种：

```python
# Python → C++
# Python:
def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)

# CodeGeeX 翻译成 C++:
#include <iostream>
using namespace std;

int factorial(int n) {
    if (n == 0) return 1;
    return n * factorial(n - 1);
}
```

### 3. 代码注释生成

```python
def binary_search(arr, target):
    """
    二分查找算法
    
    参数:
        arr: 已排序的列表
        target: 要查找的目标值
    
    返回:
        目标值的索引，如果不存在返回 -1
    
    时间复杂度: O(log n)
    空间复杂度: O(1)
    """
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1
```

### 4. 代码补全

支持行级和函数级代码补全：

```python
import requests

def fetch_weather(city):
    """获取指定城市的天气信息"""
    # CodeGeeX 会自动补全 API 调用代码
    api_key = "your_api_key"
    url = f"https://api.weather.com/v1/current?city={city}&appid={api_key}"
    
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        return {
            'temperature': data['main']['temp'],
            'humidity': data['main']['humidity'],
            'description': data['weather'][0]['description']
        }
    except requests.RequestException as e:
        print(f"获取天气失败: {e}")
        return None
```

## 💰 定价

**完全免费开源** 🎉

| 版本 | 价格 | 特点 |
|------|------|------|
| **IDE 插件** | 免费 | 云端 API |
| **本地模型** | 免费 | 开源模型，可本地部署 |
| **API 服务** | 免费额度 | 适合批量处理 |

## 🛠️ 使用方式

### 方式 1: IDE 插件

支持 VS Code、JetBrains、Visual Studio 等主流 IDE。

安装步骤：
1. 打开 IDE 插件市场
2. 搜索 "CodeGeeX"
3. 安装并登录
4. 开始使用

### 方式 2: 本地部署

```bash
# 克隆仓库
git clone https://github.com/THUDM/CodeGeeX.git
cd CodeGeeX

# 安装依赖
pip install -r requirements.txt

# 下载模型
python scripts/download_model.py

# 运行推理
python scripts/generate.py --prompt "def hello_world():"
```

### 方式 3: API 调用

```python
import requests

response = requests.post(
    "https://codegeex.cn/api/v1/generate",
    json={
        "prompt": "def quicksort(arr):",
        "language": "python",
        "max_tokens": 256
    }
)

code = response.json()["code"]
print(code)
```

## 🚀 使用技巧

### 提示工程

```markdown
1. 清晰的注释
   # 实现一个 LRU 缓存
   # 要求：O(1) 时间复杂度的 get 和 put

2. 示例引导
   # 输入：[1, 2, 3], 输出：[1, 4, 9]
   def square_list(nums):

3. 指定语言
   // JavaScript: 创建一个防抖函数
```

### 快捷键

| 快捷键 | 功能 |
|--------|------|
| Tab | 接受建议 |
| Alt + [ | 上一个建议 |
| Alt + ] | 下一个建议 |
| Ctrl + Alt + T | 代码翻译 |
| Ctrl + Alt + D | 生成文档 |

## ✅ 优势

- **完全免费**: 没有任何费用
- **开源**: 模型和代码都开源
- **多语言**: 支持 20+ 编程语言
- **隐私**: 可本地部署，代码不上云
- **中文**: 针对中文优化
- **轻量**: 资源占用较少

## ❌ 劣势

- **功能相对简单**: 不如商业工具强大
- **代码质量**: 有时生成代码需要调整
- **上下文理解**: 大项目上下文理解有限
- **更新频率**: 更新速度较慢
- **生态系统**: 社区规模较小

## 🎓 学习资源

- [GitHub 仓库](https://github.com/THUDM/CodeGeeX)
- [官方文档](https://codegeex.cn)
- [技术论文](https://arxiv.org/abs/2303.17568)

## 💡 适用场景

1. **隐私敏感**: 代码不能上云的团队
2. **开源爱好者**: 支持开源社区
3. **离线环境**: 可完全本地运行
4. **学习研究**: 了解代码大模型原理
5. **预算有限**: 完全免费使用

## 📊 与其他工具对比

| 特性 | CodeGeeX | 通义灵码 | Cursor |
|------|----------|----------|--------|
| 价格 | 免费 | 免费 | $20/月 |
| 开源 | ✅ | ❌ | ❌ |
| 本地部署 | ✅ | ❌ | ❌ |
| 多语言 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 代码生成 | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 中文支持 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

---

**相关对比**: [查看与其他工具的对比](../03-comparison/README.md)
