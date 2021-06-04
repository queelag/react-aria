import { KeyboardEvent, MutableRefObject } from 'react'
import { ComponentName, Key, SliderOrientation } from '../definitions/enums'
import { ID } from '../definitions/types'
import ComponentRefStore from '../modules/component.ref.store'
import Logger from '../modules/logger'
import NumberUtils from '../utils/number.utils'

class SliderStore extends ComponentRefStore {
  orientation: SliderOrientation
  percentual: number
  step: number
  stepDecimals: number
  thumbMovable: boolean
  thumbRef: MutableRefObject<HTMLDivElement>

  constructor(
    ref: MutableRefObject<HTMLDivElement>,
    update: () => void,
    id?: ID,
    orientation: SliderOrientation = SliderOrientation.HORIZONTAL,
    step: number = 1
  ) {
    super(ComponentName.SLIDER, ref, update, id)

    this.orientation = orientation
    this.percentual = 0
    this.step = 0
    this.stepDecimals = 0
    this.thumbMovable = false
    this.thumbRef = { current: document.createElement('div') }

    this.setStepSize(step)
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
        this.setPercentual(maximum, value - this.step)
        this.setValue(minimum, maximum, onChangeValue)

        break
      case Key.ARROW_RIGHT:
      case Key.ARROW_UP:
        this.setPercentual(maximum, value + this.step)
        this.setValue(minimum, maximum, onChangeValue)

        break
      case Key.PAGE_DOWN:
        this.setPercentual(maximum, value - this.step * 10)
        this.setValue(minimum, maximum, onChangeValue)

        break
      case Key.PAGE_UP:
        this.setPercentual(maximum, value + this.step * 10)
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

    this.setPercentualByCoordinates(event.clientX, event.clientY)
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

    percentual = NumberUtils.toFixedNumber((value / maximum) * 100, this.stepDecimals)
    if (!NumberUtils.isMultipleOf(percentual, this.step, this.stepDecimals)) return

    this.percentual = percentual
    Logger.debug(this.id, 'setPercentual', `The percentual has been set to ${this.percentual}.`)

    this.update()
  }

  setPercentualByCoordinates(x: number, y: number, round: boolean = false): void {
    let percentual: number

    switch (this.orientation) {
      case SliderOrientation.HORIZONTAL:
        percentual = NumberUtils.toFixedNumber(NumberUtils.limit(((x - this.elementOffsetLeft) / this.elementWidth) * 100, 0, 100), this.stepDecimals)
        break
      case SliderOrientation.VERTICAL:
        percentual = NumberUtils.toFixedNumber(NumberUtils.limit(((this.elementOffsetBottom - y) / this.elementHeight) * 100, 0, 100), this.stepDecimals)
        break
    }
    if (!NumberUtils.isMultipleOf(percentual, this.step, this.stepDecimals) && !round) return

    if (round) {
      percentual = NumberUtils.toFixedNumber(Math[percentual > this.percentual ? 'floor' : 'ceil'](percentual / this.step) * this.step, this.stepDecimals)
      Logger.debug(this.id, 'setPercentual', `The percentual has been rounded to ${percentual}%.`)
    }

    this.percentual = percentual
    this.update()
  }

  setValue(minimum: number, maximum: number, onChangeValue: (value: number) => any): void {
    let value: number

    value = NumberUtils.toFixedNumber(NumberUtils.limit((maximum / 100) * this.percentual, minimum, maximum), this.stepDecimals)
    if (!NumberUtils.isMultipleOf(value, this.step, this.stepDecimals)) return

    onChangeValue(value)
  }

  setStepSize(step: number): void {
    this.step = step
    this.stepDecimals = (step.toString().match(/\..+/) || [''])[0].slice(1).length
  }

  setThumbRef = (ref: MutableRefObject<HTMLDivElement>): void => {
    this.thumbRef = ref
    Logger.debug(this.id, 'setThumbRef', `The ref of the thumb element has been set.`)
  }

  get elementOffsetBottom(): number {
    return this.element.getBoundingClientRect().bottom
  }

  get elementOffsetLeft(): number {
    return this.element.getBoundingClientRect().left
  }

  get elementOffsetTop(): number {
    return this.element.getBoundingClientRect().top
  }

  get elementHeight(): number {
    return parseFloat(getComputedStyle(this.element).height)
  }

  get elementWidth(): number {
    return parseFloat(getComputedStyle(this.element).width)
  }
}

export default SliderStore
