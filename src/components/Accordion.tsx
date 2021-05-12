import { omit, slice } from 'lodash'
import React, { KeyboardEvent, MouseEvent, useEffect, useState } from 'react'
import { ComponentName, Key } from '../definitions/enums'
import { AccordionProps, AccordionSectionHeaderProps, AccordionSectionPanelProps, AccordionSectionProps } from '../definitions/props'
import useID from '../hooks/use.id'
import Logger from '../modules/logger'
import DocumentUtils from '../utils/document.utils'

/**
 * An accordion is a vertically stacked set of interactive headings that each contain a title, content snippet, or thumbnail representing a section of content. The headings function as controls that enable users to reveal or hide their associated sections of content. Accordions are commonly used to reduce the need to scroll when presenting multiple sections of content on a single page.
 */
function Accordion(props: AccordionProps) {
  const [expandedSections, setExpandedSections] = useState<boolean[]>(new Array(props.size).fill(false))
  const id = useID(ComponentName.ACCORDION)

  const handleKeyboardInteractions = (e: KeyboardEvent) => {
    let sections: HTMLDivElement[], focusedSectionIndex: number

    sections = slice(document.querySelectorAll(`#${id} ${DocumentUtils.toPrefixIDSelector(ComponentName.ACCORDION_SECTION_HEADER)}`))
    if (sections.length <= 0) return Logger.error(id, 'handleKeyboardInteractions', `There are no sections`)

    focusedSectionIndex = sections.findIndex((v: HTMLDivElement) => document.activeElement === v)
    if (focusedSectionIndex < 0) return Logger.error(id, 'handleKeyboardInteractions', `Failed to find the focused section index`)

    switch (e.key) {
      case Key.ARROW_DOWN:
        let next: HTMLDivElement

        next = sections[focusedSectionIndex + 1]
        if (!next) return Logger.debug(id, 'handleKeyboardInteractions', `Failed to find the next element`)

        next.focus()
        Logger.debug(id, 'handleKeyboardInteractions', e.key, `The next element has been focused`)

        break
      case Key.ARROW_UP:
        let previous: HTMLDivElement

        previous = sections[focusedSectionIndex - 1]
        if (!previous) return Logger.debug(id, 'handleKeyboardInteractions', `Failed to find the previous element`)

        previous.focus()
        Logger.debug(id, 'handleKeyboardInteractions', e.key, `The previous element has been focused`)

        break
      case Key.END:
        let last: HTMLDivElement

        last = sections[sections.length - 1]
        if (!last) return Logger.debug(id, 'handleKeyboardInteractions', `Failed to find the last element`)

        last.focus()
        Logger.debug(id, 'handleKeyboardInteractions', e.key, `The last element has been focused`)

        break
      case Key.HOME:
        let first: HTMLDivElement

        first = sections[0]
        if (!first) return Logger.debug(id, 'handleKeyboardInteractions', `Failed to find the first element`)

        first.focus()
        Logger.debug(id, 'handleKeyboardInteractions', e.key, `The first element has been focused`)

        break
    }
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    handleKeyboardInteractions(event)
    props.onKeyDown && props.onKeyDown(event)
  }

  const setExpandedSection = (expanded: boolean, index: number, isCollapsable: boolean) => {
    let clone: boolean[]

    if (expanded === false && isCollapsable === false) {
      Logger.debug(id, 'setExpandedSection', `The isCollapsable prop is falsy, the section can't be collapsed`)
      return
    }

    clone = expandedSections.slice().fill(false)
    clone[index] = expanded

    setExpandedSections(clone)
    Logger.debug(id, 'setExpandedSection', `Every section has been collapsed, the section ${index} has been ${expanded ? 'expanded' : 'collapsed'}`)
  }

  return (
    <div {...props} id={id} onKeyDown={onKeyDown}>
      {props.children({ expandedSections, setExpandedSection })}
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

  const setExpanded = (expanded: boolean) => {
    props.setExpandedSection(expanded, props.index, typeof props.isCollapsable === 'boolean' ? props.isCollapsable : true)
  }

  useEffect(() => {
    if (props.isExpanded === true) {
      setExpanded(true)
      Logger.debug(id, 'useEffect', 'The isExpanded prop is truthy, expanding the section')
    }
  }, [props.isExpanded])

  return (
    <div {...omit(props, 'expandedSections', 'index', 'isCollapsable', 'isExpanded', 'setExpandedSection', 'setFocused')} id={id}>
      {props.children({ contentID, expanded: props.expandedSections[props.index], headerID, setExpanded })}
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
