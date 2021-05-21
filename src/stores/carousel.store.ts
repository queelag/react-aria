import { MutableRefObject } from 'react'
import { CarouselLive, CarouselRotationMode, ComponentName } from '../definitions/enums'
import ComponentStore from '../modules/component.store'
import Logger from '../modules/logger'
import rc from '../modules/rc'

class CarouselStore extends ComponentStore {
  activeSlideIndex: number
  automaticRotationDuration: number
  automaticRotationInterval: number
  live: CarouselLive
  liveTemporary?: CarouselLive
  mouseEntered: boolean
  rotationMode: CarouselRotationMode
  slideElementRefs: Map<number, MutableRefObject<HTMLDivElement>>

  constructor(
    update: () => void,
    id?: string,
    activeSlideIndex: number = 0,
    automaticRotationDuration: number = 2000,
    live: CarouselLive = CarouselLive.OFF,
    rotationMode: CarouselRotationMode = CarouselRotationMode.INFINITE
  ) {
    super(ComponentName.CAROUSEL, update, id)

    this.activeSlideIndex = activeSlideIndex
    this.automaticRotationDuration = automaticRotationDuration
    this.automaticRotationInterval = 0
    this.rotationMode = rotationMode
    this.live = live
    this.mouseEntered = false
    this.slideElementRefs = new Map()

    this.toggleAutomaticRotation()
  }

  handleFocusEvent = (): void => {
    switch (this.live) {
      case CarouselLive.ASSERTIVE:
      case CarouselLive.POLITE:
        return Logger.debug(this.id, 'handleFocusEvent', `The live is already set to ${this.live}.`)
      case CarouselLive.OFF:
        this.liveTemporary = CarouselLive.POLITE
        Logger.debug(this.id, 'handleFocusEvent', `The temporary live has been set to polite.`)

        this.disableAutomaticRotation()
        this.update()

        break
    }
  }

  handleBlurEvent = (): void => {
    if (this.isLiveOff) {
      this.enableAutomaticRotation()
    }

    this.liveTemporary = undefined
    Logger.debug(this.id, 'handleBlurEvent', `The temporary live has been unset.`)

    this.update()
  }

  setActiveSlide = (index: number): void => {
    this.activeSlideIndex = index
    Logger.debug(this.id, 'setActiveSlide', `The slide with index ${index} has been set as the active slide.`)

    this.update()
  }

  setLive = (live: CarouselLive): void => {
    this.live = live
    Logger.debug(this.id, 'setLive', `The live has been set to ${live}.`)

    this.toggleAutomaticRotation()
    this.update()
  }

  setSlideElementRef = (index: number, ref: MutableRefObject<HTMLDivElement>): void => {
    this.slideElementRefs.set(index, ref)
    Logger.debug(this.id, 'setSlideElementRef', `The slide with index ${index} has been set to the slide element refs.`)

    this.update()
  }

  deleteSlideElementRef = (index: number): void => {
    let exists: boolean

    exists = this.slideElementRefs.has(index)
    if (!exists) return Logger.error(this.id, 'deleteSlideElementRef', `Failed to find the ref of the slide with index ${index}.`)

    this.slideElementRefs.delete(index)
    Logger.debug(this.id, 'deleteSlideElementRef', `The ref of the slide with index ${index} has been deleted.`)
  }

  gotoPreviousSlide = (): void => {
    if (this.slideElementRefs.size <= 1) {
      return Logger.debug(this.id, 'gotoPreviousSlide', `There aren't enough slides to traverse.`)
    }

    switch (this.rotationMode) {
      case CarouselRotationMode.FINITE:
        if (this.activeSlideIndex <= 0) {
          return this.setLive(CarouselLive.POLITE)
        }

        return this.setActiveSlide(this.activeSlideIndex - 1)
      case CarouselRotationMode.INFINITE:
        return this.setActiveSlide(this.activeSlideIndex > 0 ? this.activeSlideIndex - 1 : this.slideElementRefs.size - 1)
    }
  }

  gotoNextSlide = (): void => {
    if (this.slideElementRefs.size <= 1) {
      return Logger.debug(this.id, 'gotoNextSlide', `There aren't enough slides to traverse.`)
    }

    switch (this.rotationMode) {
      case CarouselRotationMode.FINITE:
        if (this.activeSlideIndex >= this.slideElementRefs.size - 1) {
          return this.setLive(CarouselLive.POLITE)
        }

        return this.setActiveSlide(this.activeSlideIndex + 1)
      case CarouselRotationMode.INFINITE:
        return this.setActiveSlide(this.activeSlideIndex < this.slideElementRefs.size - 1 ? this.activeSlideIndex + 1 : 0)
    }
  }

  disableAutomaticRotation = (): void => {
    window.clearInterval(this.automaticRotationInterval)
    Logger.debug(this.id, 'disableAutomaticRotation', `The automatic rotation has been disabled.`)
  }

  enableAutomaticRotation = (): void => {
    window.clearInterval(this.automaticRotationInterval)
    Logger.debug(this.id, 'enableAutomaticRotation', `The automatic rotation has been disabled.`)

    this.automaticRotationInterval = window.setInterval(this.gotoNextSlide, this.automaticRotationDuration)
    Logger.debug(this.id, 'enableAutomaticRotation', `The automatic rotation has been enabled.`)
  }

  toggleAutomaticRotation = (): void => {
    switch (this.live) {
      case CarouselLive.ASSERTIVE:
      case CarouselLive.POLITE:
        return this.disableAutomaticRotation()
      case CarouselLive.OFF:
        return this.enableAutomaticRotation()
    }
  }

  findSlideElementRefByIndex = (index: number): MutableRefObject<HTMLDivElement> => {
    let ref: MutableRefObject<HTMLDivElement> | undefined

    ref = this.slideElementRefs.get(index)
    if (!ref)
      return rc(() => Logger.error(this.id, 'findSlideElementRefByIndex', `Failed to find the ref of the slide with index ${index}.`), {
        current: document.createElement('div')
      })

    return ref
  }

  isSlideActive = (index: number): boolean => {
    return this.activeSlideIndex === index
  }

  get isLiveOff(): boolean {
    return this.live === CarouselLive.OFF
  }

  get isRotationModeInfinite(): boolean {
    return this.rotationMode === CarouselRotationMode.INFINITE
  }
}

export default CarouselStore
