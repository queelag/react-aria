import { ObjectUtils } from '@queelag/core'
import { forwardRef, useComponentStore, useSafeRef } from '@queelag/react-core'
import React, { ForwardedRef, KeyboardEvent, MouseEvent, useEffect } from 'react'
import { TabberChildrenProps, TabberListItemProps, TabberListProps, TabberPanelProps, TabberProps } from '../definitions/props'
import { TabberStore } from '../stores/tabber.store'

const ROOT_PROPS_KEYS: (keyof TabberProps)[] = ['activation', 'getStore', 'listItemsLength']
const ROOT_CHILDREN_PROPS_KEYS: (keyof TabberChildrenProps)[] = [
  'handleKeyboardEvents',
  'isTabSelected',
  'listItemIDs',
  'panelIDs',
  'selectedListItemIndex',
  'setListItemRef',
  'setSelectedListItemIndex'
]
const STORE_KEYS: (keyof TabberProps & keyof TabberStore)[] = ['activation', 'listItemsLength']

export const Root = forwardRef((props: TabberProps, ref: ForwardedRef<HTMLDivElement>) => {
  const store = useComponentStore(TabberStore, props, STORE_KEYS)

  return (
    <div {...ObjectUtils.omit(props, ROOT_PROPS_KEYS)} ref={ref}>
      {props.children({
        deleteListItemRef: store.deleteListItemRef,
        handleKeyboardEvents: store.handleKeyboardEvents,
        isTabSelected: store.isTabSelected,
        listItemIDs: store.listItemIDs,
        panelIDs: store.panelIDs,
        selectedListItemIndex: store.selectedListItemIndex,
        setListItemRef: store.setListItemRef,
        setSelectedListItemIndex: store.setSelectedListItemIndex
      })}
    </div>
  )
})

export const List = forwardRef((props: TabberListProps, ref: ForwardedRef<HTMLDivElement>) => {
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    props.handleKeyboardEvents(event)
    props.onKeyDown && props.onKeyDown(event)
  }

  return <div {...ObjectUtils.omit(props, ROOT_CHILDREN_PROPS_KEYS)} aria-label={props.label} onKeyDown={onKeyDown} ref={ref} role='tablist' />
})

export function ListItem(props: TabberListItemProps) {
  const ref = useSafeRef('button')

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    props.setSelectedListItemIndex(props.index)
    props.onClick && props.onClick(event)
  }

  useEffect(() => {
    props.setListItemRef(props.index, ref)
    return () => props.deleteListItemRef(props.index)
  }, [])

  return (
    <button
      {...ObjectUtils.omit(props, [...ROOT_CHILDREN_PROPS_KEYS, 'index'])}
      aria-controls={props.panelIDs[props.index]}
      aria-selected={props.isTabSelected(props.index)}
      id={props.listItemIDs[props.index]}
      onClick={onClick}
      ref={ref}
      role='tab'
      tabIndex={props.isTabSelected(props.index) ? undefined : -1}
    />
  )
}

export const Panel = forwardRef((props: TabberPanelProps, ref: ForwardedRef<HTMLDivElement>) => {
  return (
    <div
      {...ObjectUtils.omit(props, [...ROOT_CHILDREN_PROPS_KEYS, 'index'])}
      aria-hidden={!props.isTabSelected(props.index)}
      aria-labelledby={props.panelIDs[props.index]}
      id={props.listItemIDs[props.index]}
      ref={ref}
      role='tabpanel'
      tabIndex={props.isTabSelected(props.index) ? 0 : undefined}
    />
  )
})

export const AriaTabber = {
  Root,
  List,
  ListItem,
  Panel
}
