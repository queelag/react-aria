import { ComponentName, DisclosureStatus } from '../definitions/enums'
import { ID } from '../definitions/types'
import ComponentStore from '../modules/component.store'
import Logger from '../modules/logger'
import IDUtils from '../utils/id.utils'

class DisclosureSectionStore extends ComponentStore {
  panelID: ID
  status: DisclosureStatus

  constructor(update: () => void) {
    super(ComponentName.DISCLOSURE_SECTION, update)

    this.panelID = IDUtils.prefixed(ComponentName.DISCLOSURE_SECTION_PANEL)
    this.status = DisclosureStatus.COLLAPSED
  }

  setStatus = (status: DisclosureStatus): void => {
    this.status = status
    Logger.debug(this.id, 'setStatus', `The status has been set to ${status}.`)

    this.update()
  }
}

export default DisclosureSectionStore
