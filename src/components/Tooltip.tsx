import { Debounce, noop, ObjectUtils } from '@queelag/core'
import { forwardRef, useComponentStore, useID, useSafeRef } from '@queelag/react-core'
import React, { FocusEvent, ForwardedRef, KeyboardEvent, MouseEvent, useEffect } from 'react'
import { usePopper } from 'react-popper'
import { ComponentName } from '../definitions/enums'
import { TooltipChildrenProps, TooltipElementProps, TooltipProps, TooltipTriggerProps } from '../definitions/props'
import { TooltipStore } from '../stores/tooltip.store'

const TOOLTIP_PROPS_KEYS: (keyof TooltipProps)[] = ['getStore', 'hideDelay', 'popperOptions', 'showDelay']
const TOOLTIP_CHILDREN_PROPS_KEYS: (keyof TooltipChildrenProps)[] = [
  'elementID',
  'hideDelay',
  'popper',
  'rootID',
  'setElementRef',
  'setTriggerRef',
  'setVisible',
  'visible'
]
const STORE_KEYS: (keyof TooltipProps & keyof TooltipStore)[] = ['hideDelay']

/**
 * A tooltip is a popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it. It typically appears after a small delay and disappears when Escape is pressed or on mouse out.
 */
export const Root = forwardRef((props: TooltipProps, ref: ForwardedRef<HTMLDivElement>) => {
  const store = useComponentStore(TooltipStore, props, STORE_KEYS)
  const popper = usePopper(store.triggerRef.current, store.elementRef.current, props.popperOptions)

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    store.handleKeyboardInteractions(event)
    props.onKeyDown && props.onKeyDown(event)
  }

  useEffect(() => {
    popper.update && popper.update()
  }, [store.visible])

  return (
    <div {...ObjectUtils.omit(props, TOOLTIP_PROPS_KEYS)} id={store.id} onKeyDown={onKeyDown} ref={ref}>
      {props.children({
        elementID: store.elementID,
        hideDelay: store.hideDelay,
        popper: popper,
        rootID: store.id,
        setElementRef: store.setElementRef,
        setTriggerRef: store.setTriggerRef,
        setVisible: store.setVisible,
        visible: store.visible
      })}
    </div>
  )
})

export function Element(props: TooltipElementProps) {
  const ref = useSafeRef('div')

  const onMouseEnter = (event: MouseEvent<HTMLDivElement>) => {
    Debounce.handle(props.rootID, noop, 0)
    props.onMouseEnter && props.onMouseEnter(event)
  }

  const onMouseLeave = (event: MouseEvent<HTMLDivElement>) => {
    props.setVisible(false)
    props.onMouseLeave && props.onMouseLeave(event)
  }

  useEffect(() => props.setElementRef(ref), [])

  return (
    <div
      {...props.popper.attributes.popper}
      {...ObjectUtils.omit(props, TOOLTIP_CHILDREN_PROPS_KEYS)}
      id={props.elementID}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      ref={ref}
      style={{ ...props.style, ...props.popper.styles.popper }}
    />
  )
}

export function Trigger(props: TooltipTriggerProps) {
  const id = useID(ComponentName.TOOLTIP_TRIGGER, props.id)
  const ref = useSafeRef('div')

  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    props.setVisible(false)
    props.onBlur && props.onBlur(event)
  }

  const onFocus = (event: FocusEvent<HTMLDivElement>) => {
    props.setVisible(true)
    props.onFocus && props.onFocus(event)
  }

  const onMouseEnter = (event: MouseEvent<HTMLDivElement>) => {
    props.setVisible(true)
    props.onMouseEnter && props.onMouseEnter(event)
  }

  const onMouseLeave = (event: MouseEvent<HTMLDivElement>) => {
    Debounce.handle(props.rootID, () => props.setVisible(false), props.hideDelay || 0)
    props.onMouseLeave && props.onMouseLeave(event)
  }

  useEffect(() => props.setTriggerRef(ref), [])

  return (
    <div
      {...ObjectUtils.omit(props, TOOLTIP_CHILDREN_PROPS_KEYS)}
      aria-describedby={props.elementID}
      id={id}
      onBlur={onBlur}
      onFocus={onFocus}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      ref={ref}
      tabIndex={typeof props.tabIndex === 'number' ? props.tabIndex : 0}
    />
  )
}

export const AriaTooltip = {
  Root,
  Element,
  Trigger
}
