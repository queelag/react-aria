import { omit } from 'lodash'
import React, { KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { ComponentName, Key } from '../definitions/enums'
import { AlertDialogChildrenProps, AlertDialogDescriptionProps, AlertDialogProps, AlertDialogTitleProps } from '../definitions/props'
import useID from '../hooks/use.id'
import Logger from '../modules/logger'

const ALERT_DIALOG_CHILDREN_PROPS_KEYS: (keyof AlertDialogChildrenProps)[] = ['descriptionID', 'titleID']

/**
 * An alert dialog is a modal dialog that interrupts the user's workflow to communicate an important message and acquire a response.
 */
function Root(props: AlertDialogProps) {
  const id = useID(ComponentName.ALERT_DIALOG, props.id)
  const descriptionID = useID(ComponentName.ALERT_DIALOG_DESCRIPTION)
  const titleID = useID(ComponentName.ALERT_DIALOG_TITLE)

  const handleKeyboardInteractions = (event: KeyboardEvent) => {
    switch (event.key) {
      case Key.ESCAPE:
        props.onClose()
        Logger.debug(id, 'handleKeyboardEvents', event.key, 'The alert dialog has been closed')

        break
    }
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    handleKeyboardInteractions(event)
    props.onKeyDown && props.onKeyDown(event)
  }

  return createPortal(
    <div
      {...omit(props, 'hasDescription', 'hasTitle', 'onClose')}
      aria-describedby={props.hasDescription ? descriptionID : undefined}
      aria-labelledby={props.hasTitle ? titleID : undefined}
      id={id}
      onKeyDown={onKeyDown}
      role='alertdialog'
      style={{ ...props.style, bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 }}
      aria-modal
    >
      {props.children({ descriptionID, titleID })}
    </div>,
    document.body
  )
}

/**
 * The alert dialog title.
 */
function Title(props: AlertDialogTitleProps) {
  return <span {...omit(props, ALERT_DIALOG_CHILDREN_PROPS_KEYS)} id={props.titleID}></span>
}

/**
 * The alert dialog description.
 */
function Description(props: AlertDialogDescriptionProps) {
  return <span {...omit(props, ALERT_DIALOG_CHILDREN_PROPS_KEYS)} id={props.descriptionID}></span>
}

const AlertDialog = { Root, Title, Description }
export { AlertDialog }
