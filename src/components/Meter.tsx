import React from 'react'
import { MeterProps } from '../definitions/props'
import NumberUtils from '../utils/number.utils'

function Root(props: MeterProps) {
  return (
    <div
      aria-valuemax={props.maximum}
      aria-valuemin={props.minimum}
      aria-valuenow={NumberUtils.limit(props.value, props.minimum, props.maximum)}
      role='meter'
    />
  )
}

const Meter = { Root }
export { Meter }
