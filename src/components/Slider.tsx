import { omit } from 'lodash'
import React, { MouseEvent, useMemo } from 'react'
import { ComponentName } from '../definitions/enums'
import { SliderChildrenProps, SliderProps, SliderThumbProps } from '../definitions/props'
import useForceUpdate from '../hooks/use.force.update'
import useID from '../hooks/use.id'
import Logger from '../modules/logger'
import SliderStore from '../stores/slider.store'
import NumberUtils from '../utils/number.utils'

const SLIDER_CHILDREN_PROPS_KEYS: (keyof SliderChildrenProps)[] = ['handleMouseInteractions', 'maximum', 'minimum', 'onChangeValue', 'value']

/**
 * A slider is an input where the user selects a value from within a given range. Sliders typically have a slider thumb that can be moved along a bar or track to change the value of the slider.
 */
function Root(props: SliderProps) {
  const update = useForceUpdate()
  const store = useMemo(() => new SliderStore(update, props.id), [])

  return (
    <div {...omit(props, 'maximum', 'minimum', 'value')} id={store.id}>
      {props.children({
        handleMouseInteractions: store.handleMouseInteractions,
        maximum: props.maximum,
        minimum: props.minimum,
        onChangeValue: props.onChangeValue,
        value: NumberUtils.limit(props.value, props.minimum, props.maximum)
      })}
    </div>
  )
}

function Thumb(props: SliderThumbProps) {
  const id = useID(ComponentName.SLIDER_THUMB, props.id)

  const onMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    let value: number

    value = props.handleMouseInteractions(event, props.minimum, props.maximum, props.value)

    props.onChangeValue(value)
    Logger.debug(id, 'onMouseDown', `The value has been changed to ${value}.`)
  }

  return (
    <div
      {...omit(props, SLIDER_CHILDREN_PROPS_KEYS)}
      aria-valuemax={props.maximum}
      aria-valuemin={props.minimum}
      aria-valuenow={props.value}
      onMouseMove={onMouseDown}
      role='slider'
      tabIndex={0}
    />
  )
}

export { Root, Thumb }
