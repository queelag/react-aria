import { Meta } from '@storybook/react'
import { Chance } from 'chance'
import React, { Fragment } from 'react'
import { CarouselLive } from '../src'
import * as Carousel from '../src/components/Carousel'
import { CarouselChildrenProps } from '../src/definitions/props'
import ArrayUtils from '../src/utils/array.utils'

const slides: { alt: string; id: string; src: string }[] = new Array(5)
  .fill(0)
  .map((v, k: number) => ({ alt: Chance().first(), id: Chance().guid(), src: require(`../assets/cats/${k}.jpg`) }))

export const Raw = () => (
  <Carousel.Root label='Pictures of cats'>
    {(props: CarouselChildrenProps) => (
      <Fragment>
        <Carousel.Slides {...props} className='relative w-64 h-64'>
          {slides.map((v, k) => (
            <Carousel.Slide {...props} className={ArrayUtils.joinStrings('absolute inset-0', !props.isSlideActive(v.id) && 'opacity-0')} id={v.id} key={k}>
              <img alt={v.alt} src={v.src} />
            </Carousel.Slide>
          ))}
        </Carousel.Slides>
        <div>
          <Carousel.ButtonLive {...props}>{props.live === CarouselLive.OFF ? 'Pause' : 'Play'}</Carousel.ButtonLive>
          <Carousel.ButtonPreviousSlide {...props}>Previous Slide</Carousel.ButtonPreviousSlide>
          <Carousel.ButtonNextSlide {...props}>Next Slide</Carousel.ButtonNextSlide>
        </div>
      </Fragment>
    )}
  </Carousel.Root>
)

export default {
  component: Carousel.Root,
  subcomponents: {
    Slides: Carousel.Slides,
    Slide: Carousel.Slide,
    ButtonLive: Carousel.ButtonLive,
    ButtonPreviousSlide: Carousel.ButtonPreviousSlide,
    ButtonNextSlide: Carousel.ButtonNextSlide
  },
  title: 'Components/Carousel'
} as Meta
