import { ObjectUtils } from '@queelag/core'
import { useForceUpdate } from '@queelag/react-core'
import React, { FocusEvent, KeyboardEvent, MouseEvent, useEffect, useMemo, useRef } from 'react'
import { usePopper } from 'react-popper'
import {
  MenuButtonButtonProps,
  MenuButtonChildrenProps,
  MenuButtonListItemAnchorProps,
  MenuButtonListItemProps,
  MenuButtonListProps,
  MenuButtonProps
} from '../definitions/props'
import MenuButtonStore from '../stores/menu.button.store'

const MENU_BUTTON_CHILDREN_PROPS_KEYS: (keyof MenuButtonChildrenProps)[] = [
  'buttonID',
  'deleteListItemAnchorRef',
  'expanded',
  'listID',
  'popper',
  'setButtonRef',
  'setExpanded',
  'setListItemAnchorRef',
  'setListRef'
]

/**
 * A menu button is a button that opens a menu. It is often styled as a typical push button with a downward pointing arrow or triangle to hint that activating the button will display a menu.
 */
export function Root(props: MenuButtonProps) {
  const update = useForceUpdate()
  const store = useMemo(() => new MenuButtonStore(update, props.id), [])
  const popper = usePopper(store.buttonRef.current, store.listRef.current, props.popperOptions)

  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    // store.setExpanded(false)
    props.onBlur && props.onBlur(event)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    store.handleKeyboardInteractions(event)
    props.onKeyDown && props.onKeyDown(event)
  }

  return (
    <div {...ObjectUtils.omit(props, 'popperOptions')} id={store.id} onBlur={onBlur} onKeyDown={onKeyDown} style={{ ...props.style, position: 'relative' }}>
      {props.children({
        buttonID: store.buttonID,
        deleteListItemAnchorRef: store.deleteListItemAnchorRef,
        expanded: store.expanded,
        listID: store.listID,
        popper: popper,
        setButtonRef: store.setButtonRef,
        setExpanded: store.setExpanded,
        setListRef: store.setListRef,
        setListItemAnchorRef: store.setListItemAnchorRef
      })}
    </div>
  )
}

export function Button(props: MenuButtonButtonProps) {
  const ref = useRef(document.createElement('button'))

  const onClick = () => {
    props.setExpanded(!props.expanded)
  }

  useEffect(() => props.setButtonRef(ref), [])

  return (
    <button
      {...ObjectUtils.omit(props, ...MENU_BUTTON_CHILDREN_PROPS_KEYS)}
      aria-controls={props.listID}
      aria-expanded={props.expanded}
      id={props.buttonID}
      onClick={onClick}
      ref={ref}
      type='button'
      aria-haspopup
    />
  )
}

export function List(props: MenuButtonListProps) {
  const ref = useRef(document.createElement('ul'))

  useEffect(() => props.setListRef(ref), [])

  return (
    <ul
      {...props.popper.attributes.popper}
      {...ObjectUtils.omit(props, ...MENU_BUTTON_CHILDREN_PROPS_KEYS)}
      aria-labelledby={props.buttonID}
      id={props.listID}
      ref={ref}
      role='menu'
      style={{ ...props.style, ...props.popper.styles.popper }}
      tabIndex={-1}
    />
  )
}

export function ListItem(props: MenuButtonListItemProps) {
  return <li {...ObjectUtils.omit(props, ...MENU_BUTTON_CHILDREN_PROPS_KEYS)} role='none' />
}

export function ListItemAnchor(props: MenuButtonListItemAnchorProps) {
  const ref = useRef(document.createElement('a'))

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    props.setExpanded(false)
    props.onClick && props.onClick(event)
  }

  useEffect(() => {
    props.setListItemAnchorRef(props.index, ref)
    return () => props.deleteListItemAnchorRef(props.index)
  }, [])

  return <a {...ObjectUtils.omit(props, ...MENU_BUTTON_CHILDREN_PROPS_KEYS, 'index')} onClick={onClick} ref={ref} role='menuitem' tabIndex={-1} />
}

export const AriaMenuButton = {
  Root,
  Button,
  List,
  ListItem,
  ListItemAnchor
}
