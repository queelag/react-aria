import { ObjectUtils } from '@queelag/core'
import { useID } from '@queelag/react-core'
import React from 'react'
import { ComponentName } from '../definitions/enums'
import { ToggleButtonProps } from '../definitions/props'

/**
 * A two-state button that can be either off (not pressed) or on (pressed).
 */
export function Root(props: ToggleButtonProps) {
  const id = useID(ComponentName.TOGGLE_BUTTON, props.id)
  return <button {...ObjectUtils.omit(props, 'toggled')} aria-pressed={props.toggled} id={id} type='button' />
}

export const AriaToggleButton = {
  Root
}
