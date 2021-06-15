import { KeyboardEvent, MutableRefObject } from 'react'
import { ComponentName, Key } from '../definitions/enums'
import { ID, OptionalID } from '../definitions/types'
import ComponentStore from '../modules/component.store'
import Logger from '../modules/logger'
import IDUtils from '../utils/id.utils'

class TabberStore extends ComponentStore {
  listItemIDs: ID[]
  listItemRefs: Map<number, MutableRefObject<HTMLButtonElement>>
  panelIDs: ID[]
  selectedListItemIndex: number
  size: number

  constructor(update: () => void, id: OptionalID, size: number) {
    super(ComponentName.TABBER, update, id)

    this.listItemIDs = []
    this.listItemRefs = new Map()
    this.panelIDs = []
    this.selectedListItemIndex = 0
    this.size = 0

    this.setSize(size)
  }

  handleKeyboardEvents = (event: KeyboardEvent): void => {
    switch (event.key) {
      case Key.ARROW_LEFT:
      case Key.ARROW_RIGHT:
      case Key.HOME:
      case Key.END:
        event.preventDefault()
        break
    }

    switch (event.key) {
      case Key.ARROW_LEFT:
        this.setSelectedListItemIndex(this.selectedListItemIndex > 0 ? this.selectedListItemIndex - 1 : this.size - 1)
        this.focusSelectedListItem()

        break
      case Key.ARROW_RIGHT:
        this.setSelectedListItemIndex(this.selectedListItemIndex < this.size - 1 ? this.selectedListItemIndex + 1 : 0)
        this.focusSelectedListItem()

        break
      case Key.HOME:
        this.setSelectedListItemIndex(0)
        this.focusSelectedListItem()

        break
      case Key.END:
        this.setSelectedListItemIndex(this.size - 1)
        this.focusSelectedListItem()

        break
    }
  }

  focusSelectedListItem(): void {
    let ref: MutableRefObject<HTMLButtonElement> | undefined

    ref = this.listItemRefs.get(this.selectedListItemIndex)
    if (!ref) return Logger.error(this.id, 'focusSelectedListItem', `Failed to find the list item ref with index ${this.selectedListItemIndex}.`)

    ref.current.focus()
    Logger.debug(this.id, 'focusSelectedListItem', `The list item with index ${this.selectedListItemIndex} has been focused.`)
  }

  setListItemRef = (index: number, ref: MutableRefObject<HTMLButtonElement>): void => {
    this.listItemRefs.set(index, ref)
    Logger.debug(this.id, 'setListItemRef', `The ref of the list item with index ${index} has been set.`)
  }

  setSelectedListItemIndex = (index: number): void => {
    this.selectedListItemIndex = index
    Logger.debug(this.id, 'setSelectedListItemIndex', `The selected tab index has been set to ${index}.`)

    this.update()
  }

  setSize(size: number): void {
    for (let i = 0; i < size; i++) {
      this.listItemIDs[i] = IDUtils.prefixed(ComponentName.TABBER_LIST_ITEM)
      this.panelIDs[i] = IDUtils.prefixed(ComponentName.TABBER_PANEL)
    }
    Logger.debug(this.id, 'setSize', `The list item ids and panel ids have been set based on size ${size}.`)

    this.size = size
    Logger.debug(this.id, 'setSize', `The size has been set to ${size}.`)

    this.update()
  }

  isTabSelected = (index: number): boolean => {
    return this.selectedListItemIndex === index
  }
}

export default TabberStore
