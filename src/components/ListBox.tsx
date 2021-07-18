import { ObjectUtils, StoreUtils } from '@queelag/core'
import { useForceUpdate, useID } from '@queelag/react-core'
import React, { FocusEvent, KeyboardEvent, MouseEvent, useEffect, useMemo, useRef } from 'react'
import { usePopper } from 'react-popper'
import { ComponentName, ListBoxSelectMode } from '../definitions/enums'
import { ListBoxButtonProps, ListBoxChildrenProps, ListBoxListItemProps, ListBoxListProps, ListBoxProps } from '../definitions/props'
import ListBoxStore from '../stores/list.box.store'

const ROOT_PROPS_KEYS: (keyof ListBoxProps)[] = ['collapsable', 'onSelectListItem', 'popperOptions', 'selectMode', 'selectedListItemIndexes']
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
  'setListItemRef',
  'setListRef',
  'setSelectedListItemIndex'
]

/**
 * A listbox widget presents a list of options and allows a user to select one or more of them. A listbox that allows a single option to be chosen is a single-select listbox; one that allows multiple options to be selected is a multi-select listbox.
 */
export function Root(props: ListBoxProps) {
  const update = useForceUpdate()
  const store = useMemo(() => new ListBoxStore({ ...props, update }), [])
  const popper = usePopper(store.buttonRef.current, store.listRef.current, props.popperOptions)

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    store.handleKeyboardInteractions(event)
    props.onKeyDown && props.onKeyDown(event)
  }

  useEffect(() => {
    StoreUtils.updateKeys(store, props, ['onSelectListItem', 'selectMode', 'selectedListItemIndexes'], update)
  }, [props.onSelectListItem, props.selectMode, props.selectedListItemIndexes])

  return (
    <div {...ObjectUtils.omit(props, ROOT_PROPS_KEYS)} id={store.id} onKeyDown={onKeyDown} style={{ ...props.style, position: 'relative' }}>
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
}

export function Button(props: ListBoxButtonProps) {
  const id = useID(ComponentName.LIST_BOX_BUTTON, props.id)
  const ref = useRef(document.createElement('button'))

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
  const ref = useRef(document.createElement('ul'))

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
  const ref = useRef(document.createElement('li'))

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
      style={{ ...props.style, cursor: 'pointer' }}
    />
  )
}

export const AriaListBox = {
  Root,
  Button,
  List,
  ListItem
}
