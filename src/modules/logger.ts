import { ID } from '../definitions/types'

class Logger {
  static debug(id: ID, ...messages: string[]): void {
    console.debug(`${id} -> ${messages.join(' ')}`)
  }

  static error(id: ID, ...messages: string[]): void {
    console.error(`${id} -> ${messages.join(' ')}`)
  }
}

export default Logger
