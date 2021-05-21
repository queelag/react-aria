import { LoggerLevel } from '../../src/definitions/enums'
import Logger from '../../src/modules/logger'

describe('Logger', () => {
  beforeEach(() => {
    console.debug = jest.fn()
    console.info = jest.fn()
    console.warn = jest.fn()
    console.error = jest.fn()
  })

  it('formats any argument correctly', () => {
    expect(Logger['format']()).toBe('')
    expect(Logger['format']([false, 0, 'string'])).toBe('false -> 0 -> string')
  })

  it('logs everything when level is set to debug', () => {
    Logger.level = LoggerLevel.DEBUG

    Logger.debug()
    Logger.info()
    Logger.warn()
    Logger.error()

    expect(console.debug).toHaveBeenCalled()
    expect(console.info).toHaveBeenCalled()
    expect(console.warn).toHaveBeenCalled()
    expect(console.error).toHaveBeenCalled()
  })

  it('logs everything expect debug when level is set to info', () => {
    Logger.level = LoggerLevel.INFO

    Logger.debug()
    Logger.info()
    Logger.warn()
    Logger.error()

    expect(console.debug).not.toHaveBeenCalled()
    expect(console.info).toHaveBeenCalled()
    expect(console.warn).toHaveBeenCalled()
    expect(console.error).toHaveBeenCalled()
  })

  it('logs everything expect debug and info when level is set to warn', () => {
    Logger.level = LoggerLevel.WARN

    Logger.debug()
    Logger.info()
    Logger.warn()
    Logger.error()

    expect(console.debug).not.toHaveBeenCalled()
    expect(console.info).not.toHaveBeenCalled()
    expect(console.warn).toHaveBeenCalled()
    expect(console.error).toHaveBeenCalled()
  })

  it('logs everything expect debug, info and warn when level is set to error', () => {
    Logger.level = LoggerLevel.ERROR

    Logger.debug()
    Logger.info()
    Logger.warn()
    Logger.error()

    expect(console.debug).not.toHaveBeenCalled()
    expect(console.info).not.toHaveBeenCalled()
    expect(console.warn).not.toHaveBeenCalled()
    expect(console.error).toHaveBeenCalled()
  })
})
