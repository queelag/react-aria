import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { Dialog } from '../../src/components/Dialog'
import { FocusTrap } from '../../src/components/FocusTrap'
import { ComponentName, Key, LoggerLevel } from '../../src/definitions/enums'
import { DialogChildrenProps } from '../../src/definitions/props'
import Logger from '../../src/modules/logger'

describe('Dialog', () => {
  let onClose: () => void, root: HTMLElement, description: HTMLElement, title: HTMLElement, buttons: [HTMLElement, HTMLElement]

  beforeAll(() => {
    Logger.level = LoggerLevel.ERROR
  })

  beforeEach(() => {
    onClose = jest.fn(() => null)
    render(
      <Dialog.Root data-testid={ComponentName.DIALOG} onClose={onClose} hasDescription hasTitle>
        {(props: DialogChildrenProps) => (
          <FocusTrap.Root autoFocus>
            <Dialog.Title {...props} data-testid={ComponentName.DIALOG_TITLE}>
              Title
            </Dialog.Title>
            <Dialog.Description {...props} data-testid={ComponentName.DIALOG_DESCRIPTION}>
              Description
            </Dialog.Description>
            <button onClick={onClose} type='button'>
              No
            </button>
            <button onClick={onClose} type='button'>
              Yes
            </button>
          </FocusTrap.Root>
        )}
      </Dialog.Root>
    )
    root = screen.getByTestId(ComponentName.DIALOG)
    description = screen.getByTestId(ComponentName.DIALOG_DESCRIPTION)
    title = screen.getByTestId(ComponentName.DIALOG_TITLE)
    buttons = [screen.getByText('No'), screen.getByText('Yes')]
  })

  it('has the dialog role', () => {
    expect(root.getAttribute('role')).toBe('dialog')
  })

  it('has the correct aria attributes', () => {
    expect(root.getAttribute('aria-describedby')).toBe(description.id)
    expect(root.getAttribute('aria-labelledby')).toBe(title.id)
  })

  it('auto focuses the no button', () => {
    expect(buttons[0]).toBe(document.activeElement)
  })

  it('has its focus trapped', () => {
    userEvent.tab()
    expect(buttons[1]).toBe(document.activeElement)
    userEvent.tab({ shift: true })
    expect(buttons[0]).toBe(document.activeElement)
    userEvent.tab({ shift: true })
    expect(buttons[1]).toBe(document.activeElement)
    userEvent.tab()
    expect(buttons[0]).toBe(document.activeElement)
    userEvent.tab()
    expect(buttons[1]).toBe(document.activeElement)
    userEvent.tab()
    expect(buttons[0]).toBe(document.activeElement)
  })

  it('handles the keyboard interactions', () => {
    fireEvent.keyDown(root, { key: Key.ESCAPE })
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
