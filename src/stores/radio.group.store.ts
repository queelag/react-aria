import { Logger, noop } from '@queelag/core'
import { ComponentStore, ComponentStoreProps } from '@queelag/react-core'
import { KeyboardEvent, MutableRefObject } from 'react'
import { ComponentName, Key } from '../definitions/enums'
import { RadioGroupProps } from '../definitions/props'

export class RadioGroupStore extends ComponentStore {
  itemsRef: Map<number, MutableRefObject<HTMLDivElement>>
  checkedItemIndex: number

  constructor(props: RadioGroupProps & ComponentStoreProps) {
    super(ComponentName.RADIO_GROUP, props)

    this.itemsRef = new Map()
    this.checkedItemIndex = props.checkedItemIndex || -1
    this.onCheckItem = props.onCheckItem || noop
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
        event.stopPropagation()
        Logger.debug(this.id, 'handleKeyboardInteractions', `The default event has been prevented and the propagation has been stopped.`)

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
