import { ID } from '../definitions/types'

class Logger {
  static debug(id: ID, message: string): void {
    console.debug(`${id} -> ${message}`)
  }

  static error(id: ID, message: string): void {
    console.error(`${id} -> ${message}`)
  }
}

export default Logger
