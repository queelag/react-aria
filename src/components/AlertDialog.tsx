import { ObjectUtils } from '@queelag/core'
import { useID } from '@queelag/react-core'
import React, { ForwardedRef, forwardRef, KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { ComponentName, Key } from '../definitions/enums'
import { AlertDialogChildrenProps, AlertDialogDescriptionProps, AlertDialogProps, AlertDialogTitleProps } from '../definitions/props'
import { ComponentLogger } from '../loggers/component.logger'

const ROOT_PROPS_KEYS: (keyof AlertDialogProps)[] = ['hasDescription', 'hasTitle', 'onClose']
const ROOT_CHILDREN_PROPS_KEYS: (keyof AlertDialogChildrenProps)[] = ['descriptionID', 'titleID']

/**
 * An alert dialog is a modal dialog that interrupts the user's workflow to communicate an important message and acquire a response.
 */
export const Root = forwardRef((props: AlertDialogProps, ref: ForwardedRef<HTMLDivElement>) => {
  const id = useID(ComponentName.ALERT_DIALOG, props.id)
  const descriptionID = useID(ComponentName.ALERT_DIALOG_DESCRIPTION)
  const titleID = useID(ComponentName.ALERT_DIALOG_TITLE)

  const handleKeyboardInteractions = (event: KeyboardEvent) => {
    switch (event.key) {
      case Key.ESCAPE:
        event.preventDefault()
        event.stopPropagation()
        ComponentLogger.verbose(id, 'handleKeyboardInteractions', `The default event has been prevented and the propagation has been stopped.`)

        props.onClose()
        ComponentLogger.debug(id, 'handleKeyboardEvents', event.key, 'The onClose function has been called.')

        break
    }
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    handleKeyboardInteractions(event)
    props.onKeyDown && props.onKeyDown(event)
  }

  return createPortal(
    <div
      {...ObjectUtils.omit(props, ROOT_PROPS_KEYS)}
      aria-describedby={props.hasDescription ? descriptionID : undefined}
      aria-labelledby={props.hasTitle ? titleID : undefined}
      id={id}
      onKeyDown={onKeyDown}
      ref={ref}
      role='alertdialog'
      style={{ bottom: 0, left: 0, position: 'absolute', right: 0, top: 0, ...props.style }}
      aria-modal
    >
      {props.children({ descriptionID, titleID })}
    </div>,
    document.body
  )
})

export const Title = forwardRef((props: AlertDialogTitleProps, ref: ForwardedRef<HTMLSpanElement>) => {
  return <span {...ObjectUtils.omit(props, ROOT_CHILDREN_PROPS_KEYS)} id={props.titleID} ref={ref}></span>
})

export const Description = forwardRef((props: AlertDialogDescriptionProps, ref: ForwardedRef<HTMLSpanElement>) => {
  return <span {...ObjectUtils.omit(props, ROOT_CHILDREN_PROPS_KEYS)} id={props.descriptionID} ref={ref}></span>
})

export const AriaAlertDialog = {
  Root,
  Title,
  Description
}
