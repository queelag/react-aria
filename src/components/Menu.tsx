import { omit } from 'lodash'
import React, { FocusEvent, KeyboardEvent, MouseEvent, MutableRefObject, useEffect, useMemo, useRef } from 'react'
import { usePopper } from 'react-popper'
import { ComponentName } from '../definitions/enums'
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
import useForceUpdate from '../hooks/use.force.update'
import useID from '../hooks/use.id'
import Debounce from '../modules/debounce'
import noop from '../modules/noop'
import MenuStore from '../stores/menu.store'

const MENU_CHILDREN_PROPS_KEYS: (keyof MenuChildrenProps)[] = [
  'deleteItemAnchorRef',
  'deleteItemMenuRef',
  'deleteItemMenuItemAnchorRef',
  'expandedItemIndex',
  'findItemMenuRef',
  'focusedItemIndex',
  'isItemExpanded',
  'setExpandedItemIndex',
  'setFocusedItemIndex',
  'setItemAnchorRef',
  'setItemMenuRef',
  'setItemMenuItemAnchorRef'
]

const MENU_ITEM_CHILDREN_PROPS_KEYS: (keyof MenuItemChildrenProps)[] = [
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
  'setItemAnchorRef',
  'setItemMenuRef',
  'setItemMenuItemAnchorRef'
]

function Root(props: MenuProps) {
  const update = useForceUpdate()
  const store = useMemo(() => new MenuStore(update, props.id), [])

  const onBlur = (event: FocusEvent<HTMLUListElement>) => {
    store.setExpandedItemIndex(-1)
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
    store.setExpandedItemIndex(-1)
    props.onMouseLeave && props.onMouseLeave(event)
  }

  return (
    <ul
      {...omit(props, 'label')}
      aria-label={props.label}
      id={store.id}
      onBlur={onBlur}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role='menubar'
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
        setExpandedItemIndex: store.setExpandedItemIndex,
        setFocusedItemIndex: store.setFocusedItemIndex,
        setItemAnchorRef: store.setItemAnchorRef,
        setItemMenuRef: store.setItemMenuRef,
        setItemMenuItemAnchorRef: store.setItemMenuItemAnchorRef
      })}
    </ul>
  )
}

function Item(props: MenuItemProps) {
  const id = useID(ComponentName.MENU_ITEM, props.id)
  const ref = useRef(document.createElement('li'))
  const popper = usePopper(ref.current, props.findItemMenuRef(id).current, props.popperOptions)

  const deleteItemMenuItemAnchorRef = (index: number): void => {
    props.deleteItemMenuItemAnchorRef(props.index, index)
  }

  const setItemMenuItemAnchorRef = (index: number, ref: MutableRefObject<HTMLAnchorElement>): void => {
    props.setItemMenuItemAnchorRef(props.index, index, ref)
  }

  return (
    <li {...omit(props, MENU_CHILDREN_PROPS_KEYS, 'index', 'popperOptions')} id={id} ref={ref} role='none' style={{ ...props.style, position: 'relative' }}>
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

function ItemAnchor(props: MenuItemAnchorProps) {
  const id = useID(ComponentName.MENU_ITEM_ANCHOR, props.id)
  const ref = useRef(document.createElement('a'))

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
      {...omit(props, MENU_ITEM_CHILDREN_PROPS_KEYS)}
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

function ItemMenu(props: MenuItemMenuProps) {
  const id = useID(ComponentName.MENU_ITEM_MENU, props.id)
  const ref = useRef(document.createElement('ul'))

  useEffect(() => {
    props.setItemMenuRef(props.parentID, ref)
    return () => props.deleteItemMenuRef(props.parentID)
  }, [])

  return (
    <ul
      {...props.popper.attributes.popper}
      {...omit(props, MENU_ITEM_CHILDREN_PROPS_KEYS)}
      aria-label={props.parentID}
      id={id}
      ref={ref}
      role='menu'
      style={{ ...props.style, ...props.popper.styles.popper, zIndex: props.expanded ? 1 : 0 }}
    />
  )
}

function ItemMenuItem(props: MenuItemMenuItemProps) {
  const id = useID(ComponentName.MENU_ITEM_MENU_ITEM, props.id)
  return <li {...omit(props, MENU_ITEM_CHILDREN_PROPS_KEYS)} id={id} role='none' />
}

function ItemMenuItemAnchor(props: MenuItemMenuItemAnchorProps) {
  const id = useID(ComponentName.MENU_ITEM_MENU_ITEM_ANCHOR, props.id)
  const ref = useRef(document.createElement('a'))

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    props.setExpandedItemIndex(-1, 0)
    props.onClick && props.onClick(event)
  }

  useEffect(() => {
    props.setItemMenuItemAnchorRef(props.index, ref)
    return () => props.deleteItemMenuItemAnchorRef(props.index)
  }, [])

  return <a {...omit(props, MENU_ITEM_CHILDREN_PROPS_KEYS, 'index')} id={id} onClick={onClick} ref={ref} role='menuitem' tabIndex={-1} />
}

const Menu = { Root, Item, ItemAnchor, ItemMenu, ItemMenuItem, ItemMenuItemAnchor }
export { Menu }
