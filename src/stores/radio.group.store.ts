import { Logger, noop, OptionalID } from '@queelag/core'
import { ComponentStore } from '@queelag/react-core'
import { KeyboardEvent, MutableRefObject } from 'react'
import { ComponentName, Key } from '../definitions/enums'

class RadioGroupStore extends ComponentStore<HTMLDivElement> {
  itemsRef: Map<number, MutableRefObject<HTMLDivElement>>
  checkedItemIndex: number

  constructor(update: () => void, id: OptionalID, checkedItemIndex: number = -1, onCheckItem: (index: number) => any = noop) {
    super(ComponentName.RADIO_GROUP, id, undefined, update)

    this.itemsRef = new Map()
    this.checkedItemIndex = checkedItemIndex
    this.onCheckItem = onCheckItem
  }

  onCheckItem(index: number): void {}

  handleKeyboardInteractions(event: KeyboardEvent): void {
    switch (event.key) {
      case Key.ARROW_DOWN:
      case Key.ARROW_RIGHT:
      case Key.ARROW_UP:
      case Key.ARROW_LEFT:
      case Key.SPACE:
        event.preventDefault()
        Logger.debug(this.id, 'handleKeyboardInteractions', `The default event has been prevented`)

        break
    }

    switch (event.key) {
      case Key.ARROW_DOWN:
      case Key.ARROW_RIGHT:
        this.setCheckedItemIndex(this.focusedItemIndex < this.itemsRef.size - 1 ? this.focusedItemIndex + 1 : 0)
        this.focusItem(this.checkedItemIndex)
        break
      case Key.ARROW_UP:
      case Key.ARROW_LEFT:
        this.setCheckedItemIndex(this.focusedItemIndex > 0 ? this.focusedItemIndex - 1 : this.itemsRef.size - 1)
        this.focusItem(this.checkedItemIndex)
        break
      case Key.SPACE:
        this.setCheckedItemIndex(this.focusedItemIndex)
        break
    }
  }

  setItemRef = (index: number, ref: MutableRefObject<HTMLDivElement>): void => {
    this.itemsRef.set(index, ref)
    Logger.debug(this.id, 'setItemRef', `The ref of the item with index ${index} has been set.`)
  }

  deleteItemRef = (index: number): void => {
    this.itemsRef.delete(index)
    Logger.debug(this.id, 'deleteItemRef', `The ref of the item with index ${index} has been deleted.`)
  }

  setCheckedItemIndex = (index: number): void => {
    this.checkedItemIndex = index
    Logger.debug(this.id, 'setCheckedItemIndex', `The item with index ${index} has been checked.`)

    this.onCheckItem === noop ? this.update() : this.onCheckItem(index)
  }

  focusItem(index: number): void {
    let ref: MutableRefObject<HTMLDivElement> | undefined

    ref = this.itemsRef.get(this.checkedItemIndex)
    if (!ref) return Logger.error(this.id, 'focusItem', `Failed to find the item ref with index ${this.checkedItemIndex}.`)

    ref.current.focus()
    Logger.debug(this.id, 'focusItem', `The item ref with index ${index} has been focused.`)
  }

  isItemChecked = (index: number): boolean => {
    return index === this.checkedItemIndex
  }

  get focusedItemIndex(): number {
    return [...this.itemsRef.values()].findIndex((v: MutableRefObject<HTMLDivElement>) => v.current === document.activeElement)
  }
}

export default RadioGroupStore
