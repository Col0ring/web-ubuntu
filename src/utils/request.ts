import axios from 'axios'
import useAuthContext from '@/hooks/useAuthContext'
import message from '@/components/message'

const baseURL = '/mock'
// retry refactor
const service = axios.create({
  timeout: 26000,
  baseURL,
})

function retry(err: any) {
  const { config } = err
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
      content: msg,
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
      const requestConfig = { ...config }
      if (window.axiosPromiseArr && Array.isArray(window.axiosPromiseArr)) {
        const index = window.axiosPromiseArr.findIndex(
          (item) => item.url === requestConfig.url
        )
        const canceledRequest = window.axiosPromiseArr[index]
        if (canceledRequest) {
          canceledRequest.cancel()
          window.axiosPromiseArr.splice(index, 1)
        }
      }

      requestConfig.cancelToken = new axios.CancelToken((cancel) => {
        window.axiosPromiseArr = window.axiosPromiseArr || []
        window.axiosPromiseArr.push({ url: requestConfig.url, cancel })
      })
      requestConfig.headers.token = authState.token
      if (typeof requestConfig.headers.retryCount === 'number') {
        requestConfig.headers.retryCount++
      } else {
        requestConfig.headers.retryCount = 0
      }
      return requestConfig
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
      const { response } = error
      const { status, data } = response
      if (status === 400) {
        message.error({
          content: data.message,
        })
        return Promise.reject(error)
      } else if (status === 401) {
        // 失败就 remove token
        authMethods.logout()
        message.error({
          content: data.message,
        })
        return Promise.reject(error)
      }

      if (error.message.includes('timeout')) {
        // eslint-disable-next-line no-param-reassign
        error.message = '请求超时'
      }
      errorHandler(error.config.headers.retryCount, error.message)

      return retry(error)
    }
  )
}

export default service
