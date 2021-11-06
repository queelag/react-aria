import { Logger, noop, rc } from '@queelag/core'
import { ComponentStore, ComponentStoreProps, ReactUtils } from '@queelag/react-core'
import { MutableRefObject } from 'react'
import { CarouselLive, CarouselRotationMode, ComponentName } from '../definitions/enums'
import { CarouselProps } from '../definitions/props'

export class CarouselStore extends ComponentStore<HTMLElement> {
  _live: CarouselLive = CarouselLive.OFF

  activeSlideIndex: number
  automaticRotationDuration: number
  automaticRotationInterval: NodeJS.Timer | number
  liveTemporary?: CarouselLive
  mouseEntered: boolean
  rotationMode: CarouselRotationMode
  slideElementRefs: Map<number, MutableRefObject<HTMLDivElement>>

  constructor(props: CarouselProps & ComponentStoreProps<HTMLElement>) {
    super(ComponentName.CAROUSEL, props)

    this.activeSlideIndex = props.activeSlideIndex || 0
    this.automaticRotationDuration = props.automaticRotationDuration || 2500
    this.automaticRotationInterval = 0
    this.rotationMode = props.rotationMode || CarouselRotationMode.INFINITE
    this.live = props.live || CarouselLive.OFF
    this.mouseEntered = false
    this.onChangeActiveSlideIndex = props.onChangeActiveSlideIndex || noop
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

  onChangeActiveSlideIndex(index: number): void {}

  setActiveSlideIndex = (index: number): void => {
    this.activeSlideIndex = index
    Logger.debug(this.id, 'setActiveSlideIndex', `The slide with index ${index} has been set as the active slide.`)

    this.onChangeActiveSlideIndex === noop ? this.update() : this.onChangeActiveSlideIndex(index)
  }

  setLive = (live: CarouselLive): void => {
    this.live = live
  }

  setSlideElementRef = (index: number, ref: MutableRefObject<HTMLDivElement>): void => {
    this.slideElementRefs.set(index, ref)
    Logger.debug(this.id, 'setSlideElementRef', `The slide with index ${index} has been set to the slide element refs.`)
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

        return this.setActiveSlideIndex(this.activeSlideIndex - 1)
      case CarouselRotationMode.INFINITE:
        return this.setActiveSlideIndex(this.activeSlideIndex > 0 ? this.activeSlideIndex - 1 : this.slideElementRefs.size - 1)
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

        return this.setActiveSlideIndex(this.activeSlideIndex + 1)
      case CarouselRotationMode.INFINITE:
        return this.setActiveSlideIndex(this.activeSlideIndex < this.slideElementRefs.size - 1 ? this.activeSlideIndex + 1 : 0)
    }
  }

  disableAutomaticRotation = (): void => {
    clearInterval(this.automaticRotationInterval as any)
    Logger.debug(this.id, 'disableAutomaticRotation', `The automatic rotation has been disabled.`)
  }

  enableAutomaticRotation = (): void => {
    clearInterval(this.automaticRotationInterval as any)
    Logger.debug(this.id, 'enableAutomaticRotation', `The automatic rotation has been disabled.`)

    this.automaticRotationInterval = setInterval(this.gotoNextSlide, this.automaticRotationDuration)
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
      return rc(
        () => Logger.error(this.id, 'findSlideElementRefByIndex', `Failed to find the ref of the slide with index ${index}.`),
        ReactUtils.createDummyRef('div')
      )

    return ref
  }

  isSlideActive = (index: number): boolean => {
    return this.activeSlideIndex === index
  }

  get live(): CarouselLive {
    return this._live
  }

  get isLiveOff(): boolean {
    return this.live === CarouselLive.OFF
  }

  get isRotationModeInfinite(): boolean {
    return this.rotationMode === CarouselRotationMode.INFINITE
  }

  set live(live: CarouselLive) {
    this._live = live
    Logger.debug(this.id, 'setLive', `The live has been set to ${live}.`)

    this.toggleAutomaticRotation()
    this.update()
  }
}
