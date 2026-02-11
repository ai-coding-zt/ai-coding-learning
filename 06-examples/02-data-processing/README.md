# 数据处理案例

> 使用 AI 辅助进行数据清洗、转换和分析

## 🎯 学习目标

掌握 AI 辅助数据处理的核心技能：
1. 数据清洗和预处理
2. 数据转换和格式化
3. 数据分析和可视化
4. 文件读写操作

---

## 案例 1: CSV 数据清洗

### 任务描述
处理一个 messy 的 CSV 文件，包含用户数据，需要进行清洗和标准化。

### 示例数据 (users_raw.csv)

```csv
Name,Email,Phone,Age,Join_Date
张三,zhangsan@email.com,13800138000,25,2023-1-15
李四,lisi@EMAIL.COM,139-0013-9000,thirty,2023/02/20
王五,wangwu@test.com,+86 137 0013 7000,28.5,15-Mar-2023
赵六,zhaoliu@domain,13600136000,35,2023-04-10
张三,zhangsan@email.com,13800138000,25,2023-01-15
,unknown@test.com,13500135000,,2023-05-01
```

### 提示词

```markdown
请编写一个 Python 脚本，处理上述 CSV 数据：
1. 读取 CSV 文件
2. 处理重复行（根据 email 去重）
3. 标准化邮箱格式（小写）
4. 标准化手机号格式（11位数字，去除分隔符）
5. 处理年龄字段（转换为整数，无效值设为 None）
6. 标准化日期格式（统一为 YYYY-MM-DD）
7. 处理缺失值（空字符串转为 None）
8. 保存清洗后的数据到新 CSV

要求：
- 使用 pandas 库
- 添加数据质量报告（处理了多少问题）
- 包含错误处理
```

### 参考实现

```python
import pandas as pd
import re
from datetime import datetime
from typing import Dict, Tuple


def clean_phone(phone: str) -> str:
    """清洗手机号，统一为11位数字"""
    if pd.isna(phone):
        return None
    
    # 移除所有非数字字符
    digits = re.sub(r'\D', '', str(phone))
    
    # 处理 +86 前缀
    if digits.startswith('86') and len(digits) == 13:
        digits = digits[2:]
    
    # 验证长度
    if len(digits) != 11:
        return None
    
    return digits


def clean_age(age) -> int:
    """清洗年龄字段"""
    if pd.isna(age):
        return None
    
    try:
        # 处理中文数字
        chinese_numbers = {
            '零': 0, '一': 1, '二': 2, '三': 3, '四': 4,
            '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10
        }
        
        age_str = str(age).strip().lower()
        
        # 处理中文数字（简化处理）
        for cn, num in chinese_numbers.items():
            age_str = age_str.replace(cn, str(num))
        
        # 转换为浮点数再转整数
        age_num = float(age_str)
        
        # 验证合理性
        if 0 < age_num < 150:
            return int(age_num)
        else:
            return None
    except (ValueError, TypeError):
        return None


def parse_date(date_str: str) -> str:
    """解析多种日期格式"""
    if pd.isna(date_str):
        return None
    
    date_str = str(date_str).strip()
    
    # 尝试多种格式
    formats = [
        '%Y-%m-%d',
        '%Y/%m/%d',
        '%d-%b-%Y',
        '%d-%B-%Y',
        '%Y-%m',
        '%Y/%m',
        '%d/%m/%Y',
    ]
    
    for fmt in formats:
        try:
            parsed = datetime.strptime(date_str, fmt)
            return parsed.strftime('%Y-%m-%d')
        except ValueError:
            continue
    
    return None


def clean_csv_data(input_file: str, output_file: str) -> Dict:
    """
    清洗 CSV 数据
    
    Returns:
        数据质量报告
    """
    # 读取数据
    df = pd.read_csv(input_file)
    original_count = len(df)
    
    report = {
        'original_rows': original_count,
        'duplicates_removed': 0,
        'emails_normalized': 0,
        'phones_cleaned': 0,
        'ages_converted': 0,
        'dates_standardized': 0,
        'missing_values_filled': 0,
        'final_rows': 0
    }
    
    # 1. 处理重复行（根据 email）
    duplicates = df.duplicated(subset=['Email'], keep='first').sum()
    df = df.drop_duplicates(subset=['Email'], keep='first')
    report['duplicates_removed'] = duplicates
    
    # 2. 标准化邮箱
    df['Email'] = df['Email'].str.lower().str.strip()
    report['emails_normalized'] = df['Email'].notna().sum()
    
    # 3. 清洗手机号
    df['Phone_Clean'] = df['Phone'].apply(clean_phone)
    report['phones_cleaned'] = df['Phone_Clean'].notna().sum()
    
    # 4. 处理年龄
    df['Age_Clean'] = df['Age'].apply(clean_age)
    report['ages_converted'] = df['Age_Clean'].notna().sum()
    
    # 5. 标准化日期
    df['Join_Date_Clean'] = df['Join_Date'].apply(parse_date)
    report['dates_standardized'] = df['Join_Date_Clean'].notna().sum()
    
    # 6. 处理缺失值
    df = df.replace(r'^\s*$', None, regex=True)
    df = df.where(pd.notna(df), None)
    
    # 7. 重命名和选择列
    df_clean = df[['Name', 'Email', 'Phone_Clean', 'Age_Clean', 'Join_Date_Clean']].copy()
    df_clean.columns = ['Name', 'Email', 'Phone', 'Age', 'Join_Date']
    
    # 8. 移除 name 为空的行
    df_clean = df_clean.dropna(subset=['Name'])
    
    report['final_rows'] = len(df_clean)
    report['missing_values_filled'] = df_clean.isna().sum().sum()
    
    # 保存清洗后的数据
    df_clean.to_csv(output_file, index=False)
    
    return report


def print_report(report: Dict):
    """打印数据质量报告"""
    print("=" * 50)
    print("数据清洗报告")
    print("=" * 50)
    print(f"原始数据行数: {report['original_rows']}")
    print(f"重复行移除: {report['duplicates_removed']}")
    print(f"邮箱标准化: {report['emails_normalized']}")
    print(f"手机号清洗: {report['phones_cleaned']}")
    print(f"年龄转换: {report['ages_converted']}")
    print(f"日期标准化: {report['dates_standardized']}")
    print(f"缺失值数量: {report['missing_values_filled']}")
    print(f"最终数据行数: {report['final_rows']}")
    print("=" * 50)


if __name__ == "__main__":
    # 创建示例数据
    sample_data = """Name,Email,Phone,Age,Join_Date
张三,zhangsan@email.com,13800138000,25,2023-1-15
李四,lisi@EMAIL.COM,139-0013-9000,thirty,2023/02/20
王五,wangwu@test.com,+86 137 0013 7000,28.5,15-Mar-2023
赵六,zhaoliu@domain,13600136000,35,2023-04-10
张三,zhangsan@email.com,13800138000,25,2023-01-15
,unknown@test.com,13500135000,,2023-05-01"""
    
    # 保存示例数据
    with open('users_raw.csv', 'w', encoding='utf-8') as f:
        f.write(sample_data)
    
    # 执行清洗
    report = clean_csv_data('users_raw.csv', 'users_cleaned.csv')
    print_report(report)
    
    # 显示清洗后的数据
    print("\n清洗后的数据预览:")
    df_clean = pd.read_csv('users_cleaned.csv')
    print(df_clean.to_string())
```

---

## 案例 2: JSON 数据转换

### 任务描述
将嵌套的 JSON 数据转换为扁平化的表格格式。

### 示例数据

```json
{
  "orders": [
    {
      "order_id": "ORD001",
      "customer": {
        "name": "张三",
        "email": "zhangsan@test.com",
        "address": {
          "city": "北京",
          "district": "朝阳区"
        }
      },
      "items": [
        {"product": "iPhone", "price": 5999, "quantity": 1},
        {"product": "AirPods", "price": 1299, "quantity": 2}
      ],
      "order_date": "2024-01-15"
    }
  ]
}
```

### 提示词

```markdown
编写 Python 脚本，将上述嵌套 JSON 转换为扁平化的 DataFrame：
1. 将嵌套的 customer 信息展开为独立列
2. 将 items 数组展开为多行（每个 item 一行）
3. 保留订单级信息（order_id, order_date）
4. 计算每行的总价（price * quantity）
5. 添加客户城市信息
6. 输出为 CSV 格式

要求：
- 使用 pandas json_normalize
- 处理任意数量的订单和 items
- 添加数据验证
```

### 参考实现

```python
import pandas as pd
import json
from typing import List, Dict


def flatten_orders(json_data: Dict) -> pd.DataFrame:
    """
    将嵌套的订单 JSON 扁平化
    
    Args:
        json_data: 包含 orders 的 JSON 数据
        
    Returns:
        扁平化的 DataFrame
    """
    orders = json_data.get('orders', [])
    
    if not orders:
        return pd.DataFrame()
    
    flattened_records = []
    
    for order in orders:
        order_id = order.get('order_id')
        order_date = order.get('order_date')
        
        # 提取客户信息
        customer = order.get('customer', {})
        customer_name = customer.get('name')
        customer_email = customer.get('email')
        address = customer.get('address', {})
        city = address.get('city')
        district = address.get('district')
        
        # 展开 items
        items = order.get('items', [])
        if not items:
            # 如果没有 items，创建一条空记录
            flattened_records.append({
                'order_id': order_id,
                'order_date': order_date,
                'customer_name': customer_name,
                'customer_email': customer_email,
                'city': city,
                'district': district,
                'product': None,
                'price': None,
                'quantity': None,
                'item_total': 0
            })
        else:
            for item in items:
                price = item.get('price', 0)
                quantity = item.get('quantity', 0)
                
                flattened_records.append({
                    'order_id': order_id,
                    'order_date': order_date,
                    'customer_name': customer_name,
                    'customer_email': customer_email,
                    'city': city,
                    'district': district,
                    'product': item.get('product'),
                    'price': price,
                    'quantity': quantity,
                    'item_total': price * quantity
                })
    
    return pd.DataFrame(flattened_records)


def analyze_orders(df: pd.DataFrame) -> Dict:
    """分析订单数据"""
    analysis = {
        'total_orders': df['order_id'].nunique(),
        'total_items': len(df),
        'total_revenue': df['item_total'].sum(),
        'avg_order_value': df.groupby('order_id')['item_total'].sum().mean(),
        'top_products': df.groupby('product')['quantity'].sum().sort_values(ascending=False).head().to_dict(),
        'city_distribution': df['city'].value_counts().to_dict()
    }
    return analysis


if __name__ == "__main__":
    # 示例数据
    data = {
        "orders": [
            {
                "order_id": "ORD001",
                "customer": {
                    "name": "张三",
                    "email": "zhangsan@test.com",
                    "address": {
                        "city": "北京",
                        "district": "朝阳区"
                    }
                },
                "items": [
                    {"product": "iPhone", "price": 5999, "quantity": 1},
                    {"product": "AirPods", "price": 1299, "quantity": 2}
                ],
                "order_date": "2024-01-15"
            },
            {
                "order_id": "ORD002",
                "customer": {
                    "name": "李四",
                    "email": "lisi@test.com",
                    "address": {
                        "city": "上海",
                        "district": "浦东新区"
                    }
                },
                "items": [
                    {"product": "MacBook", "price": 12999, "quantity": 1},
                    {"product": "Mouse", "price": 299, "quantity": 1}
                ],
                "order_date": "2024-01-16"
            },
            {
                "order_id": "ORD003",
                "customer": {
                    "name": "王五",
                    "email": "wangwu@test.com",
                    "address": {
                        "city": "北京",
                        "district": "海淀区"
                    }
                },
                "items": [
                    {"product": "iPhone", "price": 5999, "quantity": 2}
                ],
                "order_date": "2024-01-17"
            }
        ]
    }
    
    # 转换数据
    df = flatten_orders(data)
    
    print("扁平化后的数据:")
    print(df.to_string())
    
    # 保存为 CSV
    df.to_csv('flattened_orders.csv', index=False, encoding='utf-8')
    print("\n✓ 数据已保存到 flattened_orders.csv")
    
    # 数据分析
    print("\n" + "=" * 50)
    print("数据分析报告")
    print("=" * 50)
    
    analysis = analyze_orders(df)
    print(f"订单总数: {analysis['total_orders']}")
    print(f"商品行数: {analysis['total_items']}")
    print(f"总营收: ¥{analysis['total_revenue']:,.2f}")
    print(f"平均订单金额: ¥{analysis['avg_order_value']:,.2f}")
    
    print("\n热门商品 (销量):")
    for product, qty in analysis['top_products'].items():
        print(f"  - {product}: {qty} 件")
    
    print("\n城市分布:")
    for city, count in analysis['city_distribution'].items():
        print(f"  - {city}: {count} 单")
```

---

## 案例 3: 数据可视化

### 任务描述
使用 AI 辅助创建数据可视化图表。

### 提示词

```markdown
编写 Python 脚本，创建销售数据的可视化报告：
1. 读取销售数据（模拟生成）
2. 创建以下图表：
   - 月度销售趋势折线图
   - 产品类别销量柱状图
   - 地区销售分布饼图
   - 销售额与利润散点图
3. 使用 matplotlib 和 seaborn
4. 添加标题、标签和图例
5. 保存为高质量的 PNG 文件
6. 生成数据分析摘要
```

### 参考实现

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

# 设置中文字体
plt.rcParams['font.sans-serif'] = ['SimHei', 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False


def generate_sample_data() -> pd.DataFrame:
    """生成示例销售数据"""
    np.random.seed(42)
    
    # 生成日期范围
    dates = pd.date_range(start='2024-01-01', end='2024-12-31', freq='D')
    
    # 产品类别
    categories = ['电子产品', '服装', '食品', '家居', '图书']
    
    # 地区
    regions = ['北京', '上海', '广州', '深圳', '杭州']
    
    data = []
    for date in dates:
        for _ in range(np.random.randint(5, 15)):  # 每天 5-15 笔交易
            category = np.random.choice(categories)
            region = np.random.choice(regions)
            
            # 根据类别设置基础价格
            base_price = {
                '电子产品': 2000,
                '服装': 300,
                '食品': 50,
                '家居': 500,
                '图书': 80
            }[category]
            
            price = base_price * np.random.uniform(0.8, 1.2)
            quantity = np.random.randint(1, 5)
            sales = price * quantity
            profit_margin = np.random.uniform(0.1, 0.3)
            profit = sales * profit_margin
            
            data.append({
                'date': date,
                'category': category,
                'region': region,
                'price': price,
                'quantity': quantity,
                'sales': sales,
                'profit': profit
            })
    
    return pd.DataFrame(data)


def create_visualization_report(df: pd.DataFrame):
    """创建可视化报告"""
    
    # 创建大图
    fig = plt.figure(figsize=(20, 12))
    
    # 1. 月度销售趋势
    ax1 = plt.subplot(2, 3, 1)
    monthly_sales = df.groupby(df['date'].dt.to_period('M')).agg({
        'sales': 'sum',
        'profit': 'sum'
    }).reset_index()
    monthly_sales['date'] = monthly_sales['date'].astype(str)
    
    ax1.plot(monthly_sales['date'], monthly_sales['sales'], marker='o', label='销售额', linewidth=2)
    ax1.plot(monthly_sales['date'], monthly_sales['profit'], marker='s', label='利润', linewidth=2)
    ax1.set_title('月度销售趋势', fontsize=14, fontweight='bold')
    ax1.set_xlabel('月份')
    ax1.set_ylabel('金额 (元)')
    ax1.legend()
    ax1.tick_params(axis='x', rotation=45)
    ax1.grid(True, alpha=0.3)
    
    # 2. 产品类别销量
    ax2 = plt.subplot(2, 3, 2)
    category_sales = df.groupby('category')['sales'].sum().sort_values(ascending=True)
    colors = plt.cm.Set3(np.linspace(0, 1, len(category_sales)))
    bars = ax2.barh(category_sales.index, category_sales.values, color=colors)
    ax2.set_title('产品类别销售额', fontsize=14, fontweight='bold')
    ax2.set_xlabel('销售额 (元)')
    
    # 添加数值标签
    for i, (idx, val) in enumerate(category_sales.items()):
        ax2.text(val, i, f' ¥{val:,.0f}', va='center')
    
    # 3. 地区销售分布（饼图）
    ax3 = plt.subplot(2, 3, 3)
    region_sales = df.groupby('region')['sales'].sum()
    colors_pie = plt.cm.Set2(np.linspace(0, 1, len(region_sales)))
    wedges, texts, autotexts = ax3.pie(
        region_sales.values, 
        labels=region_sales.index,
        autopct='%1.1f%%',
        colors=colors_pie,
        startangle=90
    )
    ax3.set_title('地区销售分布', fontsize=14, fontweight='bold')
    
    # 4. 销售额与利润散点图
    ax4 = plt.subplot(2, 3, 4)
    daily_stats = df.groupby('date').agg({
        'sales': 'sum',
        'profit': 'sum'
    }).reset_index()
    
    scatter = ax4.scatter(
        daily_stats['sales'], 
        daily_stats['profit'],
        c=daily_stats.index,
        cmap='viridis',
        alpha=0.6,
        s=50
    )
    ax4.set_title('销售额 vs 利润', fontsize=14, fontweight='bold')
    ax4.set_xlabel('销售额')
    ax4.set_ylabel('利润')
    ax4.grid(True, alpha=0.3)
    
    # 添加趋势线
    z = np.polyfit(daily_stats['sales'], daily_stats['profit'], 1)
    p = np.poly1d(z)
    ax4.plot(daily_stats['sales'], p(daily_stats['sales']), "r--", alpha=0.8, label='趋势线')
    ax4.legend()
    
    # 5. 热力图：类别 vs 地区
    ax5 = plt.subplot(2, 3, 5)
    pivot_table = df.pivot_table(values='sales', index='category', columns='region', aggfunc='sum')
    sns.heatmap(pivot_table, annot=True, fmt='.0f', cmap='YlOrRd', ax=ax5, cbar_kws={'label': '销售额'})
    ax5.set_title('类别-地区销售热力图', fontsize=14, fontweight='bold')
    ax5.set_xlabel('地区')
    ax5.set_ylabel('产品类别')
    
    # 6. 箱线图：各类别利润分布
    ax6 = plt.subplot(2, 3, 6)
    df['profit_margin'] = df['profit'] / df['sales'] * 100
    sns.boxplot(data=df, x='category', y='profit_margin', ax=ax6)
    ax6.set_title('各类别利润率分布', fontsize=14, fontweight='bold')
    ax6.set_xlabel('产品类别')
    ax6.set_ylabel('利润率 (%)')
    ax6.tick_params(axis='x', rotation=45)
    
    plt.tight_layout()
    plt.savefig('sales_analysis_report.png', dpi=300, bbox_inches='tight')
    print("✓ 可视化报告已保存: sales_analysis_report.png")
    plt.show()


def generate_summary(df: pd.DataFrame) -> Dict:
    """生成数据分析摘要"""
    summary = {
        '总销售额': f"¥{df['sales'].sum():,.2f}",
        '总利润': f"¥{df['profit'].sum():,.2f}",
        '平均利润率': f"{(df['profit'].sum() / df['sales'].sum() * 100):.2f}%",
        '交易笔数': len(df),
        '平均订单金额': f"¥{df['sales'].mean():.2f}",
        '最畅销类别': df.groupby('category')['sales'].sum().idxmax(),
        '最佳销售地区': df.groupby('region')['sales'].sum().idxmax(),
        '销售高峰月份': df.groupby(df['date'].dt.month)['sales'].sum().idxmax()
    }
    return summary


if __name__ == "__main__":
    print("生成销售数据...")
    df = generate_sample_data()
    
    print(f"✓ 生成了 {len(df)} 条交易记录")
    
    print("\n创建可视化报告...")
    create_visualization_report(df)
    
    print("\n" + "=" * 50)
    print("数据分析摘要")
    print("=" * 50)
    
    summary = generate_summary(df)
    for key, value in summary.items():
        print(f"{key}: {value}")
    
    # 保存原始数据
    df.to_csv('sales_data.csv', index=False, encoding='utf-8')
    print("\n✓ 原始数据已保存: sales_data.csv")
```

---

## 📝 学习总结

完成这些练习后，你应该掌握：

1. ✓ 使用 AI 辅助数据清洗
2. ✓ 处理嵌套 JSON 数据
3. ✓ 创建数据可视化
4. ✓ 编写数据质量报告

**关键提示词技巧:**
- 明确数据格式和来源
- 说明期望的输出格式
- 指定使用的库和工具
- 要求包含错误处理

**下一步**: 尝试 [Web 开发案例 →](../03-web-development/)
