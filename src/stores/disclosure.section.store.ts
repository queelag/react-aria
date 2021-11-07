import { ID, IDUtils } from '@queelag/core'
import { ComponentStore, ComponentStoreProps } from '@queelag/react-core'
import { ComponentName } from '../definitions/enums'
import { DisclosureSectionProps } from '../definitions/props'
import { StoreLogger } from '../loggers/store.logger'

export class DisclosureSectionStore extends ComponentStore<HTMLElement> {
  _expanded: boolean = false
  panelID: ID

  constructor(props: DisclosureSectionProps & ComponentStoreProps<HTMLElement>) {
    super(ComponentName.DISCLOSURE_SECTION, props)

    this.expanded = props.expanded || false
    this.panelID = IDUtils.prefixed(ComponentName.DISCLOSURE_SECTION_PANEL)
  }

  setExpanded = (expanded: boolean): void => {
    this.expanded = expanded
  }

  get expanded(): boolean {
    return this._expanded
  }

  set expanded(expanded: boolean) {
    this._expanded = expanded
    StoreLogger.debug(this.id, 'setExpanded', `The section has been ${expanded ? 'expanded' : 'collapsed'}.`)

    this.update()
  }
}
