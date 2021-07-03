import { ID, NumberUtils, ObjectUtils } from '@queelag/core'
import { useID } from '@queelag/react-core'
import React from 'react'
import { ComponentName } from '../definitions/enums'
import { MeterProps } from '../definitions/props'

/**
 * A meter is a graphical display of a numeric value that varies within a defined range. For example, a meter could be used to depict a device's current battery percentage or a car's fuel level.
 */
export function Root(props: MeterProps) {
  const id: ID = useID(ComponentName.METER)
  const value: number = NumberUtils.limit(props.value, props.minimum, props.maximum)

  return (
    <div
      {...ObjectUtils.omit(props, 'maximum', 'minimum', 'value')}
      aria-valuemax={props.maximum}
      aria-valuemin={props.minimum}
      aria-valuenow={value}
      id={id}
      role='meter'
    >
      {props.children({
        percentual: (value / (props.maximum - props.minimum)) * 100,
        value: value
      })}
    </div>
  )
}

export const AriaMeter = {
  Root
}
