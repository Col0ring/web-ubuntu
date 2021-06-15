// global module
import { Canceler } from 'axios'

interface CanceledRequest {
  url?: string
  cancel: Canceler
}

declare global {
  interface Window {
    axiosPromiseArr?: CanceledRequest[]
  }
}
