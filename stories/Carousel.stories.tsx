import { ChevronLeftRounded, ChevronRightRounded, PauseRounded, PlayArrowRounded } from '@material-ui/icons'
import { Meta, Story } from '@storybook/react'
import { Chance } from 'chance'
import { motion } from 'framer-motion'
import { omit } from 'lodash'
import React, { Fragment } from 'react'
import { CarouselLive, CarouselRotationMode } from '../src'
import { Carousel } from '../src/components/Carousel'
import { CarouselChildrenProps, CarouselProps } from '../src/definitions/props'
import ArrayUtils from '../src/utils/array.utils'

const RawTemplate: Story<CarouselProps & { slides: any[] }> = (args) => (
  <Carousel.Root {...omit(args, 'slides')}>
    {(props: CarouselChildrenProps) => (
      <Fragment>
        <Carousel.Slides {...props} className='relative w-64 h-64'>
          {args.slides.map((v, k) => (
            <Carousel.Slide {...props} className={ArrayUtils.joinStrings('absolute inset-0', !props.isSlideActive(k) && 'opacity-0')} index={k} key={k}>
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

export const Raw = RawTemplate.bind({})
Raw.args = {
  activeSlideIndex: 0,
  automaticRotationDuration: 2000,
  label: 'Pictures of cats',
  live: CarouselLive.OFF,
  rotationMode: CarouselRotationMode.INFINITE,
  slides: new Array(5).fill(0).map((v, k: number) => ({ alt: Chance().first(), id: Chance().guid(), src: require(`../assets/cats/${k}.jpg`) }))
}

const StyledTemplate: Story<CarouselProps & { slides: any[] }> = (args) => (
  <Carousel.Root {...omit(args, 'slides')} className='relative w-64 h-64'>
    {(props: CarouselChildrenProps) => (
      <Fragment>
        <Carousel.Slides {...props} className='relative inset-0 min-h-full overflow-hidden rounded-md'>
          <motion.div animate={{ translateX: props.activeSlideIndex * -100 + '%' }} className='relative inset-0 min-h-full'>
            {args.slides.map((v, k) => (
              <motion.div
                animate={{ opacity: props.isSlideActive(k) ? 1 : 0 }}
                className='absolute inset-0 w-full min-h-full'
                key={k}
                style={{ left: k * 100 + '%' }}
              >
                <Carousel.Slide {...props} index={k}>
                  <img alt={v.alt} src={v.src} />
                </Carousel.Slide>
              </motion.div>
            ))}
          </motion.div>
        </Carousel.Slides>
        <Carousel.ButtonLive
          {...props}
          className={ArrayUtils.joinStrings(
            'absolute top-2 left-2 w-5 h-5 flex justify-center items-center bg-black rounded-full transition-all duration-200',
            'ring-white focus:ring-2',
            'hover:bg-gray-800 active:bg-gray-700'
          )}
        >
          {props.live === CarouselLive.OFF ? (
            <PauseRounded className='text-white' style={{ fontSize: 10 }} />
          ) : (
            <PlayArrowRounded className='text-white' style={{ fontSize: 15 }} />
          )}
        </Carousel.ButtonLive>
        <Carousel.ButtonPreviousSlide
          {...props}
          className={ArrayUtils.joinStrings(
            'absolute bottom-2 left-2 w-5 h-5 flex justify-center items-center bg-black rounded-full transition-all duration-200',
            'ring-white focus:ring-2',
            'hover:bg-gray-800 active:bg-gray-700'
          )}
        >
          <ChevronLeftRounded className='text-white' style={{ fontSize: 15 }} />
        </Carousel.ButtonPreviousSlide>
        <Carousel.ButtonNextSlide
          {...props}
          className={ArrayUtils.joinStrings(
            'absolute bottom-2 right-2 w-5 h-5 flex justify-center items-center bg-black rounded-full transition-all duration-200',
            'ring-white focus:ring-2',
            'hover:bg-gray-800 active:bg-gray-700'
          )}
        >
          <ChevronRightRounded className='text-white' style={{ fontSize: 15 }} />
        </Carousel.ButtonNextSlide>
      </Fragment>
    )}
  </Carousel.Root>
)

export const Styled = StyledTemplate.bind({})
Styled.args = {
  activeSlideIndex: 0,
  automaticRotationDuration: 2000,
  label: 'Pictures of cats',
  live: CarouselLive.OFF,
  rotationMode: CarouselRotationMode.INFINITE,
  slides: new Array(5).fill(0).map((v, k: number) => ({ alt: Chance().first(), id: Chance().guid(), src: require(`../assets/cats/${k}.jpg`) }))
}

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
