import { act, cleanup, fireEvent, render, RenderResult, screen } from '@testing-library/react'
import { Chance } from 'chance'
import React, { Fragment } from 'react'
import { Carousel } from '../../src/components/Carousel'
import { CarouselLive, CarouselRotationMode, ComponentName, LoggerLevel } from '../../src/definitions/enums'
import { CarouselChildrenProps, CarouselProps } from '../../src/definitions/props'
import Logger from '../../src/modules/logger'

describe('Carousel', () => {
  let data: string[],
    renderComponent: (props?: Partial<CarouselProps>) => RenderResult,
    root: HTMLElement,
    slidesParent: HTMLElement,
    slides: HTMLElement[],
    buttonLive: HTMLElement,
    buttonPreviousSlide: HTMLElement,
    buttonNextSlide: HTMLElement

  beforeAll(() => {
    jest.useFakeTimers()

    Logger.level = LoggerLevel.ERROR
    renderComponent = (props?: Partial<CarouselProps>) =>
      render(
        <Carousel.Root {...props} data-testid={ComponentName.CAROUSEL} label='Pictures of cats'>
          {(props: CarouselChildrenProps) => (
            <Fragment>
              <Carousel.Slides {...props} data-testid={ComponentName.CAROUSEL_SLIDES}>
                {data.map((v, k) => (
                  <Carousel.Slide {...props} data-testid={ComponentName.CAROUSEL_SLIDE} index={k} key={k}>
                    {props.isSlideActive(k) && <img alt={v} src={v} />}
                  </Carousel.Slide>
                ))}
              </Carousel.Slides>
              <Carousel.ButtonLive {...props} data-testid={ComponentName.CAROUSEL_BUTTON_LIVE}>
                {props.live === CarouselLive.OFF ? 'Pause' : 'Play'}
              </Carousel.ButtonLive>
              <Carousel.ButtonPreviousSlide {...props} data-testid={ComponentName.CAROUSEL_BUTTON_PREVIOUS_SLIDE}>
                Previous Slide
              </Carousel.ButtonPreviousSlide>
              <Carousel.ButtonNextSlide {...props} data-testid={ComponentName.CAROUSEL_BUTTON_NEXT_SLIDE}>
                Next Slide
              </Carousel.ButtonNextSlide>
            </Fragment>
          )}
        </Carousel.Root>
      )
  })

  beforeEach(() => {
    data = new Array(5).fill(0).map(() => Chance().first())
    renderComponent()
    root = screen.getByTestId(ComponentName.CAROUSEL)
    slidesParent = screen.getByTestId(ComponentName.CAROUSEL_SLIDES)
    slides = screen.getAllByTestId(ComponentName.CAROUSEL_SLIDE)
    buttonLive = screen.getByTestId(ComponentName.CAROUSEL_BUTTON_LIVE)
    buttonPreviousSlide = screen.getByTestId(ComponentName.CAROUSEL_BUTTON_PREVIOUS_SLIDE)
    buttonNextSlide = screen.getByTestId(ComponentName.CAROUSEL_BUTTON_NEXT_SLIDE)
  })

  it('has correct aria attributes', () => {
    expect(root.getAttribute('aria-label')).toBe('Pictures of cats')
    expect(root.getAttribute('aria-roledescription')).toBe('carousel')
    expect(slidesParent.getAttribute('aria-live')).toBe(CarouselLive.OFF)

    slides.forEach((v: HTMLElement, k: number) => {
      expect(v.getAttribute('aria-label')).toBe(`${k + 1} of ${data.length}`)
      expect(v.getAttribute('aria-roledescription')).toBe('slide')
      expect(v.getAttribute('role')).toBe('group')
    })

    expect(buttonLive.getAttribute('aria-label')).toBe('Stop automatic slide show')
    expect(buttonPreviousSlide.getAttribute('aria-controls')).toBe(slidesParent.id)
    expect(buttonPreviousSlide.getAttribute('aria-label')).toBe('Previous Slide')
    expect(buttonNextSlide.getAttribute('aria-controls')).toBe(slidesParent.id)
    expect(buttonNextSlide.getAttribute('aria-label')).toBe('Next Slide')
  })

  it('auto rotates by default and shows only one slide at a time', () => {
    cleanup()
    renderComponent({ automaticRotationDuration: 1000 })
    slides = screen.getAllByTestId(ComponentName.CAROUSEL_SLIDE)

    expect(slides[0].innerHTML).not.toHaveLength(0)
    slides.slice(1).forEach((v: HTMLElement) => expect(v.innerHTML).toHaveLength(0))

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(slides[0].innerHTML).toHaveLength(0)
    expect(slides[1].innerHTML).not.toHaveLength(0)
    slides.slice(2).forEach((v: HTMLElement) => expect(v.innerHTML).toHaveLength(0))
  })

  it('does not autorotate when live is set to POLITE', () => {
    cleanup()
    renderComponent({ live: CarouselLive.POLITE })
    slides = screen.getAllByTestId(ComponentName.CAROUSEL_SLIDE)

    expect(slides[0].innerHTML).not.toHaveLength(0)
    slides.slice(1).forEach((v: HTMLElement) => expect(v.innerHTML).toHaveLength(0))

    act(() => {
      jest.advanceTimersByTime(2000)
    })

    expect(slides[0].innerHTML).not.toHaveLength(0)
    slides.slice(1).forEach((v: HTMLElement) => expect(v.innerHTML).toHaveLength(0))
  })

  it('sets the active slide index', () => {
    cleanup()
    renderComponent({ activeSlideIndex: 4 })
    slides = screen.getAllByTestId(ComponentName.CAROUSEL_SLIDE)

    expect(slides[4].innerHTML).not.toHaveLength(0)
    slides.slice(0, 3).forEach((v: HTMLElement) => expect(v.innerHTML).toHaveLength(0))
  })

  it('handles the infinite rotation mode', () => {
    for (let i = 0; i < 2; i++) {
      slides.forEach((v: HTMLElement) => {
        slides.forEach((w: HTMLElement) => {
          w === v && expect(w.innerHTML).not.toHaveLength(0)
          w !== v && expect(w.innerHTML).toHaveLength(0)
        })

        act(() => {
          jest.advanceTimersByTime(2000)
        })
      })
    }
  })

  it('handles the finite rotation mode', () => {
    cleanup()
    renderComponent({ rotationMode: CarouselRotationMode.FINITE })
    slides = screen.getAllByTestId(ComponentName.CAROUSEL_SLIDE)

    slides.forEach((v: HTMLElement) => {
      slides.forEach((w: HTMLElement) => {
        w === v && expect(w.innerHTML).not.toHaveLength(0)
        w !== v && expect(w.innerHTML).toHaveLength(0)
      })

      act(() => {
        jest.advanceTimersByTime(2000)
      })
    })

    act(() => {
      jest.advanceTimersByTime(2000)
    })

    expect(slides[4].innerHTML).not.toHaveLength(0)
    slides.slice(0, 3).forEach((v: HTMLElement) => expect(v.innerHTML).toHaveLength(0))
  })

  it('handles blur and focus events', () => {
    buttonLive.focus()
    expect(slidesParent.getAttribute('aria-live')).toBe(CarouselLive.POLITE)

    act(() => {
      jest.advanceTimersByTime(2000)
    })

    expect(slides[0].innerHTML).not.toHaveLength(0)
    slides.slice(1).forEach((v: HTMLElement) => expect(v.innerHTML).toHaveLength(0))

    buttonLive.blur()
    expect(slidesParent.getAttribute('aria-live')).toBe(CarouselLive.OFF)
    fireEvent.mouseEnter(root)
    expect(slidesParent.getAttribute('aria-live')).toBe(CarouselLive.POLITE)

    act(() => {
      jest.advanceTimersByTime(2000)
    })

    expect(slides[0].innerHTML).not.toHaveLength(0)
    slides.slice(1).forEach((v: HTMLElement) => expect(v.innerHTML).toHaveLength(0))

    fireEvent.mouseLeave(root)
    expect(slidesParent.getAttribute('aria-live')).toBe(CarouselLive.OFF)
  })

  it('has working buttons', () => {
    fireEvent.click(buttonLive)
    expect(buttonLive.getAttribute('aria-label')).toBe('Start automatic slide show')
    expect(slidesParent.getAttribute('aria-live')).toBe(CarouselLive.POLITE)
    fireEvent.click(buttonLive)
    expect(buttonLive.getAttribute('aria-label')).toBe('Stop automatic slide show')
    expect(slidesParent.getAttribute('aria-live')).toBe(CarouselLive.OFF)
    fireEvent.click(buttonNextSlide)
    expect(slides[1].innerHTML).not.toHaveLength(0)
    fireEvent.click(buttonPreviousSlide)
    expect(slides[0].innerHTML).not.toHaveLength(0)
  })
})
