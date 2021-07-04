import { ObjectUtils } from '@queelag/core'
import { useID } from '@queelag/react-core'
import React from 'react'
import { ComponentName } from '../definitions/enums'
import { BreadcrumbListItemLinkProps, BreadcrumbListItemProps, BreadcrumbListProps, BreadcrumbProps } from '../definitions/props'

const BREADCRUMB_LIST_ITEM_LINK_PROPS_KEYS: (keyof BreadcrumbListItemLinkProps)[] = ['isCurrent']

/**
 * A breadcrumb trail consists of a list of links to the parent pages of the current page in hierarchical order. It helps users find their place within a website or web application. Breadcrumbs are often placed horizontally before a page's main content.
 */
export function Root(props: BreadcrumbProps) {
  const id = useID(ComponentName.BREADCRUMB, props.id)
  return <nav {...props} aria-label='Breadcrumb' id={id} />
}

export function List(props: BreadcrumbListProps) {
  const id = useID(ComponentName.BREADCRUMB_LIST, props.id)
  return <ol {...props} id={id} />
}

export function ListItem(props: BreadcrumbListItemProps) {
  const id = useID(ComponentName.BREADCRUMB_LIST_ITEM, props.id)
  return <li {...props} id={id} />
}

export function ListItemLink(props: BreadcrumbListItemLinkProps) {
  const id = useID(ComponentName.BREADCRUMB_LIST_ITEM_LINK, props.id)
  return <a {...ObjectUtils.omit(props, BREADCRUMB_LIST_ITEM_LINK_PROPS_KEYS)} aria-current={props.isCurrent ? 'page' : undefined} id={id} />
}

export const AriaBreadcrumb = {
  Root,
  List,
  ListItem,
  ListItemLink
}
