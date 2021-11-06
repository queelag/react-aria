import { ObjectUtils } from '@queelag/core'
import { useComponentStore, useID, useSafeRef } from '@queelag/react-core'
import React, { FocusEvent, ForwardedRef, forwardRef, KeyboardEvent, MouseEvent, useEffect } from 'react'
import { usePopper } from 'react-popper'
import { ComponentName, ListBoxSelectMode } from '../definitions/enums'
import { ListBoxButtonProps, ListBoxChildrenProps, ListBoxListItemProps, ListBoxListProps, ListBoxProps } from '../definitions/props'
import { ListBoxStore } from '../stores/list.box.store'

const ROOT_PROPS_KEYS: (keyof ListBoxProps)[] = ['collapsable', 'getStore', 'onSelectListItem', 'popperOptions', 'selectMode', 'selectedListItemIndexes']
const ROOT_CHILDREN_PROPS_KEYS: (keyof ListBoxChildrenProps)[] = [
  'collapsable',
  'deleteListItemRef',
  'expanded',
  'focusedListItemID',
  'isListItemFocused',
  'isListItemSelected',
  'popper',
  'selectMode',
  'setButtonRef',
  'setExpanded',
  'setFocusedListItemIndex',
  'setListRef',
  'setListItemRef',
  'setSelectedListItemIndex'
]
const STORE_KEYS: (keyof ListBoxProps & keyof ListBoxStore)[] = ['onSelectListItem', 'selectMode', 'selectedListItemIndexes']

/**
 * A listbox widget presents a list of options and allows a user to select one or more of them. A listbox that allows a single option to be chosen is a single-select listbox; one that allows multiple options to be selected is a multi-select listbox.
 */
export const Root = forwardRef((props: ListBoxProps, ref: ForwardedRef<HTMLDivElement>) => {
  const store = useComponentStore(ListBoxStore, props, STORE_KEYS)
  const popper = usePopper(store.buttonRef.current, store.listRef.current, props.popperOptions)

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    store.handleKeyboardInteractions(event)
    props.onKeyDown && props.onKeyDown(event)
  }

  return (
    <div {...ObjectUtils.omit(props, ROOT_PROPS_KEYS)} id={store.id} onKeyDown={onKeyDown} ref={ref} style={{ position: 'relative', ...props.style }}>
      {props.children({
        collapsable: props.collapsable,
        deleteListItemRef: store.deleteListItemRef,
        expanded: store.expanded,
        focusedListItemID: store.focusedListItemID,
        isListItemFocused: store.isListItemFocused,
        isListItemSelected: store.isListItemSelected,
        popper,
        selectMode: store.selectMode,
        setButtonRef: store.setButtonRef,
        setExpanded: store.setExpanded,
        setFocusedListItemIndex: store.setFocusedListItemIndex,
        setListItemRef: store.setListItemRef,
        setListRef: store.setListRef,
        setSelectedListItemIndex: store.setSelectedListItemIndex
      })}
    </div>
  )
})

export function Button(props: ListBoxButtonProps) {
  const id = useID(ComponentName.LIST_BOX_BUTTON, props.id)
  const ref = useSafeRef('button')

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    props.setExpanded(!props.expanded, id, 'onClick')
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
      aria-expanded={props.collapsable && props.expanded}
      aria-haspopup={props.collapsable ? 'listbox' : undefined}
      id={id}
      onClick={onClick}
      onMouseDown={onMouseDown}
      ref={ref}
      type='button'
    />
  )
}

export function List(props: ListBoxListProps) {
  const id = useID(ComponentName.LIST_BOX_LIST, props.id)
  const ref = useSafeRef('ul')

  const onBlur = (event: FocusEvent<HTMLUListElement>) => {
    props.setExpanded(false, id, 'onBlur')
    props.onBlur && props.onBlur(event)
  }

  useEffect(() => props.setListRef(ref), [])

  return (
    <ul
      {...(props.collapsable && props.popper.attributes.popper)}
      {...ObjectUtils.omit(props, ROOT_CHILDREN_PROPS_KEYS)}
      aria-activedescendant={props.focusedListItemID}
      aria-multiselectable={props.selectMode === ListBoxSelectMode.MULTIPLE}
      id={id}
      onBlur={onBlur}
      ref={ref}
      role='listbox'
      style={{ ...props.style, ...(props.collapsable && props.popper.styles.popper) }}
      tabIndex={props.collapsable ? -1 : 0}
    />
  )
}

export function ListItem(props: ListBoxListItemProps) {
  const id = useID(ComponentName.COMBO_BOX_LIST_BOX_ITEM, props.id)
  const ref = useSafeRef('li')

  const onClick = (event: MouseEvent<HTMLLIElement>) => {
    props.setFocusedListItemIndex(props.index)
    props.setSelectedListItemIndex(props.index, !props.isListItemSelected(props.index))

    props.onClick && props.onClick(event)
  }

  const onMouseDown = (event: MouseEvent<HTMLLIElement>) => {
    event.preventDefault()
    props.onMouseDown && props.onMouseDown(event)
  }

  useEffect(() => {
    props.setListItemRef(props.index, ref)
    return () => props.deleteListItemRef(props.index)
  }, [])

  return (
    <li
      {...ObjectUtils.omit(props, [...ROOT_CHILDREN_PROPS_KEYS, 'index'])}
      aria-selected={props.isListItemSelected(props.index)}
      id={id}
      onClick={onClick}
      onMouseDown={onMouseDown}
      ref={ref}
      role='option'
      style={{ cursor: 'pointer', ...props.style }}
    />
  )
}

export const AriaListBox = {
  Root,
  Button,
  List,
  ListItem
}
