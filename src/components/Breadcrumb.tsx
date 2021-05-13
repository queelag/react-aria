import { omit } from 'lodash'
import React from 'react'
import { ComponentName } from '../definitions/enums'
import { BreadcrumbListItemLinkProps, BreadcrumbListItemProps, BreadcrumbListProps, BreadcrumbProps } from '../definitions/props'
import useID from '../hooks/use.id'

/**
 * A breadcrumb trail consists of a list of links to the parent pages of the current page in hierarchical order. It helps users find their place within a website or web application. Breadcrumbs are often placed horizontally before a page's main content.
 */
function Root(props: BreadcrumbProps) {
  const id = useID(ComponentName.BREADCRUMB, props.id)
  return <nav {...props} aria-label='Breadcrumb' id={id} />
}

/**
 * The list of links which is structured using an ordered list.
 */
function List(props: BreadcrumbListProps) {
  const id = useID(ComponentName.BREADCRUMB_LIST, props.id)
  return <ol {...props} id={id} />
}

/**
 * Every link is encapsulated by a list item.
 */
function ListItem(props: BreadcrumbListItemProps) {
  const id = useID(ComponentName.BREADCRUMB_LIST_ITEM, props.id)
  return <li {...props} id={id} />
}

/**
 * The breadcrumb list item link, the aria-current="page" attribute is applied to the last link in the set to indicate that it represents the current page.
 */
function ListItemLink(props: BreadcrumbListItemLinkProps) {
  const id = useID(ComponentName.BREADCRUMB_LIST_ITEM_LINK, props.id)
  return <a {...omit(props, 'isCurrent')} aria-current={props.isCurrent ? 'page' : undefined} id={id} />
}

export { Root, List, ListItem, ListItemLink }
