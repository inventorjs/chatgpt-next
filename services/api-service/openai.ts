/**
 * openai api 服务
 */

import { ApiService, Service, Api } from '@inventorjs/api-service';

@Service({
  baseURL: 'https://openai.com',
})
export class OpenaiService extends ApiService {

}
