import { Logger, ObjectUtils } from '@queelag/core'
import { useComponentStore, useID, useSafeRef } from '@queelag/react-core'
import React, { FocusEvent, KeyboardEvent, MouseEvent, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { usePopper } from 'react-popper'
import { ComponentName } from '../definitions/enums'
import {
  ContextMenuBackdropProps,
  ContextMenuChildrenProps,
  ContextMenuListItemAnchorProps,
  ContextMenuListItemProps,
  ContextMenuListProps,
  ContextMenuProps,
  ContextMenuTriggerProps
} from '../definitions/props'
import ContextMenuStore from '../stores/context.menu.store'

const ROOT_PROPS_KEYS: (keyof ContextMenuProps)[] = ['popperOptions']
const ROOT_CHILDREN_PROPS_KEYS: (keyof ContextMenuChildrenProps)[] = [
  'deleteListItemAnchorRef',
  'expanded',
  'listID',
  'popper',
  'setExpanded',
  'setListRef',
  'setListItemAnchorRef',
  'setTriggerRef',
  'triggerID',
  'triggerRef'
]

/**
 * A menu trigger is a trigger that opens a menu. It is often styled as a typical push trigger with a downward pointing arrow or triangle to hint that activating the trigger will display a menu.
 */
export function Root(props: ContextMenuProps) {
  const store = useComponentStore(ContextMenuStore, props)
  const popper = usePopper(store.triggerRef.current, store.listRef.current, { ...props.popperOptions, placement: 'bottom-start', strategy: 'absolute' })

  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    // store.setExpanded(false)
    props.onBlur && props.onBlur(event)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    store.handleKeyboardInteractions(event)
    props.onKeyDown && props.onKeyDown(event)
  }

  return (
    <div {...ObjectUtils.omit(props, ROOT_PROPS_KEYS)} id={store.id} onBlur={onBlur} onKeyDown={onKeyDown} style={{ position: 'relative', ...props.style }}>
      {props.children({
        deleteListItemAnchorRef: store.deleteListItemAnchorRef,
        expanded: store.expanded,
        listID: store.listID,
        popper: popper,
        setTriggerRef: store.setTriggerRef,
        setExpanded: store.setExpanded,
        setListRef: store.setListRef,
        setListItemAnchorRef: store.setListItemAnchorRef,
        triggerID: store.triggerID,
        triggerRef: store.triggerRef
      })}
    </div>
  )
}

export function Backdrop(props: ContextMenuBackdropProps) {
  const id = useID(ComponentName.CONTEXT_MENU_BACKDROP)

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    props.setExpanded(false)
    props.onClick && props.onClick(event)
  }

  const onContextMenu = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    Logger.debug(id, 'onContextMenu', `The default event has been prevented.`)

    props.setExpanded(false)
    props.onContextMenu && props.onContextMenu(event)
  }

  return createPortal(
    <div
      {...ObjectUtils.omit(props, ROOT_CHILDREN_PROPS_KEYS)}
      id={id}
      onClick={onClick}
      onContextMenu={onContextMenu}
      style={{ bottom: 0, left: 0, right: 0, position: 'fixed', top: 0, ...props.style }}
    />,
    document.body
  )
}

export function Trigger(props: ContextMenuTriggerProps) {
  const ref = useSafeRef('div')
  const childRef = useSafeRef('div')

  const onContextMenu = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault()

    childRef.current.style.left = event.clientX + 'px'
    childRef.current.style.top = event.clientY + 'px'
    childRef.current.focus()

    props.popper.forceUpdate && props.popper.forceUpdate()
    props.setExpanded(true)

    props.onContextMenu && props.onContextMenu(event)
  }

  useEffect(() => props.setTriggerRef(childRef), [])

  return (
    <div
      {...ObjectUtils.omit(props, ROOT_CHILDREN_PROPS_KEYS)}
      aria-controls={props.listID}
      aria-expanded={props.expanded}
      id={props.triggerID}
      onContextMenu={onContextMenu}
      ref={ref}
      aria-haspopup
    >
      {props.children}
      {createPortal(<div ref={childRef} style={{ position: 'fixed' }} tabIndex={0} />, document.body)}
    </div>
  )
}

export function List(props: ContextMenuListProps) {
  const ref = useSafeRef('ul')

  useEffect(() => props.setListRef(ref), [])

  return createPortal(
    <ul
      {...props.popper.attributes.popper}
      {...ObjectUtils.omit(props, ROOT_CHILDREN_PROPS_KEYS)}
      aria-labelledby={props.triggerID}
      id={props.listID}
      ref={ref}
      role='menu'
      style={{ ...props.style, ...props.popper.styles.popper }}
      tabIndex={-1}
    />,
    document.body
  )
}

export function ListItem(props: ContextMenuListItemProps) {
  return <li {...ObjectUtils.omit(props, ROOT_CHILDREN_PROPS_KEYS)} role='none' />
}

export function ListItemAnchor(props: ContextMenuListItemAnchorProps) {
  const ref = useSafeRef('a')

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    props.setExpanded(false)
    props.onClick && props.onClick(event)
  }

  useEffect(() => {
    props.setListItemAnchorRef(props.index, ref)
    return () => props.deleteListItemAnchorRef(props.index)
  }, [])

  return <a {...ObjectUtils.omit(props, [...ROOT_CHILDREN_PROPS_KEYS, 'index'])} onClick={onClick} ref={ref} role='menuitem' tabIndex={-1} />
}

export const AriaContextMenu = {
  Root,
  Backdrop,
  Trigger,
  List,
  ListItem,
  ListItemAnchor
}
