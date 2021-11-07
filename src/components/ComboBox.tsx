import { ObjectUtils } from '@queelag/core'
import { useComponentStore, useID, useSafeRef } from '@queelag/react-core'
import React, { ChangeEvent, FocusEvent, ForwardedRef, forwardRef, KeyboardEvent, MouseEvent, useEffect } from 'react'
import { usePopper } from 'react-popper'
import { ComponentName } from '../definitions/enums'
import {
  ComboBoxButtonProps,
  ComboBoxChildrenProps,
  ComboBoxGroupProps,
  ComboBoxInputProps,
  ComboBoxListBoxItemProps,
  ComboBoxListBoxProps,
  ComboBoxProps
} from '../definitions/props'
import { ComponentLogger } from '../loggers/component.logger'
import { ComboBoxStore } from '../stores/combo.box.store'

const ROOT_PROPS_KEYS: (keyof ComboBoxProps)[] = [
  'autocomplete',
  'getStore',
  'listBoxLabel',
  'onCollapse',
  'onEscape',
  'onSelectListBoxItem',
  'popperOptions',
  'selectedListBoxItemIndexes'
]
const ROOT_CHILDREN_PROPS_KEYS: (keyof ComboBoxChildrenProps)[] = [
  'autocomplete',
  'deleteListBoxItemRef',
  'expanded',
  'focusedListBoxItemID',
  'isListBoxItemFocused',
  'isListBoxItemSelected',
  'listBoxID',
  'listBoxLabel',
  'popper',
  'setExpanded',
  'setGroupRef',
  'setInputRef',
  'setListBoxItemRef',
  'setListBoxRef',
  'setSelectedListBoxItemIndex'
]
const STORE_KEYS: (keyof ComboBoxProps & keyof ComboBoxStore)[] = ['onCollapse', 'onSelectListBoxItem', 'selectedListBoxItemIndexes']

/**
 * A combobox is an input widget with an associated popup that enables users to select a value for the combobox from a collection of possible values. In some implementations, the popup presents allowed values, while in other implementations, the popup presents suggested values, and users may either select one of the suggestions or type a value.
 */
export const Root = forwardRef((props: ComboBoxProps, ref: ForwardedRef<HTMLDivElement>) => {
  const store = useComponentStore(ComboBoxStore, props, STORE_KEYS)
  const popper = usePopper(store.groupRef.current, store.listBoxRef.current, props.popperOptions)

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    store.handleKeyboardInteractions(event, props.onEscape)
    props.onKeyDown && props.onKeyDown(event)
  }

  useEffect(() => {
    store.listBoxRef.current.scrollTo({ behavior: 'smooth', top: store.focusedListBoxItemRef.current.offsetTop })
    ComponentLogger.verbose(store.id, 'useEffect', 'The focused listbox item has been scrolled into view.')
  }, [store.listBoxRef.current])

  return (
    <div {...ObjectUtils.omit(props, ROOT_PROPS_KEYS)} id={store.id} onKeyDown={onKeyDown} ref={ref} style={{ position: 'relative', ...props.style }}>
      {props.children({
        autocomplete: props.autocomplete,
        deleteListBoxItemRef: store.deleteListBoxItemRef,
        expanded: store.expanded,
        focusedListBoxItemID: store.focusedListBoxItemID,
        isListBoxItemFocused: store.isListBoxItemFocused,
        isListBoxItemSelected: store.isListBoxItemSelected,
        listBoxID: store.listBoxID,
        listBoxLabel: props.listBoxLabel,
        popper,
        setExpanded: store.setExpanded,
        setGroupRef: store.setGroupRef,
        setInputRef: store.setInputRef,
        setListBoxItemRef: store.setListBoxItemRef,
        setListBoxRef: store.setListBoxRef,
        setSelectedListBoxItemIndex: store.setSelectedListBoxItemIndex
      })}
    </div>
  )
})

export function Group(props: ComboBoxGroupProps) {
  const id = useID(ComponentName.COMBO_BOX_GROUP, props.id)
  const ref = useSafeRef('div')

  useEffect(() => props.setGroupRef(ref), [])

  return <div {...ObjectUtils.omit(props, ROOT_CHILDREN_PROPS_KEYS)} id={id} ref={ref} />
}

export function Input(props: ComboBoxInputProps) {
  const id = useID(ComponentName.COMBO_BOX_INPUT, props.id)
  const ref = useSafeRef('input')

  const onBlur = (event: FocusEvent<HTMLInputElement>) => {
    props.setExpanded(false, id, 'onBlur')
    props.onBlur && props.onBlur(event)
  }

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    props.setExpanded(true, id, 'onChange')
    props.onChange && props.onChange(event)
  }

  const onClick = () => {
    props.setExpanded(!props.expanded, id, 'onClick')
  }

  useEffect(() => props.setInputRef(ref), [])

  return (
    <input
      {...ObjectUtils.omit(props, ROOT_CHILDREN_PROPS_KEYS)}
      aria-activedescendant={props.focusedListBoxItemID}
      aria-autocomplete={props.autocomplete ? 'list' : 'none'}
      aria-controls={props.listBoxID}
      aria-expanded={props.expanded}
      id={id}
      onBlur={onBlur}
      onChange={onChange}
      onClick={onClick}
      ref={ref}
      role='combobox'
      type='text'
      aria-haspopup
    />
  )
}

export const Button = forwardRef((props: ComboBoxButtonProps, ref: ForwardedRef<HTMLButtonElement>) => {
  const id = useID(ComponentName.COMBO_BOX_BUTTON, props.id)

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    ComponentLogger.verbose(id, 'onClick', `The event propagation has been stopped.`)

    props.setExpanded(!props.expanded, id, 'onClick')
    props.onClick && props.onClick(event)
  }

  const onMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    props.onMouseDown && props.onMouseDown(event)
  }

  return (
    <button
      {...ObjectUtils.omit(props, ROOT_CHILDREN_PROPS_KEYS)}
      aria-label='Open'
      id={id}
      onClick={onClick}
      onMouseDown={onMouseDown}
      ref={ref}
      tabIndex={-1}
      type='button'
    />
  )
})

export function ListBox(props: ComboBoxListBoxProps) {
  const ref = useSafeRef('ul')

  useEffect(() => props.setListBoxRef(ref), [])

  return (
    <ul
      {...props.popper.attributes.popper}
      {...ObjectUtils.omit(props, ROOT_CHILDREN_PROPS_KEYS)}
      aria-label={props.listBoxLabel}
      id={props.listBoxID}
      ref={ref}
      role='listbox'
      style={{ ...props.style, ...props.popper.styles.popper }}
      tabIndex={-1}
    />
  )
}

export function ListBoxItem(props: ComboBoxListBoxItemProps) {
  const id = useID(ComponentName.COMBO_BOX_LIST_BOX_ITEM, props.id)
  const ref = useSafeRef('li')

  const onClick = (event: MouseEvent<HTMLLIElement>) => {
    props.setSelectedListBoxItemIndex(props.index, !props.isListBoxItemSelected(props.index))
    props.setExpanded(false, id, 'onClick')
    props.onClick && props.onClick(event)
  }

  const onMouseDown = (event: MouseEvent<HTMLLIElement>) => {
    event.preventDefault()
    props.onMouseDown && props.onMouseDown(event)
  }

  useEffect(() => {
    props.setListBoxItemRef(props.index, ref)
    return () => props.deleteListBoxItemRef(props.index)
  }, [])

  return (
    <li
      {...ObjectUtils.omit(props, [...ROOT_CHILDREN_PROPS_KEYS, 'index'])}
      aria-selected={props.isListBoxItemSelected(props.index)}
      id={id}
      onClick={onClick}
      onMouseDown={onMouseDown}
      ref={ref}
      role='option'
      style={{ cursor: 'pointer', ...props.style }}
    />
  )
}

export const AriaComboBox = {
  Root,
  Group,
  Input,
  Button,
  ListBox,
  ListBoxItem
}
