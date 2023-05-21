/**
 * 存储服务
 */
const CONFIG_KEY = 'inventorjs/chatgpt-config'
const SESSION_KEY = 'inventorjs/chatgpt-session'

export class Storage {
  safeJsonParse(jsonStr) {
    try {
      return JSON.parse(jsonStr)
    } catch (err) {
      return null
    }
  }

  async getConfig() {
    let data = this.safeJsonParse(await localStorage.getItem(CONFIG_KEY))
    return data
  }

  async setConfig(config) {
    const configData = JSON.stringify(config) 
    localStorage.setItem(CONFIG_KEY, configData)
  }

  async addSession(sessionItem) {
    let sessionList = await this.getSessionList()
    if (!sessionList) {
      sessionList = []
    }
    sessionList.push(sessionItem)
    return this.saveSessionList(sessionList)
  }

  async deleteSession(sessionId) {
    const sessionList = await this.getSessionList()
    if (sessionList) {
      const index = sessionList.findIndex((item) => item.id === sessionId)
      sessionList.splice(index, 1)
      return this.saveSessionList(sessionList)
    }
  }

  async getSession(sessionId) {
    const sessionList = await this.getSessionList()
    const session = sessionList?.find((item) => item.id === sessionId)
    return session
  }

  async getSessionList() {
    let sessionList = this.safeJsonParse(await localStorage.getItem(SESSION_KEY))
    return sessionList
  }

  async saveSessionList(sessionList) {
    const sessionData = JSON.stringify(sessionList)
    localStorage.setItem(SESSION_KEY, sessionData)
  }
}
