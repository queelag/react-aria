import { ID, IDUtils } from '@queelag/core'
import { ComponentStore, ComponentStoreProps, ReactUtils } from '@queelag/react-core'
import { KeyboardEvent, MutableRefObject } from 'react'
import { ComponentName, Key } from '../definitions/enums'
import { MenuButtonProps } from '../definitions/props'
import { StoreLogger } from '../loggers/store.logger'

export class MenuButtonStore extends ComponentStore {
  buttonID: ID
  buttonRef: MutableRefObject<HTMLButtonElement>
  expanded: boolean
  listID: ID
  listRef: MutableRefObject<HTMLUListElement>
  listItemAnchorsRef: Map<number, MutableRefObject<HTMLAnchorElement>>

  constructor(props: MenuButtonProps & ComponentStoreProps) {
    super(ComponentName.MENU_BUTTON, props)

    this.buttonID = IDUtils.prefixed(ComponentName.MENU_BUTTON_BUTTON)
    this.buttonRef = ReactUtils.createDummyRef('button')
    this.expanded = false
    this.listID = IDUtils.prefixed(ComponentName.MENU_BUTTON_LIST)
    this.listRef = ReactUtils.createDummyRef('ul')
    this.listItemAnchorsRef = new Map()
  }

  handleKeyboardInteractions = (event: KeyboardEvent): void => {
    switch (event.key) {
      case Key.ARROW_DOWN:
      case Key.ARROW_UP:
      case Key.HOME:
      case Key.END:
      case Key.ENTER:
      case Key.SPACE:
      case Key.ESCAPE:
        event.preventDefault()
        event.stopPropagation()
        StoreLogger.verbose(this.id, 'handleKeyboardInteractions', `The default event has been prevented and the propagation has been stopped.`)

        break
    }

    switch (event.key) {
      case Key.ARROW_DOWN:
        let next: MutableRefObject<HTMLAnchorElement> | undefined

        if (this.isCollapsed) {
          let first: MutableRefObject<HTMLAnchorElement> | undefined

          first = this.listItemAnchorsRef.get(0)
          if (!first) return StoreLogger.error(this.id, 'handleKeyboardInteractions', `Failed to find the first list item anchor ref.`)

          this.setExpanded(true)

          first.current.focus()
          StoreLogger.debug(this.id, 'handleKeyboardInteractions', `The first list item anchor ref has been focused.`)

          break
        }

        next = this.listItemAnchorsRef.get(this.focusedListItemAnchorIndex < this.listItemAnchorsRef.size - 1 ? this.focusedListItemAnchorIndex + 1 : 0)
        if (!next) return StoreLogger.error(this.id, 'handleKeyboardInteractions', `Failed to find the next list item anchor ref.`)

        next.current.focus()
        StoreLogger.debug(this.id, 'handleKeyboardInteractions', `The list item anchor ref with index ${this.focusedListItemAnchorIndex} has been focused.`)

        break
      case Key.ARROW_UP:
        let previous: MutableRefObject<HTMLAnchorElement> | undefined

        if (this.isCollapsed) {
          let last: MutableRefObject<HTMLAnchorElement> | undefined

          last = this.listItemAnchorsRef.get(this.listItemAnchorsRef.size - 1)
          if (!last) return StoreLogger.error(this.id, 'handleKeyboardInteractions', `Failed to find the end list item anchor ref.`)

          this.setExpanded(true)

          last.current.focus()
          StoreLogger.debug(this.id, 'handleKeyboardInteractions', `The last list item anchor ref has been focused.`)

          break
        }

        previous = this.listItemAnchorsRef.get(this.focusedListItemAnchorIndex > 0 ? this.focusedListItemAnchorIndex - 1 : this.listItemAnchorsRef.size - 1)
        if (!previous) return StoreLogger.error(this.id, 'handleKeyboardInteractions', `Failed to find the previous list item anchor ref.`)

        previous.current.focus()
        StoreLogger.debug(this.id, 'handleKeyboardInteractions', `The list item anchor ref with index ${this.focusedListItemAnchorIndex} has been focused.`)

        break
      case Key.HOME:
        let first: MutableRefObject<HTMLAnchorElement> | undefined

        first = this.listItemAnchorsRef.get(0)
        if (!first) return StoreLogger.error(this.id, 'handleKeyboardInteractions', `Failed to find the first list item anchor ref.`)

        first.current.focus()
        StoreLogger.debug(this.id, 'handleKeyboardInteractions', `The first list item anchor ref has been focused.`)

        break
      case Key.END:
        let last: MutableRefObject<HTMLAnchorElement> | undefined

        last = this.listItemAnchorsRef.get(this.listItemAnchorsRef.size - 1)
        if (!last) return StoreLogger.error(this.id, 'handleKeyboardInteractions', `Failed to find the end list item anchor ref.`)

        last.current.focus()
        StoreLogger.debug(this.id, 'handleKeyboardInteractions', `The last list item anchor ref has been focused.`)

        break
      case Key.ENTER:
      case Key.SPACE:
        let active: MutableRefObject<HTMLAnchorElement> | undefined

        active = this.listItemAnchorsRef.get(this.focusedListItemAnchorIndex)
        if (!active) return StoreLogger.error(this.id, 'handleKeyboardInteractions', `Failed to find the active list item anchor ref.`)

        active.current.click()
        StoreLogger.debug(this.id, 'handleKeyboardInteractions', `The active list item anchor ref has been clicked.`)

        break
      case Key.ESCAPE:
        this.setExpanded(false)
        break
    }
  }

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

  setListItemAnchorRef = (index: number, ref: MutableRefObject<HTMLAnchorElement>): void => {
    this.listItemAnchorsRef.set(index, ref)
    StoreLogger.verbose(this.id, 'setListItemAnchorRef', `The list item anchor ref with index ${index} has been set.`)
  }

  deleteListItemAnchorRef = (index: number): void => {
    this.listItemAnchorsRef.delete(index)
    StoreLogger.verbose(this.id, 'deleteListItemAnchorRef', `The list item anchor ref with index ${index} has been deleted.`)
  }

  setExpanded = (expanded: boolean): void => {
    this.expanded = expanded
    StoreLogger.debug(this.id, 'setExpanded', `The menu button has been ${expanded ? 'expanded' : 'collapsed'}.`)

    if (this.isCollapsed) {
      this.buttonRef.current.focus()
      StoreLogger.debug(this.id, 'handleKeyboardInteractions', `The button has been focused.`)
    }

    this.dispatch()
  }

  get focusedListItemAnchorIndex(): number {
    return [...this.listItemAnchorsRef.values()].findIndex((v: MutableRefObject<HTMLAnchorElement>) => v.current === document.activeElement)
  }

  get isCollapsed(): boolean {
    return this.expanded === false
  }

  get isExpanded(): boolean {
    return this.expanded === true
  }
}
