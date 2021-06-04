import { KeyboardEvent, MutableRefObject } from 'react'
import { ComponentName, Key } from '../definitions/enums'
import { ID } from '../definitions/types'
import ComponentRefStore from '../modules/component.ref.store'
import Logger from '../modules/logger'
import NumberUtils from '../utils/number.utils'

class SliderStore extends ComponentRefStore {
  percentual: number
  stepSize: number
  stepSizeDecimals: number
  thumbMovable: boolean
  thumbRef: MutableRefObject<HTMLDivElement>

  constructor(ref: MutableRefObject<HTMLDivElement>, update: () => void, stepSize: number = 1, id?: ID) {
    super(ComponentName.SLIDER, ref, update, id)

    this.percentual = 0
    this.stepSize = 0
    this.stepSizeDecimals = 0
    this.thumbMovable = false
    this.thumbRef = { current: document.createElement('div') }

    this.setStepSize(stepSize)
  }

  handleKeyboardInteractions(
    event: KeyboardEvent<HTMLDivElement>,
    minimum: number,
    maximum: number,
    value: number,
    onChangeValue: (value: number) => any
  ): void {
    switch (event.key) {
      case Key.ARROW_LEFT:
      case Key.ARROW_DOWN:
      case Key.ARROW_RIGHT:
      case Key.ARROW_UP:
      case Key.PAGE_DOWN:
      case Key.PAGE_UP:
      case Key.HOME:
      case Key.END:
        event.preventDefault()
        Logger.debug(this.id, 'handleKeyboardInteractions', `The default event has been prevented.`)

        break
    }

    switch (event.key) {
      case Key.ARROW_LEFT:
      case Key.ARROW_DOWN:
        this.setPercentual(maximum, value - this.stepSize)
        this.setValue(minimum, maximum, onChangeValue)

        break
      case Key.ARROW_RIGHT:
      case Key.ARROW_UP:
        this.setPercentual(maximum, value + this.stepSize)
        this.setValue(minimum, maximum, onChangeValue)

        break
      case Key.PAGE_DOWN:
        this.setPercentual(maximum, value - this.stepSize * 10)
        this.setValue(minimum, maximum, onChangeValue)

        break
      case Key.PAGE_UP:
        this.setPercentual(maximum, value + this.stepSize * 10)
        this.setValue(minimum, maximum, onChangeValue)

        break
      case Key.HOME:
        this.setPercentual(maximum, minimum)
        this.setValue(minimum, maximum, onChangeValue)

        break
      case Key.END:
        this.setPercentual(maximum, maximum)
        this.setValue(minimum, maximum, onChangeValue)

        break
    }
  }

  onMouseDown = (minimum: number, maximum: number, onChangeValue: (value: number) => any): void => {
    this.thumbMovable = true
    Logger.debug(this.id, 'onMouseDown', `The thumb has been unlocked.`)

    document.removeEventListener('mousemove', this.onMouseMoveListener)
    document.removeEventListener('mouseup', this.onMouseUp)

    this.onMouseMoveListener = (event: MouseEvent) => this.onMouseMove(event, minimum, maximum, onChangeValue)
    Logger.debug(this.id, 'onMouseDown', `The onMouseMove listener has been set.`)

    document.addEventListener('mousemove', this.onMouseMoveListener)
    document.addEventListener('mouseup', this.onMouseUp)

    Logger.debug(this.id, 'onMouseDown', `The mousemove and mouseup listeners have been registered.`)
  }

  onMouseMove = (event: MouseEvent, minimum: number, maximum: number, onChangeValue: (value: number) => any): void => {
    if (this.thumbMovable === false) {
      Logger.debug(this.id, 'onMouseMove', `The thumb is not movable.`)
      return
    }

    this.setPercentualByX(event.clientX)
    this.setValue(minimum, maximum, onChangeValue)
  }

  onMouseUp = (): void => {
    Logger.debug(this.id, 'onMouseUp', `The percentual has been set to ${this.percentual}%.`)

    this.thumbMovable = false
    Logger.debug(this.id, 'onMouseUp', `The thumb has been locked.`)

    document.removeEventListener('mousemove', this.onMouseMoveListener)
    document.removeEventListener('mouseup', this.onMouseUp)

    Logger.debug(this.id, 'onMouseUp', `THe mousemove and mouseup listeners have been removed.`)
  }

  onMouseMoveListener(event: MouseEvent): void {}

  setPercentual(maximum: number, value: number): void {
    let percentual: number

    percentual = NumberUtils.toFixedNumber((value / maximum) * 100, this.stepSizeDecimals)
    if (NumberUtils.isMultipleOf(percentual, this.stepSize, this.stepSizeDecimals)) return

    this.percentual = percentual
    Logger.debug(this.id, 'setPercentual', `The percentual has been set to ${this.percentual}.`)

    this.update()
  }

  setPercentualByX(x: number, round: boolean = false): void {
    let percentual: number

    percentual = NumberUtils.toFixedNumber(NumberUtils.limit(((x - this.elementOffsetLeft) / this.elementWidth) * 100, 0, 100), this.stepSizeDecimals)
    if (NumberUtils.isMultipleOf(percentual, this.stepSize, this.stepSizeDecimals) && !round) return

    if (round) {
      percentual = NumberUtils.toFixedNumber(
        Math[percentual > this.percentual ? 'floor' : 'ceil'](percentual / this.stepSize) * this.stepSize,
        this.stepSizeDecimals
      )
      Logger.debug(this.id, 'setPercentual', `The percentual has been rounded to ${percentual}%.`)
    }

    this.percentual = percentual
    this.update()
  }

  setValue(minimum: number, maximum: number, onChangeValue: (value: number) => any): void {
    let value: number

    value = NumberUtils.toFixedNumber(NumberUtils.limit((maximum / 100) * this.percentual, minimum, maximum), this.stepSizeDecimals)
    if (NumberUtils.isMultipleOf(value, this.stepSize, this.stepSizeDecimals)) return

    onChangeValue(value)
  }

  setStepSize(stepSize: number): void {
    this.stepSize = stepSize
    this.stepSizeDecimals = (stepSize.toString().match(/\..+/) || [''])[0].slice(1).length
  }

  setThumbRef = (ref: MutableRefObject<HTMLDivElement>): void => {
    this.thumbRef = ref
    Logger.debug(this.id, 'setThumbRef', `The ref of the thumb element has been set.`)
  }

  get elementOffsetLeft(): number {
    return this.element.getBoundingClientRect().left
  }

  get elementWidth(): number {
    return parseFloat(getComputedStyle(this.element).width)
  }
}

export default SliderStore
