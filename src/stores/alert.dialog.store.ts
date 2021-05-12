import { KeyboardEvent, MutableRefObject } from 'react'
import { ComponentName, Key } from '../definitions/enums'
import { ID } from '../definitions/types'
import ComponentStore from '../modules/component.store'
import Logger from '../modules/logger'
import IDUtils from '../utils/id.utils'

class AlertDialogStore extends ComponentStore {
  descriptionElementID: ID
  titleElementID: ID

  constructor(ref: MutableRefObject<HTMLDivElement>) {
    super(ComponentName.ALERT_DIALOG, ref)

    this.descriptionElementID = IDUtils.prefixed(ComponentName.ALERT_DIALOG_DESCRIPTION)
    this.titleElementID = IDUtils.prefixed(ComponentName.ALERT_DIALOG_TITLE)
  }

  handleKeyboardInteractions(event: KeyboardEvent, onClose: () => void): void {
    switch (event.key) {
      case Key.ESCAPE:
        onClose()
        Logger.debug(this.id, 'handleKeyboardEvents', event.key, 'The alert dialog has been closed')

        break
    }
  }
}

export default AlertDialogStore
