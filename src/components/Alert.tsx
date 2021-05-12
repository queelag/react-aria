import React from 'react'
import { ComponentName } from '../definitions/enums'
import { AlertProps } from '../definitions/props'
import useID from '../hooks/use.id'

/**
 * An alert is an element that displays a brief, important message in a way that attracts the user's attention without interrupting the user's task.
 */
function Alert(props: AlertProps) {
  const id = useID(ComponentName.ALERT)

  return <div {...props} id={id} role='alert' />
}

export { Alert }
