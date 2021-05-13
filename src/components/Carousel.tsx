import { omit } from 'lodash'
import React, { useEffect, useMemo, useRef } from 'react'
import { CarouselLive, ComponentName } from '../definitions/enums'
import {
  CarouselButtonLiveProps,
  CarouselButtonNextProps,
  CarouselButtonPreviousProps,
  CarouselProps,
  CarouselSlideProps,
  CarouselSlidesProps
} from '../definitions/props'
import useForceUpdate from '../hooks/use.force.update'
import useID from '../hooks/use.id'
import CarouselStore from '../stores/carousel.store'
import { Root as Button } from './Button'

/**
 * A carousel presents a set of items, referred to as slides, by sequentially displaying a subset of one or more slides. Typically, one slide is displayed at a time, and users can activate a next or previous slide control that hides the current slide and "rotates" the next or previous slide into view. In some implementations, rotation automatically starts when the page loads, and it may also automatically stop once all the slides have been displayed. While a slide may contain any type of content, image carousels where each slide contains nothing more than a single image are common.
 */
function Root(props: CarouselProps) {
  const update = useForceUpdate()
  const ref = useRef(document.createElement('section'))
  const store = useMemo(() => new CarouselStore(ref, update, props.id), [])
  const slidesID = useID(ComponentName.CAROUSEL_SLIDES)

  return (
    <section {...props} aria-label={props.label} aria-roledescription='carousel' id={store.id}>
      {props.children({
        findSlideIndex: store.findSlideIndex,
        gotoNextSlide: store.gotoNextSlide,
        gotoPreviousSlide: store.gotoPreviousSlide,
        isSlideActive: store.isSlideActive,
        live: store.live,
        setLive: store.setLive,
        setSlideElementRef: store.setSlideElementRef,
        setSlidesElementRef: store.setSlidesElementRef,
        slides: store.slideElementRefs.size,
        slidesID
      })}
    </section>
  )
}

function Slides(props: CarouselSlidesProps) {
  const ref = useRef(document.createElement('div'))

  useEffect(() => {
    props.setSlidesElementRef(ref)
  }, [])

  return (
    <div
      {...omit(props, 'findSlideIndex', 'gotoNextSlide', 'gotoPreviousSlide', 'isSlideActive', 'live', 'setLive', 'setSlideElementRef', 'slides', 'slidesID')}
      aria-live={props.live}
      id={props.slidesID}
      ref={ref}
    />
  )
}

function Slide(props: CarouselSlideProps) {
  const ref = useRef(document.createElement('div'))

  useEffect(() => {
    props.setSlideElementRef(props.id, ref)
  }, [])

  return (
    <div
      {...omit(props, 'findSlideIndex', 'gotoNextSlide', 'gotoPreviousSlide', 'isSlideActive', 'live', 'setLive', 'setSlideElementRef', 'slides', 'slidesID')}
      aria-label={`${props.findSlideIndex(props.id) + 1} of ${props.slides}`}
      aria-roledescription='slide'
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

  return (
    <Button
      {...omit(props, 'findSlideIndex', 'gotoNextSlide', 'gotoPreviousSlide', 'isSlideActive', 'live', 'setLive', 'setSlideElementRef', 'slides', 'slidesID')}
      aria-label={findLabelByLive()}
      id={id}
      onClick={onClick}
    />
  )
}

function ButtonPreviousSlide(props: CarouselButtonPreviousProps) {
  const id = useID(ComponentName.CAROUSEL_BUTTON_PREVIOUS_SLIDE, props.id)

  return (
    <Button
      {...omit(props, 'findSlideIndex', 'gotoNextSlide', 'gotoPreviousSlide', 'isSlideActive', 'live', 'setLive', 'setSlideElementRef', 'slides', 'slidesID')}
      aria-controls={props.slidesID}
      aria-label='Previous Slide'
      id={id}
      onClick={props.gotoPreviousSlide}
    />
  )
}

function ButtonNextSlide(props: CarouselButtonNextProps) {
  const id = useID(ComponentName.CAROUSEL_BUTTON_NEXT_SLIDE, props.id)

  return (
    <Button
      {...omit(props, 'findSlideIndex', 'gotoNextSlide', 'gotoPreviousSlide', 'isSlideActive', 'live', 'setLive', 'setSlideElementRef', 'slides', 'slidesID')}
      aria-controls={props.slidesID}
      aria-label='Next Slide'
      id={id}
      onClick={props.gotoNextSlide}
    />
  )
}

export { Root, Slides, Slide, ButtonLive, ButtonPreviousSlide, ButtonNextSlide }
