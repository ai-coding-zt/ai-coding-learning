# 算法实现案例

> 使用 AI 辅助实现和理解经典算法

## 🎯 学习目标

掌握 AI 辅助算法学习：
1. 理解算法原理
2. 实现经典算法
3. 分析时间和空间复杂度
4. 优化算法性能

---

## 案例 1: 排序算法

### 任务描述
实现并比较多种排序算法。

### 提示词

```markdown
请实现以下排序算法，并包含详细注释和复杂度分析：

1. 快速排序 (Quick Sort)
2. 归并排序 (Merge Sort)
3. 堆排序 (Heap Sort)
4. Python 内置排序（作为对比）

要求：
- 每个算法包含详细注释说明原理
- 分析时间复杂度和空间复杂度
- 添加性能对比测试
- 解释适用场景
- 包含单元测试验证正确性
```

### 参考实现

```python
import time
import random
from typing import List
import unittest


class SortingAlgorithms:
    """排序算法集合"""
    
    @staticmethod
    def quick_sort(arr: List[int]) -> List[int]:
        """
        快速排序
        
        原理：
        1. 选择一个基准元素（pivot）
        2. 将数组分为两部分：小于 pivot 和大于 pivot
        3. 递归地对两部分进行排序
        
        时间复杂度：
        - 平均：O(n log n)
        - 最坏：O(n²) - 当数组已排序时
        
        空间复杂度：O(log n) - 递归栈空间
        
        适用场景：
        - 大规模数据排序
        - 内存充足的情况
        """
        if len(arr) <= 1:
            return arr
        
        # 选择中间元素作为 pivot（避免最坏情况）
        pivot = arr[len(arr) // 2]
        
        # 分区
        left = [x for x in arr if x < pivot]
        middle = [x for x in arr if x == pivot]
        right = [x for x in arr if x > pivot]
        
        # 递归排序
        return SortingAlgorithms.quick_sort(left) + middle + SortingAlgorithms.quick_sort(right)
    
    @staticmethod
    def merge_sort(arr: List[int]) -> List[int]:
        """
        归并排序
        
        原理：
        1. 将数组分成两半
        2. 递归地对每一半排序
        3. 合并两个有序数组
        
        时间复杂度：
        - 最好/平均/最坏：O(n log n)
        
        空间复杂度：O(n) - 需要额外数组存储
        
        适用场景：
        - 需要稳定排序
        - 链表排序
        - 外部排序（数据量大无法放入内存）
        """
        if len(arr) <= 1:
            return arr
        
        # 分割
        mid = len(arr) // 2
        left = SortingAlgorithms.merge_sort(arr[:mid])
        right = SortingAlgorithms.merge_sort(arr[mid:])
        
        # 合并
        return SortingAlgorithms._merge(left, right)
    
    @staticmethod
    def _merge(left: List[int], right: List[int]) -> List[int]:
        """合并两个有序数组"""
        result = []
        i = j = 0
        
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                result.append(left[i])
                i += 1
            else:
                result.append(right[j])
                j += 1
        
        # 添加剩余元素
        result.extend(left[i:])
        result.extend(right[j:])
        
        return result
    
    @staticmethod
    def heap_sort(arr: List[int]) -> List[int]:
        """
        堆排序
        
        原理：
        1. 构建最大堆
        2. 将堆顶元素（最大值）移到末尾
        3. 调整堆，重复步骤 2
        
        时间复杂度：
        - 最好/平均/最坏：O(n log n)
        
        空间复杂度：O(1) - 原地排序
        
        适用场景：
        - 内存受限环境
        - 需要找到前 K 大/小元素
        """
        arr = arr.copy()  # 不修改原数组
        n = len(arr)
        
        # 构建最大堆（从最后一个非叶子节点开始）
        for i in range(n // 2 - 1, -1, -1):
            SortingAlgorithms._heapify(arr, n, i)
        
        # 一个个提取元素
        for i in range(n - 1, 0, -1):
            # 将堆顶移到末尾
            arr[0], arr[i] = arr[i], arr[0]
            # 调整堆
            SortingAlgorithms._heapify(arr, i, 0)
        
        return arr
    
    @staticmethod
    def _heapify(arr: List[int], n: int, i: int):
        """维护堆的性质"""
        largest = i
        left = 2 * i + 1
        right = 2 * i + 2
        
        # 找出最大值
        if left < n and arr[left] > arr[largest]:
            largest = left
        
        if right < n and arr[right] > arr[largest]:
            largest = right
        
        # 如果最大值不是根节点，交换并继续调整
        if largest != i:
            arr[i], arr[largest] = arr[largest], arr[i]
            SortingAlgorithms._heapify(arr, n, largest)


def benchmark_sorting_algorithms():
    """性能对比测试"""
    print("=" * 60)
    print("排序算法性能对比")
    print("=" * 60)
    
    # 生成测试数据
    sizes = [100, 1000, 5000]
    algorithms = {
        'Quick Sort': SortingAlgorithms.quick_sort,
        'Merge Sort': SortingAlgorithms.merge_sort,
        'Heap Sort': SortingAlgorithms.heap_sort,
        'Python Built-in': sorted
    }
    
    for size in sizes:
        print(f"\n数组大小: {size}")
        print("-" * 60)
        
        # 生成随机数据
        data = [random.randint(1, 10000) for _ in range(size)]
        
        for name, algo in algorithms.items():
            test_data = data.copy()
            
            start_time = time.time()
            result = algo(test_data)
            end_time = time.time()
            
            elapsed_ms = (end_time - start_time) * 1000
            print(f"{name:20}: {elapsed_ms:8.2f} ms")


# 单元测试
class TestSortingAlgorithms(unittest.TestCase):
    def setUp(self):
        self.test_cases = [
            [],
            [1],
            [3, 1, 2],
            [5, 4, 3, 2, 1],
            [1, 1, 1],
            random.sample(range(1000), 100)
        ]
    
    def test_quick_sort(self):
        for case in self.test_cases:
            result = SortingAlgorithms.quick_sort(case)
            self.assertEqual(result, sorted(case))
    
    def test_merge_sort(self):
        for case in self.test_cases:
            result = SortingAlgorithms.merge_sort(case)
            self.assertEqual(result, sorted(case))
    
    def test_heap_sort(self):
        for case in self.test_cases:
            result = SortingAlgorithms.heap_sort(case)
            self.assertEqual(result, sorted(case))


if __name__ == "__main__":
    # 运行基准测试
    benchmark_sorting_algorithms()
    
    # 运行单元测试
    print("\n" + "=" * 60)
    print("运行单元测试...")
    unittest.main(argv=[''], exit=False, verbosity=2)
```

---

## 案例 2: 图算法

### 任务描述
实现图的遍历和最短路径算法。

### 提示词

```markdown
请实现以下图算法：

1. 图的表示（邻接表和邻接矩阵）
2. 深度优先搜索 (DFS)
3. 广度优先搜索 (BFS)
4. Dijkstra 最短路径算法
5. 检测环

要求：
- 支持有向图和无向图
- 包含详细的算法说明
- 分析时间和空间复杂度
- 提供实际应用示例
- 可视化遍历过程（可选）
```

### 参考实现

```python
from collections import deque, defaultdict
import heapq
from typing import Dict, List, Set, Tuple, Optional


class Graph:
    """图的数据结构 - 邻接表表示"""
    
    def __init__(self, directed: bool = False):
        """
        初始化图
        
        Args:
            directed: 是否是有向图
        """
        self.directed = directed
        self.adjacency_list: Dict[str, List[Tuple[str, int]]] = defaultdict(list)
        self.nodes: Set[str] = set()
    
    def add_node(self, node: str):
        """添加节点"""
        self.nodes.add(node)
    
    def add_edge(self, u: str, v: str, weight: int = 1):
        """
        添加边
        
        Args:
            u: 起始节点
            v: 目标节点
            weight: 边的权重
        """
        self.nodes.add(u)
        self.nodes.add(v)
        self.adjacency_list[u].append((v, weight))
        
        if not self.directed:
            self.adjacency_list[v].append((u, weight))
    
    def get_neighbors(self, node: str) -> List[Tuple[str, int]]:
        """获取邻居节点"""
        return self.adjacency_list[node]
    
    def dfs(self, start: str) -> List[str]:
        """
        深度优先搜索
        
        原理：
        1. 从起始节点开始
        2. 访问一个邻居，递归访问其邻居
        3. 使用栈（显式或隐式）保存待访问节点
        
        时间复杂度：O(V + E)
        空间复杂度：O(V)
        
        适用场景：
        - 拓扑排序
        - 检测环
        - 路径搜索
        """
        visited = set()
        result = []
        
        def dfs_recursive(node: str):
            visited.add(node)
            result.append(node)
            
            for neighbor, _ in self.adjacency_list[node]:
                if neighbor not in visited:
                    dfs_recursive(neighbor)
        
        dfs_recursive(start)
        return result
    
    def bfs(self, start: str) -> List[str]:
        """
        广度优先搜索
        
        原理：
        1. 从起始节点开始
        2. 使用队列保存待访问节点
        3. 先访问所有邻居，再访问邻居的邻居
        
        时间复杂度：O(V + E)
        空间复杂度：O(V)
        
        适用场景：
        - 最短路径（无权图）
        - 层级遍历
        - 社交网络分析
        """
        visited = {start}
        result = []
        queue = deque([start])
        
        while queue:
            node = queue.popleft()
            result.append(node)
            
            for neighbor, _ in self.adjacency_list[node]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
        
        return result
    
    def dijkstra(self, start: str) -> Dict[str, Tuple[int, List[str]]]:
        """
        Dijkstra 最短路径算法
        
        原理：
        1. 初始化：起点的距离为 0，其他为无穷大
        2. 每次选择距离最小的未访问节点
        3. 更新其邻居的距离
        4. 重复直到所有节点都被访问
        
        时间复杂度：O((V + E) log V)
        空间复杂度：O(V)
        
        适用场景：
        - 路由算法
        - 地图导航
        - 网络优化
        
        限制：
        - 不能处理负权边
        """
        # 初始化距离
        distances = {node: float('inf') for node in self.nodes}
        distances[start] = 0
        
        # 存储路径
        previous = {node: None for node in self.nodes}
        
        # 优先队列：(距离, 节点)
        pq = [(0, start)]
        visited = set()
        
        while pq:
            current_dist, current = heapq.heappop(pq)
            
            if current in visited:
                continue
            
            visited.add(current)
            
            # 更新邻居距离
            for neighbor, weight in self.adjacency_list[current]:
                if neighbor in visited:
                    continue
                
                new_dist = current_dist + weight
                
                if new_dist < distances[neighbor]:
                    distances[neighbor] = new_dist
                    previous[neighbor] = current
                    heapq.heappush(pq, (new_dist, neighbor))
        
        # 构建结果：包含最短距离和路径
        result = {}
        for node in self.nodes:
            if distances[node] != float('inf'):
                # 重建路径
                path = []
                current = node
                while current is not None:
                    path.append(current)
                    current = previous[current]
                path.reverse()
                
                result[node] = (distances[node], path)
        
        return result
    
    def has_cycle(self) -> bool:
        """
        检测图中是否有环
        
        使用 DFS 的三色标记法：
        - 白色：未访问
        - 灰色：正在访问（在递归栈中）
        - 黑色：访问完成
        
        如果在 DFS 过程中遇到灰色节点，说明存在环
        """
        WHITE, GRAY, BLACK = 0, 1, 2
        color = {node: WHITE for node in self.nodes}
        
        def dfs(node: str) -> bool:
            color[node] = GRAY
            
            for neighbor, _ in self.adjacency_list[node]:
                if color[neighbor] == GRAY:
                    return True  # 发现环
                if color[neighbor] == WHITE and dfs(neighbor):
                    return True
            
            color[node] = BLACK
            return False
        
        for node in self.nodes:
            if color[node] == WHITE:
                if dfs(node):
                    return True
        
        return False
    
    def display(self):
        """显示图的结构"""
        print("=" * 50)
        print(f"图类型: {'有向图' if self.directed else '无向图'}")
        print("=" * 50)
        
        for node in sorted(self.nodes):
            neighbors = self.adjacency_list[node]
            if neighbors:
                neighbor_str = ", ".join([f"{n}({w})" for n, w in neighbors])
                print(f"{node} -> {neighbor_str}")
            else:
                print(f"{node} -> (无连接)")


# 使用示例
if __name__ == "__main__":
    # 创建一个城市路线图
    print("创建城市路线图...\n")
    
    g = Graph(directed=False)
    
    # 添加边：城市之间的距离（公里）
    edges = [
        ('北京', '天津', 120),
        ('北京', '石家庄', 280),
        ('天津', '济南', 320),
        ('石家庄', '太原', 200),
        ('济南', '青岛', 350),
        ('太原', '西安', 600),
        ('西安', '成都', 700),
        ('济南', '南京', 600),
        ('南京', '上海', 300),
    ]
    
    for u, v, w in edges:
        g.add_edge(u, v, w)
    
    g.display()
    
    # DFS 遍历
    print("\n" + "=" * 50)
    print("从'北京'开始的 DFS 遍历:")
    dfs_result = g.dfs('北京')
    print(" -> ".join(dfs_result))
    
    # BFS 遍历
    print("\n从'北京'开始的 BFS 遍历:")
    bfs_result = g.bfs('北京')
    print(" -> ".join(bfs_result))
    
    # Dijkstra 最短路径
    print("\n" + "=" * 50)
    print("从'北京'到各城市的最短路径:")
    print("-" * 50)
    
    shortest_paths = g.dijkstra('北京')
    for city in sorted(shortest_paths.keys()):
        dist, path = shortest_paths[city]
        path_str = " -> ".join(path)
        print(f"到 {city}: {dist} 公里")
        print(f"  路径: {path_str}\n")
    
    # 检测环
    print("=" * 50)
    print(f"图中是否有环: {g.has_cycle()}")
```

---

## 案例 3: 动态规划

### 任务描述
实现经典的动态规划问题。

### 提示词

```markdown
请实现以下动态规划算法：

1. 斐波那契数列（记忆化搜索）
2. 最长公共子序列 (LCS)
3. 0-1 背包问题
4. 编辑距离
5. 最长递增子序列

要求：
- 详细解释状态转移方程
- 分析时间和空间复杂度
- 提供自顶向下和自底向上两种实现
- 包含空间优化版本
- 给出实际应用场景
```

### 参考实现

```python
from typing import List, Tuple
from functools import lru_cache


class DynamicProgramming:
    """动态规划算法集合"""
    
    # ========== 1. 斐波那契数列 ==========
    
    @staticmethod
    def fibonacci_memoization(n: int) -> int:
        """
        斐波那契数列 - 记忆化搜索
        
        状态转移方程：
        F(n) = F(n-1) + F(n-2)
        F(0) = 0, F(1) = 1
        
        时间复杂度：O(n)
        空间复杂度：O(n) - 递归栈和缓存
        """
        @lru_cache(maxsize=None)
        def fib(k):
            if k <= 1:
                return k
            return fib(k - 1) + fib(k - 2)
        
        return fib(n)
    
    @staticmethod
    def fibonacci_iterative(n: int) -> int:
        """
        斐波那契数列 - 迭代（空间优化）
        
        时间复杂度：O(n)
        空间复杂度：O(1) - 只保存前两个数
        """
        if n <= 1:
            return n
        
        prev, curr = 0, 1
        for _ in range(2, n + 1):
            prev, curr = curr, prev + curr
        
        return curr
    
    # ========== 2. 最长公共子序列 ==========
    
    @staticmethod
    def longest_common_subsequence(s1: str, s2: str) -> Tuple[int, str]:
        """
        最长公共子序列 (LCS)
        
        问题：找出两个字符串最长的公共子序列
        子序列：不需要连续，但顺序要保持
        
        状态定义：
        dp[i][j] = s1[0..i-1] 和 s2[0..j-1] 的 LCS 长度
        
        状态转移：
        if s1[i-1] == s2[j-1]:
            dp[i][j] = dp[i-1][j-1] + 1
        else:
            dp[i][j] = max(dp[i-1][j], dp[i][j-1])
        
        时间复杂度：O(m*n)
        空间复杂度：O(m*n)，可优化至 O(min(m,n))
        
        应用：
        - Git diff 算法
        - DNA 序列比对
        - 文本相似度计算
        """
        m, n = len(s1), len(s2)
        
        # 创建 DP 表
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        
        # 填充 DP 表
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if s1[i - 1] == s2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1] + 1
                else:
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
        
        # 重建 LCS
        lcs = []
        i, j = m, n
        while i > 0 and j > 0:
            if s1[i - 1] == s2[j - 1]:
                lcs.append(s1[i - 1])
                i -= 1
                j -= 1
            elif dp[i - 1][j] > dp[i][j - 1]:
                i -= 1
            else:
                j -= 1
        
        return dp[m][n], ''.join(reversed(lcs))
    
    # ========== 3. 0-1 背包问题 ==========
    
    @staticmethod
    def knapsack(weights: List[int], values: List[int], capacity: int) -> Tuple[int, List[int]]:
        """
        0-1 背包问题
        
        问题：在容量限制下，选择物品使价值最大
        0-1：每个物品要么选要么不选，不能分割
        
        状态定义：
        dp[i][w] = 前 i 个物品，容量为 w 时的最大价值
        
        状态转移：
        if w >= weights[i-1]:
            dp[i][w] = max(dp[i-1][w], dp[i-1][w-weights[i-1]] + values[i-1])
        else:
            dp[i][w] = dp[i-1][w]
        
        时间复杂度：O(n*W)
        空间复杂度：O(n*W)，可优化至 O(W)
        
        应用：
        - 资源分配
        - 装载问题
        - 预算规划
        """
        n = len(weights)
        
        # DP 表
        dp = [[0] * (capacity + 1) for _ in range(n + 1)]
        
        # 填充 DP 表
        for i in range(1, n + 1):
            for w in range(capacity + 1):
                if w >= weights[i - 1]:
                    dp[i][w] = max(
                        dp[i - 1][w],  # 不选第 i 个物品
                        dp[i - 1][w - weights[i - 1]] + values[i - 1]  # 选第 i 个物品
                    )
                else:
                    dp[i][w] = dp[i - 1][w]
        
        # 重建选择的物品
        selected = []
        w = capacity
        for i in range(n, 0, -1):
            if dp[i][w] != dp[i - 1][w]:
                selected.append(i - 1)
                w -= weights[i - 1]
        
        return dp[n][capacity], selected
    
    # ========== 4. 编辑距离 ==========
    
    @staticmethod
    def edit_distance(s1: str, s2: str) -> int:
        """
        编辑距离（Levenshtein Distance）
        
        问题：将一个字符串转换成另一个字符串的最少操作次数
        操作：插入、删除、替换
        
        状态定义：
        dp[i][j] = s1[0..i-1] 转换成 s2[0..j-1] 的最小编辑距离
        
        状态转移：
        if s1[i-1] == s2[j-1]:
            dp[i][j] = dp[i-1][j-1]
        else:
            dp[i][j] = 1 + min(
                dp[i-1][j],     # 删除
                dp[i][j-1],     # 插入
                dp[i-1][j-1]    # 替换
            )
        
        时间复杂度：O(m*n)
        空间复杂度：O(m*n)，可优化至 O(min(m,n))
        
        应用：
        - 拼写检查
        - DNA 序列比对
        - 语音识别
        """
        m, n = len(s1), len(s2)
        
        # 使用两行优化空间
        prev = list(range(n + 1))
        curr = [0] * (n + 1)
        
        for i in range(1, m + 1):
            curr[0] = i
            for j in range(1, n + 1):
                if s1[i - 1] == s2[j - 1]:
                    curr[j] = prev[j - 1]
                else:
                    curr[j] = 1 + min(prev[j], curr[j - 1], prev[j - 1])
            prev, curr = curr, prev
        
        return prev[n]


# 测试和演示
if __name__ == "__main__":
    dp = DynamicProgramming()
    
    print("=" * 60)
    print("动态规划算法演示")
    print("=" * 60)
    
    # 1. 斐波那契
    print("\n1. 斐波那契数列")
    print("-" * 40)
    for i in range(10):
        fib = dp.fibonacci_iterative(i)
        print(f"F({i}) = {fib}")
    
    # 2. 最长公共子序列
    print("\n2. 最长公共子序列 (LCS)")
    print("-" * 40)
    s1, s2 = "ABCDGH", "AEDFHR"
    length, lcs = dp.longest_common_subsequence(s1, s2)
    print(f"字符串 1: {s1}")
    print(f"字符串 2: {s2}")
    print(f"LCS 长度: {length}")
    print(f"LCS: {lcs}")
    
    # 3. 0-1 背包
    print("\n3. 0-1 背包问题")
    print("-" * 40)
    weights = [2, 3, 4, 5]
    values = [3, 4, 5, 6]
    capacity = 5
    max_value, selected = dp.knapsack(weights, values, capacity)
    print(f"物品重量: {weights}")
    print(f"物品价值: {values}")
    print(f"背包容量: {capacity}")
    print(f"最大价值: {max_value}")
    print(f"选择物品: {selected}")
    
    # 4. 编辑距离
    print("\n4. 编辑距离")
    print("-" * 40)
    word1, word2 = "kitten", "sitting"
    distance = dp.edit_distance(word1, word2)
    print(f"单词 1: {word1}")
    print(f"单词 2: {word2}")
    print(f"编辑距离: {distance}")
    
    print("\n" + "=" * 60)
    print("演示完成！")
    print("=" * 60)
```

---

## 📝 学习总结

完成这些练习后，你应该掌握：

1. ✓ 经典排序算法的实现
2. ✓ 图的遍历和最短路径
3. ✓ 动态规划的基本思想
4. ✓ 算法复杂度分析

**关键学习技巧:**
- 让 AI 解释算法原理
- 要求详细的代码注释
- 对比不同实现的优劣
- 理解算法的适用场景

**下一步**: 尝试 [项目实战 →](../05-projects/)
