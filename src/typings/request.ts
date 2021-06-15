export type ApiResponse<T = any> = Promise<{
  message?: string
  status: number
  data: T
}>
