import { ObjectUtils } from '@queelag/core'
import { useComponentStore, useID } from '@queelag/react-core'
import React, { ForwardedRef, forwardRef, KeyboardEvent, MouseEvent, TouchEvent, useEffect } from 'react'
import { ComponentName, SliderMode } from '../definitions/enums'
import { SliderChildrenProps, SliderProps, SliderThumbProps } from '../definitions/props'
import { SliderThumbIndex } from '../definitions/types'
import { SliderStore } from '../stores/slider.store'

const ROOT_PROPS_KEYS: (keyof SliderProps)[] = ['getStore', 'label', 'maximum', 'minimum', 'mode', 'onChangeValue', 'orientation', 'step', 'value']
const ROOT_CHILDREN_PROPS_KEYS: (keyof SliderChildrenProps)[] = [
  'handleKeyboardInteractions',
  'maximum',
  'minimum',
  'onThumbMouseDown',
  'onThumbTouchEnd',
  'onThumbTouchMove',
  'onThumbTouchStart',
  'orientation',
  'percentual',
  'value'
]
const STORE_KEYS: (keyof SliderProps & keyof SliderStore)[] = ['maximum', 'minimum', 'mode', 'onChangeValue', 'orientation', 'step']

/**
 * A slider is an input where the user selects a value from within a given range. Sliders typically have a slider thumb that can be moved along a bar or track to change the value of the slider.
 */
export function Root(props: SliderProps) {
  const store = useComponentStore(SliderStore, props, STORE_KEYS)

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    switch (store.mode) {
      case SliderMode.DUAL_THUMB:
        break
      case SliderMode.SINGLE_THUMB:
        store.setValueByCoordinates(0, event.clientX, event.clientY, true)
        break
    }
    props.onClick && props.onClick(event)
  }

  useEffect(() => {
    if (props.value) {
      switch (store.mode) {
        case SliderMode.DUAL_THUMB:
          if (props.value[0] < props.value[1] && store.value[0] > store.value[1]) {
            store.value[0] = props.value[1]
            store.value[1] = props.value[0]
          } else if (props.value[0] > props.value[1] && store.value[0] < store.value[1]) {
            store.value[0] = props.value[0]
            store.value[1] = props.value[1]
          }

          store.setPercentualByValue(0, store.value[0])
          store.setPercentualByValue(1, store.value[1])

          break
        case SliderMode.SINGLE_THUMB:
          store.value[0] = props.value[0]
          store.setPercentualByValue(0, store.value[0])

          break
      }
    }
  }, [props.value])

  return (
    <div {...ObjectUtils.omit(props, ROOT_PROPS_KEYS)} id={store.id} onClick={onClick} ref={store.ref}>
      {props.children({
        handleKeyboardInteractions: store.handleKeyboardInteractions,
        maximum: store.maximum,
        minimum: store.minimum,
        onThumbMouseDown: store.onThumbMouseDown,
        onThumbTouchEnd: store.onThumbTouchEnd,
        onThumbTouchMove: store.onThumbTouchMove,
        onThumbTouchStart: store.onThumbTouchStart,
        orientation: store.orientation,
        percentual: store.percentual,
        value: store.value
      })}
    </div>
  )
}

const Thumb = (index: SliderThumbIndex) =>
  forwardRef((props: SliderThumbProps, ref: ForwardedRef<HTMLDivElement>) => {
    const id = useID(ComponentName.SLIDER_THUMB, props.id)

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      props.handleKeyboardInteractions(index, event)
      props.onKeyDown && props.onKeyDown(event)
    }

    const onMouseDown = (event: MouseEvent<HTMLDivElement>) => {
      props.onThumbMouseDown(index)
      props.onMouseDown && props.onMouseDown(event)
    }

    const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
      props.onThumbTouchStart()
      props.onTouchStart && props.onTouchStart(event)
    }

    const onTouchMove = (event: TouchEvent<HTMLDivElement>) => {
      props.onThumbTouchMove(index, event)
      props.onTouchMove && props.onTouchMove(event)
    }

    const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
      props.onThumbTouchEnd(index)
      props.onTouchEnd && props.onTouchEnd(event)
    }

    return (
      <div
        {...ObjectUtils.omit(props, ROOT_CHILDREN_PROPS_KEYS)}
        aria-orientation={props.orientation?.toLowerCase() as any}
        aria-valuemax={props.maximum}
        aria-valuemin={props.minimum}
        aria-valuenow={props.value[index]}
        id={id}
        onKeyDown={onKeyDown}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        ref={ref}
        role='slider'
        style={{ touchAction: 'none', userSelect: 'none', ...props.style }}
        tabIndex={typeof props.focusable === 'boolean' ? (props.focusable ? 0 : -1) : 0}
      />
    )
  })

export const FirstThumb = Thumb(0)
export const SecondThumb = Thumb(1)

export const AriaSlider = {
  Root,
  FirstThumb,
  SecondThumb
}
