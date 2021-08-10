import { ObjectUtils, StoreUtils } from '@queelag/core'
import { useForceUpdate, useID, useSafeRef } from '@queelag/react-core'
import React, { FocusEvent, MouseEvent, useEffect, useMemo } from 'react'
import { CarouselLive, ComponentName } from '../definitions/enums'
import {
  CarouselButtonLiveProps,
  CarouselButtonNextProps,
  CarouselButtonPreviousProps,
  CarouselChildrenProps,
  CarouselProps,
  CarouselSlideProps,
  CarouselSlidesProps
} from '../definitions/props'
import CarouselStore from '../stores/carousel.store'

const ROOT_PROPS_KEYS: (keyof CarouselProps)[] = ['activeSlideIndex', 'automaticRotationDuration', 'label', 'live', 'onChangeActiveSlideIndex', 'rotationMode']
const ROOT_CHILDREN_PROPS_KEYS: (keyof CarouselChildrenProps)[] = [
  'activeSlideIndex',
  'deleteSlideElementRef',
  'gotoNextSlide',
  'gotoPreviousSlide',
  'isSlideActive',
  'live',
  'liveTemporary',
  'setLive',
  'setSlideElementRef',
  'slides',
  'slidesID'
]

/**
 * A carousel presents a set of items, referred to as slides, by sequentially displaying a subset of one or more slides. Typically, one slide is displayed at a time, and users can activate a next or previous slide control that hides the current slide and "rotates" the next or previous slide into view. In some implementations, rotation automatically starts when the page loads, and it may also automatically stop once all the slides have been displayed. While a slide may contain any type of content, image carousels where each slide contains nothing more than a single image are common.
 */
export function Root(props: CarouselProps) {
  const update = useForceUpdate()
  const store = useMemo(() => new CarouselStore({ ...props, update }), [])
  const slidesID = useID(ComponentName.CAROUSEL_SLIDES)

  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    store.handleBlurEvent()
    props.onBlur && props.onBlur(event)
  }

  const onFocus = (event: FocusEvent<HTMLDivElement>) => {
    store.handleFocusEvent()
    props.onFocus && props.onFocus(event)
  }

  const onMouseEnter = (event: MouseEvent<HTMLDivElement>) => {
    store.handleFocusEvent()
    props.onMouseEnter && props.onMouseEnter(event)
  }

  const onMouseLeave = (event: MouseEvent<HTMLDivElement>) => {
    store.handleBlurEvent()
    props.onMouseLeave && props.onMouseLeave(event)
  }

  useEffect(() => {
    StoreUtils.shouldUpdateKey(store, 'live', props.live) && store.setLive(props.live)
    StoreUtils.updateKeys(store, props, ['activeSlideIndex', 'automaticRotationDuration', 'onChangeActiveSlideIndex', 'rotationMode'], update)
  }, [props.activeSlideIndex, props.automaticRotationDuration, props.live, props.onChangeActiveSlideIndex, props.rotationMode])

  useEffect(() => store.disableAutomaticRotation, [])

  return (
    <section
      {...ObjectUtils.omit(props, ROOT_PROPS_KEYS)}
      aria-label={props.label}
      aria-roledescription='carousel'
      id={store.id}
      onBlur={onBlur}
      onFocus={onFocus}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {props.children({
        activeSlideIndex: store.activeSlideIndex,
        deleteSlideElementRef: store.deleteSlideElementRef,
        gotoNextSlide: store.gotoNextSlide,
        gotoPreviousSlide: store.gotoPreviousSlide,
        isSlideActive: store.isSlideActive,
        live: store.live,
        liveTemporary: store.liveTemporary,
        setLive: store.setLive,
        setSlideElementRef: store.setSlideElementRef,
        slides: store.slideElementRefs.size,
        slidesID
      })}
    </section>
  )
}

export function Slides(props: CarouselSlidesProps) {
  return <div {...ObjectUtils.omit(props, ROOT_CHILDREN_PROPS_KEYS)} aria-live={props.liveTemporary || props.live} id={props.slidesID} />
}

export function Slide(props: CarouselSlideProps) {
  const id = useID(ComponentName.CAROUSEL_SLIDE, props.id)
  const ref = useSafeRef('div')

  useEffect(() => {
    props.setSlideElementRef(props.index, ref)
    return () => props.deleteSlideElementRef(props.index)
  }, [])

  return (
    <div
      {...ObjectUtils.omit(props, ROOT_CHILDREN_PROPS_KEYS)}
      aria-label={`${props.index + 1} of ${props.slides}`}
      aria-roledescription='slide'
      id={id}
      ref={ref}
      role='group'
    />
  )
}

export function ButtonLive(props: CarouselButtonLiveProps) {
  const id = useID(ComponentName.CAROUSEL_BUTTON_LIVE, props.id)

  const findLabelByLive = () => {
    switch (props.live) {
      case CarouselLive.ASSERTIVE:
      case CarouselLive.POLITE:
        return 'Start automatic slide show'
      case CarouselLive.OFF:
        return 'Stop automatic slide show'
    }
  }

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    switch (props.live) {
      case CarouselLive.ASSERTIVE:
      case CarouselLive.POLITE:
        props.setLive(CarouselLive.OFF)
        break
      case CarouselLive.OFF:
        props.setLive(CarouselLive.POLITE)
        break
    }
    props.onClick && props.onClick(event)
  }

  return <button {...ObjectUtils.omit(props, ROOT_CHILDREN_PROPS_KEYS)} aria-label={findLabelByLive()} id={id} onClick={onClick} type='button' />
}

export function ButtonPreviousSlide(props: CarouselButtonPreviousProps) {
  const id = useID(ComponentName.CAROUSEL_BUTTON_PREVIOUS_SLIDE, props.id)

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    props.gotoPreviousSlide()
    props.onClick && props.onClick(event)
  }

  return (
    <button
      {...ObjectUtils.omit(props, ROOT_CHILDREN_PROPS_KEYS)}
      aria-controls={props.slidesID}
      aria-label='Previous Slide'
      id={id}
      onClick={onClick}
      type='button'
    />
  )
}

export function ButtonNextSlide(props: CarouselButtonNextProps) {
  const id = useID(ComponentName.CAROUSEL_BUTTON_NEXT_SLIDE, props.id)

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    props.gotoNextSlide()
    props.onClick && props.onClick(event)
  }

  return (
    <button
      {...ObjectUtils.omit(props, ROOT_CHILDREN_PROPS_KEYS)}
      aria-controls={props.slidesID}
      aria-label='Next Slide'
      id={id}
      onClick={onClick}
      type='button'
    />
  )
}

export const AriaCarousel = {
  Root,
  Slides,
  Slide,
  ButtonLive,
  ButtonPreviousSlide,
  ButtonNextSlide
}
