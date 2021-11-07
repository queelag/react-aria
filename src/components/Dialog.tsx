import { ObjectUtils } from '@queelag/core'
import { useID } from '@queelag/react-core'
import React, { ForwardedRef, forwardRef, KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { ComponentName, Key } from '../definitions/enums'
import { DialogChildrenProps, DialogDescriptionProps, DialogProps, DialogTitleProps } from '../definitions/props'
import { ComponentLogger } from '../loggers/component.logger'

const ROOT_PROPS_KEYS: (keyof DialogProps)[] = ['hasDescription', 'hasTitle', 'onClose']
const ROOT_CHILDREN_PROPS_KEYS: (keyof DialogChildrenProps)[] = ['descriptionID', 'titleID']

/**
 * A dialog is a window overlaid on either the primary window or another dialog window. Windows under a modal dialog are inert. That is, users cannot interact with content outside an active dialog window. Inert content outside an active dialog is typically visually obscured or dimmed so it is difficult to discern, and in some implementations, attempts to interact with the inert content cause the dialog to close.
 */
export const Root = forwardRef((props: DialogProps, ref: ForwardedRef<HTMLDivElement>) => {
  const id = useID(ComponentName.DIALOG, props.id)
  const descriptionID = useID(ComponentName.DIALOG_DESCRIPTION)
  const titleID = useID(ComponentName.DIALOG_TITLE)

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
      role='dialog'
      aria-modal
    >
      {props.children({ descriptionID, titleID })}
    </div>,
    document.body
  )
})

export const Title = forwardRef((props: DialogTitleProps, ref: ForwardedRef<HTMLSpanElement>) => {
  return <span {...ObjectUtils.omit(props, ROOT_CHILDREN_PROPS_KEYS)} id={props.titleID} ref={ref} />
})

export const Description = forwardRef((props: DialogDescriptionProps, ref: ForwardedRef<HTMLSpanElement>) => {
  return <span {...ObjectUtils.omit(props, ROOT_CHILDREN_PROPS_KEYS)} id={props.descriptionID} ref={ref} />
})

export const AriaDialog = {
  Root,
  Title,
  Description
}
