import React from 'react'
import { TabberProps } from '../definitions/props'

function Root(props: TabberProps) {
  return <div aria-label={props.label} role='tablist'></div>
}

export { Root }
