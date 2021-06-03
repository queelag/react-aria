import { MutableRefObject } from 'react'
import { ComponentName } from '../definitions/enums'
import { ID } from '../definitions/types'
import ComponentRefStore from '../modules/component.ref.store'
import Logger from '../modules/logger'
import NumberUtils from '../utils/number.utils'

class SliderStore extends ComponentRefStore {
  percentual: number
  stepSize: number
  thumbClientX: number
  thumbMovable: boolean

  constructor(ref: MutableRefObject<HTMLDivElement>, update: () => void, stepSize: number = 1, id?: ID) {
    super(ComponentName.SLIDER, ref, update, id)

    this.percentual = 0
    this.stepSize = stepSize
    this.thumbClientX = 0
    this.thumbMovable = false
  }

  onMouseDown = (minimum: number, maximum: number, onChangeValue: (value: number) => any): void => {
    this.thumbMovable = true
    Logger.debug(this.id, 'onMouseDown', `The thumb has been unlocked.`)

    this.onMouseMoveListener = (event: MouseEvent) => this.onMouseMove(event, minimum, maximum, onChangeValue)
    Logger.debug(this.id, 'onMouseDown', `The onMouseMove listener has been set.`)

    document.addEventListener('mousemove', this.onMouseMoveListener)
    document.addEventListener('mouseup', this.onMouseUp)

    Logger.debug(this.id, 'onMouseDown', `The mousemove and mouseup listeners have been registered.`)
  }

  onMouseMove = (event: MouseEvent, minimum: number, maximum: number, onChangeValue: (value: number) => any): void => {
    if (this.thumbMovable === false || event.clientX === this.thumbClientX) {
      Logger.debug(this.id, 'onMouseMove', `The thumb is not movable.`)
      return
    }

    this.setPercentual(event.pageX, minimum, maximum)
    this.setValue(minimum, maximum, onChangeValue)
  }

  onMouseUp = (): void => {
    this.thumbClientX = 0
    Logger.debug(this.id, 'onMouseUp', `The thumb client x has been set to 0.`)

    this.thumbMovable = false
    Logger.debug(this.id, 'onMoonMouseUpuseEnd', `The thumb has been locked.`)

    document.removeEventListener('mousemove', this.onMouseMoveListener)
    document.removeEventListener('mouseup', this.onMouseUp)
  }

  onMouseMoveListener(event: MouseEvent): void {}

  setPercentual = (pageX: number, minimum: number, maximum: number, round: boolean = false): void => {
    let percentual: number

    percentual = Math.floor(NumberUtils.limit(((maximum - minimum) * (pageX - this.elementOffsetLeft)) / this.elementWidth, 0, 100))
    if (percentual % this.stepSize !== 0 && !round) return

    if (round) {
      percentual = Math[percentual > this.percentual ? 'floor' : 'ceil'](percentual / this.stepSize) * this.stepSize
      Logger.debug(this.id, 'setPercentual', `The percentual has been rounded to ${percentual}%.`)
    }

    this.percentual = percentual
    Logger.debug(this.id, 'setPercentual', `The percentual has been set to ${this.percentual}%.`)

    this.update()
  }

  setValue = (minimum: number, maximum: number, onChangeValue: (value: number) => any): void => {
    let value: number

    value = Math.floor(NumberUtils.limit((maximum / 100) * this.percentual, minimum, maximum))
    if (value % this.stepSize !== 0) return

    onChangeValue(value)
    Logger.debug(this.id, 'setValue', `The value has been changed to ${value}.`)
  }

  get elementOffsetLeft(): number {
    return this.element.offsetLeft
  }

  get elementWidth(): number {
    return parseFloat(getComputedStyle(this.element).width)
  }
}

export default SliderStore
