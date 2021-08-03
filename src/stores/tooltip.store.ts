import { ID, IDUtils, Logger } from '@queelag/core'
import { ComponentStore, ComponentStoreProps } from '@queelag/react-core'
import { KeyboardEvent, MutableRefObject } from 'react'
import { ComponentName, Key } from '../definitions/enums'
import { TooltipProps } from '../definitions/props'

class TooltipStore extends ComponentStore<HTMLDivElement> {
  elementID: ID
  elementRef: MutableRefObject<HTMLDivElement>
  hideDelay: number
  triggerRef: MutableRefObject<HTMLDivElement>
  visible: boolean

  constructor(props: TooltipProps & ComponentStoreProps<HTMLDivElement>) {
    super(ComponentName.TOOLTIP, props)

    this.elementID = IDUtils.prefixed(ComponentName.TOOLTIP_ELEMENT)
    this.elementRef = { current: document.createElement('div') }
    this.hideDelay = props.hideDelay || 200
    this.triggerRef = { current: document.createElement('div') }
    this.visible = false
  }

  handleKeyboardInteractions = (event: KeyboardEvent): void => {
    switch (event.key) {
      case Key.ESCAPE:
        event.preventDefault()
        event.stopPropagation()
        Logger.debug(this.id, 'handleKeyboardInteractions', `The default event has been prevented and the propagation has been stopped.`)

        this.setVisible(false)

        break
    }
  }

  setElementRef = (ref: MutableRefObject<HTMLDivElement>): void => {
    this.elementRef = ref
    Logger.debug(this.id, 'setElementRef', `The element ref has been set.`)

    this.update()
  }

  setTriggerRef = (ref: MutableRefObject<HTMLDivElement>): void => {
    this.triggerRef = ref
    Logger.debug(this.id, 'setTriggerRef', `The trigger ref has been set.`)

    this.update()
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
