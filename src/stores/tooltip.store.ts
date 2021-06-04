import { KeyboardEvent, MutableRefObject } from 'react'
import { ComponentName, Key } from '../definitions/enums'
import { ID } from '../definitions/types'
import ComponentStore from '../modules/component.store'
import Logger from '../modules/logger'
import IDUtils from '../utils/id.utils'

class TooltipStore extends ComponentStore {
  elementID: ID
  elementRef: MutableRefObject<HTMLDivElement>
  hideDelay: number
  triggerRef: MutableRefObject<HTMLDivElement>
  visible: boolean

  constructor(update: () => void, hideDelay: number = 200, id?: ID) {
    super(ComponentName.TOOLTIP, update, id)

    this.elementID = IDUtils.prefixed(ComponentName.TOOLTIP_ELEMENT)
    this.elementRef = { current: document.createElement('div') }
    this.hideDelay = hideDelay
    this.triggerRef = { current: document.createElement('div') }
    this.visible = false
  }

  handleKeyboardInteractions = (event: KeyboardEvent): void => {
    switch (event.key) {
      case Key.ESCAPE:
        event.preventDefault()
        Logger.debug(this.id, 'handleKeyboardInteractions', `The default event has been prevented.`)

        this.setVisible(false)

        break
    }
  }

  setElementRef = (ref: MutableRefObject<HTMLDivElement>): void => {
    this.elementRef = ref
    Logger.debug(this.id, 'setElementRef', `The element ref has been set.`)
  }

  setTriggerRef = (ref: MutableRefObject<HTMLDivElement>): void => {
    this.triggerRef = ref
    Logger.debug(this.id, 'setTriggerRef', `The trigger ref has been set.`)
  }

  setVisible = (visible: boolean): void => {
    if (visible === false && this.triggerRef.current === document.activeElement) {
      Logger.debug(this.id, 'setVisible', `Failed to set visible to false, the trigger element is still focused.`)
      return
    }

    this.visible = visible
    Logger.debug(this.id, 'setVisible', `The tooltip has been ${visible ? 'shown' : 'hidden'}.`)

    this.update()
  }
}

export default TooltipStore
