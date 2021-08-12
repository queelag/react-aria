import { Debounce, noop, ObjectUtils } from '@queelag/core'
import { useComponentStore, useID, useSafeRef } from '@queelag/react-core'
import React, { FocusEvent, KeyboardEvent, MouseEvent, MutableRefObject, useEffect } from 'react'
import { usePopper } from 'react-popper'
import { ComponentName, MenuPopperReferenceElement } from '../definitions/enums'
import {
  MenuChildrenProps,
  MenuItemAnchorProps,
  MenuItemChildrenProps,
  MenuItemMenuItemAnchorProps,
  MenuItemMenuItemProps,
  MenuItemMenuProps,
  MenuItemProps,
  MenuProps
} from '../definitions/props'
import MenuStore from '../stores/menu.store'

const MENU_PROPS_KEYS: (keyof MenuProps)[] = ['autoOpen', 'itemMenuHideDelay', 'label', 'popperReferenceElement']
const MENU_CHILDREN_PROPS_KEYS: (keyof MenuChildrenProps)[] = [
  'autoOpen',
  'deleteItemAnchorRef',
  'deleteItemMenuRef',
  'deleteItemMenuItemAnchorRef',
  'expandedItemIndex',
  'findItemMenuRef',
  'focusItemAnchor',
  'focusedItemIndex',
  'isItemExpanded',
  'popper',
  'rootRef',
  'setExpandedItemIndex',
  'setFocusedItemIndex',
  'setItemAnchorRef',
  'setItemMenuRef',
  'setItemMenuItemAnchorRef'
]
const MENU_ITEM_CHILDREN_PROPS_KEYS: (keyof MenuItemChildrenProps)[] = [
  'autoOpen',
  'deleteItemAnchorRef',
  'deleteItemMenuRef',
  'deleteItemMenuItemAnchorRef',
  'expanded',
  'expandedItemIndex',
  'focusItemAnchor',
  'focusedItemIndex',
  'parentID',
  'parentIndex',
  'popper',
  'setExpandedItemIndex',
  'setItemAnchorRef',
  'setItemMenuRef',
  'setItemMenuItemAnchorRef'
]
const STORE_KEYS: (keyof MenuProps & keyof MenuStore)[] = ['itemMenuHideDelay']

/**
 * A menu is a widget that offers a list of choices to the user, such as a set of actions or functions. Menu widgets behave like native operating system menus, such as the menus that pull down from the menubars commonly found at the top of many desktop application windows.
 */
export function Root(props: MenuProps) {
  const store = useComponentStore(MenuStore, props, STORE_KEYS, 'ul')

  const onBlur = (event: FocusEvent<HTMLUListElement>) => {
    Debounce.handle(store.id, () => store.setExpandedItemIndex(-1), store.itemMenuHideDelay)
    props.onBlur && props.onBlur(event)
  }

  const onFocus = (event: FocusEvent<HTMLUListElement>) => {
    Debounce.handle(store.id, noop, 0)
    props.onFocus && props.onFocus(event)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    store.handleKeyboardInteractions(event)
    props.onKeyDown && props.onKeyDown(event)
  }

  const onMouseEnter = (event: MouseEvent<HTMLUListElement>) => {
    Debounce.handle(store.id, noop, 0)
    props.onMouseEnter && props.onMouseEnter(event)
  }

  const onMouseLeave = (event: MouseEvent<HTMLUListElement>) => {
    Debounce.handle(store.id, () => store.setExpandedItemIndex(-1), store.itemMenuHideDelay)
    props.onMouseLeave && props.onMouseLeave(event)
  }

  return (
    <ul
      {...ObjectUtils.omit(props, MENU_PROPS_KEYS)}
      aria-label={props.label}
      id={store.id}
      onBlur={onBlur}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      ref={store.ref}
      role='menubar'
      style={{ position: store.isPopperReferenceElementRoot ? 'relative' : undefined, ...props.style }}
    >
      {props.children({
        autoOpen: typeof props.autoOpen === 'boolean' ? props.autoOpen : true,
        deleteItemAnchorRef: store.deleteItemAnchorRef,
        deleteItemMenuRef: store.deleteItemMenuRef,
        deleteItemMenuItemAnchorRef: store.deleteItemMenuItemAnchorRef,
        expandedItemIndex: store.expandedItemIndex,
        findItemMenuRef: store.findItemMenuRef,
        focusItemAnchor: store.focusItemAnchor,
        focusedItemIndex: store.focusedItemIndex,
        isItemExpanded: store.isItemExpanded,
        rootRef: store.isPopperReferenceElementRoot ? store.ref : undefined,
        setExpandedItemIndex: store.setExpandedItemIndex,
        setFocusedItemIndex: store.setFocusedItemIndex,
        setItemAnchorRef: store.setItemAnchorRef,
        setItemMenuRef: store.setItemMenuRef,
        setItemMenuItemAnchorRef: store.setItemMenuItemAnchorRef
      })}
    </ul>
  )
}

export function Item(props: MenuItemProps) {
  const id = useID(ComponentName.MENU_ITEM, props.id)
  const ref = useSafeRef('li')
  const popper = usePopper(props.rootRef ? props.rootRef.current : ref.current, props.findItemMenuRef(id).current, props.popperOptions)

  const deleteItemMenuItemAnchorRef = (index: number): void => {
    props.deleteItemMenuItemAnchorRef(props.index, index)
  }

  const setItemMenuItemAnchorRef = (index: number, ref: MutableRefObject<HTMLAnchorElement>): void => {
    props.setItemMenuItemAnchorRef(props.index, index, ref)
  }

  return (
    <li
      {...ObjectUtils.omit(props, [...MENU_CHILDREN_PROPS_KEYS, 'index', 'popperOptions'])}
      id={id}
      ref={ref}
      role='none'
      style={{ position: props.popperReferenceElement === MenuPopperReferenceElement.ITEM ? 'relative' : undefined, ...props.style }}
    >
      {props.children({
        autoOpen: props.autoOpen,
        deleteItemAnchorRef: props.deleteItemAnchorRef,
        deleteItemMenuRef: props.deleteItemMenuRef,
        deleteItemMenuItemAnchorRef: deleteItemMenuItemAnchorRef,
        expanded: props.isItemExpanded(props.index),
        expandedItemIndex: props.expandedItemIndex,
        focusItemAnchor: props.focusItemAnchor,
        focusedItemIndex: props.focusedItemIndex,
        parentID: id,
        parentIndex: props.index,
        popper: popper,
        setExpandedItemIndex: props.setExpandedItemIndex,
        setItemAnchorRef: props.setItemAnchorRef,
        setItemMenuRef: props.setItemMenuRef,
        setItemMenuItemAnchorRef: setItemMenuItemAnchorRef
      })}
    </li>
  )
}

export function ItemAnchor(props: MenuItemAnchorProps) {
  const id = useID(ComponentName.MENU_ITEM_ANCHOR, props.id)
  const ref = useSafeRef('a')

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    props.autoOpen === false && props.setExpandedItemIndex(props.expanded ? -1 : props.parentIndex, 0)
    props.onClick && props.onClick(event)
  }

  const onMouseEnter = (event: MouseEvent<HTMLAnchorElement>) => {
    if (props.autoOpen || props.expandedItemIndex >= 0) {
      props.focusItemAnchor(props.parentIndex)
      props.setExpandedItemIndex(props.parentIndex)
    }

    props.onMouseEnter && props.onMouseEnter(event)
  }

  useEffect(() => {
    props.setItemAnchorRef(props.parentIndex, ref)
    return () => props.deleteItemAnchorRef(props.parentIndex)
  }, [])

  return (
    <a
      {...ObjectUtils.omit(props, MENU_ITEM_CHILDREN_PROPS_KEYS)}
      aria-expanded={props.expanded}
      id={id}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      ref={ref}
      role='menuitem'
      tabIndex={(props.parentIndex === 0 && props.focusedItemIndex <= 0) || props.expanded ? 0 : -1}
      aria-haspopup
    />
  )
}

export function ItemMenu(props: MenuItemMenuProps) {
  const id = useID(ComponentName.MENU_ITEM_MENU, props.id)
  const ref = useSafeRef('ul')

  useEffect(() => {
    props.setItemMenuRef(props.parentID, ref)
    return () => props.deleteItemMenuRef(props.parentID)
  }, [props.parentID])

  return (
    <ul
      {...props.popper.attributes.popper}
      {...ObjectUtils.omit(props, MENU_ITEM_CHILDREN_PROPS_KEYS)}
      aria-label={props.parentID}
      id={id}
      ref={ref}
      role='menu'
      style={{ zIndex: props.expanded ? 1 : 0, ...props.style, ...props.popper.styles.popper }}
    />
  )
}

export function ItemMenuItem(props: MenuItemMenuItemProps) {
  const id = useID(ComponentName.MENU_ITEM_MENU_ITEM, props.id)
  return <li {...ObjectUtils.omit(props, MENU_ITEM_CHILDREN_PROPS_KEYS)} id={id} role='none' />
}

export function ItemMenuItemAnchor(props: MenuItemMenuItemAnchorProps) {
  const id = useID(ComponentName.MENU_ITEM_MENU_ITEM_ANCHOR, props.id)
  const ref = useSafeRef('a')

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    props.setExpandedItemIndex(-1, 0)
    props.onClick && props.onClick(event)
  }

  useEffect(() => {
    props.setItemMenuItemAnchorRef(props.index, ref)
    return () => props.deleteItemMenuItemAnchorRef(props.index)
  }, [])

  return <a {...ObjectUtils.omit(props, [...MENU_ITEM_CHILDREN_PROPS_KEYS, 'index'])} id={id} onClick={onClick} ref={ref} role='menuitem' tabIndex={-1} />
}

export const AriaMenu = {
  Root,
  Item,
  ItemAnchor,
  ItemMenu,
  ItemMenuItem,
  ItemMenuItemAnchor
}
