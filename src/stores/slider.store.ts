import { cloneDeep } from 'lodash'
import { KeyboardEvent, MutableRefObject } from 'react'
import { ComponentName, Key, SliderMode, SliderOrientation } from '../definitions/enums'
import { OptionalID, SliderPercentual, SliderValue } from '../definitions/types'
import ComponentRefStore from '../modules/component.ref.store'
import Logger from '../modules/logger'
import NumberUtils from '../utils/number.utils'

class SliderStore extends ComponentRefStore {
  maximum: number
  minimum: number
  mode: SliderMode
  orientation: SliderOrientation
  percentual: SliderPercentual
  step: number
  stepDecimals: number
  thumbMovable: boolean
  value: SliderValue

  constructor(
    ref: MutableRefObject<HTMLDivElement>,
    update: () => void,
    id: OptionalID,
    maximum: number,
    minimum: number,
    mode: SliderMode = SliderMode.SINGLE_THUMB,
    onChangeValue: (value: SliderValue) => void,
    orientation: SliderOrientation = SliderOrientation.HORIZONTAL,
    step: number = 1,
    value: SliderValue
  ) {
    super(ComponentName.SLIDER, ref, update, id)

    this.maximum = maximum
    this.minimum = minimum
    this.mode = mode
    this.onChangeValue = onChangeValue
    this.orientation = orientation
    this.percentual = [0, 0]
    this.step = 0
    this.stepDecimals = 0
    this.thumbMovable = false
    this.value = cloneDeep(value)

    this.setStepSize(step)
  }

  handleKeyboardInteractions = (event: KeyboardEvent<HTMLDivElement>, index: number): void => {
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
        this.setPercentualByValue(this.value[index] - this.step, index)
        this.updateValueByPercentual(this.percentual[index], index)

        break
      case Key.ARROW_RIGHT:
      case Key.ARROW_UP:
        this.setPercentualByValue(this.value[index] + this.step, index)
        this.updateValueByPercentual(this.percentual[index], index)

        break
      case Key.PAGE_DOWN:
        this.setPercentualByValue(this.value[index] - this.step * 10, index)
        this.updateValueByPercentual(this.percentual[index], index)

        break
      case Key.PAGE_UP:
        this.setPercentualByValue(this.value[index] + this.step * 10, index)
        this.updateValueByPercentual(this.percentual[index], index)

        break
      case Key.HOME:
        this.setPercentualByValue(this.minimum, index)
        this.updateValueByPercentual(this.percentual[index], index)

        break
      case Key.END:
        this.setPercentualByValue(this.maximum, index)
        this.updateValueByPercentual(this.percentual[index], index)

        break
    }
  }

  onMouseDown = (index: number): void => {
    this.thumbMovable = true
    Logger.debug(this.id, 'onMouseDown', `The thumb has been unlocked.`)

    this.onMouseMoveListener = (event: MouseEvent) => this.onMouseMove(event, index)
    this.onMouseUpListener = () => this.onMouseUp(index)

    Logger.debug(this.id, 'onMouseDown', `The mousemove and mouseup listeners has been set.`)

    document.addEventListener('mousemove', this.onMouseMoveListener)
    document.addEventListener('mouseup', this.onMouseUpListener)

    Logger.debug(this.id, 'onMouseDown', `The mousemove and mouseup listeners have been registered.`)
  }

  onMouseMove = (event: MouseEvent, index: number): void => {
    if (this.thumbMovable === false) {
      Logger.debug(this.id, 'onMouseMove', `The thumb is not movable.`)
      return
    }

    this.setPercentualByCoordinates(event.clientX, event.clientY, index)
    this.updateValueByPercentual(this.percentual[index], index)
  }

  onMouseUp = (index: number): void => {
    Logger.debug(this.id, 'onMouseUp', `The percentual has been set to ${this.percentual[index]}%.`)

    this.thumbMovable = false
    Logger.debug(this.id, 'onMouseUp', `The thumb has been locked.`)

    document.removeEventListener('mousemove', this.onMouseMoveListener)
    document.removeEventListener('mouseup', this.onMouseUpListener)

    Logger.debug(this.id, 'onMouseUp', `THe mousemove and mouseup listeners have been removed.`)
  }

  onChangeValue(value: SliderValue): void {}
  onMouseMoveListener(event: MouseEvent): void {}
  onMouseUpListener(event: MouseEvent): void {}

  setPercentualByValue(value: number, index: number): void {
    let percentual: number

    percentual = NumberUtils.toFixedNumber((value / this.maximum) * 100, this.stepDecimals)
    if (!NumberUtils.isMultipleOf(percentual, this.step, this.stepDecimals)) return

    this.setPercentual(percentual, index)
  }

  setPercentualByCoordinates(x: number, y: number, index: number, round: boolean = false): void {
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
      percentual = NumberUtils.toFixedNumber(
        Math[percentual > this.percentual[index] ? 'floor' : 'ceil'](percentual / this.step) * this.step,
        this.stepDecimals
      )
      Logger.debug(this.id, 'setPercentual', `The percentual has been rounded to ${percentual}%.`)
    }

    this.setPercentual(percentual, index)
  }

  setPercentual(percentual: number, index: number): void {
    this.percentual[index] = percentual
    Logger.debug(this.id, 'setPercentual', `The percentual with index ${index} has been set to ${this.percentual[index]}%.`)

    this.update()
  }

  setStepSize(step: number): void {
    this.step = step
    this.stepDecimals = (step.toString().match(/\..+/) || [''])[0].slice(1).length
  }

  updateValueByPercentual(percentual: number, index: number): void {
    let value: number

    value = NumberUtils.toFixedNumber(NumberUtils.limit((this.maximum / 100) * percentual, this.minimum, this.maximum), this.stepDecimals)
    if (!NumberUtils.isMultipleOf(value, this.step, this.stepDecimals)) return

    this.value[index] = value
    Logger.debug(this.id, 'updateValueByPercentual', `The value with index ${index} has been set to ${this.value[index]}.`)

    this.onChangeValue(cloneDeep(this.value))
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

  get isModeSingleThumb(): boolean {
    return this.mode === SliderMode.SINGLE_THUMB
  }
}

export default SliderStore
