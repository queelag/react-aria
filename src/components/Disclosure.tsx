import { ObjectUtils } from '@queelag/core'
import { useForceUpdate, useID } from '@queelag/react-core'
import React, { Fragment, MouseEvent, useEffect, useMemo } from 'react'
import { ComponentName } from '../definitions/enums'
import {
  DisclosureProps,
  DisclosureSectionChildrenProps,
  DisclosureSectionHeaderButtonProps,
  DisclosureSectionHeaderProps,
  DisclosureSectionPanelProps,
  DisclosureSectionProps
} from '../definitions/props'
import DisclosureSectionStore from '../stores/disclosure.section.store'

const DISCLOSURE_SECTION_CHILDREN_PROPS_KEYS: (keyof DisclosureSectionChildrenProps)[] = ['expanded', 'panelID', 'setExpanded']

/**
 * A disclosure is a button that controls visibility of a section of content. When the controlled content is hidden, it is often styled as a typical push button with a right-pointing arrow or triangle to hint that activating the button will display additional content. When the content is visible, the arrow or triangle typically points down.
 */
export function Root(props: DisclosureProps) {
  const id = useID(ComponentName.DISCLOSURE, props.id)

  return <dl {...props} id={id} />
}

export function Section(props: DisclosureSectionProps) {
  const update = useForceUpdate()
  const store = useMemo(() => new DisclosureSectionStore(update), [])

  useEffect(() => {
    props.expanded && store.setExpanded(true)
  }, [])

  return <Fragment>{props.children({ expanded: store.expanded, panelID: store.panelID, setExpanded: store.setExpanded })}</Fragment>
}

export function SectionHeader(props: DisclosureSectionHeaderProps) {
  const id = useID(ComponentName.DISCLOSURE_SECTION_HEADER, props.id)
  return <dt {...props} id={id} />
}

export function SectionHeaderButton(props: DisclosureSectionHeaderButtonProps) {
  const id = useID(ComponentName.DISCLOSURE_SECTION_HEADER_BUTTON, props.id)

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    props.setExpanded(!props.expanded)
    props.onClick && props.onClick(event)
  }

  return (
    <button
      {...ObjectUtils.omit(props, DISCLOSURE_SECTION_CHILDREN_PROPS_KEYS)}
      aria-controls={props.panelID}
      aria-expanded={props.expanded}
      id={id}
      onClick={onClick}
    />
  )
}

export function SectionPanel(props: DisclosureSectionPanelProps) {
  return <dd {...ObjectUtils.omit(props, DISCLOSURE_SECTION_CHILDREN_PROPS_KEYS)} id={props.panelID} />
}

export const AriaDisclosure = {
  Root,
  Section,
  SectionHeader,
  SectionHeaderButton,
  SectionPanel
}
