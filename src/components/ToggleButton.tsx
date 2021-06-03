import { omit } from 'lodash'
import React from 'react'
import { ComponentName } from '../definitions/enums'
import { ToggleButtonProps } from '../definitions/props'
import useID from '../hooks/use.id'

/**
 * A two-state button that can be either off (not pressed) or on (pressed).
 */
function Root(props: ToggleButtonProps) {
  const id = useID(ComponentName.TOGGLE_BUTTON, props.id)
  return <button {...omit(props, 'toggled')} aria-pressed={props.toggled} id={id} type='button' />
}

export { Root }
