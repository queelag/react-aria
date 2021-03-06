import { ID, noop } from '@queelag/core'
import { ComponentStore, ComponentStoreProps, ReactUtils } from '@queelag/react-core'
import { KeyboardEvent, MutableRefObject } from 'react'
import { ComponentName, Key, ListBoxSelectMode } from '../definitions/enums'
import { ListBoxProps } from '../definitions/props'
import { StoreLogger } from '../loggers/store.logger'

export class ListBoxStore extends ComponentStore {
  buttonRef: MutableRefObject<HTMLButtonElement>
  expanded: boolean
  focusedListItemIndex: number
  listItemsRef: Map<number, MutableRefObject<HTMLLIElement>>
  listRef: MutableRefObject<HTMLUListElement>
  selectMode: ListBoxSelectMode
  selectedListItemIndexes: number[]

  constructor(props: ListBoxProps & ComponentStoreProps) {
    super(ComponentName.LIST_BOX, props)

    this.buttonRef = ReactUtils.createDummyRef('button')
    this.expanded = false
    this.focusedListItemIndex = -1
    this.listItemsRef = new Map()
    this.listRef = ReactUtils.createDummyRef('ul')
    this.onSelectListItem = props.onSelectListItem || noop
    this.selectMode = props.selectMode || ListBoxSelectMode.SINGLE
    this.selectedListItemIndexes = []
  }

  handleKeyboardInteractions = (event: KeyboardEvent<HTMLDivElement>): void => {
    switch (event.key) {
      case Key.A:
      case Key.ARROW_DOWN:
      case Key.ARROW_UP:
      case Key.ENTER:
      case Key.SPACE:
      case Key.ESCAPE:
      case Key.HOME:
      case Key.END:
        event.preventDefault()
        event.stopPropagation()
        StoreLogger.verbose(this.id, 'handleKeyboardInteractions', `The default event has been prevented and the propagation has been stopped.`)

        break
    }

    switch (event.key) {
      case Key.A:
        if (event.ctrlKey && this.isSelectModeMultiple) {
          this.setSelectedListItemIndexes([...this.listItemsRef.values()].map((v, k: number) => [k, true]))
        }

        break
      case Key.ARROW_DOWN:
        this.isCollapsed && this.setExpanded(true, this.id, 'handleKeyboardInteractions')
        this.setFocusedListItemIndex(this.focusedListItemIndex < this.listItemsRef.size - 1 ? this.focusedListItemIndex + 1 : 0)

        if (event.shiftKey || this.isSelectModeSingle) {
          this.setSelectedListItemIndex(this.focusedListItemIndex, true)
        }

        break
      case Key.ARROW_UP:
        this.isCollapsed && this.setExpanded(true, this.id, 'handleKeyboardInteractions')
        this.setFocusedListItemIndex(this.focusedListItemIndex > 0 ? this.focusedListItemIndex - 1 : this.listItemsRef.size - 1)

        if (event.shiftKey || this.isSelectModeSingle) {
          this.setSelectedListItemIndex(this.focusedListItemIndex, true)
        }

        break
      case Key.ENTER:
      case Key.SPACE:
        if (this.isSelectModeMultiple) {
          let listItemRef: MutableRefObject<HTMLLIElement> | undefined

          if (this.isCollapsed) {
            return StoreLogger.warn(this.id, 'handleKeyboardInteractions', event.key, `The listbox is collapsed, can't proceed.`)
          }

          listItemRef = this.listItemsRef.get(this.focusedListItemIndex)
          if (!listItemRef) return StoreLogger.error(this.id, 'handleKeyboardInteractions', event.key, `Failed to find the ref of the focused listbox item.`)

          listItemRef.current.click()
        }

        break
      case Key.ESCAPE:
        this.setExpanded(false, this.id, 'handleKeyboardInteractions')

        break
      case Key.HOME:
        switch (this.selectMode) {
          case ListBoxSelectMode.MULTIPLE:
            if (event.ctrlKey && event.shiftKey) {
              this.setSelectedListItemIndexes([...this.listItemsRef.values()].map((v, k: number) => [k, k >= 0 && k <= this.focusedListItemIndex]))
            }

            break
          case ListBoxSelectMode.SINGLE:
            this.setFocusedListItemIndex(0)
            this.setSelectedListItemIndex(this.focusedListItemIndex, true)

            break
        }

        break
      case Key.END:
        switch (this.selectMode) {
          case ListBoxSelectMode.MULTIPLE:
            if (event.ctrlKey && event.shiftKey) {
              this.setSelectedListItemIndexes([...this.listItemsRef.values()].map((v, k: number) => [k, k >= this.focusedListItemIndex]))
            }

            break
          case ListBoxSelectMode.SINGLE:
            this.setFocusedListItemIndex(this.listItemsRef.size - 1)
            this.setSelectedListItemIndex(this.focusedListItemIndex, true)

            break
        }

        break
    }
  }

  onSelectListItem(indexes: number[]): void {}

  setButtonRef = (ref: MutableRefObject<HTMLButtonElement>): void => {
    this.buttonRef = ref
    StoreLogger.verbose(this.id, 'setButtonRef', `The button ref has been set.`)

    this.dispatch()
  }

  setListRef = (ref: MutableRefObject<HTMLUListElement>): void => {
    this.listRef = ref
    StoreLogger.verbose(this.id, 'setListRef', `The list ref has been set.`)

    this.dispatch()
  }

  setListItemRef = (index: number, ref: MutableRefObject<HTMLLIElement>): void => {
    this.listItemsRef.set(index, ref)
    StoreLogger.verbose(this.id, 'setListItemRef', `The ref of the list item with index ${index} has been set.`)
  }

  deleteListItemRef = (index: number): void => {
    this.listItemsRef.delete(index)
    StoreLogger.verbose(this.id, 'deleteListItemRef', `The ref of the list item with index ${index} has been deleted.`)
  }

  setExpanded = (expanded: boolean, id: ID, context: string): void => {
    this.expanded = expanded
    StoreLogger.debug(id, context, `The list box has been ${expanded ? 'expanded' : 'collapsed'}.`)

    if (this.isCollapsed) {
      this.buttonRef.current.focus()
      StoreLogger.debug(id, context, `The button has been focused.`)
    }

    if (this.isExpanded) {
      this.listRef.current.focus()
      StoreLogger.debug(id, context, `The list has been focused.`)
    }

    this.dispatch()
  }

  setFocusedListItemIndex = (index: number): void => {
    this.focusedListItemIndex = index
    StoreLogger.debug(this.id, 'setFocusedListItemIndex', `The list item with index ${index} has been focused.`)

    this.dispatch()
  }

  setSelectedListItemIndex = (index: number, selected: boolean): void => {
    switch (this.selectMode) {
      case ListBoxSelectMode.MULTIPLE:
        this.selectedListItemIndexes = selected ? [...this.selectedListItemIndexes, index] : this.selectedListItemIndexes.filter((v: number) => v !== index)
        break
      case ListBoxSelectMode.SINGLE:
        this.selectedListItemIndexes = selected ? [index] : []
        break
    }

    StoreLogger.debug(this.id, 'setSelectedListItemID', this.selectMode, `The list item with index ${index} has been ${selected ? 'selected' : 'unselected'}.`)

    this.listRef.current.focus()
    StoreLogger.debug(this.id, 'setSelectedListItemID', `The list has been focused.`)

    this.onSelectListItem === noop ? this.dispatch() : this.onSelectListItem(this.selectedListItemIndexes)
  }

  setSelectedListItemIndexes = (indexes: [number, boolean][]): void => {
    indexes.forEach((v: [number, boolean]) => this.setSelectedListItemIndex(v[0], v[1]))
  }

  isListItemFocused = (index: number): boolean => {
    return this.focusedListItemIndex === index
  }

  isListItemSelected = (index: number): boolean => {
    return this.selectedListItemIndexes.includes(index)
  }

  get focusedListItemID(): ID {
    return (this.listItemsRef.get(this.focusedListItemIndex) || ReactUtils.createDummyRef('div')).current.id
  }

  get isCollapsed(): boolean {
    return this.expanded === false
  }

  get isExpanded(): boolean {
    return this.expanded === true
  }

  get isSelectModeMultiple(): boolean {
    return this.selectMode === ListBoxSelectMode.MULTIPLE
  }

  get isSelectModeSingle(): boolean {
    return this.selectMode === ListBoxSelectMode.SINGLE
  }
}
