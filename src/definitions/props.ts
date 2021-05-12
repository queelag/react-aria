import { MutableRefObject, ReactNode } from 'react'
import { ID } from './types'

export type AccordionProps = {
  children: (props: AccordionChildrenProps) => ReactNode
} & Omit<HTMLDivProps, 'children' | 'id'>

export type AccordionChildrenProps = {
  /**
   * The stateful map of boolean values which handle the visibility of the section panels.
   */
  expandedSections: Map<number, boolean>
  /**
   * The expandedSections setter which sets every value except from the index to false.
   */
  setExpandedSection: (expanded: boolean, index: number, isCollapsable: boolean) => void
  /**
   * The section ref setter, necessary to handle the keyboard interactions.
   */
  setSectionRef: (ref: MutableRefObject<HTMLDivElement>, index: number) => void
}

export type AccordionSectionProps = {
  children: (props: AccordionSectionChildrenProps) => ReactNode
  /**
   * The index of this section, it is required to handle the expansion logic.
   */
  index: number
  /**
   * Setting this to false will disable the collapse of an expanded section
   */
  isCollapsable?: boolean
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

export type AlertProps = Omit<HTMLDivProps, 'id'>

export type AlertDialogChildrenProps = {
  /**
   * The ID of the description element.
   */
  descriptionID: ID
  /**
   * The ID of the title element.
   */
  titleID: ID
}

export type AlertDialogProps = {
  children: (props: AlertDialogChildrenProps) => ReactNode
  /**
   * The method which handles the closure of the alert dialog.
   */
  onClose: () => void
} & Omit<HTMLDivProps, 'children' | 'id' | 'ref'>

export type AlertDialogDescriptionProps = Pick<AlertDialogChildrenProps, 'descriptionID'> & Omit<HTMLSpanProps, 'id'>
export type AlertDialogTitleProps = Pick<AlertDialogChildrenProps, 'titleID'> & Omit<HTMLSpanProps, 'id'>

export type FocusTrapProps = {
  /**
   * Setting this to true will automatically focus the first inside element inside the trap.
   */
  autoFocus?: boolean
  /**
   * Setting this to true will automatically restore the focus to the element that lost it before being moved to the trap.
   */
  restoreFocus?: boolean
} & Omit<HTMLDivProps, 'id' | 'ref'>

export type HTMLButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
export type HTMLDivProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
export type HTMLElementProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
export type HTMLImageProps = React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
export type HTMLInputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
export type HTMLLabelProps = React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>
export type HTMLFormProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLFormElement>, HTMLFormElement>
export type HTMLSpanProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>
