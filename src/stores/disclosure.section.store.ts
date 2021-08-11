import { ID, IDUtils, Logger } from '@queelag/core'
import { ComponentStore, ComponentStoreProps } from '@queelag/react-core'
import { ComponentName } from '../definitions/enums'
import { DisclosureSectionProps } from '../definitions/props'

class DisclosureSectionStore extends ComponentStore<HTMLElement> {
  expanded: boolean
  panelID: ID

  constructor(props: DisclosureSectionProps & ComponentStoreProps<HTMLElement>) {
    super(ComponentName.DISCLOSURE_SECTION, props)

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
