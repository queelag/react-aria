import React from 'react'
import { MeterProps } from '../definitions/props'
import NumberUtils from '../utils/number.utils'

/**
 * A meter is a graphical display of a numeric value that varies within a defined range. For example, a meter could be used to depict a device's current battery percentage or a car's fuel level.
 */
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

export { Root }
