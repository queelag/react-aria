import { ObjectUtils } from '@queelag/core'
import { useComponentStore, useID } from '@queelag/react-core'
import React, { MouseEvent } from 'react'
import { ComponentName } from '../definitions/enums'
import {
  PaginationChildrenProps,
  PaginationListItemLinkProps,
  PaginationListItemProps,
  PaginationListProps,
  PaginationNextListItemLinkProps,
  PaginationPreviousListItemLinkProps,
  PaginationProps
} from '../definitions/props'
import { PaginationStore } from '../stores/pagination.store'

const ROOT_PROPS_KEYS: (keyof PaginationProps)[] = [
  'activeListItemIndex',
  'label',
  'listItemsIndexOffset',
  'numberOfListItems',
  'numberOfListItemsPerPage',
  'onChangeActiveListItemIndex'
]
const ROOT_CHILDREN_KEYS: (keyof PaginationChildrenProps)[] = [
  'canGoToNextListItem',
  'canGoToPreviousListItem',
  'isListItemActive',
  'iterablePages',
  'nextListItemIndex',
  'previousListItemIndex',
  'setActiveListItemIndex'
]
const STORE_KEYS: (keyof PaginationProps & keyof PaginationStore)[] = []

export function Root(props: PaginationProps) {
  const store = useComponentStore(PaginationStore, props, STORE_KEYS, 'nav')

  return (
    <nav {...ObjectUtils.omit(props, ROOT_PROPS_KEYS)} aria-label={props.label} id={store.id}>
      {props.children({
        canGoToNextListItem: store.canGoToNextListItem,
        canGoToPreviousListItem: store.canGoToPreviousListItem,
        isListItemActive: store.isListItemActive,
        iterablePages: store.iterablePages,
        nextListItemIndex: store.nextListItemIndex,
        previousListItemIndex: store.previousListItemIndex,
        setActiveListItemIndex: store.setActiveListItemIndex
      })}
    </nav>
  )
}

export function List(props: PaginationListProps) {
  const id = useID(ComponentName.PAGINATION_LIST, props.id)
  return <ul {...props} id={id} />
}

export function ListItem(props: PaginationListItemProps) {
  const id = useID(ComponentName.PAGINATION_LIST_ITEM, props.id)
  return <li {...props} id={id} />
}

export function ListItemLink(props: PaginationListItemLinkProps) {
  const id = useID(ComponentName.PAGINATION_LIST_ITEM_LINK, props.id)

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    props.setActiveListItemIndex(props.index)
    props.onClick && props.onClick(event)
  }

  return (
    <a
      {...ObjectUtils.omit(props, ROOT_CHILDREN_KEYS)}
      aria-current={props.isListItemActive(props.index) ? 'page' : undefined}
      aria-label={`Go to page ${props.index}.`}
      id={id}
      onClick={onClick}
    />
  )
}

export function PreviousListItemLink(props: PaginationPreviousListItemLinkProps) {
  const id = useID(ComponentName.PAGINATION_PREVIOUS_LIST_ITEM_LINK, props.id)

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    props.setActiveListItemIndex(props.previousListItemIndex)
    props.onClick && props.onClick(event)
  }

  return <a {...ObjectUtils.omit(props, ROOT_CHILDREN_KEYS)} aria-label='Go to the previous page.' id={id} onClick={onClick} />
}

export function NextListItemLink(props: PaginationNextListItemLinkProps) {
  const id = useID(ComponentName.PAGINATION_NEXT_LIST_ITEM_LINK, props.id)

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    props.setActiveListItemIndex(props.nextListItemIndex)
    props.onClick && props.onClick(event)
  }

  return <a {...ObjectUtils.omit(props, ROOT_CHILDREN_KEYS)} aria-label='Go to the next page.' id={id} onClick={onClick} />
}

export const AriaPagination = {
  Root,
  List,
  ListItem,
  ListItemLink,
  PreviousListItemLink,
  NextListItemLink
}
