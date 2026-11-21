# 校园招生管理系统

学校学生报名管理系统，包含管理员工作台和学生自主报名入口。

## 在线访问

https://testui-admission.pages.dev/

## 账号入口

- 管理员：首次访问时使用一次性初始化密钥创建管理员账号，之后使用账号密码登录。
- 学生：使用手机号注册学生账号，登录后填写报名资料并查询审核进度。

## 管理端功能

- 招生数据总览、报名趋势与专业计划进度
- 报名记录查询、关键词搜索、状态筛选和分页
- 报名详情、审核通过、退回并填写审核意见
- CSV 名单导出
- 修改管理员密码

## 学生端功能

- 学生账号注册与密码登录
- 自主填写并提交报名资料
- 查询报名状态、审核意见
- 待审核或退回状态下修改资料并重新提交
- 修改学生账号密码

## 技术架构

- 前端：HTML、CSS、原生 JavaScript
- 后端：Cloudflare Pages Functions
- 数据库：Cloudflare D1
- 密码：PBKDF2-SHA256 哈希存储
- 会话：服务端随机令牌哈希 + HttpOnly、Secure、SameSite Cookie
- 部署：Cloudflare Pages 连接 GitHub，main 分支提交后自动发布

## 数据表

```sql
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'student')),
  full_name TEXT NOT NULL,
  phone TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  gender TEXT NOT NULL,
  phone TEXT NOT NULL,
  school TEXT NOT NULL,
  major TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT '学生自主报名',
  status TEXT NOT NULL DEFAULT '待审核' CHECK (status IN ('待审核', '已录取', '已退回')),
  admin_note TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
```

## 重要说明

- 学生报名账号使用手机号作为登录名；当前版本不包含短信验证码或运营商实名校验。
- 本系统保存学生姓名、联系电话、毕业学校和意向专业。正式收集真实学生资料前，请学校确认隐私告知、授权、数据访问范围、备份与保留期限。
- 首次部署需要使用管理员初始化密钥创建第一个管理员。初始化成功后，后端会拒绝再次创建管理员。
- 该系统目前未实现短信验证、身份证件上传、招生录取通知推送和多级组织权限。
