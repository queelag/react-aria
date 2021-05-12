import { LoggerLevel } from '../definitions/enums'

class Logger {
  static level: LoggerLevel = LoggerLevel.DEBUG

  static debug(...args: any[]): void {
    this.level <= LoggerLevel.DEBUG && console.debug(this.format(args))
  }

  static info(...args: any[]): void {
    this.level <= LoggerLevel.INFO && console.info(this.format(args))
  }

  static warn(...args: any[]): void {
    this.level <= LoggerLevel.WARN && console.warn(this.format(args))
  }

  static error(...args: any[]): void {
    this.level <= LoggerLevel.ERROR && console.error(this.format(args))
  }

  private static format(args: any[] = []): string {
    return args.filter((v: any) => ['boolean', 'number', 'string'].includes(typeof v)).join(' -> ')
  }
}

export default Logger
