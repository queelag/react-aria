import { ID, IDUtils, Logger } from '@queelag/core'
import { ComponentStore } from '@queelag/react-core'
import { ComponentName } from '../definitions/enums'

class DisclosureSectionStore extends ComponentStore<HTMLElement> {
  expanded: boolean
  panelID: ID

  constructor(update: () => void) {
    super(ComponentName.DISCLOSURE_SECTION, undefined, undefined, update)

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
