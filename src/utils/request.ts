import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import useAuthContext from '@/hooks/useAuthContext'
import message from '@/components/message'

const baseURL = '/mock'
// retry refactor
const service = axios.create({
  timeout: 26000,
  baseURL
})

function retry(err: any) {
  const config: AxiosRequestConfig = err.config
  if (config.headers.noRetry) {
    return Promise.reject(err)
  }
  if (config.headers.retryCount <= 3) {
    return service(config)
  }
  return Promise.reject(err)
}

function errorHandler(count: number, msg: string) {
  if (count > 3) {
    message.error({
      content: msg
    })
  }
}
let requestInterceptor: number
let responseInterceptor: number

export function initService([authState, authMethods]: ReturnType<
  typeof useAuthContext
>) {
  service.interceptors.request.eject(requestInterceptor)
  service.interceptors.response.eject(responseInterceptor)

  requestInterceptor = service.interceptors.request.use(
    (config) => {
      if (window.axiosPromiseArr && Array.isArray(window.axiosPromiseArr)) {
        const index = window.axiosPromiseArr.findIndex(
          (item) => item.url === config.url
        )
        const canceledRequest = window.axiosPromiseArr[index]
        if (canceledRequest) {
          canceledRequest.cancel()
          window.axiosPromiseArr.splice(index, 1)
        }
      }

      config.cancelToken = new axios.CancelToken((cancel) => {
        window.axiosPromiseArr = window.axiosPromiseArr || []
        window.axiosPromiseArr.push({ url: config.url, cancel })
      })
      config.headers.token = authState.token
      if (typeof config.headers.retryCount === 'number') {
        config.headers.retryCount++
      } else {
        config.headers.retryCount = 0
      }
      return config
    },
    (error) => {
      errorHandler(error.config.headers.retryCount, error.message)
      return retry(error.config)
    }
  )

  responseInterceptor = service.interceptors.response.use(
    (response) => {
      const { data } = response
      return data
    },
    (error) => {
      if (axios.isCancel(error)) {
        return Promise.reject(error)
      }
      const response: AxiosResponse = error.response
      const { status, data } = response

      if (status === 400) {
        message.error({
          content: data.message
        })
        return Promise.reject(error)
      } else if (status === 401) {
        // 失败就 remove token
        authMethods.logout()
        message.error({
          content: data.message
        })
        return Promise.reject(error)
      }

      if (error.message.includes('timeout')) {
        error.message = '请求超时'
      }
      errorHandler(error.config.headers.retryCount, error.message)

      return retry(error)
    }
  )
}

export default service
