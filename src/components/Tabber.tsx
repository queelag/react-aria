import { ObjectUtils, StoreUtils } from '@queelag/core'
import { useForceUpdate } from '@queelag/react-core'
import React, { KeyboardEvent, MouseEvent, useEffect, useMemo, useRef } from 'react'
import { TabberChildrenProps, TabberListItemProps, TabberListProps, TabberPanelProps, TabberProps } from '../definitions/props'
import TabberStore from '../stores/tabber.store'

const TABBER_PROPS_KEYS: (keyof TabberProps)[] = ['size']
const TABBER_CHILDREN_PROPS_KEYS: (keyof TabberChildrenProps)[] = [
  'handleKeyboardEvents',
  'isTabSelected',
  'listItemIDs',
  'panelIDs',
  'selectedListItemIndex',
  'setListItemRef',
  'setSelectedListItemIndex'
]

export function Root(props: TabberProps) {
  const update = useForceUpdate()
  const store = useMemo(() => new TabberStore(update, props.id, props.activation, props.size), [])

  useEffect(() => {
    StoreUtils.shouldUpdateKey(store, 'size', props.size) && store.setSize(props.size)
    StoreUtils.updateKeys(store, props, ['activation'], update)
  }, [props.activation, props.size])

  return (
    <div {...ObjectUtils.omit(props, TABBER_PROPS_KEYS)}>
      {props.children({
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
}

export function List(props: TabberListProps) {
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    props.handleKeyboardEvents(event)
    props.onKeyDown && props.onKeyDown(event)
  }

  return <div {...ObjectUtils.omit(props, TABBER_CHILDREN_PROPS_KEYS)} aria-label={props.label} onKeyDown={onKeyDown} role='tablist' />
}

export function ListItem(props: TabberListItemProps) {
  const ref = useRef(document.createElement('button'))

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    props.setSelectedListItemIndex(props.index)
    props.onClick && props.onClick(event)
  }

  useEffect(() => props.setListItemRef(props.index, ref), [])

  return (
    <button
      {...ObjectUtils.omit(props, [...TABBER_CHILDREN_PROPS_KEYS, 'index'])}
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

export function Panel(props: TabberPanelProps) {
  return (
    <div
      {...ObjectUtils.omit(props, [...TABBER_CHILDREN_PROPS_KEYS, 'index'])}
      aria-hidden={!props.isTabSelected(props.index)}
      aria-labelledby={props.panelIDs[props.index]}
      id={props.listItemIDs[props.index]}
      role='tabpanel'
      tabIndex={props.isTabSelected(props.index) ? 0 : undefined}
    />
  )
}

export const AriaTabber = {
  Root,
  List,
  ListItem,
  Panel
}
