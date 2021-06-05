import { omit } from 'lodash'
import React, { KeyboardEvent, MouseEvent, useEffect, useMemo, useRef } from 'react'
import { ComponentName, SliderMode } from '../definitions/enums'
import { SliderChildrenProps, SliderProps, SliderThumbProps } from '../definitions/props'
import useForceUpdate from '../hooks/use.force.update'
import useID from '../hooks/use.id'
import SliderStore from '../stores/slider.store'
import StoreUtils from '../utils/store.utils'

const SLIDER_CHILDREN_PROPS_KEYS: (keyof SliderChildrenProps)[] = [
  'handleKeyboardInteractions',
  'handleMouseInteractions',
  'maximum',
  'minimum',
  'orientation',
  'percentual',
  'value'
]

/**
 * A slider is an input where the user selects a value from within a given range. Sliders typically have a slider thumb that can be moved along a bar or track to change the value of the slider.
 */
function Root(props: SliderProps) {
  const update = useForceUpdate()
  const ref = useRef(document.createElement('div'))
  const store = useMemo(
    () => new SliderStore(ref, update, props.id, props.maximum, props.minimum, props.mode, props.onChangeValue, props.orientation, props.step, props.value),
    []
  )

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    if (store.isModeSingleThumb) {
      store.setPercentualByCoordinates(event.clientX, event.clientY, 0, true)
      store.updateValueByPercentual(store.percentual[0], 0)
    }
  }

  useEffect(() => {
    StoreUtils.shouldUpdateKey(store, 'step', props.step) && store.setStepSize(props.step)
    StoreUtils.updateFromProps(store, props, update, 'maximum', 'minimum', 'mode', 'onChangeValue', 'orientation', 'step')
  }, [props.maximum, props.minimum, props.mode, props.onChangeValue, props.orientation, props.step])

  useEffect(() => {
    switch (store.mode) {
      case SliderMode.DUAL_THUMB:
        store.value[0] = props.value[0]
        store.setPercentualByValue(store.value[0], 0)

        store.value[1] = props.value[1]
        store.setPercentualByValue(store.value[1], 1)

        break
      case SliderMode.SINGLE_THUMB:
        store.value[0] = props.value[0]
        store.setPercentualByValue(store.value[0], 0)

        break
    }
  }, [props.value])

  return (
    <div {...omit(props, 'maximum', 'minimum', 'onChangeValue', 'step', 'value')} id={store.id} onClick={onClick} ref={ref}>
      {props.children({
        handleKeyboardInteractions: store.handleKeyboardInteractions,
        handleMouseInteractions: store.onMouseDown,
        maximum: store.maximum,
        minimum: store.minimum,
        orientation: store.orientation,
        percentual: store.percentual,
        value: store.value
      })}
    </div>
  )
}

const Thumb = (index: 0 | 1) => (props: SliderThumbProps) => {
  const id = useID(ComponentName.SLIDER_THUMB, props.id)

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    props.handleKeyboardInteractions(event, index)
    props.onKeyDown && props.onKeyDown(event)
  }

  const onMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    props.handleMouseInteractions(index)
    props.onMouseDown && props.onMouseDown(event)
  }

  return (
    <div
      {...omit(props, SLIDER_CHILDREN_PROPS_KEYS)}
      aria-orientation={props.orientation}
      aria-valuemax={props.maximum}
      aria-valuemin={props.minimum}
      aria-valuenow={props.value[index]}
      id={id}
      onKeyDown={onKeyDown}
      onMouseDown={onMouseDown}
      role='slider'
      style={{ ...props.style, userSelect: 'none' }}
      tabIndex={typeof props.focusable === 'boolean' ? (props.focusable ? 0 : -1) : 0}
    />
  )
}

const FirstThumb = Thumb(0)
const SecondThumb = Thumb(1)

export { Root, FirstThumb, SecondThumb }
