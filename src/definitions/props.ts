import { MutableRefObject, ReactFragment, ReactNode, Ref } from 'react'
import { CarouselLive, CarouselRotationMode, DisclosureStatus, ListBoxSelectMode } from './enums'
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

export type AlertDialogChildrenProps = DialogChildrenProps
export type AlertDialogProps = DialogProps
export type AlertDialogDescriptionProps = DialogDescriptionProps
export type AlertDialogTitleProps = DialogTitleProps

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
  /**
   * Determines whether the CheckBox is checked or not.
   */
  checked: boolean
} & HTMLDivProps

export type ComboBoxProps = {
  /**
   * Required if your ComboBox implementation has some kind of autocomplete logic.
   */
  autocomplete?: boolean
  children: (props: ComboBoxChildrenProps) => ReactNode
  /**
   * The label of the ListBox element, required for aria purposes.
   */
  listBoxLabel: string
  /**
   * The callback of the collapse event.
   */
  onCollapse: () => any
  /**
   * The callback of the escape event, trigger by the keyboard.
   */
  onEscape: () => any
  /**
   * Freely configurable popper options as they are.
   */
  popperOptions?: PopperOptions<unknown>
} & Omit<HTMLDivProps, 'children'>

export type ComboBoxChildrenProps = {
  /**
   * The method which takes care of deleting the unmounted ListBoxItem components from the internal map.
   */
  deleteListBoxItemRef: (index: number) => void
  /**
   * Indicates whether the ComboBox is expanded or collapsed.
   */
  expanded: boolean
  /**
   * The ID of the focused ListBoxItem.
   */
  focusedListBoxItemID?: ID
  /**
   * The method which tells you if a ListBoxItem with a certain index is focused or not.
   */
  isListBoxItemFocused: (index: number) => boolean
  /**
   * The ID of the ListBox element.
   */
  listBoxID: ID
  /**
   * The popper data.
   */
  popper: PopperData
  /**
   * The method which sets the expanded value.
   */
  setExpanded: (expanded: boolean, id: ID, caller: string) => void
  /**
   * The method which sets the ref of the Group element.
   */
  setGroupRef: (ref: MutableRefObject<HTMLDivElement>) => void
  /**
   * The method which sets the ref of the Input element.
   */
  setInputRef: (ref: MutableRefObject<HTMLInputElement>) => void
  /**
   * The method which sets the ref of the ListBoxItem ref.
   */
  setListBoxItemRef: (index: number, ref: MutableRefObject<HTMLLIElement>) => void
  /**
   * The method which sets the ref of the ListBox element.
   */
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
  /**
   * The index of the ListBoxItem element.
   */
  index: number
} & Pick<ComboBoxChildrenProps, 'deleteListBoxItemRef' | 'isListBoxItemFocused' | 'setExpanded' | 'setListBoxItemRef'> &
  HTMLLIProps

export type DialogProps = {
  children: (props: DialogChildrenProps) => ReactNode
  /**
   * Required if your Dialog has a description.
   */
  hasDescription?: boolean
  /**
   * Required if your Dialog has a title.
   */
  hasTitle?: boolean
  /**
   * The method which handles the closure of the dialog.
   */
  onClose: () => any
} & Omit<HTMLDivProps, 'children'>

export type DialogChildrenProps = {
  /**
   * The ID of the description element.
   */
  descriptionID: ID
  /**
   * The ID of the title element.
   */
  titleID: ID
}

export type DialogDescriptionProps = Pick<DialogChildrenProps, 'descriptionID'> & Omit<HTMLSpanProps, 'id'>
export type DialogTitleProps = Pick<DialogChildrenProps, 'titleID'> & Omit<HTMLSpanProps, 'id'>

export type DisclosureProps = HTMLDListProps

export type DisclosureSectionProps = {
  children: (props: DisclosureSectionChildrenProps) => ReactFragment
}

export type DisclosureSectionChildrenProps = {
  /**
   * The ID of the Panel element.
   */
  panelID: ID
  /**
   * The method which sets the status of the DisclosureSection.
   */
  setStatus: (status: DisclosureStatus) => void
  /**
   * Indicates whether the DisclosureSection is expanded or collapsed.
   */
  status: DisclosureStatus
}

export type DisclosureSectionHeaderProps = HTMLElementProps
export type DisclosureSectionHeaderButtonProps = DisclosureSectionChildrenProps & HTMLButtonProps
export type DisclosureSectionPanelProps = Pick<DisclosureSectionChildrenProps, 'panelID'> & Omit<HTMLElementProps, 'id'>

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

export type ListBoxProps = {
  children: (props: ListBoxChildrenProps) => ReactNode
  /**
   * Determines if the ListBox is collapsable or not, useful for creating Select components.
   */
  collapsable?: boolean
  /**
   * The popper options.
   */
  popperOptions?: PopperOptions<any>
  /**
   * The select mode, can be either SINGLE or MULTIPLE, it is SINGLE by default.
   */
  selectMode?: ListBoxSelectMode
} & Omit<HTMLDivProps, 'children'>

export type ListBoxChildrenProps = {
  /**
   * The method which takes care of deleting the unmounted ListItem ref from the internal map.
   */
  deleteListItemRef: (index: number) => void
  /**
   * Indicates whether the ListBox is expanded or collapsed.
   */
  expanded: boolean
  /**
   * The ID of the focused ListItem element.
   */
  focusedListItemID: ID
  /**
   * The method which tells you if a ListItem is focused or not.
   */
  isListItemFocused: (index: number) => boolean
  /**
   * The method which tells you if a ListItem is selected or not.
   */
  isListItemSelected: (index: number) => boolean
  /**
   * The popper data.
   */
  popper: PopperData
  /**
   * The method which sets the ref of the Button element.
   */
  setButtonRef: (ref: MutableRefObject<HTMLButtonElement>) => void
  /**
   * The method which sets the expanded value.
   */
  setExpanded: (expanded: boolean, id: ID, context: string) => void
  /**
   * The method which sets the ref of a ListItem element.
   */
  setListItemRef: (index: number, ref: MutableRefObject<HTMLLIElement>) => void
  /**
   * The method which sets the ref of the List element.
   */
  setListRef: (ref: MutableRefObject<HTMLUListElement>) => void
  /**
   * The method which sets the index of the focused ListItem element.
   */
  setFocusedListItemIndex: (index: number) => void
  /**
   * The method which sets the index of the selected ListItem element.
   */
  setSelectedListItemIndex: (selected: boolean, index: number) => void
} & Pick<ListBoxProps, 'collapsable' | 'selectMode'>

export type ListBoxButtonProps = Pick<ListBoxChildrenProps, 'collapsable' | 'expanded' | 'setButtonRef' | 'setExpanded'> & HTMLButtonProps
export type ListBoxListProps = Pick<ListBoxChildrenProps, 'collapsable' | 'focusedListItemID' | 'popper' | 'selectMode' | 'setExpanded' | 'setListRef'> &
  HTMLUListProps

export type ListBoxListItemProps = {
  /**
   * The index of the ListItem element.
   */
  index: number
} & Pick<ListBoxChildrenProps, 'deleteListItemRef' | 'isListItemSelected' | 'setFocusedListItemIndex' | 'setListItemRef' | 'setSelectedListItemIndex'> &
  HTMLLIProps

export type HTMLAnchorProps = React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>
export type HTMLButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
export type HTMLDivProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
export type HTMLDListProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDListElement>, HTMLDListElement>
export type HTMLElementProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
export type HTMLImageProps = React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
export type HTMLInputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
export type HTMLLabelProps = React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>
export type HTMLLIProps = React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>
export type HTMLFormProps = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>
export type HTMLOListProps = React.DetailedHTMLProps<React.OlHTMLAttributes<HTMLOListElement>, HTMLOListElement>
export type HTMLSpanProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>
export type HTMLUListProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement>

export type MenuProps = {
  /**
   * Determines the behavior of the Menu, setting this to true will open the MenuItems on hover while setting it to false will require a click.
   */
  autoOpen?: boolean
  children: (props: MenuChildrenProps) => ReactNode
  /**
   * The hide events are debounced with a delay to allow the user to move the mouse around without instantly closing the ItemMenu.
   */
  itemMenuHideDelay?: number
  /**
   * The label of the Menu element.
   */
  label: string
} & Omit<HTMLUListProps, 'children'>

export type MenuChildrenProps = {
  /**
   * The method which takes care of deleting the ref of the ItemAnchor element when unmounted.
   */
  deleteItemAnchorRef: (index: number) => void
  /**
   * The method which takes care of deleting the ref of the ItemMenu element when unmounted.
   */
  deleteItemMenuRef: (id: ID) => void
  /**
   * The method which takes care of deleting the ref of the ItemMenuItemAnchor element when unmounted.
   */
  deleteItemMenuItemAnchorRef: (parentIndex: number, index: number) => void
  /**
   * The method which finds the ref of the ItemMenu through its ID.
   */
  findItemMenuRef: (id: ID) => MutableRefObject<HTMLUListElement>
  /**
   * The index of the expanded Item element.
   */
  expandedItemIndex: number
  /**
   * The method which focuses the ItemAnchor element.
   */
  focusItemAnchor: (index: number) => void
  /**
   * The index of the focused Item element.
   */
  focusedItemIndex: number
  /**
   * The method which tells you if an Item is expanded or collapsed.
   */
  isItemExpanded: (index: number) => boolean
  /**
   * The method which sets the index of the expanded Item element.
   */
  setExpandedItemIndex: (index: number, delay?: number) => void
  /**
   * The method which sets the index of the focused Item element.
   */
  setFocusedItemIndex: (index: number) => void
  /**
   * The method which sets the ref of the ItemAnchor element.
   */
  setItemAnchorRef: (index: number, ref: MutableRefObject<HTMLAnchorElement>) => void
  /**
   * The method which sets the ref of the ItemMenu element.
   */
  setItemMenuRef: (id: ID, ref: MutableRefObject<HTMLUListElement>) => void
  /**
   * The method which sets the ref of the ItemMenuItemAnchor element.
   */
  setItemMenuItemAnchorRef: (parentIndex: number, index: number, ref: MutableRefObject<HTMLAnchorElement>) => void
} & Pick<MenuProps, 'autoOpen'>

export type MenuItemProps = {
  children: (props: MenuItemChildrenProps) => ReactNode
  /**
   * The index of the Item element.
   */
  index: number
  /**
   * The popper options.
   */
  popperOptions?: PopperOptions<any>
} & MenuChildrenProps &
  Omit<HTMLLIProps, 'children'>

export type MenuItemChildrenProps = {
  /**
   * The method which takes care of deleting the ref of the ItemMenuItemAnchor element when unmounted.
   */
  deleteItemMenuItemAnchorRef: (index: number) => void
  /**
   * Indicates whether the Item is expanded or collapsed.
   */
  expanded: boolean
  /**
   * The ID of the parent element.
   */
  parentID: ID
  /**
   * The index of the parent element.
   */
  parentIndex: number
  /**
   * The popper data.
   */
  popper: PopperData
  /**
   * The method which sets the ref of the ItemMenuItemAnchor element.
   */
  setItemMenuItemAnchorRef: (index: number, ref: MutableRefObject<HTMLAnchorElement>) => void
} & Pick<
  MenuChildrenProps,
  | 'autoOpen'
  | 'deleteItemAnchorRef'
  | 'deleteItemMenuRef'
  | 'expandedItemIndex'
  | 'focusItemAnchor'
  | 'focusedItemIndex'
  | 'setExpandedItemIndex'
  | 'setItemAnchorRef'
  | 'setItemMenuRef'
>

export type MenuItemAnchorProps = {
  children: string
} & Pick<
  MenuItemChildrenProps,
  | 'autoOpen'
  | 'deleteItemAnchorRef'
  | 'expanded'
  | 'expandedItemIndex'
  | 'focusItemAnchor'
  | 'focusedItemIndex'
  | 'parentIndex'
  | 'setExpandedItemIndex'
  | 'setItemAnchorRef'
> &
  Omit<HTMLAnchorProps, 'children'>

export type MenuItemMenuProps = {} & Pick<MenuItemChildrenProps, 'deleteItemMenuRef' | 'expanded' | 'parentID' | 'popper' | 'setItemMenuRef'> & HTMLUListProps

export type MenuItemMenuItemAnchorProps = {
  /**
   * The index of the ItemMenuItemAnchor element.
   */
  index: number
} & Pick<MenuItemChildrenProps, 'deleteItemMenuItemAnchorRef' | 'parentIndex' | 'setExpandedItemIndex' | 'setItemMenuItemAnchorRef'> &
  HTMLAnchorProps

export type MenuItemMenuItemProps = HTMLLIProps

export type MenuButtonProps = {
  children: (props: MenuButtonChildrenProps) => ReactNode
  /**
   * The popper options.
   */
  popperOptions?: PopperOptions<any>
} & Omit<HTMLDivProps, 'children'>

export type MenuButtonChildrenProps = {
  /**
   * The ID of the Button element.
   */
  buttonID: ID
  /**
   * The method which takes care of deleting the ref of the ListItemAnchor element when unmounted.
   */
  deleteListItemAnchorRef: (index: number) => void
  /**
   * Indicates whether the Menu is expanded or collapsed.
   */
  expanded: boolean
  /**
   * The ID of the List element.
   */
  listID: ID
  /**
   * The popper data.
   */
  popper: PopperData
  /**
   * The method which sets the ref of the Button element.
   */
  setButtonRef: (ref: MutableRefObject<HTMLButtonElement>) => void
  /**
   * The method which sets the expanded value.
   */
  setExpanded: (expanded: boolean) => void
  /**
   * The method which sets the ref of the List element.
   */
  setListRef: (ref: MutableRefObject<HTMLUListElement>) => void
  /**
   * The method which sets the ref of the ListItemAnchor element.
   */
  setListItemAnchorRef: (index: number, ref: MutableRefObject<HTMLAnchorElement>) => void
}

export type MenuButtonButtonProps = {} & Pick<MenuButtonChildrenProps, 'buttonID' | 'expanded' | 'listID' | 'setButtonRef' | 'setExpanded'> &
  Omit<HTMLButtonProps, 'id'>
export type MenuButtonListProps = {} & Pick<MenuButtonChildrenProps, 'buttonID' | 'listID' | 'popper' | 'setListRef'> & Omit<HTMLUListProps, 'id'>
export type MenuButtonListItemProps = {} & HTMLLIProps

export type MenuButtonListItemAnchorProps = {
  /**
   * The index of the ListItemAnchor element.
   */
  index: number
} & Pick<MenuButtonChildrenProps, 'deleteListItemAnchorRef' | 'setExpanded' | 'setListItemAnchorRef'> &
  HTMLAnchorProps

export type MeterProps = {
  children: (props: MeterChildrenProps) => ReactNode
  /**
   * The maximum value that the Meter can have, the value will be automatically lower or equal to this.
   */
  maximum: number
  /**
   * The minimum value that the Meter can have, the value will be automatically higher or equal to this.
   */
  minimum: number
  /**
   * The current value of the Meter.
   */
  value: number
} & Omit<HTMLDivProps, 'children'>

export type MeterChildrenProps = {
  /**
   * The percentual of the current value limited by maximum and minimum.
   */
  percentual: number
  /**
   * The current value limited by maximum and minimum.
   */
  value: number
}

export type RadioGroupProps = {
  children: (props: RadioGroupChildrenProps) => ReactNode
} & Omit<HTMLDivProps, 'children'>

export type RadioGroupChildrenProps = {
  /**
   * The index of the checked Item element.
   */
  checkedItemIndex: number
  /**
   * The method which takes care of deleting the ref of an Item element when unmounted.
   */
  deleteItemRef: (index: number) => void
  /**
   * The method which tells you whether an Item element is checked or not.
   */
  isItemChecked: (index: number) => boolean
  /**
   * The method which sets the ref of an Item element.
   */
  setItemRef: (index: number, ref: MutableRefObject<HTMLDivElement>) => void
  /**
   * The method which sets index of the checked Item element.
   */
  setCheckedItemIndex: (index: number) => void
}

export type RadioGroupItemProps = {
  /**
   * The index of the Item element.
   */
  index: number
} & RadioGroupChildrenProps &
  HTMLDivProps

export type SliderProps = {
  children: (props: SliderChildrenProps) => ReactNode
  /**
   * The maximum value that the Slider can have, the value will be automatically lower or equal to this.
   */
  maximum: number
  /**
   * The minimum value that the Slider can have, the value will be automatically higher or equal to this.
   */
  minimum: number
  onChangeValue: (value: number) => any
  stepSize?: number
  /**
   * The current value of the Slider.
   */
  value: number
} & Omit<HTMLDivProps, 'children'>

export type SliderChildrenProps = {
  percentual: number
  setThumbRef: (ref: MutableRefObject<HTMLDivElement>) => void
  /**
   * The current value limited by maximum and minimum.
   */
  value: number
} & Pick<SliderProps, 'maximum' | 'minimum'>

export type SliderThumbProps = {
  /**
   * Determines whether the element is focusable or not.
   */
  focusable?: boolean
} & SliderChildrenProps &
  HTMLDivProps

export type ToggleButtonProps = {
  /**
   * Determines whether the Button is toggled or not.
   */
  toggled: boolean
} & HTMLButtonProps

export type TooltipProps = {
  children: (props: TooltipChildrenProps) => ReactNode
  /**
   * The hide events are debounced with a delay to allow the user to move the mouse around without instantly closing the Tooltip.
   */
  hideDelay?: number
  /**
   * The popper options.
   */
  popperOptions?: PopperOptions<any>
} & Omit<HTMLDivProps, 'children'>

export type TooltipChildrenProps = {
  /**
   * The ID of the Element element.
   */
  elementID: ID
  /**
   * The popper data.
   */
  popper: PopperData
  /**
   * The ID of the Root element.
   */
  rootID: ID
  /**
   * The method which sets the ref of the Element element.
   */
  setElementRef: (ref: MutableRefObject<HTMLDivElement>) => void
  /**
   * The method which sets the ref of the Trigger element.
   */
  setTriggerRef: (ref: MutableRefObject<HTMLDivElement>) => void
  /**
   * The method which sets the visible value.
   */
  setVisible: (visible: boolean) => void
  /**
   * Indicates whether the Tooltip is visible or hidden.
   */
  visible: boolean
} & Pick<TooltipProps, 'hideDelay'>

export type TooltipElementProps = {} & Pick<TooltipChildrenProps, 'elementID' | 'rootID' | 'setElementRef' | 'popper' | 'setVisible'> & Omit<HTMLDivProps, 'id'>

export type TooltipTriggerProps = {
  /**
   * Determines whether the element is focusable or not.
   */
  focusable?: boolean
} & Pick<TooltipChildrenProps, 'elementID' | 'hideDelay' | 'rootID' | 'setTriggerRef' | 'setVisible'> &
  HTMLDivProps
