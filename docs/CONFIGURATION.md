# 配置管理系统

ShortLinker Frontend 使用统一的配置管理系统，支持从多个来源获取配置。

## 配置来源优先级

### 开发模式 (`yarn dev`)

1. **环境变量** (`import.meta.env.VITE_*`) - 最高优先级
2. **运行时注入配置** (`window.__APP_CONFIG__`)
3. **默认值**

### 生产模式

1. **运行时注入配置** (`window.__APP_CONFIG__`)
2. **默认值**

## 可用配置项

| 配置项 | 环境变量名 | 默认值 | 说明 |
|--------|-----------|--------|------|
| `basePath` | `VITE_BASE_URL` | `/` | 应用基础路径（用于路由） |
| `adminRoutePrefix` | `VITE_ADMIN_ROUTE_PREFIX` | `/admin` | 管理后台路由前缀 |
| `healthRoutePrefix` | `VITE_HEALTH_ROUTE_PREFIX` | `/health` | 健康检查路由前缀 |
| `apiBaseUrl` | `VITE_API_BASE_URL` | 空字符串 | API 基础 URL |
| `shortlinkerVersion` | `VITE_VERSION` | `unknown` | 应用版本号 |

## 使用方法

### 1. 在代码中使用配置

```typescript
import { config } from '@/config'

// 获取配置值
const basePath = config.basePath
const apiBaseUrl = config.apiBaseUrl || window.location.origin
const version = config.shortlinkerVersion
```

### 2. 开发模式配置

复制 `.env.example` 到 `.env` 并根据需要修改：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```bash
# .env
VITE_BASE_URL=/
VITE_API_BASE_URL=http://localhost:8080
VITE_VERSION=dev-local
```

### 3. 生产模式配置

生产模式下，配置通过 `index.html` 中的 `window.__APP_CONFIG__` 注入：

```html
<script>
  window.__APP_CONFIG__ = {
    basePath: '/admin',
    adminRoutePrefix: '/admin',
    healthRoutePrefix: '/health',
    shortlinkerVersion: 'v1.0.0'
  };
</script>
```

后端可以在构建时或运行时替换这些占位符。

## 配置加载日志

在开发模式下，配置系统会在浏览器控制台输出详细的加载日志：

```
[Config] Using basePath from env: /
[Config] Using apiBaseUrl from env: http://localhost:8080
[Config] Using shortlinkerVersion from default: unknown
[Config] Application configuration loaded: { ... }
```

这有助于调试配置问题。

## 最佳实践

1. **开发环境**: 使用 `.env` 文件配置本地开发参数
2. **生产环境**: 依赖运行时注入配置，不要在 `.env` 文件中硬编码生产配置
3. **API Base URL**:
   - 开发模式: 在 `.env` 中设置 `VITE_API_BASE_URL=http://localhost:8080`
   - 生产模式: 留空或由后端注入，自动使用当前域名

## 示例

### 开发模式示例

```bash
# .env
VITE_BASE_URL=/
VITE_API_BASE_URL=http://localhost:8080
VITE_ADMIN_ROUTE_PREFIX=/admin
VITE_HEALTH_ROUTE_PREFIX=/health
VITE_VERSION=dev-local
```

启动开发服务器：

```bash
yarn dev
```

### 生产构建示例

```bash
# 构建
yarn build

# 后端在运行时注入配置
# index.html 中的占位符会被替换为实际值
```

## 注意事项

1. 所有环境变量必须以 `VITE_` 开头才能在前端代码中访问
2. `.env` 文件不应提交到版本控制系统（已在 `.gitignore` 中）
3. 使用 `.env.example` 作为配置模板
4. 生产环境的敏感配置应通过后端注入，不要硬编码在前端代码中
