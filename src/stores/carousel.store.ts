import { MutableRefObject } from 'react'
import { CarouselLive, ComponentName } from '../definitions/enums'
import { ID } from '../definitions/types'
import ComponentStore from '../modules/component.store'
import Logger from '../modules/logger'
import rc from '../modules/rc'

class CarouselStore extends ComponentStore<HTMLElement> {
  activeSlide: ID
  live: CarouselLive
  slideElementRefs: Map<ID, MutableRefObject<HTMLDivElement>>
  slidesElementRef: MutableRefObject<HTMLDivElement>

  constructor(ref: MutableRefObject<HTMLElement>, update: () => void, id?: string) {
    super(ComponentName.CAROUSEL, ref, update, id)

    this.activeSlide = ''
    this.live = CarouselLive.OFF
    this.slideElementRefs = new Map()
    this.slidesElementRef = { current: document.createElement('div') }
  }

  setActiveSlide = (slide: ID): void => {
    this.activeSlide = slide
    Logger.debug(this.id, 'setActiveSlide', `The slide ${slide} has been set as the active slide.`)

    this.update()
  }

  setLive = (live: CarouselLive): void => {
    this.live = live
    Logger.debug(this.id, 'setLive', `The live has been set to ${live}`)

    this.update()
  }

  setSlideElementRef = (id: ID, ref: MutableRefObject<HTMLDivElement>): void => {
    if (this.slideElementRefs.size <= 0) {
      this.activeSlide = id
      Logger.debug(this.id, 'setSlideElementRef', `The slide ${id} has been set as the active slide.`)
    }

    this.slideElementRefs.set(id, ref)
    Logger.debug(this.id, 'setSlideElementRef', `The slide ${id} has been set to the slide element refs.`)

    this.update()
  }

  setSlidesElementRef = (ref: MutableRefObject<HTMLDivElement>): void => {
    this.slidesElementRef = ref
    Logger.debug(this.id, 'setSlidesElementRef', `The slides element ref has been set.`)

    this.update()
  }

  gotoPreviousSlide = (): void => {
    let index: number, ref: MutableRefObject<HTMLDivElement>

    index = this.findSlideIndex(this.activeSlide)
    if (index < 0) return

    ref = this.findSlideElementRefByIndex(index > 0 ? index - 1 : this.slideElementRefs.size - 1)
    if (!ref.current.id) return

    this.setActiveSlide(ref.current.id)
  }

  gotoNextSlide = (): void => {
    let index: number, ref: MutableRefObject<HTMLDivElement>

    index = this.findSlideIndex(this.activeSlide)
    if (index < 0) return

    ref = this.findSlideElementRefByIndex(index < this.slideElementRefs.size - 1 ? index + 1 : 0)
    if (!ref.current.id) return

    this.setActiveSlide(ref.current.id)
  }

  findSlideElementRefByIndex = (index: number): MutableRefObject<HTMLDivElement> => {
    let ref: MutableRefObject<HTMLDivElement>

    ref = [...this.slideElementRefs.values()][index]
    if (!ref)
      return rc(() => Logger.error(this.id, 'findSlideElementRefByIndex', `Failed to find the ref of the slide with index ${index}`), {
        current: document.createElement('div')
      })

    return ref
  }

  findSlideIndex = (id: ID): number => {
    let ref: MutableRefObject<HTMLDivElement> | undefined, index: number

    ref = this.slideElementRefs.get(id)
    if (!ref) return rc(() => Logger.error(this.id, 'findSlideIndex', `Failed to find the ref of the slide ${id}`), -1)

    index = [...this.slideElementRefs.values()].indexOf(ref)
    if (index < 0) return rc(() => Logger.error(this.id, 'findSlideIndex', `Failed to find the index of the slide ${id}`), -1)

    return index
  }

  isSlideActive = (id: ID): boolean => {
    return this.activeSlide === id
  }
}

export default CarouselStore
