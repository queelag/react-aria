import { render, screen } from '@testing-library/react'
import { Chance } from 'chance'
import React from 'react'
import { Alert } from '../../src/components/Alert'
import { ComponentName, LoggerLevel } from '../../src/definitions/enums'
import Logger from '../../src/modules/logger'

describe('Alert', () => {
  let text: string, root: Element

  beforeAll(() => {
    Logger.level = LoggerLevel.ERROR
  })

  beforeEach(() => {
    text = Chance().paragraph()
    render(<Alert.Root data-testid={ComponentName.ALERT}>{text}</Alert.Root>)
    root = screen.getByTestId(ComponentName.ALERT)
  })

  it('has role alert', () => {
    expect(root.getAttribute('role')).toBe('alert')
  })

  it('contains the text', () => {
    expect(root.innerHTML).toBe(text)
  })
})
