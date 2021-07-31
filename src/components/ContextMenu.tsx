import { Logger, ObjectUtils } from '@queelag/core'
import { useForceUpdate, useID } from '@queelag/react-core'
import React, { FocusEvent, KeyboardEvent, MouseEvent, useEffect, useMemo, useRef } from 'react'
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
  'setTriggerRef',
  'setExpanded',
  'setListItemAnchorRef',
  'setListRef',
  'triggerID',
  'triggerRef'
]

/**
 * A menu trigger is a trigger that opens a menu. It is often styled as a typical push trigger with a downward pointing arrow or triangle to hint that activating the trigger will display a menu.
 */
export function Root(props: ContextMenuProps) {
  const update = useForceUpdate()
  const store = useMemo(() => new ContextMenuStore({ ...props, update }), [])
  const popper = usePopper(store.triggerRef.current, store.listRef.current, { ...props.popperOptions, placement: 'bottom-start' })

  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    // store.setExpanded(false)
    props.onBlur && props.onBlur(event)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    store.handleKeyboardInteractions(event)
    props.onKeyDown && props.onKeyDown(event)
  }

  return (
    <div {...ObjectUtils.omit(props, ROOT_PROPS_KEYS)} id={store.id} onBlur={onBlur} onKeyDown={onKeyDown} style={{ ...props.style, position: 'relative' }}>
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

  return (
    <div
      {...ObjectUtils.omit(props, ROOT_CHILDREN_PROPS_KEYS)}
      id={id}
      onClick={onClick}
      onContextMenu={onContextMenu}
      style={{ ...props.style, bottom: 0, left: 0, right: 0, position: 'absolute', top: 0 }}
    />
  )
}

export function Trigger(props: ContextMenuTriggerProps) {
  const ref = useRef(document.createElement('div'))
  const childRef = useRef(document.createElement('div'))

  const onContextMenu = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault()

    childRef.current.style.left = event.clientX + 'px'
    childRef.current.style.top = event.clientY + 'px'
    childRef.current.focus()

    props.popper.forceUpdate && props.popper.forceUpdate()
    props.setExpanded(true)
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
      style={{ ...props.style }}
      aria-haspopup
    >
      {props.children}
      <div ref={childRef} style={{ position: 'absolute' }} tabIndex={0} />
    </div>
  )
}

export function List(props: ContextMenuListProps) {
  const ref = useRef(document.createElement('ul'))

  useEffect(() => props.setListRef(ref), [])

  return (
    <ul
      {...props.popper.attributes.popper}
      {...ObjectUtils.omit(props, ROOT_CHILDREN_PROPS_KEYS)}
      aria-labelledby={props.triggerID}
      id={props.listID}
      ref={ref}
      role='menu'
      style={{ ...props.style, ...props.popper.styles.popper }}
      tabIndex={-1}
    />
  )
}

export function ListItem(props: ContextMenuListItemProps) {
  return <li {...ObjectUtils.omit(props, ROOT_CHILDREN_PROPS_KEYS)} role='none' />
}

export function ListItemAnchor(props: ContextMenuListItemAnchorProps) {
  const ref = useRef(document.createElement('a'))

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
