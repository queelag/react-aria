import { useID } from '@queelag/react-core'
import React, { ForwardedRef, forwardRef } from 'react'
import { ComponentName } from '../definitions/enums'
import { AlertProps } from '../definitions/props'

/**
 * An alert is an element that displays a brief, important message in a way that attracts the user's attention without interrupting the user's task.
 */
export const Root = forwardRef((props: AlertProps, ref: ForwardedRef<HTMLDivElement>) => {
  const id = useID(ComponentName.ALERT, props.id)
  return <div {...props} id={id} ref={ref} role='alert' />
})

export const AriaAlert = {
  Root
}
