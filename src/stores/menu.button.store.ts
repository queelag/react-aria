import { ID, IDUtils, Logger } from '@queelag/core'
import { ComponentStore } from '@queelag/react-core'
import { KeyboardEvent, MutableRefObject } from 'react'
import { ComponentName, Key } from '../definitions/enums'

class MenuButtonStore extends ComponentStore<HTMLDivElement> {
  buttonID: ID
  buttonRef: MutableRefObject<HTMLButtonElement>
  expanded: boolean
  listID: ID
  listRef: MutableRefObject<HTMLUListElement>
  listItemAnchorsRef: Map<number, MutableRefObject<HTMLAnchorElement>>

  constructor(update: () => void, id?: ID) {
    super(ComponentName.MENU_BUTTON, id, undefined, update)

    this.buttonID = IDUtils.prefixed(ComponentName.MENU_BUTTON_BUTTON)
    this.buttonRef = { current: document.createElement('button') }
    this.expanded = false
    this.listID = IDUtils.prefixed(ComponentName.MENU_BUTTON_LIST)
    this.listRef = { current: document.createElement('ul') }
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
        Logger.debug(this.id, 'handleKeyboardInteractions', `The default event has been prevented`)

        break
    }

    switch (event.key) {
      case Key.ARROW_DOWN:
        let next: MutableRefObject<HTMLAnchorElement> | undefined

        if (this.isCollapsed) {
          let first: MutableRefObject<HTMLAnchorElement> | undefined

          first = this.listItemAnchorsRef.get(0)
          if (!first) return Logger.error(this.id, 'handleKeyboardInteractions', `Failed to find the first list item anchor ref.`)

          this.setExpanded(true)

          first.current.focus()
          Logger.debug(this.id, 'handleKeyboardInteractions', `The first list item anchor ref has been focused.`)

          break
        }

        next = this.listItemAnchorsRef.get(this.focusedListItemAnchorIndex < this.listItemAnchorsRef.size - 1 ? this.focusedListItemAnchorIndex + 1 : 0)
        if (!next) return Logger.error(this.id, 'handleKeyboardInteractions', `Failed to find the next list item anchor ref.`)

        next.current.focus()
        Logger.debug(this.id, 'handleKeyboardInteractions', `The list item anchor ref with index ${this.focusedListItemAnchorIndex} has been focused.`)

        break
      case Key.ARROW_UP:
        let previous: MutableRefObject<HTMLAnchorElement> | undefined

        if (this.isCollapsed) {
          let last: MutableRefObject<HTMLAnchorElement> | undefined

          last = this.listItemAnchorsRef.get(this.listItemAnchorsRef.size - 1)
          if (!last) return Logger.error(this.id, 'handleKeyboardInteractions', `Failed to find the end list item anchor ref.`)

          this.setExpanded(true)

          last.current.focus()
          Logger.debug(this.id, 'handleKeyboardInteractions', `The last list item anchor ref has been focused.`)

          break
        }

        previous = this.listItemAnchorsRef.get(this.focusedListItemAnchorIndex > 0 ? this.focusedListItemAnchorIndex - 1 : this.listItemAnchorsRef.size - 1)
        if (!previous) return Logger.error(this.id, 'handleKeyboardInteractions', `Failed to find the previous list item anchor ref.`)

        previous.current.focus()
        Logger.debug(this.id, 'handleKeyboardInteractions', `The list item anchor ref with index ${this.focusedListItemAnchorIndex} has been focused.`)

        break
      case Key.HOME:
        let first: MutableRefObject<HTMLAnchorElement> | undefined

        first = this.listItemAnchorsRef.get(0)
        if (!first) return Logger.error(this.id, 'handleKeyboardInteractions', `Failed to find the first list item anchor ref.`)

        first.current.focus()
        Logger.debug(this.id, 'handleKeyboardInteractions', `The first list item anchor ref has been focused.`)

        break
      case Key.END:
        let last: MutableRefObject<HTMLAnchorElement> | undefined

        last = this.listItemAnchorsRef.get(this.listItemAnchorsRef.size - 1)
        if (!last) return Logger.error(this.id, 'handleKeyboardInteractions', `Failed to find the end list item anchor ref.`)

        last.current.focus()
        Logger.debug(this.id, 'handleKeyboardInteractions', `The last list item anchor ref has been focused.`)

        break
      case Key.ENTER:
      case Key.SPACE:
        let active: MutableRefObject<HTMLAnchorElement> | undefined

        active = this.listItemAnchorsRef.get(this.focusedListItemAnchorIndex)
        if (!active) return Logger.error(this.id, 'handleKeyboardInteractions', `Failed to find the active list item anchor ref.`)

        active.current.click()
        Logger.debug(this.id, 'handleKeyboardInteractions', `The active list item anchor ref has been clicked.`)

        break
      case Key.ESCAPE:
        this.setExpanded(false)
        break
    }
  }

  setButtonRef = (ref: MutableRefObject<HTMLButtonElement>): void => {
    this.buttonRef = ref
    Logger.debug(this.id, 'setButtonRef', `The button ref has been set.`)
  }

  setListRef = (ref: MutableRefObject<HTMLUListElement>): void => {
    this.listRef = ref
    Logger.debug(this.id, 'setListRef', `The list ref has been set.`)
  }

  setListItemAnchorRef = (index: number, ref: MutableRefObject<HTMLAnchorElement>): void => {
    this.listItemAnchorsRef.set(index, ref)
    Logger.debug(this.id, 'setListItemAnchorRef', `The list item anchor ref with index ${index} has been set.`)
  }

  deleteListItemAnchorRef = (index: number): void => {
    this.listItemAnchorsRef.delete(index)
    Logger.debug(this.id, 'deleteListItemAnchorRef', `The list item anchor ref with index ${index} has been deleted.`)
  }

  setExpanded = (expanded: boolean): void => {
    this.expanded = expanded
    Logger.debug(this.id, 'setExpanded', `The menu button has been ${expanded ? 'expanded' : 'collapsed'}.`)

    if (this.isCollapsed) {
      this.buttonRef.current.focus()
      Logger.debug(this.id, 'handleKeyboardInteractions', `The button has been focused.`)
    }

    this.update()
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

export default MenuButtonStore
