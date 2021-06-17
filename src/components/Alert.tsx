import { useID } from '@queelag/react-core'
import React from 'react'
import { ComponentName } from '../definitions/enums'
import { AlertProps } from '../definitions/props'

/**
 * An alert is an element that displays a brief, important message in a way that attracts the user's attention without interrupting the user's task.
 */
export function Root(props: AlertProps) {
  const id = useID(ComponentName.ALERT, props.id)
  return <div {...props} id={id} role='alert' />
}
