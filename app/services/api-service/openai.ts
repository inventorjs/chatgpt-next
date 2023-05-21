import { ApiService, Service, Api, ResponseInterceptor, Response } from '@inventorjs/api-service';
import sseAdapter from '@inventorjs/axios-sse-adapter';

class ResInteceptor extends ResponseInterceptor {
  async onFulfilled(response: Response<unknown, unknown>): Promise<Response<unknown, unknown>> {
    return response
  }

  async onRejected(error: unknown): Promise<unknown> {
    return
  }
}

@Service({
  baseURL: 'https://api.openai.com',
  method: 'post',
  $ext: {
    responseInterceptors: [ResInteceptor]
  },
})
export class OpenAI extends ApiService {
  @Api({ url: '/v1/chat/completions', adapter: sseAdapter })
  static createChatCompletion<R>(data, config) {
    return this.apiCall<R>(data, config)
  }

  @Api({ url: '/v1/images/generations' })
  static createImage(data, config) {
    return this.apiCall(data, config)
  }
}
