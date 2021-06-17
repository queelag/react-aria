import { useID } from '@queelag/react-core'
import { omit } from 'lodash'
import React from 'react'
import { ComponentName } from '../definitions/enums'
import { ButtonProps } from '../definitions/props'

/**
 * A button is a widget that enables users to trigger an action or event, such as submitting a form, opening a dialog, canceling an action, or performing a delete operation.
 */
export function Root(props: ButtonProps) {
  const id = useID(ComponentName.BUTTON, props.id)
  return <button {...omit(props, 'innerRef')} id={id} ref={props.innerRef} type='button' />
}
