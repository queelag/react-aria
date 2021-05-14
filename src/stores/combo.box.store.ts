import { MutableRefObject } from 'react'
import { ComponentName } from '../definitions/enums'
import { ID } from '../definitions/types'
import ComponentStore from '../modules/component.store'
import IDUtils from '../utils/id.utils'

class ComboBoxStore extends ComponentStore {
  activeItem: ID
  expanded: boolean
  listBoxID: ID

  constructor(ref: MutableRefObject<HTMLDivElement>, update: () => void, id?: ID) {
    super(ComponentName.COMBO_BOX, ref, update, id)

    this.activeItem = ''
    this.expanded = false
    this.listBoxID = IDUtils.prefixed(ComponentName.COMBO_BOX_LIST_BOX)
  }
}

export default ComboBoxStore
