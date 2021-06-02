import { KeyboardEvent, MutableRefObject } from 'react'
import { ComponentName, Key } from '../definitions/enums'
import { ID } from '../definitions/types'
import ComponentStore from '../modules/component.store'
import Logger from '../modules/logger'
import tc from '../modules/tc'
import IDUtils from '../utils/id.utils'

class ComboBoxStore extends ComponentStore {
  expanded: boolean
  focusedListBoxItemIndex: number
  groupRef: MutableRefObject<HTMLDivElement>
  inputRef: MutableRefObject<HTMLInputElement>
  listBoxID: ID
  listBoxItemsRef: Map<number, MutableRefObject<HTMLLIElement>>
  listBoxRef: MutableRefObject<HTMLUListElement>

  constructor(update: () => void, onCollapse: () => any, id?: ID) {
    super(ComponentName.COMBO_BOX, update, id)

    this.expanded = false
    this.focusedListBoxItemIndex = -1
    this.groupRef = { current: document.createElement('div') }
    this.inputRef = { current: document.createElement('input') }
    this.listBoxID = IDUtils.prefixed(ComponentName.COMBO_BOX_LIST_BOX)
    this.listBoxItemsRef = new Map()
    this.listBoxRef = { current: document.createElement('ul') }
    this.onCollapse = onCollapse
  }

  onCollapse(): void {}

  handleKeyboardInteractions = (event: KeyboardEvent<HTMLDivElement>, onEscape: () => any): void => {
    switch (event.key) {
      case Key.ARROW_DOWN:
        this.isCollapsed && this.setExpanded(true, this.id, 'handleKeyboardInteractions')
        this.setFocusedListBoxItemIndex(this.focusedListBoxItemIndex < this.listBoxItemsRef.size - 1 ? this.focusedListBoxItemIndex + 1 : 0)

        break
      case Key.ARROW_UP:
        this.isCollapsed && this.setExpanded(true, this.id, 'handleKeyboardInteractions')
        this.setFocusedListBoxItemIndex(this.focusedListBoxItemIndex > 0 ? this.focusedListBoxItemIndex - 1 : this.listBoxItemsRef.size - 1)

        break
      case Key.ENTER:
        let listBoxItemRef: MutableRefObject<HTMLLIElement> | undefined

        if (this.isCollapsed) {
          return Logger.warn(this.id, 'handleKeyboardInteractions', event.key, `The listbox is collapsed, can't proceed.`)
        }

        listBoxItemRef = this.listBoxItemsRef.get(this.focusedListBoxItemIndex)
        if (!listBoxItemRef) return Logger.error(this.id, 'handleKeyboardInteractions', event.key, `Failed to find the ref of the focused listbox item.`)

        listBoxItemRef.current.click()
        this.setExpanded(false, this.id, 'handleKeyboardInteractions')

        break
      case Key.ESCAPE:
        tc(() => onEscape())
        this.setExpanded(false, this.id, 'handleKeyboardInteractions')

        break
    }
  }

  setExpanded = (expanded: boolean, id: ID, caller: string): void => {
    this.expanded = expanded
    Logger.debug(id, caller, `The combobox has been ${expanded ? 'expanded' : 'collapsed'}.`)

    if (this.isCollapsed) {
      this.setFocusedListBoxItemIndex(-1)
      this.onCollapse()
    }

    if (this.isExpanded) {
      this.inputRef.current.focus()
    }

    this.update()
  }

  setFocusedListBoxItemIndex = (index: number): void => {
    this.focusedListBoxItemIndex = index
    Logger.debug(this.id, 'setFocusedListBoxItemID', `The focused listbox item index has been set to ${index}.`)

    this.update()
  }

  setGroupRef = (ref: MutableRefObject<HTMLDivElement>): void => {
    this.groupRef = ref
    Logger.debug(this.id, 'setGroupRef', `The group ref has been set.`)
  }

  setInputRef = (ref: MutableRefObject<HTMLInputElement>): void => {
    this.inputRef = ref
    Logger.debug(this.id, 'setInputRef', `The input ref has been set.`)
  }

  setListBoxItemRef = (index: number, ref: MutableRefObject<HTMLLIElement>): void => {
    this.listBoxItemsRef.set(index, ref)
    Logger.debug(this.id, 'setListBoxItemRef', `The ref of the listbox item with index ${index} has been set.`)
  }

  setListBoxRef = (ref: MutableRefObject<HTMLUListElement>): void => {
    this.listBoxRef = ref
    Logger.debug(this.id, 'setListBoxRef', `The listbox ref has been set.`)
  }

  deleteListBoxItemRef = (index: number): void => {
    let exists: boolean

    exists = this.listBoxItemsRef.has(index)
    if (!exists) return Logger.error(this.id, 'deleteListBoxItemRef', `Failed to find the ref of the listbox item with index ${index}.`)

    this.listBoxItemsRef.delete(index)
    Logger.debug(this.id, 'deleteListBoxItemRef', `The ref of the listbox item with index ${index} has been deleted.`)
  }

  isListBoxItemFocused = (index: number): boolean => {
    return this.focusedListBoxItemIndex === index
  }

  get focusedListBoxItemID(): ID {
    return (this.listBoxItemsRef.get(this.focusedListBoxItemIndex) || { current: document.createElement('div') }).current.id
  }

  get isCollapsed(): boolean {
    return this.expanded === false
  }

  get isExpanded(): boolean {
    return this.expanded === true
  }
}

export default ComboBoxStore