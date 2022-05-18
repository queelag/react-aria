import { noop, NumberUtils } from '@queelag/core'
import { ComponentStore, ComponentStoreProps } from '@queelag/react-core'
import { PaginationProps } from '../definitions/props'
import { StoreLogger } from '../loggers/store.logger'

export class PaginationStore extends ComponentStore<HTMLElement> {
  activeListItemIndex: number
  listItemsIndexOffset: number
  numberOfListItems: number
  numberOfListItemsPerPage: number

  constructor(props: PaginationProps & ComponentStoreProps<HTMLElement>) {
    super('PAGINATION', props)

    this.activeListItemIndex = props.activeListItemIndex || 0
    this.listItemsIndexOffset = props.listItemsIndexOffset || 0
    this.numberOfListItems = props.numberOfListItems || 0
    this.numberOfListItemsPerPage = props.numberOfListItemsPerPage || 1
    this.onChangeActiveListItemIndex = props.onChangeActiveListItemIndex || noop
  }

  onChangeActiveListItemIndex(active: number): any {}

  setActiveListItemIndex = (index: number): void => {
    this.activeListItemIndex = NumberUtils.limit(index, this.firstListItemIndex, this.lastListItemIndex)
    StoreLogger.debug(this.id, 'setActiveListItemIndex', `The active list item index has been set to ${this.activeListItemIndex}.`)

    if (this.onChangeActiveListItemIndex !== noop) {
      this.onChangeActiveListItemIndex(this.activeListItemIndex)
      StoreLogger.debug(this.id, 'setActiveListItemIndex', `The onChangeActiveListItemIndex function has been called.`, this.onChangeActiveListItemIndex)
    }

    this.dispatch()
  }

  isListItemActive = (index: number): boolean => {
    return index === this.activeListItemIndex
  }

  get firstListItemIndex(): number {
    return this.listItemsIndexOffset
  }

  get iterablePages(): number[] {
    return new Array(this.numberOfPages).fill(0).map((v, k: number) => k + this.listItemsIndexOffset)
  }

  get lastListItemIndex(): number {
    return this.numberOfPages + this.listItemsIndexOffset - 1
  }

  get nextListItemIndex(): number {
    return NumberUtils.limit(this.activeListItemIndex + 1, this.firstListItemIndex, this.lastListItemIndex)
  }

  get numberOfPages(): number {
    return Math.ceil(this.numberOfListItems / this.numberOfListItemsPerPage)
  }

  get previousListItemIndex(): number {
    return NumberUtils.limit(this.activeListItemIndex - 1, this.firstListItemIndex, this.lastListItemIndex)
  }

  get canGoToPreviousListItem(): boolean {
    return this.activeListItemIndex > this.listItemsIndexOffset
  }

  get canGoToNextListItem(): boolean {
    return this.activeListItemIndex - this.listItemsIndexOffset < this.numberOfPages - 1
  }
}
