/**
 * HTTP 状态码相关常量
 */

/**
 * 成功状态码
 */
export const HTTP_STATUS_SUCCESS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
} as const

/**
 * 客户端错误状态码
 */
export const HTTP_STATUS_CLIENT_ERROR = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
} as const

/**
 * 服务器错误状态码
 */
export const HTTP_STATUS_SERVER_ERROR = {
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const

/**
 * 所有 HTTP 状态码
 */
export const HTTP_STATUS = {
  ...HTTP_STATUS_SUCCESS,
  ...HTTP_STATUS_CLIENT_ERROR,
  ...HTTP_STATUS_SERVER_ERROR,
} as const

/**
 * 状态码错误消息映射（国际化键）
 */
export const HTTP_STATUS_MESSAGES: Record<number, string> = {
  400: 'errors.badRequest',
  401: 'errors.unauthorized',
  403: 'errors.forbidden',
  404: 'errors.notFound',
  405: 'errors.methodNotAllowed',
  409: 'errors.conflict',
  422: 'errors.unprocessableEntity',
  429: 'errors.tooManyRequests',
  500: 'errors.internalServerError',
  502: 'errors.badGateway',
  503: 'errors.serviceUnavailable',
  504: 'errors.gatewayTimeout',
}
