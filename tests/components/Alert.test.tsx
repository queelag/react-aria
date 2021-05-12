import { render, RenderResult, screen } from '@testing-library/react'
import { Chance } from 'chance'
import React from 'react'
import { Alert } from '../../src/components/Alert'
import { ComponentName, LoggerLevel } from '../../src/definitions/enums'
import Logger from '../../src/modules/logger'

describe('Alert', () => {
  let text: string, body: RenderResult, root: Element

  beforeAll(() => {
    Logger.level = LoggerLevel.ERROR
  })

  beforeEach(() => {
    text = Chance().paragraph()
    body = render(<Alert data-testid={ComponentName.ALERT}>{text}</Alert>)
    root = screen.getByTestId(ComponentName.ALERT)
  })

  it('has role alert', () => {
    expect(root.getAttribute('role')).toBe('alert')
  })

  it('contains the text', () => {
    expect(root.innerHTML).toBe(text)
  })
})
