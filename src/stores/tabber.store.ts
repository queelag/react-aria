import { ID, IDUtils, Logger, rc } from '@queelag/core'
import { ComponentStore } from '@queelag/react-core'
import { KeyboardEvent, MutableRefObject } from 'react'
import { ComponentName, Key, TabberActivation } from '../definitions/enums'

class TabberStore extends ComponentStore<HTMLDivElement> {
  activation: TabberActivation
  listItemIDs: ID[]
  listItemRefs: Map<number, MutableRefObject<HTMLButtonElement>>
  panelIDs: ID[]
  selectedListItemIndex: number
  size: number

  constructor(update: () => void, id: ID = '', activation: TabberActivation = TabberActivation.AUTOMATIC, size: number) {
    super(ComponentName.TABBER, id, undefined, update)

    this.activation = activation
    this.listItemIDs = []
    this.listItemRefs = new Map()
    this.panelIDs = []
    this.selectedListItemIndex = 0
    this.size = 0

    this.setSize(size)
  }

  handleKeyboardEvents = (event: KeyboardEvent): void => {
    let focusedListItemIndex: number, selectedListItemIndex: number

    focusedListItemIndex = 0
    selectedListItemIndex = 0

    switch (event.key) {
      case Key.ARROW_LEFT:
      case Key.ARROW_RIGHT:
      case Key.END:
      case Key.ENTER:
      case Key.HOME:
      case Key.SPACE:
        event.preventDefault()
        break
    }

    switch (event.key) {
      case Key.ARROW_LEFT:
        focusedListItemIndex = this.focusedListItemIndex > 0 ? this.focusedListItemIndex - 1 : this.size - 1
        selectedListItemIndex = this.selectedListItemIndex > 0 ? this.selectedListItemIndex - 1 : this.size - 1

        break
      case Key.ARROW_RIGHT:
        focusedListItemIndex = this.focusedListItemIndex < this.size - 1 ? this.focusedListItemIndex + 1 : 0
        selectedListItemIndex = this.selectedListItemIndex < this.size - 1 ? this.selectedListItemIndex + 1 : 0

        break
      case Key.HOME:
        focusedListItemIndex = 0
        selectedListItemIndex = 0

        break
      case Key.END:
        focusedListItemIndex = this.size - 1
        selectedListItemIndex = this.size - 1

        break
      case Key.ENTER:
      case Key.SPACE:
        this.setSelectedListItemIndex(this.focusedListItemIndex)

        break
    }

    switch (event.key) {
      case Key.ARROW_LEFT:
      case Key.ARROW_RIGHT:
      case Key.END:
      case Key.HOME:
        switch (this.activation) {
          case TabberActivation.AUTOMATIC:
            this.setSelectedListItemIndex(selectedListItemIndex)
            this.focusSelectedListItem()

            break
          case TabberActivation.MANUAL:
            this.focusListItem(focusedListItemIndex)
            break
        }
    }
  }

  focusSelectedListItem(): void {
    return this.focusListItem(this.selectedListItemIndex)
  }

  focusListItem(index: number): void {
    let ref: MutableRefObject<HTMLButtonElement> | undefined

    ref = this.listItemRefs.get(index)
    if (!ref) return Logger.error(this.id, 'focusSelectedListItem', `Failed to find the list item ref with index ${index}.`)

    ref.current.focus()
    Logger.debug(this.id, 'focusSelectedListItem', `The list item with index ${index} has been focused.`)
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

  get focusedListItemIndex(): number {
    let items: HTMLButtonElement[], index: number

    items = [...this.listItemRefs.values()].map((v: MutableRefObject<HTMLButtonElement>) => v.current)
    if (items.length <= 0) return rc(() => Logger.error(this.id, 'focusedListItemIndex', `There are no items.`), 0)

    index = items.findIndex((v: HTMLButtonElement) => v === document.activeElement)
    if (index < 0) return rc(() => Logger.error(this.id, 'focusedListItemIndex', `Failed to find the focused list item index.`), 0)

    return index
  }
}

export default TabberStore
