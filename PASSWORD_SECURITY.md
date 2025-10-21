# 密码保护短链接 - 安全设计方案

## ⚠️ 当前问题

现有实现中，密码以明文形式在 URL 中传递：
```typescript
// ❌ 不安全：密码暴露在 URL 中
const shortUrl = `${baseUrl}/${code}?password=${link.password}`
```

**安全风险：**
- 密码会出现在浏览器历史记录
- 密码会出现在服务器访问日志
- 密码会出现在网络代理日志
- 分享链接时密码直接暴露

---

## ✅ 推荐方案：临时访问令牌 (Recommended)

### 工作流程

#### 1. 用户请求访问受保护的短链接
```
用户访问: https://example.com/abc123
后端检测到该链接有密码保护
返回: 提示用户输入密码的页面
```

#### 2. 用户提交密码
```typescript
// 前端：提交密码到后端验证
POST /api/links/abc123/verify
{
  "password": "user_password"
}
```

#### 3. 后端验证并生成临时令牌
```rust
// 后端验证密码
if password_matches {
  // 生成临时访问令牌（有效期 5 分钟）
  let token = generate_temporary_token(link_code, expiration: 5.minutes);

  // 设置 HttpOnly Cookie
  set_cookie("link_access_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 300 // 5 分钟
  });

  // 返回成功
  return {
    "success": true,
    "redirect_url": "/abc123"
  }
}
```

#### 4. 用户访问短链接
```
用户访问: https://example.com/abc123
请求携带: Cookie: link_access_token=xxx

后端验证 token:
  - 检查 token 是否有效
  - 检查 token 对应的 link_code 是否匹配
  - 检查 token 是否过期

如果验证通过:
  - 重定向到目标 URL
否则:
  - 重新要求输入密码
```

### 实现细节

#### 前端实现

```typescript
// src/services/linkAccessService.ts
export class LinkAccessService {
  /**
   * 验证受保护链接的密码
   * @param code - 短链接代码
   * @param password - 用户输入的密码
   * @returns 验证结果和重定向 URL
   */
  async verifyPassword(code: string, password: string): Promise<{
    success: boolean
    redirect_url?: string
    error?: string
  }> {
    try {
      const response = await publicClient.post(`/links/${code}/verify`, {
        password,
      })

      // 成功后，Cookie 已由后端设置
      return {
        success: true,
        redirect_url: response.redirect_url,
      }
    } catch (error) {
      return {
        success: false,
        error: extractErrorMessage(error, 'Invalid password'),
      }
    }
  }
}

// src/views/LinkAccessView.vue
async function handlePasswordSubmit() {
  const result = await linkAccessService.verifyPassword(
    route.params.code,
    password.value
  )

  if (result.success) {
    // 跳转到短链接（此时带有有效的访问令牌 Cookie）
    window.location.href = result.redirect_url
  } else {
    error.value = result.error
  }
}
```

#### 后端实现要点

```rust
// 1. 临时令牌结构
struct LinkAccessToken {
    link_code: String,
    issued_at: DateTime<Utc>,
    expires_at: DateTime<Utc>,
}

// 2. 验证端点
POST /api/links/:code/verify
  - 验证密码是否正确
  - 生成临时令牌（JWT 或 随机字符串）
  - 设置 HttpOnly Cookie
  - 返回成功响应

// 3. 访问端点
GET /:code
  - 检查链接是否有密码保护
  - 如果有：
    - 检查 Cookie 中的访问令牌
    - 验证令牌是否有效且对应当前链接
    - 如果有效：重定向到目标 URL
    - 如果无效：要求输入密码
  - 如果没有：直接重定向
```

### 安全特性

| 特性 | 说明 |
|------|------|
| ✅ 密码不在 URL 中 | 密码通过 POST 请求提交，不会出现在 URL |
| ✅ HttpOnly Cookie | 令牌存储在 HttpOnly Cookie 中，JavaScript 无法访问 |
| ✅ 短期有效 | 令牌仅在短时间内有效（5 分钟），降低泄露风险 |
| ✅ 链接绑定 | 令牌只对特定短链接有效，不能用于其他链接 |
| ✅ Secure Flag | 仅通过 HTTPS 传输 Cookie |
| ✅ SameSite | 防止 CSRF 攻击 |

---

## 🔄 备选方案：加密的一次性密码令牌

### 工作流程

1. **用户复制链接时**：
```typescript
// 前端生成一次性访问令牌
POST /api/links/abc123/generate-access-token
{
  "password": "user_password"
}

// 后端返回加密的令牌（有效期 24 小时）
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_at": "2024-01-02T12:00:00Z"
}

// 前端生成可分享的链接
const shareableUrl = `${baseUrl}/${code}?token=${access_token}`
```

2. **接收者访问链接时**：
```
访问: https://example.com/abc123?token=eyJhbG...

后端:
  - 验证 token 签名
  - 检查 token 是否过期
  - 检查 token 对应的 link_code 是否匹配
  - 如果通过：重定向到目标 URL
  - 如果失败：要求输入密码
```

### 优缺点

**优点：**
- ✅ 可以生成一次性可分享链接
- ✅ 不需要每次都输入密码

**缺点：**
- ❌ Token 仍然在 URL 中，可能被记录
- ❌ 需要额外的 token 管理逻辑

---

## 📋 实施步骤

### 阶段 1：后端准备（优先）
- [ ] 实现密码验证 API (`POST /links/:code/verify`)
- [ ] 实现临时访问令牌生成
- [ ] 实现访问令牌验证中间件
- [ ] 修改短链接重定向逻辑（检查访问令牌）

### 阶段 2：前端实现
- [ ] 创建 `LinkAccessView.vue`（密码输入页面）
- [ ] 创建 `linkAccessService.ts`
- [ ] 更新短链接复制逻辑（移除密码参数）
- [ ] 添加访问令牌支持

### 阶段 3：移除旧实现
- [ ] 从 `LinksView.vue` 移除密码 URL 参数
- [ ] 更新文档和说明

---

## 🔒 其他安全建议

### 1. 密码强度验证
```typescript
// 使用 validators.ts 中的密码强度验证
import { validatePasswordStrength } from '@/utils/validators'

const strength = validatePasswordStrength(password)
if (!strength.isValid) {
  // 显示密码强度不足的提示
}
```

### 2. 限制密码尝试次数
```rust
// 后端实现频率限制
// 每个 IP 对每个链接最多尝试 5 次密码
// 失败 5 次后锁定 15 分钟
```

### 3. 密码哈希存储
```rust
// 后端永远不要明文存储密码
// 使用 bcrypt 或 argon2 哈希
use bcrypt::{hash, verify, DEFAULT_COST};

let hashed_password = hash(password, DEFAULT_COST)?;
```

### 4. 审计日志
```rust
// 记录所有密码验证尝试
log_security_event(SecurityEvent::PasswordAttempt {
    link_code: code,
    ip: client_ip,
    success: false,
    timestamp: Utc::now(),
});
```

---

## 📚 参考资料

- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [RFC 6265 - HTTP State Management Mechanism (Cookies)](https://datatracker.ietf.org/doc/html/rfc6265)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)

---

## ✅ 总结

**当前状态：**
- ❌ 密码以明文形式在 URL 中传递（不安全）

**推荐实现：**
- ✅ 使用临时访问令牌 + HttpOnly Cookie
- ✅ 密码通过 POST 请求验证
- ✅ 令牌短期有效，绑定到特定链接

**后端需要实现的 API：**
1. `POST /api/links/:code/verify` - 验证密码并返回访问令牌
2. `GET /:code` - 修改重定向逻辑，支持访问令牌验证

**前端需要实现的功能：**
1. 密码输入页面（`LinkAccessView.vue`）
2. 密码验证服务（`linkAccessService.ts`）
3. 更新链接复制逻辑

---

**实现优先级：高**
**影响范围：安全性**
**预计工作量：后端 4-6 小时，前端 2-3 小时**
