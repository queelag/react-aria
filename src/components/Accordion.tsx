import { omit, slice } from 'lodash'
import React, { FocusEvent, MouseEvent, useEffect, useMemo, useState } from 'react'
import { ComponentName, Key } from '../definitions/enums'
import { AccordionProps, AccordionSectionHeaderProps, AccordionSectionPanelProps, AccordionSectionProps } from '../definitions/props'
import useID from '../hooks/use.id'
import Logger from '../modules/logger'

/**
 * An accordion is a vertically stacked set of interactive headings that each contain a title, content snippet, or thumbnail representing a section of content. The headings function as controls that enable users to reveal or hide their associated sections of content. Accordions are commonly used to reduce the need to scroll when presenting multiple sections of content on a single page.
 */
function Accordion(props: AccordionProps) {
  const [expandedSections, setExpandedSections] = useState<boolean[]>(new Array(props.size).fill(false))
  const id = useID(ComponentName.ACCORDION)

  const onKeyDown = useMemo(
    () => (e: KeyboardEvent) => {
      e.preventDefault()

      let sections: HTMLDivElement[], focusedSection: HTMLDivElement | undefined, focusedSectionIndex: number

      sections = slice(document.querySelectorAll(`#${id} [id^='${ComponentName.ACCORDION_SECTION_HEADER}-']`))
      if (sections.length <= 0) return Logger.error(id, `There are no sections`)

      focusedSection = sections.find((v: HTMLDivElement) => document.activeElement === v)
      if (!focusedSection) return Logger.error(id, `Failed to find the focused section`)

      focusedSectionIndex = sections.findIndex((v: HTMLDivElement) => document.activeElement === v)
      if (focusedSectionIndex < 0) return Logger.error(id, `Failed to find the focused section index`)

      switch (e.key) {
        case Key.ARROW_DOWN:
        case Key.ARROW_UP:
        case Key.END:
        case Key.HOME:
          focusedSection.blur()
          Logger.debug(id, `The focused section has been blurred`)

          break
      }

      switch (e.key) {
        case Key.ARROW_DOWN:
          let next: HTMLDivElement

          next = sections[focusedSectionIndex + 1] || focusedSection
          next.focus()

          Logger.debug(id, `${e.key} pressed, the next element has been focused`)

          break
        case Key.ARROW_UP:
          let previous: HTMLDivElement

          previous = sections[focusedSectionIndex - 1] || focusedSection
          previous.focus()

          Logger.debug(id, `${e.key} pressed, the previous element has been focused`)

          break
        case Key.END:
          let first: HTMLDivElement

          first = sections[0] || focusedSection
          first.focus()

          Logger.debug(id, `${e.key} pressed, the first element has been focused`)

          break
        case Key.HOME:
          let last: HTMLDivElement

          last = sections[sections.length - 1] || focusedSection
          last.focus()

          Logger.debug(id, `${e.key} pressed, the last element has been focused`)

          break
        case Key.ENTER:
        case Key.SPACE:
          setExpandedSection(true, focusedSectionIndex)
          Logger.debug(id, `${e.key} pressed, expanding the focused element`)

          break
      }
    },
    []
  )

  const setExpandedSection = (expanded: boolean, index: number) => {
    let clone: boolean[]

    clone = expandedSections.slice().fill(false)
    clone[index] = expanded

    setExpandedSections(clone)
  }

  return (
    <div {...props} id={id}>
      {props.children({ expandedSections, onKeyDown, setExpandedSection })}
    </div>
  )
}

/**
 * The accordion section contains the header and the panel components.
 */
function AccordionSection(props: AccordionSectionProps) {
  const id = useID(ComponentName.ACCORDION_SECTION)
  const contentID = useID(ComponentName.ACCORDION_SECTION_CONTENT)
  const headerID = useID(ComponentName.ACCORDION_SECTION_HEADER)

  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    window.removeEventListener('keydown', props.onKeyDown)
    Logger.debug(id, `The keydown listener has been removed`)

    props.onBlur && props.onBlur(event)
  }

  const onFocus = (event: FocusEvent<HTMLDivElement>) => {
    window.addEventListener('keydown', props.onKeyDown)
    Logger.debug(id, 'The keydown listener has been added')

    props.onFocus && props.onFocus(event)
  }

  const setExpanded = (expanded: boolean) => {
    props.setExpandedSection(expanded, props.index)
  }

  useEffect(() => {
    props.isExpanded && setExpanded(true)
  }, [props.isExpanded])

  useEffect(
    () => () => {
      window.removeEventListener('keydown', props.onKeyDown)
      Logger.debug(id, `The keydown listener has been removed`)
    },
    []
  )

  return (
    <div {...omit(props, 'expandedSections', 'index', 'isExpanded', 'onKeyDown', 'setExpandedSection')} id={id} onBlur={onBlur} onFocus={onFocus}>
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
    Logger.debug(props.headerID, `Clicked, ${props.expanded ? 'collapsing' : 'expanding'} the section`)

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
