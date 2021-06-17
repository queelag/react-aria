import { Logger } from '@queelag/core'
import { useForceUpdate, useID } from '@queelag/react-core'
import { omit } from 'lodash'
import React, { KeyboardEvent, MouseEvent, MutableRefObject, useEffect, useMemo, useRef } from 'react'
import { ComponentName } from '../definitions/enums'
import { AccordionProps, AccordionSectionHeaderProps, AccordionSectionPanelProps, AccordionSectionProps } from '../definitions/props'
import AccordionStore from '../stores/accordion.store'

/**
 * An accordion is a vertically stacked set of interactive headings that each contain a title, content snippet, or thumbnail representing a section of content. The headings function as controls that enable users to reveal or hide their associated sections of content. Accordions are commonly used to reduce the need to scroll when presenting multiple sections of content on a single page.
 */
export function Root(props: AccordionProps) {
  const update = useForceUpdate()
  const store = useMemo(() => new AccordionStore(update, props.id), [])

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    store.handleKeyboardInteractions(event)
    props.onKeyDown && props.onKeyDown(event)
  }

  return (
    <div {...props} id={store.id} onKeyDown={onKeyDown}>
      {props.children({ expandSection: store.expandSection, expandedSections: store.expandedSections, setSectionHeaderRef: store.setSectionHeaderRef })}
    </div>
  )
}

export function Section(props: AccordionSectionProps) {
  const id = useID(ComponentName.ACCORDION_SECTION, props.id)
  const contentID = useID(ComponentName.ACCORDION_SECTION_PANEL)
  const headerID = useID(ComponentName.ACCORDION_SECTION_HEADER)
  const ref = useRef(document.createElement('div'))

  const expand = (expanded: boolean) => {
    props.expandSection(expanded, id, typeof props.isCollapsable === 'boolean' ? props.isCollapsable : true)
  }

  const setHeaderRef = (ref: MutableRefObject<HTMLButtonElement>) => {
    props.setSectionHeaderRef(ref, headerID)
  }

  useEffect(() => {
    if (props.isExpanded === true) {
      expand(true)
      Logger.debug(id, 'useEffect', 'The isExpanded prop is truthy, expanding the section')
    }
  }, [props.isExpanded])

  return (
    <div {...omit(props, 'expandSection', 'expandedSections', 'isCollapsable', 'isExpanded', 'setSectionHeaderRef')} id={id} ref={ref}>
      {props.children({ contentID, expand, expanded: props.expandedSections.get(id) || false, headerID, setHeaderRef })}
    </div>
  )
}

export function SectionHeader(props: AccordionSectionHeaderProps) {
  const ref = useRef(document.createElement('button'))

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    props.expand(!props.expanded)
    Logger.debug(props.headerID, 'onClick', `The section has been ${!props.expanded ? 'expanded' : 'collapsed'}`)

    props.onClick && props.onClick(event)
  }

  useEffect(() => {
    props.setHeaderRef(ref)
  }, [])

  return (
    <button
      {...omit(props, 'contentID', 'expand', 'expanded', 'headerID', 'setHeaderRef')}
      aria-controls={props.contentID}
      aria-expanded={props.expanded}
      id={props.headerID}
      ref={ref}
      onClick={onClick}
      type='button'
    />
  )
}

export function SectionPanel(props: AccordionSectionPanelProps) {
  return (
    <div {...omit(props, 'contentID', 'expand', 'expanded', 'headerID', 'setHeaderRef')} aria-labelledby={props.headerID} id={props.contentID} role='region' />
  )
}
