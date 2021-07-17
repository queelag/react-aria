import { ReactUtils } from '@queelag/core'
import { Meta, Story } from '@storybook/react'
import { Chance } from 'chance'
import { motion } from 'framer-motion'
import React, { Fragment } from 'react'
import { IconChevronLeft, IconChevronRight, IconPause, IconPlay } from '../../react-feather-icons/dist'
import { CarouselLive, CarouselRotationMode } from '../src'
import * as Component from '../src/components/Carousel'
import { CarouselChildrenProps, CarouselProps } from '../src/definitions/props'

const StyledTemplate: Story<CarouselProps> = (args: CarouselProps) => {
  const slides = new Array(5).fill(0).map((v, k: number) => ({ alt: Chance().first(), id: Chance().guid(), src: require(`../assets/cats/${k}.jpg`) }))

  return (
    <Component.Root {...args} className='relative w-64 h-64'>
      {(props: CarouselChildrenProps) => (
        <Fragment>
          <Component.Slides {...props} className='relative inset-0 min-h-full overflow-hidden rounded-md'>
            <motion.div animate={{ translateX: props.activeSlideIndex * -100 + '%' }} className='relative inset-0 min-h-full'>
              {slides.map((v, k) => (
                <motion.div
                  animate={{ opacity: props.isSlideActive(k) ? 1 : 0 }}
                  className='absolute inset-0 w-full min-h-full'
                  key={k}
                  style={{ left: k * 100 + '%' }}
                >
                  <Component.Slide {...props} index={k}>
                    <img alt={v.alt} src={v.src} />
                  </Component.Slide>
                </motion.div>
              ))}
            </motion.div>
          </Component.Slides>
          <Component.ButtonLive
            {...props}
            className={ReactUtils.joinClassNames(
              'absolute top-2 left-2 w-5 h-5 flex justify-center items-center bg-black rounded-full transition-all duration-200',
              'ring-white focus:ring-2',
              'hover:bg-gray-800 active:bg-gray-700'
            )}
          >
            {props.live === CarouselLive.OFF ? <IconPause className='text-white' size={10} /> : <IconPlay className='text-white' size={10} />}
          </Component.ButtonLive>
          <Component.ButtonPreviousSlide
            {...props}
            className={ReactUtils.joinClassNames(
              'absolute bottom-2 left-2 w-5 h-5 flex justify-center items-center bg-black rounded-full transition-all duration-200',
              'ring-white focus:ring-2',
              'hover:bg-gray-800 active:bg-gray-700'
            )}
          >
            <IconChevronLeft className='text-white' style={{ fontSize: 15 }} />
          </Component.ButtonPreviousSlide>
          <Component.ButtonNextSlide
            {...props}
            className={ReactUtils.joinClassNames(
              'absolute bottom-2 right-2 w-5 h-5 flex justify-center items-center bg-black rounded-full transition-all duration-200',
              'ring-white focus:ring-2',
              'hover:bg-gray-800 active:bg-gray-700'
            )}
          >
            <IconChevronRight className='text-white' style={{ fontSize: 15 }} />
          </Component.ButtonNextSlide>
        </Fragment>
      )}
    </Component.Root>
  )
}

export const Carousel = StyledTemplate.bind({})
Carousel.args = {
  activeSlideIndex: 0,
  automaticRotationDuration: 2000,
  label: 'Pictures of cats',
  live: CarouselLive.OFF,
  rotationMode: CarouselRotationMode.INFINITE
}

export default {
  component: Component.Root,
  subcomponents: {
    Slides: Component.Slides,
    Slide: Component.Slide,
    ButtonLive: Component.ButtonLive,
    ButtonPreviousSlide: Component.ButtonPreviousSlide,
    ButtonNextSlide: Component.ButtonNextSlide
  },
  title: 'Components/Carousel'
} as Meta
