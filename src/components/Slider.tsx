import { omit } from 'lodash'
import React, { MouseEvent, useEffect, useMemo, useRef } from 'react'
import { ComponentName } from '../definitions/enums'
import { SliderChildrenProps, SliderProps, SliderThumbProps } from '../definitions/props'
import useForceUpdate from '../hooks/use.force.update'
import useID from '../hooks/use.id'
import Logger from '../modules/logger'
import SliderStore from '../stores/slider.store'
import NumberUtils from '../utils/number.utils'
import StoreUtils from '../utils/store.utils'

const SLIDER_CHILDREN_PROPS_KEYS: (keyof SliderChildrenProps)[] = ['maximum', 'minimum', 'value']

/**
 * A slider is an input where the user selects a value from within a given range. Sliders typically have a slider thumb that can be moved along a bar or track to change the value of the slider.
 */
function Root(props: SliderProps) {
  const update = useForceUpdate()
  const ref = useRef(document.createElement('div'))
  const store = useMemo(() => new SliderStore(ref, update, props.stepSize, props.id), [])

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    store.setPercentual(event.pageX, props.minimum, props.maximum, true)
    store.setValue(props.minimum, props.maximum, props.onChangeValue)
  }

  const onMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    store.onMouseDown(props.minimum, props.maximum, props.onChangeValue)
    props.onClick && props.onClick(event)
  }

  useEffect(() => {
    StoreUtils.shouldUpdateKey(store, 'stepSize', props.stepSize) && (store.stepSize = props.stepSize)
  }, [props.stepSize])

  useEffect(() => {
    store.percentual = (props.value / props.maximum) * 100
    Logger.debug(store.id, 'useEffect', `The percentual has been set to ${store.percentual}.`)

    update()
  }, [])

  return (
    <div {...omit(props, 'maximum', 'minimum', 'onChangeValue', 'stepSize', 'value')} id={store.id} onClick={onClick} onMouseDown={onMouseDown} ref={ref}>
      {props.children({
        maximum: props.maximum,
        minimum: props.minimum,
        percentual: store.percentual,
        value: NumberUtils.limit(props.value, props.minimum, props.maximum)
      })}
    </div>
  )
}

function Thumb(props: SliderThumbProps) {
  const id = useID(ComponentName.SLIDER_THUMB, props.id)

  return (
    <div
      {...omit(props, SLIDER_CHILDREN_PROPS_KEYS)}
      aria-valuemax={props.maximum}
      aria-valuemin={props.minimum}
      aria-valuenow={props.value}
      id={id}
      role='slider'
      style={{ ...props.style, userSelect: 'none' }}
      tabIndex={0}
    />
  )
}

export { Root, Thumb }
