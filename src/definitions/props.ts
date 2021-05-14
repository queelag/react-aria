import { MutableRefObject, ReactNode } from 'react'
import { CarouselLive } from './enums'
import { ID } from './types'

export type AccordionProps = {
  children: (props: AccordionChildrenProps) => ReactNode
} & Omit<HTMLDivProps, 'children'>

export type AccordionChildrenProps = {
  /**
   * The expandedSections setter which sets every value except from the index to false.
   */
  expandSection: (expanded: boolean, id: ID, isCollapsable: boolean) => void
  /**
   * The stateful map of boolean values which handle the visibility of the section panels.
   */
  expandedSections: Map<ID, boolean>
  /**
   * The section header ref setter, necessary to handle the keyboard interactions.
   */
  setSectionHeaderRef: (ref: MutableRefObject<HTMLButtonElement>, id: ID) => void
}

export type AccordionSectionProps = {
  children: (props: AccordionSectionChildrenProps) => ReactNode
  /**
   * Setting this to false will disable the collapse of an expanded section
   */
  isCollapsable?: boolean
  /**
   * Setting this to true will automatically open the section on mount.
   */
  isExpanded?: boolean
} & AccordionChildrenProps &
  Omit<HTMLDivProps, 'children'>

export type AccordionSectionChildrenProps = {
  /**
   * The ID of the content element.
   */
  contentID: ID
  /**
   * The expandedSections[index] setter, it behaves like the one in the AccordionSection but the index is implicit.
   */
  expand: (expanded: boolean) => void
  /**
   * The expanded state derived from expandedSections[index].
   */
  expanded: boolean
  /**
   * The ID of the header element.
   */
  headerID: ID
  /**
   * The header ref setter, necessary to handle the keyboard interactions.
   */
  setHeaderRef: (ref: MutableRefObject<HTMLButtonElement>) => void
}

export type AccordionSectionPanelProps = Pick<AccordionSectionChildrenProps, 'contentID' | 'headerID'> & Omit<HTMLDivProps, 'aria-labelledby' | 'id' | 'role'>
export type AccordionSectionHeaderProps = AccordionSectionChildrenProps & Omit<HTMLButtonProps, 'aria-controls' | 'aria-expanded' | 'id' | 'type'>

export type AlertProps = HTMLDivProps

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
  onClose: () => any
} & Omit<HTMLDivProps, 'children' | 'ref'>

export type AlertDialogDescriptionProps = Pick<AlertDialogChildrenProps, 'descriptionID'> & Omit<HTMLSpanProps, 'id'>
export type AlertDialogTitleProps = Pick<AlertDialogChildrenProps, 'titleID'> & Omit<HTMLSpanProps, 'id'>

export type BreadcrumbProps = HTMLElementProps
export type BreadcrumbListProps = HTMLOListProps
export type BreadcrumbListItemProps = HTMLLIProps

export type BreadcrumbListItemLinkProps = {
  isCurrent: boolean
} & HTMLAnchorProps

export type ButtonProps = HTMLButtonProps

export type CarouselProps = {
  automaticRotationDuration?: number
  children: (props: CarouselChildrenProps) => ReactNode
  label: string
  live?: CarouselLive
} & Omit<HTMLElementProps, 'children'>

export type CarouselChildrenProps = {
  activeSlideIndex: number
  deleteSlideElementRef: (index: number) => void
  gotoNextSlide: () => void
  gotoPreviousSlide: () => void
  isSlideActive: (index: number) => boolean
  live: CarouselLive
  liveTemporary?: CarouselLive
  setLive: (live: CarouselLive) => void
  setSlideElementRef: (index: number, ref: MutableRefObject<HTMLDivElement>) => void
  slides: number
  slidesID: ID
}

export type CarouselSlidesProps = {
  live: CarouselLive
  liveTemporary?: CarouselLive
  slidesID: ID
} & Omit<HTMLDivProps, 'id'>

export type CarouselSlideProps = {
  deleteSlideElementRef: (index: number) => void
  index: number
  setSlideElementRef: (index: number, ref: MutableRefObject<HTMLDivElement>) => void
  slides: number
} & HTMLDivProps

export type CarouselButtonLiveProps = {
  live: CarouselLive
  setLive: (live: CarouselLive) => void
} & ButtonProps

export type CarouselButtonPreviousProps = {
  gotoPreviousSlide: () => void
  slidesID: ID
} & ButtonProps

export type CarouselButtonNextProps = {
  gotoNextSlide: () => void
  slidesID: ID
} & ButtonProps

export type FocusTrapProps = {
  /**
   * Setting this to true will automatically focus the first inside element inside the trap.
   */
  autoFocus?: boolean
  /**
   * Setting this to true will automatically restore the focus to the element that lost it before being moved to the trap.
   */
  restoreFocus?: boolean
} & Omit<HTMLDivProps, 'ref'>

export type HTMLAnchorProps = React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>
export type HTMLButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
export type HTMLDivProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
export type HTMLElementProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
export type HTMLImageProps = React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
export type HTMLInputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
export type HTMLLabelProps = React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>
export type HTMLLIProps = React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>
export type HTMLFormProps = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>
export type HTMLOListProps = React.DetailedHTMLProps<React.OlHTMLAttributes<HTMLOListElement>, HTMLOListElement>
export type HTMLSpanProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>

export type ToggleButtonProps = {
  isToggled: boolean
} & ButtonProps
