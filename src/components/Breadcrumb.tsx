import { ObjectUtils } from '@queelag/core'
import { useID } from '@queelag/react-core'
import React, { ForwardedRef, forwardRef } from 'react'
import { ComponentName } from '../definitions/enums'
import { BreadcrumbListItemLinkProps, BreadcrumbListItemProps, BreadcrumbListProps, BreadcrumbProps } from '../definitions/props'

const LIST_ITEM_LINK_PROPS_KEYS: (keyof BreadcrumbListItemLinkProps)[] = ['isCurrent']

/**
 * A breadcrumb trail consists of a list of links to the parent pages of the current page in hierarchical order. It helps users find their place within a website or web application. Breadcrumbs are often placed horizontally before a page's main content.
 */
export const Root = forwardRef((props: BreadcrumbProps, ref: ForwardedRef<HTMLElement>) => {
  const id = useID(ComponentName.BREADCRUMB, props.id)
  return <nav {...props} aria-label='Breadcrumb' id={id} ref={ref} />
})

export const List = forwardRef((props: BreadcrumbListProps, ref: ForwardedRef<HTMLOListElement>) => {
  const id = useID(ComponentName.BREADCRUMB_LIST, props.id)
  return <ol {...props} id={id} ref={ref} />
})

export const ListItem = forwardRef((props: BreadcrumbListItemProps, ref: ForwardedRef<HTMLLIElement>) => {
  const id = useID(ComponentName.BREADCRUMB_LIST_ITEM, props.id)
  return <li {...props} id={id} ref={ref} />
})

export const ListItemLink = forwardRef((props: BreadcrumbListItemLinkProps, ref: ForwardedRef<HTMLAnchorElement>) => {
  const id = useID(ComponentName.BREADCRUMB_LIST_ITEM_LINK, props.id)
  return <a {...ObjectUtils.omit(props, LIST_ITEM_LINK_PROPS_KEYS)} aria-current={props.isCurrent ? 'page' : undefined} id={id} ref={ref} />
})

export const AriaBreadcrumb = {
  Root,
  List,
  ListItem,
  ListItemLink
}
