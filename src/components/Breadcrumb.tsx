import { omit } from 'lodash'
import React from 'react'
import { ComponentName } from '../definitions/enums'
import { BreadcrumbListItemLinkProps, BreadcrumbListItemProps, BreadcrumbListProps, BreadcrumbProps } from '../definitions/props'
import useID from '../hooks/use.id'

function Root(props: BreadcrumbProps) {
  const id = useID(ComponentName.BREADCRUMB)
  return <nav {...props} aria-label='Breadcrumb' id={id} />
}

function List(props: BreadcrumbListProps) {
  const id = useID(ComponentName.BREADCRUMB_LIST)
  return <ol {...props} id={id} />
}

function ListItem(props: BreadcrumbListItemProps) {
  const id = useID(ComponentName.BREADCRUMB_LIST_ITEM)
  return <li {...props} id={id} />
}

function ListItemLink(props: BreadcrumbListItemLinkProps) {
  const id = useID(ComponentName.BREADCRUMB_LIST_ITEM_LINK)
  return <a {...omit(props, 'isCurrent')} aria-current={props.isCurrent ? 'page' : undefined} id={id} />
}

export { Root, List, ListItem, ListItemLink }
