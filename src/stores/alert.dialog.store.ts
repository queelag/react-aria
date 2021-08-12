import { ID, IDUtils, Logger } from '@queelag/core'
import { ComponentStore, ComponentStoreProps } from '@queelag/react-core'
import { KeyboardEvent } from 'react'
import { ComponentName, Key } from '../definitions/enums'
import { AlertDialogProps } from '../definitions/props'

class AlertDialogStore extends ComponentStore<HTMLDivElement> {
  descriptionElementID: ID
  titleElementID: ID

  constructor(props: AlertDialogProps & ComponentStoreProps<HTMLDivElement>) {
    super(ComponentName.ALERT_DIALOG, props)

    this.descriptionElementID = IDUtils.prefixed(ComponentName.ALERT_DIALOG_DESCRIPTION)
    this.titleElementID = IDUtils.prefixed(ComponentName.ALERT_DIALOG_TITLE)
  }

  handleKeyboardInteractions(event: KeyboardEvent, onClose: () => void): void {
    switch (event.key) {
      case Key.ESCAPE:
        event.preventDefault()
        event.stopPropagation()
        Logger.debug(this.id, 'handleKeyboardInteractions', `The default event has been prevented and the propagation has been stopped.`)

        onClose()
        Logger.debug(this.id, 'handleKeyboardInteractions', event.key, 'The alert dialog has been closed')

        break
    }
  }
}

export default AlertDialogStore
