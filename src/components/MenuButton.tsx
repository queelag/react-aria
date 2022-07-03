import { ObjectUtils } from '@queelag/core'
import { forwardRef, useComponentStore, useSafeRef } from '@queelag/react-core'
import React, { FocusEvent, ForwardedRef, KeyboardEvent, MouseEvent, useEffect } from 'react'
import { usePopper } from 'react-popper'
import {
  MenuButtonButtonProps,
  MenuButtonChildrenProps,
  MenuButtonListItemAnchorProps,
  MenuButtonListItemProps,
  MenuButtonListProps,
  MenuButtonProps
} from '../definitions/props'
import { MenuButtonStore } from '../stores/menu.button.store'

const ROOT_PROPS_KEYS: (keyof MenuButtonProps)[] = ['getStore', 'popperOptions']
const ROOT_CHILDREN_PROPS_KEYS: (keyof MenuButtonChildrenProps)[] = [
  'buttonID',
  'deleteListItemAnchorRef',
  'expanded',
  'focusFirstListItemAnchor',
  'focusedListItemAnchorIndex',
  'listID',
  'popper',
  'setButtonRef',
  'setExpanded',
  'setListRef',
  'setListItemAnchorRef'
]

/**
 * A menu button is a button that opens a menu. It is often styled as a typical push button with a downward pointing arrow or triangle to hint that activating the button will display a menu.
 */
export const Root = forwardRef((props: MenuButtonProps, ref: ForwardedRef<HTMLDivElement>) => {
  const store = useComponentStore(MenuButtonStore, props)
  const popper = usePopper(store.buttonRef.current, store.listRef.current, props.popperOptions)

  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (store.isCollapsable) {
      store.setExpanded(false)
    }

    props.onBlur && props.onBlur(event)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    store.handleKeyboardInteractions(event)
    props.onKeyDown && props.onKeyDown(event)
  }

  return (
    <div
      {...ObjectUtils.omit(props, ROOT_PROPS_KEYS)}
      id={store.id}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      ref={ref}
      style={{ position: 'relative', ...props.style }}
    >
      {props.children({
        buttonID: store.buttonID,
        deleteListItemAnchorRef: store.deleteListItemAnchorRef,
        expanded: store.expanded,
        focusFirstListItemAnchor: store.focusFirstListItemAnchor,
        focusedListItemAnchorIndex: store.focusedListItemAnchorIndex,
        listID: store.listID,
        popper: popper,
        setButtonRef: store.setButtonRef,
        setExpanded: store.setExpanded,
        setListRef: store.setListRef,
        setListItemAnchorRef: store.setListItemAnchorRef
      })}
    </div>
  )
})

export function Button(props: MenuButtonButtonProps) {
  const ref = useSafeRef('button')

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    props.setExpanded(!props.expanded)

    if (props.expanded) {
      ref.current.focus()
    }

    if (!props.expanded) {
      props.focusFirstListItemAnchor()
    }

    props.onClick && props.onClick(event)
  }

  const onMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    props.onMouseDown && props.onMouseDown(event)
  }

  useEffect(() => props.setButtonRef(ref), [])

  return (
    <button
      {...ObjectUtils.omit(props, ROOT_CHILDREN_PROPS_KEYS)}
      aria-controls={props.listID}
      aria-expanded={props.expanded}
      id={props.buttonID}
      onClick={onClick}
      onMouseDown={onMouseDown}
      ref={ref}
      type='button'
      aria-haspopup
    />
  )
}

export function List(props: MenuButtonListProps) {
  const ref = useSafeRef('ul')

  useEffect(() => props.setListRef(ref), [])

  return (
    <ul
      {...props.popper.attributes.popper}
      {...ObjectUtils.omit(props, ROOT_CHILDREN_PROPS_KEYS)}
      aria-labelledby={props.buttonID}
      id={props.listID}
      ref={ref}
      role='menu'
      style={{ ...props.style, ...props.popper.styles.popper }}
      tabIndex={-1}
    />
  )
}

export const ListItem = forwardRef((props: MenuButtonListItemProps, ref: ForwardedRef<HTMLLIElement>) => {
  return <li {...ObjectUtils.omit(props, ROOT_CHILDREN_PROPS_KEYS)} ref={ref} role='none' />
})

export function ListItemAnchor(props: MenuButtonListItemAnchorProps) {
  const ref = useSafeRef('a')

  const onClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    props.setExpanded(false)
    props.onClick && props.onClick(event)
  }

  useEffect(() => {
    props.setListItemAnchorRef(props.index, ref)
    return () => props.deleteListItemAnchorRef(props.index)
  }, [])

  return (
    <a
      {...ObjectUtils.omit(props, [...ROOT_CHILDREN_PROPS_KEYS, 'index'])}
      onClick={onClick}
      ref={ref}
      role='menuitem'
      tabIndex={props.expanded ? (props.index === props.focusedListItemAnchorIndex ? 0 : -1) : props.index === 0 ? 0 : -1}
    />
  )
}

export const AriaMenuButton = {
  Root,
  Button,
  List,
  ListItem,
  ListItemAnchor
}
