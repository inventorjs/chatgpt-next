/**
 * 存储服务
 */
const CONFIG_KEY = 'inventorjs/chatgpt-config'
const SESSION_KEY = 'inventorjs/chatgpt-session'

export class Storage {
  static safeJsonParse(jsonStr: any) {
    try {
      return JSON.parse(jsonStr)
    } catch (err) {
      return null
    }
  }

  static async getConfig() {
    let data = this.safeJsonParse(await localStorage.getItem(CONFIG_KEY))
    return data
  }

  static async setConfig(config: any) {
    const configData = JSON.stringify(config) 
    localStorage.setItem(CONFIG_KEY, configData)
  }

  static async addSession(sessionItem: any) {
    let sessionList = await this.getSessionList()
    if (!sessionList) {
      sessionList = []
    }
    sessionList.push(sessionItem)
    return this.saveSessionList(sessionList)
  }

  static async deleteSession(sessionId: any) {
    const sessionList = await this.getSessionList()
    if (sessionList) {
      const index = sessionList.findIndex((item: any) => item.id === sessionId)
      sessionList.splice(index, 1)
      return this.saveSessionList(sessionList)
    }
  }

  static async getSession(sessionId: any) {
    const sessionList = await this.getSessionList()
    const session = sessionList?.find((item: any) => item.id === sessionId)
    return session
  }

  static async getSessionList() {
    let sessionList = this.safeJsonParse(await localStorage.getItem(SESSION_KEY))
    return sessionList
  }

  static async saveSessionList(sessionList: any) {
    const sessionData = JSON.stringify(sessionList)
    localStorage.setItem(SESSION_KEY, sessionData)
  }
}
