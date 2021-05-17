import React, { MouseEvent, useMemo } from 'react'
import { ComponentName, DisclosureStatus } from '../definitions/enums'
import {
  DisclosureProps,
  DisclosureSectionHeaderButtonProps,
  DisclosureSectionHeaderProps,
  DisclosureSectionPanelProps,
  DisclosureSectionProps
} from '../definitions/props'
import useForceUpdate from '../hooks/use.force.update'
import useID from '../hooks/use.id'
import DisclosureSectionStore from '../stores/disclosure.section.store'

function Root(props: DisclosureProps) {
  const id = useID(ComponentName.DISCLOSURE, props.id)

  return <dl {...props} id={id} />
}

function Section(props: DisclosureSectionProps) {
  const update = useForceUpdate()
  const store = useMemo(() => new DisclosureSectionStore(update), [])

  return <div {...props}>{props.children({ status: store.status, panelID: store.panelID, setStatus: store.setStatus })}</div>
}

function SectionHeader(props: DisclosureSectionHeaderProps) {
  const id = useID(ComponentName.DISCLOSURE_SECTION_HEADER, props.id)
  return <dt {...props} id={id} />
}

function SectionHeaderButton(props: DisclosureSectionHeaderButtonProps) {
  const id = useID(ComponentName.DISCLOSURE_SECTION_HEADER_BUTTON, props.id)

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    props.setStatus(props.status === DisclosureStatus.COLLAPSED ? DisclosureStatus.EXPANDED : DisclosureStatus.COLLAPSED)
    props.onClick && props.onClick(event)
  }

  return <button {...props} aria-controls={props.panelID} aria-expanded={props.status === DisclosureStatus.EXPANDED} id={id} onClick={onClick} />
}

function SectionPanel(props: DisclosureSectionPanelProps) {
  return <dd {...props} id={props.panelID} />
}

const Disclosure = { Root, Section, SectionHeader, SectionHeaderButton, SectionPanel }
export { Disclosure }
