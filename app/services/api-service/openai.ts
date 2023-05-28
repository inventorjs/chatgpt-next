/**
 * openai 服务
 */
import { ApiService, Service, Api, RequestInterceptor, ApiConfigFinal } from '@inventorjs/api-service';
import streamAdapter from '@inventorjs/axios-stream-adapter';

class ReqInteceptor extends RequestInterceptor {
  async onFulfilled<T = unknown>(config: ApiConfigFinal<unknown>): Promise<ApiConfigFinal<unknown>> {
    return config
  }

  async onRejected<T = unknown>(error: T): Promise<T | null | undefined> {
    throw error 
  }
}

@Service({
  baseURL: 'https://api.openai.com',
  method: 'post',
  $ext: {
    requestInterceptors: [ReqInteceptor]
  },
})
export class OpenaiSerivce extends ApiService {
  @Api({ url: '/v1/chat/completions', adapter: streamAdapter })
  static createChatCompletion(data, config) {
    return this.apiCall<ReadableStream>(data, config)
  }

  @Api({ url: '/v1/images/generations' })
  static createImage<R>(data, config) {
    return this.apiCall<R>(data, config)
  }
}
