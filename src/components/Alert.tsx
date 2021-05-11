import React from 'react'
import { HTMLDivProps } from '../definitions/props'

/**
 * An alert is an element that displays a brief, important message in a way that attracts the user's attention without interrupting the user's task.
 */
function Alert(props: HTMLDivProps) {
  return <div {...props} role='alert' />
}

export { Alert }
