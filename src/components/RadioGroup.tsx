import { ObjectUtils } from '@queelag/core'
import { COMPONENT_STORE_KEYS, useComponentStore, useID, useSafeRef } from '@queelag/react-core'
import React, { KeyboardEvent, MouseEvent, useEffect } from 'react'
import { ComponentName } from '../definitions/enums'
import { RadioGroupChildrenProps, RadioGroupItemProps, RadioGroupProps } from '../definitions/props'
import RadioGroupStore from '../stores/radio.group.store'

const ROOT_CHILDREN_PROPS_KEYS: (keyof RadioGroupChildrenProps)[] = ['deleteItemRef', 'isItemChecked', 'setCheckedItemIndex', 'setItemRef']

const STORE_KEYS: (keyof RadioGroupProps & keyof RadioGroupStore)[] = [...COMPONENT_STORE_KEYS, 'checkedItemIndex', 'onCheckItem']

/**
 * A radio group is a set of checkable buttons, known as radio buttons, where no more than one of the buttons can be checked at a time. Some implementations may initialize the set with all buttons in the unchecked state in order to force the user to check one of the buttons before moving past a certain point in the workflow.
 */
export function Root(props: RadioGroupProps) {
  const store = useComponentStore(RadioGroupStore, props, STORE_KEYS)

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    store.handleKeyboardInteractions(event)
    props.onKeyDown && props.onKeyDown(event)
  }

  return (
    <div {...props} onKeyDown={onKeyDown} role='radiogroup'>
      {props.children({
        checkedItemIndex: store.checkedItemIndex,
        deleteItemRef: store.deleteItemRef,
        isItemChecked: store.isItemChecked,
        setCheckedItemIndex: store.setCheckedItemIndex,
        setItemRef: store.setItemRef
      })}
    </div>
  )
}

export function Item(props: RadioGroupItemProps) {
  const id = useID(ComponentName.RADIO_GROUP_ITEM, props.id)
  const ref = useSafeRef('div')

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    props.setCheckedItemIndex(props.index)
    props.onClick && props.onClick(event)
  }

  useEffect(() => {
    props.setItemRef(props.index, ref)
    return () => props.deleteItemRef(props.index)
  }, [])

  return (
    <div
      {...ObjectUtils.omit(props, [...ROOT_CHILDREN_PROPS_KEYS, 'index'])}
      aria-checked={props.isItemChecked(props.index)}
      id={id}
      onClick={onClick}
      ref={ref}
      role='radio'
      tabIndex={props.checkedItemIndex < 0 || props.isItemChecked(props.index) ? 0 : -1}
    />
  )
}

export const AriaRadioGroup = {
  Root,
  Item
}
