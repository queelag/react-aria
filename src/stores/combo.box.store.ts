import { ID, IDUtils, Logger, noop, tc } from '@queelag/core'
import { ComponentStore, ComponentStoreProps } from '@queelag/react-core'
import { KeyboardEvent, MutableRefObject } from 'react'
import { ComponentName, Key } from '../definitions/enums'
import { ComboBoxProps } from '../definitions/props'

class ComboBoxStore extends ComponentStore<HTMLDivElement> {
  expanded: boolean
  focusedListBoxItemIndex: number
  groupRef: MutableRefObject<HTMLDivElement>
  inputRef: MutableRefObject<HTMLInputElement>
  listBoxID: ID
  listBoxItemsRef: Map<number, MutableRefObject<HTMLLIElement>>
  listBoxRef: MutableRefObject<HTMLUListElement>
  selectedListBoxItemIndexes: number[]

  constructor(props: ComboBoxProps & ComponentStoreProps<HTMLDivElement>) {
    super(ComponentName.COMBO_BOX, props)

    this.expanded = false
    this.focusedListBoxItemIndex = -1
    this.groupRef = { current: document.createElement('div') }
    this.inputRef = { current: document.createElement('input') }
    this.listBoxID = IDUtils.prefixed(ComponentName.COMBO_BOX_LIST_BOX)
    this.listBoxItemsRef = new Map()
    this.listBoxRef = { current: document.createElement('ul') }
    this.onCollapse = props.onCollapse
    this.onSelectListBoxItem = props.onSelectListBoxItem || noop
    this.selectedListBoxItemIndexes = props.selectedListBoxItemIndexes || []
  }

  onSelectListBoxItem(indexes: number[]): void {}
  onCollapse(): void {}

  handleKeyboardInteractions = (event: KeyboardEvent<HTMLDivElement>, onEscape: () => any): void => {
    switch (event.key) {
      case Key.ARROW_DOWN:
      case Key.ARROW_UP:
      case Key.ENTER:
      case Key.ESCAPE:
        event.preventDefault()
        event.stopPropagation()
        Logger.debug(this.id, 'handleKeyboardInteractions', `The default event has been prevented and the propagation has been stopped.`)

        break
    }

    switch (event.key) {
      case Key.ARROW_DOWN:
        if (this.isCollapsed) {
          this.setExpanded(true, this.id, 'handleKeyboardInteractions')
          break
        }

        this.setFocusedListBoxItemIndex(this.focusedListBoxItemIndex < this.listBoxItemsRef.size - 1 ? this.focusedListBoxItemIndex + 1 : 0)

        break
      case Key.ARROW_UP:
        if (this.isCollapsed) {
          this.setExpanded(true, this.id, 'handleKeyboardInteractions')
          break
        }

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
      // this.setFocusedListBoxItemIndex(-1)
      this.onCollapse()
    }

    if (this.isExpanded) {
      this.inputRef.current.focus()
      this.setFocusedListBoxItemIndex(this.selectedListBoxItemIndexes[0] || 0)
    }

    this.update()
  }

  setFocusedListBoxItemIndex = (index: number): void => {
    this.focusedListBoxItemIndex = index
    Logger.debug(this.id, 'setFocusedListBoxItemID', `The focused listbox item index has been set to ${index}.`)

    this.update()
  }

  setSelectedListBoxItemIndex = (index: number, selected: boolean): void => {
    this.selectedListBoxItemIndexes = selected ? [index] : []
    Logger.debug(this.id, 'setSelectedListBoxItemIndex', `The selected list box item index has been set to ${index}.`)

    this.onSelectListBoxItem === noop ? this.update() : this.onSelectListBoxItem(this.selectedListBoxItemIndexes)
  }

  setGroupRef = (ref: MutableRefObject<HTMLDivElement>): void => {
    this.groupRef = ref
    Logger.debug(this.id, 'setGroupRef', `The group ref has been set.`)

    this.update()
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
    this.listBoxRef.current = ref.current || this.listBoxRef.current
    Logger.debug(this.id, 'setListBoxRef', `The listbox ref has been set.`)

    this.update()
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

  isListBoxItemSelected = (index: number): boolean => {
    return this.selectedListBoxItemIndexes.includes(index)
  }

  get focusedListBoxItemID(): ID {
    return (this.listBoxItemsRef.get(this.focusedListBoxItemIndex) || { current: document.createElement('li') }).current.id
  }

  get focusedListBoxItemRef(): MutableRefObject<HTMLLIElement> {
    return this.listBoxItemsRef.get(this.focusedListBoxItemIndex) || { current: document.createElement('li') }
  }

  get isCollapsed(): boolean {
    return this.expanded === false
  }

  get isExpanded(): boolean {
    return this.expanded === true
  }
}

export default ComboBoxStore
