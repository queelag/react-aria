import { ObjectUtils } from '@queelag/core'
import { forwardRef, useID } from '@queelag/react-core'
import React, { ForwardedRef } from 'react'
import { ComponentName } from '../definitions/enums'
import { ToggleButtonProps } from '../definitions/props'

const ROOT_PROPS_KEYS: (keyof ToggleButtonProps)[] = ['toggled']

/**
 * A two-state button that can be either off (not pressed) or on (pressed).
 */
export const Root = forwardRef((props: ToggleButtonProps, ref: ForwardedRef<HTMLButtonElement>) => {
  const id = useID(ComponentName.TOGGLE_BUTTON, props.id)
  return <button {...ObjectUtils.omit(props, ROOT_PROPS_KEYS)} aria-pressed={props.toggled} id={id} ref={ref} type='button' />
})

export const AriaToggleButton = {
  Root
}
