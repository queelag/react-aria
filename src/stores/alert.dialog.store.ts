import { ID, IDUtils, Logger } from '@queelag/core'
import { ComponentStore } from '@queelag/react-core'
import { KeyboardEvent } from 'react'
import { ComponentName, Key } from '../definitions/enums'

class AlertDialogStore extends ComponentStore<HTMLDivElement> {
  descriptionElementID: ID
  titleElementID: ID

  constructor(update: () => void, id?: string) {
    super(ComponentName.ALERT_DIALOG, id, undefined, update)

    this.descriptionElementID = IDUtils.prefixed(ComponentName.ALERT_DIALOG_DESCRIPTION)
    this.titleElementID = IDUtils.prefixed(ComponentName.ALERT_DIALOG_TITLE)
  }

  handleKeyboardInteractions(event: KeyboardEvent, onClose: () => void): void {
    switch (event.key) {
      case Key.ESCAPE:
        event.preventDefault()
        Logger.debug(this.id, 'handleKeyboardInteractions', `The default event has been prevented.`)

        onClose()
        Logger.debug(this.id, 'handleKeyboardInteractions', event.key, 'The alert dialog has been closed')

        break
    }
  }
}

export default AlertDialogStore
