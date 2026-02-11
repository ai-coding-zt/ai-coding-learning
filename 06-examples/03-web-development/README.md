# Web 开发案例

> 使用 AI 辅助进行 Web 应用开发

## 🎯 学习目标

掌握 AI 辅助 Web 开发的核心技能：
1. RESTful API 设计
2. 数据库模型设计
3. 用户认证系统
4. 前端页面生成

---

## 案例 1: RESTful API 开发

### 任务描述
创建一个完整的待办事项 API，包含 CRUD 操作。

### 提示词

```markdown
使用 Flask 创建一个待办事项 RESTful API：

1. 数据模型 Todo：
   - id: 主键
   - title: 标题（必填）
   - description: 描述
   - completed: 完成状态
   - created_at: 创建时间
   - updated_at: 更新时间
   - priority: 优先级 (low/medium/high)

2. API 端点：
   - GET /api/todos - 获取所有待办
   - GET /api/todos/<id> - 获取单个待办
   - POST /api/todos - 创建待办
   - PUT /api/todos/<id> - 更新待办
   - DELETE /api/todos/<id> - 删除待办
   - GET /api/todos?completed=true - 筛选功能
   - GET /api/todos?priority=high - 按优先级筛选

3. 要求：
   - 使用 Flask-SQLAlchemy
   - 添加请求验证
   - 返回统一的 JSON 格式
   - 包含错误处理
   - 添加 API 文档注释
   - 包含单元测试
```

### 参考实现

```python
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from typing import Dict, List, Optional
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todos.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


class Todo(db.Model):
    """待办事项模型"""
    __tablename__ = 'todos'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    completed = db.Column(db.Boolean, default=False)
    priority = db.Column(db.String(20), default='medium')  # low, medium, high
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self) -> Dict:
        """转换为字典"""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'completed': self.completed,
            'priority': self.priority,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


# 统一响应格式
def success_response(data=None, message="Success"):
    """成功响应"""
    response = {'success': True, 'message': message}
    if data is not None:
        response['data'] = data
    return jsonify(response)


def error_response(message, status_code=400):
    """错误响应"""
    return jsonify({'success': False, 'error': message}), status_code


# API 路由

@app.route('/api/todos', methods=['GET'])
def get_todos():
    """
    获取所有待办事项
    
    Query Parameters:
        completed (bool): 筛选完成状态
        priority (str): 筛选优先级 (low/medium/high)
        search (str): 搜索标题
    
    Returns:
        JSON: 待办事项列表
    """
    query = Todo.query
    
    # 筛选完成状态
    completed = request.args.get('completed')
    if completed is not None:
        completed = completed.lower() == 'true'
        query = query.filter_by(completed=completed)
    
    # 筛选优先级
    priority = request.args.get('priority')
    if priority:
        query = query.filter_by(priority=priority.lower())
    
    # 搜索功能
    search = request.args.get('search')
    if search:
        query = query.filter(Todo.title.contains(search))
    
    # 排序：先按优先级，再按创建时间
    priority_order = db.case(
        {"high": 1, "medium": 2, "low": 3},
        value=Todo.priority
    )
    query = query.order_by(priority_order, Todo.created_at.desc())
    
    todos = query.all()
    return success_response(data=[todo.to_dict() for todo in todos])


@app.route('/api/todos/<int:todo_id>', methods=['GET'])
def get_todo(todo_id: int):
    """
    获取单个待办事项
    
    Parameters:
        todo_id (int): 待办事项 ID
    
    Returns:
        JSON: 待办事项详情
    """
    todo = Todo.query.get(todo_id)
    if not todo:
        return error_response('Todo not found', 404)
    
    return success_response(data=todo.to_dict())


@app.route('/api/todos', methods=['POST'])
def create_todo():
    """
    创建待办事项
    
    Request Body:
        title (str): 标题（必填）
        description (str): 描述
        priority (str): 优先级（low/medium/high）
    
    Returns:
        JSON: 创建的待办事项
    """
    data = request.get_json()
    
    if not data:
        return error_response('No data provided')
    
    # 验证必填字段
    title = data.get('title', '').strip()
    if not title:
        return error_response('Title is required')
    
    # 验证优先级
    priority = data.get('priority', 'medium').lower()
    if priority not in ['low', 'medium', 'high']:
        return error_response('Priority must be low, medium, or high')
    
    # 创建待办
    todo = Todo(
        title=title,
        description=data.get('description', ''),
        priority=priority
    )
    
    db.session.add(todo)
    db.session.commit()
    
    return success_response(
        data=todo.to_dict(),
        message='Todo created successfully'
    ), 201


@app.route('/api/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id: int):
    """
    更新待办事项
    
    Parameters:
        todo_id (int): 待办事项 ID
    
    Request Body:
        title (str): 标题
        description (str): 描述
        completed (bool): 完成状态
        priority (str): 优先级
    
    Returns:
        JSON: 更新后的待办事项
    """
    todo = Todo.query.get(todo_id)
    if not todo:
        return error_response('Todo not found', 404)
    
    data = request.get_json()
    if not data:
        return error_response('No data provided')
    
    # 更新字段
    if 'title' in data:
        title = data['title'].strip()
        if not title:
            return error_response('Title cannot be empty')
        todo.title = title
    
    if 'description' in data:
        todo.description = data['description']
    
    if 'completed' in data:
        todo.completed = bool(data['completed'])
    
    if 'priority' in data:
        priority = data['priority'].lower()
        if priority not in ['low', 'medium', 'high']:
            return error_response('Priority must be low, medium, or high')
        todo.priority = priority
    
    todo.updated_at = datetime.utcnow()
    db.session.commit()
    
    return success_response(
        data=todo.to_dict(),
        message='Todo updated successfully'
    )


@app.route('/api/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id: int):
    """
    删除待办事项
    
    Parameters:
        todo_id (int): 待办事项 ID
    
    Returns:
        JSON: 删除结果
    """
    todo = Todo.query.get(todo_id)
    if not todo:
        return error_response('Todo not found', 404)
    
    db.session.delete(todo)
    db.session.commit()
    
    return success_response(message='Todo deleted successfully')


@app.route('/api/todos/stats', methods=['GET'])
def get_stats():
    """获取统计信息"""
    total = Todo.query.count()
    completed = Todo.query.filter_by(completed=True).count()
    pending = total - completed
    
    priority_stats = {}
    for priority in ['low', 'medium', 'high']:
        count = Todo.query.filter_by(priority=priority).count()
        priority_stats[priority] = count
    
    return success_response(data={
        'total': total,
        'completed': completed,
        'pending': pending,
        'completion_rate': round(completed / total * 100, 2) if total > 0 else 0,
        'by_priority': priority_stats
    })


@app.route('/api/health', methods=['GET'])
def health_check():
    """健康检查"""
    return success_response(data={'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()})


# 错误处理
@app.errorhandler(404)
def not_found(error):
    return error_response('Resource not found', 404)


@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return error_response('Internal server error', 500)


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    
    app.run(debug=True, port=5000)
```

### API 测试脚本

```python
import requests
import json

BASE_URL = "http://127.0.0.1:5000/api"

def test_api():
    """测试 API"""
    print("=" * 50)
    print("待办事项 API 测试")
    print("=" * 50)
    
    # 1. 创建待办
    print("\n1. 创建待办事项...")
    response = requests.post(f"{BASE_URL}/todos", json={
        "title": "学习 AI 编程",
        "description": "完成所有案例练习",
        "priority": "high"
    })
    print(f"创建: {response.status_code}")
    print(json.dumps(response.json(), indent=2, ensure_ascii=False))
    
    todo_id = response.json()['data']['id']
    
    # 2. 获取所有待办
    print("\n2. 获取所有待办...")
    response = requests.get(f"{BASE_URL}/todos")
    print(f"获取列表: {response.status_code}")
    print(json.dumps(response.json(), indent=2, ensure_ascii=False))
    
    # 3. 更新待办
    print("\n3. 更新待办...")
    response = requests.put(f"{BASE_URL}/todos/{todo_id}", json={
        "completed": True
    })
    print(f"更新: {response.status_code}")
    print(json.dumps(response.json(), indent=2, ensure_ascii=False))
    
    # 4. 获取统计
    print("\n4. 获取统计信息...")
    response = requests.get(f"{BASE_URL}/todos/stats")
    print(f"统计: {response.status_code}")
    print(json.dumps(response.json(), indent=2, ensure_ascii=False))
    
    # 5. 删除待办
    print("\n5. 删除待办...")
    response = requests.delete(f"{BASE_URL}/todos/{todo_id}")
    print(f"删除: {response.status_code}")
    print(json.dumps(response.json(), indent=2, ensure_ascii=False))
    
    print("\n" + "=" * 50)
    print("测试完成！")
    print("=" * 50)


if __name__ == "__main__":
    test_api()
```

---

## 案例 2: 用户认证系统

### 任务描述
实现一个完整的 JWT 用户认证系统。

### 提示词

```markdown
使用 Flask + Flask-JWT-Extended 创建用户认证系统：

1. 用户模型：
   - id, username, email, password_hash
   - created_at, updated_at
   - is_active

2. 功能：
   - 用户注册（密码加密）
   - 用户登录（返回 JWT）
   - 获取当前用户信息
   - 刷新 Token
   - 修改密码
   - 注销（Token 黑名单）

3. 安全要求：
   - 密码使用 bcrypt 加密
   - JWT 包含用户 ID 和权限
   - 密码强度验证
   - 防止 SQL 注入
   - Token 过期处理

4. 包含完整的错误处理和测试
```

### 参考实现 (简化版)

```python
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import (
    JWTManager, create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity, get_jwt
)
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import re

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///auth.db'
app.config['JWT_SECRET_KEY'] = 'jwt-secret-key'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)

db = SQLAlchemy(app)
jwt = JWTManager(app)

# Token 黑名单（生产环境应使用 Redis）
blacklist = set()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat(),
            'is_active': self.is_active
        }


# 密码强度验证
def validate_password(password):
    if len(password) < 8:
        return False, "密码至少 8 位"
    if not re.search(r'[A-Z]', password):
        return False, "密码需要包含大写字母"
    if not re.search(r'[a-z]', password):
        return False, "密码需要包含小写字母"
    if not re.search(r'\d', password):
        return False, "密码需要包含数字"
    return True, "密码有效"


# JWT 黑名单检查
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    return jwt_payload['jti'] in blacklist


@app.route('/api/auth/register', methods=['POST'])
def register():
    """用户注册"""
    data = request.get_json()
    
    username = data.get('username', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    
    # 验证
    if not username or not email or not password:
        return jsonify({'error': '所有字段都是必填的'}), 400
    
    if User.query.filter_by(username=username).first():
        return jsonify({'error': '用户名已存在'}), 409
    
    if User.query.filter_by(email=email).first():
        return jsonify({'error': '邮箱已被注册'}), 409
    
    valid, message = validate_password(password)
    if not valid:
        return jsonify({'error': message}), 400
    
    # 创建用户
    user = User(username=username, email=email)
    user.set_password(password)
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({
        'message': '注册成功',
        'user': user.to_dict()
    }), 201


@app.route('/api/auth/login', methods=['POST'])
def login():
    """用户登录"""
    data = request.get_json()
    
    username = data.get('username', '').strip()
    password = data.get('password', '')
    
    user = User.query.filter_by(username=username).first()
    
    if not user or not user.check_password(password):
        return jsonify({'error': '用户名或密码错误'}), 401
    
    if not user.is_active:
        return jsonify({'error': '账户已被禁用'}), 403
    
    # 创建 Token
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    
    return jsonify({
        'message': '登录成功',
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user': user.to_dict()
    })


@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """获取当前用户信息"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': '用户不存在'}), 404
    
    return jsonify({'user': user.to_dict()})


@app.route('/api/auth/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """刷新 Access Token"""
    user_id = get_jwt_identity()
    access_token = create_access_token(identity=user_id)
    
    return jsonify({
        'access_token': access_token
    })


@app.route('/api/auth/logout', methods=['POST'])
@jwt_required()
def logout():
    """用户登出（将 Token 加入黑名单）"""
    jti = get_jwt()['jti']
    blacklist.add(jti)
    
    return jsonify({'message': '登出成功'})


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
```

---

## 📝 学习总结

完成这些练习后，你应该掌握：

1. ✓ 使用 AI 辅助设计 API
2. ✓ 数据库模型设计
3. ✓ 用户认证实现
4. ✓ 错误处理和验证

**关键提示词技巧:**
- 明确技术栈（Flask/Django/FastAPI）
- 详细描述数据模型
- 列出所有功能端点
- 强调安全和验证要求

**下一步**: 尝试 [算法实现案例 →](../04-algorithms/)
