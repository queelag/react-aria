import { ID, IDUtils } from '@queelag/core'
import { ComponentStore, ComponentStoreProps, ReactUtils } from '@queelag/react-core'
import { KeyboardEvent, MutableRefObject } from 'react'
import { ComponentName, Key } from '../definitions/enums'
import { MenuButtonProps } from '../definitions/props'
import { StoreLogger } from '../loggers/store.logger'

export class MenuButtonStore extends ComponentStore {
  buttonID: ID
  buttonRef: MutableRefObject<HTMLButtonElement>
  collapsable: boolean
  expanded: boolean
  listID: ID
  listRef: MutableRefObject<HTMLUListElement>
  listItemAnchorsRef: Map<number, MutableRefObject<HTMLAnchorElement>>

  constructor(props: MenuButtonProps & ComponentStoreProps) {
    super(ComponentName.MENU_BUTTON, props)

    this.buttonID = IDUtils.prefixed(ComponentName.MENU_BUTTON_BUTTON)
    this.buttonRef = ReactUtils.createDummyRef('button')
    this.collapsable = true
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
        if (this.isCollapsed) {
          this.setExpanded(true)
          this.focusFirstListItemAnchor()

          break
        }

        this.focusListItemAnchor(this.focusedListItemAnchorIndex < this.listItemAnchorsRef.size - 1 ? this.focusedListItemAnchorIndex + 1 : 0)

        break
      case Key.ARROW_UP:
        if (this.isCollapsed) {
          this.setExpanded(true)
          this.focusLastListItemAnchor()

          break
        }

        this.focusListItemAnchor(this.focusedListItemAnchorIndex > 0 ? this.focusedListItemAnchorIndex - 1 : this.listItemAnchorsRef.size - 1)

        break
      case Key.HOME:
        this.focusFirstListItemAnchor()
        break
      case Key.END:
        this.focusLastListItemAnchor()
        break
      case Key.ENTER:
      case Key.SPACE:
        if (this.isCollapsed) {
          this.focusFirstListItemAnchor()
          this.setExpanded(true)

          break
        }

        this.focusListItemAnchor(this.focusedListItemAnchorIndex)
        break
      case Key.ESCAPE:
        this.setExpanded(false)
        this.focusButton()

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

    this.dispatch()
  }

  focusButton = (): void => {
    this.buttonRef.current.focus()
    StoreLogger.debug(this.id, 'focusButton', `The button has been focused.`)
  }

  focusFirstListItemAnchor = (): void => {
    return this.focusListItemAnchor(0)
  }

  focusLastListItemAnchor = (): void => {
    return this.focusListItemAnchor(this.listItemAnchorsRef.size - 1)
  }

  focusListItemAnchor = (index: number): void => {
    let anchor: MutableRefObject<HTMLAnchorElement> | undefined

    anchor = this.listItemAnchorsRef.get(index)
    if (!anchor) return StoreLogger.error(this.id, 'focusListItemAnchor', `Failed to find the list item anchor ref with index ${index}.`)

    this.collapsable = false
    StoreLogger.debug(this.id, 'focusListItemAnchor', `The collapsable state has been set to false.`)

    anchor.current.focus()
    StoreLogger.debug(this.id, 'focusListItemAnchor', `The list item anchor ref with index ${index} has been focused.`)

    this.collapsable = true
    StoreLogger.debug(this.id, 'focusListItemAnchor', `The collapsable state has been set to true.`)

    this.dispatch()
  }

  get focusedListItemAnchorIndex(): number {
    return [...this.listItemAnchorsRef.values()].findIndex((v: MutableRefObject<HTMLAnchorElement>) => v.current === document.activeElement)
  }

  get isCollapsable(): boolean {
    return this.collapsable === true
  }

  get isCollapsed(): boolean {
    return this.expanded === false
  }

  get isExpanded(): boolean {
    return this.expanded === true
  }
}
