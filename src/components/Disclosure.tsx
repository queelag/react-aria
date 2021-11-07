import { ObjectUtils } from '@queelag/core'
import { forwardRef, useComponentStore, useID } from '@queelag/react-core'
import React, { ForwardedRef, Fragment, MouseEvent } from 'react'
import { ComponentName } from '../definitions/enums'
import {
  DisclosureProps,
  DisclosureSectionChildrenProps,
  DisclosureSectionHeaderButtonProps,
  DisclosureSectionHeaderProps,
  DisclosureSectionPanelProps,
  DisclosureSectionProps
} from '../definitions/props'
import { DisclosureSectionStore } from '../stores/disclosure.section.store'

const SECTION_CHILDREN_PROPS_KEYS: (keyof DisclosureSectionChildrenProps)[] = ['expanded', 'panelID', 'setExpanded']
const SECTION_STORE_KEYS: (keyof DisclosureSectionProps & keyof DisclosureSectionStore)[] = ['expanded']

/**
 * A disclosure is a button that controls visibility of a section of content. When the controlled content is hidden, it is often styled as a typical push button with a right-pointing arrow or triangle to hint that activating the button will display additional content. When the content is visible, the arrow or triangle typically points down.
 */
export const Root = forwardRef((props: DisclosureProps, ref: ForwardedRef<HTMLDListElement>) => {
  const id = useID(ComponentName.DISCLOSURE, props.id)

  return <dl {...props} id={id} ref={ref} />
})

export function Section(props: DisclosureSectionProps) {
  const store = useComponentStore(DisclosureSectionStore, props, SECTION_STORE_KEYS)
  return <Fragment>{props.children({ expanded: store.expanded, panelID: store.panelID, setExpanded: store.setExpanded })}</Fragment>
}

export const SectionHeader = forwardRef((props: DisclosureSectionHeaderProps, ref: ForwardedRef<HTMLElement>) => {
  const id = useID(ComponentName.DISCLOSURE_SECTION_HEADER, props.id)
  return <dt {...props} id={id} ref={ref} />
})

export const SectionHeaderButton = forwardRef((props: DisclosureSectionHeaderButtonProps, ref: ForwardedRef<HTMLButtonElement>) => {
  const id = useID(ComponentName.DISCLOSURE_SECTION_HEADER_BUTTON, props.id)

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    props.setExpanded(!props.expanded)
    props.onClick && props.onClick(event)
  }

  return (
    <button
      {...ObjectUtils.omit(props, SECTION_CHILDREN_PROPS_KEYS)}
      aria-controls={props.panelID}
      aria-expanded={props.expanded}
      id={id}
      onClick={onClick}
      ref={ref}
    />
  )
})

export const SectionPanel = forwardRef((props: DisclosureSectionPanelProps, ref: ForwardedRef<HTMLElement>) => {
  return <dd {...ObjectUtils.omit(props, SECTION_CHILDREN_PROPS_KEYS)} id={props.panelID} ref={ref} />
})

export const AriaDisclosure = {
  Root,
  Section,
  SectionHeader,
  SectionHeaderButton,
  SectionPanel
}
