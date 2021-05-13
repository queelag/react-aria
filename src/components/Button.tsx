import { omit } from 'lodash'
import React from 'react'
import { ComponentName } from '../definitions/enums'
import { ButtonProps } from '../definitions/props'
import useID from '../hooks/use.id'

function Root(props: ButtonProps) {
  const id = useID(ComponentName.BUTTON, props.id)
  return <button {...omit(props, 'label')} id={id} type='button' />
}

export { Root }
