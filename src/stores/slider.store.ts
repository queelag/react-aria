import { Logger, noop, NumberUtils, ObjectUtils } from '@queelag/core'
import { ComponentProps, ComponentStore } from '@queelag/react-core'
import React from 'react'
import { ComponentName, Key, SliderMode, SliderOrientation } from '../definitions/enums'
import { SliderProps } from '../definitions/props'
import { SliderPercentual, SliderThumbIndex, SliderValue } from '../definitions/types'

class SliderStore extends ComponentStore<HTMLDivElement> {
  maximum: number
  minimum: number
  mode: SliderMode
  orientation: SliderOrientation
  percentual: SliderPercentual
  step: number
  stepDecimals: number
  thumbMovable: boolean
  value: SliderValue

  constructor(props: SliderProps & ComponentProps<HTMLDivElement>) {
    super(ComponentName.SLIDER, props)

    this.maximum = props.maximum
    this.minimum = props.minimum
    this.mode = props.mode || SliderMode.SINGLE_THUMB
    this.onChangeValue = props.onChangeValue || noop
    this.orientation = props.orientation || SliderOrientation.HORIZONTAL
    this.percentual = [0, 0]
    this.step = 0
    this.stepDecimals = 0
    this.thumbMovable = false
    this.value = JSON.parse(JSON.stringify(props.value))

    this.setStepSize(props.step || 1)
  }

  onChangeValue(value: SliderValue): void {}

  handleKeyboardInteractions = (index: SliderThumbIndex, event: React.KeyboardEvent): void => {
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
        this.setValue(index, this.value[index] - this.step)
        break
      case Key.ARROW_RIGHT:
      case Key.ARROW_UP:
        this.setValue(index, this.value[index] + this.step)
        break
      case Key.PAGE_DOWN:
        this.setValue(index, this.value[index] - this.step * 10)
        break
      case Key.PAGE_UP:
        this.setValue(index, this.value[index] + this.step * 10)
        break
      case Key.HOME:
        this.setValue(index, this.minimum)
        break
      case Key.END:
        this.setValue(index, this.maximum)
        break
    }
  }

  onThumbMouseDown = (index: SliderThumbIndex): void => {
    this.thumbMovable = true
    Logger.debug(this.id, 'handleMouseInteractions', `The thumb has been unlocked.`)

    this.onThumbMouseMoveListener = (event: MouseEvent) => this.onThumbMouseMove(index, event)
    this.onThumbMouseUpListener = () => this.onThumbMouseUp(index)

    Logger.debug(this.id, 'handleMouseInteractions', `The mousemove and mouseup listeners has been set.`)

    document.addEventListener('mousemove', this.onThumbMouseMoveListener)
    document.addEventListener('mouseup', this.onThumbMouseUpListener)

    Logger.debug(this.id, 'handleMouseInteractions', `The mousemove and mouseup listeners have been registered.`)
  }

  onThumbMouseMove(index: SliderThumbIndex, event: MouseEvent): void {
    this.onThumbMouseOrTouchMove(index, event.clientX, event.clientY)
  }

  onThumbMouseUp(index: SliderThumbIndex): void {
    this.onThumbMouseUpOrTouchEnd(index)
  }

  onThumbMouseMoveListener(event: MouseEvent): void {}
  onThumbMouseUpListener(event: MouseEvent): void {}

  onThumbTouchStart = (): void => {
    this.thumbMovable = true
    Logger.debug(this.id, 'handleTouchInteractions', `The thumb has been unlocked.`)
  }

  onThumbTouchMove = (index: SliderThumbIndex, event: React.TouchEvent): void => {
    this.onThumbMouseOrTouchMove(index, event.touches[0].clientX, event.touches[0].clientY)
  }

  onThumbTouchEnd = (index: SliderThumbIndex): void => {
    this.onThumbMouseUpOrTouchEnd(index)
  }

  onThumbTouchMoveListener(event: TouchEvent): void {}
  onThumbTouchEndListener(event: TouchEvent): void {}

  onThumbMouseOrTouchMove(index: SliderThumbIndex, x: number, y: number): void {
    if (this.thumbMovable === false) {
      Logger.debug(this.id, 'onMouseOrTouchMove', `The thumb is not movable.`)
      return
    }

    this.setValueByCoordinates(index, x, y)
  }

  onThumbMouseUpOrTouchEnd(index: SliderThumbIndex): void {
    Logger.debug(this.id, 'onMouseUpOrTouchEnd', `The percentual with index ${index} has been set to ${this.percentual[index]}%.`)
    Logger.debug(this.id, 'onMouseUpOrTouchEnd', `The value with index ${index} has been set to ${this.value[index]}.`)

    this.thumbMovable = false
    Logger.debug(this.id, 'onMouseUpOrTouchEnd', `The thumb has been locked.`)

    document.removeEventListener('mousemove', this.onThumbMouseMoveListener)
    document.removeEventListener('mouseup', this.onThumbMouseUpListener)
    document.removeEventListener('touchmove', this.onThumbTouchMoveListener)
    document.removeEventListener('touchend', this.onThumbTouchEndListener)

    Logger.debug(this.id, 'onMouseUpOrTouchEnd', `THe mousemove, mouseup, touchmove and touchend listeners have been removed.`)
  }

  setPercentualByValue(index: SliderThumbIndex, value: number): void {
    let percentual: number

    percentual = NumberUtils.limit(NumberUtils.toFixed(((value - this.minimum) * 100) / (this.maximum - this.minimum), this.stepDecimals), 0, 100)
    if (!NumberUtils.isMultipleOf(percentual, this.step, this.stepDecimals)) return

    this.setPercentual(index, percentual)
  }

  setPercentual(index: SliderThumbIndex, percentual: number): void {
    this.percentual[index] = percentual
    // Logger.debug(this.id, 'setPercentual', `The percentual with index ${index} has been set to ${this.percentual[index]}%.`)

    this.update()
  }

  setStepSize(step: number): void {
    this.step = step
    this.stepDecimals = (step.toString().match(/\..+/) || [''])[0].slice(1).length
  }

  setValueByCoordinates(index: SliderThumbIndex, x: number, y: number, round: boolean = false): void {
    let percentual: number

    percentual = this.findPercentualByCoordinates(index, x, y, round)
    if (percentual < 0) return

    this.setValueByPercentual(index, percentual)
  }

  setValueByPercentual(index: SliderThumbIndex, percentual: number): void {
    let value: number

    value = NumberUtils.limit(
      NumberUtils.toFixed(((this.maximum - this.minimum) * percentual) / 100 + this.minimum, this.stepDecimals),
      this.minimum,
      this.maximum
    )
    if (!NumberUtils.isMultipleOf(value, this.step, this.stepDecimals)) return

    this.setValue(index, value)
  }

  setValue(index: SliderThumbIndex, value: number): void {
    this.value[index] = value
    // Logger.debug(this.id, 'setValueByCoordinates', `The value with index ${index} has been set to ${this.value[index]}.`)

    switch (this.mode) {
      case SliderMode.DUAL_THUMB:
        this.onChangeValue === noop ? this.setPercentualByValue(index, value) : this.onChangeValue(ObjectUtils.clone(this.value).sort())
        break
      case SliderMode.SINGLE_THUMB:
        this.onChangeValue === noop ? this.setPercentualByValue(index, value) : this.onChangeValue(JSON.parse(JSON.stringify(this.value)))
        break
    }
  }

  findPercentualByCoordinates(index: SliderThumbIndex, x: number, y: number, round: boolean = false): number {
    let percentual: number

    switch (this.orientation) {
      case SliderOrientation.HORIZONTAL:
        percentual = ((x - this.elementOffsetLeft) / this.elementWidth) * 100
        break
      case SliderOrientation.VERTICAL:
        percentual = ((this.elementOffsetBottom - y) / this.elementHeight) * 100
        break
    }

    percentual = NumberUtils.limit(NumberUtils.toFixed(percentual, this.stepDecimals), 0, 100)
    if (!NumberUtils.isMultipleOf(percentual, this.step, this.stepDecimals) && !round) return -1

    if (round) {
      percentual = NumberUtils.limit(
        NumberUtils.toFixed(Math[percentual > this.percentual[index] ? 'floor' : 'ceil'](percentual / this.step) * this.step, this.stepDecimals),
        0,
        100
      )
      Logger.debug(this.id, 'setPercentual', `The percentual has been rounded to ${percentual}%.`)
    }

    return percentual
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
