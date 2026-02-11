# 基础练习

> 掌握 AI 辅助编程的基本操作

## 🎯 案例目标

学习 AI 编程助手的核心功能：
1. 代码自动补全
2. 代码解释
3. 代码生成
4. Bug 修复
5. 单元测试生成

---

## 练习 1: 代码补全

### 任务
让 AI 帮你完成一个工具函数。

### 提示词
```markdown
函数：验证密码强度
规则：
- 至少 8 位字符
- 包含大写字母
- 包含小写字母
- 包含数字
- 包含特殊字符 (!@#$%^&*)
返回：元组 (是否有效, 错误信息列表)
```

### 参考实现

```python
import re
from typing import Tuple, List

def validate_password(password: str) -> Tuple[bool, List[str]]:
    """
    验证密码强度
    
    规则：
    - 至少 8 位字符
    - 包含大写字母
    - 包含小写字母
    - 包含数字
    - 包含特殊字符
    
    Args:
        password: 待验证的密码
        
    Returns:
        (是否有效, 错误信息列表)
    """
    errors = []
    
    # 检查长度
    if len(password) < 8:
        errors.append("密码至少需要 8 位字符")
    
    # 检查大写字母
    if not re.search(r'[A-Z]', password):
        errors.append("密码需要包含大写字母")
    
    # 检查小写字母
    if not re.search(r'[a-z]', password):
        errors.append("密码需要包含小写字母")
    
    # 检查数字
    if not re.search(r'\d', password):
        errors.append("密码需要包含数字")
    
    # 检查特殊字符
    if not re.search(r'[!@#$%^&*]', password):
        errors.append("密码需要包含特殊字符 (!@#$%^&*)")
    
    return len(errors) == 0, errors


# 测试
if __name__ == "__main__":
    test_cases = [
        "weak",
        "Strong1",
        "Strong1!",
        "short1!",
        "nouppercase123!",
        "NOLOWERCASE123!",
        "NoDigits!!",
        "NoSpecial123",
    ]
    
    for pwd in test_cases:
        is_valid, errors = validate_password(pwd)
        print(f"密码: {pwd:20} - {'✓' if is_valid else '✗'}")
        if errors:
            for error in errors:
                print(f"  - {error}")
```

### 学习要点
- 如何用注释引导 AI
- 类型注解的重要性
- 如何验证 AI 生成的代码

---

## 练习 2: 代码解释

### 任务
让 AI 解释一段复杂的代码。

### 示例代码

```python
from functools import wraps
from typing import Callable, Any
import time

def retry(max_attempts: int = 3, delay: float = 1.0, backoff: float = 2.0):
    """
    重试装饰器
    
    当函数抛出异常时自动重试
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            attempt = 1
            current_delay = delay
            
            while attempt <= max_attempts:
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts:
                        raise e
                    
                    print(f"Attempt {attempt} failed: {e}")
                    print(f"Retrying in {current_delay} seconds...")
                    time.sleep(current_delay)
                    
                    attempt += 1
                    current_delay *= backoff
            
            return None
        
        return wrapper
    return decorator


# 使用示例
@retry(max_attempts=3, delay=1.0)
def fetch_data(url: str) -> dict:
    """模拟获取数据，可能会失败"""
    import random
    if random.random() < 0.7:  # 70% 概率失败
        raise Exception("Network error")
    return {"data": "success", "url": url}


if __name__ == "__main__":
    result = fetch_data("https://api.example.com/data")
    print(f"Result: {result}")
```

### 提示词
```markdown
请详细解释这段代码：
1. 整体功能是什么？
2. retry 装饰器的工作原理
3. backoff 参数的作用
4. 使用场景和注意事项
```

### AI 解释要点

```markdown
1. 整体功能
   - 这是一个带重试机制的装饰器
   - 当被装饰函数失败时，自动重试

2. 工作原理
   - 使用闭包保存配置参数
   - 捕获异常并判断是否需要重试
   - 使用指数退避策略增加延迟

3. backoff 作用
   - 每次重试后延迟时间翻倍
   - 避免对失败服务造成压力
   - 1s → 2s → 4s 的延迟

4. 使用场景
   - 网络请求不稳定
   - 数据库连接偶尔失败
   - 第三方服务间歇性故障
```

---

## 练习 3: 代码生成

### 任务
根据需求让 AI 生成完整的代码。

### 提示词
```markdown
创建一个日志记录器类，要求：
1. 支持多种日志级别（DEBUG, INFO, WARNING, ERROR）
2. 支持输出到控制台和文件
3. 支持日志格式化（时间、级别、消息）
4. 支持日志文件按日期轮转
5. 线程安全
6. 提供上下文管理器支持

使用标准库实现，不依赖第三方包。
```

### 参考实现

```python
import logging
import os
from datetime import datetime
from logging.handlers import TimedRotatingFileHandler
from typing import Optional
import threading


class ThreadSafeLogger:
    """
    线程安全的日志记录器
    
    支持控制台和文件输出，自动按天轮转
    """
    
    _instances = {}
    _lock = threading.Lock()
    
    def __new__(cls, name: str = "app", *args, **kwargs):
        """单例模式，确保同名 logger 只有一个实例"""
        if name not in cls._instances:
            with cls._lock:
                if name not in cls._instances:
                    cls._instances[name] = super().__new__(cls)
        return cls._instances[name]
    
    def __init__(
        self,
        name: str = "app",
        level: int = logging.DEBUG,
        log_dir: str = "logs",
        console_output: bool = True,
        file_output: bool = True
    ):
        # 避免重复初始化
        if hasattr(self, '_initialized'):
            return
        
        self.name = name
        self.log_dir = log_dir
        self.logger = logging.getLogger(name)
        self.logger.setLevel(level)
        
        # 清除已有 handler，避免重复
        self.logger.handlers.clear()
        
        # 创建日志目录
        if file_output:
            os.makedirs(log_dir, exist_ok=True)
        
        # 设置格式
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        
        # 控制台输出
        if console_output:
            console_handler = logging.StreamHandler()
            console_handler.setLevel(level)
            console_handler.setFormatter(formatter)
            self.logger.addHandler(console_handler)
        
        # 文件输出（按天轮转）
        if file_output:
            log_file = os.path.join(log_dir, f"{name}.log")
            file_handler = TimedRotatingFileHandler(
                log_file,
                when='midnight',
                interval=1,
                backupCount=30,  # 保留30天
                encoding='utf-8'
            )
            file_handler.setLevel(level)
            file_handler.setFormatter(formatter)
            self.logger.addHandler(file_handler)
        
        self._initialized = True
    
    def debug(self, msg: str):
        self.logger.debug(msg)
    
    def info(self, msg: str):
        self.logger.info(msg)
    
    def warning(self, msg: str):
        self.logger.warning(msg)
    
    def error(self, msg: str):
        self.logger.error(msg)
    
    def exception(self, msg: str):
        self.logger.exception(msg)
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        # 清理 handler
        for handler in self.logger.handlers[:]:
            handler.close()
            self.logger.removeHandler(handler)


# 使用示例
if __name__ == "__main__":
    # 基本使用
    logger = ThreadSafeLogger("my_app")
    
    logger.debug("调试信息")
    logger.info("应用启动")
    logger.warning("警告：配置未优化")
    
    try:
        1 / 0
    except Exception:
        logger.exception("发生错误")
    
    # 上下文管理器
    with ThreadSafeLogger("temp_task") as log:
        log.info("临时任务开始")
        log.info("临时任务完成")
    
    # 多线程测试
    import threading
    
    def worker(thread_id):
        logger = ThreadSafeLogger("thread_test")
        logger.info(f"线程 {thread_id} 开始工作")
    
    threads = [threading.Thread(target=worker, args=(i,)) for i in range(5)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
```

---

## 练习 4: Bug 修复

### 任务
找出代码中的 bug 并让 AI 修复。

### 有 Bug 的代码

```python
def calculate_average(numbers):
    """计算平均值"""
    total = 0
    for n in numbers:
        total += n
    return total / len(numbers)


def find_duplicates(items):
    """找出列表中的重复项"""
    seen = set()
    duplicates = []
    for item in items:
        if item in seen:
            duplicates.append(item)
        seen.add(item)
    return duplicates


def parse_date(date_string):
    """解析日期字符串 YYYY-MM-DD"""
    parts = date_string.split("-")
    year = int(parts[0])
    month = int(parts[1])
    day = int(parts[2])
    return datetime(year, month, day)


def remove_whitespace(text):
    """移除字符串中的所有空白"""
    return text.replace(" ", "")
```

### 提示词
```markdown
请检查这段代码，找出所有 bug 和潜在问题：
1. 逻辑错误
2. 边界情况处理
3. 异常处理缺失
4. 性能问题
5. 其他改进建议

对每个问题提供修复后的代码。
```

### 修复后的代码

```python
from datetime import datetime
from typing import List, Set, Optional


def calculate_average(numbers: List[float]) -> Optional[float]:
    """
    计算平均值
    
    修复：处理空列表情况
    """
    if not numbers:
        return None  # 或者抛出 ValueError
    
    return sum(numbers) / len(numbers)


def find_duplicates(items: List) -> Set:
    """
    找出列表中的重复项
    
    修复：返回 set 避免重复，提高效率
    """
    seen = set()
    duplicates = set()
    for item in items:
        if item in seen:
            duplicates.add(item)
        seen.add(item)
    return duplicates


def parse_date(date_string: str) -> Optional[datetime]:
    """
    解析日期字符串 YYYY-MM-DD
    
    修复：添加异常处理和格式验证
    """
    try:
        return datetime.strptime(date_string, "%Y-%m-%d")
    except (ValueError, TypeError) as e:
        print(f"日期解析错误: {e}")
        return None


def remove_whitespace(text: str) -> str:
    """
    移除字符串中的所有空白
    
    修复：处理所有类型的空白字符
    """
    return "".join(text.split())


# 测试
if __name__ == "__main__":
    # 测试 calculate_average
    print(calculate_average([1, 2, 3, 4, 5]))  # 3.0
    print(calculate_average([]))  # None
    
    # 测试 find_duplicates
    print(find_duplicates([1, 2, 2, 3, 3, 3]))  # {2, 3}
    
    # 测试 parse_date
    print(parse_date("2024-01-15"))  # 正常
    print(parse_date("invalid"))  # None
    print(parse_date("2024-13-01"))  # None (无效月份)
    
    # 测试 remove_whitespace
    print(repr(remove_whitespace("  hello \t world \n  ")))  # 'helloworld'
```

---

## 练习 5: 生成单元测试

### 任务
让 AI 为现有代码生成完整的单元测试。

### 目标代码

```python
class ShoppingCart:
    """购物车类"""
    
    def __init__(self):
        self.items = {}
    
    def add_item(self, item_id: str, name: str, price: float, quantity: int = 1):
        """添加商品"""
        if price < 0:
            raise ValueError("价格不能为负数")
        if quantity <= 0:
            raise ValueError("数量必须大于0")
        
        if item_id in self.items:
            self.items[item_id]['quantity'] += quantity
        else:
            self.items[item_id] = {
                'name': name,
                'price': price,
                'quantity': quantity
            }
    
    def remove_item(self, item_id: str, quantity: int = None):
        """移除商品"""
        if item_id not in self.items:
            raise KeyError(f"商品 {item_id} 不存在")
        
        if quantity is None or quantity >= self.items[item_id]['quantity']:
            del self.items[item_id]
        else:
            self.items[item_id]['quantity'] -= quantity
    
    def get_total(self) -> float:
        """计算总价"""
        return sum(
            item['price'] * item['quantity']
            for item in self.items.values()
        )
    
    def clear(self):
        """清空购物车"""
        self.items.clear()
    
    def get_item_count(self) -> int:
        """获取商品种类数"""
        return len(self.items)
    
    def get_total_quantity(self) -> int:
        """获取商品总数量"""
        return sum(item['quantity'] for item in self.items.values())
```

### 提示词
```markdown
为 ShoppingCart 类生成完整的单元测试，要求：
1. 使用 unittest 框架
2. 覆盖所有公共方法
3. 包含正常情况和异常情况
4. 测试边界条件（空购物车、负数等）
5. 每个测试方法有清晰的文档字符串
6. 测试覆盖率 > 90%
```

### 生成的测试代码

```python
import unittest
from shopping_cart import ShoppingCart


class TestShoppingCart(unittest.TestCase):
    """购物车类测试"""
    
    def setUp(self):
        """每个测试前创建新的购物车实例"""
        self.cart = ShoppingCart()
    
    def test_add_item_new(self):
        """测试添加新商品"""
        self.cart.add_item("item1", "苹果", 5.0, 2)
        
        self.assertIn("item1", self.cart.items)
        self.assertEqual(self.cart.items["item1"]["name"], "苹果")
        self.assertEqual(self.cart.items["item1"]["price"], 5.0)
        self.assertEqual(self.cart.items["item1"]["quantity"], 2)
    
    def test_add_item_existing(self):
        """测试向已有商品添加数量"""
        self.cart.add_item("item1", "苹果", 5.0, 2)
        self.cart.add_item("item1", "苹果", 5.0, 3)
        
        self.assertEqual(self.cart.items["item1"]["quantity"], 5)
    
    def test_add_item_invalid_price(self):
        """测试添加负数价格的商品"""
        with self.assertRaises(ValueError) as context:
            self.cart.add_item("item1", "苹果", -5.0)
        
        self.assertIn("价格不能为负数", str(context.exception))
    
    def test_add_item_invalid_quantity(self):
        """测试添加无效数量的商品"""
        with self.assertRaises(ValueError):
            self.cart.add_item("item1", "苹果", 5.0, 0)
        
        with self.assertRaises(ValueError):
            self.cart.add_item("item1", "苹果", 5.0, -1)
    
    def test_remove_item_complete(self):
        """测试完全移除商品"""
        self.cart.add_item("item1", "苹果", 5.0, 2)
        self.cart.remove_item("item1")
        
        self.assertNotIn("item1", self.cart.items)
    
    def test_remove_item_partial(self):
        """测试部分移除商品"""
        self.cart.add_item("item1", "苹果", 5.0, 5)
        self.cart.remove_item("item1", 2)
        
        self.assertEqual(self.cart.items["item1"]["quantity"], 3)
    
    def test_remove_item_not_exist(self):
        """测试移除不存在的商品"""
        with self.assertRaises(KeyError):
            self.cart.remove_item("nonexistent")
    
    def test_get_total_empty(self):
        """测试空购物车总价"""
        self.assertEqual(self.cart.get_total(), 0.0)
    
    def test_get_total_with_items(self):
        """测试有商品时的总价"""
        self.cart.add_item("item1", "苹果", 5.0, 2)  # 10.0
        self.cart.add_item("item2", "香蕉", 3.0, 3)  # 9.0
        
        self.assertEqual(self.cart.get_total(), 19.0)
    
    def test_clear(self):
        """测试清空购物车"""
        self.cart.add_item("item1", "苹果", 5.0, 2)
        self.cart.clear()
        
        self.assertEqual(len(self.cart.items), 0)
        self.assertEqual(self.cart.get_total(), 0.0)
    
    def test_get_item_count(self):
        """测试商品种类数"""
        self.assertEqual(self.cart.get_item_count(), 0)
        
        self.cart.add_item("item1", "苹果", 5.0)
        self.cart.add_item("item2", "香蕉", 3.0)
        
        self.assertEqual(self.cart.get_item_count(), 2)
    
    def test_get_total_quantity(self):
        """测试商品总数量"""
        self.cart.add_item("item1", "苹果", 5.0, 3)
        self.cart.add_item("item2", "香蕉", 3.0, 2)
        
        self.assertEqual(self.cart.get_total_quantity(), 5)
    
    def test_multiple_operations(self):
        """测试复杂操作流程"""
        # 添加商品
        self.cart.add_item("item1", "苹果", 5.0, 10)
        self.cart.add_item("item2", "香蕉", 3.0, 5)
        
        # 验证总价
        self.assertEqual(self.cart.get_total(), 65.0)
        
        # 部分移除
        self.cart.remove_item("item1", 3)
        self.assertEqual(self.cart.get_total(), 50.0)
        
        # 添加更多
        self.cart.add_item("item1", "苹果", 5.0, 5)
        self.assertEqual(self.cart.items["item1"]["quantity"], 12)
        
        # 清空
        self.cart.clear()
        self.assertEqual(self.cart.get_item_count(), 0)


if __name__ == "__main__":
    unittest.main()
```

---

## 📝 学习总结

完成这些练习后，你应该掌握：

1. ✓ 如何通过注释引导 AI 生成代码
2. ✓ 如何让 AI 解释复杂代码
3. ✓ 如何提出清晰的需求
4. ✓ 如何识别和修复代码问题
5. ✓ 如何为代码生成测试

**下一步**: 尝试 [数据处理案例 →](../02-data-processing/)
