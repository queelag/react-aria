import { ObjectUtils } from '@queelag/core'
import { useComponentStore, useID, useSafeRef } from '@queelag/react-core'
import React, { ForwardedRef, forwardRef, KeyboardEvent, MouseEvent, MutableRefObject, useEffect } from 'react'
import { ComponentName } from '../definitions/enums'
import {
  AccordionChildrenProps,
  AccordionProps,
  AccordionSectionChildrenProps,
  AccordionSectionHeaderProps,
  AccordionSectionPanelProps,
  AccordionSectionProps
} from '../definitions/props'
import { ComponentLogger } from '../loggers/component.logger'
import { AccordionStore } from '../stores/accordion.store'

const ROOT_PROPS_KEYS: (keyof AccordionProps)[] = ['getStore']
const ROOT_CHILDREN_PROPS_KEYS: (keyof AccordionChildrenProps)[] = ['expandSection', 'expandedSections', 'setSectionHeaderRef']
const SECTION_CHILDREN_PROPS_KEYS: (keyof AccordionSectionChildrenProps)[] = ['contentID', 'expand', 'expanded', 'headerID', 'setHeaderRef']

/**
 * An accordion is a vertically stacked set of interactive headings that each contain a title, content snippet, or thumbnail representing a section of content. The headings function as controls that enable users to reveal or hide their associated sections of content. Accordions are commonly used to reduce the need to scroll when presenting multiple sections of content on a single page.
 */
export const Root = forwardRef((props: AccordionProps, ref: ForwardedRef<HTMLDivElement>) => {
  const store = useComponentStore(AccordionStore, props)

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    store.handleKeyboardInteractions(event)
    props.onKeyDown && props.onKeyDown(event)
  }

  return (
    <div {...ObjectUtils.omit(props, ROOT_PROPS_KEYS)} id={store.id} onKeyDown={onKeyDown} ref={ref}>
      {props.children({ expandSection: store.expandSection, expandedSections: store.expandedSections, setSectionHeaderRef: store.setSectionHeaderRef })}
    </div>
  )
})

export function Section(props: AccordionSectionProps) {
  const id = useID(ComponentName.ACCORDION_SECTION, props.id)
  const contentID = useID(ComponentName.ACCORDION_SECTION_PANEL)
  const headerID = useID(ComponentName.ACCORDION_SECTION_HEADER)
  const ref = useSafeRef('div')

  const expand = (expanded: boolean) => {
    props.expandSection(expanded, id, typeof props.isCollapsable === 'boolean' ? props.isCollapsable : true)
  }

  const setHeaderRef = (ref: MutableRefObject<HTMLButtonElement>) => {
    props.setSectionHeaderRef(ref, headerID)
  }

  useEffect(() => {
    if (props.isExpanded === true) {
      expand(true)
      ComponentLogger.verbose(id, 'useEffect', 'The isExpanded prop is truthy, expanding the section')
    }
  }, [props.isExpanded])

  return (
    <div {...ObjectUtils.omit(props, ROOT_CHILDREN_PROPS_KEYS)} id={id} ref={ref}>
      {props.children({ contentID, expand, expanded: props.expandedSections.get(id) || false, headerID, setHeaderRef })}
    </div>
  )
}

export function SectionHeader(props: AccordionSectionHeaderProps) {
  const ref = useSafeRef('button')

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    props.expand(!props.expanded)
    ComponentLogger.debug(props.headerID, 'onClick', `The section has been ${!props.expanded ? 'expanded' : 'collapsed'}`)

    props.onClick && props.onClick(event)
  }

  useEffect(() => {
    props.setHeaderRef(ref)
  }, [])

  return (
    <button
      {...ObjectUtils.omit(props, SECTION_CHILDREN_PROPS_KEYS)}
      aria-controls={props.contentID}
      aria-expanded={props.expanded}
      id={props.headerID}
      ref={ref}
      onClick={onClick}
      type='button'
    />
  )
}

export const SectionPanel = forwardRef((props: AccordionSectionPanelProps, ref: ForwardedRef<HTMLDivElement>) => {
  return <div {...ObjectUtils.omit(props, SECTION_CHILDREN_PROPS_KEYS)} aria-labelledby={props.headerID} id={props.contentID} ref={ref} role='region' />
})

export const AriaAccordion = {
  Root,
  Section,
  SectionHeader,
  SectionPanel
}
