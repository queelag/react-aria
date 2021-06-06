import { ComponentName } from '../definitions/enums'
import { ID } from '../definitions/types'
import ComponentStore from '../modules/component.store'
import Logger from '../modules/logger'
import IDUtils from '../utils/id.utils'

class DisclosureSectionStore extends ComponentStore {
  expanded: boolean
  panelID: ID

  constructor(update: () => void) {
    super(ComponentName.DISCLOSURE_SECTION, update)

    this.expanded = false
    this.panelID = IDUtils.prefixed(ComponentName.DISCLOSURE_SECTION_PANEL)
  }

  setExpanded = (expanded: boolean): void => {
    this.expanded = expanded
    Logger.debug(this.id, 'setExpanded', `The section has been ${expanded ? 'expanded' : 'collapsed'}.`)

    this.update()
  }
}

export default DisclosureSectionStore
