import { omit } from 'lodash'
import React, { KeyboardEvent, MouseEvent, useEffect, useMemo, useRef } from 'react'
import { ComponentName } from '../definitions/enums'
import { AccordionProps, AccordionSectionHeaderProps, AccordionSectionPanelProps, AccordionSectionProps } from '../definitions/props'
import useForceUpdate from '../hooks/use.force.update'
import useID from '../hooks/use.id'
import Logger from '../modules/logger'
import AccordionStore from '../stores/accordion.store'

/**
 * An accordion is a vertically stacked set of interactive headings that each contain a title, content snippet, or thumbnail representing a section of content. The headings function as controls that enable users to reveal or hide their associated sections of content. Accordions are commonly used to reduce the need to scroll when presenting multiple sections of content on a single page.
 */
function Accordion(props: AccordionProps) {
  const ref = useRef(document.createElement('div'))
  const store = useMemo(() => new AccordionStore(ref), [])
  const update = useForceUpdate()

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    store.handleKeyboardInteractions(event)
    props.onKeyDown && props.onKeyDown(event)
  }

  const setExpandedSection = (expanded: boolean, index: number, isCollapsable: boolean) => {
    store.expandSection(expanded, index, isCollapsable)
    update()
  }

  return (
    <div {...props} id={store.id} onKeyDown={onKeyDown}>
      {props.children({ expandedSections: store.expandedSections, setExpandedSection, setSectionRef: store.setSectionRef })}
    </div>
  )
}

/**
 * The accordion section contains the header and the panel components.
 */
function AccordionSection(props: AccordionSectionProps) {
  const id = useID(ComponentName.ACCORDION_SECTION)
  const contentID = useID(ComponentName.ACCORDION_SECTION_PANEL)
  const headerID = useID(ComponentName.ACCORDION_SECTION_HEADER)
  const ref = useRef(document.createElement('div'))

  const setExpanded = (expanded: boolean) => {
    props.setExpandedSection(expanded, props.index, typeof props.isCollapsable === 'boolean' ? props.isCollapsable : true)
  }

  useEffect(() => {
    props.setSectionRef(ref, props.index)
  }, [])

  useEffect(() => {
    if (props.isExpanded === true) {
      setExpanded(true)
      Logger.debug(id, 'useEffect', 'The isExpanded prop is truthy, expanding the section')
    }
  }, [props.isExpanded])

  return (
    <div {...omit(props, 'expandedSections', 'index', 'isCollapsable', 'isExpanded', 'setExpandedSection', 'setSectionRef')} id={id} ref={ref}>
      {props.children({ contentID, expanded: props.expandedSections.get(props.index) || false, headerID, setExpanded })}
    </div>
  )
}

/**
 * Label for or thumbnail representing a section of content that also serves as a control for showing, and in some implementations, hiding the section of content.
 */
function AccordionSectionHeader(props: AccordionSectionHeaderProps) {
  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    props.setExpanded(!props.expanded)
    Logger.debug(props.headerID, 'onClick', `The section has been ${!props.expanded ? 'expanded' : 'collapsed'}`)

    props.onClick && props.onClick(event)
  }

  return (
    <button
      {...omit(props, 'contentID', 'expanded', 'headerID', 'setExpanded')}
      aria-controls={props.contentID}
      aria-expanded={props.expanded}
      id={props.headerID}
      onClick={onClick}
      type='button'
    />
  )
}

/**
 * Section of content associated with an accordion header.
 */
function AccordionSectionPanel(props: AccordionSectionPanelProps) {
  return <div {...omit(props, 'contentID', 'expanded', 'headerID', 'setExpanded')} aria-labelledby={props.headerID} id={props.contentID} role='region' />
}

export { Accordion, AccordionSection, AccordionSectionPanel, AccordionSectionHeader }
