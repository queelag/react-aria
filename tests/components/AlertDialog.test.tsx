import { fireEvent, render, RenderResult, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { AlertDialog, AlertDialogDescription, AlertDialogTitle } from '../../src/components/AlertDialog'
import { FocusTrap } from '../../src/components/FocusTrap'
import { ComponentName, Key, LoggerLevel } from '../../src/definitions/enums'
import { AlertDialogChildrenProps } from '../../src/definitions/props'
import Logger from '../../src/modules/logger'

describe('AlertDialog', () => {
  let onClose: () => void, body: RenderResult, root: HTMLElement, description: HTMLElement, title: HTMLElement, buttons: [HTMLElement, HTMLElement]

  beforeAll(() => {
    Logger.level = LoggerLevel.ERROR
  })

  beforeEach(() => {
    onClose = jest.fn(() => null)
    body = render(
      <AlertDialog data-testid={ComponentName.ALERT_DIALOG} onClose={onClose}>
        {(props: AlertDialogChildrenProps) => (
          <FocusTrap autoFocus>
            <AlertDialogTitle {...props} data-testid={ComponentName.ALERT_DIALOG_TITLE}>
              Title
            </AlertDialogTitle>
            <AlertDialogDescription {...props} data-testid={ComponentName.ALERT_DIALOG_DESCRIPTION}>
              Description
            </AlertDialogDescription>
            <button onClick={onClose} type='button'>
              No
            </button>
            <button onClick={onClose} type='button'>
              Yes
            </button>
          </FocusTrap>
        )}
      </AlertDialog>
    )
    root = screen.getByTestId(ComponentName.ALERT_DIALOG)
    description = screen.getByTestId(ComponentName.ALERT_DIALOG_DESCRIPTION)
    title = screen.getByTestId(ComponentName.ALERT_DIALOG_TITLE)
    buttons = [screen.getByText('No'), screen.getByText('Yes')]
  })

  it('has the alertdialog role', () => {
    expect(root.getAttribute('role')).toBe('alertdialog')
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
