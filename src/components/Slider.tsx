import { omit } from 'lodash'
import React, { KeyboardEvent, MouseEvent, useEffect, useMemo, useRef } from 'react'
import { ComponentName } from '../definitions/enums'
import { SliderChildrenProps, SliderProps, SliderThumbProps } from '../definitions/props'
import useForceUpdate from '../hooks/use.force.update'
import useID from '../hooks/use.id'
import SliderStore from '../stores/slider.store'
import NumberUtils from '../utils/number.utils'
import StoreUtils from '../utils/store.utils'

const SLIDER_CHILDREN_PROPS_KEYS: (keyof SliderChildrenProps)[] = ['maximum', 'minimum', 'setThumbRef', 'value']

/**
 * A slider is an input where the user selects a value from within a given range. Sliders typically have a slider thumb that can be moved along a bar or track to change the value of the slider.
 */
function Root(props: SliderProps) {
  const update = useForceUpdate()
  const ref = useRef(document.createElement('div'))
  const store = useMemo(() => new SliderStore(ref, update, props.stepSize, props.id), [])

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    store.setPercentualByX(event.clientX, true)
    store.setValue(props.minimum, props.maximum, props.onChangeValue)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    store.handleKeyboardInteractions(event, props.minimum, props.maximum, props.value, props.onChangeValue)
    props.onKeyDown && props.onKeyDown(event)
  }

  const onMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    store.onMouseDown(props.minimum, props.maximum, props.onChangeValue)
    props.onMouseDown && props.onMouseDown(event)
  }

  useEffect(() => {
    StoreUtils.shouldUpdateKey(store, 'stepSize', props.stepSize) && store.setStepSize(props.stepSize)
  }, [props.stepSize])

  useEffect(() => store.setPercentual(props.maximum, props.value), [])

  return (
    <div
      {...omit(props, 'maximum', 'minimum', 'onChangeValue', 'stepSize', 'value')}
      id={store.id}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onMouseDown={onMouseDown}
      ref={ref}
    >
      {props.children({
        maximum: props.maximum,
        minimum: props.minimum,
        percentual: store.percentual,
        setThumbRef: store.setThumbRef,
        value: NumberUtils.limit(props.value, props.minimum, props.maximum)
      })}
    </div>
  )
}

function Thumb(props: SliderThumbProps) {
  const id = useID(ComponentName.SLIDER_THUMB, props.id)
  const ref = useRef(document.createElement('div'))

  useEffect(() => props.setThumbRef(ref), [])

  return (
    <div
      {...omit(props, SLIDER_CHILDREN_PROPS_KEYS)}
      aria-valuemax={props.maximum}
      aria-valuemin={props.minimum}
      aria-valuenow={props.value}
      id={id}
      ref={ref}
      role='slider'
      style={{ ...props.style, userSelect: 'none' }}
      tabIndex={typeof props.focusable === 'boolean' ? (props.focusable ? 0 : -1) : 0}
    />
  )
}

export { Root, Thumb }
