import { MutableRefObject, ReactNode, Ref } from 'react'
import { CarouselLive, CarouselRotationMode } from './enums'
import { ID, PopperData, PopperOptions } from './types'

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
  /**
   * The isCurrent boolean determines which link is the current one.
   */
  isCurrent: boolean
} & HTMLAnchorProps

export type ButtonProps = {
  innerRef?: Ref<HTMLButtonElement>
} & HTMLButtonProps

export type CarouselProps = {
  /**
   * The active slide index determines the slide that is currently visible, can also be used to set a starting slide.
   */
  activeSlideIndex?: number
  /**
   * The automatic rotation duration is the frequency at which the slides will automatically change.
   */
  automaticRotationDuration?: number
  children: (props: CarouselChildrenProps) => ReactNode
  /**
   * The label is essential to give a context to the carousel.
   */
  label: string
  /**
   * The live determines the behaviour of the carousel.
   *
   * Setting it to OFF will enable automatic rotation.
   * Setting it to ASSERTIVE or POLITE will disable automatic rotation.
   */
  live?: CarouselLive
  /**
   * The rotation mode determines the behaviour of the rotation.
   *
   * Setting it to FINITE will make it respect the start and end of the slides.
   * Setting it to INFINITE will make it overflow, going to the first slide if trying to go next while at the last slide and going to the last slide if trying to go back while at the first slide.
   */
  rotationMode?: CarouselRotationMode
} & Omit<HTMLElementProps, 'children'>

export type CarouselChildrenProps = {
  /**
   * The active slide index determines the slide that is currently visible, can also be used to set a starting slide.
   */
  activeSlideIndex: number
  /**
   * The method which takes care of deleting the unmounted slides from the internal map.
   */
  deleteSlideElementRef: (index: number) => void
  /**
   * The method which based on the activeSlideIndex goes to the next slide available, if none and the carousel mode is infinite it will go back to the first slide.
   */
  gotoNextSlide: () => void
  /**
   * The method which based on the activeSlideIndex goes to the previous slide available, if none and the carousel mode is infinite it will go to the last slide.
   */
  gotoPreviousSlide: () => void
  /**
   * The method which given an index will tell you if the slide is active or not.
   */
  isSlideActive: (index: number) => boolean
  /**
   * The live determines the behaviour of the carousel.
   *
   * Setting it to OFF will enable automatic rotation.
   * Setting it to ASSERTIVE or POLITE will disable automatic rotation.
   */
  live: CarouselLive
  /**
   * The temporary live is used during blur/focus events where only the aria-live of the Slides element has to change.
   */
  liveTemporary?: CarouselLive
  /**
   * The live setter, also takes care of handling the automatic rotation.
   */
  setLive: (live: CarouselLive) => void
  /**
   * The slide element ref setter, it is used to determine the number of slides.
   */
  setSlideElementRef: (index: number, ref: MutableRefObject<HTMLDivElement>) => void
  /**
   * The number of slides.
   */
  slides: number
  /**
   * The ID of the Slides element.
   */
  slidesID: ID
}

export type CarouselButtonLiveProps = Pick<CarouselChildrenProps, 'live' | 'setLive'> & HTMLButtonProps
export type CarouselButtonNextProps = Pick<CarouselChildrenProps, 'gotoNextSlide' | 'slidesID'> & HTMLButtonProps
export type CarouselButtonPreviousProps = Pick<CarouselChildrenProps, 'gotoPreviousSlide' | 'slidesID'> & HTMLButtonProps

export type CarouselSlideProps = {
  /**
   * The index of this slide, necessary to handle the visibility and to build the internal map of slides.
   */
  index: number
} & Pick<CarouselChildrenProps, 'deleteSlideElementRef' | 'setSlideElementRef' | 'slides'> &
  HTMLDivProps

export type CarouselSlidesProps = Pick<CarouselChildrenProps, 'live' | 'liveTemporary' | 'slidesID'> & Omit<HTMLDivProps, 'id'>

export type CheckBoxProps = {
  isChecked: boolean
} & HTMLDivProps

export type ComboBoxProps = {
  autocomplete?: boolean
  children: (props: ComboBoxChildrenProps) => ReactNode
  listBoxLabel: string
  onCollapse: () => any
  onEscape: () => any
  popperOptions: PopperOptions<unknown>
} & Omit<HTMLDivProps, 'children'>

export type ComboBoxChildrenProps = {
  deleteListBoxItemRef: (index: number) => void
  expanded: boolean
  focusedListBoxItemID?: ID
  isListBoxItemFocused: (index: number) => boolean
  listBoxID: ID
  popper: PopperData
  setExpanded: (expanded: boolean, id: ID, caller: string) => void
  setGroupRef: (ref: MutableRefObject<HTMLDivElement>) => void
  setInputRef: (ref: MutableRefObject<HTMLInputElement>) => void
  setListBoxItemRef: (index: number, ref: MutableRefObject<HTMLLIElement>) => void
  setListBoxRef: (ref: MutableRefObject<HTMLUListElement>) => void
} & Pick<ComboBoxProps, 'autocomplete' | 'listBoxLabel'>

export type ComboBoxButtonProps = Pick<ComboBoxChildrenProps, 'expanded' | 'setExpanded'> & HTMLButtonProps
export type ComboBoxGroupProps = Pick<ComboBoxChildrenProps, 'setGroupRef'> & HTMLDivProps

export type ComboBoxInputProps = Pick<
  ComboBoxChildrenProps,
  'autocomplete' | 'expanded' | 'focusedListBoxItemID' | 'listBoxID' | 'setExpanded' | 'setInputRef'
> &
  HTMLInputProps

export type ComboBoxListBoxProps = Pick<ComboBoxChildrenProps, 'listBoxID' | 'listBoxLabel' | 'popper' | 'setListBoxRef'> & Omit<HTMLUListProps, 'id'>

export type ComboBoxListBoxItemProps = {
  index: number
} & Pick<ComboBoxChildrenProps, 'deleteListBoxItemRef' | 'isListBoxItemFocused' | 'setExpanded' | 'setListBoxItemRef'> &
  HTMLLIProps

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
export type HTMLUListProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement>

export type ToggleButtonProps = {
  isToggled: boolean
} & HTMLButtonProps
