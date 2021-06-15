import { omit } from 'lodash'
import React, { KeyboardEvent, MouseEvent, useEffect, useMemo, useRef } from 'react'
import { TabberChildrenProps, TabberListItemProps, TabberListProps, TabberPanelProps, TabberProps } from '../definitions/props'
import useForceUpdate from '../hooks/use.force.update'
import TabberStore from '../stores/tabber.store'

const TABBER_CHILDREN_PROPS_KEYS: (keyof TabberChildrenProps)[] = [
  'handleKeyboardEvents',
  'isTabSelected',
  'listItemIDs',
  'panelIDs',
  'selectedListItemIndex',
  'setListItemRef',
  'setSelectedListItemIndex'
]

function Root(props: TabberProps) {
  const update = useForceUpdate()
  const store = useMemo(() => new TabberStore(update, props.id, props.size), [])

  return (
    <div {...omit(props, 'listLabel', 'size')}>
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

function List(props: TabberListProps) {
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    props.handleKeyboardEvents(event)
    props.onKeyDown && props.onKeyDown(event)
  }

  return <div {...omit(props, TABBER_CHILDREN_PROPS_KEYS)} aria-label={props.label} onKeyDown={onKeyDown} role='tablist' />
}

function ListItem(props: TabberListItemProps) {
  const ref = useRef(document.createElement('button'))

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    props.setSelectedListItemIndex(props.index)
    props.onClick && props.onClick(event)
  }

  useEffect(() => props.setListItemRef(props.index, ref), [])

  return (
    <button
      {...omit(props, TABBER_CHILDREN_PROPS_KEYS, 'index')}
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

function Panel(props: TabberPanelProps) {
  return (
    <div
      {...omit(props, TABBER_CHILDREN_PROPS_KEYS, 'index')}
      aria-hidden={!props.isTabSelected(props.index)}
      aria-labelledby={props.panelIDs[props.index]}
      id={props.listItemIDs[props.index]}
      role='tabpanel'
      tabIndex={props.isTabSelected(props.index) ? 0 : undefined}
    />
  )
}

export { Root, List, ListItem, Panel }
