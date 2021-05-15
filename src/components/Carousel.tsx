import { omit } from 'lodash'
import React, { useEffect, useMemo, useRef } from 'react'
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
import useForceUpdate from '../hooks/use.force.update'
import useID from '../hooks/use.id'
import CarouselStore from '../stores/carousel.store'
import StoreUtils from '../utils/store.utils'

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
function Root(props: CarouselProps) {
  const update = useForceUpdate()
  const ref = useRef(document.createElement('section'))
  const store = useMemo(() => new CarouselStore(ref, update, props.id, props.activeSlideIndex, props.automaticRotationDuration, props.live), [])
  const slidesID = useID(ComponentName.CAROUSEL_SLIDES)

  useEffect(() => {
    StoreUtils.updateFromProps(store, props, update, 'activeSlideIndex')
  }, [props.activeSlideIndex])

  useEffect(() => {
    StoreUtils.shouldUpdateKey(store, 'live', props.live) && store.setLive(props.live)
    StoreUtils.shouldUpdateKey(store, 'rotationMode', props.rotationMode) && (store.rotationMode = props.rotationMode)
  }, [props.live, props.rotationMode])

  useEffect(() => store.disableAutomaticRotation, [])

  return (
    <section
      {...omit(props, 'activeSlideIndex', 'automaticRotationDuration', 'label', 'live')}
      aria-label={props.label}
      aria-roledescription='carousel'
      id={store.id}
      onBlur={store.onBlurOrMouseLeave}
      onFocus={store.onFocusOrMouseEnter}
      onMouseEnter={store.onFocusOrMouseEnter}
      onMouseLeave={store.onBlurOrMouseLeave}
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

function Slides(props: CarouselSlidesProps) {
  return <div {...omit(props, ROOT_CHILDREN_PROPS_KEYS)} aria-live={props.liveTemporary || props.live} id={props.slidesID} />
}

function Slide(props: CarouselSlideProps) {
  const id = useID(ComponentName.CAROUSEL_SLIDE, props.id)
  const ref = useRef(document.createElement('div'))

  useEffect(() => {
    props.setSlideElementRef(props.index, ref)
    return () => props.deleteSlideElementRef(props.index)
  }, [])

  return (
    <div
      {...omit(props, ROOT_CHILDREN_PROPS_KEYS)}
      aria-label={`${props.index + 1} of ${props.slides}`}
      aria-roledescription='slide'
      id={id}
      ref={ref}
      role='group'
    />
  )
}

function ButtonLive(props: CarouselButtonLiveProps) {
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

  const onClick = () => {
    switch (props.live) {
      case CarouselLive.ASSERTIVE:
      case CarouselLive.POLITE:
        return props.setLive(CarouselLive.OFF)
      case CarouselLive.OFF:
        return props.setLive(CarouselLive.POLITE)
    }
  }

  return <button {...omit(props, ROOT_CHILDREN_PROPS_KEYS)} aria-label={findLabelByLive()} id={id} onClick={onClick} type='button' />
}

function ButtonPreviousSlide(props: CarouselButtonPreviousProps) {
  const id = useID(ComponentName.CAROUSEL_BUTTON_PREVIOUS_SLIDE, props.id)

  return (
    <button
      {...omit(props, ROOT_CHILDREN_PROPS_KEYS)}
      aria-controls={props.slidesID}
      aria-label='Previous Slide'
      id={id}
      onClick={props.gotoPreviousSlide}
      type='button'
    />
  )
}

function ButtonNextSlide(props: CarouselButtonNextProps) {
  const id = useID(ComponentName.CAROUSEL_BUTTON_NEXT_SLIDE, props.id)

  return (
    <button
      {...omit(props, ROOT_CHILDREN_PROPS_KEYS)}
      aria-controls={props.slidesID}
      aria-label='Next Slide'
      id={id}
      onClick={props.gotoNextSlide}
      type='button'
    />
  )
}

export { Root, Slides, Slide, ButtonLive, ButtonPreviousSlide, ButtonNextSlide }
