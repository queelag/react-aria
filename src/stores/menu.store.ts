import { KeyboardEvent, MutableRefObject } from 'react'
import { ComponentName, Key } from '../definitions/enums'
import { ID } from '../definitions/types'
import ComponentStore from '../modules/component.store'
import Debounce from '../modules/debounce'
import Logger from '../modules/logger'
import noop from '../modules/noop'

class MenuStore extends ComponentStore {
  expandedItemIndex: number
  focusedItemIndex: number
  itemAnchorsRef: Map<number, MutableRefObject<HTMLAnchorElement>>
  itemMenusRef: Map<ID, MutableRefObject<HTMLUListElement>>
  itemMenuItemAnchorsRef: Map<number, Map<number, MutableRefObject<HTMLAnchorElement>>>

  constructor(update: () => void, id?: ID) {
    super(ComponentName.MENU, update, id)

    this.expandedItemIndex = -1
    this.focusedItemIndex = 0
    this.itemAnchorsRef = new Map()
    this.itemMenusRef = new Map()
    this.itemMenuItemAnchorsRef = new Map()
  }

  handleKeyboardInteractions(event: KeyboardEvent): void {
    let previous: MutableRefObject<HTMLAnchorElement>, next: MutableRefObject<HTMLAnchorElement>, first: MutableRefObject<HTMLAnchorElement>

    switch (event.key) {
      case Key.ARROW_DOWN:
        this.setExpandedItemIndex(this.focusedItemIndex)

        if (this.expandedItemFocusedMenuItemIndex < 0) {
          let first: MutableRefObject<HTMLAnchorElement>

          first = this.findItemMenuItemAnchorRef(this.expandedItemIndex, 0)
          if (!first.current.id) return Logger.error(this.id, 'handleKeyboardInteractions', `Failed to find the first item menu item anchor ref.`)

          first.current.focus()

          break
        }

        next = this.findItemMenuItemAnchorRef(
          this.expandedItemIndex,
          this.expandedItemFocusedMenuItemIndex < this.expandedItemMenuItems - 1 ? this.expandedItemFocusedMenuItemIndex + 1 : 0
        )
        if (!next.current.id) return Logger.error(this.id, 'handleKeyboardInteractions', `Failed to find the next item menu item anchor ref.`)

        next.current.focus()

        break
      case Key.ARROW_UP:
        previous = this.findItemMenuItemAnchorRef(
          this.expandedItemIndex,
          this.expandedItemFocusedMenuItemIndex > 0 ? this.expandedItemFocusedMenuItemIndex - 1 : this.expandedItemMenuItems - 1
        )
        if (!previous.current.id) return Logger.error(this.id, 'handleKeyboardInteractions', `Failed to find the previous item menu item anchor ref.`)

        previous.current.focus()

        break
      case Key.ARROW_LEFT:
        this.setFocusedItemIndex(this.focusedItemIndex > 0 ? this.focusedItemIndex - 1 : this.itemAnchorsRef.size - 1)
        this.setExpandedItemIndex(this.focusedItemIndex)

        previous = this.findItemAnchorRef(this.focusedItemIndex)
        if (!previous.current.id)
          return Logger.error(this.id, 'handleKeyboardInteractions', `Failed to find the ref of the item anchor with index ${this.focusedItemIndex}.`)

        previous.current.focus()
        Logger.debug(this.id, 'handleKeyboardInteractions', `The item anchor ref with index ${this.focusedItemIndex} has been focused.`)

        break
      case Key.ARROW_RIGHT:
        this.setFocusedItemIndex(this.focusedItemIndex < this.itemAnchorsRef.size - 1 ? this.focusedItemIndex + 1 : 0)
        this.setExpandedItemIndex(this.focusedItemIndex)

        next = this.findItemAnchorRef(this.focusedItemIndex)
        if (!next.current.id)
          return Logger.error(this.id, 'handleKeyboardInteractions', `Failed to find the ref of the item anchor with index ${this.focusedItemIndex}.`)

        next.current.focus()
        Logger.debug(this.id, 'handleKeyboardInteractions', `The item anchor ref with index ${this.focusedItemIndex} has been focused.`)

        break
      case Key.HOME:
        if (this.expandedItemIndex < 0) {
          first = this.findItemAnchorRef(0)
          if (!first.current.id) return Logger.error(this.id, 'handleKeyboardInteractions', `Failed to find the first item anchor ref.`)

          first.current.focus()

          break
        }

        if (this.expandedItemIndex >= 0) {
          first = this.findItemMenuItemAnchorRef(this.expandedItemIndex, 0)
          if (!first.current.id) return Logger.error(this.id, 'handleKeyboardInteractions', `Failed to find the first item menu item anchor ref.`)

          first.current.focus()

          break
        }

        break
      case Key.END:
        let last: MutableRefObject<HTMLAnchorElement>

        if (this.expandedItemIndex < 0) {
          last = this.findItemAnchorRef(this.itemAnchorsRef.size - 1)
          if (!last.current.id) return Logger.error(this.id, 'handleKeyboardInteractions', `Failed to find the last item anchor ref.`)

          last.current.focus()

          break
        }

        if (this.expandedItemIndex >= 0) {
          last = this.findItemMenuItemAnchorRef(this.expandedItemIndex, this.expandedItemMenuItems - 1)
          if (!last.current.id) return Logger.error(this.id, 'handleKeyboardInteractions', `Failed to find the last item menu item anchor ref.`)

          last.current.focus()

          break
        }

        break
      case Key.ESCAPE:
        this.setExpandedItemIndex(-1)

        first = this.findItemAnchorRef(this.focusedItemIndex)
        if (!first.current.id)
          return Logger.error(this.id, 'handleKeyboardInteractions', `Failed to find the ref of the item anchor with index ${this.focusedItemIndex}.`)

        first.current.focus()

        break
      case Key.ENTER:
      case Key.SPACE:
        let active: MutableRefObject<HTMLAnchorElement>

        active = this.findItemMenuItemAnchorRef(this.expandedItemIndex, this.expandedItemFocusedMenuItemIndex)
        if (!active.current.id) return Logger.error(this.id, 'handleKeyboardInteractions', `Failed to find the active item menu item anchor ref.`)

        active.current.click()
        Logger.debug(this.id, 'handleKeyboardInteractions', `The ${active.current.id} has been clicked.`)

        break
    }
  }

  setItemAnchorRef = (index: number, ref: MutableRefObject<HTMLAnchorElement>): void => {
    this.itemAnchorsRef.set(index, ref)
    Logger.debug(this.id, 'setItemAnchorRef', `The ref of the item anchor with index ${index} has been set.`)
  }

  deleteItemAnchorRef = (index: number): void => {
    this.itemAnchorsRef.delete(index)
    Logger.debug(this.id, 'deleteItemAnchorRef', `The ref of the item anchor with index ${index} has been deleted.`)
  }

  setItemMenuRef = (id: ID, ref: MutableRefObject<HTMLUListElement>): void => {
    this.itemMenusRef.set(id, ref)
    Logger.debug(this.id, 'setItemMenuRef', `The ref of the item menu child of ${id} has been set.`)
  }

  deleteItemMenuRef = (id: ID): void => {
    this.itemMenusRef.delete(id)
    Logger.debug(this.id, 'deleteItemMenuRef', `The ref of the item menu child of ${id} has been deleted.`)
  }

  setItemMenuItemAnchorRef = (parentIndex: number, index: number, ref: MutableRefObject<HTMLAnchorElement>): void => {
    !this.itemMenuItemAnchorsRef.has(parentIndex) && this.itemMenuItemAnchorsRef.set(parentIndex, new Map())
    Logger.debug(this.id, 'setItemMenuItemAnchorRef', `The map of the item menu item with index ${parentIndex} has been created.`)

    this.itemMenuItemAnchorsRef.get(parentIndex)?.set(index, ref)
    Logger.debug(this.id, 'setItemMenuItemAnchorRef', `The ref of the item menu item anchor with parentIndex ${index} and index ${index} has been set.`)
  }

  deleteItemMenuItemAnchorRef = (parentIndex: number, index: number): void => {
    this.itemMenuItemAnchorsRef.get(parentIndex)?.delete(index)
    Logger.debug(this.id, 'deleteItemMenuItemAnchorRef', `The ref of the item menu item anchor with parentIndex ${index} and index ${index} has been deleted.`)
  }

  setExpandedItemIndex = (index: number, delay: number = 1000): void => {
    let fn: () => void

    fn = () => {
      this.expandedItemIndex = index
      Logger.debug(this.id, 'setExpandedItemIndex', `The expanded item index has been set to ${index}.`)

      this.update()
    }

    if (index < 0) {
      Debounce.handle(this.id, fn, delay)
    }

    if (index >= 0) {
      Debounce.handle(this.id, noop, 0)
      fn()
    }
  }

  setFocusedItemIndex = (index: number): void => {
    this.focusedItemIndex = index
    Logger.debug(this.id, 'setFocusedItemIndex', `The focused item index has been set to ${index}.`)

    this.update()
  }

  focusItemAnchor = (index: number): void => {
    let ref: MutableRefObject<HTMLAnchorElement>

    ref = this.findItemAnchorRef(index)
    if (!ref.current.id) return Logger.error(this.id, 'focusItemAnchor', `Failed to find the item anchor ref with index ${index}.`)

    ref.current.focus()
  }

  findItemAnchorRef(index: number): MutableRefObject<HTMLAnchorElement> {
    return this.itemAnchorsRef.get(index) || { current: document.createElement('a') }
  }

  findItemMenuItemAnchorRef(parentIndex: number, index: number): MutableRefObject<HTMLAnchorElement> {
    return this.itemMenuItemAnchorsRef.get(parentIndex)?.get(index) || { current: document.createElement('a') }
  }

  findItemMenuRef = (id: ID): MutableRefObject<HTMLUListElement> => {
    return this.itemMenusRef.get(id) || { current: document.createElement('ul') }
  }

  isItemExpanded = (index: number): boolean => {
    return index === this.expandedItemIndex
  }

  get expandedItemMenuItems(): number {
    return this.itemMenuItemAnchorsRef.get(this.expandedItemIndex)?.size || 0
  }

  get expandedItemFocusedMenuItemIndex(): number {
    return [...(this.itemMenuItemAnchorsRef.get(this.expandedItemIndex)?.values() || [])].findIndex(
      (v: MutableRefObject<HTMLAnchorElement>) => v.current === document.activeElement
    )
  }
}

export default MenuStore
