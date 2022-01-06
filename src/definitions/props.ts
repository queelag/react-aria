import { ID } from '@queelag/core'
import type {
  HTMLAnchorProps,
  HTMLButtonProps,
  HTMLDivProps,
  HTMLDListProps,
  HTMLElementProps,
  HTMLInputProps,
  HTMLLIProps,
  HTMLOListProps,
  HTMLSpanProps,
  HTMLUListProps,
  Orientation,
  WithGetStore
} from '@queelag/react-core'
import { KeyboardEvent, MutableRefObject, ReactFragment, ReactNode, TouchEvent } from 'react'
import type { AccordionStore } from '../stores/accordion.store'
import type { CarouselStore } from '../stores/carousel.store'
import type { ComboBoxStore } from '../stores/combo.box.store'
import type { ContextMenuStore } from '../stores/context.menu.store'
import type { DisclosureSectionStore } from '../stores/disclosure.section.store'
import type { FocusTrapStore } from '../stores/focus.trap.store'
import type { ListBoxStore } from '../stores/list.box.store'
import type { MenuButtonStore } from '../stores/menu.button.store'
import type { MenuStore } from '../stores/menu.store'
import type { PaginationStore } from '../stores/pagination.store'
import type { RadioGroupStore } from '../stores/radio.group.store'
import type { SliderStore } from '../stores/slider.store'
import type { TabberStore } from '../stores/tabber.store'
import type { TooltipStore } from '../stores/tooltip.store'
import type { CarouselLive, CarouselRotationMode, ListBoxSelectMode, MenuPopperReferenceElement, SliderMode, TabberActivation } from './enums'
import { PopperData, PopperOptions } from './interfaces'
import { SliderPercentual, SliderThumbIndex, SliderValue } from './types'

export interface AccordionProps extends Omit<HTMLDivProps, 'children'>, WithGetStore<HTMLDivElement, AccordionStore> {
  children: (props: AccordionChildrenProps) => ReactNode
}

export interface AccordionChildrenProps {
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

export interface AccordionSectionProps extends Omit<HTMLDivProps, 'children'>, AccordionChildrenProps {
  children: (props: AccordionSectionChildrenProps) => ReactNode
  /**
   * Setting this to false will disable the collapse of an expanded section
   */
  isCollapsable?: boolean
  /**
   * Setting this to true will automatically open the section on mount.
   */
  isExpanded?: boolean
}

export interface AccordionSectionChildrenProps {
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

export interface AccordionSectionPanelProps extends Omit<HTMLDivProps, 'aria-labelledby' | 'id' | 'role'>, AccordionSectionChildrenProps {}
export interface AccordionSectionHeaderProps extends Omit<HTMLButtonProps, 'aria-controls' | 'aria-expanded' | 'id' | 'type'>, AccordionSectionChildrenProps {}

export interface AlertProps extends HTMLDivProps {}

export interface AlertDialogChildrenProps extends DialogChildrenProps {}
export interface AlertDialogProps extends DialogProps {}
export interface AlertDialogDescriptionProps extends DialogDescriptionProps {}
export interface AlertDialogTitleProps extends DialogTitleProps {}

export interface BreadcrumbProps extends HTMLElementProps {}
export interface BreadcrumbListProps extends HTMLOListProps {}
export interface BreadcrumbListItemProps extends HTMLLIProps {}

export interface BreadcrumbListItemLinkProps extends HTMLAnchorProps {
  /**
   * The isCurrent boolean determines which link is the current one.
   */
  isCurrent: boolean
}

export interface CarouselProps extends Omit<HTMLElementProps, 'children'>, WithGetStore<HTMLElement, CarouselStore> {
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
  onChangeActiveSlideIndex?: (index: number) => any
  /**
   * The rotation mode determines the behaviour of the rotation.
   *
   * Setting it to FINITE will make it respect the start and end of the slides.
   * Setting it to INFINITE will make it overflow, going to the first slide if trying to go next while at the last slide and going to the last slide if trying to go back while at the first slide.
   */
  rotationMode?: CarouselRotationMode
}

export interface CarouselChildrenProps {
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

export interface CarouselButtonLiveProps extends HTMLButtonProps, CarouselChildrenProps {}
export interface CarouselButtonNextProps extends HTMLButtonProps, CarouselChildrenProps {}
export interface CarouselButtonPreviousProps extends HTMLButtonProps, CarouselChildrenProps {}

export interface CarouselSlideProps extends HTMLDivProps, CarouselChildrenProps {
  /**
   * The index of this slide, necessary to handle the visibility and to build the internal map of slides.
   */
  index: number
}

export interface CarouselSlidesProps extends Omit<HTMLDivProps, 'id'>, CarouselChildrenProps {}

export interface CheckBoxProps extends HTMLDivProps {
  /**
   * Determines whether the CheckBox is checked or not.
   */
  checked: boolean
}

export interface ComboBoxProps extends Omit<HTMLDivProps, 'children'>, WithGetStore<HTMLDivElement, ComboBoxStore> {
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
  onSelectListBoxItem?: (indexes: number[]) => any
  /**
   * Freely configurable popper options as they are.
   */
  popperOptions?: PopperOptions<unknown>
  selectedListBoxItemIndexes?: number[]
}

export interface ComboBoxChildrenProps extends Pick<ComboBoxProps, 'autocomplete' | 'listBoxLabel'> {
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
  focusedListBoxItemID: ID
  /**
   * The method which tells you if a ListBoxItem with a certain index is focused or not.
   */
  isListBoxItemFocused: (index: number) => boolean
  isListBoxItemSelected: (index: number) => boolean
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
  setSelectedListBoxItemIndex: (index: number, selected: boolean) => void
}

export interface ComboBoxButtonProps extends HTMLButtonProps, ComboBoxChildrenProps {}
export interface ComboBoxGroupProps extends HTMLDivProps, ComboBoxChildrenProps {}

export interface ComboBoxInputProps extends HTMLInputProps, ComboBoxChildrenProps {}

export interface ComboBoxListBoxProps extends Omit<HTMLUListProps, 'id'>, ComboBoxChildrenProps {}

export interface ComboBoxListBoxItemProps extends HTMLLIProps, ComboBoxChildrenProps {
  /**
   * The index of the ListBoxItem element.
   */
  index: number
}

export interface ContextMenuProps extends Omit<HTMLDivProps, 'children'>, WithGetStore<HTMLDivElement, ContextMenuStore> {
  children: (props: ContextMenuChildrenProps) => ReactNode
  /**
   * The popper options.
   */
  popperOptions?: PopperOptions<any>
}

export interface ContextMenuChildrenProps {
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
  /**
   * The method which sets the ref of the Trigger element.
   */
  setTriggerRef: (ref: MutableRefObject<HTMLDivElement>) => void
  /**
   * The ID of the Trigger element.
   */
  triggerID: ID
  /**
   * The ref of the Trigger element.
   */
  triggerRef: MutableRefObject<HTMLDivElement>
}

export interface ContextMenuBackdropProps extends Omit<HTMLDivProps, 'id'>, ContextMenuChildrenProps {}
export interface ContextMenuListProps extends Omit<HTMLUListProps, 'id'>, ContextMenuChildrenProps {}
export interface ContextMenuListItemProps extends HTMLLIProps, ContextMenuChildrenProps {}

export interface ContextMenuListItemAnchorProps extends HTMLAnchorProps, ContextMenuChildrenProps {
  /**
   * The index of the ListItemAnchor element.
   */
  index: number
}

export interface ContextMenuTriggerProps extends Omit<HTMLDivProps, 'id'>, ContextMenuChildrenProps {}

export interface DialogProps extends Omit<HTMLDivProps, 'children'> {
  children: (props: DialogChildrenProps) => ReactNode
  /**
   * The container used by the portal.
   */
  container?: Element
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
  /**
   * Indicates whether the Dialog will be portaled or not.
   */
  usePortal?: boolean
}

export interface DialogChildrenProps {
  /**
   * The ID of the description element.
   */
  descriptionID: ID
  /**
   * The ID of the title element.
   */
  titleID: ID
}

export interface DialogDescriptionProps extends Omit<HTMLSpanProps, 'id'>, DialogChildrenProps {}
export interface DialogTitleProps extends Omit<HTMLSpanProps, 'id'>, DialogChildrenProps {}

export interface DisclosureProps extends HTMLDListProps {}

export interface DisclosureSectionProps extends WithGetStore<Element, DisclosureSectionStore> {
  children: (props: DisclosureSectionChildrenProps) => ReactFragment
  expanded?: boolean
}

export interface DisclosureSectionChildrenProps {
  /**
   * Indicates whether the DisclosureSection is expanded or collapsed.
   */
  expanded: boolean
  /**
   * The ID of the Panel element.
   */
  panelID: ID
  /**
   * The method which sets the status of the DisclosureSection.
   */
  setExpanded: (expanded: boolean) => void
}

export interface DisclosureSectionHeaderProps extends HTMLElementProps {}
export interface DisclosureSectionHeaderButtonProps extends HTMLButtonProps, DisclosureSectionChildrenProps {}
export interface DisclosureSectionPanelProps extends Omit<HTMLElementProps, 'id'>, DisclosureSectionChildrenProps {}

export interface FocusTrapProps extends Omit<HTMLDivProps, 'ref'>, WithGetStore<HTMLDivElement, FocusTrapStore> {
  /**
   * Setting this to true will automatically focus the first inside element inside the trap.
   */
  autoFocus?: boolean
  /**
   * Setting this to true will automatically restore the focus to the element that lost it before being moved to the trap.
   */
  restoreFocus?: boolean
}

export interface ListBoxProps extends Omit<HTMLDivProps, 'children'>, WithGetStore<HTMLDivElement, ListBoxStore> {
  children: (props: ListBoxChildrenProps) => ReactNode
  /**
   * Determines if the ListBox is collapsable or not, useful for creating Select components.
   */
  collapsable?: boolean
  onSelectListItem?: (indexes: number[]) => any
  /**
   * The popper options.
   */
  popperOptions?: PopperOptions<any>
  /**
   * The select mode, can be either SINGLE or MULTIPLE, it is SINGLE by default.
   */
  selectMode?: ListBoxSelectMode
  selectedListItemIndexes?: number[]
}

export interface ListBoxChildrenProps extends Pick<ListBoxProps, 'collapsable' | 'selectMode'> {
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
   * The method which sets the index of the focused ListItem element.
   */
  setFocusedListItemIndex: (index: number) => void
  /**
   * The method which sets the ref of the List element.
   */
  setListRef: (ref: MutableRefObject<HTMLUListElement>) => void
  /**
   * The method which sets the ref of a ListItem element.
   */
  setListItemRef: (index: number, ref: MutableRefObject<HTMLLIElement>) => void
  /**
   * The method which sets the index of the selected ListItem element.
   */
  setSelectedListItemIndex: (index: number, selected: boolean) => void
}

export interface ListBoxButtonProps extends HTMLButtonProps, ListBoxChildrenProps {}
export interface ListBoxListProps extends HTMLUListProps, ListBoxChildrenProps {}

export interface ListBoxListItemProps extends HTMLLIProps, ListBoxChildrenProps {
  /**
   * The index of the ListItem element.
   */
  index: number
}

export interface MenuProps extends Omit<HTMLUListProps, 'children'>, WithGetStore<HTMLUListElement, MenuStore> {
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
  popperReferenceElement?: MenuPopperReferenceElement
}

export interface MenuChildrenProps extends Pick<MenuProps, 'autoOpen' | 'popperReferenceElement'> {
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
   * The index of the expanded Item element.
   */
  expandedItemIndex: number
  /**
   * The method which finds the ref of the ItemMenu through its ID.
   */
  findItemMenuRef: (id: ID) => MutableRefObject<HTMLUListElement>
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
   * The popper data.
   */
  popper?: PopperData
  /**
   * The ref of the Root element.
   */
  rootRef?: MutableRefObject<HTMLUListElement>
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
}

export interface MenuItemProps extends Omit<HTMLLIProps, 'children'>, MenuChildrenProps {
  children: (props: MenuItemChildrenProps) => ReactNode
  /**
   * The index of the Item element.
   */
  index: number
  /**
   * The popper options.
   */
  popperOptions?: PopperOptions<any>
}

export interface MenuItemChildrenProps
  extends Pick<
    MenuChildrenProps,
    | 'autoOpen'
    | 'deleteItemAnchorRef'
    | 'deleteItemMenuRef'
    | 'expandedItemIndex'
    | 'focusItemAnchor'
    | 'focusedItemIndex'
    | 'setExpandedItemIndex'
    | 'setFocusedItemIndex'
    | 'setItemAnchorRef'
    | 'setItemMenuRef'
  > {
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
}

export interface MenuItemAnchorProps extends MenuItemChildrenProps, HTMLAnchorProps {}
export interface MenuItemMenuProps extends MenuItemChildrenProps, HTMLUListProps {}

export interface MenuItemMenuItemAnchorProps extends HTMLAnchorProps, MenuItemChildrenProps {
  /**
   * The index of the ItemMenuItemAnchor element.
   */
  index: number
}

export interface MenuItemMenuItemProps extends HTMLLIProps, MenuItemChildrenProps {}

export interface MenuButtonProps extends Omit<HTMLDivProps, 'children'>, WithGetStore<HTMLDivElement, MenuButtonStore> {
  children: (props: MenuButtonChildrenProps) => ReactNode
  /**
   * The popper options.
   */
  popperOptions?: PopperOptions<any>
}

export interface MenuButtonChildrenProps {
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

export interface MenuButtonButtonProps extends Omit<HTMLButtonProps, 'id'>, MenuButtonChildrenProps {}
export interface MenuButtonListProps extends Omit<HTMLUListProps, 'id'>, MenuButtonChildrenProps {}
export interface MenuButtonListItemProps extends HTMLLIProps, MenuButtonChildrenProps {}

export interface MenuButtonListItemAnchorProps extends HTMLAnchorProps, MenuButtonChildrenProps {
  /**
   * The index of the ListItemAnchor element.
   */
  index: number
}

export interface MeterProps extends Omit<HTMLDivProps, 'children'> {
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
}

export interface MeterChildrenProps {
  /**
   * The percentual of the current value limited by maximum and minimum.
   */
  percentual: number
  /**
   * The current value limited by maximum and minimum.
   */
  value: number
}

export interface PaginationProps extends Omit<HTMLElementProps, 'children'>, WithGetStore<HTMLElement, PaginationStore> {
  activeListItemIndex?: number
  children: (props: PaginationChildrenProps) => ReactNode
  label: string
  listItemsIndexOffset?: number
  numberOfListItems: number
  numberOfListItemsPerPage: number
  onChangeActiveListItemIndex?: (active: number) => any
}

export interface PaginationChildrenProps {
  canGoToNextListItem: boolean
  canGoToPreviousListItem: boolean
  isListItemActive: (index: number) => boolean
  iterablePages: number[]
  nextListItemIndex: number
  previousListItemIndex: number
  setActiveListItemIndex: (index: number) => void
}

export interface PaginationListProps extends HTMLUListProps {}
export interface PaginationListItemProps extends HTMLLIProps {}

export interface PaginationListItemLinkProps extends PaginationChildrenProps, HTMLAnchorProps {
  index: number
}

export interface PaginationNextListItemLinkProps extends PaginationChildrenProps, HTMLAnchorProps {}
export interface PaginationPreviousListItemLinkProps extends PaginationChildrenProps, HTMLAnchorProps {}

export interface RadioGroupProps extends Omit<HTMLDivProps, 'children'>, WithGetStore<HTMLDivElement, RadioGroupStore> {
  checkedItemIndex?: number
  children: (props: RadioGroupChildrenProps) => ReactNode
  onCheckItem?: (index: number) => any
}

export interface RadioGroupChildrenProps {
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

export interface RadioGroupItemProps extends HTMLDivProps, RadioGroupChildrenProps {
  /**
   * The index of the Item element.
   */
  index: number
}

export interface SliderProps extends Omit<HTMLDivProps, 'children'>, WithGetStore<HTMLDivElement, SliderStore> {
  children: (props: SliderChildrenProps) => ReactNode
  /**
   * The label of the Slider.
   */
  label: string
  /**
   * The maximum value that the Slider can have, the value will be automatically lower or equal to this.
   */
  maximum: number
  /**
   * The minimum value that the Slider can have, the value will be automatically higher or equal to this.
   */
  minimum: number
  mode?: SliderMode
  onChangeValue?: (value: SliderValue) => any
  orientation?: Orientation
  step?: number
  /**
   * The current value of the Slider.
   */
  value?: SliderValue
}

export interface SliderChildrenProps extends Pick<SliderProps, 'maximum' | 'minimum' | 'orientation'> {
  handleKeyboardInteractions: (index: SliderThumbIndex, event: KeyboardEvent<HTMLDivElement>) => void
  onThumbMouseDown: (index: SliderThumbIndex) => void
  onThumbTouchEnd: (index: SliderThumbIndex) => void
  onThumbTouchMove: (index: SliderThumbIndex, event: TouchEvent<HTMLDivElement>) => void
  onThumbTouchStart: () => void
  /**
   * The percentual value of the current value based on the minimum and maximum values.
   */
  percentual: SliderPercentual
  /**
   * The current value limited by maximum and minimum.
   */
  value: SliderValue
}

export interface SliderThumbProps extends HTMLDivProps, SliderChildrenProps {
  /**
   * Determines whether the element is focusable or not.
   */
  focusable?: boolean
}

export interface TabberProps extends Omit<HTMLDivProps, 'children'>, WithGetStore<HTMLDivElement, TabberStore> {
  activation?: TabberActivation
  children: (props: TabberChildrenProps) => ReactNode
  listItemsLength: number
}

export interface TabberChildrenProps {
  deleteListItemRef: (index: number) => void
  handleKeyboardEvents: (event: KeyboardEvent<HTMLDivElement>) => void
  isTabSelected: (index: number) => boolean
  listItemIDs: ID[]
  panelIDs: ID[]
  selectedListItemIndex: number
  setListItemRef: (index: number, ref: MutableRefObject<HTMLButtonElement>) => void
  setSelectedListItemIndex: (index: number) => void
}

export interface TabberListProps extends HTMLDivProps, TabberChildrenProps {
  label: string
}

export interface TabberListItemProps extends HTMLButtonProps, TabberChildrenProps {
  index: number
}

export interface TabberPanelProps extends HTMLDivProps, TabberChildrenProps {
  index: number
}

export interface ToggleButtonProps extends HTMLButtonProps {
  /**
   * Determines whether the Button is toggled or not.
   */
  toggled: boolean
}

export interface TooltipProps extends Omit<HTMLDivProps, 'children'>, WithGetStore<HTMLDivElement, TooltipStore> {
  children: (props: TooltipChildrenProps) => ReactNode
  /**
   * The hide events are debounced with a delay to allow the user to move the mouse around without instantly closing the Tooltip.
   */
  hideDelay?: number
  /**
   * The popper options.
   */
  popperOptions?: PopperOptions<any>
}

export interface TooltipChildrenProps extends Pick<TooltipProps, 'hideDelay'> {
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
}

export interface TooltipElementProps extends Omit<HTMLDivProps, 'id'>, TooltipChildrenProps {}
export interface TooltipTriggerProps extends HTMLDivProps, TooltipChildrenProps {}
