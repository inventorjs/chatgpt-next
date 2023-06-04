/**
 * 存储服务
 */
import type { SessionItem } from '@/src/types'

const CONFIG_KEY = 'inventorjs/chatgpt-config'
const SESSION_KEY = 'inventorjs/chatgpt-session'

export class Storage {
  static safeJsonParse(jsonStr: string) {
    try {
      return JSON.parse(jsonStr)
    } catch (err) {
      return null
    }
  }

  static async getConfig(): Promise<Record<string, unknown>> {
    let data = this.safeJsonParse(await localStorage.getItem(CONFIG_KEY))
    return data
  }

  static async saveConfig(config: Record<string, unknown>) {
    const configData = JSON.stringify(config) 
    localStorage.setItem(CONFIG_KEY, configData)
  }

  static async getSessionList(): Promise<SessionItem[]> {
    let sessionList = this.safeJsonParse(await localStorage.getItem(SESSION_KEY))
    return sessionList
  }

  static async saveSessionList(sessionList: SessionItem[]) {
    const sessionData = JSON.stringify(sessionList)
    localStorage.setItem(SESSION_KEY, sessionData)
  }
}
