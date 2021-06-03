import { MouseEvent } from 'react'
import { ComponentName } from '../definitions/enums'
import { ID } from '../definitions/types'
import ComponentStore from '../modules/component.store'
import Logger from '../modules/logger'
import NumberUtils from '../utils/number.utils'

class SliderStore extends ComponentStore {
  thumbClientX: number

  constructor(update: () => void, id?: ID) {
    super(ComponentName.SLIDER, update, id)

    this.thumbClientX = 0
  }

  handleMouseInteractions = (event: MouseEvent, minimum: number, maximum: number, value: number): number => {
    let next: number

    next = NumberUtils.limit(event.clientX > this.thumbClientX ? value + 1 : value - 1, minimum, maximum)
    Logger.debug(this.id, 'handleMouseInteractions', `The next value is ${next}.`)

    this.thumbClientX = event.clientX
    Logger.debug(this.id, 'handleMouseInteractions', `The thumb client x value has been set to ${event.clientX}.`)

    return next
  }
}

export default SliderStore
