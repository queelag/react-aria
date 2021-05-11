import { ReactNode } from 'react'
import { ID } from './types'

export type AccordionProps = {
  children: (props: AccordionChildrenProps) => ReactNode
  /**
   * The number of sections.
   */
  size: number
} & Omit<HTMLDivProps, 'children' | 'id'>

export type AccordionChildrenProps = {
  /**
   * The stateful list of boolean values which handle the visibility of the section panels.
   */
  expandedSections: boolean[]
  /**
   * The keyboard interactions handler.
   */
  onKeyDown: (event: KeyboardEvent) => void
  /**
   * The expandedSections setter which sets every value except from the index to false.
   */
  setExpandedSection: (expanded: boolean, index: number) => void
}

export type AccordionSectionProps = {
  children: (props: AccordionSectionChildrenProps) => ReactNode
  /**
   * The index of this section, it is required to handle the expansion logic.
   */
  index: number
  /**
   * Setting this to true will automatically open the section on mount.
   */
  isExpanded?: boolean
} & AccordionChildrenProps &
  Omit<HTMLDivProps, 'children' | 'id' | 'onKeyDown'>

export type AccordionSectionChildrenProps = {
  /**
   * The ID of the content element.
   */
  contentID: ID
  /**
   * The expanded state derived from expandedSections[index].
   */
  expanded: boolean
  /**
   * The ID of the header element.
   */
  headerID: ID
  /**
   * The expandedSections[index] setter, it behaves like the one in the AccordionSection but the index is implicit.
   */
  setExpanded: (expanded: boolean) => void
}

export type AccordionSectionPanelProps = Pick<AccordionSectionChildrenProps, 'contentID' | 'headerID'> & Omit<HTMLDivProps, 'aria-labelledby' | 'id' | 'role'>
export type AccordionSectionHeaderProps = AccordionSectionChildrenProps & Omit<HTMLButtonProps, 'aria-controls' | 'aria-expanded' | 'id' | 'type'>

export type HTMLButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
export type HTMLDivProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
export type HTMLElementProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
export type HTMLImageProps = React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
export type HTMLInputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
export type HTMLLabelProps = React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>
export type HTMLFormProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLFormElement>, HTMLFormElement>
export type HTMLSpanProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>
