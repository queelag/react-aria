import { MutableRefObject } from 'react'
import { ComponentName } from '../definitions/enums'
import { ID } from '../definitions/types'
import ComponentStore from '../modules/component.store'
import IDUtils from '../utils/id.utils'

class AlertDialogStore extends ComponentStore {
  descriptionElementID: ID
  titleElementID: ID

  constructor(ref: MutableRefObject<HTMLDivElement>) {
    super(ComponentName.ALERT_DIALOG, ref)

    this.descriptionElementID = IDUtils.prefixed(ComponentName.ALERT_DIALOG_DESCRIPTION)
    this.titleElementID = IDUtils.prefixed(ComponentName.ALERT_DIALOG_TITLE)
  }
}

export default AlertDialogStore
