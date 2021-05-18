import { omit } from 'lodash'
import React, { FocusEvent, KeyboardEvent, MouseEvent, useEffect, useMemo, useRef } from 'react'
import { usePopper } from 'react-popper'
import { ComponentName, ListBoxSelectMode } from '../definitions/enums'
import { ListBoxButtonProps, ListBoxChildrenProps, ListBoxListItemProps, ListBoxListProps, ListBoxProps } from '../definitions/props'
import useForceUpdate from '../hooks/use.force.update'
import useID from '../hooks/use.id'
import ListBoxStore from '../stores/list.box.store'

const ROOT_CHILDREN_PROPS_KEYS: (keyof ListBoxChildrenProps)[] = [
  'deleteListItemRef',
  'expanded',
  'focusedListItemID',
  'isListItemFocused',
  'isListItemSelected',
  'popper',
  'selectMode',
  'setButtonRef',
  'setExpanded',
  'setListItemRef',
  'setListRef',
  'setSelectedListItemIndex'
]

function Root(props: ListBoxProps) {
  const update = useForceUpdate()
  const store = useMemo(() => new ListBoxStore(update, props.id, props.selectMode), [])
  const popper = usePopper(store.buttonRef.current, store.listRef.current, props.popperOptions)

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    store.handleKeyboardInteractions(event)
    props.onKeyDown && props.onKeyDown(event)
  }

  return (
    <div {...omit(props, 'popperOptions')} id={store.id} onKeyDown={onKeyDown} style={{ ...props.style, position: 'relative' }}>
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

function Button(props: ListBoxButtonProps) {
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
      {...omit(props, ROOT_CHILDREN_PROPS_KEYS)}
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

function List(props: ListBoxListProps) {
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
      {...omit(props, ROOT_CHILDREN_PROPS_KEYS)}
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

function ListItem(props: ListBoxListItemProps) {
  const id = useID(ComponentName.COMBO_BOX_LIST_BOX_ITEM, props.id)
  const ref = useRef(document.createElement('li'))

  const onClick = (event: MouseEvent<HTMLLIElement>) => {
    props.setFocusedListItemIndex(props.index)
    props.setSelectedListItemIndex(!props.isListItemSelected(props.index), props.index)

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
      {...omit(props, 'index', ROOT_CHILDREN_PROPS_KEYS)}
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

const ListBox = { Root, Button, List, ListItem }
export { ListBox }
